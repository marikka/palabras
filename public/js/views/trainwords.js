  var TrainWords = Backbone.View.extend({
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