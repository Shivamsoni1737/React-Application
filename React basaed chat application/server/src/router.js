const express = require("express");
const router = express.Router();

router.get("/",(req, res) => {
    res.send({ response: "The Server is running successfully"}).status(200);
})


module.exports = router;