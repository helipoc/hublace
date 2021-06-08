require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const request = require("request");
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

app.use(express.static(__dirname + "/public"));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/index.html"));
});
app.post("/hubspot", (req, res) => {
  console.log(req.body);
  var options = {
    method: "POST",
    url: "https://api.hubapi.com/contacts/v1/contact/",
    qs: { hapikey: process.env.API_KEY },
    headers: {
      "Content-Type": "application/json"
    },
    body: req.body,
    json: true
  };

  request(options, function(error, response, body) {
    if (error) throw new Error(error);
    res.send(JSON.stringify(body));
    console.log(body);
  });
});

app.listen(process.env.PORT);
