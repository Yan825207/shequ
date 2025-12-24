const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');

// 加载环境变量（尝试不同路径）
dotenv.config({ path: '.env' });
dotenv.config({ path: './.env' });
dotenv.config({ path: '../.env' });

// 动态导入数据库连接，避免在依赖安装前加载
let sequelize, testConnection, syncModels;
try {
  const db = require('./utils/db');
  sequelize = db.sequelize;
  testConnection = db.testConnection;
  syncModels = db.syncModels;
} catch (error) {
  console.error('Database connection module error:', error.message);
  // 在依赖安装阶段，允许继续执行
}

const setupAssociations = require('./models/associations');

// 创建Express应用
const app = express();

// 中间件配置
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// 静态文件服务 - 带CORS头信息
app.use('/uploads', (req, res, next) => {
  // 设置CORS头信息
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }
  
  next();
}, express.static('uploads'));

// 数据库连接
const connectDatabase = async () => {
  try {
    if (!testConnection) {
      console.warn('Database connection module not available, skipping connection test');
      return;
    }
    
    // 测试数据库连接
    await testConnection();
    // 设置模型关联
    setupAssociations();
    // Skip syncModels temporarily to avoid deadlock issues
    // await syncModels();
    console.log('Database connected successfully (model sync skipped)');
  } catch (error) {
    console.error('Database connection error:', error);
    // 在开发环境中，不要直接退出进程
    // 而是记录错误并允许服务器继续运行
    if (process.env.NODE_ENV === 'production') {
      // 在生产环境中也不要退出，而是继续运行服务器
      console.warn('Continuing server startup despite database connection error');
    }
  }
};

// 连接数据库（异步执行，不阻塞服务器启动）
connectDatabase().catch(console.error);

// 路由配置
app.use('/api/v1/users', require('./routes/userRoutes'));
app.use('/api/v1/posts', require('./routes/postRoutes'));
app.use('/api/v1/comments', require('./routes/commentRoutes'));
app.use('/api/v1/likes', require('./routes/likeRoutes'));
app.use('/api/v1/follows', require('./routes/followRoutes'));
app.use('/api/v1/favorites', require('./routes/favoriteRoutes'));
app.use('/api/v1/uploads', require('./routes/uploadRoutes'));
app.use('/api/v1/messages', require('./routes/messageRoutes'));
app.use('/api/v1/announcements', require('./routes/announcementRoutes'));
app.use('/api/v1/banners', require('./routes/bannerRoutes'));

// 根路由
app.get('/', (req, res) => {
  res.json({ message: 'Community App API is running' });
});

// 健康检查端点
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    message: '服务器运行正常' 
  });
});

// 404处理
app.use((req, res, next) => {
  res.status(404).json({ code: 404, message: 'Route not found' });
});

// 错误处理
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ code: 500, message: 'Internal server error' });
});

// 启动服务器
const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0'; // 监听所有网络接口
app.listen(PORT, HOST, () => {
  console.log(`Server is running on http://${HOST}:${PORT}`);
});