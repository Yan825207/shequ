const axios = require('axios');

// 测试用户信息
const testUser = {
  username: 'testuser',
  email: 'test@example.com',
  password: 'password123'
};

// 注册用户
async function registerUser() {
  console.log('注册测试用户...');
  try {
    const response = await axios.post('http://localhost:5000/api/v1/users/register', testUser);
    console.log('注册成功:', response.data.message);
    console.log('用户信息:', response.data.data);
  } catch (error) {
    if (error.response && error.response.status === 400) {
      console.log('用户可能已存在，尝试登录...');
      await loginUser();
    } else {
      console.error('注册失败:', error.message);
      if (error.response) {
        console.error('响应数据:', error.response.data);
      }
    }
  }
}

// 登录用户
async function loginUser() {
  console.log('尝试登录...');
  try {
    const response = await axios.post('http://localhost:5000/api/v1/users/login', {
      email: testUser.email,
      password: testUser.password
    });
    console.log('登录成功:', response.data.message);
    console.log('Token:', response.data.data.token);
  } catch (error) {
    console.error('登录失败:', error.message);
    if (error.response) {
      console.error('响应数据:', error.response.data);
    }
  }
}

// 运行脚本
registerUser();