import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "permalist",
  password: "abodegamerr3",
  port: 5432,
});

db.connect();


let items = [
  { id: 1, title: "Buy milk" },
  { id: 2, title: "Finish homework" },
];

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// ✅ Fix: use async/await properly
async function getItems() {
  const result = await db.query("SELECT * FROM items");
  return result.rows;  // rows is always an array
}

app.get("/", async (req, res) => {
  try {
    const items = await getItems();   // ✅ wait for DB results
    res.render("index.ejs", {
      listTitle: "Today",
      listItems: items,
    });
  } catch (error) {
    console.error("Error fetching items:", error);
    res.status(500).send("Error loading items");
  }
});

app.post("/add", (req, res) => {
  const item = req.body.newItem;
  try {
    db.query(
      "INSERT INTO items (title) VALUES ($1)",[item])  
    res.redirect("/"); 
  } catch (error) {
    console.error("Error inserting items", error);
    res.status(500);
  }
});

app.post("/edit", (req, res) => {
  const updatedId = req.body.updatedItemId;
  const updatedTitle = req.body.updatedItemTitle;
  try {
    db.query(
    "UPDATE items SET title = $1 WHERE id = $2", [updatedTitle,updatedId]);
    res.redirect("/");
  } catch (error) {
    console.error("Error updating items ", error)
    res.status(500);
  }
});

app.post("/delete", (req, res) => {
  const deletedId = req.body.deleteItemId;
  try {
    db.query(
      "DELETE FROM items WHERE id = $1",[deletedId])
      res.redirect("/");
  } catch (error) {
    console.error("Error deleting items ", error);
    res.status(500)
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

