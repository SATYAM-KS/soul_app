# Contributing to SoulSignal 💕

Thank you for your interest in contributing to SoulSignal! This document provides guidelines and information for contributors.

## 🤝 How to Contribute

### 1. Fork and Clone
1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/yourusername/soulsignal.git
   cd soulsignal
   ```

### 2. Set Up Development Environment
1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file with your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

### 3. Create a Feature Branch
```bash
git checkout -b feature/your-feature-name
```

### 4. Make Your Changes
- Write clean, readable code
- Follow the existing code style
- Add comments for complex logic
- Test your changes thoroughly

### 5. Commit Your Changes
```bash
git add .
git commit -m "feat: add your feature description"
```

### 6. Push and Create Pull Request
```bash
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub.

## 📝 Code Style Guidelines

### JavaScript/React
- Use functional components with hooks
- Follow React best practices
- Use meaningful variable and function names
- Add PropTypes or TypeScript types for props

### CSS
- Use the existing color scheme variables
- Follow BEM methodology for class naming
- Keep styles modular and reusable
- Use CSS custom properties for theming

### File Structure
```
src/
├── components/          # React components
├── services/           # API and business logic
├── lib/               # Utility libraries
├── assets/            # Static assets
└── styles/            # Global styles
```

## 🧪 Testing

### Before Submitting
1. Test your changes in different browsers
2. Test mobile and PC layouts
3. Verify OTP authentication works
4. Check camera functionality
5. Ensure responsive design works

### Testing Checklist
- [ ] Mobile layout works correctly
- [ ] PC layout works correctly
- [ ] OTP sending and verification
- [ ] Photo capture and selection
- [ ] Form validation
- [ ] Error handling
- [ ] Loading states
- [ ] Responsive design

## 🐛 Bug Reports

### Before Reporting
1. Check if the issue is already reported
2. Try to reproduce the issue
3. Check browser console for errors
4. Verify your environment setup

### Bug Report Template
```markdown
**Bug Description**
Brief description of the issue

**Steps to Reproduce**
1. Step 1
2. Step 2
3. Step 3

**Expected Behavior**
What should happen

**Actual Behavior**
What actually happens

**Environment**
- Browser: [e.g., Chrome 120]
- OS: [e.g., Windows 11]
- Device: [e.g., Desktop/Mobile]

**Additional Information**
Screenshots, console logs, etc.
```

## ✨ Feature Requests

### Feature Request Template
```markdown
**Feature Description**
Brief description of the feature

**Use Case**
Why this feature would be useful

**Proposed Implementation**
How you think it should work

**Additional Information**
Mockups, examples, etc.
```

## 🔧 Development Setup

### Prerequisites
- Node.js 16+
- npm or yarn
- Git
- Supabase account

### Local Development
1. **Clone and setup** (see above)
2. **Database setup**: Follow the README.md Supabase setup guide
3. **Environment variables**: Configure your `.env` file
4. **Start development**: `npm run dev`

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint (if configured)
```

## 📚 Documentation

### Code Documentation
- Add JSDoc comments for functions
- Document complex components
- Update README.md for new features
- Add inline comments for business logic

### API Documentation
- Document service functions
- Explain data structures
- Provide usage examples
- Update Supabase setup guide

## 🚀 Deployment

### Testing Production Build
```bash
npm run build
npm run preview
```

### Deployment Checklist
- [ ] Build succeeds without errors
- [ ] Environment variables are set
- [ ] Supabase is configured
- [ ] Database tables are created
- [ ] Storage policies are set
- [ ] Authentication is working

## 🤝 Community Guidelines

### Be Respectful
- Treat all contributors with respect
- Be patient with newcomers
- Provide constructive feedback
- Help others learn and grow

### Communication
- Use clear, concise language
- Ask questions when unsure
- Share knowledge and resources
- Be open to different perspectives

## 📞 Getting Help

### Need Help?
- Check the README.md first
- Search existing issues
- Ask in GitHub Discussions
- Join our community chat

### Resources
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Supabase Documentation](https://supabase.com/docs)
- [GitHub Guides](https://guides.github.com/)

## 🎯 Contribution Areas

### High Priority
- Bug fixes
- Security improvements
- Performance optimizations
- Accessibility improvements

### Medium Priority
- New features
- UI/UX improvements
- Code refactoring
- Documentation updates

### Low Priority
- Cosmetic changes
- Minor optimizations
- Additional examples
- Code style improvements

## 🏆 Recognition

### Contributors
- All contributors are listed in the README.md
- Significant contributions get special recognition
- Contributors can add their name to the project

### How to Get Recognized
- Make meaningful contributions
- Help other contributors
- Improve documentation
- Report and fix bugs
- Suggest and implement features

---

**Thank you for contributing to SoulSignal! 💕**

Your contributions help make dating apps more meaningful and authentic.
