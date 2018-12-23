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

### rateLimit() middelware attach a function to req object.
> Which gives you a more control over rate limiter to execute it on demand, like you want to count request on status 200 or 401 or 503 whatever just put req.rateLimit && req.rateLimit() in code where you want count to increase.


```

const express = require('express');
const app = express();
const rateLimit = require("./ratelimiter/rate_limiter");
// get route 
app.get('/', rateLimit(), (req, res) => {
    req.rateLimit && req.rateLimit();  // e.g here it start count to rate limit
    res.json({ status: "ok", message: "I will be counted", time: new Date().toUTCString() });
});

app.listen(process.env.PORT || 8080, function() {
    console.log("Server is listening...");
});

```
