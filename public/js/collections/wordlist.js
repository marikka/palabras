  var WordList = Backbone.Collection.extend({
    model: Word,
    //localStorage: new Backbone.LocalStorage("SomeCollection"),
    url: '/api/words',
    //Use underscore mixin function
    weightedRandom: function () {
      return _['weightedRandom'].apply(_, [this.models].concat(_.toArray(arguments)));
    }
  });