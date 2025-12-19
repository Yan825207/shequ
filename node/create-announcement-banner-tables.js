const mysql = require('mysql2/promise');
require('dotenv').config();

// 直接创建公告和Banner表
const createTables = async () => {
  try {
    // 连接到数据库
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      multipleStatements: true
    });
    
    // 创建公告表
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS announcements (
        id INT PRIMARY KEY AUTO_INCREMENT,
        title VARCHAR(100) NOT NULL,
        content TEXT NOT NULL,
        isActive BOOLEAN DEFAULT TRUE,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    
    console.log('公告表创建成功');
    
    // 创建Banner表
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS banners (
        id INT PRIMARY KEY AUTO_INCREMENT,
        title VARCHAR(100) NOT NULL,
        imageUrl VARCHAR(255) NOT NULL,
        linkUrl VARCHAR(255) NOT NULL,
        \`order\` INT DEFAULT 0,
        isActive BOOLEAN DEFAULT TRUE,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    
    console.log('Banner表创建成功');
    
    // 关闭连接
    await connection.end();
    
    console.log('所有表创建完成！');
    
  } catch (error) {
    console.error('创建表失败:', error.message);
    process.exit(1);
  }
};

// 运行创建表的脚本
createTables();