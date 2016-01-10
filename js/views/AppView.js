define(['jquery', 'underscore', 'backbone', 'bootbox', 'utils',
	'models/AppModel',
	'views/BuildingsView', 'views/UpgradesView', 'views/LevelView',
	'collections/BuildingCollection', 'collections/UpgradeCollection',
	'text!templates/app.html', 'text!templates/alert.html'],
	function ($, _, Backbone, bootbox, utils,
		AppModel,
		BuildingsView, UpgradesView, LevelView,
		BuildingCollection, UpgradeCollection,
		appTemplate, alertTemplate) {
	
	var localStorage = window.localStorage;
	
	var AppView = Backbone.View.extend({
		
		el: '.container',
		
		model: AppModel,
		
		template: _.template(appTemplate, utils),
		
		events: {
			'click #bulb': 'bulbClick',
			'click #saveG': 'saveGClick',
			'click #exportG': 'exportGClick',
			'click #importG': 'importGClick',
			'click #resetG': 'resetGClick',
			'click #hresetG': 'hresetGClick',
			'click #factNameDisplay': 'openFactoryName',
			
			'input #autosave': 'autosaveInput',
			'keyup #autosave': 'autosaveInput'
		},
		
		initialize: function () {
			this.buildingsView = new BuildingsView({ collection: this.model.buildingCollection });
			this.upgradesView = new UpgradesView({ collection: this.model.upgradeCollection });
			this.levelView = new LevelView({ model: this.model.levelModel });
			
			this.listenTo(this.model, 'volts', _.debounce(this.refreshCount, 0));
			//this.listenTo(AppModel, 'story', this.storyTicker);
			this.listenTo(AppModel, 'save', this.saveNotify);
			
			this.render();
		},
		
		// Render
		render: function () {
			this.$el.html(this.template(this.model.attributes));
			this.$('#lightbulbListContainer').append(this.buildingsView.render().el);
			this.$('#upgradeListContainer').append(this.upgradesView.render().el);
			return this;
		},
		
		refresh: function () {
			this.render().switchColumn(this.lastColumn, this.lastTemplate);
			return this;
		},
		
		refreshCount: function () {
			this.$('#count').text(utils.metric(Math.floor(this.model.get('volts'))));
			document.title = utils.metric(Math.floor(this.model.get('volts')))
				+ ' | Lightbulb Inc';
			this.$('#vps').text(utils.metric(this.model.get('vps'), 2));
			return this;
		},
		
		refreshFactoryName: function () {
			$('#factNameDisplay').text(this.model.get('factName'));
		},
		
		// Alerts
		notify: function (title, description, type, duration) {
			if (!type) type = 'alert-success';
			if (!duration) duration = 1000;
			
			var alert = $(_.template(alertTemplate)({
				title: title,
				description: description,
				type: type
			}));
			alert.fadeIn().delay(duration).fadeOut(function () { $(this).remove(); });
			$('#notify').append(alert);
		},
		
		// Panels
		switchColumn: function (name, string) {
			var template = _.template(string);
			this.$('#col2').html(template(_.extend(this.model.toJSON(), {
				levelModel: this.model.levelModel.toJSON(),
				metric: utils.metric,
				magnitudes: utils.magnitudes
			})));
			this.$('.levelContainer').replaceWith(this.levelView.el);
			
			this.lastColumn = name;
			this.lastTemplate = string;
			return this;
		},
		
		// Events
		bulbClick: function (e) {
			var num = this.model.click();
			$('body').append(
				$('<div class="particle"></div>')
					.text('+' + num)
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
				message: 'Are you sure you want to reset?<br><span class="warning"><b>Warning:</b> resetting will not gain bonuses.</span>',
				buttons: {
					success: {
						label: "Yes",
						className: "btn-success",
						callback: function() {
							self.model.reset().destroy();
							self.refresh();
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
								self.model.reset().destroy();
								self.model.fetch({
									save: save,
									success: function (model) {
										self.refresh();
										self.model.recalc();
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
		
		openFactoryName: function () {
			var self = this;
			bootbox.prompt({
				title: 'Name your factory',
				value: this.model.get('factName'),
				callback: function (name) {
					if (name) {
						self.model.set('factName', name);
						self.refreshFactoryName();
					}
				}
			});
		},
		
		// Options event
		autosaveInput: function () {
			this.model.set('autosave', parseInt(this.$('#autosave').val()));
		},
		
		saveNotify: function () {
			this.notify('Game saved');
		},
		
		// story ticker
		storyTicker: function (story) {
			this.notify('Story', story, 'alert-story', 5000);
		}
		
	});
	
	return AppView;
	
});