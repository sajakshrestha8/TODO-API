const express = require("express");
const app = express();
const Port = 8000;

app.listen(Port, () => console.log("Server is running in port", Port));
