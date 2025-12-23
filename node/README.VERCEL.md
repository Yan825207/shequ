# Vercel部署Node.js项目指南

## 1. Vercel平台简介

Vercel是一个现代化的部署平台，特别适合前端应用和Serverless API部署。虽然它主要以静态网站部署闻名，但也提供了强大的Node.js后端支持。

### 优势特点：
- **零配置部署**：与GitHub无缝集成，自动部署
- **全球CDN**：提供快速的内容分发
- **Serverless Functions**：支持无服务器函数
- **免费计划**：包含100GB带宽，无时长限制
- **自动HTTPS**：所有部署自动配置SSL证书
- **环境变量管理**：安全管理敏感配置

## 2. 部署前准备

### 2.1 项目结构要求

Vercel支持两种主要的Node.js部署方式：
1. **Serverless Functions**：适合API端点
2. **Node.js Server**：适合完整的Express应用

对于完整的Node.js服务器，项目结构应符合以下要求：

```
node/
├── app.js          # 主应用文件
├── package.json    # 项目依赖配置
├── api/            # Serverless Functions目录（可选）
└── vercel.json     # Vercel配置文件（必要）
```

### 2.2 准备GitHub仓库

1. 将项目推送到GitHub仓库
2. 确保`.gitignore`文件正确配置，排除不必要的文件

## 3. 详细部署步骤

### 3.1 第1步：创建Vercel账户

1. 访问 [Vercel官网](https://vercel.com/)
2. 使用GitHub账户登录（推荐）
3. 完成注册流程

### 3.2 第2步：连接GitHub仓库

1. 在Vercel仪表盘中，点击"New Project"
2. 选择"Import Git Repository"
3. 搜索并选择您的Node.js项目仓库
4. 点击"Import"按钮

### 3.3 第3步：配置项目设置

1. **Project Name**：设置项目名称（可选）
2. **Root Directory**：设置为`node`（如果您的Node.js代码在node目录中）
3. **Build and Output Settings**：
   - Framework Preset：选择"Other"
   - Build Command：留空或设置为`npm run build`（如果有构建脚本）
   - Output Directory：留空
   - Install Command：`npm install`

### 3.4 第4步：配置环境变量

在"Environment Variables"部分添加以下环境变量：

```
DB_NAME=shequ
DB_USER=shequ_owner
DB_PASSWORD=your_database_password
DB_HOST=your_database_host
DB_PORT=5432
PORT=3000
JWT_SECRET=your_jwt_secret_key
```

### 3.5 第5步：创建Vercel配置文件

在`node`目录中创建`vercel.json`文件：

```json
{
  "version": 2,
  "builds": [
    {
      "src": "app.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "app.js"
    }
  ]
}
```

### 3.6 第6步：部署项目

1. 点击"Deploy"按钮开始部署
2. Vercel将自动安装依赖并启动应用
3. 部署完成后，您将获得一个唯一的URL

### 3.7 第7步：验证部署

1. 访问部署成功后提供的URL
2. 测试API端点是否正常工作
3. 检查日志确认无错误

## 4. 高级配置

### 4.1 自定义域名

1. 在Vercel项目设置中，点击"Domains"
2. 添加您的自定义域名
3. 按照提示配置DNS记录
4. 等待DNS生效（通常需要几分钟到几小时）

### 4.2 部署环境管理

Vercel支持多环境部署：
- **Production**：主分支部署
- **Preview**：Pull Request自动部署
- **Development**：开发环境

### 4.3 性能优化

1. **启用GZIP压缩**：在Express应用中添加压缩中间件
2. **缓存静态资源**：配置适当的缓存头
3. **使用CDN**：利用Vercel的全球CDN

## 5. Serverless Functions方式

如果您只需要部署API端点，可以使用Vercel的Serverless Functions：

### 5.1 目录结构

```
node/
├── api/
│   ├── users.js    # API端点
│   └── posts.js    # 另一个API端点
└── package.json
```

### 5.2 函数示例

```javascript
// api/users.js
export default function handler(req, res) {
  if (req.method === 'GET') {
    res.status(200).json({ message: 'Get users' });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
```

## 6. 常见问题排查

### 6.1 部署失败

- **检查依赖**：确保`package.json`中的依赖正确
- **端口配置**：Vercel会自动分配端口，不要硬编码
- **环境变量**：确保所有必要的环境变量已配置

### 6.2 数据库连接问题

- **SSL设置**：对于远程数据库，确保SSL配置正确
- **连接字符串**：验证数据库连接信息
- **防火墙**：确保数据库允许Vercel的IP访问

### 6.3 性能问题

- **冷启动**：Serverless函数有冷启动延迟
- **内存限制**：免费计划有内存限制（1024MB）
- **超时限制**：函数执行时间限制为10秒

## 7. 免费计划限制

Vercel免费计划包含：
- 100GB带宽/月
- 无服务器函数调用次数限制
- 1024MB函数内存
- 10秒函数执行时间
- 支持自定义域名
- 自动HTTPS

## 8. 生产环境建议

1. **监控**：配置日志和错误监控
2. **备份**：定期备份数据库
3. **安全**：使用环境变量管理敏感信息
4. **性能**：优化数据库查询和API响应时间
5. **扩展**：根据流量考虑升级到付费计划

## 9. 总结

Vercel是一个现代化、用户友好的部署平台，特别适合：
- 前端应用 + 轻量级后端API
- Serverless架构
- 快速原型开发和测试

通过本指南，您应该能够成功在Vercel上部署您的Node.js项目。如果遇到问题，请参考Vercel的[官方文档](https://vercel.com/docs)或社区支持。