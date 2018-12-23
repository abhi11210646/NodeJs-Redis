## Rate limiter
> Use redis as In memory database.


### Usage

```

const express = require('express');
const app = express();
const rateLimit = require("./ratelimiter/rate_limiter");
// get route 
app.get('/', rateLimit(), (req, res) => {
    res.json({ status: "ok", message: "I will be counted", time: new Date().toUTCString() });
});

app.listen(process.env.PORT || 8080, function() {
    console.log("Server is listening...");
});

```

 > If you do not pass any object inside <strong>rateLimit()</strong> middelware function then below default configuration will be used.
 
 ```
 const clientIP = ((req.headers['x-forwarded-for'] || '').split(',').pop() || req.connection.remoteAddress);
 let key = `${(clientIP == '::1' || clientIP == '::ffff:127.0.0.1') ? '127.0.0.1' : clientIP}`;
 let defaults = {
            allowedAttempts: 10,
            timeFrame: 10 * 60, // in sec
            key: key,
            message: 'Too Many Requests. Please try after sometimes!'
      };
```
> Or you can modified it.

```
app.get('/', rateLimit({key:"mykey",allowedAttempts:20}), (req, res) => {
    res.json({ status: "ok", message: "I will be counted", time: new Date().toUTCString() });
});

```