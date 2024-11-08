from flask import Flask, jsonify, send_from_directory
import subprocess

app = Flask(__name__, static_folder='static')

# 提供主目錄 JSON 文件
@app.route('/api/wins3', methods=['GET'])
def get_wins3():
    try:
        return send_from_directory('/app', 'file.json', mimetype='application/json')
    except FileNotFoundError:
        return jsonify({'error': 'file.json not found'}), 404

# 提供說明 JSON 文件
@app.route('/api/config', methods=['GET'])
def get_config():
    try:
        return send_from_directory('/app', 'config.json', mimetype='application/json')
    except FileNotFoundError:
        return jsonify({'error': 'config.json not found'}), 404

# 提供默認路徑的靜態文件
@app.route('/', methods=['GET'])
def serve_index():
    return send_from_directory('./', 'index.html')

# 提供 index2.html 的路徑
@app.route('/index2', methods=['GET'])
def serve_index2():
    return send_from_directory('./', 'index2.html')

#shell command
@app.route('/run-ls', methods=['GET'])
def run_ls():
    try:
        # 執行 `ls -l` 命令
        result = subprocess.run(['sleep', '5'], capture_output=True, text=True)
        if result.returncode != 0:
            return jsonify({'status': 'error', 'output': result.stderr}), 500
        
        # 返回結果
        return jsonify({'status': 'success', 'output': result.stdout})
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080, debug=True)