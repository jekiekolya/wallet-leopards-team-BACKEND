const jwt = require('jsonwebtoken');

const { NotFound } = require('http-errors');

const { User } = require('../../models');

const { SECRET_KEY } = process.env;

const verifyEmail = async (req, res) => {
  const { verificationToken } = req.params;
   
  // перевірка на валідність + витягуємо id
 try {
   const {id} = jwt.verify(verificationToken, SECRET_KEY);
   if (id) {
     // confirm verify
     await User.findByIdAndUpdate(id, {
       verify: true,
       verificationToken: null,
     });
     res.status(200).json({
       status: 'success',
       code: 200,
       data: {
         message: 'Verification successful',
       },
     });
   }
  
  } catch (error) {
    res.status(498).json({ message: `Token not valid`, error });
  }
};

module.exports = verifyEmail;
