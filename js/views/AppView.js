define(['jquery', 'underscore', 'backbone', 'utils',
	'models/AppModel',
	'views/BuildingsView', 'views/UpgradesView',
	'collections/BuildingCollection', 'collections/UpgradeCollection',
	'text!templates/app.html'],
	function ($, _, Backbone, utils,
		AppModel,
		BuildingsView, UpgradesView,
		BuildingCollection, UpgradeCollection,
		appTemplate) {
	var AppView = Backbone.View.extend({
		
		el: '.container',
		
		model: AppModel,
		
		template: _.template(appTemplate),
		
		events: {
			'click #bulb': 'bulbClick',
			'click #saveG': 'saveGClick',
			'click #options': 'openOptions',
			'click #resetG': 'resetGClick',
			'click #hresetG': 'hresetGClick',
			'click #factNameDisplay': 'openFactoryName',
		},
		
		initialize: function () {
			this.buildingsView = new BuildingsView({ collection: this.model.buildingCollection });
			this.upgradesView = new UpgradesView({ collection: this.model.upgradeCollection });
			
			this.listenTo(this.model, 'volts', this.refreshCount);
			this.listenTo(this.model, 'change', this.refresh);
			
			this.model.fetch({ reset: true });
			this.render();
		},
		
		// Render
		render: function () {
			this.$el.html(this.template(this.model.toJSON()));
			this.$('#lightbulbListContainer').append(this.buildingsView.render().el);
			this.$('#upgradeListContainer').append(this.upgradesView.render().el);
			return this;
		},
		
		refreshCount: function () {
			this.$('#count').text(utils.beautify(Math.floor(this.model.get('volts'))) + " volt" + (Math.floor(this.model.get('volts')) > 1 ? "s" : ""));
			this.$('#vps').text(utils.beautify(this.model.get('vps').toFixed(2)) + " volt" + (this.model.get('vps') > 1 ? "s" : "") + "/second");
			return this;
		},
		
		refresh: function () {
			return this;
		},
		
		// Events
		bulbClick: function () {
			this.model.earn(1);
		}
		
	});
	
	return AppView;
	
});