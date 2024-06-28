import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-gray-300">
      <div className="max-w-3xl p-6 bg-gray-800 rounded-lg shadow-lg text-center">
        
      <h1 className="text-3xl font-bold text-cyan-500"><span className='font-custom text-4xl'>3</span>D Model Maker</h1>
        <p className="mb-4">
          This app requires a 360 video of an object to capture a 3D model. It can be captured with a phone or professionally done. Please follow the best practices for optimal results.
        </p>
        <div className="mb-6">
          <Link to="/another" className="inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Enter the App
          </Link>
        </div>
        <p>
          Please read our{' '}
          <Link to="/BestPractices" className="text-cyan-500 underline">
            Best Practices
          </Link>{' '}
          page for best video capturing practices.
        </p>
      </div>
    </div>
  );
};

export default HomePage;
