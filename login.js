const fs = require('fs');
const readline = require('readline-sync');
const UserManager = require('./utils/userManager');
const { handleError, validateInput } = require('./utils/errorHandler');

module.exports = async function login() {
  try {
    const username = validateInput(
      readline.question('Enter username: '),
      'Username'
    );
    const password = validateInput(
      readline.question('Enter password: ', { hideEchoBack: true }),
      'Password'
    );

    const user = UserManager.authenticateUser(username, password);
    console.log(`✅ Welcome, ${username} (${user.role})`);

    return user;
  } catch (error) {
    handleError(error);
  }
};
