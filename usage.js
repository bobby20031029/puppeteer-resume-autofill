#!/usr/bin/env node

console.log(`
🎯 Puppeteer 简历自动填充工具 使用指南
===========================================

✅ 安装完成！现在你可以使用以下命令：

📋 基本使用命令：
┌─────────────────────────────────────────────────────┐
│ node example.js test                                │  # 本地测试
│ node example.js https://www.zhaopin.com/           │  # 智联招聘
│ node example.js https://www.51job.com/             │  # 前程无忧  
│ node example.js https://www.lagou.com/             │  # 拉勾网
│ node example.js https://www.boss.zhipin.com/       │  # BOSS直聘
└─────────────────────────────────────────────────────┘

⚙️  配置步骤：
1. 编辑 config/user-info.json 填入你的个人信息
2. 运行测试： node example.js test
3. 访问实际网站进行自动填充

🔧 高级功能：
- 自动识别表单字段
- 智能填充个人信息
- 支持文件上传
- 截图记录功能
- 安全确认机制

⚠️  注意事项：
- 首次使用请先运行测试模式
- 确保个人信息准确无误
- 遵守网站使用条款
- 手动处理验证码

📁 项目文件结构：
├── main.js                 # 核心功能
├── advanced-filler.js      # 高级功能  
├── example.js              # 使用示例
├── config/user-info.json   # 个人信息配置
└── screenshots/            # 截图保存

💡 使用技巧：
1. 运行前先查看目标网站的表单结构
2. 根据需要修改 config/user-info.json
3. 使用测试模式验证配置是否正确
4. 实际使用时保持网络连接稳定

🚀 开始使用：
node example.js test

📖 详细文档：
查看 README.md 了解更多功能和配置选项
`);

// 运行使用指南
if (require.main === module) {
    // 这里已经执行了console.log，不需要额外操作
}
