const User = require('./models/User');
const { sequelize } = require('./utils/db');

async function addDefaultAvatars() {
  try {
    // 连接数据库
    await sequelize.authenticate();
    console.log('数据库连接成功');

    // 更新所有没有头像的用户
    const [updated] = await User.update(
      { avatar: 'https://via.placeholder.com/150' },
      { where: { avatar: null } }
    );

    console.log(`已为 ${updated} 个用户添加默认头像`);

    // 检查更新后的用户数量
    const users = await User.findAll({ attributes: ['id', 'username', 'avatar'] });
    console.log(`总用户数: ${users.length}`);
    
    // 显示前10个用户的头像状态
    console.log('前10个用户的头像状态:');
    users.slice(0, 10).forEach(user => {
      console.log(`${user.id}: ${user.username} - ${user.avatar}`);
    });

  } catch (error) {
    console.error('错误:', error);
  } finally {
    // 关闭数据库连接
    await sequelize.close();
  }
}

addDefaultAvatars();