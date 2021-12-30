
const express = require ("express");
const app = express();
const port = process.env.PORT || 4444;

app.set("view engine", "ejs");
app.use(express.static(__dirname + '/public'));

let random_number = 0
let boss_number = 0
let boss_array = []

function randomTile(){
    random_number = Math.floor((Math.random() * 25)+ 1);
}

function bossTile(){
    boss_number = Math.floor((Math.random() * 25)+ 1);
    if (boss_number == random_number){
        bossTile()
    } else{
        boss_array.push(boss_number)
    }
}

function bossTiles(){
    for (var i = 1; i < 4; i++) bossTile(i);
}

app.get("/", (req, res) => {
    res.render("adventure");
})

app.get("/:location", (req, res) => {
    const place = req.params["location"];
    res.render("class", {placeSent: place});
})

app.get("/:location/:class", (req, res) => {
    const location = req.params["location"];
    const gameClass = req.params["class"];
    randomTile()
    boss_array = []
    bossTiles()
    console.log("Boss tile is", boss_array)
    console.log("Winning tile is",random_number)
    // const prefix = "../"
    res.render("start", {placeSent: location, gameClass:gameClass});
})

app.get("/:location/:class/:number", (req, res) => {
    const location = req.params["location"];
    const gameClass = req.params["class"];
    const number = +req.params["number"];
    // const prefix = "../"
    if (number === random_number) {
        res.render("win", {placeSent: location, gameClass:gameClass, tile: number});
    } else if(boss_array.includes(number)){
        res.render("boss", {placeSent: location, gameClass:gameClass, tile: number});
    } else if (number === 6 || number === 11 || number === 16) {
        res.render("leftedge", {placeSent: location, gameClass:gameClass, tile: number});
    } else if (number === 2 || number === 3 || number === 4) {
        res.render("topedge", {placeSent: location, gameClass:gameClass, tile: number});
    } else if (number === 10 || number === 15 || number === 20) {
        res.render("rightedge", {placeSent: location, gameClass:gameClass, tile: number});
    } else if (number === 22 || number === 23 || number === 24) {
        res.render("bottomedge", {placeSent: location, gameClass:gameClass, tile: number});
    } else if (number === 1) {
        res.render("topleftcorner", {placeSent: location, gameClass:gameClass, tile: number});
    } else if (number === 5) {
        res.render("toprightcorner", {placeSent: location, gameClass:gameClass, tile: number});
    } else if (number === 21) {
        res.render("bottomleftcorner", {placeSent: location, gameClass:gameClass, tile: number});
    } else if (number === 25) {
        res.render("bottomrightcorner", {placeSent: location, gameClass:gameClass, tile: number});
    } else if (number === 13){
        res.render("start2", {placeSent: location, gameClass:gameClass, tile: number});
    } else if (number === 66){
        res.render("66", {placeSent: location, gameClass:gameClass, tile: number});
    } else if (number === 77){
        res.render("77", {placeSent: location, gameClass:gameClass, tile: number, winningTile: random_number});
    } else {
        res.render("number", {placeSent: location, gameClass:gameClass, tile: number});
    }
})

app.listen(port, () => {
    console.log(`listening on port ${port}`)
})