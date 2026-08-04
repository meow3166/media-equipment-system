const express = require("express");
const router = express.Router();

const adminController = require("../controllers/adminController");
const { requireAdmin } = require("../middlewares/authMiddleware");

router.use(requireAdmin);

router.get("/", adminController.getDashboard);
router.get("/users/pending", adminController.getPendingUsers);
router.post("/users/:userId/approve", adminController.approveUser);
router.post("/users/:userId/reject", adminController.rejectUser);

module.exports = router;