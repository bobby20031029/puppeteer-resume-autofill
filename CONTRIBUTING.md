# Contributing to Puppeteer Resume AutoFill

Thank you for considering contributing to this project! 🎉

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check if the issue already exists. When you are creating a bug report, please include as many details as possible:

- Use a clear and descriptive title
- Describe the exact steps which reproduce the problem
- Provide specific examples to demonstrate the steps
- Describe the behavior you observed after following the steps
- Explain which behavior you expected to see instead and why
- Include screenshots if applicable
- Include your environment details (OS, Node.js version, etc.)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

- Use a clear and descriptive title
- Provide a step-by-step description of the suggested enhancement
- Provide specific examples to demonstrate the steps
- Describe the current behavior and explain which behavior you expected to see instead
- Explain why this enhancement would be useful

### Adding Website Support

We welcome contributions that add support for new job websites! Please:

1. Create an issue first using the "Website Support Request" template
2. Follow the existing pattern in `advanced-filler.js` for adding site configs
3. Test thoroughly with the target website
4. Update documentation

### Pull Requests

1. Fork the repo and create your branch from `main`
2. If you've added code, add tests
3. If you've changed APIs, update the documentation
4. Ensure the test suite passes
5. Make sure your code lints
6. Issue that pull request!

## Development Setup

1. Fork and clone the repository
2. Install dependencies: `npm install`
3. Run tests: `npm run test`
4. Make your changes
5. Test your changes thoroughly

## Style Guidelines

- Use meaningful variable and function names
- Add comments for complex logic
- Follow existing code formatting
- Keep functions focused and small
- Use async/await for asynchronous operations

## Website-Specific Contributions

When adding support for a new website:

1. Add site configuration to the `loadSiteConfigs()` method
2. Include proper selectors for form fields
3. Handle site-specific features (file uploads, multi-step forms, etc.)
4. Add error handling for site-specific issues
5. Update documentation with the new site support

## Testing

- Always test with the actual target website
- Test both successful and error scenarios
- Test with different user configurations
- Verify screenshots are saved correctly

## Documentation

- Update README.md if you add new features
- Update website support table
- Add examples for new functionality
- Keep documentation clear and concise

## Questions?

Feel free to open an issue for any questions about contributing!