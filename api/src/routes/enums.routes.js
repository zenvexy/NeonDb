const express = require("express");
const { disponibilidade } = require("../enums/enum");

const router = express.Router();

router.get("/disponibilidade", disponibilidade);

module.exports = router;
