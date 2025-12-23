const { Client } = require('pg');

// Neon数据库连接信息
const connectionString = 'postgresql://neondb_owner:npg_lxN2uHQYSiZ5@ep-little-credit-a4ljft2f-pooler.us-east-1.aws.neon.tech/shequ?sslmode=require&channel_binding=require';

async function testConnection() {
  const client = new Client({
    connectionString: connectionString,
    ssl: {
      rejectUnauthorized: true
    }
  });

  try {
    console.log('正在连接到Neon数据库...');
    await client.connect();
    console.log('✅ 数据库连接成功！');

    // 测试基本查询
    console.log('测试数据库查询...');
    const res = await client.query('SELECT NOW()');
    console.log('当前时间:', res.rows[0].now);

    // 检查数据库版本
    const versionRes = await client.query('SELECT version()');
    console.log('数据库版本:', versionRes.rows[0].version);

    // 列出所有表
    const tablesRes = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    console.log('数据库中的表:', tablesRes.rows.map(row => row.table_name));

  } catch (error) {
    console.error('❌ 数据库连接失败:', error.message);
  } finally {
    await client.end();
    console.log('数据库连接已关闭');
  }
}

testConnection();