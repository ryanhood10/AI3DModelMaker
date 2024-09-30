import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp, FaCamera, FaCog, FaImage, FaCogs, FaArrowLeft } from 'react-icons/fa'; // Importing relevant icons
import { Link } from 'react-router-dom';

const sections = [
  {
    title: "Capture Process",
    icon: <FaCamera className="text-cyan-500 mr-2" />,
    content: (
      <ul className="list-disc list-inside space-y-2">
        <li><span className="font-bold text-cyan-400">Capture speed:</span> Move the phone slowly and avoid rapid movements to prevent motion blur.</li>
        <li><span className="font-bold text-cyan-400">Scene coverage:</span> Capture the object or scene from as many unique viewpoints as possible. Move the phone around rather than rotating it from a stationary position.</li>
        <li><span className="font-bold text-cyan-400">Object size:</span> For guided captures, any object that can be easily viewed from all angles is suitable.</li>
        <li><span className="font-bold text-cyan-400">Object distance:</span> Keep the whole object in frame while scanning to provide more information about reflections and shape.</li>
        <li><span className="font-bold text-cyan-400">Object materials:</span> Avoid complex reflections, curved transparent objects, and large textureless surfaces.</li>
        <li><span className="font-bold text-cyan-400">Capture environment light level:</span> Ensure textures are identifiable. Lighting conditions will be baked in.</li>
        <li><span className="font-bold text-cyan-400">Moving objects:</span> Avoid movement in the scene during capture to prevent artifacts.</li>
      </ul>
    ),
  },
  {
    title: "Camera Settings",
    icon: <FaCog className="text-yellow-500 mr-2" />,
    content: (
      <ul className="list-disc list-inside space-y-2">
        <li><span className="font-bold text-yellow-400">Video setting gotchas:</span> Turn off video stabilization and avoid HDR video on iOS.</li>
        <li><span className="font-bold text-yellow-400">Exposure:</span> Use fixed exposure if possible, especially for outdoor scenes with varying lighting.</li>
      </ul>
    ),
  },
  {
    title: "Capture Formats",
    icon: <FaImage className="text-green-500 mr-2" />,
    content: (
      <ul className="list-disc list-inside space-y-2">
        <li><span className="font-bold text-green-400">Image zips vs. videos:</span> Upload zips of photos for higher quality. Raw and HDR images are supported.</li>
        <li><span className="font-bold text-green-400">High-resolution images:</span> Avoid using >4k images.</li>
        <li><span className="font-bold text-green-400">360 camera and fisheye lens captures:</span> Use specific settings for fisheye or dual fisheye captures.</li>
      </ul>
    ),
  },
  {
    title: "Advanced Settings",
    icon: <FaCogs className="text-purple-500 mr-2" />,
    content: (
      <ul className="list-disc list-inside space-y-2">
        <li><span className="font-bold text-purple-400">Remove humans:</span> Removes all humans in the scene, useful for 360 captures and normal videos.</li>
        <li><span className="font-bold text-purple-400">Custom pose:</span> Provide custom poses with specific parameters and a structured zip file.</li>
      </ul>
    ),
  },
];

const BestPractices = () => {
  const [openSection, setOpenSection] = useState(null);

  const toggleSection = (index) => {
    setOpenSection(openSection === index ? null : index);
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white py-12 px-6 relative">
      {/* Homepage Link with Arrow */}
      <Link
        to="/"
        className="absolute top-4 left-52 flex items-center text-cyan-500 hover:text-cyan-300 transition duration-300 text-lg font-bold"
      >
        <FaArrowLeft className="mr-2" />
        Homepage
      </Link>

      <div className="max-w-4xl mx-auto space-y-6">
        {sections.map((section, index) => (
          <div key={index} className="mb-4">
            {/* Section Title with Icon and Chevron */}
            <div
              className={`flex justify-between items-center cursor-pointer bg-gray-800 px-4 py-3 rounded-lg hover:bg-gray-700 transition duration-300 ${
                openSection === index ? 'border-l-4 border-cyan-500' : ''
              }`}
              onClick={() => toggleSection(index)}
            >
              <div className="flex items-center">
                {section.icon}
                <h2 className="text-lg font-semibold">{section.title}</h2>
              </div>
              <div>
                {openSection === index ? (
                  <FaChevronUp className="text-cyan-500" />
                ) : (
                  <FaChevronDown className="text-cyan-500" />
                )}
              </div>
            </div>
            {/* Section Content */}
            {openSection === index && (
              <div className="mt-2 bg-gray-800 p-4 rounded-lg shadow-lg transition-all duration-500 ease-in-out transform">
                {section.content}
              </div>
            )}
          </div>
        ))}
        <div className="text-center mt-8">
          <a
            href="https://docs.lumalabs.ai/MCrGAEukR4orR9"
            className="text-cyan-500 underline hover:text-cyan-400 transition duration-300"
            target="_blank"
            rel="noopener noreferrer"
          >
            View the full documentation here
          </a>
        </div>
      </div>
    </div>
  );
};

export default BestPractices;
