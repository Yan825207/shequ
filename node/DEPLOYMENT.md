# Node.js 项目部署指南

## 项目概述
这是一个基于 Express.js 和 PostgreSQL (Neon) 的社区论坛后端项目，包含用户认证、帖子管理、评论、点赞、关注等功能。

## 部署前准备

### 1. 环境要求
- Node.js 16.0+
- npm 7.0+
- PostgreSQL 13.0+ (或使用 Neon 云数据库)

### 2. 本地环境配置
1. **克隆项目**
   ```bash
   git clone <repository-url>
   cd shequ/node
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **配置环境变量**
   - 复制 `.env.example` 为 `.env`
   - 填写数据库连接信息和其他配置

4. **数据库初始化**
   ```bash
   # 同步数据库模型
   node sync-models.js
   
   # 可选：添加测试数据
   node generateTestData.js
   ```

5. **本地启动测试**
   ```bash
   npm start
   ```
   访问 http://localhost:5000 确认服务正常运行

## 部署方案

### 方案一：传统服务器部署

#### 1. 服务器准备
- 选择云服务器（如 AWS EC2、阿里云 ECS、腾讯云 CVM 等）
- 推荐配置：2核4G内存，50G存储空间
- 操作系统：Ubuntu 20.04 LTS 或 CentOS 7+

#### 2. 服务器环境配置
1. **安装 Node.js**
   ```bash
   # Ubuntu
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # CentOS
   curl -fsSL https://rpm.nodesource.com/setup_18.x | bash -
   yum install -y nodejs
   ```

2. **安装 PM2 进程管理器**
   ```bash
   npm install -g pm2
   ```

3. **安装 Nginx**
   ```bash
   # Ubuntu
   sudo apt-get update
   sudo apt-get install -y nginx
   
   # CentOS
   yum install -y nginx
   ```

#### 3. 项目部署
1. **上传项目文件**
   ```bash
   # 使用 scp 或 rsync
   scp -r ./shequ/node user@server_ip:/path/to/deploy/
   ```

2. **安装依赖**
   ```bash
   cd /path/to/deploy/node
   npm install --production
   ```

3. **配置环境变量**
   - 创建 `.env` 文件并填写配置

4. **使用 PM2 启动服务**
   ```bash
   pm2 start app.js --name "shequ-backend"
   pm2 save
   pm2 startup
   ```

5. **配置 Nginx 反向代理**
   ```bash
   # 创建 Nginx 配置文件
   sudo nano /etc/nginx/sites-available/shequ
   ```

   添加以下配置：
   ```nginx
   server {
       listen 80;
       server_name your_domain.com;

       location / {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

   ```bash
   # 启用配置
   sudo ln -s /etc/nginx/sites-available/shequ /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

#### 4. 配置 HTTPS（可选）
1. **安装 Certbot**
   ```bash
   # Ubuntu
   sudo apt-get install -y certbot python3-certbot-nginx
   
   # CentOS
   yum install -y certbot python3-certbot-nginx
   ```

2. **获取 SSL 证书**
   ```bash
   sudo certbot --nginx -d your_domain.com
   ```

3. **自动续期配置**
   ```bash
   sudo crontab -e
   ```
   添加：
   ```
   0 3 * * * /usr/bin/certbot renew --quiet
   ```

### 方案二：容器化部署（Docker）

#### 1. 创建 Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm install --production

# 复制项目文件
COPY . .

# 暴露端口
EXPOSE 5000

# 启动应用
CMD ["node", "app.js"]
```

#### 2. 创建 docker-compose.yml
```yaml
version: '3.8'

services:
  backend:
    build: .
    ports:
      - "5000:5000"
    environment:
      - DB_NAME=shequ
      - DB_USER=neondb_owner
      - DB_PASSWORD=npg_lxN2uHQYSiZ5
      - DB_HOST=ep-little-credit-a4ljft2f-pooler.us-east-1.aws.neon.tech
      - DB_PORT=5432
      - PORT=5000
      - JWT_SECRET=your_jwt_secret_key_here
    restart: always
```

#### 3. 部署步骤
1. **构建镜像**
   ```bash
   docker-compose build
   ```

2. **启动服务**
   ```bash
   docker-compose up -d
   ```

3. **查看日志**
   ```bash
   docker-compose logs -f
   ```

### 方案三：云平台托管部署

#### 1. Vercel 部署
1. **创建 vercel.json**
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
         "src": "/api/(.*)",
         "dest": "app.js"
       }
     ],
     "env": {
       "DB_NAME": "shequ",
       "DB_USER": "neondb_owner",
       "DB_PASSWORD": "npg_lxN2uHQYSiZ5",
       "DB_HOST": "ep-little-credit-a4ljft2f-pooler.us-east-1.aws.neon.tech",
       "DB_PORT": "5432",
       "JWT_SECRET": "your_jwt_secret_key_here"
     }
   }
   ```

2. **部署**
   - 通过 Vercel CLI 或 GitHub 集成部署

#### 2. Render 部署
1. **创建 render.yaml**
   ```yaml
   services:
   - type: web
     name: shequ-backend
     env: node
     buildCommand: npm install
     startCommand: npm start
     envVars:
     - key: DB_NAME
       value: shequ
     - key: DB_USER
       value: neondb_owner
     - key: DB_PASSWORD
       value: npg_lxN2uHQYSiZ5
     - key: DB_HOST
       value: ep-little-credit-a4ljft2f-pooler.us-east-1.aws.neon.tech
     - key: DB_PORT
       value: 5432
     - key: JWT_SECRET
       value: your_jwt_secret_key_here
   ```

2. **部署**
   - 通过 Render 控制台或 GitHub 集成部署

## 部署后维护

### 1. 日志管理
```bash
# PM2 日志
pm2 logs shequ-backend

# Nginx 日志
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### 2. 监控
- **进程监控**: `pm2 monit`
- **服务器监控**: 可使用 Prometheus + Grafana
- **应用监控**: 可集成 New Relic 或 Datadog

### 3. 自动部署
1. **GitHub Actions 配置**
   ```yaml
   name: Deploy Node.js app

   on:
     push:
       branches: [ main ]

   jobs:
     deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v2
         - name: Setup Node.js
           uses: actions/setup-node@v2
           with:
             node-version: '18'
         - name: Install dependencies
           run: npm install --production
         - name: Deploy to server
           uses: easingthemes/ssh-deploy@v2.2.11
           with:
             SSH_PRIVATE_KEY: ${{ secrets.SSH_PRIVATE_KEY }}
             ARGS: '-rltgoDzvO --delete'
             SOURCE: './'
             REMOTE_HOST: ${{ secrets.REMOTE_HOST }}
             REMOTE_USER: ${{ secrets.REMOTE_USER }}
             TARGET: '/path/to/deploy/node'
         - name: Restart PM2
           uses: garygrossgarten/github-action-ssh@release
           with:
             host: ${{ secrets.REMOTE_HOST }}
             username: ${{ secrets.REMOTE_USER }}
             privateKey: ${{ secrets.SSH_PRIVATE_KEY }}
             command: cd /path/to/deploy/node && pm2 restart shequ-backend
   ```

### 4. 常见问题排查
- **数据库连接失败**: 检查 .env 文件中的数据库配置
- **端口被占用**: 使用 `lsof -i :5000` 查看并停止占用端口的进程
- **权限问题**: 确保上传目录有正确的写入权限
- **SSL 证书错误**: 检查域名配置和证书有效期

## 性能优化建议

1. **使用连接池**: 项目已配置 Sequelize 连接池
2. **启用 Gzip 压缩**: 可在 Nginx 中配置
3. **静态文件缓存**: 配置 Nginx 缓存策略
4. **使用 Redis 缓存**: 可添加 Redis 缓存热点数据
5. **负载均衡**: 高并发场景可配置多个实例

## 安全建议

1. **更新依赖**: 定期运行 `npm audit` 检查安全漏洞
2. **使用 HTTPS**: 生产环境必须启用
3. **限制访问**: 配置防火墙，只开放必要端口
4. **日志脱敏**: 确保日志中不包含敏感信息
5. **定期备份**: 配置数据库自动备份策略