const { sequelize } = require('./utils/db');
const Announcement = require('./models/Announcement');

async function addNewAnnouncement() {
  try {
    console.log('开始添加新公告...');
    
    // 测试数据库连接
    await sequelize.authenticate();
    console.log('数据库连接成功');
    
    // 创建新的公告记录
    const newAnnouncement = await Announcement.create({
      title: '系统提示',
      content: '如遇白屏，请尝试刷新页面或重新打开。',
      isActive: true // 默认为true，可以省略
    });
    
    console.log('✅ 公告添加成功！');
    console.log('公告详情:');
    console.log('- ID:', newAnnouncement.id);
    console.log('- 标题:', newAnnouncement.title);
    console.log('- 内容:', newAnnouncement.content);
    console.log('- 状态:', newAnnouncement.isActive ? '活跃' : '非活跃');
    console.log('- 创建时间:', newAnnouncement.createdAt);
    
    // 验证公告是否成功插入
    console.log('\n验证公告是否成功插入...');
    const insertedAnnouncement = await Announcement.findByPk(newAnnouncement.id);
    
    if (insertedAnnouncement) {
      console.log('✅ 验证成功！公告已成功插入数据库');
      console.log('查询到的公告内容:', insertedAnnouncement.content);
    } else {
      console.log('❌ 验证失败！未找到插入的公告');
    }
    
    // 查看当前所有公告
    console.log('\n当前数据库中的所有公告:');
    const allAnnouncements = await Announcement.findAll({
      order: [['createdAt', 'DESC']]
    });
    
    allAnnouncements.forEach((announcement, index) => {
      console.log(`${index + 1}. [${announcement.isActive ? '活跃' : '非活跃'}] ${announcement.title} (创建时间: ${announcement.createdAt})`);
    });
    
  } catch (error) {
    console.error('❌ 添加公告失败:', error.message);
    console.error('错误详情:', error);
  } finally {
    // 关闭数据库连接
    await sequelize.close();
    console.log('\n数据库连接已关闭');
  }
}

// 运行函数
addNewAnnouncement();