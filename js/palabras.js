(function($){

  //////////////////////////////////////////////////////////
  var Word = Backbone.Model.extend({
    defaults: {
      fi: 'sana'
      es: 'palabra'
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
    },

    render: function(){
      $(this.el).html('<td>sana</td><td>palabra</td><td>50</td><td>yesterday</td><td><button class="delete" type="button"></td>');
      return this;
    }
  });

  //Table of words
  var WordsView = Backbone.View.extend({

  });



})(jQuery);