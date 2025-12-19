const { sequelize } = require('./utils/db');
const Announcement = require('./models/Announcement');
const Banner = require('./models/Banner');

// 添加测试公告和Banner数据
const addTestAnnouncementsAndBanners = async () => {
  try {
    console.log('开始添加测试公告和Banner数据...');
    
    // 测试数据库连接
    await sequelize.authenticate();
    console.log('数据库连接成功');
    
    // 添加测试公告数据
    console.log('\n添加测试公告数据...');
    const announcements = [
      {
        title: '社区活动通知',
        content: '本周末将在小区中心花园举办亲子活动，欢迎各位业主踊跃参加！活动时间：周六上午9:00-11:00，有精美礼品等着大家。',
        isActive: true
      },
      {
        title: '物业费缴纳通知',
        content: '2024年第一季度物业费开始缴纳，请各位业主及时缴纳。可通过物业APP、微信公众号或线下缴费处缴纳。缴费截止日期：3月31日。',
        isActive: true
      },
      {
        title: '停水通知',
        content: '因管道维修，将于3月15日上午8:00-12:00停水，请各位业主提前做好储水准备。给您带来不便，敬请谅解。',
        isActive: true
      },
      {
        title: '小区安全提示',
        content: '近期周边小区发生多起盗窃事件，请各位业主注意关好门窗，贵重物品妥善保管。如有可疑人员，请及时联系物业或报警。',
        isActive: true
      },
      {
        title: '垃圾分类宣传',
        content: '为了创建更美好的居住环境，小区将全面推行垃圾分类。请各位业主按照垃圾分类指南正确投放垃圾，共同维护小区环境。',
        isActive: true
      }
    ];
    
    // 批量创建公告
    const createdAnnouncements = await Announcement.bulkCreate(announcements);
    console.log(`成功添加 ${createdAnnouncements.length} 条测试公告`);
    
    // 添加测试Banner数据
    console.log('\n添加测试Banner数据...');
    const banners = [
      {
        title: '小区活动',
        imageUrl: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=community%20activity%20banner%20colorful%20family%20friendly&size=1024x400',
        linkUrl: '/pages/activity',
        isActive: true,
        order: 1
      },
      {
        title: '物业缴费',
        imageUrl: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=property%20payment%20banner%20blue%20professional&size=1024x400',
        linkUrl: '/pages/payment',
        isActive: true,
        order: 2
      },
      {
        title: '安全提示',
        imageUrl: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=security%20tips%20banner%20red%20warning&size=1024x400',
        linkUrl: '/pages/security',
        isActive: true,
        order: 3
      }
    ];
    
    // 批量创建Banner
    const createdBanners = await Banner.bulkCreate(banners);
    console.log(`成功添加 ${createdBanners.length} 条测试Banner`);
    
    console.log('\n测试数据添加完成！');
    
  } catch (error) {
    console.error('添加测试数据失败:', error.message);
    if (error.stack) {
      console.error('错误堆栈:', error.stack);
    }
  } finally {
    // 关闭数据库连接
    await sequelize.close();
    console.log('数据库连接已关闭');
  }
};

// 运行脚本
addTestAnnouncementsAndBanners();