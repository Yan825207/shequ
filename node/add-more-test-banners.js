const { sequelize } = require('./utils/db');
const Banner = require('./models/Banner');

// 添加更多测试Banner数据
const addMoreTestBanners = async () => {
  try {
    console.log('开始添加更多测试Banner数据...');
    
    // 测试数据库连接
    await sequelize.authenticate();
    console.log('数据库连接成功');
    
    // 添加更多测试Banner数据
    console.log('\n添加更多测试Banner数据...');
    const banners = [
      {
        title: '社区服务',
        imageUrl: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=community%20services%20banner%20green%20helpful&size=1024x400',
        linkUrl: '/pages/services',
        isActive: true,
        order: 4
      },
      {
        title: '邻里互助',
        imageUrl: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=neighborhood%20help%20banner%20warm%20friendly&size=1024x400',
        linkUrl: '/pages/help',
        isActive: true,
        order: 5
      },
      {
        title: '小区环境',
        imageUrl: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=community%20environment%20banner%20beautiful%20clean&size=1024x400',
        linkUrl: '/pages/environment',
        isActive: true,
        order: 6
      },
      {
        title: '文化活动',
        imageUrl: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=cultural%20activities%20banner%20vibrant%20colorful&size=1024x400',
        linkUrl: '/pages/culture',
        isActive: true,
        order: 7
      }
    ];
    
    // 批量创建Banner
    const createdBanners = await Banner.bulkCreate(banners);
    console.log(`成功添加 ${createdBanners.length} 条测试Banner`);
    
    // 查看当前所有Banner数据
    console.log('\n查看当前所有Banner数据...');
    const allBanners = await Banner.findAll({
      order: [['order', 'ASC']]
    });
    console.log(`当前共有 ${allBanners.length} 条Banner数据：`);
    allBanners.forEach((banner, index) => {
      console.log(`${index + 1}. ${banner.title} (排序: ${banner.order}) - ${banner.isActive ? '激活' : '未激活'}`);
    });
    
    console.log('\n测试Banner数据添加完成！');
    
  } catch (error) {
    console.error('添加测试Banner数据失败:', error.message);
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
addMoreTestBanners();