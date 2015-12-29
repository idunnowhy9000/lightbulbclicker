define(["underscore", "backbone", "utils",
	"models/LevelModel", "models/AppModel",
	"text!templates/level.html"],
	function (_, Backbone, utils,
		LevelModel, AppModel,
		levelTemplate) {
	
	var LevelView = Backbone.View.extend({
		model: LevelModel,
		template: _.template(levelTemplate),
		
		id: 'levelContainer',
		
		initialize: function () {
			this.listenTo(this.model, "change", this.render);
			this.listenTo(AppModel, "level", this.render);
			
			this.render();
		},
		
		render: function () {
			this.$el.html(this.template(this.model.attributes));
			this.$('.progress-bar').css('width', this.model.percent());
			return this;
		},
		
		refresh: function () {
			this.$el.empty();
			this.render();
			return this;
		}
		
	});
	
	return LevelView;
	
});