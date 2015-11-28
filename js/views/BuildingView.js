define(["underscore", "backbone", "utils"
	"model/Building",
	"text!templates/buildings", "text!templates/buildings-tooltip"],
	function (_, Backbone, utils,
		BuildingModel,
		buildingsTemplate, tooltipTemplate) {
	
	var BuildingView = Backbone.View.extend({
		model: BuildingModel,
		template: _.template(buildingsTemplate),
		
		initialize: function () {
			this.game = this.model.get('game');
			this.listenTo(this.model, "change", this.update);
		},
		
		render: function () {
			this.$el.html(this.template(this.model.attributes));
			return this;
		},
		
		update: function () {
			if (!this.model.get('displayed')) {
				this.$el.hide();
			}
			
			if (this.game.volts >= this.model.get('displayAt') && !this.model.get('displayed')) {
				this.model.set('displayed', true);
				this.$el.fadeIn();
			}
			
			var amountps = this.vps(),
				amountps1 = amountps * this.amount,
				amount = this.amount,
				cost = this.cost;
			
			this.$('.bdCost').text(utils.beautify(cost) + ' volts');
		},
		
		vps: function () {
			
		}
		
	});
	
	return BuildingView;
	
});