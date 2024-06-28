import React, { useState } from 'react';

const sections = [
  {
    title: "Capture Process",
    content: (
      <ul className="list-disc list-inside">
        <li><b>Capture speed:</b> Move the phone slowly and avoid rapid movements to prevent motion blur.</li>
        <li><b>Scene coverage:</b> Capture the object or scene from as many unique viewpoints as possible. Move the phone around rather than rotating it from a stationary position. Use guided capture mode for better results.</li>
        <li><b>Object size:</b> For guided captures, any object that can be easily viewed from all angles is suitable. For free-form captures, larger objects may be challenging to capture cleanly.</li>
        <li><b>Object distance:</b> Keep the whole object in frame while scanning to provide more information about reflections and shape.</li>
        <li><b>Object materials:</b> Avoid complex reflections, curved transparent objects, and large textureless surfaces. Most other materials work well.</li>
        <li><b>Capture environment light level:</b> Ensure textures are identifiable. Lighting conditions will be baked in.</li>
        <li><b>Moving objects:</b> Avoid movement in the scene during capture to prevent artifacts.</li>
      </ul>
    ),
  },
  {
    title: "Camera Settings",
    content: (
      <ul className="list-disc list-inside">
        <li><b>Video setting gotchas:</b> Turn off video stabilization and avoid HDR video on iOS.</li>
        <li><b>Exposure:</b> Use fixed exposure if possible, especially for outdoor scenes with varying lighting. Raw images can be used for higher quality.</li>
      </ul>
    ),
  },
  {
    title: "Capture Formats",
    content: (
      <ul className="list-disc list-inside">
        <li><b>Image zips vs. videos:</b> Upload zips of photos for higher quality. Raw and HDR images are supported.</li>
        <li><b>High-resolution images:</b> Avoid using >4k images.</li>
        <li><b>360 camera and fisheye lens captures:</b> Use specific settings for fisheye or dual fisheye captures. Follow guidelines for naming and uploading.</li>
      </ul>
    ),
  },
  {
    title: "Advanced Settings",
    content: (
      <ul className="list-disc list-inside">
        <li><b>Remove humans:</b> Removes all humans in the scene, useful for 360 captures and normal videos.</li>
        <li><b>Custom pose:</b> Provide custom poses with specific parameters and a structured zip file.</li>
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
    <div className="max-w-4xl mx-auto p-4">
      {sections.map((section, index) => (
        <div key={index} className="mb-4">
          <h2
            className="text-xl font-bold cursor-pointer"
            onClick={() => toggleSection(index)}
          >
            {section.title}
          </h2>
          {openSection === index && (
            <div className="mt-2 bg-gray-100 p-4 rounded-lg shadow">
              {section.content}
            </div>
          )}
        </div>
      ))}
       <div className="text-center mt-8">
        <a
          href="https://docs.lumalabs.ai/MCrGAEukR4orR9"
          className="text-blue-500 underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          View the full documentation here
        </a>
      </div>
    </div>
  );
};

export default BestPractices;
