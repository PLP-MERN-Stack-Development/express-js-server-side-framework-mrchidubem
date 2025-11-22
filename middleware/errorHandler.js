// middleware/errorHandler.js
export default function errorHandler(err, req, res, next) {
  console.error("Error:", err.message);

  res.status(err.statusCode || 500).json({
    error: err.name,
    message: err.message
  });
}
