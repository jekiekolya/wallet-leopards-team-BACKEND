const { Schema, model } = require('mongoose');
const bcrypt = require('bcryptjs');

const { handleMongooseError } = require('../helpers');

const totalBalanceRegexp = /\d+([.,]\d{2})?/;

const userSchema = Schema(
  {
    firstName: {
      type: String,
      required: [true, 'FirstName is required'],
      minlength: 1,
      maxlength: 12,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      minlength: 4,
      maxlength: 70,
      validate: /^\S+@\S+\.\S+$/,
    },
    password: {
      type: String,
      required: [true, 'Set password for user'],
      minlength: 6,
    },
    subscription: {
      type: String,
      enum: ['starter', 'pro', 'business'],
      default: 'starter',
    },
    token: {
      type: String,
      default: null,
    },
    avatarURL: {
      type: String,
      required: true,
    },
    idCloudAvatar: {
      type: String,
      default: null,
    },
    categories: [Object],
    totalBalance: {
      type: Number,
      default: 0,
      match: totalBalanceRegexp,
    },
    verify: {
      type: Boolean,
      default: false,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);
// Handle validation errors
userSchema.post('save', handleMongooseError);

// Method for hashing password
userSchema.methods.setPassword = function setPassword(password) {
  this.password = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

// Method for compering password
userSchema.methods.comparePassword = function comparePassword(password) {
  return bcrypt.compareSync(password, this.password);
};

const User = model('user', userSchema);

module.exports = User;
