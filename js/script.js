var 
	// player vars
		volt = 0,
		volttot=0,
		prestiege = 0,
		amountBulb=[],
		amountUpgrade=[],
		clickBoost = 1,
		playerSet={
			firstUse:0
		},
		items=[];
function initGame(){
	// print buildings
	for (b in lightbulb){
		console.log(lightbulb[b]);
		
		$("#lightbulb").append(
			"<div class='buildingObj' id="+b+"><div class='buildingAmount'>"+lightbulb[b].amount+"</div><div class='buildingInfo'><div id='buildingName'>"+lightbulb[b].name+"</div><div id='cost'>"+calcCost(lightbulb[b])+"</div></div>"
		);
		function bi(i){
			return function(){
				buy_item(i);
			}
		}
		$("#" + b).click(bi(lightbulb[b]));
	}
	$("#bulb").click(function(){earnVolt(1);});
	incrementV = setInterval(function(){
		// earn vps
		var vps = calcVPS();
		earnVolt(vps);
		// update
		updateSidebar(vps);
		document.title = Math.round(volt) + " volt" + (volt <= 1 ? "" : "s");
	},1000);
}
function buy_item(x){
cost = calcCost(x);
	if(volt < cost){alertStatus("Not enough volt");}
	else{
		x.amount++;
		volt-=cost;
		updateTable();
	}
}
function earnVolt(i){
	volt+=i;
	volttot+=i;
	updateSidebar();
}
function updateTable(){
	for(b in lightbulb){
		$("#" + b + " .buildingAmount").text(lightbulb[b].amount);
	}
}
function updateSidebar(vps){
	$("#count").text(Math.round(volt) + " volts");
	//$("#vps").text(vps + " volts/second");
}
////
$(document).ready(function(){
	initGame();
});