import express from "express";
const app = express();
const port = 3000;

app.get("/")
//yo
app.listen(port, () => {
    console.log(`server running on port ${port}. `);
});
