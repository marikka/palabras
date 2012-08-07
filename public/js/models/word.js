  var Word = Backbone.Model.extend({
    idAttribute: "_id", //matches with mongodb
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