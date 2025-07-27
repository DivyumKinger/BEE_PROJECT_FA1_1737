// What is Node.js?
// Node.js is a JavaScript runtime that lets us run JavaScript outside the browser!

// Importing modules using require() - CommonJS way
const readline = require('readline-sync'); // External package for user input
const fs = require('fs'); // Built-in Node.js module for file operations
const helpers = require('./helpers'); // Our custom module

// Getting command line arguments
// process.argv contains all arguments passed to the script
// slice(2) removes 'node' and 'script-name' from the array
const userCommand = process.argv[2];

// Simple function to show what the app can do
function showMenu() {
  console.log('=== 🚀 Feedback Galaxy ===');
  console.log('Commands you can use:');
  console.log('  node index.js add       # Add feedback');
  console.log('  node index.js view      # View all feedback');
  console.log('  node index.js help      # Show this menu');
}

// Function to add feedback to a file
function addFeedback() {
  console.log('Adding new feedback...');

  // Get user input using readline-sync package
  const name = readline.question('Your name: ');
  const feedback = readline.question('Your feedback: ');

  // Use our custom helper to validate input
  if (!helpers.isValidInput(name) || !helpers.isValidInput(feedback)) {
    console.log('❌ Name and feedback cannot be empty!');
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
    console.log('❌ Error saving feedback:', error.message);
  }
}

// Function to read and display all feedback
function viewFeedback() {
  console.log('Reading all feedback...');

  try {
    // Check if file exists
    if (!fs.existsSync('feedback.txt')) {
      console.log('No feedback found yet!');
      return;
    }

    // Read entire file content
    const fileContent = fs.readFileSync('feedback.txt', 'utf8');

    // Split by lines and process each line
    const lines = fileContent.split('\n').filter((line) => line.trim() !== '');

    if (lines.length === 0) {
      console.log('No feedback found!');
      return;
    }

    console.log('\n=== All Feedback ===');
    lines.forEach((line, index) => {
      try {
        const feedback = JSON.parse(line);
        console.log(`${index + 1}. ${feedback.name}: ${feedback.feedback}`);
        console.log(`   📅 ${feedback.date}\n`);
      } catch (error) {
        console.log(`Error reading feedback line: ${line}`);
      }
    });
  } catch (error) {
    console.log('❌ Error reading feedback:', error.message);
  }
}

// Main logic - this is where our program starts
console.log('Welcome to 🚀 Feedback Galaxy!');

// Check what command user entered
if (userCommand === 'add') {
  addFeedback();
} else if (userCommand === 'view') {
  viewFeedback();
} else if (userCommand === 'help') {
  showMenu();
} else {
  console.log('Unknown command!');
  showMenu();
}
