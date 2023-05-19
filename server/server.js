const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoutes = require("./routes/UserRoute");

require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log(`Connected to DB `);
  })
  .catch((err) => {
    console.log(err);
  });

app.route("/").get((req, res) => {
  res.status(200).send("Api working");
});
app.use("/api/v1", userRoutes);

app.listen(PORT, () => {
  console.log(`Server started on Port ${PORT}`);
});
