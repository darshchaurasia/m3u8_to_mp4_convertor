from flask import Flask, render_template, request, send_file, jsonify
import subprocess
import os

app = Flask(__name__)

# Directory to save output files
OUTPUT_DIR = "output"
if not os.path.exists(OUTPUT_DIR):
    os.makedirs(OUTPUT_DIR)

# Counter to create unique filenames
download_counter = 1

def m3u8_to_mp4(input_m3u8_url, output_mp4_path):
    command = [
        "ffmpeg",
        "-i", input_m3u8_url,
        "-c", "copy",
        "-bsf:a", "aac_adtstoasc",
        output_mp4_path
    ]
    subprocess.run(command, check=True)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/download', methods=['POST'])
def download():
    global download_counter
    data = request.json
    input_url = data.get('url')

    if not input_url:
        return jsonify({"error": "No URL provided"}), 400

    try:
        output_filename = f"download_{download_counter}.mp4"
        output_path = os.path.join(OUTPUT_DIR, output_filename)

        m3u8_to_mp4(input_url, output_path)

        download_counter += 1
        return jsonify({"success": True, "filename": output_filename})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/get_file/<filename>')
def get_file(filename):
    file_path = os.path.join(OUTPUT_DIR, filename)
    if os.path.exists(file_path):
        return send_file(file_path, as_attachment=True)
    return "File not found", 404

if __name__ == '__main__':
    app.run(debug=True)
