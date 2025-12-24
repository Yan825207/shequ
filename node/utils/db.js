const { Sequelize } = require('sequelize');
require('dotenv').config();

// 创建Sequelize实例（PostgreSQL配置）
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 1, // 减少连接池大小，适合开发环境
      min: 0,
      acquire: 10000, // 减少超时时间
      idle: 5000
    },
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      },
      connectTimeout: 10000 // 设置连接超时
    }
  }
);

// 测试数据库连接
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('PostgreSQL connected successfully');
  } catch (error) {
    console.error('PostgreSQL connection failed:', error.message);
    // 在开发环境中，不要直接退出进程
    // 而是记录错误并允许服务器继续运行
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};

// 同步数据库模型
const syncModels = async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log('Database models synchronized');
  } catch (error) {
    console.error('Error synchronizing database models:', error.message);
    // 在开发环境中，不要直接退出进程
    // 而是记录错误并允许服务器继续运行
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};

module.exports = {
  sequelize,
  testConnection,
  syncModels
};