const { Schema, model } = require('mongoose');
const Joi = require('joi');
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
    },
    idCategory: {
      type: String,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
  },
  { versionKey: false, timestamps: true }
);

transactionSchema.post('save', handleMongooseError);

const addSchema = Joi.object({
  transactionType: Joi.boolean().required(),
  amount: Joi.number().required(),
  date: Joi.date().iso().required(),
  comment: Joi.string(),
  idCategory: Joi.string(),
});

const schemas = {
  addSchema,
};

const Transaction = model('transaction', transactionSchema);

module.exports = { Transaction, schemas };
