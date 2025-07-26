const fs = require('fs');
const path = require('path');
const readline = require('readline-sync');
const { formatFeedback } = require('feedback-colorful-formatter');
const UserManager = require('./utils/userManager');
const {
  AppError,
  ErrorCodes,
  handleError,
  validateInput,
  validateCourseCode,
} = require('./utils/errorHandler');

const FEEDBACK_DIR = path.join(__dirname, 'data', 'feedbacks');

function ensureCourseFolder(courseCode) {
  try {
    const dir = path.join(FEEDBACK_DIR, courseCode);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    return dir;
  } catch (error) {
    throw new AppError(
      'Failed to create course directory',
      ErrorCodes.INTERNAL_SERVER_ERROR
    );
  }
}

module.exports.addFeedback = async function () {
  try {
    // Check if user is logged in
    const currentUser = UserManager.getCurrentUser();
    if (!currentUser) {
      throw new AppError('Please login first', ErrorCodes.UNAUTHORIZED);
    }

    // Don't allow admin to give feedback
    if (UserManager.isAdmin()) {
      throw new AppError(
        'Admin users cannot submit feedback. Only students can provide course feedback.',
        ErrorCodes.FORBIDDEN
      );
    }

    const courseInput = validateInput(
      readline.question('Enter course code: '),
      'Course code'
    );
    const course = validateCourseCode(courseInput.toUpperCase());

    const feedback = validateInput(
      readline.question('Enter feedback: '),
      'Feedback'
    );

    const folder = ensureCourseFolder(course);

    // Create feedback object with student info
    const feedbackData = {
      student: currentUser.username,
      feedback: feedback,
      timestamp: new Date().toISOString(),
      courseCode: course,
    };

    const filename = path.join(folder, `${Date.now()}.txt`);
    const formattedContent = `Student: ${feedbackData.student}\nTime: ${
      feedbackData.timestamp
    }\nFeedback: ${formatFeedback(feedbackData.feedback)}`;

    fs.writeFileSync(filename, formattedContent);
    console.log('✅ Feedback saved successfully!');
  } catch (error) {
    handleError(error);
  }
};

module.exports.viewFeedback = async function () {
  try {
    // Check if user is logged in
    const currentUser = UserManager.getCurrentUser();
    if (!currentUser) {
      throw new AppError('Please login first', ErrorCodes.UNAUTHORIZED);
    }

    const courseInput = validateInput(
      readline.question('Enter course code to view feedback: '),
      'Course code'
    );
    const course = validateCourseCode(courseInput.toUpperCase());

    const folder = path.join(FEEDBACK_DIR, course);

    if (!fs.existsSync(folder)) {
      throw new AppError(
        `No feedback found for course ${course}`,
        ErrorCodes.NOT_FOUND
      );
    }

    const files = fs.readdirSync(folder);

    if (files.length === 0) {
      console.log(`📭 No feedback submitted yet for course ${course}.`);
      return;
    }

    console.log(`\n📚 Feedback for Course: ${course}`);
    console.log('='.repeat(50));

    files.forEach((file) => {
      try {
        const content = fs.readFileSync(path.join(folder, file), 'utf-8');
        console.log(`\n📝 Feedback ID: ${file}`);
        console.log(content);
        console.log('-'.repeat(30));
      } catch (error) {
        console.log(`⚠️  Could not read feedback file: ${file}`);
      }
    });

    console.log(`\n📊 Total feedback count: ${files.length}`);
  } catch (error) {
    handleError(error);
  }
};

module.exports.addStudent = async function () {
  try {
    // Check if user is logged in
    const currentUser = UserManager.getCurrentUser();
    if (!currentUser) {
      console.log('❌ Please login first using: node index.js login');
      throw new AppError('Please login first', ErrorCodes.UNAUTHORIZED);
    }

    // Only admin can add students
    UserManager.requireAdmin();

    console.log('\n👥 Add New Student');
    console.log('='.repeat(30));

    const username = validateInput(
      readline.question('Enter student username: '),
      'Username'
    );
    const password = validateInput(
      readline.question('Enter student password: '),
      'Password'
    );

    // Validate username format (no special characters except underscore)
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      throw new AppError(
        'Username can only contain letters, numbers, and underscores',
        ErrorCodes.BAD_REQUEST
      );
    }

    if (password.length < 4) {
      throw new AppError(
        'Password must be at least 4 characters long',
        ErrorCodes.BAD_REQUEST
      );
    }

    const newUser = UserManager.addUser(username, password);
    console.log(`✅ Student '${newUser.username}' added successfully!`);
  } catch (error) {
    handleError(error);
  }
};

module.exports.listStudents = async function () {
  try {
    // Check if user is logged in
    const currentUser = UserManager.getCurrentUser();
    if (!currentUser) {
      console.log('❌ Please login first using: node index.js login');
      throw new AppError('Please login first', ErrorCodes.UNAUTHORIZED);
    }

    // Only admin can list students
    UserManager.requireAdmin();

    console.log('\n👥 All Students');
    console.log('='.repeat(30));

    const users = UserManager.getAllUsers();
    const students = users.filter((user) => user.role === 'student');

    if (students.length === 0) {
      console.log('📭 No students found.');
      return;
    }

    students.forEach((student, index) => {
      console.log(`${index + 1}. ${student.username}`);
    });

    console.log(`\n📊 Total students: ${students.length}`);
  } catch (error) {
    handleError(error);
  }
};

module.exports.removeStudent = async function () {
  try {
    // Check if user is logged in
    const currentUser = UserManager.getCurrentUser();
    if (!currentUser) {
      console.log('❌ Please login first using: node index.js login');
      throw new AppError('Please login first', ErrorCodes.UNAUTHORIZED);
    }

    // Only admin can remove students
    UserManager.requireAdmin();

    console.log('\n🗑️  Remove Student');
    console.log('='.repeat(30));

    // First, show current students
    const users = UserManager.getAllUsers();
    const students = users.filter((user) => user.role === 'student');

    if (students.length === 0) {
      console.log('📭 No students found to remove.');
      return;
    }

    console.log('Current students:');
    students.forEach((student, index) => {
      console.log(`${index + 1}. ${student.username}`);
    });

    const username = validateInput(
      readline.question('\nEnter username of student to remove: '),
      'Username'
    );

    // Confirm deletion
    const confirmation = readline.question(
      `⚠️  Are you sure you want to remove student '${username}'? This action cannot be undone. (yes/no): `
    );

    if (
      confirmation.toLowerCase() !== 'yes' &&
      confirmation.toLowerCase() !== 'y'
    ) {
      console.log('❌ Student removal cancelled.');
      return;
    }

    // Validate username format
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      throw new AppError(
        'Username can only contain letters, numbers, and underscores',
        ErrorCodes.BAD_REQUEST
      );
    }

    const result = UserManager.removeUser(username);
    console.log(`✅ Student '${result.username}' removed successfully!`);

    // Show updated student count
    const updatedUsers = UserManager.getAllUsers();
    const updatedStudents = updatedUsers.filter(
      (user) => user.role === 'student'
    );
    console.log(`📊 Remaining students: ${updatedStudents.length}`);
  } catch (error) {
    handleError(error);
  }
};
