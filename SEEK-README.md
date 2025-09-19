# 🇦🇺 Seek求职自动化工具

专门针对Seek.com.au（澳大利亚）和Seek.co.nz（新西兰）求职网站的自动化申请工具。

## 🌟 Seek专用功能

### ✅ 核心功能
- **智能表单识别** - 自动识别Seek的申请表单字段
- **个人信息填充** - 自动填充姓名、邮箱、电话、地址等
- **求职信生成** - 基于个人信息自动生成个性化求职信
- **简历上传** - 自动上传PDF简历文件
- **隐私条款处理** - 自动同意必要的隐私和使用条款
- **批量申请** - 支持搜索和批量申请多个职位
- **申请记录** - 自动截图保存申请过程

### 🚀 快速开始

#### 1. 配置个人信息
编辑 `config/seek-user-info.json` 文件：

```json
{
  "personal": {
    "name": "你的姓名",
    "email": "your.email@example.com",
    "phone": "+61 400 123 456",
    "address": "Sydney, NSW, Australia"
  },
  "education": {
    "university": "你的大学",
    "major": "专业",
    "degree": "学位"
  },
  "experience": [{
    "company": "公司名称",
    "position": "职位",
    "description": "工作描述"
  }]
}
```

#### 2. 基本使用命令

```bash
# 显示帮助信息
npm run seek:help

# 搜索并申请工作（推荐）
node seek-applier.js search "Software Engineer" "Sydney NSW" 3

# 申请特定工作
node seek-applier.js apply https://www.seek.com.au/job/123456

# 测试Seek网站连接
npm run seek:test
```

### 📋 详细使用指南

#### 搜索和批量申请
```bash
# 基本搜索
node seek-applier.js search

# 自定义搜索
node seek-applier.js search "关键词" "地点" 申请数量

# 实际示例
node seek-applier.js search "Frontend Developer" "Melbourne VIC" 5
node seek-applier.js search "Data Analyst" "Brisbane QLD" 3
node seek-applier.js search "DevOps Engineer" "Perth WA" 2
```

#### 申请单个职位
```bash
# 方法1：直接申请
node seek-applier.js apply "https://www.seek.com.au/job/123456"

# 方法2：使用通用工具
node example.js "https://www.seek.com.au/job/123456"
```

### ⚙️ 高级配置

#### Seek专用选择器配置
工具内置了Seek网站的专用选择器：

```javascript
'seek.com.au': {
  name: 'Seek Australia',
  selectors: {
    name: 'input[data-automation="firstName"]',
    lastName: 'input[data-automation="lastName"]',
    email: 'input[data-automation="email"]',
    phone: 'input[data-automation="phoneNumber"]',
    location: 'input[data-automation="location"]',
    coverLetter: 'textarea[data-automation="coverLetter"]',
    resume: 'input[data-automation="resume-upload"]',
    submit: 'button[data-automation="apply-button"]'
  }
}
```

#### 自定义求职信模板
工具会自动生成基于你信息的求职信，格式如下：

```
Dear Hiring Manager,

I am writing to express my interest in this position. With my background in [专业] and [职位], I believe I would be a valuable addition to your team.

In my current role at [公司], I have [工作描述]. My technical skills include [技能列表], which align well with the requirements of this position.

[个性化内容基于用户配置]

Best regards,
[你的姓名]
```

### 🛡️ 安全特性

#### 用户确认机制
```javascript
const options = {
    autoSubmit: false,        // 需要用户确认后提交
    keepOpen: true,           // 保持浏览器打开供检查
    resumePath: './resume.pdf'// 简历文件路径
};
```

#### 申请间隔控制
为避免被检测为机器人，工具在申请间设置了30秒间隔：

```javascript
// 申请间隔，避免被检测为机器人
await new Promise(resolve => setTimeout(resolve, 30000));
```

### 📸 申请记录

所有申请过程都会自动截图保存到 `screenshots/` 目录：
- `seek-filled-form-[时间戳].png` - 填充完成后的截图
- `seek-submitted-[时间戳].png` - 提交后的截图

### 🌏 支持的地区

| 网站 | 地区 | 状态 |
|------|------|------|
| seek.com.au | 澳大利亚 | ✅ 完全支持 |
| seek.co.nz | 新西兰 | ✅ 完全支持 |

### 🔧 故障排除

#### 常见问题

**Q: 提示"未找到申请按钮"？**
A: Seek可能更新了页面结构，或者该职位不支持在线申请。

**Q: 填充信息不正确？**
A: 检查 `config/seek-user-info.json` 配置文件是否正确。

**Q: 上传简历失败？**
A: 确保简历文件是PDF格式，且文件路径正确。

**Q: 被要求验证身份？**
A: 这是正常的安全措施，请按照页面提示手动完成验证。

#### 调试模式

启用详细日志：
```javascript
const applier = new SeekJobApplier();
// 开启调试模式
await applier.run(url, { 
    keepOpen: true,  // 保持浏览器打开
    headless: false  // 显示浏览器界面
});
```

### 📝 最佳实践

1. **首次使用**
   - 先使用测试模式验证配置
   - 检查生成的求职信是否合适
   - 确认个人信息准确无误

2. **批量申请**
   - 设置合理的申请数量（建议不超过10个/天）
   - 定期检查申请状态
   - 根据反馈调整求职信内容

3. **安全建议**
   - 不要在公共网络使用
   - 定期更新个人信息
   - 遵守Seek的使用条款

### ⚖️ 法律和道德考虑

- ✅ 仅填充真实个人信息
- ✅ 遵守网站使用条款
- ✅ 尊重申请频率限制
- ❌ 不提交虚假信息
- ❌ 不滥用自动化功能

### 🔄 更新日志

#### v1.0.0 - Seek专版
- ✅ Seek网站专用选择器
- ✅ 自动求职信生成
- ✅ 批量搜索申请功能
- ✅ 隐私条款自动处理
- ✅ 澳洲/新西兰双支持

---

**免责声明**: 此工具仅供个人求职使用，使用者需要遵守Seek网站的使用条款和相关法律法规。
