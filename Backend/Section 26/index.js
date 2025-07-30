import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.get("/", (req,res) => {
    res.render("index.ejs");
});

app.post("/reviews", (req,res) => {
    res.render("reviews.ejs");
})

app.post("/500days", (req,res) =>{
    res.render("500days.ejs")
})

app.post("/aftersun", (req,res) =>{
    res.render("aftersun.ejs")
})

app.use(express.static("public"));


app.listen(port, ()=>{
    console.log(`Listening on port ${port}.`);
});

