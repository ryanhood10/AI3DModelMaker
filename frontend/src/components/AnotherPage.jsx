import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaKey, FaArrowLeft, FaEyeSlash, FaEye } from 'react-icons/fa'; // Importing relevant icons
import { Link } from 'react-router-dom';import LumaLogo from '../assets/LumaAILogo.png'

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
  const [showApiKey, setShowApiKey] = useState(false); // New state for toggling API key visibility

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
      // const response = await axios.post('http://127.0.0.1:5000/create_capture', {
        const response = await axios.post('https://ai-3d-model-maker-6bb8a109b792.herokuapp.com/create_capture', {

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

      // const response = await axios.post('http://127.0.0.1:5000/upload_file', formData);
      const response = await axios.post('https://ai-3d-model-maker-6bb8a109b792.herokuapp.com/upload_file', formData);

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
      // const response = await axios.post(`http://127.0.0.1:5000/trigger_capture/${slug}`, {}, {
        const response = await axios.post(`https://ai-3d-model-maker-6bb8a109b792.herokuapp.com/trigger_capture/${slug}`, {}, {
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
            // url: `http://127.0.0.1:5000/download_capture/${slug}`,
            url: `https://ai-3d-model-maker-6bb8a109b792.herokuapp.com/download_capture/${slug}`,
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
            if (fileNameMatch && fileNameMatch.length === 2) {
                fileName = fileNameMatch[1];
            }
        }
        link.setAttribute('download', fileName);

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

    } catch (error) {
        console.error('Error downloading capture:', error);
        if (error.response) {
            console.error('Error response data:', error.response.data);
            console.error('Error response status:', error.response.status);
            console.error('Error response headers:', error.response.headers);
        }
        setMessage('Failed to download capture.');
    }
};


  const checkCredits = async () => {
    try {
      // const response = await axios.get('https://webapp.engineeringlumalabs.com/api/v2/capture/credits', {
        const response = await axios.get('https://ai-3d-model-maker-6bb8a109b792.herokuapp.com/proxy/credits', {
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
      // const response = await axios.get('http://127.0.0.1:5000/get_all_captures', {
        const response = await axios.get('https://ai-3d-model-maker-6bb8a109b792.herokuapp.com/get_all_captures', {
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
    <div className="bg-gray-900 min-h-screen py-12 relative">
        {/* Homepage Link with Arrow */}
        <Link
  to="/"
  className="absolute top-4 left-16 md:left-24 xl:left-36 lg:left-52 flex items-center text-cyan-500 hover:text-cyan-300 transition duration-300 text-lg font-bold"
>
  <FaArrowLeft className="mr-2" />
  Homepage
</Link>
      <div className="max-w-4xl mx-auto bg-gray-800 p-8 md:p-16 rounded-lg shadow-xl relative">
        {/* Header */}
        <h1 className="text-4xl font-bold mb-8 text-center text-white">Upload a Video</h1>

        {/* Upload Form */}
        <div className="flex flex-col items-center space-y-6">
          <input
            type="file"
            onChange={handleFileChange}
            className="w-full md:w-2/3 p-2 border border-gray-600 rounded bg-gray-700 text-white"
          />
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={handleTitleChange}
            className="w-full md:w-2/3 p-2 border border-gray-600 rounded bg-gray-700 text-white"
          />
        <div className="grid grid-cols-3 gap-4 items-center">
          <div className='flex w-full col-span-2 space-x-2'>
  {/* Input field for API Key */}
  <input
    type={showApiKey ? 'text' : 'password'} // Toggle between text and password based on showApiKey
    placeholder="Enter API Key"
    value={apiKey}
    onChange={handleApiKeyChange}
    className="col-span-2 w-full p-2 border border-gray-600 rounded bg-gray-700 text-white justify-self-start"
  />
  {/* Eye Icon */}
  <button
      onClick={() => setShowApiKey(!showApiKey)} // Toggle visibility
      className="text-gray-400 hover:text-gray-200 transition ml-2 sm:ml-0"
    >
      {showApiKey ? <FaEyeSlash className="h-6 w-6" /> : <FaEye className="h-6 w-6" />} {/* Eye icon */}
    </button>
</div>
  {/* Toggle Eye Icon, Save Key, and Delete Key Buttons */}
  <div className="col-span-1 space-x-2 flex justify-end sm:flex-col sm:space-y-2 sm:space-x-0 sm:justify-start">
    
    {/* Save Key Button */}
    <button
      onClick={() => localStorage.setItem('api_key', apiKey)}
      className="bg-transparent text-blue-500 font-bold py-2 px-4 rounded flex items-center space-x-2 border border-blue-500
      shadow-md shadow-blue-500/50 hover:bg-blue-500 hover:text-white transition-all duration-300"
    >  <FaKey className="h-5 w-5" />
     <span> {localStorage.getItem('api_key') ? 'Change Key' : 'Save Key'}</span>
    </button>

   

  </div>
  <div className="w-full flex justify-end">
  {localStorage.getItem('api_key') && (
    <button
      onClick={() => {
        localStorage.removeItem('api_key');
        setApiKey('');
      }}
      className="bg-transparent text-red-500 font-bold py-2 px-4 rounded flex items-center space-x-2 border border-red-500
      shadow-md shadow-red-500/50 hover:bg-red-500 hover:text-white transition-all duration-300"
    >
      <FaKey className="h-5 w-5" />
      <span>Delete Key</span>
    </button>
  )}
</div>



</div>




        

          {/* Upload Button */}
          <button onClick={handleUpload} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
            Generate 3D Model
          </button>

         {/* Conditional rendering based on loading state */}
{loading ? (
  <div className="w-full max-w-md mt-4">
    <div className="w-full bg-gray-700 rounded-full">
      <div className="bg-blue-500 text-xs font-medium text-blue-100 text-center p-1 leading-none rounded-full" style={{ width: '100%' }}>
        Uploading...
      </div>
    </div>
  </div>
) : (
  <p className="flex p-2 text-white items-center">
    You can obtain an API Key from 
    <a href="https://lumalabs.ai/dream-machine/api/keys" className="text-blue-400 hover:text-blue-600 ml-1 flex items-center">
      Luma AI 
      <img className="h-4 ml-1" src={LumaLogo} alt="Luma Logo" />
    </a>
  </p>
)}


          {/* Status Messages */}
          <p className={`mt-4 text-center ${message.includes('Failed') ? 'text-red-500' : 'text-green-500'}`}>
  {message}
</p>
          <p className="mt-4 text-center text-gray-400">{credits}</p>
          <hr className="border-gray-300 py-2 w-full" />
          {/* Check Credits / Get All Captures */}
          <div className="flex space-x-4 mt-4">
            <button onClick={checkCredits} className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
              Check Credits
            </button>
            <button onClick={getAllCaptures} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded">
              Get All Captures
            </button>
          </div>

          {/* Captures Display */}
          {captures.length > 0 && (
            <div className="w-full mt-8">
              <h2 className="text-2xl font-bold mb-4 text-center text-white">All Captures</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {currentCaptures.map((capture, index) => (
                  <div key={index} className="bg-gray-700 p-4 rounded-lg shadow-lg">
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
                    <button onClick={() => downloadCapture(capture.slug)} className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded mt-4">
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
                    className={`mx-1 px-3 py-1 rounded ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-600 text-gray-300'}`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <hr className="border-gray-300 py-2 mt-8 w-full" />

        {/* Back to Main Page */}
        <div className="mt-8 flex justify-center">
          <Link to="/">
            <button className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
              Home Page
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AnotherPage;
