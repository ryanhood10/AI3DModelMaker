import React, { useState } from 'react';
import axios from 'axios';
import '../App.css';
import { Link } from 'react-router-dom';

function MainPage() {
  const [message, setMessage] = useState('');

  const testApiCall = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/test');
      setMessage(response.data.message);
    } catch (error) {
      console.error('Error making API call', error);
    }
  };

  return (
    <div className="MainPage">
      <header className="MainPage-header">
        <button onClick={testApiCall}>Test API Call</button>
        {message && <p>{message}</p>}
      </header>
      <br/>
      <button><Link to="/another">Other Page</Link></button>

    </div>
  );
}

export default MainPage;
