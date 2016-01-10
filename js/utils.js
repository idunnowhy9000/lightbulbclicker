define(function () {

	var utils = {};
	utils.toId = function (text) { return text.toString().toLowerCase().replace(/[^a-z0-9]+/g, ''); };
	
	utils.increment = function (model, prop, val) {
		if (val === undefined) val = 1;
		model.set(prop, model.get(prop) + val);
	};
	
	utils.decrement = function (model, prop, val) {
		if (val === undefined) val = 1;
		model.set(prop, model.get(prop) - val);
	};
	
	// http://stackoverflow.com/a/28608086
	function numberFormatter(units, plural) {
		var single = units[0]||'';
		if (!plural) plural = '';
		
		return function (num) {
			return beautify(function () {
				var decimal;
				if (num > 1000000) {
					for(var i=units.length-1; i>=0; i--) {
						decimal = Math.pow(1000, i+1);

						if(num <= -decimal || num >= decimal) {
							return (Math.round((num / decimal) * 1000) / 1000) + units[i];
						}
					}
				} else {
					num = Math.round(num * 1000) / 1000;
					if (num < 1) return num + single;
					else return num + plural;
				}
			}());
		}
	}
	
	function beautify(value) {
		return value.replace(/\B(?=(\d{3})+(?!\d))/g,',');
	}
	
	utils.metric = numberFormatter([
		' volt',
		' megavolts',
		' gigavolts',
		' teravolts',
		' exavolts',
		' petavolts',
		' zettavolts',
		' yottavolts',
		' rozettavolts',
		' jiggavolts',
		' hellavolts',
		' multivolts'
	], ' volts');
	
	utils.metricShort = numberFormatter([
		' V',
		' MV',
		' GV',
		' TV',
		' EV',
		' PV',
		' ZV',
		' YV',
		' RV',
		' JV',
		' HV',
		' MiV',
	]);
	
	utils.magnitudes = numberFormatter([
		'',
		' million',
		' billion',
		' trillion',
		' quadrillion',
		' quintillion',
		' sextillion',
		' septillion',
		' octillion',
		' nonillion',
		' decillion',
		' undecillion'
	]);
	
	return utils;
	
});