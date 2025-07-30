import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
app.use(express.static("public"));

app.get("/", (req,res) => {
    res.render("index.ejs");
});

app.get("/favorite", (req,res) => {
    res.render("favorite.ejs");
});

app.get("/500days", (req,res) =>{
    res.render("500days.ejs");
});

app.get("/aftersun", (req,res) =>{
    res.render("aftersun.ejs");
});

app.get("/four", (req,res) =>{
    res.render("four.ejs");
});

app.get("/about", (req,res) =>{
    res.render("about.ejs");
});

app.listen(port, ()=>{
    console.log(`Listening on port ${port}.`);
});

