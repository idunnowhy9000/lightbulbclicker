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
			this.$('.progress-bar').css('width', (this.model.get('exp') / this.model.get('toNextLevel') * 100) + '%');
			return this;
		},
		
		refresh: function () {
			var exp = Math.floor(this.model.get('exp')),
				level = this.model.get('level'),
				toNextLevel = Math.floor(this.model.get('toNextLevel')),
				levelTotalExp = Math.floor(this.model.get('levelTotalExp')),
				neededToNext = exp;
			
			this.$('#level').text(level);
			this.$('#exp').text(_.beautify(exp));
			this.$('#neededToNext').text(_.beautify(toNextLevel + levelTotalExp - exp));
			
			this.$('.progress-bar')
				.css('width', ((exp - levelTotalExp) / toNextLevel * 100) + '%');
			return this;
		}
		
	});
	
	return LevelView;
	
});