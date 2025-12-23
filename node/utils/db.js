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
    logging: console.log,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
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
    process.exit(1);
  }
};

// 同步数据库模型
const syncModels = async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log('Database models synchronized');
  } catch (error) {
    console.error('Error synchronizing database models:', error.message);
    process.exit(1);
  }
};

module.exports = {
  sequelize,
  testConnection,
  syncModels
};