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
			this.listenTo(this.model, 'change', this.refresh);
			this.listenTo(AppModel, 'level', this.refresh);
			
			this.render();
		},
		
		render: function () {
			this.$el.html(this.template(this.model.attributes));
			this.$('.progress-bar').css('width', this.model.percent() + '%');
			return this;
		},
		
		refresh: function () {
			this.$('#level').text(this.model.get('level'));
			this.$('#exp').text(_.beautify(Math.round(this.model.get('exp'))));
			this.$('#neededToNext').text(_.beautify(Math.round(this.model.get('neededToNext'))));
			this.$('.progress-bar').css('width', this.model.percent() + '%');
			return this;
		}
		
	});
	
	return LevelView;
	
});