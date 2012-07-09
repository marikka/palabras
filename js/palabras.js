(function($){

  'use strict';


  //////////////////////////////////////////////////////////
  var Word = Backbone.Model.extend({
    defaults: {
      fi: 'sana',
      es: 'palabra',
      rating: 0,
      lastAsked: 'foo'
    },
    initialize: function(){
      this.on('change:rating', this.enforceRatingBounds, this);
    },
    enforceRatingBounds: function() {
      this.set('rating', Math.max(Math.min(this.get('rating'), 100),0));
    }
  });


  //////////////////////////////////////////////////////////
  var WordList = Backbone.Collection.extend({
    model: Word,
    localStorage: new Backbone.LocalStorage("SomeCollection"),
    initialize: function() {
      this.fetch();
    },
    //Use underscore mixin function
    weightedRandom: function() {
      return _['weightedRandom'].apply(_, [this.models].concat(_.toArray(arguments)));
    } 
  });





  //One word row ///////////////////////////////////////////
  var WordView = Backbone.View.extend({
    tagName: 'tr',

    events: {
      'click a.delete': 'deleteWord'
    },

    initialize: function(){
      _.bindAll(this, 'render');
      this.wordTemplate = _.template('<td><%= fi %></td><td><%= es %></td><td><div class="progress"><div class="bar" style="width: <%= rating %>%;"><%= rating %></div></div></td><td><%= lastAsked %></td><td><a class="btn btn-small btn-danger delete" type="button"><i class="icon-trash icon-white"></i> Delete</button></td>');
      this.model.on('change', this.render);
    },

    render: function(){
      $(this.el).html(this.wordTemplate({fi: this.model.attributes.fi, es: this.model.attributes.es, lastAsked: new Date(this.model.attributes.lastAsked).toString("dd.mm.yyyy HH:mm") , rating: this.model.attributes.rating}));
      return this;
    },

    deleteWord: function(){
      this.model.destroy();
      this.remove();
    }
  });


  //Manage view ///////////////////////////////////////////
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
        lastAsked: new Date()
      });
      $('form', this.el)[0].reset();
      this.collection.add(word);
      word.save();
      return false;
    },

    appendWord: function(word){
      var wordView = new WordView({
        model: word
      });
      $('tbody', this.el).append(wordView.render().el);
    }
  });


  ///////////////////////////////////////////
  var TrainView = Backbone.View.extend({
    el: $('#train'),

    events: {
      'submit #answer': 'checkAnswer'
    },

    initialize: function(){
      _.bindAll(this, 'render', 'checkAnswer');
      this.newQuestion();
      this.render();
    },

    render: function(){
      $('#question', this.el).html(this.question.get('fi'));
    },

    checkAnswer: function(e){
      e.preventDefault();


      if(this.question.get('es') === $("#answerWord", this.el).val())
      {
        this.question.save({lastAsked: new Date(), rating: this.question.get('rating') + 1});
      } else {
        this.question.save({lastAsked: new Date(), rating: this.question.get('rating') - 1});
      }

      $('form', this.el)[0].reset();

      
      this.$el.append('<p><span>'+this.question.get('fi')+'</span>'+' <span>'+this.question.get('es')+'</span></p>');

      this.newQuestion(); //Pick a new word

    },

    newQuestion: function(){
      this.question = this.collection.weightedRandom(function(word){return 100 - word.get('rating');});
      this.render();
    }



  });



  var wordList   = new WordList();
  var manageView = new ManageView({collection: wordList});
  var trainView  = new TrainView({collection: wordList});



})(jQuery);