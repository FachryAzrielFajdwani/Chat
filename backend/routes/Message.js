const express = require("express");
const router = express.Router();

router.get('/', (req,res) => res.render('Message/index', { nama: req.user.nama }));

module.exports = router;
