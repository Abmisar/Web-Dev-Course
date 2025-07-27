import express from "express";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

const d = new Date();
let day = d.getDay;

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({extended: true}));



app.get("/", (req, res)=> {
    if (day < 5) {
        res.render("index.ejs",
            {week: "weekday",sentence: "work hard"}
        )
    } else{
        res.render("index.ejs",
            {week: "weekend",sentence: "have fun"}
        )}
})

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});