const ResumeAutoFiller = require('./main.js');

class AdvancedResumeAutoFiller extends ResumeAutoFiller {
    constructor() {
        super();
        this.siteConfigs = this.loadSiteConfigs();
    }

    // 加载不同网站的特定配置
    loadSiteConfigs() {
        return {
            'seek.com.au': {
                name: 'Seek Australia',
                selectors: {
                    name: 'input[name="firstName"], input[data-automation="firstName"], input[placeholder*="first name" i]',
                    lastName: 'input[name="lastName"], input[data-automation="lastName"], input[placeholder*="last name" i]',
                    email: 'input[name="email"], input[data-automation="email"], input[type="email"]',
                    phone: 'input[name="phoneNumber"], input[data-automation="phoneNumber"], input[type="tel"]',
                    location: 'input[name="location"], input[data-automation="location"], input[placeholder*="location" i]',
                    coverLetter: 'textarea[name="coverLetter"], textarea[data-automation="coverLetter"]',
                    resume: 'input[type="file"][accept*="pdf"], input[data-automation="resume-upload"]',
                    submit: 'button[type="submit"], button[data-automation="apply-button"], .apply-button'
                },
                waitTime: 3000,
                pageLoadWait: 5000
            },
            'seek.co.nz': {
                name: 'Seek New Zealand',
                selectors: {
                    name: 'input[name="firstName"], input[data-automation="firstName"]',
                    lastName: 'input[name="lastName"], input[data-automation="lastName"]',
                    email: 'input[name="email"], input[data-automation="email"]',
                    phone: 'input[name="phoneNumber"], input[data-automation="phoneNumber"]',
                    location: 'input[name="location"], input[data-automation="location"]',
                    coverLetter: 'textarea[name="coverLetter"], textarea[data-automation="coverLetter"]',
                    resume: 'input[type="file"][accept*="pdf"]',
                    submit: 'button[type="submit"], button[data-automation="apply-button"]'
                },
                waitTime: 3000,
                pageLoadWait: 5000
            },
            'zhaopin.com': {
                name: '智联招聘',
                selectors: {
                    name: 'input[name="realName"]',
                    email: 'input[name="email"]',
                    phone: 'input[name="mobile"]',
                    submit: '.btn-save'
                },
                waitTime: 3000
            },
            '51job.com': {
                name: '前程无忧',
                selectors: {
                    name: '#txtRealName',
                    email: '#txtEmail',
                    phone: '#txtMobile',
                    submit: '#btnSave'
                },
                waitTime: 2000
            },
            'lagou.com': {
                name: '拉勾网',
                selectors: {
                    name: 'input[placeholder="请输入真实姓名"]',
                    email: 'input[placeholder="邮箱"]',
                    phone: 'input[placeholder="手机号"]',
                    submit: '.submit-btn'
                },
                waitTime: 2000
            },
            'boss.zhipin.com': {
                name: 'BOSS直聘',
                selectors: {
                    name: '.name-input input',
                    email: '.email-input input',
                    phone: '.phone-input input',
                    submit: '.complete-btn'
                },
                waitTime: 2500
            }
        };
    }

    // 根据网站URL获取特定配置
    getSiteConfig(url) {
        for (const domain in this.siteConfigs) {
            if (url.includes(domain)) {
                return this.siteConfigs[domain];
            }
        }
        return null;
    }

    // 智能表单填充（增强版）
    async smartFillForm(url) {
        const siteConfig = this.getSiteConfig(url);
        
        if (siteConfig) {
            console.log(`检测到特定网站配置: ${siteConfig.name}`);
            await this.fillWithSiteConfig(siteConfig);
        } else {
            console.log('使用通用填充策略');
            await this.autoFillForm();
        }
    }

    // 使用网站特定配置填充
    async fillWithSiteConfig(config) {
        await new Promise(resolve => setTimeout(resolve, config.waitTime));

        try {
            console.log(`使用 ${config.name} 的特定配置进行填充...`);
            
            // Seek网站的特殊处理
            if (config.name.includes('Seek')) {
                await this.fillSeekForm(config);
            } else {
                // 其他网站的通用处理
                await this.fillGenericSiteForm(config);
            }

            console.log(`${config.name} 特定字段填充完成`);
        } catch (error) {
            console.error('使用网站配置填充失败，转为通用填充:', error);
            await this.autoFillForm();
        }
    }

    // Seek网站专用填充方法
    async fillSeekForm(config) {
        // 等待页面完全加载
        await new Promise(resolve => setTimeout(resolve, config.pageLoadWait || 5000));
        
        // 填充名字（分开的姓和名）
        if (config.selectors.name) {
            await this.fillSpecificField(config.selectors.name, this.userInfo.personal.name.split(' ')[0] || this.userInfo.personal.name);
        }
        
        if (config.selectors.lastName) {
            await this.fillSpecificField(config.selectors.lastName, this.userInfo.personal.name.split(' ')[1] || '');
        }
        
        // 填充邮箱
        if (config.selectors.email) {
            await this.fillSpecificField(config.selectors.email, this.userInfo.personal.email);
        }
        
        // 填充电话
        if (config.selectors.phone) {
            await this.fillSpecificField(config.selectors.phone, this.userInfo.personal.phone);
        }
        
        // 填充位置/地址
        if (config.selectors.location) {
            await this.fillSpecificField(config.selectors.location, this.userInfo.personal.address);
        }
        
        // 填充求职信
        if (config.selectors.coverLetter) {
            const coverLetter = this.generateCoverLetter();
            await this.fillSpecificField(config.selectors.coverLetter, coverLetter);
        }
        
        console.log('Seek表单核心字段填充完成');
    }

    // 其他网站的通用填充方法
    async fillGenericSiteForm(config) {
        // 使用网站特定的选择器
        if (config.selectors.name) {
            await this.fillSpecificField(config.selectors.name, this.userInfo.personal.name);
        }
        
        if (config.selectors.email) {
            await this.fillSpecificField(config.selectors.email, this.userInfo.personal.email);
        }
        
        if (config.selectors.phone) {
            await this.fillSpecificField(config.selectors.phone, this.userInfo.personal.phone);
        }
    }

    // 填充特定字段
    async fillSpecificField(selector, value) {
        try {
            await this.page.waitForSelector(selector, { timeout: 5000 });
            const element = await this.page.$(selector);
            if (element) {
                await element.click();
                await element.evaluate(el => el.value = '');
                await element.type(value, { delay: 100 });
                console.log(`已填充 ${selector}: ${value}`);
                return true;
            }
        } catch (error) {
            console.log(`填充字段 ${selector} 失败:`, error.message);
        }
        return false;
    }

    // 处理文件上传（简历上传）
    async uploadResume(resumePath) {
        const uploadSelectors = [
            'input[type="file"][accept*="pdf"]',
            'input[type="file"][name*="resume"]',
            'input[type="file"][id*="resume"]',
            '.upload-file input',
            '.file-upload input'
        ];

        for (const selector of uploadSelectors) {
            try {
                const fileInput = await this.page.$(selector);
                if (fileInput) {
                    await fileInput.uploadFile(resumePath);
                    console.log(`简历文件已上传: ${resumePath}`);
                    return true;
                }
            } catch (error) {
                continue;
            }
        }
        
        console.log('未找到文件上传控件');
        return false;
    }

    // 生成基于用户信息的求职信
    generateCoverLetter() {
        const experience = Array.isArray(this.userInfo.experience) ? 
            this.userInfo.experience[0] : this.userInfo.experience;
        
        return `Dear Hiring Manager,

I am writing to express my interest in this position. With my background in ${this.userInfo.education.major} and ${experience?.position || 'professional experience'}, I believe I would be a valuable addition to your team.

In my current role at ${experience?.company || 'my previous company'}, I have ${experience?.description || 'gained valuable experience in relevant technologies and methodologies'}. My technical skills include ${this.getSkillsText()}, which align well with the requirements of this position.

I am particularly drawn to this opportunity because it would allow me to apply my expertise while continuing to grow professionally. I am confident that my ${this.userInfo.education.degree} in ${this.userInfo.education.major} from ${this.userInfo.education.university}, combined with my practical experience, makes me a strong candidate for this role.

Thank you for considering my application. I look forward to the opportunity to discuss how my skills and enthusiasm can contribute to your team.

Best regards,
${this.userInfo.personal.name}`;
    }

    // 获取技能文本
    getSkillsText() {
        if (Array.isArray(this.userInfo.skills)) {
            return this.userInfo.skills.join(', ');
        } else if (this.userInfo.skills && typeof this.userInfo.skills === 'object') {
            const allSkills = [];
            Object.values(this.userInfo.skills).forEach(skillGroup => {
                if (Array.isArray(skillGroup)) {
                    allSkills.push(...skillGroup);
                }
            });
            return allSkills.join(', ');
        }
        return 'various technical skills';
    }

    // Seek特定的文件上传处理
    async handleSeekFileUpload(resumePath) {
        const uploadSelectors = [
            'input[type="file"][accept*="pdf"]',
            'input[data-automation="resume-upload"]',
            'input[name*="resume"]',
            '.upload-resume input[type="file"]',
            '.file-upload input'
        ];

        for (const selector of uploadSelectors) {
            try {
                await this.page.waitForSelector(selector, { timeout: 5000 });
                const fileInput = await this.page.$(selector);
                if (fileInput) {
                    await fileInput.uploadFile(resumePath);
                    console.log(`✅ 简历文件已上传到Seek: ${resumePath}`);
                    
                    // 等待文件上传完成
                    await new Promise(resolve => setTimeout(resolve, 3000));
                    return true;
                }
            } catch (error) {
                console.log(`尝试选择器 ${selector} 失败:`, error.message);
                continue;
            }
        }
        
        console.log('❌ 未找到Seek的文件上传控件');
        return false;
    }

    // 处理Seek的隐私和条款确认
    async handleSeekPrivacyConsent() {
        const consentSelectors = [
            'input[type="checkbox"][name*="privacy"]',
            'input[type="checkbox"][name*="terms"]',
            'input[type="checkbox"][name*="consent"]',
            'input[data-automation*="privacy"]',
            'input[data-automation*="terms"]',
            '.privacy-checkbox input',
            '.terms-checkbox input'
        ];

        let consentHandled = false;
        for (const selector of consentSelectors) {
            try {
                const checkbox = await this.page.$(selector);
                if (checkbox) {
                    const isChecked = await checkbox.evaluate(el => el.checked);
                    if (!isChecked) {
                        await checkbox.click();
                        console.log(`✅ 已同意隐私条款: ${selector}`);
                        consentHandled = true;
                    }
                }
            } catch (error) {
                continue;
            }
        }
        
        return consentHandled;
    }

    // 处理验证码
    async handleCaptcha() {
        const captchaSelectors = [
            '.captcha img',
            '#captcha-img',
            '[src*="captcha"]',
            '.verification-code img'
        ];

        for (const selector of captchaSelectors) {
            try {
                const captchaImg = await this.page.$(selector);
                if (captchaImg) {
                    console.log('检测到验证码，请手动输入');
                    await this.waitForUserConfirmation('请手动输入验证码，完成后按回车键继续...');
                    return true;
                }
            } catch (error) {
                continue;
            }
        }
        return false;
    }

    // 增强的运行流程
    async run(url, options = {}) {
        try {
            await this.init();
            
            const siteInfo = await this.visitWebsite(url);
            const siteConfig = this.getSiteConfig(url);
            
            // Seek网站的特殊处理流程
            if (siteConfig && siteConfig.name.includes('Seek')) {
                console.log('🇦🇺 检测到Seek网站，启用专用处理流程...');
                await this.handleSeekSpecificFlow(siteConfig, options);
            } else {
                // 其他网站的标准流程
                await this.handleStandardFlow(siteConfig, options);
            }
            
        } catch (error) {
            console.error('执行过程中出错:', error);
        } finally {
            if (!options.keepOpen) {
                await this.close();
            }
        }
    }

    // Seek网站专用处理流程
    async handleSeekSpecificFlow(siteConfig, options) {
        try {
            // 处理验证码
            await this.handleCaptcha();
            
            // 等待Seek页面完全加载
            await new Promise(resolve => setTimeout(resolve, siteConfig.pageLoadWait || 5000));
            
            // 智能填充表单
            await this.smartFillForm(this.page.url());
            
            // 处理隐私条款确认
            await this.handleSeekPrivacyConsent();
            
            // 如果提供了简历文件路径，使用Seek专用上传方法
            if (options.resumePath) {
                await this.handleSeekFileUpload(options.resumePath);
            }
            
            await this.takeScreenshot(`seek-filled-form-${Date.now()}.png`);
            
            if (options.autoSubmit) {
                await this.submitSeekForm(siteConfig);
            } else {
                await this.waitForUserConfirmation('🇦🇺 Seek表单已填充完成，请检查信息。按回车键提交申请...');
                await this.submitSeekForm(siteConfig);
            }
            
            await new Promise(resolve => setTimeout(resolve, 5000));
            await this.takeScreenshot(`seek-submitted-${Date.now()}.png`);
            
            console.log('🎉 Seek申请提交完成！');
            
        } catch (error) {
            console.error('Seek处理流程出错:', error);
            throw error;
        }
    }

    // 标准网站处理流程
    async handleStandardFlow(siteConfig, options) {
        // 处理验证码
        await this.handleCaptcha();
        
        // 智能填充表单
        await this.smartFillForm(this.page.url());
        
        // 如果提供了简历文件路径，尝试上传
        if (options.resumePath) {
            await this.uploadResume(options.resumePath);
        }
        
        await this.takeScreenshot(`filled-form-${Date.now()}.png`);
        
        if (options.autoSubmit) {
            await this.submitForm();
        } else {
            await this.waitForUserConfirmation('表单已填充完成，按回车键提交表单...');
            await this.submitForm();
        }
        
        await new Promise(resolve => setTimeout(resolve, 5000));
        await this.takeScreenshot(`submitted-${Date.now()}.png`);
    }

    // Seek专用提交方法
    async submitSeekForm(siteConfig) {
        console.log('🚀 正在提交Seek申请...');

        const seekSubmitSelectors = siteConfig.selectors.submit.split(', ').concat([
            'button[data-automation="apply-button"]',
            'button[type="submit"]',
            '.apply-button',
            '.submit-application',
            'input[type="submit"][value*="Apply"]',
            'button:contains("Apply")'
        ]);

        for (const selector of seekSubmitSelectors) {
            try {
                const button = await this.page.$(selector);
                if (button) {
                    // 检查按钮是否可点击
                    const isEnabled = await button.evaluate(el => !el.disabled);
                    if (isEnabled) {
                        await button.click();
                        console.log('✅ Seek申请已提交！');
                        await new Promise(resolve => setTimeout(resolve, 3000));
                        return true;
                    }
                }
            } catch (error) {
                continue;
            }
        }

        console.log('❌ 未找到Seek提交按钮或按钮不可用');
        return false;
    }
}

module.exports = AdvancedResumeAutoFiller;
