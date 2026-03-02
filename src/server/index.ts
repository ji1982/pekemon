import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import path from 'path';

const app = express();
const PORT = 80;

// 静态文件服务 - 提供构建后的前端
app.use(express.static(path.join(process.cwd(), 'dist')));

// API 代理 - 转发到后端服务器
app.use('/api', createProxyMiddleware({
  target: 'http://localhost:3001',
  changeOrigin: true,
  secure: false
}));

// 所有其他请求都返回 index.html (SPA 支持)
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(process.cwd(), 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
  console.log(`Frontend served from: ${path.join(process.cwd(), 'dist')}`);
  console.log(`API proxied to: http://localhost:3001`);
});