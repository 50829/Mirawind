# Umami 统计部署指南

## ✅ 已完成的配置

### 1. 本地环境配置

已在 `.env` 文件中配置：
```env
UMAMI_API_KEY=api_K0olCIIwHPUXNUBQvhCGW4BDdNXyYiq5
UMAMI_TRACKING_CODE=<script defer src="https://cloud.umami.is/script.js" data-website-id="a23e1e9e-0eda-4afe-9ae4-e28807721370"></script>
```

### 2. YAML 配置

已在 `twilight.config.yaml` 中启用：
```yaml
umami:
    enabled: true
    baseUrl: "https://api.umami.is"
    websiteId: "a23e1e9e-0eda-4afe-9ae4-e28807721370"
```

## 🚀 部署到 Vercel

### 步骤 1: 在 Vercel 中配置环境变量

1. 登录 Vercel Dashboard: https://vercel.com/dashboard
2. 选择你的项目
3. 进入 **Settings** → **Environment Variables**
4. 添加以下两个环境变量：

#### 变量 1: UMAMI_API_KEY
- **Key**: `UMAMI_API_KEY`
- **Value**: `api_K0olCIIwHPUXNUBQvhCGW4BDdNXyYiq5`
- **Environment**: 选择 `Production`, `Preview`, `Development` (全部勾选)

#### 变量 2: UMAMI_TRACKING_CODE
- **Key**: `UMAMI_TRACKING_CODE`
- **Value**: 
  ```html
  <script defer src="https://cloud.umami.is/script.js" data-website-id="a23e1e9e-0eda-4afe-9ae4-e28807721370"></script>
  ```
- **Environment**: 选择 `Production`, `Preview`, `Development` (全部勾选)

### 步骤 2: 提交并推送代码

```bash
git add .env.example twilight.config.yaml
git commit -m "配置 Umami 统计"
git push origin main
```

**注意**: `.env` 文件已在 `.gitignore` 中，不会被提交到 Git。

### 步骤 3: 等待 Vercel 自动部署

推送代码后，Vercel 会自动触发部署。等待部署完成。

## 📊 验证 Umami 是否正常工作

### 1. 检查页面源代码

访问你的网站，查看页面源代码（右键 → 查看页面源代码），搜索 `umami`，你应该能看到：
```html
<script defer src="https://cloud.umami.is/script.js" data-website-id="a23e1e9e-0eda-4afe-9ae4-e28807721370"></script>
```

### 2. 检查侧边栏统计

如果配置正确，你的侧边栏应该会显示网站统计数据（浏览量、访客数等）。

### 3. 在 Umami 后台查看

登录你的 Umami 后台，应该能看到网站的访问数据开始累积。

## 🎯 Umami 功能说明

### 追踪脚本 (UMAMI_TRACKING_CODE)
- **作用**: 在每个页面加载时记录访问数据
- **位置**: 插入到 `<head>` 标签中
- **效果**: 收集页面浏览量、访客来源、设备信息等

### API 密钥 (UMAMI_API_KEY)
- **作用**: 从 Umami API 获取统计数据
- **位置**: 用于侧边栏显示实时统计
- **效果**: 在你的博客侧边栏显示访问统计

## 🔧 故障排查

### 问题 1: 侧边栏不显示统计数据

**检查**:
- 确认 `twilight.config.yaml` 中 `umami.enabled` 为 `true`
- 检查 Vercel 环境变量是否正确配置
- 查看浏览器控制台是否有错误

### 问题 2: 追踪脚本未加载

**检查**:
- 查看页面源代码，确认 script 标签是否存在
- 检查 `UMAMI_TRACKING_CODE` 环境变量是否正确
- 确认 website-id 是否正确

### 问题 3: 数据不更新

**原因**: Umami 数据可能有缓存
**解决**: 等待几分钟或清除浏览器缓存

## 📝 注意事项

1. **敏感信息**: API Key 已存储在 `.env` 文件中，该文件不会被提交到 Git
2. **环境变量**: 部署到 Vercel 时必须配置环境变量，否则统计功能不会工作
3. **HTTPS**: Umami 追踪脚本在 HTTPS 网站上工作最佳
4. **隐私**: Umami 是隐私友好的分析工具，不使用 Cookie

## 🎉 完成！

配置完成后，你的网站将自动收集访问数据，并在侧边栏显示统计信息。
