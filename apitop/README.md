# KissAPI Tutorial - 本地部署版本

这是 [kissapi.ai/tutorial](https://kissapi.ai/tutorial) 的本地静态网站副本。

## 📦 文件说明

- **`index-complete.html`** - ✅ 完整版主页面（推荐使用）
- **`index.html`** - ⚠️ 简化版主页面（仅 Claude Code CLI 部分）
- `styles.css` - 样式文件
- `script.js` - 交互脚本
- `README.md` - 本说明文档

## 📚 内容

### index-complete.html（完整版 - 推荐）
包含所有教程内容：
- ✅ Claude Code CLI（Windows/macOS/Linux）
- ✅ OpenClaw（Windows WSL2/macOS/Linux）
- ✅ CC-Switch（Windows/macOS/Linux）
- ✅ Opencode（Windows/macOS/Linux）
- ✅ VS Code/Cursor 插件配置

### index.html（简化版）
- ✅ Claude Code CLI（Windows/macOS/Linux）
- ⚠️ 其他部分未完成

## 🚀 本地运行

### 方式一：直接打开
直接在浏览器中打开 `index-complete.html` 文件即可。

### 方式二：使用本地服务器
```bash
# 使用 Python
python -m http.server 8000

# 使用 Node.js
npx http-server

# 使用 PHP
php -S localhost:8000
```

然后在浏览器中访问 `http://localhost:8000`

## 部署到 GitHub Pages

1. 创建新的 GitHub 仓库
2. 将此文件夹内容推送到仓库
3. 在仓库设置中启用 GitHub Pages
4. 选择 `main` 分支作为源

### 快速部署命令

```bash
cd kissapi-tutorial
git init
git add .
git commit -m "Initial commit: KissAPI tutorial local copy"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

然后在 GitHub 仓库设置中：
- 进入 Settings > Pages
- Source 选择 "Deploy from a branch"
- Branch 选择 "main" 和 "/ (root)"
- 点击 Save

几分钟后，你的网站将在 `https://YOUR_USERNAME.github.io/YOUR_REPO/` 上线。

## 文件结构

```
kissapi-tutorial/
├── index.html          # 主页面
├── styles.css          # 样式文件
├── script.js           # 交互脚本
└── README.md          # 说明文档
```

## 技术栈

- 纯静态 HTML/CSS/JavaScript
- 无需构建工具
- 响应式设计，支持移动端

## 内容来源

内容来源于 [kissapi.ai/tutorial](https://kissapi.ai/tutorial)

## 许可

本项目仅用于学习和参考目的。原始内容版权归 KissAPI 所有。
