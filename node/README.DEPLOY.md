# 免费快速部署 Node.js 项目指南

本指南将帮助你在 Render 平台上免费快速部署你的 Node.js 后端项目。

## 为什么选择 Render？

- **完全免费**：提供免费的 Node.js 实例和数据库连接
- **一键部署**：通过 GitHub 集成实现自动化部署
- **支持 PostgreSQL**：完美兼容你的 Neon 数据库
- **自动 HTTPS**：默认提供免费的 SSL 证书
- **简单易用**：直观的控制台界面，无需复杂配置

## 部署步骤

### 步骤 1：准备 GitHub 仓库

1. **创建 GitHub 仓库**（如果还没有）
   - 访问 https://github.com/new
   - 创建一个新的仓库，命名为 `shequ-backend`

2. **初始化 Git 仓库**
   ```bash
   cd c:\Users\20525\Desktop\shequ\node
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/your-username/shequ-backend.git
   git push -u origin main
   ```

### 步骤 2：部署到 Render

1. **访问 Render 官网**
   - 前往 https://render.com
   - 使用 GitHub 账号登录（免费注册）

2. **创建新服务**
   - 点击 "New +" 按钮
   - 选择 "Web Service"

3. **连接 GitHub 仓库**
   - 在 "Public Git Repository" 中输入你的仓库 URL
   - 例如：`https://github.com/your-username/shequ-backend`
   - 点击 "Continue"

4. **配置服务**
   - **Name**: 保持默认或输入 `shequ-backend`
   - **Region**: 选择离你最近的区域（如 Oregon）
   - **Branch**: 选择 `main`
   - **Runtime**: 选择 `Node`
   - **Build Command**: 输入 `npm install`
   - **Start Command**: 输入 `npm start`
   - **Plan**: 选择 `Free`

5. **添加环境变量**
   - 点击 "Advanced" 按钮展开高级选项
   - 在 "Environment Variables" 部分添加以下变量：
     - `DB_NAME`: `shequ`
     - `DB_USER`: `neondb_owner`
     - `DB_PASSWORD`: `npg_lxN2uHQYSiZ5`
     - `DB_HOST`: `ep-little-credit-a4ljft2f-pooler.us-east-1.aws.neon.tech`
     - `DB_PORT`: `5432`
     - `PORT`: `5000`
     - `JWT_SECRET`: `your_jwt_secret_key_here`

6. **部署服务**
   - 点击 "Create Web Service" 按钮
   - Render 会自动构建和部署你的项目
   - 部署过程大约需要 2-3 分钟

### 步骤 3：验证部署

1. **查看部署状态**
   - 在 Render 控制台中，你可以看到部署进度
   - 等待状态变为 "Live"

2. **访问部署的服务**
   - 部署完成后，Render 会提供一个 URL，例如：`https://shequ-backend.onrender.com`
   - 访问这个 URL，你应该能看到项目的默认页面

3. **测试 API 端点**
   - 尝试访问 API 端点，例如：`https://shequ-backend.onrender.com/api/v1/announcements`
   - 如果返回 JSON 数据，表示部署成功

## 部署后的管理

### 查看日志

1. 在 Render 控制台中，点击你的服务
2. 选择 "Logs" 标签页
3. 你可以看到实时的应用日志，用于调试问题

### 重启服务

1. 在 Render 控制台中，点击你的服务
2. 点击 "Restart" 按钮
3. 服务会自动重启，这对于应用更新或配置更改后很有用

### 自动部署

Render 会自动监听 GitHub 仓库的变更：
1. 当你向 GitHub 推送新的代码时
2. Render 会自动重新构建和部署你的项目
3. 无需手动干预

## 常见问题排查

### 部署失败

1. **检查构建日志**：查看具体的错误信息
2. **依赖问题**：确保 `package.json` 中的依赖正确
3. **环境变量**：检查是否所有必要的环境变量都已设置

### 数据库连接失败

1. **检查数据库配置**：确认 Neon 数据库的连接信息正确
2. **网络访问**：Neon 数据库默认允许外部访问，但如果有问题，检查 Neon 控制台中的网络设置

### 服务启动失败

1. **端口配置**：确保使用的端口与 Render 配置一致
2. **启动脚本**：检查 `package.json` 中的 `start` 脚本
3. **日志分析**：查看应用启动日志，找出具体错误

## 性能优化建议

1. **免费计划限制**：Render 免费计划有 100 小时/月的运行时间限制
2. **冷启动**：免费实例长时间不活动会进入休眠状态，首次请求可能需要 30 秒左右的冷启动时间
3. **资源限制**：免费实例有 512MB 内存限制，不适合高并发场景

## 总结

Render 平台提供了一种简单、免费的方式来部署你的 Node.js 项目。通过本指南，你可以在几分钟内完成部署，并获得一个可公开访问的 API 服务。

如果你的项目需要更高的性能和可靠性，可以考虑升级到 Render 的付费计划，或者在项目增长后迁移到其他平台。