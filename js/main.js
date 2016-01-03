require(['backbone', 'jquery', 'bootbox',
	'views/AppView', 'routers/Router',
	'bootstrap'],
	function (Backbone, $, bootbox, AppView, Router) {
	
	bootbox.setDefaults({
		backdrop: true
	});
	
	Router.initialize({ appView: new AppView() });
});