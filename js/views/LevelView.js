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
			var exp = Math.round(this.model.get('exp')),
				level = Math.round(this.model.get('level')),
				toNextLevel = Math.round(this.model.get('toNextLevel')),
				levelTotalExp = Math.round(this.model.get('levelTotalExp'));
			
			this.$('#level').text(level);
			this.$('#exp').text(_.beautify(exp));
			this.$('#neededToNext').text(_.beautify(toNextLevel - exp));
			
			this.$('.progress-bar')
				.css('width', (exp / toNextLevel * 100) + '%');
			return this;
		}
		
	});
	
	return LevelView;
	
});