
var express  = require('express');
var mongoose = require('mongoose');
var app      = express.createServer();

app.configure('development', function(){
  app.use(express.static(__dirname + '/public'));
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));


  app.use(express.bodyParser()); //Used to parse JSON requests into req.body
  app.use(express.methodOverride());
  app.use(app.router);

});


mongoose.connect('mongodb://localhost/palabras');

var Word = mongoose.model('Word', new mongoose.Schema({
  fi: String,
  es: String,
  rating: Number,
  lastAsked: Date
}));

app.get('/', function(req, res){
  res.send('hello world');
});

//GET ALL
app.get('/api/words', function(req, res){

  //res.send([{fi: 'sana', es: 'palabra', lastAsked: new Date(), rating: 50, id: 2}]);

  return Word.find(function(err, words) {
    return res.send(words);
  });
});

//GET ONE
app.get('/api/words/:id', function(req, res){
  return Word.findById(req.params.id, function(err, word) {
    if (!err) {
      return res.send(word);
    }
  });
});

//UPDATE ONE
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

//CREATE ONE
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

//DELETE ONE
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



app.listen(3000);