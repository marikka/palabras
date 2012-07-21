var WordRow = Backbone.View.extend({
    tagName: 'tr',
    templateBase: $('#templates #word').detach(),

    events: {
      'click a.delete': 'deleteWord'
    },

    initialize: function () {
      _.bindAll(this, 'render', 'deleteWord');
      this.model.on('change', this.render);
      this.template = this.templateBase.clone();
    },

    render: function () {
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

      var foo = this.template.render(this.model.toJSON(), directives).children();
      this.$el.html(foo);

      return this;
    },

    deleteWord: function () {
      this.model.destroy();
      this.remove();
    }
  });