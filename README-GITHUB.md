# 🤖 Puppeteer Resume AutoFill

[![Node.js Version](https://img.shields.io/badge/node.js-%3E%3D14.0.0-brightgreen.svg)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Puppeteer](https://img.shields.io/badge/Puppeteer-24.22.0-blue.svg)](https://pptr.dev/)

> 🚀 An intelligent resume auto-fill tool powered by Puppeteer for automated job applications. Specially optimized for Seek (Australia/New Zealand) and other major job platforms.

## ✨ Features

- 🎯 **Smart Form Recognition** - Automatically identifies and fills form fields
- 🇦🇺 **Seek Specialized** - Built-in support for Seek.com.au and Seek.co.nz
- 📝 **Auto Cover Letter** - Generates personalized cover letters based on your profile
- 📎 **Resume Upload** - Automatic PDF resume file upload
- 🔒 **Privacy Compliant** - Handles privacy consent and terms automatically
- 📸 **Application Recording** - Screenshots of every application for your records
- 🚦 **Safe & Controlled** - User confirmation before submission
- 🔄 **Batch Applications** - Search and apply to multiple jobs efficiently

## 🚀 Quick Start

### Prerequisites

- Node.js 14.0.0 or higher
- npm 6.0.0 or higher

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/puppeteer-resume-autofill.git
cd puppeteer-resume-autofill

# Install dependencies
npm install

# Test the setup
npm run demo
```

### Basic Usage

1. **Configure your profile:**
   ```bash
   # Edit the configuration file with your details
   cp config/seek-user-info.json.example config/seek-user-info.json
   # Then edit config/seek-user-info.json with your information
   ```

2. **Run a test:**
   ```bash
   npm run demo
   ```

3. **Apply to Seek jobs:**
   ```bash
   # Search and apply to jobs
   node seek-applier.js search "Software Engineer" "Sydney NSW" 3
   
   # Apply to specific job
   node seek-applier.js apply https://www.seek.com.au/job/123456
   ```

## 🎯 Seek Integration

This tool is specially optimized for Seek (Australia's #1 job site):

```bash
# Show Seek commands
npm run seek:help

# Search and apply for jobs
npm run seek:search "Frontend Developer" "Melbourne VIC" 5

# Apply to specific position
npm run seek:apply https://www.seek.com.au/job/123456
```

### Supported Seek Features

- ✅ Australian (seek.com.au) and New Zealand (seek.co.nz) sites
- ✅ Automatic name field separation (First Name + Last Name)
- ✅ Location-based job searching
- ✅ Cover letter auto-generation
- ✅ Resume file upload
- ✅ Privacy consent handling
- ✅ Application rate limiting (30s intervals)

## 📁 Project Structure

```
├── main.js                 # Core AutoFill class
├── advanced-filler.js      # Advanced features & site-specific logic
├── seek-applier.js         # Seek-specialized application tool
├── example.js              # Usage examples and testing
├── usage.js                # Quick start guide
├── config/
│   ├── user-info.json.example     # General configuration template
│   └── seek-user-info.json.example # Seek-specific template
├── screenshots/            # Application screenshots
├── README.md              # This file
└── SEEK-README.md         # Detailed Seek documentation
```

## ⚙️ Configuration

### General Configuration (`config/user-info.json`)

```json
{
  "personal": {
    "name": "Your Name",
    "email": "your.email@example.com",
    "phone": "+61 400 123 456",
    "address": "Sydney, NSW, Australia"
  },
  "education": {
    "university": "Your University",
    "major": "Your Major",
    "degree": "Bachelor/Master/PhD"
  },
  "experience": [{
    "company": "Company Name",
    "position": "Your Position",
    "description": "What you did there"
  }],
  "skills": ["JavaScript", "Python", "React"]
}
```

### Seek Configuration (`config/seek-user-info.json`)

Extended configuration for Australian/New Zealand job applications with additional fields like visa status, salary expectations, and work preferences.

## 🛡️ Supported Platforms

| Platform | Domain | Status | Features |
|----------|---------|--------|----------|
| 🇦🇺 Seek Australia | seek.com.au | ✅ Full Support | Search, Apply, Upload |
| 🇳🇿 Seek New Zealand | seek.co.nz | ✅ Full Support | Search, Apply, Upload |
| 🇨🇳 智联招聘 | zhaopin.com | ⚡ Basic Support | Apply |
| 🇨🇳 前程无忧 | 51job.com | ⚡ Basic Support | Apply |
| 🇨🇳 拉勾网 | lagou.com | ⚡ Basic Support | Apply |
| 🇨🇳 BOSS直聘 | boss.zhipin.com | ⚡ Basic Support | Apply |
| Other sites | * | 🔧 Generic Mode | Form Detection |

## 📚 Usage Examples

### Test Mode
```bash
# Run local test form
npm run demo
```

### Seek Applications
```bash
# Get help
npm run seek:help

# Search and apply to multiple jobs
node seek-applier.js search "Data Scientist" "Brisbane QLD" 3

# Apply to specific job URL
node seek-applier.js apply "https://www.seek.com.au/job/123456"
```

### Generic Applications
```bash
# Apply to any job site
node example.js "https://example-job-site.com/apply"
```

## 🔒 Safety Features

- **User Confirmation** - Always asks before submitting applications
- **Rate Limiting** - Built-in delays to prevent bot detection
- **Screenshot Recording** - Visual record of every application
- **Privacy Compliant** - Only uses information you provide
- **Error Handling** - Graceful fallback for unsupported sites

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⚠️ Disclaimer

This tool is for personal job application use only. Users must:

- ✅ Use only truthful personal information
- ✅ Comply with website terms of service
- ✅ Respect application rate limits
- ❌ Not submit false information
- ❌ Not abuse automated features

## 🙋‍♂️ Support

- 📖 Check the [Seek-specific documentation](SEEK-README.md)
- 🐛 Report bugs via [GitHub Issues](https://github.com/yourusername/puppeteer-resume-autofill/issues)
- 💬 Join discussions in [GitHub Discussions](https://github.com/yourusername/puppeteer-resume-autofill/discussions)

## 🌟 Star History

[![Star History Chart](https://api.star-history.com/svg?repos=yourusername/puppeteer-resume-autofill&type=Date)](https://star-history.com/#yourusername/puppeteer-resume-autofill&Date)

---

<div align="center">
Made with ❤️ for job seekers worldwide
</div>