define(['backbone',
	'views/UpgradeView'],
	function (Backbone, UpgradeView) {
	
	var UpgradesView = Backbone.View.extend({
		
		tagName: 'div',
		id: 'upgrade',
		
		render: function () {
			this.collection.each(function (upgrade) {
				console.log(upgrade);
				var upgradeView = new UpgradeView({ model: upgrade });
				this.$el.append(upgradeView.render().el);
			}, this);
			return this;
		}
		
	});
	
	return UpgradesView;
	
});