import bcrypt from 'bcryptjs';
import { createModel } from '../utils/localStorage.js';

const storage = createModel('users');

class User {
  static async create(userData) {
    // Hash password if provided
    if (userData.passwordHash) {
      const salt = await bcrypt.genSalt(10);
      userData.passwordHash = await bcrypt.hash(userData.passwordHash, salt);
    }

    // Set default avatar if not provided
    if (!userData.avatar) {
      userData.avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=667eea&color=fff`;
    }

    return storage.create(userData);
  }

  static findOne(query) {
    return storage.findOne(query);
  }

  static findById(id) {
    return storage.findById(id);
  }

  static findByIdAndUpdate(id, updateData) {
    return storage.findByIdAndUpdate(id, updateData);
  }

  static async comparePassword(candidatePassword, hashedPassword) {
    return await bcrypt.compare(candidatePassword, hashedPassword);
  }
}

export default User;
