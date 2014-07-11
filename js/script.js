var 
	// player vars
		volt = 0,
		volttot=0,
		prestiege = 0,
		amountBulb=[],
		amountUpgrade=[],
		clickBoost = 1,
		items=[];
function initGame(){
	// print buildings
	for (b in lightbulb){
		console.log(lightbulb[b]);
		
		$("#lightbulb").append(
			"<div class='buildingObj' id="+b+"><div class='buildingAmount'>"+lightbulb[b].amount+"</div><div class='buildingInfo'><div id='buildingName'>"+lightbulb[b].name+"</div><div class='buildingCost'>"+calcCost(lightbulb[b])+"</div></div>"
		);
		function bi(i){
			return function(){
				buy_item(i);
			}
		}
		$("#" + b).click(bi(lightbulb[b]));
	}
	// print upgrades
	for (b in upgrades){
		function bU(up){
			return function(){
				console.log(up);
				buy_upgrade(up);
				updateTable();
			}
		}
		$("#upgrade").append("<div class='upgradesBox' id='upgrades-"+b+"'><img src='img/upgrades/"+b+".png'></div>");
		$("#upgrades-" + b).click(bU(b))
	};
	// earn volts per click
	$("#bulb").click(function(){earnVolt(1);});
	//increment volts
	incrementV = setInterval(function(){
		// earn vps
		var vps = calcVPS();
		earnVolt(vps);
		// update
		updateSidebar(vps);
		document.title = Math.round(volt) + " volt" + (volt <= 1 ? "" : "s");
	},1000);
	// initialize menu
	$("#credits").click(function(){credits();});
	// update
	updateTable();
}
function buy_item(x){
cost = calcCost(x);
	if(volt < cost){alertStatus("Not enough volt");}
	else{
		x.amount++;
		volt-=cost;
		updateTable();
		// achievements
		am = x.amount;
		n = x.name.split(" ")[0];
		console.log(am,x,n);
		// incandescent
		if(n == "Incandescent" && am == 1) earnAchievement("edisonstep");
		if(n == "Incandescent" && am == 2) earnAchievement("double");
		if(n == "Incandescent" && am == 50) earnAchievement("fiftyshades");
		if(n == "Incandescent" && am == 100) earnAchievement("hundredfoot");
	}
}
function buy_upgrade(x){
i = upgrades[x];
console.log(i);
	if(volt < i.cost){alertStatus("Not enough volt");}
	else if(i.amount == 1){alertStatus("Nope.");}
	else{
		i.amount = 1;
		volt -= i.cost;
		updateTable();
		console.log("bought item");
		$("#upgrades-" + x).remove();
	}
}
function earnVolt(i){
	volt+=i;
	volttot+=i;
	updateSidebar();
	// check volt for achievement
	function checkV(v){return (volt > v) ? true : false;}
	if(checkV(1)) earnAchievement("firsttime");
	if(checkV(100)) earnAchievement("hundreds");
	if(checkV(1000)) earnAchievement("thoudsands");
	if(checkV(1000000)) earnAchievement("millions");
	if(checkV(10000000)) earnAchievement("tenmillion");
}
function updateTable(){
// clear everything

//
	for(b in lightbulb){
		$("#" + b + " .buildingAmount").text(lightbulb[b].amount);
		$("#" + b + " .buildingCost").text(calcCost(lightbulb[b]));
		$("#" + b).tooltipster({
			content:"Costs "+numberWithCommas(calcCost(lightbulb[b]))+" volts.",
			contentAsHTML:true
		});
	}
	for(u in upgrades){
		uG = upgrades[u];
		if(uG.amount == 1){continue;}
		else{
			$("#upgrades-" + u).tooltipster({
				content:uG.name + "<br><span class='upgradeDesc'>"+((typeof uG.desc == "undefined") ? "..." :uG.desc)+"</span><br><span class='upgradeCost'>Costs "+numberWithCommas(uG.cost)+" volts.</span>",
				contentAsHTML:true
			});
		}
	}
}
function updateSidebar(i){
	$("#count").text(numberWithCommas(Math.round(volt)) + " volts");
	if(!(typeof i ==='undefined'))$("#vps").text(i.toFixed(2) + " volts/second");
}
function showAchievement(name){
	$("#achievements").hide().append('<div class="achievement"><div class=achievementImg></div><div class="achievementInfo"><div class="achievementNote">Achievement Unlocked!</div><div class=achievementName>'+name+'</div></div></div>').fadeIn().delay(1000).fadeOut();
}
function earnAchievement(id){
	var thing = achievements[id];
	if(thing.amount == 0){
		showAchievement(thing.name);
		thing.amount = 1;
		console.log("bought");
	}
}
////
$(document).ready(function(){
	initGame();
});