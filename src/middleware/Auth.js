const User = require('../Schema/userSchema');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    


    if (!token) {
      return res.status(400).send("Token required");
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decode);

    
    let user = await User.findOne({ user_id: decode.user_id });
    if (!user) {
      return res.status(400).send('User not found');
    }

    req.user = decode;
    req.token = token;

    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).send({ error: 'Token expired' });
    } else if (err.name === 'JsonWebTokenError') {
      return res.status(401).send({ error: 'Invalid Token' });
    } else {
      console.log(err);
      return res.status(401).send({ error: 'Authentication required' });
    }
  }
};

module.exports = {
  verifyAuth
};
