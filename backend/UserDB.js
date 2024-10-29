const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  profile: {
    firstName: String,
    lastName: String,
  },
  settings: {
    notifications: {
      type: Boolean,
      default: true
    },
    theme: {
      type: String,
      default: 'light'
    }
  },
  roles: [{
    type: String,
    enum: ['admin', 'officer'],
    default: ['officer']
  }],
  status: {
    type: String,
    enum: ['active', 'suspended', 'deleted'],
    default: 'active'
  },
  verified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true // This automatically adds createdAt and updatedAt fields
});

// Add indexes
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });
userSchema.index({ status: 1, roles: 1 });

// Add instance methods
userSchema.methods.toSafeObject = function() {
  const obj = this.toObject();
  delete obj.passwordHash;
  return obj;
};

// Add static methods
userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email: email.toLowerCase() });
};

const User = mongoose.model('User', userSchema);

module.exports = User;