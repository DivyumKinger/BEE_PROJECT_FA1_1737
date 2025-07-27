const readline = require('readline-sync'); // External package for user input
const fs = require('fs'); // Built-in Node.js module for file operations
const helpers = require('./helpers'); // Our custom module

// Getting command line arguments
const userCommand = process.argv[2];

let currentUser = null;
// Load session from session.txt if exists
if (fs.existsSync('session.txt')) {
  const sessionUser = fs.readFileSync('session.txt', 'utf8').trim();
  if (sessionUser) {
    currentUser = sessionUser;
  }
}

// function to show the main menu
function showMenu() {
  console.log('=== 🚀 Feedback Galaxy ===');
  console.log('Commands you can use:');
  console.log('  node index.js login     # Login as a user');
  console.log('  node index.js add       # Add feedback');
  console.log('  node index.js view      # View all feedback');
  console.log('  node index.js edit      # Edit feedback by number');
  console.log('  node index.js delete    # Delete feedback by number');
  console.log('  node index.js help      # Show this menu');
  console.log('  node index.js logout    # Logout current user');
}

// Login function
function login() {
  if (!fs.existsSync('users.txt')) {
    console.log(
      'Error: No users found. Please create users.txt with username:password entries. [404]'
    );
    return;
  }
  const username = readline.question('Username: ');
  const password = readline.question('Password: ', { hideEchoBack: false });
  const users = fs
    .readFileSync('users.txt', 'utf8')
    .split('\n')
    .filter((line) => line.trim() !== '');
  const found = users.find((line) => {
    const [user, pass] = line.split(':');
    return user === username && pass === password;
  });
  if (found) {
    currentUser = username;
    // Save session
    fs.writeFileSync('session.txt', username);
    console.log(`✅ Login successful! Welcome, ${username}.`);
  } else {
    console.log('Error: Invalid username or password. [401]');
  }
}

// Logout function
function logout() {
  if (fs.existsSync('session.txt')) {
    fs.unlinkSync('session.txt');
  }
  currentUser = null;
  console.log('👋 You have been logged out.');
}

// Function to add feedback to a file
function addFeedback() {
  console.log('Adding new feedback...');

  // Get user input using readline-sync package
  const name = readline.question('Your name: ');
  const feedback = readline.question('Your feedback: ');

  // Use our custom helper to validate input
  if (!helpers.isValidInput(name) || !helpers.isValidInput(feedback)) {
    console.log('Error: Name and feedback cannot be empty! [400]');
    return;
  }

  // Use our custom helper for greeting
  console.log(helpers.createGreeting(name));

  // Create feedback object
  const feedbackData = {
    name: name,
    feedback: feedback,
    wordCount: helpers.countWords(feedback),
    date: helpers.formatDate(new Date()),
  };

  // Convert to JSON string
  const feedbackText = JSON.stringify(feedbackData) + '\n';

  // Write to file using Node.js fs module
  // appendFileSync adds content to the end of file
  try {
    fs.appendFileSync('feedback.txt', feedbackText);
    console.log('✅ Feedback saved successfully!');
  } catch (error) {
    console.log('Error: Error saving feedback. [500]', error.message);
  }
}

// Function to read and display all feedback
function viewFeedback() {
  console.log('Reading all feedback...');

  try {
    // Check if file exists
    if (!fs.existsSync('feedback.txt')) {
      console.log('Error: No feedback found yet! [404]');
      return;
    }

    // Read entire file content
    const fileContent = fs.readFileSync('feedback.txt', 'utf8');

    // Split by lines and process each line
    const lines = fileContent.split('\n').filter((line) => line.trim() !== '');

    if (lines.length === 0) {
      console.log('Error: No feedback found! [404]');
      return;
    }

    console.log('\n=== All Feedback ===');
    lines.forEach((line, index) => {
      try {
        const feedback = JSON.parse(line);
        console.log(`${index + 1}. ${feedback.name}: ${feedback.feedback}`);
        console.log(`   📅 ${feedback.date}\n`);
      } catch (error) {
        console.log(`Error: Error reading feedback line: ${line} [400]`);
      }
    });
  } catch (error) {
    console.log('Error: Error reading feedback. [500]', error.message);
  }
}

// Edit feedback by number
function editFeedback() {
  if (!fs.existsSync('feedback.txt')) {
    console.log('Error: No feedback found yet! [404]');
    return;
  }
  const fileContent = fs.readFileSync('feedback.txt', 'utf8');
  const lines = fileContent.split('\n').filter((line) => line.trim() !== '');
  if (lines.length === 0) {
    console.log('Error: No feedback found! [404]');
    return;
  }
  viewFeedback();
  const num = readline.questionInt('Enter feedback number to edit: ');
  if (num < 1 || num > lines.length) {
    console.log('Error: Invalid feedback number! [400]');
    return;
  }
  let feedback;
  try {
    feedback = JSON.parse(lines[num - 1]);
  } catch {
    console.log('Error: Could not parse feedback. [400]');
    return;
  }
  const newText = readline.question(
    'Edit feedback (leave blank to keep unchanged): '
  );
  if (helpers.isValidInput(newText)) {
    feedback.feedback = newText;
    feedback.date = helpers.formatDate(new Date());
    lines[num - 1] = JSON.stringify(feedback);
    fs.writeFileSync('feedback.txt', lines.join('\n') + '\n');
    console.log('✅ Feedback updated!');
  } else {
    console.log('Error: No changes made. [429]');
  }
}

// Delete feedback by number
function deleteFeedback() {
  if (!fs.existsSync('feedback.txt')) {
    console.log('Error: No feedback found yet! [404]');
    return;
  }
  const fileContent = fs.readFileSync('feedback.txt', 'utf8');
  const lines = fileContent.split('\n').filter((line) => line.trim() !== '');
  if (lines.length === 0) {
    console.log('Error: No feedback found! [404]');
    return;
  }
  viewFeedback();
  const num = readline.questionInt('Enter feedback number to delete: ');
  if (num < 1 || num > lines.length) {
    console.log('Error: Invalid feedback number! [400]');
    return;
  }
  lines.splice(num - 1, 1);
  fs.writeFileSync('feedback.txt', lines.join('\n') + '\n');
  console.log('✅ Feedback deleted!');
}

// Main logic

console.log('Welcome to Feedback Galaxy!');
if (currentUser) {
  console.log(`Logged in as: ${currentUser}`);
}

// Only allow actions after login (except help and login)
if (userCommand === 'login') {
  login();
} else if (userCommand === 'logout') {
  logout();
} else if (userCommand === 'help' || userCommand === undefined) {
  showMenu();
} else {
  if (!currentUser) {
    console.log('Please login first using: node index.js login');
    return;
  }
  if (userCommand === 'add') {
    addFeedback();
  } else if (userCommand === 'view') {
    viewFeedback();
  } else if (userCommand === 'edit') {
    editFeedback();
  } else if (userCommand === 'delete') {
    deleteFeedback();
  } else {
    console.log('Unknown command!');
    showMenu();
  }
}
