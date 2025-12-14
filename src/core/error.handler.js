// module.exports = (err, req, res, next) => {
//   console.error(err);
//   res.status(500).json({ error: 'Internal Server Error' });
// };

module.exports = (err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
};
