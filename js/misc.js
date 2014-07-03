/*
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
*/
function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}
/*
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
*/

/*function addVolt(v){
	volt += v;
	volttot +=v;
}*/
function shuffle(o){ //v1.0
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
}; // courtesy of google
/*function credits(){
	vex.dialog.alert("<p><a href='http://somerandomdude.com/work/iconic/'>Iconic</a> - Lightbulb icon<br><a href='http://icons8.com/'>Icons8</a> - Power Icon<br><a href='http://www.w3schools.com'>W3Schools</a> - Teaching me how to code<br><a href='http://orteil.dashnet.org/cookieclicker/'>Cookie Clicker</a> - Inspiration<br>Phill Ostroff's <a href='http://flic.kr/p/ejocSE'>image</a> - Space Image<br>Dinosaur Lightbulb (not really an inspiration but its mega forme is): Bulbasaur, <del>Ivysaur</del>, Venusaur, Venusaurite, Mega Venusaur - Nintendo, Creatures Inc, Game Freak</p><p><strong>I DO NOT OWN ANY OF THESE, MOST CONTENT ARE COPYRIGHTED OR IN A GENERAL PUBLIC LICENSE / CREATIVE COMMONS BY THEIR RESPECTIVE OWNERS.</strong></p><br><p><a href='changelog.txt'>Change log</a></p>");
}*/
function alertStatus(thing){
	var x="status";
	$("#" + x).hide().text(thing).fadeIn();
	setTimeout(function(){$("#"+x).fadeOut()},3000)
}
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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
//