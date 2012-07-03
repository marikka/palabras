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
      $(this.el).html(this.wordTemplate({fi: this.model.attributes.fi, es: this.model.attributes.es, lastAsked: new Date(this.model.attributes.lastAsked).getDay(), rating: this.model.attributes.rating}));
      return this;
    }
  });

  //Application view
  var AppView = Backbone.View.extend({
    el: $('#app'),

    events: {
      'submit form': 'addWord'
    },

    initialize: function(){
      _.bindAll(this, 'render', 'addWord', 'appendWord');
      
      this.collection = new WordList();
      this.collection.bind('add', this.appendWord);
      this.collection.reset([{fi: 'auto', es: 'coche'}])

      this.render();
    },

    render: function(){
      var self = this;
      _(this.collection.models).each(function(word){ // in case collection is not empty
        self.appendWord(word);
      }, this);
    },

    addWord: function(e){
      e.preventDefault();
      var word = new Word();
      word.set({
        fi: $("#word-fi").val(),
        es: $("#word-es").val(),
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
    }



  });

  var appView = new AppView();



})(jQuery);