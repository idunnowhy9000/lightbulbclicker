// save load functions

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
function saveGame(version,volt,volttot,prestiege,amountBulb,amountUpgrade){
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
function convertSaveFile(n){

}