/*
This is where lightbulb data are stored
*/
var lightbulb = {
		"incandescent":{
			name:"Incandescent Lightbulb",
			cost:15,
			vps:0.1,
			description:"The best invention in history has now begun."
		},
		"smasher":{
			name:"Lightbulb Smasher",
			cost:100,
			vps:8,
			description:"Hires some muscular guys to smash bulbs."
		},
		"thundercol":{
			name:"Thunder Collector",
			cost:6966,
			vps:25,
			description:"Collects thunder every where they strike."
		},
		"halogen":{
			name:"Halogen Lightbulb",
			cost:31415,
			vps:35,
			description:"AHH! IT's TO BRIGHT!"
		},
		"tan":{
			name:"Tan Lightbulb",
			cost:666777,
			vps:40,
			description:"much better!"
		},
		"LED":{
			name:"LED Lightbulb",
			cost:1618030,
			vps:99,
			description:"LEDs you to your destiny."
		},
		"bacterial":{
			name:"Bacterial Lightbulb",
			cost:62831800,
			vps:6283,
			description:"Small, tiny life forms that will soon take over the WORLD!"
		},
		"dinosaur":{
			name:"Dinosaur Lightbulb",
			cost:99999999,
			vps:99999,
			description:"Jurassic Park remake CONFIRMED!... or is it?"
		},
		"human":{
			name:"Human Lightbulb",
			cost:999999999,
			vps:999999,
			description:"Every human almost always obey your commmands, made from the legendary fungus bulb"
		}
	};
	/*upgrades = [
		// incandescent bulbs
		"incandescentcy":{
			name:"Incandescentcy",
			cost:0,
			boost:["incandescent",0.1]
		},
		"blueprints":{
			name:"Blueprints!",
			cost:0,
			boost:["incandescent",0.1]
		}
		// bulb smasher
		"experimentroom":{
			name:"Experimentation Room",
			cost:0,
			boost:["smasher",0.1]
		},
		"bigham":{ // it's not what it sound like
			name:"Big Hammer",
			cost:0,
			boost:["smasher",0.1]
		},
		// thundercollector
		"relaxation":{
			name:"Electron Relaxation",
			cost:0,
			boost:["thundercol",0.1]
			
		},
		"excitation":{
			name:"Electron Excitation",
			cost:0,
			boost:["thundercol",0.1],
		},
		// bacterial
		"fungus":{
			name:"There's a fungus among us",
			cost:0,
			boost:["bacterial",0.1]
		},
		// human
		"evo":{
			name:"Evolution!",
			cost:0,
			boost:["human",0.1]
		},
		"woodtools":{
			name:"Wooden Tools",
			cost:0,
			boost:["human",0.1]
		},
		"stonetools":{
			name:"Stone Tools",
			cost:0,
			boost:["human",0.1]
		},"ironres":{
			name:"Iron Research Facillity",
			cost:0,
			boost:["human",0.1]
		},"hitech":{
			name:"Hi Tech",
			cost:0,
			boost:["human",0.1]
		},
		// dinosaur
		"megadinos":{
			name:"Mega DinoBulbs",
			cost:0,
			boost:["dinosaur",0.1]
		},
		// boosts all
		"diode":{
			name:"Diode",
			cost:0,
			boost:["all",0.1]
		},
		"factweb":{
			name:"Factory Website",
			cost:0,
			boost:["all",0.1]
		},
		"tvads":{
			name:"TV advertisement",
			cost:0,
			boost:["all",0.1]
		},
		"redditbot":{
			name:"Reddit BotBulb",
			cost:0,
			boost:["all",0.1]
		},
		"bulbcon":{
			name:"Bulb Convention",
			cost:0,
			boost:["all",0.1]
		},
		"warzone":{
			name:"Lightbulb Warzone",
			cost:0,
			boost:["all",0.1]
		},
	];*/
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