# 每日一学 Daily Study

一个简洁优雅的个人学习记录工具，帮助你记录和回顾每天的学习内容。

## 功能特点

- 记录每日学习内容，包括摘要、详细内容、学习来源和收获
- 支持时间查询和全文搜索
- 响应式设计，完美支持手机端和电脑端
- 简洁优雅的界面设计
- 本地数据存储，保护隐私
- 分页显示，每页6条记录
- 详细内容查看功能
- 卡片式布局，操作按钮固定底部

## 技术栈

- 前端：HTML5, CSS3, JavaScript
- 后端：Python Flask
- 数据存储：JSON

## 安装和运行

1. 克隆项目到本地
2. 安装依赖：
```bash
pip install -r requirements.txt
```
3. 运行项目：
```bash
python app.py
```
4. 访问 `http://localhost:5000` 即可使用

## 项目结构

```
daily_study_project/
│── app.py              # Flask 后端主程序
├── templates/
│   ├── index.html      # 前端主页面
│   ├── daily_study.json # 数据存储文件
├── static/
│   ├── style.css       # 前端样式文件
│   └── main.js         # 前端逻辑文件
└── README.md           # 项目说明文件
```

## 使用说明

1. 新增记录：点击右上角"新增记录"按钮
2. 编辑记录：点击记录卡片上的"编辑"按钮
3. 删除记录：点击记录卡片上的"删除