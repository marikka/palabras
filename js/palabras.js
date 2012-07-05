(function($){

  //////////////////////////////////////////////////////////
  var Word = Backbone.Model.extend({
    defaults: {
      fi: 'sana',
      es: 'palabra',
      rating: 0,
      lastAsked: 'foo'
    }
  });





  //////////////////////////////////////////////////////////
  var WordList = Backbone.Collection.extend({
    model: Word
  });





  //One word row
  var WordView = Backbone.View.extend({
    tagName: 'tr',

    events: {
      'click button.delete': 'remove'
    },

    initialize: function(){
      _.bindAll(this, 'render');
      this.wordTemplate = _.template('<td><%= fi %></td><td><%= es %></td><td><%= rating %></td><td><%= lastAsked %></td><td><button class="delete" type="button">Delete</button></td>');
    },

    render: function(){
      $(this.el).html(this.wordTemplate({fi: this.model.attributes.fi, es: this.model.attributes.es, lastAsked: new Date(this.model.attributes.lastAsked).toString(), rating: this.model.attributes.rating}));
      return this;
    }
  });


  //Manage view
  var ManageView = Backbone.View.extend({
    el: $('#manage'),

    events: {
      'submit #newWord': 'addWord'
    },

    initialize: function(){
      _.bindAll(this, 'render', 'addWord', 'appendWord');
      this.collection.on('add', this.appendWord);
      this.render();
    },

    render: function(){
      var self = this;
      _(this.collection.models).each(function(word){ // in case collection is not empty
        self.appendWord(word);
      }, this);
    },

    addWord: function(e){
      e.preventDefault(); //prevent form submission
      var word = new Word();
      word.set({
        fi: $("#word-fi", this.el).val(),
        es: $("#word-es", this.el).val(),
        rating: 0,
        lastAsked: new Date()
      });
      $('form')[0].reset();
      this.collection.add(word);
      return false;
    },

    appendWord: function(word){
      var wordView = new WordView({
        model: word
      });
      $('tbody', this.el).append(wordView.render().el);
    },
  });

  var TrainView = Backbone.View.extend({

  });



  var wordList   = new WordList();
  var manageView = new ManageView({collection: wordList});
  var trainView  = new TrainView({collection: wordList});



})(jQuery);