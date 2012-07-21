(function ($) {

  'use strict';

  var wordList     = new WordList();
  var manageWords  = new ManageWords({collection: wordList});
  var trainWords   = new TrainWords({collection: wordList});

})(jQuery);