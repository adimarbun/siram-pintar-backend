const jwt = require('jsonwebtoken');
const responseHelper = require('../helpers/responseHelper');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return responseHelper.error(res, 'Token tidak ditemukan atau tidak valid.', 401);
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Pastikan `JWT_SECRET` diatur di `.env`
    req.user = decoded; // Simpan data pengguna dari token
    next(); // Lanjutkan ke handler berikutnya
  } catch (error) {
    return responseHelper.error(res, error.message, 401);
    // return res.status(401).json({ error: 'Token tidak valid.' });
  }
};

module.exports = authMiddleware;
