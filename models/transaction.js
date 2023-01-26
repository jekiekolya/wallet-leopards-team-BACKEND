const { Schema, model } = require('mongoose');
const { handleMongooseError } = require('../helpers');

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
      minlength: 0,
      maxlength: 200,
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

module.exports = { Transaction };
