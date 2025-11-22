// routes/products.js
import express from "express";
import products from "../data/products.js";
import validateProduct from "../middleware/validateProduct.js";
import NotFoundError from "../errors/NotFoundError.js";
import ValidationError from "../errors/ValidationError.js";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

/**
 * GET /api/products
 * Supports: filtering, pagination, search
 */
router.get("/", (req, res) => {
  let results = [...products];

  // Filtering by category
  if (req.query.category) {
    results = results.filter(p => p.category === req.query.category);
  }

  // Search by name
  if (req.query.search) {
    const searchTerm = req.query.search.toLowerCase();
    results = results.filter(p => p.name.toLowerCase().includes(searchTerm));
  }

  // Pagination
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 5;
  const skip = (page - 1) * limit;

  const paginated = results.slice(skip, skip + limit);

  res.json({
    total: results.length,
    page,
    limit,
    data: paginated
  });
});

/**
 * GET /api/products/:id
 */
router.get("/:id", (req, res, next) => {
  const product = products.find(p => p.id === req.params.id);

  if (!product) return next(new NotFoundError("Product not found"));

  res.json(product);
});

/**
 * POST /api/products
 */
router.post("/", validateProduct, (req, res) => {
  const newProduct = { id: uuidv4(), ...req.body };
  products.push(newProduct);
  res.status(201).json(newProduct);
});

/**
 * PUT /api/products/:id
 */
router.put("/:id", validateProduct, (req, res, next) => {
  const index = products.findIndex(p => p.id === req.params.id);

  if (index === -1) return next(new NotFoundError("Product not found"));

  products[index] = { ...products[index], ...req.body };
  res.json(products[index]);
});

/**
 * DELETE /api/products/:id
 */
router.delete("/:id", (req, res, next) => {
  const index = products.findIndex(p => p.id === req.params.id);

  if (index === -1) return next(new NotFoundError("Product not found"));

  const removed = products.splice(index, 1);
  res.json({ message: "Product deleted", removed });
});

/**
 * GET /api/products/stats
 */
router.get("/stats/data", (req, res) => {
  const stats = {};

  products.forEach(p => {
    stats[p.category] = (stats[p.category] || 0) + 1;
  });

  res.json(stats);
});

export default router;
