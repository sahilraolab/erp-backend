// src/core/error.handler.js
module.exports = (err, req, res, next) => {
  console.error(err);

  const statusCode = err.statusCode || 500;
  const errorCode = err.code || 'INTERNAL_ERROR';
  const isProd = process.env.NODE_ENV === 'production';

  res.status(statusCode).json({
    success: false,
    code: errorCode,
    message: isProd
      ? 'Internal Server Error'
      : err.message || 'Internal Server Error'
  });
};
