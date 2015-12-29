define(['underscore'], function (_) {
	
	var utils = {};
	
	utils.toId = function (text) { return text.toString().toLowerCase().replace(/[^a-z0-9]+/g, ''); };
	utils.choose = function (arr) { return arr[Math.floor(Math.random() * arr.length)]; };
	
	utils.beautify = function (num) { return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','); };
	utils.metricSuffix = function (n) {
	    var ranges = [
			{ divider: 1e30 , suffix: 'multivolts' },
			{ divider: 1e27 , suffix: 'hellavolts' },
			{ divider: 1e24 , suffix: 'yottavolts' },
			{ divider: 1e21 , suffix: 'zettavolts' },
			{ divider: 1e18 , suffix: 'petavolts' },
			{ divider: 1e15 , suffix: 'exavolts' },
			{ divider: 1e12 , suffix: 'teravolts' },
			{ divider: 1e9 , suffix: 'gigavolts' },
			{ divider: 1e6 , suffix: 'megavolts' },
	    ];
	    return (function () {
			if (n <= 1) return n + ' volt';
			for (var i = 0; i < ranges.length; i++) {
				if (n >= ranges[i].divider) {
					if ((n / ranges[i].divider) % 1 !== 0) return (n / ranges[i].divider).toFixed(2).toString() + ' ' + ranges[i].suffix;
					return (n / ranges[i].divider).toString() + ' ' + ranges[i].suffix;
				}
			}
			return utils.beautify(n) + ' volts';
	    })();
	};
	
	utils.increment = function (model, prop, val) {
		if (val === undefined) { val = 1; }
		model.set(prop, model.get(prop) + val);
		return true;
	};
	
	utils.decrement = function (model, prop, val) {
		if (val === undefined) { val = 1; }
		return utils.increment(model, prop, -val);
	};
	
	_.utils = utils;
	
	return utils;
	
});