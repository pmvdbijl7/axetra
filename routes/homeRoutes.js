const router = require("express").Router();
const homeController = require("../controllers/homeController");
const accessController = require("../controllers/accessController");

// Homepage
router.get("/", accessController.checkAuthenticated, homeController.homeGet);

module.exports = router;
