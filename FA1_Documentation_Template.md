# FA1 Documentation: Feedback Collector CLI Tool

## 1. What is Node.js?

Node.js is a JavaScript runtime environment that allows developers to run JavaScript code outside of web browsers. It's built on Chrome's V8 JavaScript engine and provides:

- **Server-side JavaScript execution**
- **Event-driven, non-blocking I/O model**
- **Large ecosystem via npm (Node Package Manager)**
- **Cross-platform compatibility**

### Key Features:

- Asynchronous and event-driven
- Single-threaded but highly scalable
- Built-in modules for file system, networking, etc.
- NPM package manager with extensive library ecosystem

## 2. Node.js Modules Used in This Project

### Built-in Modules:

1. **fs (File System)**

   - Purpose: Reading and writing files
   - Usage: Storing user credentials and feedback data
   - Functions used: `readFileSync()`, `writeFileSync()`, `existsSync()`, `mkdirSync()`

2. **path**

   - Purpose: Working with file and directory paths
   - Usage: Creating cross-platform file paths
   - Functions used: `path.join()`, `__dirname`

3. **process**
   - Purpose: Information about current Node.js process
   - Usage: Command-line argument parsing
   - Functions used: `process.argv`, `process.exit()`

### External Modules (npm packages):

1. **readline-sync**

   - Version: ^1.4.10
   - Purpose: Synchronous user input from command line
   - Usage: Getting user credentials and feedback input

2. **chalk**
   - Version: ^5.4.1
   - Purpose: Terminal string styling and colors
   - Usage: Color-coding feedback based on sentiment

## 3. Custom NPM Module: feedbackFormatter.js

### Purpose:

Our custom module provides intelligent feedback formatting based on sentiment analysis.

### Location:

`./utils/feedbackFormatter.js`

### Functionality:

```javascript
function formatFeedback(text) {
  if (
    text.toLowerCase().includes('bad') ||
    text.toLowerCase().includes('boring')
  ) {
    return chalk.red(text); // Negative feedback in red
  }
  if (
    text.toLowerCase().includes('good') ||
    text.toLowerCase().includes('great')
  ) {
    return chalk.green(text); // Positive feedback in green
  }
  return chalk.yellow(text); // Neutral feedback in yellow
}
```

### Features:

- **Sentiment Detection**: Analyzes text for positive/negative keywords
- **Color Coding**: Visual feedback using chalk colors
- **Modular Design**: Exportable function for reuse
- **Extensible**: Easy to add more sentiment keywords

### Why Custom Module?

- Demonstrates understanding of Node.js module system
- Shows ability to create reusable code
- Provides project-specific functionality
- Can be potentially published to npm

## 4. Sample CLI Input/Output

### Login Process:

```bash
$ node index.js login
Enter username: admin
Enter password: ****
✅ Welcome, admin
```

### Adding Feedback:

```bash
$ node index.js add-feedback
Enter course code: CS101
Enter feedback: This course is great and very informative!
✅ Feedback saved!
```

### Viewing Feedback:

```bash
$ node index.js view-feedback
Enter course code to view feedback: CS101

📝 1674567890123.txt:
This course is great and very informative! (displayed in green)

📝 1674567891456.txt:
The lectures are boring and hard to follow. (displayed in red)
```

### Error Handling:

```bash
$ node index.js login
Enter username: wronguser
Enter password: wrongpass
❌ Invalid credentials.

$ node index.js view-feedback
Enter course code to view feedback: NONEXISTENT
❌ No feedback found for this course.
```

## 5. Logic Flow Summary

### Application Architecture:

1. **Entry Point (index.js)**:

   - Parses command-line arguments
   - Routes to appropriate functions
   - Handles invalid commands

2. **Authentication (login.js)**:

   - Prompts for username/password
   - Validates against stored credentials
   - Exits on authentication failure

3. **Feedback Management (feedbackManager.js)**:

   - Handles adding new feedback
   - Manages course folder structure
   - Displays existing feedback

4. **Utility Module (feedbackFormatter.js)**:
   - Processes feedback text
   - Applies color formatting
   - Returns formatted output

### Data Flow:

1. User runs CLI command
2. Application authenticates user (if login)
3. User provides course and feedback data
4. System creates course folder if needed
5. Feedback is formatted using custom module
6. Data is saved to file system
7. Confirmation message displayed

### File Structure:

- **Configuration**: `package.json`
- **User Data**: `data/users.txt`
- **Feedback Data**: `data/feedbacks/[COURSE_CODE]/[timestamp].txt`

## 6. Learning Outcomes

### Node.js Concepts Demonstrated:

- Module system (require/exports)
- File system operations
- Command-line argument processing
- npm package management
- Error handling and validation

### Programming Practices:

- Modular code organization
- Separation of concerns
- Input validation
- User experience design
- Documentation

### Real-world Applications:

- CLI tool development
- Data persistence
- User authentication
- File management
- Package publishing preparation

---

**Technology Stack**: Node.js, npm, JavaScript
**Development Environment**: VS Code
**Version Control**: Git
