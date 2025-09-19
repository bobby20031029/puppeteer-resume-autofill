const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

class ResumeAutoFiller {
    constructor() {
        this.browser = null;
        this.page = null;
        this.userInfo = this.loadUserInfo();
    }

    // 加载用户简历信息
    loadUserInfo() {
        try {
            const configPath = path.join(__dirname, 'config', 'user-info.json');
            if (fs.existsSync(configPath)) {
                return JSON.parse(fs.readFileSync(configPath, 'utf8'));
            }
        } catch (error) {
            console.log('配置文件不存在，将使用默认配置');
        }
        
        return {
            personal: {
                name: '张三',
                email: 'zhangsan@example.com',
                phone: '13800138000',
                address: '北京市朝阳区',
                dateOfBirth: '1990-01-01',
                gender: '男'
            },
            education: {
                university: '北京大学',
                major: '计算机科学与技术',
                degree: '本科',
                graduationYear: '2012',
                gpa: '3.8'
            },
            experience: {
                company: '腾讯科技',
                position: '高级软件工程师',
                startDate: '2012-07',
                endDate: '至今',
                description: '负责前端开发和系统架构设计'
            },
            skills: ['JavaScript', 'Python', 'React', 'Node.js', 'MySQL'],
            languages: ['中文（母语）', '英语（流利）']
        };
    }

    // 启动浏览器
    async init() {
        console.log('正在启动浏览器...');
        this.browser = await puppeteer.launch({
            headless: false, // 设置为false可以看到浏览器操作过程
            defaultViewport: null,
            args: [
                '--start-maximized',
                '--no-sandbox',
                '--disable-setuid-sandbox'
            ]
        });

        this.page = await this.browser.newPage();
        await this.page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
        console.log('浏览器启动成功！');
    }

    // 访问网站并获取信息
    async visitWebsite(url) {
        console.log(`正在访问网站: ${url}`);
        await this.page.goto(url, { waitUntil: 'networkidle2' });
        
        // 获取网站标题和基本信息
        const pageInfo = await this.page.evaluate(() => {
            return {
                title: document.title,
                url: window.location.href,
                description: document.querySelector('meta[name="description"]')?.content || '',
                keywords: document.querySelector('meta[name="keywords"]')?.content || ''
            };
        });

        console.log('网站信息:', pageInfo);
        return pageInfo;
    }

    // 智能识别表单字段并填充
    async autoFillForm() {
        console.log('开始自动填充表单...');

        // 等待表单加载
        await new Promise(resolve => setTimeout(resolve, 2000));

        try {
            // 姓名字段
            await this.fillFieldBySelectors([
                'input[name*="name"]',
                'input[id*="name"]',
                'input[placeholder*="姓名"]',
                'input[placeholder*="name"]'
            ], this.userInfo.personal.name);

            // 邮箱字段
            await this.fillFieldBySelectors([
                'input[type="email"]',
                'input[name*="email"]',
                'input[id*="email"]',
                'input[placeholder*="邮箱"]',
                'input[placeholder*="email"]'
            ], this.userInfo.personal.email);

            // 电话字段
            await this.fillFieldBySelectors([
                'input[type="tel"]',
                'input[name*="phone"]',
                'input[name*="mobile"]',
                'input[id*="phone"]',
                'input[placeholder*="电话"]',
                'input[placeholder*="手机"]'
            ], this.userInfo.personal.phone);

            // 地址字段
            await this.fillFieldBySelectors([
                'input[name*="address"]',
                'input[id*="address"]',
                'textarea[name*="address"]',
                'input[placeholder*="地址"]'
            ], this.userInfo.personal.address);

            // 教育背景
            await this.fillFieldBySelectors([
                'input[name*="university"]',
                'input[name*="school"]',
                'input[id*="education"]'
            ], this.userInfo.education.university);

            // 专业
            await this.fillFieldBySelectors([
                'input[name*="major"]',
                'input[name*="subject"]',
                'input[id*="major"]'
            ], this.userInfo.education.major);

            // 工作经验
            await this.fillFieldBySelectors([
                'input[name*="company"]',
                'input[id*="company"]',
                'input[placeholder*="公司"]'
            ], this.userInfo.experience.company);

            await this.fillFieldBySelectors([
                'input[name*="position"]',
                'input[name*="job"]',
                'input[id*="position"]',
                'input[placeholder*="职位"]'
            ], this.userInfo.experience.position);

            // 技能（如果是文本区域）
            const skillsText = Array.isArray(this.userInfo.skills) ? 
                this.userInfo.skills.join(', ') : 
                this.userInfo.skills.programming ? 
                this.userInfo.skills.programming.join(', ') : 
                ''; 
            
            await this.fillFieldBySelectors([
                'textarea[name*="skill"]',
                'textarea[id*="skill"]',
                'textarea[placeholder*="技能"]'
            ], skillsText);

            console.log('表单填充完成！');

        } catch (error) {
            console.error('填充表单时出错:', error);
        }
    }

    // 通过多个选择器尝试填充字段
    async fillFieldBySelectors(selectors, value) {
        for (const selector of selectors) {
            try {
                const element = await this.page.$(selector);
                if (element) {
                    await element.click();
                    await element.evaluate(el => el.value = ''); // 清空现有内容
                    await element.type(value, { delay: 50 });
                    console.log(`已填充字段 ${selector}: ${value}`);
                    return true;
                }
            } catch (error) {
                // 继续尝试下一个选择器
                continue;
            }
        }
        return false;
    }

    // 处理下拉选择框
    async selectOption(selectors, value) {
        for (const selector of selectors) {
            try {
                const element = await this.page.$(selector);
                if (element) {
                    await element.select(value);
                    console.log(`已选择选项 ${selector}: ${value}`);
                    return true;
                }
            } catch (error) {
                continue;
            }
        }
        return false;
    }

    // 自动提交表单
    async submitForm() {
        console.log('正在寻找提交按钮...');

        const submitSelectors = [
            'button[type="submit"]',
            'input[type="submit"]',
            'button:contains("提交")',
            'button:contains("submit")',
            'button:contains("发送")',
            'button:contains("申请")',
            '.submit-btn',
            '#submit',
            '.btn-submit'
        ];

        for (const selector of submitSelectors) {
            try {
                const button = await this.page.$(selector);
                if (button) {
                    await button.click();
                    console.log('表单已提交！');
                    await new Promise(resolve => setTimeout(resolve, 3000)); // 等待提交完成
                    return true;
                }
            } catch (error) {
                continue;
            }
        }

        console.log('未找到提交按钮，请手动提交');
        return false;
    }

    // 截图保存
    async takeScreenshot(filename = 'screenshot.png') {
        const screenshotPath = path.join(__dirname, 'screenshots', filename);
        await this.page.screenshot({ 
            path: screenshotPath, 
            fullPage: true 
        });
        console.log(`截图已保存: ${screenshotPath}`);
    }

    // 等待用户确认
    async waitForUserConfirmation(message = '请检查填充结果，按回车键继续...') {
        return new Promise((resolve) => {
            console.log(message);
            process.stdin.once('data', () => {
                resolve();
            });
        });
    }

    // 关闭浏览器
    async close() {
        if (this.browser) {
            await this.browser.close();
            console.log('浏览器已关闭');
        }
    }

    // 主要执行流程
    async run(url) {
        try {
            await this.init();
            
            // 访问网站并获取信息
            const siteInfo = await this.visitWebsite(url);
            
            // 自动填充表单
            await this.autoFillForm();
            
            // 截图保存当前状态
            await this.takeScreenshot(`filled-form-${Date.now()}.png`);
            
            // 等待用户确认
            await this.waitForUserConfirmation('表单已填充完成，请检查信息是否正确。按回车键提交表单，或Ctrl+C取消...');
            
            // 提交表单
            await this.submitForm();
            
            // 等待一段时间查看结果
            await new Promise(resolve => setTimeout(resolve, 5000));
            
            // 截图保存提交后状态
            await this.takeScreenshot(`submitted-${Date.now()}.png`);
            
        } catch (error) {
            console.error('执行过程中出错:', error);
        } finally {
            await this.close();
        }
    }
}

// 使用示例
async function main() {
    const autoFiller = new ResumeAutoFiller();
    
    // 示例：填充一个求职网站的表单
    // 请替换为你要填充的实际网站URL
    const targetUrl = process.argv[2] || 'https://example.com/job-application';
    
    console.log('=== Puppeteer 简历自动填充工具 ===');
    console.log(`目标网站: ${targetUrl}`);
    console.log('正在启动自动填充流程...\n');
    
    await autoFiller.run(targetUrl);
}

// 如果直接运行此文件
if (require.main === module) {
    main().catch(console.error);
}

module.exports = ResumeAutoFiller;
