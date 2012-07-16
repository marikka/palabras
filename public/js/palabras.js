(function ($) {

  'use strict';

  //////////////////////////////////////////////////////////
  var Word = Backbone.Model.extend({
    idAttribute: "_id",
    defaults: {
      rating: 0
    },
    initialize: function () {
      this.on('change:rating', this.enforceRatingBounds, this);
    },
    enforceRatingBounds: function () {
      this.set('rating', Math.max(Math.min(this.get('rating'), 100), 0));
    }
  });

  //////////////////////////////////////////////////////////
  var WordList = Backbone.Collection.extend({
    model: Word,
    //localStorage: new Backbone.LocalStorage("SomeCollection"),
    url: '/api/words',
    //Use underscore mixin function
    weightedRandom: function () {
      return _['weightedRandom'].apply(_, [this.models].concat(_.toArray(arguments)));
    }
  });

  //One word row ///////////////////////////////////////////
  var WordView = Backbone.View.extend({
    tagName: 'tr',
    templateBase: $('#templates #word').detach(),

    events: {
      'click a.delete': 'deleteWord'
    },

    initialize: function () {
      _.bindAll(this, 'render', 'deleteWord');
      this.model.on('change', this.render);
      this.template = this.templateBase.clone();
    },

    render: function () {
      var directives = {
        lastAsked: {
          text: function (params) {
            return new Date(this.lastAsked).toString("d.M.yyyy HH:mm");
          }
        },
        rating: {
          style: function (params) {
            return 'width:' + this.rating + '%;';
          }
        }
      };
      
      var foo = this.template.render(this.model.toJSON(), directives).children();
      this.$el.html(foo);

      return this;
    },

    deleteWord: function () {
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

    initialize: function () {
      _.bindAll(this, 'render', 'addWord', 'appendWord');
      this.collection.on('add', this.appendWord);
      this.collection.on('reset', this.render);
      this.collection.fetch();
    },

    render: function () {
      var self = this;
      _(this.collection.models).each(function (word) { // in case collection is not empty
        self.appendWord(word);
      }, this);
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

    initialize: function () {
      _.bindAll(this, 'render', 'checkAnswer', 'newQuestion');
      this.collection.on('reset', this.newQuestion);
    },

    render: function () {
      if (this.question) {
        $('#question', this.el).html(this.question.get('fi'));
      }
    },

    checkAnswer: function (e) {
      e.preventDefault();

      var answer = $("#answerWord", this.el).val();
      $('form', this.el)[0].reset();

      if (this.question.get('es') === answer) {
        this.question.save({lastAsked: new Date(), rating: this.question.get('rating') + 1});
        $('#answers tbody', this.el).prepend('<tr><td>'+this.question.get('fi')+'</td>'+'<td>'+answer+'</td><td></td></tr>');
      } else {
        this.question.save({lastAsked: new Date(), rating: this.question.get('rating') - 1});
        $('#answers tbody', this.el).prepend('<tr class="mistake"><td>'+this.question.get('fi')+'</td>'+'<td>'+answer+'</td><td>'+this.question.get('es')+'</td></tr>');
      }
      
      this.newQuestion(); //Pick a new word
    },

    //Pick a new word. Weights are inversely probable to their rating. 1% chance of getting a 100-rated word 
    newQuestion: function(){
      this.question = this.collection.weightedRandom(function(word){return 101 - word.get('rating');});
      this.render();
    }



  });



  var wordList   = new WordList();
  var manageView = new ManageView({collection: wordList});
  var trainView  = new TrainView({collection: wordList});



})(jQuery);