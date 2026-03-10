#!/bin/bash

# GitHub Pages 部署脚本

echo "开始部署到 GitHub Pages..."

# 检查是否已初始化 git
if [ ! -d .git ]; then
    echo "初始化 Git 仓库..."
    git init
    git branch -M main
fi

# 添加所有文件
echo "添加文件..."
git add .

# 提交
echo "提交更改..."
git commit -m "Update: $(date '+%Y-%m-%d %H:%M:%S')"

# 推送到 GitHub
echo "推送到 GitHub..."
git push -u origin main

echo "部署完成！"
echo "请在 GitHub 仓库设置中启用 Pages 功能"
echo "Settings > Pages > Source: main branch"
