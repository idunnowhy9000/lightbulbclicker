var calc = {
	calcCost: function (x){
		return Math.round(x.cost * Math.pow(x.increase,x.amount))
	},
	calcVPS: function (buildings){
		var x=0,
			boost=1,
			boostAll = 1;
		// date boost
		var today = new Date();
		var boostDates=[new Date(today.getYear(),21,3)];
		for(i=0;i<boostDates.length;++i){
			if(today == boostDates[i]){
				boostAll += 0.01;
			}
		}
		// calculate
		for (b in buildings) {
			a = buildings[b];
			x += (a.vps * boost * boostAll) * a.amount;
		}
		
		return x*boost;
	},
	rand: function (min, max) {
		return Math.floor(Math.random() * (max - min)) + min;
	},
	subtractDays: function (date1, date2) {
		return new Date().parse(date1.valueOf() - date2.valueOf())/(24*60*60*1000);
	}
}