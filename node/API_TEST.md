# API测试指南

## 部署状态检查

您的Node.js项目已成功部署到Vercel平台，部署地址为：
- **主部署地址**：`https://shequ-ten.vercel.app/`

## API端点测试

### 1. 基础健康检查

**测试根路径**：
```bash
curl -X GET "https://shequ-ten.vercel.app/" -H "Content-Type: application/json"
```

**预期响应**：
```json
{
  "message": "Community App API is running"
}
```

### 2. 公告API测试（无需认证）

**获取公告列表**：
```bash
curl -X GET "https://shequ-ten.vercel.app/api/v1/announcements" -H "Content-Type: application/json"
```

**预期响应**：
```json
{
  "code": 200,
  "message": "获取公告列表成功",
  "data": [
    {
      "id": 1,
      "title": "系统维护通知",
      "content": "平台将于今晚23:00-次日1:00进行系统维护",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### 3. 轮播图API测试（无需认证）

**获取轮播图列表**：
```bash
curl -X GET "https://shequ-ten.vercel.app/api/v1/banners" -H "Content-Type: application/json"
```

**预期响应**：
```json
{
  "code": 200,
  "message": "获取轮播图列表成功",
  "data": [
    {
      "id": 1,
      "imageUrl": "https://example.com/banner1.jpg",
      "linkUrl": "https://example.com/promotion1",
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### 4. 用户注册测试

**注册新用户**：
```bash
curl -X POST "https://shequ-ten.vercel.app/api/v1/users/register" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "Password123",
    "name": "测试用户"
  }'
```

**预期响应**：
```json
{
  "code": 201,
  "message": "注册成功",
  "data": {
    "id": 1,
    "username": "testuser",
    "email": "test@example.com",
    "name": "测试用户",
    "avatar": "https://neeko-copilot.bytedance.net/api/text2image?prompt=default%20user%20avatar&size=200x200",
    "role": "user",
    "token": "jwt_token_here"
  }
}
```

### 5. 用户登录测试

**用户登录**：
```bash
curl -X POST "https://shequ-ten.vercel.app/api/v1/users/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Password123"
  }'
```

**预期响应**：
```json
{
  "code": 200,
  "message": "登录成功",
  "data": {
    "id": 1,
    "username": "testuser",
    "email": "test@example.com",
    "name": "测试用户",
    "avatar": "https://neeko-copilot.bytedance.net/api/text2image?prompt=default%20user%20avatar&size=200x200",
    "role": "user",
    "token": "jwt_token_here"
  }
}
```

### 6. 帖子API测试

**获取帖子列表**：
```bash
curl -X GET "https://shequ-ten.vercel.app/api/v1/posts" -H "Content-Type: application/json"
```

**预期响应**：
```json
{
  "code": 200,
  "message": "获取帖子列表成功",
  "data": {
    "posts": [
      {
        "id": 1,
        "title": "测试帖子",
        "content": "这是一个测试帖子",
        "userId": 1,
        "user": {
          "id": 1,
          "username": "testuser",
          "avatar": "https://neeko-copilot.bytedance.net/api/text2image?prompt=default%20user%20avatar&size=200x200"
        },
        "likes": 0,
        "comments": 0,
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "total": 1,
    "page": 1,
    "pages": 1
  }
}
```

## 测试工具推荐

### 1. 使用Postman测试（推荐）

1. **下载Postman**：[https://www.postman.com/downloads/](https://www.postman.com/downloads/)
2. **创建测试集合**：
   - 点击"New" → "Collection"
   - 命名为"Shequ API Test"
   - 点击"Add Folder"创建不同的测试分类

3. **测试API**：
   - 点击"Add Request"创建新请求
   - 输入请求名称和URL
   - 选择HTTP方法（GET/POST等）
   - 添加请求体（如果需要）
   - 点击"Send"发送请求
   - 查看响应结果

### 2. 使用浏览器测试

对于GET请求，可以直接在浏览器中访问：
- 健康检查：`https://shequ-ten.vercel.app/`
- 公告列表：`https://shequ-ten.vercel.app/api/v1/announcements`
- 轮播图列表：`https://shequ-ten.vercel.app/api/v1/banners`

### 3. 使用在线API测试工具

- **ReqBin**：[https://reqbin.com/](https://reqbin.com/)
- **HTTPie**：[https://httpie.io/](https://httpie.io/)
- **REST Client**：VS Code插件

## 常见问题排查

### 1. API返回404错误

- **原因**：路径错误，可能是API版本前缀问题
- **解决方案**：确保使用正确的API路径，例如`/api/v1/announcements`而不是`/api/announcements`

### 2. API返回500错误

- **原因**：服务器内部错误，可能是数据库连接问题
- **解决方案**：
  1. 检查数据库连接信息是否正确
  2. 确认数据库服务是否正常运行
  3. 查看Vercel部署日志获取详细错误信息

### 3. API返回401错误

- **原因**：未授权访问，需要JWT token
- **解决方案**：
  1. 先调用登录接口获取token
  2. 在请求头中添加`Authorization: Bearer your_token_here`

### 4. API返回403错误

- **原因**：权限不足，需要管理员权限
- **解决方案**：确保使用管理员账号登录，或者检查API是否需要特殊权限

## 部署日志查看

1. **登录Vercel控制台**：[https://vercel.com/dashboard](https://vercel.com/dashboard)
2. **选择项目**：点击"shequ"项目
3. **查看部署历史**：点击"Deployments"标签
4. **查看具体部署**：点击最新的部署记录
5. **查看日志**：滚动到"Build Output"和"Logs"部分查看详细信息

## 性能测试

### 使用ab命令进行负载测试（需要安装Apache Benchmark）

```bash
# 测试100个请求，并发10个
ab -n 100 -c 10 "https://shequ-ten.vercel.app/api/v1/announcements"
```

### 使用wrk进行性能测试

```bash
# 测试持续30秒，10个并发连接
wrk -t10 -c10 -d30s "https://shequ-ten.vercel.app/api/v1/announcements"
```

## 监控建议

1. **Vercel Analytics**：在Vercel项目设置中启用Analytics
2. **Uptime Robot**：监控API可用性，设置自动告警
3. **Datadog**：如果需要更详细的监控和分析

## 总结

您的Node.js项目已成功部署到Vercel平台，所有API端点都已配置就绪。使用本指南提供的测试方法，可以验证API的正常运行状态。如果遇到任何问题，请参考"常见问题排查"部分进行解决。

部署状态：✅ 成功
部署地址：`https://shequ-ten.vercel.app/`
API版本：`v1`