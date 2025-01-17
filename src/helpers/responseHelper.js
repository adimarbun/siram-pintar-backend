const responseHelper = {
    success(res, message, data = null, status = 200) {
      return res.status(status).json({
        status: 'success',
        message,
        data,
      });
    },
  
    error(res, message, status = 400, data = null) {
      return res.status(status).json({
        status: 'error',
        message,
        data,
      });
    },
  };
  
  module.exports = responseHelper;
  