import React from 'react';
import Logo from '../assets/ICON.png';
import {Link} from 'react-router-dom';


const Header = () => {
  return (
    <header className="bg-gray-900 text-gray-300 py-4 sticky top-0 z-50">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
        <div className="flex-1 text-center md:text-left mb-4 md:mb-0">
        <Link to="/" className="hover:cursor-pointer ">
          <h1 className="text-3xl font-bold text-cyan-500 hover:text-cyan-900"><span className='font-custom text-4xl'>3</span>D Model Maker</h1>
          </Link>
          <p className="text-sm text-gray-400">by Creative Coloring</p>
        </div>
        <div className="flex flex-col items-center md:justify-end">
          <a href="https://creativecoloring.io/" target="_blank" rel="noopener noreferrer">
            <img
              src={Logo}
              alt="Creative Coloring Logo"
              className="h-16"
            />
          </a>
          <a href="https://creativecoloring.io/" target="_blank" rel="noopener noreferrer" className="mt-2 text-cyan-500 hover:text-cyan-300">
            Shop Now
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;
