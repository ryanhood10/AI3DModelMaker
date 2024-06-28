import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import LumaLogo from '../assets/LumaAILogo.png'

function AnotherPage() {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  // const [status, setStatus] = useState('');
  const [credits, setCredits] = useState('');
  const [slugs, setSlugs] = useState(JSON.parse(localStorage.getItem('slugs')) || []);
  const [captures, setCaptures] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState(localStorage.getItem('api_key') || '');

  const capturesPerPage = 9;

  useEffect(() => {
    localStorage.setItem('slugs', JSON.stringify(slugs));
  }, [slugs]);

  useEffect(() => {
    localStorage.setItem('api_key', apiKey);
  }, [apiKey]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleApiKeyChange = (e) => {
    setApiKey(e.target.value);
  };

  const handleCreateCapture = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:5000/create_capture', {
        title,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `luma-api-key=${apiKey}`,
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error creating capture:', error);
      setMessage('Failed to create capture.');
    }
  };

  const handleUpload = async () => {
    setLoading(true); // Start loading
    try {
      const captureData = await handleCreateCapture();
      if (!captureData) {
        setLoading(false); // Stop loading if creation failed
        return;
      }

      const { upload_url, slug } = captureData;
      setSlugs([...slugs, slug]);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_url', upload_url);

      const response = await axios.post('http://127.0.0.1:5000/upload_file', formData);
      setMessage(response.data.message);

      if (slug) {
        await triggerCapture(slug);
      }

      setLoading(false); // Stop loading after success
      setMessage('Successfully Uploaded to AI. Please wait while we construct your 3D model.');
    } catch (error) {
      console.error('Error during file upload:', error);
      setMessage('File upload failed.');
      setLoading(false); // Stop loading if upload failed
    }
  };

  const triggerCapture = async (slug) => {
    try {
      const response = await axios.post(`http://127.0.0.1:5000/trigger_capture/${slug}`, {}, {
        headers: { 'Authorization': `luma-api-key=${apiKey}` },
      });
      console.log(response.data);
      setMessage(`Capture triggered: ${JSON.stringify(response.data)}`);
    } catch (error) {
      console.error('Error triggering capture:', error);
      setMessage('Failed to trigger capture.');
    }
  };

  // const checkStatus = async (slug) => {
  //   try {
  //     const response = await axios.get(`http://127.0.0.1:5000/status/${slug}`, {
  //       headers: { 'Authorization': `luma-api-key=${apiKey}` },
  //     });
  //     setStatus(JSON.stringify(response.data));
  //   } catch (error) {
  //     console.error('Error during status check:', error);
  //     setStatus('Failed to check status.');
  //   }
  // };

  const downloadCapture = async (slug) => {
    try {
      const response = await axios({
        url: `http://127.0.0.1:5000/download_capture/${slug}`,
        method: 'GET',
        responseType: 'blob', // Important
        headers: { 'Authorization': `luma-api-key=${apiKey}` },
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;

      // Extract file name from content-disposition header or use slug with .glb extension as default
      const contentDisposition = response.headers['content-disposition'];
      let fileName = slug + '.glb';
      if (contentDisposition) {
        const fileNameMatch = contentDisposition.match(/filename="(.+)"/);
        if (fileNameMatch.length === 2) {
          fileName = fileNameMatch[1];
        }
      }
      link.setAttribute('download', fileName);

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    } catch (error) {
      console.error('Error downloading capture:', error);
      setMessage('Failed to download capture.');
    }
  };

  const checkCredits = async () => {
    try {
      const response = await axios.get('https://webapp.engineeringlumalabs.com/api/v2/capture/credits', {
        headers: { 'Authorization': `luma-api-key=${apiKey}` },
      });
      console.log('API response:', response.data);
      setCredits(`Credits left: ${response.data.remaining}`);
    } catch (error) {
      console.error('Error checking credits:', error);
      setCredits('Failed to check credits.');
    }
  };

  const getAllCaptures = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/get_all_captures', {
        headers: { 'Authorization': `luma-api-key=${apiKey}` },
      });
      setCaptures(response.data.captures);
    } catch (error) {
      console.error('Error fetching captures:', error);
      setMessage('Failed to fetch captures.');
    }
  };

  const indexOfLastCapture = currentPage * capturesPerPage;
  const indexOfFirstCapture = indexOfLastCapture - capturesPerPage;
  const currentCaptures = captures.slice(indexOfFirstCapture, indexOfLastCapture);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-8 text-center">Upload a Video</h1>
      <div className="flex flex-col items-center">
        <input type="file" onChange={handleFileChange} className="mb-4 p-2 border border-gray-700 rounded bg-gray-800 text-white" />
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={handleTitleChange}
          className="mb-4 p-2 border border-gray-700 rounded bg-gray-800 text-white"
        />
        <input
          type="text"
          placeholder="Enter API Key"
          value={apiKey}
          onChange={handleApiKeyChange}
          className="mb-4 p-2 border border-gray-700 rounded bg-gray-800 text-white"
        />
 <p className='flex p-2 text-white items-center'>
        You can obtain an Api Key from 
        <a href='https://lumalabs.ai/' className='flex text-blue-500 hover:text-blue-700 items-center ml-1'>
          Luma AI 
          <img className="h-4 ml-1" src={LumaLogo} alt="Luma Logo"/>
        </a>
      </p>    
          <button
          onClick={() => localStorage.setItem('api_key', apiKey)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-2"
        >
          {localStorage.getItem('api_key') ? 'Change Key' : 'Save Key'}
        </button>
        {localStorage.getItem('api_key') && (
          <button
            onClick={() => {
              localStorage.removeItem('api_key');
              setApiKey('');
            }}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mb-2"
          >
            Delete Key
          </button>
        )}
        <button onClick={handleUpload} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-2">
          Upload
        </button>
        {loading && (
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full">
              <div className="bg-blue-500 text-xs font-medium text-blue-100 text-center p-1 leading-none rounded-full" style={{ width: '100%' }}>
                Uploading...
              </div>
            </div>
          </div>
        )}
        <p className="mt-4 text-center">{message}</p>
        {/* <p className="mt-4 text-center">{status}</p> */}
        <p className="mt-4 text-center">{credits}</p>
        <br />
        <button onClick={checkCredits} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-2">
          Check Credits
        </button>
        <button onClick={getAllCaptures} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mb-2">
          Get All Captures
        </button>
        {captures.length > 0 && (
          <div className="mt-4 w-full">
            <h2 className="text-2xl font-bold mb-4 text-center">All Captures</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentCaptures.map((capture, index) => (
                <div key={index} className="bg-gray-800 p-4 rounded-lg shadow-lg">
                  <h3 className="text-xl font-bold text-white">{capture.title}</h3>
                  <p className="text-gray-400"><strong>Slug:</strong> {capture.slug}</p>
                  <p className="text-gray-400"><strong>Status:</strong> {capture.status}</p>
                  <p className="text-gray-400"><strong>Date:</strong> {new Date(capture.date).toLocaleString()}</p>
                  <p className="text-gray-400"><strong>Type:</strong> {capture.type}</p>
                  {capture.latestRun && (
                    <div className="mt-2">
                      <p className="text-gray-400"><strong>Latest Run Status:</strong> {capture.latestRun.status}</p>
                      <p className="text-gray-400"><strong>Progress:</strong> {capture.latestRun.progress}%</p>
                      <p className="text-gray-400"><strong>Current Stage:</strong> {capture.latestRun.currentStage}</p>
                    </div>
                  )}
                  <button onClick={() => downloadCapture(capture.slug)} className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded mt-4">
                    Download
                  </button>
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-4">
              {Array.from({ length: Math.ceil(captures.length / capturesPerPage) }, (_, index) => (
                <button
                  key={index}
                  onClick={() => paginate(index + 1)}
                  className={`mx-1 px-3 py-1 rounded ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-300'}`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        )}
        {/* {slugs.length > 0 && (
          <>
            {slugs.map((slug, index) => (
              <div key={index} className="flex flex-col items-center mt-4">
                <button onClick={() => checkStatus(slug)} className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded mb-2">
                  Check Status ({slug})
                </button>
                <button onClick={() => downloadCapture(slug)} className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded mb-2">
                  Download Capture ({slug})
                </button>
              </div>
            ))}
          </>
        )} */}
      </div>
      <div className="mt-8 flex flex-col items-center">
        <button className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mb-2">
          <Link to="/">Main Page</Link>
        </button>
      </div>
    </div>
  );
}

export default AnotherPage;
