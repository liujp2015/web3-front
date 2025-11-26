# Vercel 部署教程

本文档将指导你如何将 Web3 DAPP AI 项目部署到 Vercel 平台。

## 前置准备

1. **GitHub 账号**：确保你有一个 GitHub 账号
2. **Vercel 账号**：前往 [vercel.com](https://vercel.com) 注册账号（可以使用 GitHub 账号快速登录）
3. **项目代码**：将项目代码推送到 GitHub 仓库

## 部署步骤

### 步骤 1：将项目推送到 GitHub

1. 在项目根目录初始化 git 仓库（如果还没有）：
```bash
git init
git add .
git commit -m "Initial commit"
```

2. 在 GitHub 上创建新仓库，然后将代码推送：
```bash
git remote add origin https://github.com/your-username/your-repo-name.git
git branch -M main
git push -u origin main
```

### 步骤 2：连接 Vercel

1. 访问 [vercel.com](https://vercel.com) 并登录
2. 点击右上角的 **"Add New..."** 按钮
3. 选择 **"Project"**
4. 在 **"Import Git Repository"** 页面，点击 **"Continue with GitHub"**
5. 授权 Vercel 访问你的 GitHub 账号
6. 选择你刚才推送代码的仓库

### 步骤 3：配置项目

1. **Project Name**：Vercel 会自动使用你的仓库名，你可以修改
2. **Framework Preset**：Vercel 会自动检测为 **Next.js**
3. **Root Directory**：保持默认（如果项目在子目录，需要指定路径，如 `react-web3-dapp-ai`）
4. **Build and Output Settings**：
   - Build Command: `npm run build` (通常自动设置)
   - Output Directory: `.next` (通常自动设置)
   - Install Command: `npm install` (通常自动设置)

### 步骤 4：配置环境变量

这是**最重要的步骤**！你需要在 Vercel 中配置所有环境变量。

1. 在项目配置页面，找到 **"Environment Variables"** 部分
2. 添加以下环境变量（从你的 `.env.local` 文件复制）：

```
NEXT_PUBLIC_RPC_URL_SEPOLIA=https://sepolia.infura.io/v3/62e401de662b4df0a6a9e770dc897b73
NEXT_PUBLIC_RPC_URL_ANVIL=http://127.0.0.1:8545
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=d452a1819999d5a65dd139fc813c5cda
NEXT_PUBLIC_TOKEN_A_ADDRESS=0x8a88b830915aea048ebf8340aca47e21b8e342b4
NEXT_PUBLIC_TOKEN_B_ADDRESS=0x2b79645f2be73db5c001397ba261489dd5d25294
NEXT_PUBLIC_PAYMENT_TOKEN_ADDRESS=0x2d6bf73e7c3c48ce8459468604fd52303a543dcd
NEXT_PUBLIC_SWAP_ADDRESS=0x1f8e4Ca3EeA8Fbf9677a17c346B5Eb4f88309866
NEXT_PUBLIC_STAKE_POOL_ADDRESS=0xad93F86b7eE2e350fDD5E5a2b30cDbb1b304d622
NEXT_PUBLIC_FARM_ADDRESS=0x77008b97579Ed75F9917c2f0f948afDf15604677
NEXT_PUBLIC_LAUNCHPAD_ADDRESS=0x0CfF6fe40c8c2c15930BFce84d27904D8a8461Cf
NEXT_PUBLIC_TOKEN_FACTORY_ADDRESS=0x27345a45c0cbd8e780650ae59DF8f18eb5aB376D
```

**注意事项：**
- 每个变量需要单独添加
- 确保变量名完全一致（包括大小写）
- 所有以 `NEXT_PUBLIC_` 开头的变量会在客户端可用
- 可以为不同环境（Production, Preview, Development）设置不同的值

### 步骤 5：部署

1. 检查所有配置无误后，点击 **"Deploy"** 按钮
2. Vercel 会开始构建和部署你的项目
3. 部署过程通常需要 1-3 分钟
4. 部署完成后，你会看到一个成功页面，包含你的项目 URL

### 步骤 6：访问你的应用

部署成功后，Vercel 会为你提供：
- **Production URL**：`https://your-project-name.vercel.app`
- 你也可以绑定自定义域名

## 后续更新

每次你向 GitHub 仓库推送代码时，Vercel 会自动触发新的部署：

```bash
git add .
git commit -m "Update feature"
git push origin main
```

## 常见问题

### Q1: 部署失败怎么办？

查看 Vercel 的构建日志（Build Logs），通常会显示具体的错误信息。常见问题：
- 缺少依赖包：检查 `package.json` 是否完整
- TypeScript 错误：修复代码中的类型错误
- 环境变量缺失：确保所有必需的环境变量都已配置

### Q2: 如何查看部署日志？

1. 进入 Vercel 项目页面
2. 点击 **"Deployments"** 标签
3. 点击具体的部署记录
4. 查看 **"Building"** 和 **"Logs"** 部分

### Q3: 如何回滚到之前的版本？

1. 进入 **"Deployments"** 页面
2. 找到想要回滚的版本
3. 点击右侧的 **"···"** 菜单
4. 选择 **"Promote to Production"**

### Q4: 如何添加自定义域名？

1. 进入项目设置
2. 点击 **"Domains"** 标签
3. 输入你的域名并点击 **"Add"**
4. 按照指引在你的域名服务商处配置 DNS 记录

### Q5: 环境变量更新后如何生效？

环境变量更新后，需要重新部署项目：
1. 进入项目页面
2. 点击 **"Deployments"** 标签
3. 找到最新的部署
4. 点击 **"Redeploy"** 按钮

## 性能优化建议

1. **启用 Analytics**：在 Vercel 项目设置中启用 Analytics 功能
2. **配置缓存**：Vercel 会自动处理 Next.js 的缓存策略
3. **图片优化**：使用 Next.js 的 `<Image>` 组件自动优化图片
4. **代码分割**：Next.js 自动进行代码分割，确保正确使用动态导入

## 安全建议

1. **不要提交 `.env.local` 文件到 Git**：确保 `.env.local` 在 `.gitignore` 中
2. **敏感信息使用环境变量**：所有密钥和私密信息都应通过环境变量配置
3. **定期更新依赖**：运行 `npm audit` 检查安全漏洞

## 监控和调试

### 查看实时日志

1. 进入 Vercel 项目页面
2. 点击 **"Functions"** 标签
3. 选择具体的函数查看实时日志

### 性能监控

Vercel 提供内置的性能监控：
- **Web Vitals**：Core Web Vitals 指标
- **Real-time Analytics**：实时访问统计
- **Edge Network**：全球 CDN 分布

## 总结

Vercel 部署流程：
1. ✅ 推送代码到 GitHub
2. ✅ 连接 Vercel 并导入仓库
3. ✅ 配置环境变量
4. ✅ 点击部署
5. ✅ 访问你的应用

祝部署顺利！🎉

## 相关链接

- [Vercel 官方文档](https://vercel.com/docs)
- [Next.js 部署文档](https://nextjs.org/docs/deployment)
- [Vercel CLI 工具](https://vercel.com/docs/cli)
