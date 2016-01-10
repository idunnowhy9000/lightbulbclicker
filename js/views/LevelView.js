define(["underscore", "backbone", "utils",
	"models/LevelModel", "models/AppModel",
	"text!templates/level.html"],
	function (_, Backbone, utils,
		LevelModel, AppModel,
		levelTemplate) {
	
	var LevelView = Backbone.View.extend({
		model: LevelModel,
		template: _.template(levelTemplate, utils),
		
		id: 'levelContainer',
		
		initialize: function () {
			this.listenTo(this.model, 'change', this.refresh);
			this.listenTo(AppModel, 'level', this.refresh);
			
			this.render();
		},
		
		render: function () {
			this.$el.html(this.template(_.extend(this.model.attributes, utils)));
			return this;
		},
		
		refresh: function () {
			var exp = Math.floor(this.model.get('exp')),
				level = this.model.get('level'),
				toNextLevel = Math.floor(this.model.get('toNextLevel')),
				levelTotalExp = Math.floor(this.model.get('levelTotalExp'));
			
			this.$('#level').text(level);
			this.$('#exp').text(utils.magnitudes(exp));
			this.$('#neededToNext').text(utils.magnitudes(toNextLevel + levelTotalExp - exp));
			
			this.$('.progress-bar')
				.css('width', ((exp - levelTotalExp) / toNextLevel * 100) + '%');
			return this;
		}
		
	});
	
	return LevelView;
	
});