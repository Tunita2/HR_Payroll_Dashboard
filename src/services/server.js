const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");

const AdminAPI = require("./admin-API");
const PORT = 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

app.use("/api/admin", AdminAPI);

app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});
