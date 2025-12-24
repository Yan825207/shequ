# Node.js 项目部署指南

本指南将帮助您将社区服务 API 项目部署到 Vercel 平台。

## 准备工作

1. **确保项目在本地正常运行**
   - 运行 `npm install` 安装所有依赖
   - 运行 `npm start` 确保服务器能够正常启动
   - 测试数据库连接是否正常

2. **创建 Vercel 账户**
   - 访问 [Vercel 官网](https://vercel.com/)
   - 注册或登录您的账户

3. **连接 GitHub 仓库**
   - 确保您的项目已经推送到 GitHub 仓库
   - 在 Vercel 控制台中，点击 "New Project"
   - 选择您的 GitHub 仓库

## 部署配置

1. **配置项目设置**
   - **Root Directory**: 选择 `node` 目录
   - **Build Command**: 保持默认 (Vercel 会自动检测)
   - **Output Directory**: 保持默认 (不需要)
   - **Environment Variables**: 从 `.env` 文件中复制所有环境变量

2. **环境变量配置**
   在 Vercel 控制台的 "Environment Variables" 部分，添加以下变量：
   - `DB_NAME`: shequ
   - `DB_USER`: neondb_owner
   - `DB_PASSWORD`: npg_lxN2uHQYSiZ5
   - `DB_HOST`: ep-little-credit-a4ljft2f-pooler.us-east-1.aws.neon.tech
   - `DB_PORT`: 5432
   - `PORT`: 5000
   - `JWT_SECRET`: your_jwt_secret_key_here
   - `JWT_EXPIRES_IN`: 7d

3. **部署项目**
   - 点击 "Deploy" 按钮开始部署过程
   - 等待部署完成，Vercel 会显示部署状态和日志

## 验证部署

1. **检查部署状态**
   - 部署完成后，Vercel 会提供一个部署 URL
   - 点击 URL 访问您的 API 服务

2. **测试 API 端点**
   - 访问根路径: `https://your-deployment-url.vercel.app/`
   - 访问健康检查端点: `https://your-deployment-url.vercel.app/health`
   - 测试其他 API 端点，确保它们能够正常工作

## 常见问题排查

1. **部署失败**
   - 检查 Vercel 部署日志，查看具体错误信息
   - 确保所有依赖都在 package.json 中正确声明
   - 确保环境变量配置正确

2. **数据库连接失败**
   - 检查数据库连接字符串是否正确
   - 确保数据库服务器允许外部连接
   - 检查数据库用户权限是否足够

3. **API 端点返回 404**
   - 确保路由配置正确
   - 检查 Vercel 路由配置是否指向正确的入口文件

## 部署后维护

1. **监控部署状态**
   - 定期检查 Vercel 控制台中的部署状态
   - 设置监控和告警，及时发现问题

2. **更新部署**
   - 当您修改代码后，推送到 GitHub 仓库
   - Vercel 会自动检测更改并重新部署
   - 或者在 Vercel 控制台中手动触发重新部署

3. **扩展和优化**
   - 根据流量情况，考虑升级 Vercel 计划
   - 优化数据库查询和连接池配置
   - 考虑使用缓存策略提高性能

## 其他部署选项

如果您不想使用 Vercel，也可以考虑以下部署选项：

1. **Heroku**: 另一个流行的 PaaS 平台
2. **AWS Lambda + API Gateway**: 无服务器架构
3. **DigitalOcean Droplet**: 云服务器
4. **Render**: 类似 Vercel 的部署平台

根据您的需求和预算，选择最适合的部署方案。