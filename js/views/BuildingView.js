define(["underscore", "backbone", "utils",
	"models/BuildingModel",
	"text!templates/buildings.html", "text!templates/buildings-tooltip.html"],
	function (_, Backbone, utils,
		BuildingModel,
		buildingsTemplate, tooltipTemplate) {
	
	var BuildingView = Backbone.View.extend({
		model: BuildingModel,
		template: _.template(buildingsTemplate),
		
		initialize: function () {
			this.listenTo(this.model, "change", this.update);
		},
		
		render: function () {
			this.$el.html(this.template(this.model.attributes));
			return this;
		},
		
		update: function () {
			/*if (!this.model.get('displayed')) {
				this.$el.hide();
			}
			
			if (this.game.volts >= this.model.get('displayAt') && !this.model.get('displayed')) {
				this.model.set('displayed', true);
				this.$el.fadeIn();
			}
			
			var amountps = this.vps(),
				amountps1 = amountps * this.get('amount'),
				amount = this.get('amount'),
				cost = this.get('cost');
			
			this.$('.bdCost').text(utils.beautify(cost) + ' volts');*/
		},
		
		vps: function () {
			
		}
		
	});
	
	return BuildingView;
	
});