  var ManageWords = Backbone.View.extend({
    el: $('#manage'),

    events: {
      'submit #newWord': 'addWord'
    },

    initialize: function () {
      _.bindAll(this, 'addWord', 'appendWord', 'appendAll');
      this.collection.on('add', this.appendWord, this);
      this.collection.on('reset', this.appendAll, this);
      this.collection.fetch();
    },

    //Add a new word to the collection
    addWord: function (e) {
      e.preventDefault(); //prevent form submission
      var word = new Word();
      word.set({
        fi: $("#word-fi", this.el).val(),
        es: $("#word-es", this.el).val(),
        lastAsked: new Date()
      });
      $('form', this.el)[0].reset();
      this.collection.add(word);
      word.save();
      return false;
    },

    //Create a view for a word
    appendWord: function (word) {
      var wordRow = new WordRow({
        model: word
      });
      $('tbody', this.el).append(wordRow.render().el);
    }, 
    
    appendAll: function () {
      this.collection.forEach(this.appendWord);
    }
  });