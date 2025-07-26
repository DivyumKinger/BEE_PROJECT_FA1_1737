const fs = require('fs');
const path = require('path');
const { AppError, ErrorCodes } = require('./errorHandler');

const USERS_FILE = path.join(__dirname, '..', 'data', 'users.txt');
const SESSION_FILE = path.join(__dirname, '..', 'data', 'session.json');

class UserManager {
  static getCurrentUser() {
    try {
      if (global.currentUser) {
        return global.currentUser;
      }

      // Try to load from session file
      if (fs.existsSync(SESSION_FILE)) {
        const sessionData = JSON.parse(fs.readFileSync(SESSION_FILE, 'utf-8'));
        if (sessionData && sessionData.username && sessionData.role) {
          global.currentUser = sessionData;
          return sessionData;
        }
      }
    } catch (error) {
      // If session file is corrupted, ignore and return null
    }
    return null;
  }

  static setCurrentUser(username, role) {
    const userData = { username, role, loginTime: new Date().toISOString() };
    global.currentUser = userData;

    // Save to session file
    try {
      fs.writeFileSync(SESSION_FILE, JSON.stringify(userData, null, 2));
    } catch (error) {
      // Session file save failed, but continue with in-memory session
      console.log('⚠️  Warning: Could not save session to file');
    }
  }

  static clearCurrentUser() {
    global.currentUser = null;

    // Remove session file
    try {
      if (fs.existsSync(SESSION_FILE)) {
        fs.unlinkSync(SESSION_FILE);
      }
    } catch (error) {
      // Ignore file deletion errors
    }
  }

  static isAdmin() {
    const user = this.getCurrentUser();
    return user && user.role === 'admin';
  }

  static isStudent() {
    const user = this.getCurrentUser();
    return user && user.role === 'student';
  }

  static requireAdmin() {
    if (!this.isAdmin()) {
      throw new AppError(
        'Admin privileges required for this operation',
        ErrorCodes.FORBIDDEN
      );
    }
  }

  static requireStudent() {
    if (!this.isStudent()) {
      throw new AppError(
        'Student privileges required for this operation',
        ErrorCodes.FORBIDDEN
      );
    }
  }

  static getUserRole(username) {
    if (username === 'admin') return 'admin';
    return 'student';
  }

  static getAllUsers() {
    try {
      if (!fs.existsSync(USERS_FILE)) {
        return [];
      }

      const content = fs.readFileSync(USERS_FILE, 'utf-8');
      return content
        .split('\n')
        .filter((line) => line.trim() !== '')
        .map((line) => {
          const [username, password] = line.trim().split(':');
          return { username, password, role: this.getUserRole(username) };
        });
    } catch (error) {
      throw new AppError(
        'Failed to read user data',
        ErrorCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  static addUser(username, password) {
    try {
      // Validate input
      if (!username || !password) {
        throw new AppError(
          'Username and password are required',
          ErrorCodes.BAD_REQUEST
        );
      }

      if (username.includes(':') || password.includes(':')) {
        throw new AppError(
          'Username and password cannot contain colon character',
          ErrorCodes.BAD_REQUEST
        );
      }

      // Check if user already exists
      const users = this.getAllUsers();
      if (users.some((user) => user.username === username)) {
        throw new AppError('User already exists', ErrorCodes.BAD_REQUEST);
      }

      // Add new user
      const newUserLine = `${username}:${password}\n`;
      fs.appendFileSync(USERS_FILE, newUserLine);

      return { username, role: this.getUserRole(username) };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        'Failed to add user',
        ErrorCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  static removeUser(username) {
    try {
      // Validate input
      if (!username) {
        throw new AppError('Username is required', ErrorCodes.BAD_REQUEST);
      }

      // Prevent removing admin user
      if (username === 'admin') {
        throw new AppError('Cannot remove admin user', ErrorCodes.FORBIDDEN);
      }

      // Check if user exists
      const users = this.getAllUsers();
      const userExists = users.some((user) => user.username === username);

      if (!userExists) {
        throw new AppError(
          `User '${username}' not found`,
          ErrorCodes.NOT_FOUND
        );
      }

      // Remove user from the list
      const updatedUsers = users.filter((user) => user.username !== username);

      // Write updated user list back to file
      const userLines = updatedUsers.map(
        (user) => `${user.username}:${user.password}`
      );
      fs.writeFileSync(USERS_FILE, userLines.join('\n') + '\n');

      return { username, removed: true };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        'Failed to remove user',
        ErrorCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  static authenticateUser(username, password) {
    try {
      const users = this.getAllUsers();
      const user = users.find(
        (u) => u.username === username && u.password === password
      );

      if (!user) {
        throw new AppError(
          'Invalid username or password',
          ErrorCodes.UNAUTHORIZED
        );
      }

      this.setCurrentUser(username, user.role);
      return user;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        'Authentication failed',
        ErrorCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
}

module.exports = UserManager;
