var calc = {
	calcCost: function (x){
		return Math.round(x.cost * Math.pow(x.increase,x.amount))
	},
	calcVPS: function (){
		var total=0,
			boostAll = 1,
			
			buildings = Game.buildings,
			upgrades = Game.upgrades;
		// calculate
		for (b in buildings) { // buildings
			a = buildings[b];
			var bdBoost = 0, timesboost = 1;
			for (u in upgrades) {
				u = upgrades[u];
				for (ups in u.boost) {
					if (u.boost[ups][0] === a.id || u.boost[ups][0] === 'all') {
						var _b = u.boost[ups][1];
						if (!typeof _b === 'number') {
							if (_b.substring(0,1) === 'x') {
								timesboost += _b.substring(1,_b.length);
							}
						}
						else { bdBoost += _b; }
					}
				}
			}
			total += ((a.vps + bdBoost) * timesboost) * a.amount;
		}
		
		return total*boostAll;
	},
	rand: function (min, max) {
		return Math.floor(Math.random() * (max - min)) + min;
	},
	subtractDays: function (date1, date2) {
		return new Date().parse(date1.valueOf() - date2.valueOf())/(24*60*60*1000);
	}
}