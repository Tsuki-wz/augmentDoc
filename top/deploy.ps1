# GitHub Pages 部署脚本 (PowerShell)

Write-Host "开始部署到 GitHub Pages..." -ForegroundColor Green

# 检查是否已初始化 git
if (-not (Test-Path .git)) {
    Write-Host "初始化 Git 仓库..." -ForegroundColor Yellow
    git init
    git branch -M main
}

# 添加所有文件
Write-Host "添加文件..." -ForegroundColor Yellow
git add .

# 提交
$commitMessage = "Update: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
Write-Host "提交更改..." -ForegroundColor Yellow
git commit -m $commitMessage

# 推送到 GitHub
Write-Host "推送到 GitHub..." -ForegroundColor Yellow
git push -u origin main

Write-Host "部署完成！" -ForegroundColor Green
Write-Host "请在 GitHub 仓库设置中启用 Pages 功能" -ForegroundColor Cyan
Write-Host "Settings > Pages > Source: main branch" -ForegroundColor Cyan
