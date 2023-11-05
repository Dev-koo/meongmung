const jwt = require('jsonwebtoken');
const config = require('../config');
const { User } = require('../models');
exports.isAuth = async function (req, res, next) {
  const header = req.get('Authorization');

  if (!(header && header.startsWith('Bearer'))) {
    return res.status(401).json({ message: 'Authorization 오류 입니다.' });
  }

  const token = header.split(' ')[1];

  try {
    const decoded = jwt.verify(token, config.jwt.secretKey);

    const user = await User.findOne({ email: decoded.email }).exec();

    if (!user) {
      return res.status(401).json({ message: 'Authorization 오류 입니다.' });
    }
    req.user = user;
    next();
  } catch (err) {
    if (err.message.includes('expired')) next('토큰 기한이 만료 되었습니다.');
    else if (err.message.includes('invalid')) next('유효한 토큰이 아닙니다.');
    else next(err);
  }
};
