define(['jquery', 'underscore', 'backbone', 'bootbox', 'utils',
	'models/AppModel',
	'views/BuildingsView', 'views/UpgradesView', 'views/LevelView',
	'collections/BuildingCollection', 'collections/UpgradeCollection',
	'text!templates/app.html'],
	function ($, _, Backbone, bootbox, utils,
		AppModel,
		BuildingsView, UpgradesView, LevelView,
		BuildingCollection, UpgradeCollection,
		appTemplate) {
	
	var localStorage = window.localStorage;
	
	var AppView = Backbone.View.extend({
		
		el: '.container',
		
		model: AppModel,
		
		template: _.template(appTemplate),
		
		events: {
			'click #bulb': 'bulbClick',
			'click #saveG': 'saveGClick',
			'click #exportG': 'exportGClick',
			'click #importG': 'importGClick',
			'click #resetG': 'resetGClick',
			'click #hresetG': 'hresetGClick',
			'click #factNameDisplay': 'openFactoryName',
		},
		
		initialize: function () {
			this.buildingsView = new BuildingsView({ collection: this.model.buildingCollection });
			this.upgradesView = new UpgradesView({ collection: this.model.upgradeCollection });
			this.levelView = new LevelView({ model: this.model.levelModel });
			
			this.listenTo(this.model, 'volts', _.debounce(this.refreshCount, 0));
			this.render();
		},
		
		// Render
		render: function () {
			this.$el.html(this.template(this.model.attributes));
			this.$('#lightbulbListContainer').append(this.buildingsView.render().el);
			this.$('#upgradeListContainer').append(this.upgradesView.render().el);
			return this;
		},
		
		refreshCount: function () {
			this.$('#count').text(utils.beautify(Math.floor(this.model.get('volts'))) + ' volt' + (Math.floor(this.model.get('volts')) > 1 ? 's' : ''));
			this.$('#vps').text(utils.beautify(this.model.get('vps').toFixed(2)) + ' volt' + (this.model.get('vps') > 1 ? 's' : '') + '/second');
			return this;
		},
		
		// Panels
		switchColumn: function (template) {
			this.$('#col2').empty()
				.html(template(_.extend(this.model.toJSON(), { levelModel: this.model.levelModel.toJSON() })));
			this.$('.levelContainer').replaceWith(this.levelView.render().el);
			this.lastTemplate = template;
			return this;
		},
		
		// Events
		bulbClick: function (e) {
			this.model.click();
			$('body').append(
				$('<div class="particle"></div>')
					.text('1')
					.css({'left': e.pageX, 'top': e.pageY - 25})
					.animate({ 'top': '-=20px', 'opacity': 0 }, 2000, function () {
						$(this).remove();
					})
			);
		},
		
		saveGClick: function () {
			this.model.save();
		},
		
		resetGClick: function () {
			var self = this;
			bootbox.dialog({
				title: 'Reset',
				message: 'Are you sure you want to reset?',
				buttons: {
					success: {
						label: "Yes",
						className: "btn-success",
						callback: function() {
							self.model.reset();
							self.render().switchColumn(self.lastTemplate);
							return;
						}
					},
					danger: {
						label: "No",
						className: "btn-danger",
						callback: function() {return;}
					}
				}
			});
		},
		
		importGClick: function () {
			var self = this;
			bootbox.dialog({
				title: 'Import Game',
				message: '<div class="form-group"><textarea class="form-control import" rows="5"></textarea></div>',
				buttons: {
					success: {
						label: "Import",
						className: "btn-primary",
						callback: function() {
							var save = $('textarea.import').val();
							if (save) {
								self.model.fetch({
									save: save,
									success: function (model) {
										self.model.reset();
										self.render().switchColumn(self.lastTemplate);
									},
									error: function (model, error) {
										console.log(error);
									}
								});
							}
						}
					}
				}
			});
		},
		
		exportGClick: function () {
			bootbox.alert({
				title: 'Export Game',
				message: '<div class="form-group"><textarea class="form-control" rows="5">' + localStorage.getItem('LBClicker') + '</textarea></div>'
			});
		},
		
	});
	
	return AppView;
	
});