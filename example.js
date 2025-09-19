const AdvancedResumeAutoFiller = require('./advanced-filler.js');
const path = require('path');

async function runExample() {
    console.log('=== Puppeteer 智能简历自动填充工具 ===\n');
    
    const autoFiller = new AdvancedResumeAutoFiller();
    
    // 配置选项
    const options = {
        autoSubmit: false,        // 是否自动提交（false表示需要用户确认）
        keepOpen: false,          // 是否保持浏览器打开
        resumePath: null          // 简历文件路径（如果需要上传）
    };
    
    // 从命令行参数获取目标URL
    const targetUrl = process.argv[2];
    
    if (!targetUrl) {
        console.log('使用方法:');
        console.log('node example.js <网站URL>');
        console.log('\n示例:');
        console.log('node example.js https://www.zhaopin.com/jobs/');
        console.log('node example.js https://www.51job.com/');
        console.log('node example.js https://www.lagou.com/');
        console.log('node example.js https://www.boss.zhipin.com/');
        return;
    }
    
    console.log(`目标网站: ${targetUrl}`);
    console.log('配置选项:', options);
    console.log('\n开始执行自动填充流程...\n');
    
    try {
        await autoFiller.run(targetUrl, options);
        console.log('\n✅ 自动填充流程执行完成！');
    } catch (error) {
        console.error('\n❌ 执行失败:', error);
    }
}

// 处理测试网站的函数
async function testWithLocalForm() {
    console.log('=== 本地测试模式 ===\n');
    
    // 创建一个简单的测试HTML文件
    const testHtml = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>简历填充测试表单</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; }
        .form-group { margin-bottom: 15px; }
        label { display: block; margin-bottom: 5px; font-weight: bold; }
        input, textarea, select { width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; }
        textarea { height: 100px; }
        .submit-btn { background: #007bff; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; }
        .submit-btn:hover { background: #0056b3; }
    </style>
</head>
<body>
    <h1>简历信息填充测试表单</h1>
    <form id="resumeForm">
        <div class="form-group">
            <label for="name">姓名:</label>
            <input type="text" id="name" name="name" placeholder="请输入姓名">
        </div>
        
        <div class="form-group">
            <label for="email">邮箱:</label>
            <input type="email" id="email" name="email" placeholder="请输入邮箱">
        </div>
        
        <div class="form-group">
            <label for="phone">电话:</label>
            <input type="tel" id="phone" name="phone" placeholder="请输入电话">
        </div>
        
        <div class="form-group">
            <label for="address">地址:</label>
            <input type="text" id="address" name="address" placeholder="请输入地址">
        </div>
        
        <div class="form-group">
            <label for="university">毕业院校:</label>
            <input type="text" id="university" name="university" placeholder="请输入毕业院校">
        </div>
        
        <div class="form-group">
            <label for="major">专业:</label>
            <input type="text" id="major" name="major" placeholder="请输入专业">
        </div>
        
        <div class="form-group">
            <label for="company">公司:</label>
            <input type="text" id="company" name="company" placeholder="请输入公司名称">
        </div>
        
        <div class="form-group">
            <label for="position">职位:</label>
            <input type="text" id="position" name="position" placeholder="请输入职位">
        </div>
        
        <div class="form-group">
            <label for="skills">技能:</label>
            <textarea id="skills" name="skills" placeholder="请输入技能，用逗号分隔"></textarea>
        </div>
        
        <button type="submit" class="submit-btn">提交申请</button>
    </form>
    
    <script>
        document.getElementById('resumeForm').addEventListener('submit', function(e) {
            e.preventDefault();
            alert('表单提交成功！（这是测试模式）');
            console.log('表单数据:', new FormData(this));
        });
    </script>
</body>
</html>`;

    // 保存测试HTML文件
    const fs = require('fs');
    const testFilePath = path.join(__dirname, 'test-form.html');
    fs.writeFileSync(testFilePath, testHtml);
    
    console.log(`测试表单已创建: ${testFilePath}`);
    
    const autoFiller = new AdvancedResumeAutoFiller();
    const fileUrl = `file:///${testFilePath.replace(/\\/g, '/')}`;
    
    console.log(`正在使用测试表单: ${fileUrl}\n`);
    
    try {
        await autoFiller.run(fileUrl, { autoSubmit: false, keepOpen: false });
        console.log('\n✅ 测试完成！');
    } catch (error) {
        console.error('\n❌ 测试失败:', error);
    }
}

// 主函数
async function main() {
    const args = process.argv.slice(2);
    
    if (args[0] === 'test') {
        await testWithLocalForm();
    } else {
        await runExample();
    }
}

if (require.main === module) {
    main().catch(console.error);
}

module.exports = { runExample, testWithLocalForm };
