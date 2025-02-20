from flask import Flask, render_template, request, jsonify
import json
from datetime import datetime
import os

app = Flask(__name__)

# 确保JSON文件存在
def ensure_json_file():
    if not os.path.exists('templates/daily_study.json'):
        with open('templates/daily_study.json', 'w', encoding='utf-8') as f:
            json.dump({}, f, ensure_ascii=False, indent=2)

# 读取JSON数据
def read_json():
    ensure_json_file()
    with open('templates/daily_study.json', 'r', encoding='utf-8') as f:
        return json.load(f)

# 写入JSON数据
def write_json(data):
    with open('templates/daily_study.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/entries', methods=['GET'])
def get_entries():
    return jsonify(read_json())

@app.route('/api/entry', methods=['POST'])
def add_entry():
    data = request.json
    all_entries = read_json()
    all_entries[data['date']] = {
        'summary': data['summary'],
        'content': data['content'],
        '学习来源': data['source'],
        '学习收获': data['gains']
    }
    write_json(all_entries)
    return jsonify({'status': 'success'})

@app.route('/api/entry/<date>', methods=['PUT'])
def update_entry(date):
    data = request.json
    all_entries = read_json()
    all_entries[date] = {
        'summary': data['summary'],
        'content': data['content'],
        '学习来源': data['source'],
        '学习收获': data['gains']
    }
    write_json(all_entries)
    return jsonify({'status': 'success'})

@app.route('/api/entry/<date>', methods=['DELETE'])
def delete_entry(date):
    all_entries = read_json()
    if date in all_entries:
        del all_entries[date]
        write_json(all_entries)
        return jsonify({'status': 'success'})
    return jsonify({'status': 'error', 'message': 'Entry not found'})

if __name__ == '__main__':
    app.run(debug=True,port=5000)
