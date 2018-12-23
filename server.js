const express = require('express');
const app = express();
const rateLimit = require("./ratelimiter/rate_limiter");
// get route 
app.get('/', rateLimit(), (req, res) => {
    res.json({ status: "ok", message: "I will be counted.", time: new Date().toUTCString() });
});


app.listen(process.env.PORT || 8080, function() {
    console.log("Server is listening...");
});
