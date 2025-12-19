const { sequelize } = require('./utils/db');
const User = require('./models/User');
const Post = require('./models/Post');
const Comment = require('./models/Comment');
const Like = require('./models/Like');
const Favorite = require('./models/Favorite');
const Follow = require('./models/Follow');

// 测试数据生成函数
const generateTestData = async () => {
  try {
    console.log('开始生成测试数据...');
    
    // 同步数据库模型
    await sequelize.sync({ alter: true });
    console.log('数据库模型同步完成');
    
    // 创建测试用户
    const users = await createTestUsers();
    
    // 创建测试帖子
    const posts = await createTestPosts(users);
    
    // 创建测试评论
    await createTestComments(users, posts);
    
    // 创建测试点赞
    await createTestLikes(users, posts);
    
    // 创建测试收藏
    await createTestFavorites(users, posts);
    
    // 创建测试关注关系
    await createTestFollows(users);
    
    console.log('测试数据生成完成！');
  } catch (error) {
    console.error('生成测试数据失败:', error);
  } finally {
    await sequelize.close();
  }
};

// 创建测试用户
const createTestUsers = async () => {
  const userData = [
    {
      username: 'admin',
      email: 'admin@example.com',
      password: 'admin123',
      nickname: '管理员',
      bio: '小区管理员，负责社区事务',
      role: 'admin'
    },
    {
      username: 'user',
      email: 'user@example.com',
      password: 'user123',
      nickname: '普通用户',
      bio: '小区居民，热爱生活',
      role: 'user'
    },
    {
      username: 'neighbor1',
      email: 'neighbor1@example.com',
      password: 'password123',
      nickname: '热心邻居',
      bio: '喜欢帮助他人，积极参与社区活动',
      role: 'user'
    },
    {
      username: 'neighbor2',
      email: 'neighbor2@example.com',
      password: 'password123',
      nickname: '美食达人',
      bio: '擅长烹饪，喜欢分享美食',
      role: 'user'
    },
    {
      username: 'neighbor3',
      email: 'neighbor3@example.com',
      password: 'password123',
      nickname: '运动爱好者',
      bio: '喜欢运动，组织小区运动活动',
      role: 'user'
    }
  ];
  
  const users = [];
  
  for (const data of userData) {
    // 检查用户是否已存在
    const existingUser = await User.findOne({ where: { email: data.email } });
    
    if (existingUser) {
      console.log(`用户 ${data.email} 已存在，跳过创建`);
      users.push(existingUser);
    } else {
      const user = await User.create(data);
      console.log(`创建用户: ${user.nickname} (${user.email})`);
      users.push(user);
    }
  }
  
  return users;
};

// 创建测试帖子
const createTestPosts = async (users) => {
  const postCategories = ['生活分享', '求助', '通知', '活动', '其他'];
  
  const postData = [
    {
      title: '小区门口的花开了，真漂亮！',
      content: '今天早上出门，看到小区门口的樱花开得特别漂亮，大家有空可以去看看。春天来了，小区的环境越来越美了！',
      category: '生活分享',
      images: ['https://via.placeholder.com/800x600?text=樱花1', 'https://via.placeholder.com/800x600?text=樱花2']
    },
    {
      title: '求助：寻找丢失的猫咪',
      content: '我家的橘猫昨天下午在小区里走失了，名字叫"小橘"，脖子上有蓝色项圈。有看到的邻居请联系我，电话：138****8888，非常感谢！',
      category: '求助',
      images: ['https://via.placeholder.com/800x600?text=猫咪']
    },
    {
      title: '【通知】本周六小区停水通知',
      content: '尊敬的各位业主：因管道维修，本周六（3月16日）上午9:00-下午17:00将暂停供水，请各位业主提前做好储水准备。给您带来不便，敬请谅解！',
      category: '通知'
    },
    {
      title: '【活动】周末篮球友谊赛',
      content: '本周日下午2:00在小区篮球场举办篮球友谊赛，欢迎各位业主报名参加，不论水平高低，重在参与！有意者请在评论区留言。',
      category: '活动'
    },
    {
      title: '推荐小区附近的好餐馆',
      content: '最近发现小区北门新开了一家川菜馆，味道很不错，价格也实惠。推荐大家去试试他们的水煮鱼和麻婆豆腐，真的很正宗！',
      category: '生活分享'
    },
    {
      title: '小区车位问题讨论',
      content: '最近小区停车位越来越紧张，晚上回来经常找不到车位。大家对这个问题有什么好的建议吗？欢迎在评论区讨论。',
      category: '其他'
    },
    {
      title: '【求助】寻找家教老师',
      content: '孩子上三年级，数学成绩不太理想，想找一位有经验的家教老师。时间是每周一、三、五晚上，地点在小区内。有推荐的请私信我，谢谢！',
      category: '求助'
    },
    {
      title: '小区健身房开业了！',
      content: '好消息！小区健身房正式开业了，设备齐全，环境整洁。现在办卡有优惠活动，年卡8折，感兴趣的邻居可以去看看。',
      category: '通知',
      images: ['https://via.placeholder.com/800x600?text=健身房1', 'https://via.placeholder.com/800x600?text=健身房2']
    }
  ];
  
  const posts = [];
  
  for (let i = 0; i < postData.length; i++) {
    const data = postData[i];
    // 随机分配作者
    const author = users[Math.floor(Math.random() * users.length)];
    
    const post = await Post.create({
      ...data,
      authorId: author.id,
      createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000) // 随机时间，一周内
    });
    
    console.log(`创建帖子: ${post.title} (作者: ${author.nickname})`);
    posts.push(post);
  }
  
  return posts;
};

// 创建测试评论
const createTestComments = async (users, posts) => {
  const commentTexts = [
    '说得对！',
    '感谢分享',
    '我也有同感',
    '这个建议不错',
    '支持！',
    '确实如此',
    '学到了，谢谢',
    '希望能尽快解决',
    '赞同你的观点',
    '我也遇到过类似的问题'
  ];
  
  // 为每个帖子创建2-5条评论
  for (const post of posts) {
    const commentCount = Math.floor(Math.random() * 4) + 2;
    
    for (let i = 0; i < commentCount; i++) {
      const user = users[Math.floor(Math.random() * users.length)];
      const content = commentTexts[Math.floor(Math.random() * commentTexts.length)];
      
      await Comment.create({
        content,
        authorId: user.id,
        postId: post.id,
        createdAt: new Date(Date.now() - Math.random() * 3 * 24 * 60 * 60 * 1000) // 随机时间，三天内
      });
    }
    
    console.log(`为帖子 "${post.title}" 创建了 ${commentCount} 条评论`);
  }
};

// 创建测试点赞
const createTestLikes = async (users, posts) => {
  // 为每个帖子随机添加1-3个点赞
  for (const post of posts) {
    const likeCount = Math.floor(Math.random() * 3) + 1;
    const likedUsers = new Set();
    
    while (likedUsers.size < likeCount) {
      const user = users[Math.floor(Math.random() * users.length)];
      
      if (!likedUsers.has(user.id)) {
        likedUsers.add(user.id);
        
        await Like.create({
          userId: user.id,
          targetId: post.id,
          targetType: 'post'
        });
        
        // 更新帖子的点赞数
        await post.increment('likes_count');
      }
    }
    
    console.log(`为帖子 "${post.title}" 添加了 ${likeCount} 个点赞`);
  }
};

// 创建测试收藏
const createTestFavorites = async (users, posts) => {
  // 为每个用户随机收藏2-4个帖子
  for (const user of users) {
    const favoriteCount = Math.floor(Math.random() * 3) + 2;
    const favoritedPosts = new Set();
    
    while (favoritedPosts.size < favoriteCount && favoritedPosts.size < posts.length) {
      const post = posts[Math.floor(Math.random() * posts.length)];
      
      if (!favoritedPosts.has(post.id)) {
        favoritedPosts.add(post.id);
        
        await Favorite.create({
          userId: user.id,
          postId: post.id
        });
      }
    }
    
    console.log(`用户 ${user.nickname} 收藏了 ${favoritedPosts.size} 个帖子`);
  }
};

// 创建测试关注关系
const createTestFollows = async (users) => {
  // 为每个用户随机关注1-2个其他用户
  for (const user of users) {
    const followCount = Math.floor(Math.random() * 2) + 1;
    const followedUsers = new Set();
    
    while (followedUsers.size < followCount && followedUsers.size < users.length - 1) {
      const targetUser = users[Math.floor(Math.random() * users.length)];
      
      if (targetUser.id !== user.id && !followedUsers.has(targetUser.id)) {
        followedUsers.add(targetUser.id);
        
        await Follow.create({
          followerId: user.id,
          followingId: targetUser.id
        });
        
        // 更新关注数和粉丝数
        await user.increment('following_count');
        await targetUser.increment('followers_count');
      }
    }
    
    console.log(`用户 ${user.nickname} 关注了 ${followedUsers.size} 个用户`);
  }
};

// 运行测试数据生成
generateTestData();