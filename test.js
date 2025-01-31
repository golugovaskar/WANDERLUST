const express = require("express");
const app = express();
const path = require("path");

let port = 3000;

app.set("view engine", "ejs");

app.set("views", path.join(__dirname, "/views"));

app.get("/", (req, res) => {
    res.render("home.ejs");
});

// app.get("/ig/:username", (req, res) => {
//     const followers = ["adam", "steve", "alice", "ena"];
//     let {username} = req.params;
//     res.render("instagram.ejs", {username, followers});
// });


app.get("/ig/:username", (req, res) => {
    const instaData = require("./data.json");
    console.log(instaData,);
    res.send("got request");
    // res.render("instagram.ejs", { data: instaData });
});


app.get("/rolldice", (req, res) => {
    let diceVal = Math.floor(Math.random() * 6) + 1;
    res.render("rolldice.ejs", {diceVal}); //even we just keep diceVal then also the code will function properly
});

app.get("/hello", (req, res) => {
    res.send("hello");
});

app.listen(port, ()=> {
    console.log(`listening to the port ${port}`);
});