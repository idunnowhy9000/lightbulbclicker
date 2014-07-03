
function calcCost(x){
	return Math.round(x.cost * Math.pow(1.15,x.amount))
}
function calcVPS(){
	x=0;
	boost=1;
	/*for(b in 
		n=1;
		/*for(iA=0;iA<upgrades.length;++iA){
			if(amountUpgrade[iA]==1 && (upgrades[iA].boost[0] == i || upgrades[iA].boost[0]=="all")){
				n += upgrades.boost[iA][1];
			}
		}
		a = lightbulb[i];
		x += (a.vps * n) * amountBulb[i];
	}*/
	for (b in lightbulb){
		n = 1;
		a = lightbulb[b];
		for(u in upgrades){
			uG = upgrades[u];
			if(uG.amount == 1 && uG.boost[0] == b){
				n+=uG.boost[1]
			}
		}
		x+= (a.vps * n) * a.amount;
	}
	// boost
	// date boost
	thisYear = today.getYear();
	boostDates=[new Date(thisYear,21,3)];
	for(i=0;i<boostDates.length;++i){
		if(today == boostDates[i]){
			boost += 0.01;
		}
	}
	
	return x*boost;
}