// middleware/validateProduct.js
import ValidationError from "../errors/ValidationError.js";

export default function validateProduct(req, res, next) {
  const { name, description, price, category, inStock } = req.body;

  if (!name || !description || price == null || !category || inStock == null) {
    return next(new ValidationError("All product fields are required"));
  }

  if (typeof price !== "number") {
    return next(new ValidationError("Price must be a number"));
  }

  next();
}
