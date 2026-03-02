#!/bin/bash

# Pokemaster TCG 自动部署和重启脚本
# 用于在代码更新后自动重启前后端服务

set -e  # 遇到错误立即退出

echo "🔄 开始部署更新..."
echo "⏰ $(date)"

# 停止现有服务（必须在构建前停止，避免文件被占用）
echo "⏹️  停止现有服务..."
pkill -f "src/api/index.cjs" 2>/dev/null || true
pkill -f "src/server/index.ts" 2>/dev/null || true
pkill -f "vite" 2>/dev/null || true
sleep 5  # 等待服务完全停止

# 修复 dist 目录权限（解决 root 用户创建的文件问题）
echo "🔧 修复 dist 目录权限..."
mkdir -p dist
chown -R admin:admin dist 2>/dev/null || true
chmod -R 755 dist 2>/dev/null || true

# 清理旧日志
mkdir -p logs
rm -f logs/backend.log logs/frontend.log logs/api.log 2>/dev/null

# 构建生产环境前端包（现在dist目录没有被占用且权限正确）
echo "🏗️  构建生产环境前端包..."
cd /home/admin/proj && npm run build

# 启动服务
echo "🚀 启动 Pokemaster TCG 前后端服务..."

# 启动 API 服务器（真正的后端，在端口 3001）
echo "🔧 启动 API 服务器..."
cd /home/admin/proj && nohup node src/api/index.cjs > logs/api.log 2>&1 &
API_PID=$!
echo "API 服务器 PID: $API_PID"

# 等待 API 服务器启动并验证
sleep 3
API_HEALTHY=false
for i in {1..10}; do
    if curl -s --connect-timeout 2 http://localhost:3001/health > /dev/null 2>&1; then
        API_HEALTHY=true
        break
    fi
    sleep 1
done

# 启动代理服务器（在端口 80，处理前端和代理）
echo "🌐 启动代理服务器..."
cd /home/admin/proj && nohup sudo -E node --loader ts-node/esm src/server/index.ts > logs/backend.log 2>&1 &
PROXY_PID=$!
echo "代理服务器 PID: $PROXY_PID"

# 启动前端开发服务器（在端口 3000）
echo "🎨 启动前端开发服务器..."
cd /home/admin/proj && nohup npm run dev > logs/frontend.log 2>&1 &
FRONTEND_PID=$!
echo "前端服务 PID: $FRONTEND_PID"

echo "✅ 所有服务已启动！"
echo "🌐 前端开发地址: http://www.jxrtop.top:3000/"
echo "🌐 生产前端地址: http://www.jxrtop.top/ (端口 80)"
echo "🔧 API 地址: http://localhost:3001/"
echo "🔄 代理地址: http://localhost:80/"

# 等待几秒让服务完全启动
sleep 5

# 检查服务状态 - 使用实际的HTTP请求而不是端口检测
check_service() {
    local url=$1
    local name=$2
    local timeout=10
    
    for i in $(seq 1 $timeout); do
        if curl -s --connect-timeout 2 --max-time 5 "$url" > /dev/null 2>&1; then
            echo "✅ $name 运行正常"
            return 0
        fi
        sleep 1
    done
    echo "❌ $name 启动失败，请检查相关日志"
    return 1
}

# 检查各个服务
if [ "$API_HEALTHY" = true ]; then
    echo "✅ API 服务器运行正常"
else
    check_service "http://localhost:3001/" "API 服务器" || true
fi

check_service "http://localhost/" "代理服务器"
check_service "http://localhost:3000/" "前端服务"

echo "📊 服务状态监控:"
echo "   API 日志: tail -f logs/api.log"
echo "   代理日志: tail -f logs/backend.log"
echo "   前端日志: tail -f logs/frontend.log"
echo "🎉 部署完成！"