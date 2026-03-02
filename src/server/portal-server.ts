import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import path from 'path';

const app = express();
const PORT = 80;

// 静态文件服务 - 提供公共文件
app.use(express.static(path.join(process.cwd(), 'public')));

// 游戏静态文件服务 - 提供构建后的前端
app.use('/game', express.static(path.join(process.cwd(), 'dist')));

// API 代理 - 转发到后端服务器
app.use('/api', createProxyMiddleware({
  target: 'http://localhost:3001',
  changeOrigin: true,
  secure: false
}));

// 根路径 - 返回门户页面
app.get('/', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'public', 'portal.html'));
});

// 游戏路径 - 返回游戏页面
app.get('/game', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'dist', 'index.html'));
});

// 其他游戏相关路径也返回游戏页面 (SPA 支持)
app.get('/game/*', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Portal server running on http://localhost:${PORT}`);
  console.log(`Portal served from: ${path.join(process.cwd(), 'public', 'portal.html')}`);
  console.log(`Game served from: ${path.join(process.cwd(), 'dist')}`);
  console.log(`API proxied to: http://localhost:3001`);
});