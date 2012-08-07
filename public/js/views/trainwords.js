  var TrainWords = Backbone.View.extend({
    el: $('#train'),

    templateBase: $('#templates .trainword').detach(), 

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

      var question      = this.question.get('fi');
      var correctAnswer = this.question.get('es');
      var isCorrect     = correctAnswer === answer;
      var correctAnswer = (isCorrect ? '' : correctAnswer);
      
      //Render answer row
      var template = this.templateBase.clone();
      var directives = {
        trainword: {
          class: function (params) {
            return params.value + (isCorrect ? '' : ' mistake');
          }
        }
      };
      $('#answers tbody', this.el).prepend(template.render({question: question, answer: answer, correctAnswer: correctAnswer}, directives));

      //Update model
      var rating = this.question.get('rating') + (isCorrect ? 1 : -1);
      this.question.save({lastAsked: new Date(), rating: rating});
      
      //Pick a new word
      this.newQuestion();
    },

    //Pick a new word. Weights are inversely probable to their rating. 1% chance of getting a 100-rated word 
    newQuestion: function(){
      this.question = this.collection.weightedRandom(function(word){return 101 - word.get('rating');});
      this.render();
    }
  });