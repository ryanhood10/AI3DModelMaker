# AI 3D Model Maker
This application allows users to create 3D models from video captures using Luma AI's 3D Model API. The app is live and can be accessed at https://ai-3d-model-maker-6bb8a109b792.herokuapp.com/

## Tech Stack
Frontend: React
Backend: Flask

## Getting Started
### Run the Live Application
The app is live and can be accessed at https://ai-3d-model-maker-6bb8a109b792.herokuapp.com/

### Run on your own LocalHost
#### Requirements
Python and pip: Ensure Python and pip are installed on your machine.
Node.js and npm: Ensure Node.js and npm are installed on your machine.
Luma AI API Key: Obtain an API Key from Luma AI's 3D Model API.

#### Installation
##### Clone the repository:
git clone https://github.com/ryanhood10/AI3DModelMaker.git
cd AI3DModelMaker

##### Backend setup:
cd backend
pip install -r requirements.txt

##### Frontend setup:
cd ../frontend
npm install
Running the Application Locally

##### Start the backend:
cd backend
flask run

##### Start the frontend:
cd ../frontend
npm start


### Using the Application
Access the live application: Visit AI 3D Model Maker - https://ai-3d-model-maker-6bb8a109b792.herokuapp.com/ 

##### Obtain an API Key:
Go to Luma AI's website and obtain an API Key from their 3D Model API. https://lumalabs.ai/dashboard/api

##### Follow Best Practices:
Visit the "Best Practices" page to learn how to capture the best 360 scan of an object.

##### Enter the App: 
Click the "Enter the App" button.

##### Save API Key: 
Enter your API key and press the "Save Key" button to save it into local storage.

##### Upload a Video:
Upload a video file of the capture.
Enter a title for the 3D capture project.
Click "Upload".

The app will prompt you and indicate that it has sent the capture to the AI.

##### Processing Time:
Processing can take anywhere from 15 minutes to 2 hours. If the video capture is unsuccessful (due to not following the Best Practices guidelines), you will not be charged for the capture.
Download 3D Model: Once the capture is successful, it will charge you 1 credit and provide you with a download button for your capture.

##### Check Credits:
Use the "Check Credits" button to see your remaining credits (more credits can be purchased on Luma AI's website).

##### Get All Captures: 
Click the "Get All Captures" button to return a list of all your 3D model requests. From here, you can download your recent models, which will be provided as .glb files usable in various 3D applications.




###### Please support by visiting my online store on the top right of the application, or connect with me on my LinkedIn which can be found in the website footer. Thanks! - Dev Ryan Hood

