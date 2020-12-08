const express = require("express");
const router = express.Router();

const indexController = require("../controllers/indexController");

/* GET home page. */
router.get("/", indexController.home);

/* GET detail page */
router.get("/detail", indexController.detail);

router.post("/comprar", indexController.comprar);

router.get("/callback", indexController.callback);

router.post("/notifications", indexController.notifications);

module.exports = router;
