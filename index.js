
const express = require ("express");
const querystring = require('querystring')
const { use } = require("express/lib/application");
var session = require('express-session');
const app = express();
const port = process.env.PORT || 4444;

app.set("view engine", "ejs");
app.use(express.static(__dirname + '/public'));
// app.use(express.urlencoded({extended: true}));
// app.use(express.json()) // To parse the incoming requests with JSON payloads

app.use(express.urlencoded({extended: true}));
app.use(express.json())

app.use(session({
    secret: 'random string',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
  }))

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
    let user= "";
    let punctuation = "";
    let invalid_login = false
    invalid_login = req.query.reason || null;

    if (req.session && req.session.username){
        my_user = req.session.username;
        punctuation = ","
    }
    res.render("index", {my_user: user, punctuation: punctuation, invalid_login: invalid_login});
})

app.post("/signup", (req, res) => {
    const valid_users = [
        {"name": "nmuta", "password": "jones"},
        {"name": "cooper", "password": "fryar"},
        {"name": "lee", "password": "michaeli"},
        {"name": "cody", "password": "bonsma"},
        {"name": "evan", "password": "tyo"},
        {"name": "matthew", "password": "tatum"},
        {"name": "megan", "password": "marchetti"},
        {"name": "francesko", "password": "racaku"},
        {"name": "jabair", "password": "khan"},
        {"name": "omaid", "password": "karimi"}
    ];
    const user = req.body.username;
    const pass = req.body.password;

    const found_user = valid_users.find(usr => usr.name == user && usr.password == pass);

    if (found_user){
        req.session.username = user
        res.redirect("/adventure");
    } else {
        req.session.destroy(() => {
            console.log("user reset")
        })
        res.redirect("/?reason=invalid_user");
    }
})

app.get("/adventure", (req, res) => {
    const capUser = req.session.username;
    if (req.session && req.session.username) {
        res.render("adventure", {capUser: capUser.charAt(0).toUpperCase() + req.session.username.slice(1)});
    } else {
        res.redirect("/")
    }
})

app.get("/:location", (req, res) => {
    if (req.session && req.session.username) {
    const place = req.params["location"];
    res.render("class", {placeSent: place});
    } else {
        res.redirect("/")
    }
})

app.get("/:location/:class", (req, res) => {
    if (req.session && req.session.username) {
        const location = req.params["location"];
        const gameClass = req.params["class"];
        randomTile()
        boss_array = []
        bossTiles()
        console.log("Boss tile is", boss_array)
        console.log("Winning tile is",random_number)
        // const prefix = "../"
        res.render("start", {placeSent: location, gameClass:gameClass});
    } else {
        res.redirect("/")
    }
})

app.get("/:location/:class/:number", (req, res) => {
    if (req.session && req.session.username) {
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
    } else {
        res.redirect("/")
    }
})

app.listen(port, () => {
    console.log(`listening on port ${port}`)
})