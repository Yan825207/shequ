const { sequelize, testConnection, syncModels } = require('./utils/db');
const setupAssociations = require('./models/associations');

// 同步数据库模型
const syncAllModels = async () => {
  try {
    console.log('开始同步数据库模型...');
    
    // 测试数据库连接
    await testConnection();
    
    // 设置模型关联
    setupAssociations();
    
    // 同步模型
    await syncModels();
    
    console.log('数据库模型同步成功！');
    
  } catch (error) {
    console.error('数据库模型同步失败:', error.message);
    process.exit(1);
  }
};

// 运行同步
syncAllModels();