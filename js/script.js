// todo: fix the code
$(document).ready(function(){ // my body is ready
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
		month = ["January","February","March","April","May","June","July","August","September","October","November","December"];
	;
	function updateTable(){
		function a(x,y,z,xy){
			var n = "";
			for(i=0;i<y.length;++i){
				n += "<div class=buildingObj onclick='buy("+x+"["+i+"]"+","+xy+","+i+");' id="+x+i+"><div class=buildingAmount>"+z[i]+"</div><div class=buildingInfo><div class=buildingName>"+y[i].name+"</div><div id=buildingCost>"+calcCost(y[i].cost,z[i])+"</div></div></div>";
				
			}
			$("#"+x).html(n);
		}
		function b(x,y,z,xy){
			var n="";
			for(i=0;i<y.length;++i){
				n+="<div class=upgradeObj onclick='buy("+x+"["+i+"],"+xy+")'><div class=upgradeImage><img src='img/"+x+i+".png'></div></div>";
			}
		}
		a("lightbulb",lightbulb,amountBulb,'amountBulb');
		
	}
	function updateSideBar(){
		$("#count").text(Math.round(volt) + " volts");
		document.title = Math.round(volt) + " volts";
		$('#vps').text(calcVPS().toFixed(2) + " volts/second");
	}
	function startGame(){
		// todo: add this in
	}
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
});