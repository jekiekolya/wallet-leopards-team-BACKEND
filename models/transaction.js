const { Schema, model } = require('mongoose');
const { handleMongooseError } = require('../helpers');

const isOnlyLetters = /(^[а-яА-ЯёЁa-zA-ZЇїІіЄєҐґ ]+$)/u;
const isEmpty = /[\S\s]+[\S]+/;

const transactionSchema = new Schema(
  {
    transactionType: {
      type: Boolean,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    date: {
      type: Date,
      required: true,
    },
    comment: {
      type: String,
      match: [isOnlyLetters, isEmpty],
      minlength: 0,
      maxlength: 200,
      trim: true,
    },
    category: {
      type: Object,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    remainingBalance: {
      type: Number,
    },
  },
  { versionKey: false, timestamps: true }
);

transactionSchema.post('save', handleMongooseError);

const Transaction = model('transaction', transactionSchema);

module.exports = Transaction;
