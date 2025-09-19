# Puppeteer 简历自动填充工具

一个基于 Puppeteer 的智能简历自动填充工具，可以自动访问招聘网站、识别表单字段并填充个人简历信息。

## 功能特点

✅ **智能表单识别** - 自动识别各种表单字段类型  
✅ **多网站支持** - 支持智联招聘、前程无忧、拉勾网、BOSS直聘等主流招聘网站  
✅ **自定义配置** - 可配置个人信息、教育背景、工作经验等  
✅ **截图记录** - 自动保存填充前后的截图  
✅ **验证码处理** - 支持手动处理验证码  
✅ **文件上传** - 支持简历文件上传功能  
✅ **安全可控** - 支持用户确认后再提交表单  

## 安装使用

### 1. 安装依赖
\`\`\`bash
npm install
\`\`\`

### 2. 配置个人信息
编辑 \`config/user-info.json\` 文件，填入你的个人信息：

\`\`\`json
{
  "personal": {
    "name": "你的姓名",
    "email": "your.email@example.com",
    "phone": "13800138000",
    "address": "你的地址"
  },
  "education": {
    "university": "你的大学",
    "major": "你的专业",
    "degree": "学历",
    "graduationYear": "毕业年份"
  },
  "experience": [{
    "company": "公司名称",
    "position": "职位",
    "startDate": "2020-01",
    "endDate": "至今",
    "description": "工作描述"
  }],
  "skills": ["技能1", "技能2", "技能3"]
}
\`\`\`

### 3. 运行工具

#### 基础使用
\`\`\`bash
# 使用指定网站URL
node example.js https://www.zhaopin.com/jobs/

# 使用本地测试表单
node example.js test
\`\`\`

#### 高级使用
\`\`\`javascript
const AdvancedResumeAutoFiller = require('./advanced-filler.js');

const autoFiller = new AdvancedResumeAutoFiller();

// 配置选项
const options = {
    autoSubmit: false,        // 是否自动提交
    keepOpen: false,          // 是否保持浏览器打开
    resumePath: 'path/to/resume.pdf'  // 简历文件路径
};

await autoFiller.run('https://target-website.com', options);
\`\`\`

## 支持的网站

| 网站 | 域名 | 状态 |
|------|------|------|
| 智联招聘 | zhaopin.com | ✅ 已适配 |
| 前程无忧 | 51job.com | ✅ 已适配 |
| 拉勾网 | lagou.com | ✅ 已适配 |
| BOSS直聘 | boss.zhipin.com | ✅ 已适配 |
| 其他网站 | * | ⚡ 通用模式 |

## 项目结构

\`\`\`
puppeter/
├── main.js                 # 核心自动填充类
├── advanced-filler.js      # 高级填充功能
├── example.js              # 使用示例和测试
├── package.json            # 项目配置
├── config/
│   └── user-info.json      # 用户信息配置
└── screenshots/            # 截图保存目录
\`\`\`

## API 说明

### ResumeAutoFiller 类

#### 核心方法

- \`init()\` - 初始化浏览器
- \`visitWebsite(url)\` - 访问目标网站
- \`autoFillForm()\` - 自动填充表单
- \`submitForm()\` - 提交表单
- \`takeScreenshot(filename)\` - 截图保存
- \`close()\` - 关闭浏览器

#### 配置选项

\`\`\`javascript
const options = {
    autoSubmit: false,        // 自动提交表单
    keepOpen: false,          // 保持浏览器打开
    resumePath: null,         // 简历文件路径
    headless: false,          // 无头模式
    timeout: 30000           // 超时时间
};
\`\`\`

### 智能字段识别

工具会自动识别以下类型的表单字段：

- **姓名字段**: \`input[name*="name"]\`, \`input[placeholder*="姓名"]\`
- **邮箱字段**: \`input[type="email"]\`, \`input[name*="email"]\`
- **电话字段**: \`input[type="tel"]\`, \`input[name*="phone"]\`
- **地址字段**: \`input[name*="address"]\`, \`textarea[name*="address"]\`
- **教育背景**: \`input[name*="university"]\`, \`input[name*="school"]\`
- **工作经验**: \`input[name*="company"]\`, \`input[name*="position"]\`

## 使用示例

### 1. 基本使用

\`\`\`bash
# 测试本地表单
node example.js test

# 填充智联招聘
node example.js https://www.zhaopin.com/

# 填充拉勾网
node example.js https://www.lagou.com/
\`\`\`

### 2. 编程方式使用

\`\`\`javascript
const AdvancedResumeAutoFiller = require('./advanced-filler.js');

async function fillJobApplication() {
    const autoFiller = new AdvancedResumeAutoFiller();
    
    try {
        await autoFiller.run('https://example-job-site.com', {
            autoSubmit: false,
            resumePath: './my-resume.pdf'
        });
    } catch (error) {
        console.error('填充失败:', error);
    }
}

fillJobApplication();
\`\`\`

## 注意事项

⚠️ **使用前请注意：**

1. **合法使用** - 请确保在允许自动化的网站上使用，遵守网站的使用条款
2. **数据准确性** - 使用前请检查配置文件中的个人信息是否准确
3. **网站变化** - 网站结构变化可能影响自动填充效果
4. **验证码处理** - 遇到验证码时需要手动输入
5. **网络环境** - 确保网络连接稳定

## 故障排除

### 常见问题

**Q: 提示"找不到字段"怎么办？**  
A: 网站可能更新了结构，可以尝试通用模式或手动更新选择器配置。

**Q: 浏览器启动失败？**  
A: 检查是否已正确安装 Chromium，或尝试设置 \`headless: true\`。

**Q: 填充速度太慢？**  
A: 可以调整 \`delay\` 参数或减少等待时间。

**Q: 验证码无法处理？**  
A: 工具会暂停等待手动输入验证码，按提示操作即可。

### 调试模式

启用调试模式查看详细日志：

\`\`\`javascript
// 在代码中添加调试信息
console.log('当前页面URL:', await page.url());
console.log('页面标题:', await page.title());
\`\`\`

## 更新日志

### v1.0.0
- ✅ 基础自动填充功能
- ✅ 多网站适配
- ✅ 截图保存功能
- ✅ 用户确认机制

## 许可证

MIT License

## 贡献

欢迎提交 Issue 和 Pull Request 来改进这个项目！

---

**免责声明**: 此工具仅供学习和个人使用，使用者需要遵守相关网站的使用条款和法律法规。
