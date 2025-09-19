const AdvancedResumeAutoFiller = require('./advanced-filler.js');
const path = require('path');
const fs = require('fs');

class SeekJobApplier extends AdvancedResumeAutoFiller {
    constructor() {
        super();
        // 加载Seek专用配置
        this.loadSeekConfig();
    }

    // 加载Seek专用用户信息
    loadSeekConfig() {
        try {
            const seekConfigPath = path.join(__dirname, 'config', 'seek-user-info.json');
            if (fs.existsSync(seekConfigPath)) {
                this.userInfo = JSON.parse(fs.readFileSync(seekConfigPath, 'utf8'));
                console.log('✅ 已加载Seek专用配置');
            }
        } catch (error) {
            console.log('⚠️  使用默认配置，建议创建seek-user-info.json');
        }
    }

    // Seek专用的工作搜索和申请流程
    async searchAndApplyJobs(searchOptions = {}) {
        console.log('🔍 开始在Seek上搜索和申请工作...');
        
        const defaultOptions = {
            keywords: 'Software Engineer',
            location: 'Sydney NSW',
            maxApplications: 5,
            salaryMin: 80000,
            jobType: 'Full Time'
        };
        
        const options = { ...defaultOptions, ...searchOptions };
        
        try {
            await this.init();
            
            // 访问Seek主页
            await this.visitWebsite('https://www.seek.com.au');
            
            // 执行搜索
            await this.performJobSearch(options);
            
            // 获取工作列表
            const jobLinks = await this.getJobLinks(options.maxApplications);
            
            console.log(`📋 找到 ${jobLinks.length} 个工作机会`);
            
            // 逐个申请工作
            for (let i = 0; i < jobLinks.length; i++) {
                const jobLink = jobLinks[i];
                console.log(`\n📝 申请工作 ${i + 1}/${jobLinks.length}: ${jobLink}`);
                
                try {
                    await this.applyToJob(jobLink);
                    console.log(`✅ 工作 ${i + 1} 申请成功`);
                    
                    // 申请间隔，避免被检测为机器人
                    await new Promise(resolve => setTimeout(resolve, 30000)); // 30秒间隔
                    
                } catch (error) {
                    console.error(`❌ 工作 ${i + 1} 申请失败:`, error.message);
                    continue;
                }
            }
            
            console.log('🎉 所有工作申请完成！');
            
        } catch (error) {
            console.error('Seek工作申请流程出错:', error);
        } finally {
            await this.close();
        }
    }

    // 执行工作搜索
    async performJobSearch(options) {
        console.log('🔍 搜索工作机会...');
        
        try {
            // 填充搜索关键词
            await this.page.waitForSelector('[data-automation="keywords-input"]', { timeout: 10000 });
            await this.page.type('[data-automation="keywords-input"]', options.keywords);
            
            // 填充位置
            await this.page.type('[data-automation="location-input"]', options.location);
            
            // 点击搜索按钮
            await this.page.click('[data-automation="search-button"]');
            
            // 等待搜索结果加载
            await this.page.waitForSelector('[data-automation="searchResults"]', { timeout: 15000 });
            
            console.log('✅ 搜索完成');
            
        } catch (error) {
            throw new Error(`搜索失败: ${error.message}`);
        }
    }

    // 获取工作链接列表
    async getJobLinks(maxJobs = 5) {
        try {
            await this.page.waitForSelector('[data-automation="jobTitle"]', { timeout: 10000 });
            
            const jobLinks = await this.page.evaluate((max) => {
                const jobElements = document.querySelectorAll('[data-automation="jobTitle"] a');
                const links = [];
                
                for (let i = 0; i < Math.min(jobElements.length, max); i++) {
                    const href = jobElements[i].getAttribute('href');
                    if (href) {
                        links.push(href.startsWith('http') ? href : 'https://www.seek.com.au' + href);
                    }
                }
                
                return links;
            }, maxJobs);
            
            return jobLinks;
            
        } catch (error) {
            console.error('获取工作链接失败:', error);
            return [];
        }
    }

    // 申请特定工作
    async applyToJob(jobUrl) {
        try {
            // 访问工作详情页
            await this.page.goto(jobUrl, { waitUntil: 'networkidle2' });
            
            // 等待页面加载
            await new Promise(resolve => setTimeout(resolve, 3000));
            
            // 查找申请按钮
            const applyButtonSelectors = [
                '[data-automation="job-detail-apply"]',
                '[data-automation="apply-button"]',
                '.apply-button',
                'button:contains("Apply")',
                'a:contains("Apply")'
            ];
            
            let applyButton = null;
            for (const selector of applyButtonSelectors) {
                try {
                    applyButton = await this.page.$(selector);
                    if (applyButton) break;
                } catch (error) {
                    continue;
                }
            }
            
            if (!applyButton) {
                throw new Error('未找到申请按钮');
            }
            
            // 点击申请按钮
            await applyButton.click();
            
            // 等待申请表单加载
            await new Promise(resolve => setTimeout(resolve, 5000));
            
            // 使用Seek专用流程填充和提交表单
            await this.handleSeekSpecificFlow(this.getSiteConfig(jobUrl), {
                autoSubmit: false, // 需要用户确认
                resumePath: null // 根据需要设置简历路径
            });
            
        } catch (error) {
            throw new Error(`申请工作失败: ${error.message}`);
        }
    }
}

// 使用示例
async function main() {
    console.log('🇦🇺 Seek自动求职工具启动\n');
    
    const args = process.argv.slice(2);
    const command = args[0];
    
    if (command === 'search') {
        // 搜索并申请工作
        const applier = new SeekJobApplier();
        
        const searchOptions = {
            keywords: args[1] || 'Software Engineer',
            location: args[2] || 'Sydney NSW',
            maxApplications: parseInt(args[3]) || 3
        };
        
        console.log('搜索配置:', searchOptions);
        await applier.searchAndApplyJobs(searchOptions);
        
    } else if (command === 'apply') {
        // 申请特定工作
        const jobUrl = args[1];
        if (!jobUrl) {
            console.log('请提供工作URL');
            console.log('使用方法: node seek-applier.js apply <job-url>');
            return;
        }
        
        const applier = new SeekJobApplier();
        await applier.applyToJob(jobUrl);
        
    } else {
        // 显示使用帮助
        console.log(`
🇦🇺 Seek自动求职工具使用指南
==============================

📋 命令格式:
┌──────────────────────────────────────────────────────┐
│ node seek-applier.js search [关键词] [地点] [数量]   │  # 搜索并申请工作
│ node seek-applier.js apply <工作URL>                 │  # 申请特定工作
└──────────────────────────────────────────────────────┘

🔍 搜索示例:
node seek-applier.js search "Software Engineer" "Melbourne VIC" 5
node seek-applier.js search "Data Analyst" "Brisbane QLD" 3
node seek-applier.js search "Frontend Developer" "Perth WA" 2

📝 申请示例:
node seek-applier.js apply https://www.seek.com.au/job/123456

⚙️  配置文件:
- config/seek-user-info.json  # Seek专用个人信息
- screenshots/                # 申请截图记录

⚠️  重要提醒:
1. 首次使用前请编辑 config/seek-user-info.json
2. 建议设置合理的申请间隔时间
3. 遵守Seek网站的使用条款
4. 申请前请仔细检查个人信息
        `);
    }
}

if (require.main === module) {
    main().catch(console.error);
}

module.exports = SeekJobApplier;
