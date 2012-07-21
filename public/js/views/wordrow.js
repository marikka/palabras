var WordRow = Backbone.View.extend({
    tagName: 'tr',
    templateBase: $('#templates #word').detach(),

    events: {
      'click a.delete': 'deleteWord'
    },

    initialize: function () {
      _.bindAll(this, 'render', 'deleteWord');
      this.model.on('change', this.render, this);
    },

    render: function () {
      var template = this.templateBase.clone();
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
      
      this.$el.html(template.render(this.model.toJSON(), directives).children());

      return this;
    },

    deleteWord: function () {
      this.model.destroy();
      this.remove();
    }
  });