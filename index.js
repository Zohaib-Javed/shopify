const express = require("express");
const bodyParser=require('body-parser');
const app = express();
const port = 3000;
require('dotenv').config();
const crypto=require('crypto');

app.use(
  bodyParser.json({
    verify: function (req, res, buf, encoding) {
      var shopHMAC = req.get("x-shopify-hmac-sha256");
      if (!shopHMAC) return;
      if (req.get("x-kotn-webhook-verified"))
        throw "Unexpected webhook verified header";
        // console.log("env : ",env,process.env)
      var sharedSecret = process.env.SHOPIFY_API_SECRET_KEY;
      var digest = crypto
        .createHmac("SHA256", sharedSecret)
        .update(buf)
        .digest("base64");
      if (digest == req.get("x-shopify-hmac-sha256")) {
        req.headers["x-webhook-verified"] = "200";
      }
    },
  })
); 
app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.post('/create/product',(req,res)=>{
  console.log(req);
  console.log(req.headers);
  res.send(req.body)
})
app.post("/update/product", (req, res) => {
  console.log(req.body);
  res.send(req.body);
});
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
