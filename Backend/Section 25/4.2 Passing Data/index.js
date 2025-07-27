import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("index.ejs", {sentence: "Your name is:"})});

app.post("/submit", (req, res) => {
  const letters = req.body["fName"].length + req.body["lName"].length;

  res.render("index.ejs", {sentence: `you have ${letters} in your name.`})});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
