  var WordList = Backbone.Collection.extend({
    model: Word,
    url: '/api/words',
    //Use underscore mixin function
    weightedRandom: function () {
      return _['weightedRandom'].apply(_, [this.models].concat(_.toArray(arguments)));
    }
  });