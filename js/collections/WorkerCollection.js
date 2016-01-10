define(['backbone', 'models/WorkerModel'],
	function (Backbone, WorkerModel) {
	
	var WorkerCollection = Backbone.Collection.extend({
		
		model: WorkerModel,
		
		spawn: function () {
			var worker = new WorkerModel();
			this.add(worker);
			return worker;
		},
		
		rps: function () {
			var rps = 0;
			this.each(function (worker) {
				if (worker.get('earned')) {
					rps += worker.rps();
				}
			});
			return rps;
		},
		
		workersOwned: function () {
			return this.length;
		}
		
	});
	
	return WorkerCollection;
	
});