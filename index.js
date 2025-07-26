const readline = require('readline-sync');
const login = require('./login');
const feedbackManager = require('./feedbackManager');
const UserManager = require('./utils/userManager');
const { handleError } = require('./utils/errorHandler');

const args = process.argv.slice(2);

function showUsage() {
  console.log('📋 Feedback Collector CLI Tool');
  console.log('Usage:');
  console.log('  node index.js login              # Login to the system');
  console.log(
    '  node index.js add-feedback       # Add course feedback (students only)'
  );
  console.log(
    '  node index.js view-feedback      # View feedback for a course'
  );
  console.log(
    '  node index.js add-student        # Add new student (admin only)'
  );
  console.log(
    '  node index.js remove-student     # Remove student (admin only)'
  );
  console.log(
    '  node index.js list-students      # List all students (admin only)'
  );
  console.log('  node index.js logout             # Logout from the system');
}

(async () => {
  try {
    switch (args[0]) {
      case 'login':
        await login();
        break;

      case 'add-feedback':
        await feedbackManager.addFeedback();
        break;

      case 'view-feedback':
        await feedbackManager.viewFeedback();
        break;

      case 'add-student':
        await feedbackManager.addStudent();
        break;

      case 'remove-student':
        await feedbackManager.removeStudent();
        break;

      case 'list-students':
        await feedbackManager.listStudents();
        break;

      case 'logout':
        UserManager.clearCurrentUser();
        console.log('👋 Logged out successfully!');
        break;

      case 'status':
        const currentUser = UserManager.getCurrentUser();
        if (currentUser) {
          console.log(
            `👤 Logged in as: ${currentUser.username} (${currentUser.role})`
          );
        } else {
          console.log('❌ Not logged in');
        }
        break;

      default:
        showUsage();
    }
  } catch (error) {
    handleError(error);
  }
})();
