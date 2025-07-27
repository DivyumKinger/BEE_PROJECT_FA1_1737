// Function to format date in a simple way
function formatDate(date) {
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
}

// Function to validate if a string is not empty
function isValidInput(input) {
  return input && input.trim().length > 0;
}

// Function to count words in a text
function countWords(text) {
  if (!text) return 0;
  return text.trim().split(/\s+/).length;
}

// Function to create a simple greeting
function createGreeting(name) {
  return `Hello, ${name}! Welcome to our feedback app.`;
}

// Exporting functions so other files can use them
// This is CommonJS export syntax
module.exports = {
  formatDate,
  isValidInput,
  countWords,
  createGreeting,
};
