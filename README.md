# Feedback Collector CLI Tool

A comprehensive Node.js command-line interface tool for collecting and managing course feedback with role-based authentication, persistent sessions, and advanced error handling.

## 📁 Project Structure

```
feedback-collector-cli/
├── index.js                      # CLI entry point with command routing
├── login.js                      # User authentication with role detection
├── feedbackManager.js            # Feedback and user management operations
├── utils/
│   ├── feedbackFormatter.js      # Custom sentiment-based formatting module
│   ├── userManager.js            # Role-based user management system
│   └── errorHandler.js           # HTTP-style error handling
├── data/
│   ├── users.txt                 # User credentials with roles
│   ├── session.json              # Persistent session storage
│   └── feedbacks/                # Course-specific feedback folders
├── package.json                  # Project configuration
├── package-lock.json             # Dependency lock file
├── README.md                     # This documentation
└── FA1_Documentation_Template.md # Academic submission template
```

## 🚀 Installation

1. Clone or download this project
2. Navigate to the project directory
3. Install dependencies:

```bash
npm install
```

## 💻 How to Use

### Authentication System

#### 1. Login with Role Detection

```bash
node index.js login
```

**Default credentials:**

- `admin:1234` (Administrator role)
- `student:pass` (Student role)
- `john_doe:student123` (Student role)
- `jane_smith:pass456` (Student role)

**Features:**

- Persistent session across command executions
- Automatic role detection and assignment
- Session file storage for state persistence

#### 2. Check Login Status

```bash
node index.js status
```

Shows current logged-in user and their role.

#### 3. Logout

```bash
node index.js logout
```

Clears current session and removes session file.

### Student Operations

#### 1. Add Course Feedback

```bash
node index.js add-feedback
```

**Requirements:** Student role only
**Features:**

- Validates course code format (e.g., CS01, MATH101)
- Tracks student information with timestamp
- Sentiment-based color formatting
- Input validation and sanitization

#### 2. View Course Feedback

```bash
node index.js view-feedback
```

**Available to:** Both students and administrators
**Features:**

- Displays all feedback for specified course
- Shows student names and submission timestamps
- Color-coded sentiment display
- Feedback count statistics

### Administrator Operations

#### 1. Add New Students

```bash
node index.js add-student
```

**Requirements:** Administrator role only
**Features:**

- Username validation (alphanumeric + underscore)
- Password requirements (minimum 4 characters)
- Duplicate username prevention
- Automatic student role assignment

#### 2. List All Students

```bash
node index.js list-students
```

**Requirements:** Administrator role only
**Features:**

- Displays all registered students
- Shows total student count
- Clean formatted output

#### 3. Remove Students

```bash
node index.js remove-student
```

**Requirements:** Administrator role only
**Features:**

- Shows current student list before removal
- Username validation and confirmation prompt
- Prevents removal of admin user
- Safe deletion with confirmation step
- Updated student count after removal

## 🎨 Custom Module Features

### feedbackFormatter.js

Our custom sentiment analysis module provides intelligent color formatting:

- **🔴 Red**: Negative feedback (contains "bad", "boring")
- **🟢 Green**: Positive feedback (contains "good", "great")
- **🟡 Yellow**: Neutral feedback (default)

### Enhanced Feedback Format

```
Student: john_doe
Time: 2025-07-26T11:59:43.450Z
Feedback: This course is great! I learned a lot. (displayed in green)
```

## 🛡️ Security & Validation

### Role-Based Access Control (RBAC)

- **Students**: Can add and view feedback only
- **Administrators**: Can manage students and view feedback (cannot submit feedback)

### Input Validation

- **Course codes**: Must match format like CS01, MATH101, etc.
- **Usernames**: Alphanumeric characters and underscores only
- **Passwords**: Minimum 4 characters required
- **Input length**: Maximum 500 characters to prevent abuse

### Error Handling with HTTP-Style Codes

- **400 Bad Request**: Invalid input, malformed data
- **401 Unauthorized**: Invalid credentials, not logged in
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Course or resource not found
- **429 Too Many Requests**: Rate limiting (infrastructure ready)
- **500 Internal Server Error**: File system or unexpected errors

## 🛠 Technical Implementation

### Node.js Modules Used

**Built-in Modules:**

- **fs**: File system operations for data persistence
- **path**: Cross-platform file path utilities
- **process**: Command-line argument parsing

**External Dependencies:**

- **readline-sync** ^1.4.10: Synchronous user input handling
- **chalk** ^4.1.2: Terminal color formatting

### Advanced Features

**Session Management:**

- File-based persistent sessions via `data/session.json`
- Automatic session restoration on command execution
- Secure session cleanup on logout

**Data Architecture:**

- User data stored in `data/users.txt`
- Feedback organized by course in `data/feedbacks/[COURSE]/`
- Automatic directory creation for new courses
- Backward compatibility with existing feedback

**Error Recovery:**

- Graceful handling of corrupted session files
- Fallback to in-memory sessions if file operations fail
- User-friendly error messages with actionable suggestions

## 📝 Sample Usage Workflow

```bash
# 1. Login as administrator
$ node index.js login
Enter username: admin
Enter password: ****
✅ Welcome, admin (admin)

# 2. Add a new student
$ node index.js add-student
Enter student username: new_student
Enter student password: secure123
✅ Student 'new_student' added successfully!

# 3. View all students
$ node index.js list-students
👥 All Students
==============================
1. student
2. john_doe
3. jane_smith
4. new_student
📊 Total students: 4

# 3.1. Remove a student
$ node index.js remove-student
🗑️  Remove Student
==============================
Current students:
1. student
2. john_doe
3. jane_smith
4. new_student

Enter username of student to remove: new_student
⚠️  Are you sure you want to remove student 'new_student'? This action cannot be undone. (yes/no): yes
✅ Student 'new_student' removed successfully!
📊 Remaining students: 3

# 4. Logout and login as student
$ node index.js logout
👋 Logged out successfully!

$ node index.js login
Enter username: student
Enter password: ****
✅ Welcome, student (student)

# 5. Add course feedback
$ node index.js add-feedback
Enter course code: CS101
Enter feedback: This course is excellent and very informative!
✅ Feedback saved successfully!

# 6. View feedback for course
$ node index.js view-feedback
Enter course code to view feedback: CS101

📚 Feedback for Course: CS101
==================================================

📝 Feedback ID: 1643156789123.txt
Student: student
Time: 2025-07-26T11:59:43.450Z
Feedback: This course is excellent and very informative! (displayed in green)
------------------------------

📊 Total feedback count: 1
```

## 🔧 Development & Extension

### Adding New Commands

1. Add command case in [index.js](index.js)
2. Implement logic in [feedbackManager.js](feedbackManager.js)
3. Add appropriate role checks using [`UserManager`](utils/userManager.js)
4. Include error handling with [`handleError`](utils/errorHandler.js)

### Enhancing Sentiment Analysis

Extend [`formatFeedback`](utils/feedbackFormatter.js) function:

- Add more sentiment keywords
- Implement advanced NLP techniques
- Include emoji support
- Add sentiment scoring

### Database Migration

To scale beyond file-based storage:

- Replace file operations in [`UserManager`](utils/userManager.js)
- Update feedback storage in [feedbackManager.js](feedbackManager.js)
- Maintain existing API interfaces

## 📚 Academic Documentation

For FA1 submission, use [FA1_Documentation_Template.md](FA1_Documentation_Template.md) which includes:

- Complete Node.js concepts explanation
- All modules documented with examples
- Custom module detailed implementation
- Sample input/output scenarios
- Architecture and design decisions

## 🏆 Project Highlights

- **✅ Complete RBAC Implementation**: Admin and student roles with proper access control
- **✅ Persistent Session Management**: State maintained across CLI executions
- **✅ Comprehensive Error Handling**: HTTP-style error codes with helpful messages
- **✅ Input Validation & Security**: Prevents malicious input and ensures data integrity
- **✅ Modular Architecture**: Clean separation of concerns for maintainability
- **✅ Enhanced User Experience**: Color-coded output and intuitive command structure
- **✅ Academic Ready**: Complete documentation for educational submission

## 📄 License

MIT License - Feel free to use and modify for educational purposes.

## 👥 Contributing

This is an educational project demonstrating Node.js CLI development, custom modules, and software architecture principles. Contributions and improvements are welcome!

---

**Status**: ✅ **Production Ready** - Fully functional CLI tool with enterprise-grade features!
