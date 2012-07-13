//Retun an element of collection
//Weighting of each element is performed by weightFunction that takes the element as its only parameter
_.mixin({
  weightedRandom: function(collection, weightFunction){
    var weightSum = _.chain(collection).map(weightFunction).reduce(function(memo, num){ return memo + num; }, 0).value();
    var randomNum = Math.floor(Math.random() * weightSum);
    var sum = 0;
    var selected;
    _.all(collection, function(element){
      sum += weightFunction(element);
      selected = element;
      return (randomNum >= sum);
    });
    return selected;
  }
});