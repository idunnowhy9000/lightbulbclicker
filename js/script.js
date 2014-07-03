var 
	// player vars
		volt = 0,
		volttot=0,
		prestiege = 0,
		amountBulb=[],
		amountUpgrade=[],
		clickBoost = 1,
		playerSet={
			"firstTime": 0
		},
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
				buy_upgrade(up);
				updateTable();
			}
		}
		$("#upgrade").append("<div class='upgradesBox' id='"+b+"'><img src='img/upgrades/"+b+".png'></div>");
		$("#" + b).click(bU(b))
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
		$("#" + x).remove();
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
			$("#" + u).tooltipster({
				content:uG.name + "<br>"+((typeof uG.desc == "undefined") ? "..." :uG.desc)+" <br>Costs "+numberWithCommas(uG.cost)+" volts.",
				contentAsHTML:true
			});
		}
	}
}
function updateSidebar(i){
	$("#count").text(numberWithCommas(Math.round(volt)) + " volts");
	if(!(typeof i ==='undefined'))$("#vps").text(i.toFixed(2) + " volts/second");
}
////
$(document).ready(function(){
	initGame();
});