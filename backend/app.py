from flask import Flask, request, jsonify, send_file, send_from_directory
from flask_cors import CORS
import requests
import os
import logging

app = Flask(__name__, static_folder='../frontend/build', static_url_path='/')  # Serve static files from React build directory
CORS(app, resources={r"/*": {"origins": "*"}})  # Ensure CORS is enabled for all routes

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

UPLOAD_FOLDER = 'uploads'
DOWNLOAD_FOLDER = 'downloads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Create necessary folders
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)
if not os.path.exists(DOWNLOAD_FOLDER):
    os.makedirs(DOWNLOAD_FOLDER)

def get_auth_headers():
    api_key = request.headers.get('Authorization')
    if api_key:
        return {'Authorization': api_key}
    else:
        raise ValueError('Authorization header is missing')

@app.route('/proxy/credits', methods=['GET'])
def proxy_credits():
    api_key = request.headers.get('Authorization')
    headers = {
        'Authorization': api_key
    }
    response = requests.get('https://webapp.engineeringlumalabs.com/api/v2/capture/credits', headers=headers)
    return jsonify(response.json()), response.status_code

def create_capture(capture_title):
    logger.debug(f"Creating capture with title: {capture_title}")
    auth_headers = get_auth_headers()
    response = requests.post(
        "https://webapp.engineeringlumalabs.com/api/v2/capture",
        headers=auth_headers,
        data={'title': capture_title}
    )
    response.raise_for_status()  # Raise an error for bad responses
    capture_data = response.json()
    logger.debug(f"Capture created: {capture_data}")
    return capture_data

@app.route('/create_capture', methods=['OPTIONS', 'POST'])
def create_capture_route():
    if request.method == 'OPTIONS':
        response = app.make_default_options_response()
        headers = response.headers
        headers['Access-Control-Allow-Origin'] = '*'
        headers['Access-Control-Allow-Methods'] = 'POST, OPTIONS'
        headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
        return response

    try:
        title = request.json.get('title')
        if not title:
            logger.error("Title is required")
            return jsonify({'error': 'Title is required'}), 400

        capture_data = create_capture(title)
        upload_url = capture_data['signedUrls']['source']
        slug = capture_data['capture']['slug']

        response = jsonify({'upload_url': upload_url, 'slug': slug, 'capture_data': capture_data})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response
    except Exception as e:
        logger.error(f"Error creating capture: {e}")
        return jsonify({'error': 'Failed to create capture'}), 500

@app.route('/upload_file', methods=['OPTIONS', 'POST'])
def upload_file_route():
    if request.method == 'OPTIONS':
        response = app.make_default_options_response()
        headers = response.headers
        headers['Access-Control-Allow-Origin'] = '*'
        headers['Access-Control-Allow-Methods'] = 'POST, OPTIONS'
        headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
        return response

    try:
        file = request.files.get('file')
        upload_url = request.form.get('upload_url')
        if not file or not upload_url:
            logger.error("File and upload URL are required")
            return jsonify({'error': 'File and upload URL are required'}), 400

        logger.debug(f"Uploading file to URL: {upload_url}")
        # Read the file content
        payload = file.read()

        # Upload the file to the provided URL
        response = requests.put(upload_url, headers={'Content-Type': 'text/plain'}, data=payload)
        response.raise_for_status()  # Raise an error for bad responses

        logger.debug("File uploaded successfully")
        response = jsonify({'message': 'File uploaded successfully'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response
    except Exception as e:
        logger.error(f"Error uploading file: {e}")
        return jsonify({'error': 'Failed to upload file'}), 500

@app.route('/trigger_capture/<slug>', methods=['POST'])
def trigger_capture_route(slug):
    try:
        auth_headers = get_auth_headers()
        response = requests.post(
            f"https://webapp.engineeringlumalabs.com/api/v2/capture/{slug}",
            headers=auth_headers
        )
        response.raise_for_status()  # Raise an error for bad responses
        return jsonify(response.json())
    except Exception as e:
        logger.error(f"Error triggering capture: {e}")
        return jsonify({'error': 'Failed to trigger capture'}), 500

@app.route('/status/<slug>', methods=['GET'])
def check_status_route(slug):
    try:
        auth_headers = get_auth_headers()
        response = requests.get(
            f"https://webapp.engineeringlumalabs.com/api/v2/capture/{slug}",
            headers=auth_headers
        )
        response.raise_for_status()  # Raise an error for bad responses
        return jsonify(response.json())
    except Exception as e:
        logger.error(f"Error checking status: {e}")
        return jsonify({'error': 'Failed to check status'}), 500

@app.route('/download_capture/<slug>', methods=['GET'])
def download_capture_route(slug):
    try:
        auth_headers = get_auth_headers()
        response = requests.get(
            f"https://webapp.engineeringlumalabs.com/api/v2/capture/{slug}",
            headers=auth_headers
        )
        response.raise_for_status()
        capture_data = response.json()
        logger.debug(f"Capture data for slug {slug}: {capture_data}")

        latest_run = capture_data.get('latestRun', {})
        artifacts = latest_run.get('artifacts', [])
        if not artifacts:
            logger.error("Artifacts array is empty")
            return jsonify({'error': 'Download URL not found in capture data'}), 400

        # Find the first .glb file in the artifacts
        download_url = next((artifact['url'] for artifact in artifacts if artifact['url'].endswith('.glb')), None)
        if not download_url:
            logger.error("No .glb file found in artifacts")
            return jsonify({'error': 'No .glb file found in artifacts'}), 400

        # Download the file from the URL
        file_response = requests.get(download_url, stream=True)
        file_response.raise_for_status()

        # Save the file locally with the correct extension
        local_filename = os.path.join(DOWNLOAD_FOLDER, f"{slug}.glb")
        with open(local_filename, 'wb') as f:
            for chunk in file_response.iter_content(chunk_size=8192):
                if chunk:
                    f.write(chunk)

        # Send the file as a response
        return send_file(local_filename, as_attachment=True, mimetype='model/gltf-binary')
    except Exception as e:
        logger.error(f"Error downloading capture: {e}")
        return jsonify({'error': 'Failed to download capture'}), 500


@app.route('/get_all_captures', methods=['GET'])
def get_all_captures_route():
    try:
        auth_headers = get_auth_headers()
        response = requests.get(
            "https://webapp.engineeringlumalabs.com/api/v2/capture?skip=0&take=50&order=DESC",
            headers=auth_headers
        )
        response.raise_for_status()  # Raise an error for bad responses
        return jsonify(response.json())
    except Exception as e:
        logger.error(f"Error fetching captures: {e}")
        return jsonify({'error': 'Failed to fetch captures'}), 500

# Serve React App
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_react_app(path):
    if path and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=True, host='0.0.0.0', port=port)
