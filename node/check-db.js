// 检查数据库表结构
const { sequelize } = require('./utils/db');
const Message = require('./models/Message');
const User = require('./models/User');

async function checkDatabase() {
  try {
    // 测试数据库连接
    await sequelize.authenticate();
    console.log('数据库连接成功');

    // 检查users表是否存在
    const usersTableExists = await sequelize.queryInterface.tableExists('users');
    console.log('users表存在:', usersTableExists);

    // 检查messages表是否存在
    const messagesTableExists = await sequelize.queryInterface.tableExists('messages');
    console.log('messages表存在:', messagesTableExists);

    // 如果messages表不存在，创建它
    if (!messagesTableExists) {
      console.log('正在创建messages表...');
      await Message.sync({ force: false });
      console.log('messages表创建成功');
    }

    // 检查用户数据
    const users = await User.findAll({ limit: 5 });
    console.log('用户数量:', users.length);
    users.forEach(user => {
      console.log(`用户ID: ${user.id}, 用户名: ${user.username}, 邮箱: ${user.email}`);
    });

    // 检查消息数据
    const messages = await Message.findAll({ limit: 10 });
    console.log('消息数量:', messages.length);

  } catch (error) {
    console.error('数据库检查失败:', error);
  } finally {
    await sequelize.close();
  }
}

checkDatabase();