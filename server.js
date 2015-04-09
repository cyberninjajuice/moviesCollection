var express = require("express");
var app = express();

var ejs = require("ejs")
app.set("view_engine", "ejs")

var override = require("method-override");
app.use(override("_method"));

var request = require("request");

var fs = require("fs");

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({
  extended: false
}));


// var query = {};
// var counting=0;

// function delay(func){
//   if(query==={}){
//     console.log("hi"+counting);
//     setTimeout(delay, 100);
//     counting++;
//   }else{
//     console.log(query);
//     func();
//   }
// }


var port = 3000;
var counter = 0;
var Movie = function(title, year, rating, director, actors, plot, poster) {
  this.id = counter;
  counter++;
  this.title = title;
  this.year = year;
  this.rating = rating;
  this.director = director;
  this.actors = actors;
  this.plot = plot;
  this.poster = poster;
};


var sr = new Movie("random", 2015, "R", " director: us", ["them", "them2", "them3"], "in a world of code...", "http://img2.wikia.nocookie.net/__cb20121110171617/muppet/images/c/c1/MuppetsOfSesameStreet.jpg");

var movies = {
  0: sr
};

app.get("/", function(req, res) {
  res.redirect("/movies");
});

app.get("/movies", function(req, res) {
  if (req.query.title !== undefined) {
    var queryterm = "http://www.omdbapi.com/?t=" + req.query.title + "&y=&plot=short&r=json";
    console.log(queryterm);
    request(queryterm, function(err, titleres, titlebod) {
      console.log(titlebod);
      var omdb = JSON.parse(titlebod);
      req.query.title = new Movie(counter, omdb.Title, omdb.Year, omdb.Rating, omdb.Director, omdb.Actors, omdb.PlotShort, omdb.Poster);
      res.render("index.ejs", {
        movies: movies,
      });
    });
  } else {
    res.render("index.ejs");
  }
});

app.get("/search", function(req, res) {
  var term = req.body.title;
  if (term === undefined) {
    res.render("search.ejs");
    console.log("made it here to the if!");
  } else {
    res.redirect("/results/" + term);
  }
});

// app.get("/results", function(req, res) {
//   res.render("results.ejs", {
//     omdb: req.query.
//   });
// });
app.get("/results?:term", function(req, res) {
  //console.log(req);
  var queryterm = "http://www.omdbapi.com/?t=" + req.query.title + "&y=&plot=short&r=json";
  console.log(queryterm);
  request(queryterm, function(err, titleres, titlebod) {
    console.log(titlebod);
    var omdb = JSON.parse(titlebod);
    console.log("made it here" + omdb);
    res.render("results.ejs", {
      omdb: omdb
    });
    if (req.body.title !== undefined) {
      var newMovie=req.query.title;
      newMovie = new Movie(omdb.Title, omdb.Year, omdb.Rating, omdb.Director, omdb.Actors, omdb.PlotShort, omdb.Poster);
      movies[newMovies.id]=newMovie;
      res.render("index.ejs", {
        movies: movies,
      });
    }
  });

});

app.get("/movie/:id", function(req, res) {
  var movie = movies[parseInt(req.params.id, 10)];
  console.log(movie);
  res.render("show.ejs", {
    movie: movie
  });
});

app.delete("/movie/:id", function(req, res) {
  delete movies[parseInt(req.params.id, 10)];
  res.redirect("/movies");
});

app.listen(port, function() {
  console.log("Server is now listening on PORT: " + port);
});