var express  = require('express');
var mongoose = require('mongoose');
var app      = express.createServer();
var port     = process.env.PORT || 5000;

//Configure express
app.configure('development', function(){
  app.use(express.static(__dirname + '/public'));
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
  app.use(express.bodyParser()); //Used to parse JSON requests into req.body
  app.use(express.methodOverride());
  app.use(app.router);
});

app.configure('production', function(){
  app.use(express.static(__dirname + '/public'));
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
  app.use(express.bodyParser()); //Used to parse JSON requests into req.body
  app.use(express.methodOverride());
  app.use(app.router);
});



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

app.get('/', function(req, res){
  res.sendfile(__dirname + '/public/index.html')
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

//Start server
app.listen(port);