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
	items=[],
// game vars
	version = 0.43,
	today = new Date(),
	month = ["January","February","March","April","May","June","July","August","September","October","November","December"],
	itemList=[["Fish",1],["Flower",1],["Bone",2],["Stick",2],["Dirt",1],["Water Bottle",3],["Boots",2],["Coal",1],["Book",2],["Soda Pop",4],["Sword",5],["Bow",5],["Dagger",5],["Tripod",4],["Train",4],["Cows",4],["Pig",4]], // [itemname,tier]
	itemEnchant=[["Bacterial Proof",5],["Water Proof",1],["Fire Proof",2],["Oblivion",5],["Forged",6],["Biodegradable",3]], // [enchantName,tier]
	itemType=["Excalibur","Gay People","Strength","Flash","Lightbulb","Frost"],
	lightbulb = [
		{
			name:"Incandescent Lightbulb",
			cost:15,
			vps:0.1
		},
		{
			name:"Lightbulb Smasher",
			cost:100,
			vps:8
		},
		{
			name:"Thunder Collector",
			cost:6966,
			vps:25
		},
		{
			name:"Halogen Lightbulb",
			cost:31415,
			vps:35
		},
		{
			name:"Tan Lightbulb",
			cost:666777,
			vps:40
		},
		{
			name:"LED Lightbulb",
			cost:1618030,
			vps:99
		},
		{
			name:"Bacterial Lightbulb",
			cost:62831800,
			vps:6283
		},
		{
			name:"Dinosaur Lightbulb",
			cost:99999999,
			vps:99999
		},
		{
			name:"Human Lightbulb",
			cost:999999999,
			vps:999999
		}
	],
	upgrades = [
		{
			name:"Incandescentcy",
			cost:0,
			boost:[0,0.1]
		},
		{
			name:"Experimentation Room",
			cost:0,
			boost:[1,0.1]
			
		},
		{
			name:"Electron Relaxation",
			cost:0,
			boost:[2,0.1]
			
		},
		{
			name:"Electron Excitation",
			cost:0,
			boost:[2,0.1]
		},
		{
			name:"Diode",
			cost:0,
			boost:["all",0.1]
		},
		{
			name:"Factory Website",
			cost:0,
			boost:["all",0.1]
		},
		{
			name:"TV advertisement",
			cost:0,
			boost:["all",0.1]
		},
		{
			name:"Reddit BotBulb",
			cost:0,
			boost:["all",0.1]
		},
		{
			name:"Bulb Convention",
			cost:0,
			boost:["all",0.1]
		},
		{
			name:"Lightbulb Warzone",
			cost:0,
			boost:["all",0.1]
		},
		{
			name:"Mega DinoBulbs",
			cost:0,
			boost:[7,0.1]
		}
	]
;
function credits(){
	vex.dialog.alert("<p><a href='http://somerandomdude.com/work/iconic/'>Iconic</a> - Lightbulb icon<br><a href='http://icons8.com/'>Icons8</a> - Power Icon<br><a href='http://www.w3schools.com'>W3Schools</a> - Teaching me how to code<br><a href='http://orteil.dashnet.org/cookieclicker/'>Cookie Clicker</a> - Inspiration<br>Phill Ostroff's <a href='http://flic.kr/p/ejocSE'>image</a> - Space Image<br>Dinosaur Lightbulb (not really an inspiration but its mega forme is): Bulbasaur, <del>Ivysaur</del>, Venusaur, Venusaurite, Mega Venusaur - Nintendo, Creatures Inc, Game Freak</p><p><strong>I DO NOT OWN ANY OF THESE, MOST CONTENT ARE COPYRIGHTED OR IN A GENERAL PUBLIC LICENSE / CREATIVE COMMONS BY THEIR RESPECTIVE OWNERS.</strong></p><br><p><a href='changelog.txt'>Change log</a></p>");
}
function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}
function resetGame(){
	function a(x,y){
		for(i=0;i<y.length;++i){
			x[i]=0
		};
	}
	a(amountBulb,lightbulb);
	a(amountUpgrade,upgrades);
}
function initGame(){
	if( localStorage.getItem("player") === null ){
	resetGame();
	}
	updateTable();
	updateSideBar();
}
function alertS(thing){
	var x="status";
	$("#" + x).hide().text(thing).fadeIn();
	setTimeout(function(){$("#"+x).fadeOut()},3000)
}
function buy(a,b,c){
console.log(a);
	cost = calcCost(a.cost,b[c]);
	console.log(cost);
	console.log(b[c]);
	if(volt < cost){
		alertS("Not Enough Volts");
	}
	else{
		volt-=cost;
		b[c]++;
	} updateTable();
}
function updateTable(){
	function a(x,y,z,xy){
		var n = "";
		for(i=0;i<y.length;++i){
			n += "<div class=buildingObj onclick='buy("+x+"["+i+"]"+","+xy+","+i+");' id="+x+i+"><div class=buildingAmount>"+z[i]+"</div><div class=buildingInfo><div class=buildingName>"+y[i].name+"</div><div id=buildingCost>"+calcCost(y[i].cost,z[i])+"</div></div></div>";
			
		}
		$("#"+x).html(n);
	}
	a("lightbulb",lightbulb,amountBulb,'amountBulb');
	
}
function updateSideBar(){
	$("#count").text(Math.round(volt) + " volts");
	document.title = Math.round(volt) + " volts";
	$('#vps').text(calcVPS().toFixed(2) + " volts/second");
}
function calcCost(x,y){
	return Math.round(x * Math.pow(1.15,y))
}
function calcVPS(){
	x=0;
	boost=1;
	for (i = 0; i < lightbulb.length; ++i)	{
		n=1;
		/*for(iA=0;iA<upgrades.length;++iA){
			if(amountUpgrade[iA]==1 && (upgrades[iA].boost[0] == i || upgrades[iA].boost[0]=="all")){
				n += upgrades.boost[iA][1];
			}
		}*/
		a = lightbulb[i];
		x += (a.vps * n) * amountBulb[i];
	}
	// boost
	// date boost
	thisYear = today.getYear()
	boostDates=[new Date(thisYear,21,3)];
	for(i=0;i<boostDates.length;++i){
		if(today == boostDates[i]){
			boost += 0.01;
		}
	}
	
	return x*boost;
}
function addVolt(v){
	volt += v;
	volttot +=v;
	updateSideBar();
}
function cheatCode(){
	// before 0.4: i can't believe you spent all your time making this game but you still didn't add cheat codes
	var c = "";
	vex.dialog.open({
  message: 'Enter cheat code:',
  input: "<input name=\"cheatcode\" type=\"text\" />",
  callback:function(data){
	if(data===false){return;}
	c = data.cheatcode;
	codes=[["boldly going forward cause we can't find reverse","<p>Where no man has gone before!</p><p class='left'><small>OP totally <del>loves</del> <ins>doesn't actually watch</ins> Star Trek</small></p>"],["allon-sy!","<p>OP thinks Amy Pond is sexy</p><p class=left><small>stop it, stupid javascript code</small></p>"],["TO INFINITY AND BEYOND!","<p>OP is gay for thinking that people watch Toy Story, and he is gay</p><p class=left><small>if you don't stop it, i will kill() you using <a href='http://linux.die.net/man/3/kill'>C</a></small></p>"],["do you want to build a snowman?","<p>WHY THE F ARE YOU THINKING ABOUT FROZEN IN "+month[today.getMonth()].toUpperCase()+"?</p>"]];
	for(i=0;i<codes.length;++i){
		//check
		if(c==codes[i][0]){
			// cheat stuff
			for(i=0; i<amountBulb.length; ++i){
				amountBulb[i] = Infinity;
			}
			for(i=0; i<amountUpgrade.length; ++i){
				amountUpgrade[i] = 1;
			}
			volt = Infinity;
			volttot = Infinity;
			updateView();
			// other
			vex.dialog.alert(codes[1]);
		}
	}
  }
	});
}
function importGame(){
	vex.dialog.open({
  message: 'Insert Save Data',
  input: "<input name=\"saveData\" type=\"text\" />",
  callback: function(data) {
    if (data === false) {
      return 0;
    }
    loadGame(data.saveData);
  }
});
}
function exportGame(){
	vex.dialog.open({
		message:'Save Data:',
		input: '<input type=text value="'+saveGame()+'">',
	});
}
function convertSaveFile(n){

}
function loadGame(n){
	//try{
		saveSplit = n.split("!");
		sVersion = parseFloat(saveSplit[0]);
		sVolt = parseFloat(saveSplit[1]);
		sVolttot = parseFloat(saveSplit[2]);
		sPrestiege = parseFloat(saveSplit[3]);
		sAmountBulb = saveSplit[4];
		sAmountUpgrade = saveSplit[5];
		// checks
		if (sVersion < version){
			// check compatibility
			if (sVersion <= 0.38 && sVersion > 0.20){
				convertSaveFile(n);return;
			} else if(sVersion < 0.20){
				vex.dialog.alert("This version is not supported");
				return;
			}
		} else if (sVersion > version){// what are you? from the future?
			
		}
		console.log('pass');
		// begin import
		volt = parseFloat(sVolt);
		console.log(volt);
		console.log(parseInt(sVolt));
		
		volttot = parseFloat(sVolttot);
		prestiege = sPrestiege;
		amountBulb = JSON.parse(sAmountBulb);
		amountUpgrade = JSON.parse(sAmountUpgrade);
		updateTable();
	/*} catch (e){
		vex.dialog.alert("ERROR: "+e.toString()+".\nIf any more errors occur, PM <a href='http://www.reddit.com/message/compose/?to=idunnowhy9000'>/u/idunnowhy9000 on reddit</a>");
	}*/
}
function saveGame(){
	var x = "";
	x+=version + "!";
	x+=volt + "!";
	x+=volttot + "!";
	x+=prestiege + "!";
	x+=JSON.stringify(amountBulb)+"!";
	x+=JSON.stringify(amountUpgrade)+"!";
	console.log(x);
	return x;
}
function startGame(){
	// todo: add this in
}
function genItem(){
	var iSpecie = shuffle(itemList)[0],
	iEnchant = shuffle(itemEnchant)[0],
	iType = shuffle(itemType)[0],
	cost = (iSpecie[1] + iEnchant[1] + iType.length) * 100 * getRandomArbitrary(0.87,1);
	return {name:(iEnchant[0] + " " + iSpecie[0] + " of " + iType),cost:Math.round(cost)};
}
function shuffle(o){ //v1.0
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
}; // courtesy of google
////////////
$("#bulb").click(function(){
	clicks =1 * clickBoost; 
	addVolt(clicks);
	// click effect
	curBulb = $("#bulb");
	cNums = ".clickNums";
	$("#bulbContainer").append("<div class=clickNums>"+clicks+"</div>");
	$(cNums+":last-child").css({
		left:getRandomArbitrary(0,250),
		top:getRandomArbitrary(0,400)
	});
	setTimeout(function(){
		$(cNums).fadeOut(400,function(){$(this).remove();});
	},3000);
});
$("#credits").click(function(){credits()});
$("#saveG").click(function(){localStorage.setItem("player",saveGame())});
$("#resetG").click(function(){resetGame()});
$("#importG").click(function(){importGame()});
$("#exportG").click(function(){exportGame()});
$("#cheat").click(function(){cheatCode()});
$(function(){
	initGame();
});
// save every 1 min
setInterval(function(){
	saveGame();
	
}, 60000);
// increment every second
setInterval(function(){
	addVolt(calcVPS());
},1000);