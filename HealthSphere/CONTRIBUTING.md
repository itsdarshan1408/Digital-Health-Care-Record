# Contributing to HealthSphere

First off, thank you for considering contributing to HealthSphere! It's people like you that make HealthSphere such a great tool.

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

* **Use a clear and descriptive title**
* **Describe the exact steps which reproduce the problem**
* **Provide specific examples to demonstrate the steps**
* **Describe the behavior you observed after following the steps**
* **Explain which behavior you expected to see instead and why**
* **Include screenshots if possible**

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

* **Use a clear and descriptive title**
* **Provide a step-by-step description of the suggested enhancement**
* **Provide specific examples to demonstrate the steps**
* **Describe the current behavior and explain which behavior you expected to see instead**
* **Explain why this enhancement would be useful**

### Pull Requests

* Fill in the required template
* Do not include issue numbers in the PR title
* Follow the JavaScript/React style guide
* Include screenshots in your pull request whenever possible
* End all files with a newline
* Avoid platform-dependent code

## Development Process

1. **Fork the repository**
2. **Create a new branch** from `main`:
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes** and commit them:
   ```bash
   git commit -m 'Add some amazing feature'
   ```
4. **Push to the branch**:
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

## Style Guidelines

### Git Commit Messages

* Use the present tense ("Add feature" not "Added feature")
* Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
* Limit the first line to 72 characters or less
* Reference issues and pull requests liberally after the first line

### JavaScript Style Guide

* Use ES6+ syntax
* Use meaningful variable names
* Add comments for complex logic
* Follow existing code formatting
* Use async/await instead of promises when possible

### React Best Practices

* Use functional components with hooks
* Keep components small and focused
* Use prop-types or TypeScript for type checking
* Follow the component file structure:
  ```jsx
  // Imports
  // Component
  // Styles
  // Export
  ```

### CSS/Tailwind Guidelines

* Use Tailwind utility classes
* Follow mobile-first responsive design
* Keep custom CSS minimal
* Use semantic class names

## Project Structure

```
HealthSphere/
├── backend/           # Express.js backend
│   ├── controllers/   # Request handlers
│   ├── models/        # Mongoose models
│   ├── routes/        # API routes
│   ├── middleware/    # Custom middleware
│   └── utils/         # Utility functions
│
└── frontend/          # React frontend
    ├── components/    # Reusable components
    ├── pages/         # Page components
    ├── context/       # React context
    └── utils/         # Utility functions
```

## Testing

* Write tests for new features
* Ensure all tests pass before submitting PR
* Maintain or improve code coverage

```bash
# Backend tests
cd backend
npm test

# Frontend tests (if implemented)
cd frontend
npm test
```

## Documentation

* Update README.md if needed
* Add JSDoc comments to functions
* Update API documentation for new endpoints
* Include examples in documentation

## Code Review Process

The core team looks at Pull Requests on a regular basis. After feedback has been given we expect responses within two weeks. After two weeks we may close the pull request if it isn't showing any activity.

## Community

* Join discussions in GitHub Issues
* Be respectful and constructive
* Help others when possible

## Recognition

Contributors will be recognized in the project README and release notes.

Thank you for contributing to HealthSphere! 🎉
