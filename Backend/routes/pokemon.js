const express = require("express");
const fs = require("fs");
const router = express.Router();
const path = require("path");

const dbFile = path.resolve(__dirname, "../db.json");

const pokemonTypes = [
  "bug",
  "dragon",
  "fairy",
  "fire",
  "ghost",
  "ground",
  "normal",
  "psychic",
  "steel",
  "dark",
  "electric",
  "fighting",
  "flyingText",
  "grass",
  "ice",
  "poison",
  "rock",
  "water",
];
router.get("/", async (req, res, next) => {
  try {
    const fileData = JSON.parse(fs.readFileSync(dbFile, "utf8"));
    let pokemons = fileData.data;

    let { name, type, limit, page } = req.query;

    if (name) {
      name = name.toLowerCase();
      pokemons = pokemons.filter((p) => p.name.toLowerCase().includes(name));
    }

    if (type) {
      type = type.toLowerCase();
      pokemons = pokemons.filter((p) =>
        p.types.some((t) => t.toLowerCase() === type)
      );
    }
    //add request validation Joi Validator Zod validator
    // const requestQuerySchema = z.object({
    //    name: z.string().optional(),
    //    type: z.enum(pokemonTypes).optional(),
    //    limit: z.number().optional().default(10).max(100),
    //    page: z.number().optional().default(1),
    // });
    //
    //  const { name, type, limit, page } = requestQuerySchema.parse(req.query)
    // nếu req.query = {} => parse sẽ trả về { limit: 10, page: 1}
    // nếu req.quer = { type: "hello" } => parse sẽ throw error
    //
    // Treat các lỗi do request validation (ở đây sử dụng zod) trả về lỗi BAD REQUEST - 400

    // Check lại các lỗi HTTP ERROR:
    // - 400
    // - 401
    // - 403
    // - 404
    // - 409
    // - 429
    // - 500
    // - 503
    // - 501
    // 5xx khác gì với 4xx
    limit = limit ? parseInt(limit, 10) : 10;
    page = page ? parseInt(page, 10) : 1;

    if (isNaN(limit) || limit < 1) {
      return res.status(400).json({ error: "Invalid limit value" });
    }
    if (isNaN(page) || page < 1) {
      return res.status(400).json({ error: "Invalid page value" });
    }

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedData = pokemons.slice(startIndex, endIndex);

    res.status(200).json({ data: paginatedData });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
