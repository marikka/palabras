var express  = require('express');
var mongoose = require('mongoose');
var i18n     = require("i18n");
var app      = express.createServer();
var port     = process.env.PORT || 5000;

//Set locale based on cookie
var setLocale = function (req, res, next) {
  i18n.setLocale(req.cookies.palabras_locale);
  next();
};

//Configure express
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.static(__dirname + '/public'));
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
  app.use(express.bodyParser()); //Used to parse JSON requests into req.body
  app.use(express.cookieParser());
  app.use(express.methodOverride());
  app.use(setLocale);
  app.use(app.router);

});

app.configure('development', function(){
  app.set('view options', { pretty: true });
});

//Configure i18n
i18n.configure({
    // setup some locales - other locales default to en silently
    locales:['en', 'fi', 'es'],
});
// register i18n helpers for use in templates
app.helpers({
  __i: i18n.__,
  __n: i18n.__n
});






//Configure MongoDB
var dbURL = process.env.MONGOHQ_URL || 'mongodb://localhost/palabras';
//Connect to mongoDB database
mongoose.connect(dbURL);

//Specify Word
var Word = mongoose.model('Word', new mongoose.Schema({
  fi: String,
  es: String,
  rating: Number,
  lastAsked: Date
}));

//Routes/////////////////////////////////
app.get('/', function (req, res) {
  res.render('index');
})

//Read all words
app.get('/api/words', function(req, res){
  return Word.find(function(err, words) {
    return res.send(words);
  });
});

//Read a word
app.get('/api/words/:id', function(req, res){
  return Word.findById(req.params.id, function(err, word) {
    if (!err) {
      return res.send(word);
    }
  });
});

//Update a word
app.put('/api/words/:id', function(req, res){
  return Word.findById(req.params.id, function(err, word) {
    word.es        = req.body.es;
    word.fi        = req.body.fi;
    word.lastAsked = req.body.lastAsked;
    word.rating    = req.body.rating;

    return word.save(function(err) {
      if (!err) {
        console.log("updated");
      }
      return res.send(word);
    });
  });
});

//Create a word
app.post('/api/words', function(req, res){
  var word;
  word = new Word({
    es:        req.body.es,
    fi:        req.body.fi,
    lastAsked: req.body.lastAsked,
    rating:    req.body.rating
  });
  word.save(function(err) {
    if (!err) {
      return console.log("created");
    }
  });
  return res.send(word);
});

//Delete a word
app.delete('/api/words/:id', function(req, res){
  return Word.findById(req.params.id, function(err, word) {
    return word.remove(function(err) {
      if (!err) {
        console.log("removed");
        return res.send('');
      }
    });
  });
});

//Set locale
app.get('/setlocale/:locale', function(req, res){
  res.cookie('palabras_locale', req.params.locale, {path: '/'});
  return res.redirect('/');
});

//Start server
app.listen(port);