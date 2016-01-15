(function (window, $) {
	
	// Utilities
	function choose(arr) {return arr[Math.floor(Math.random()*arr.length)];}
	
	function removeFromArray(array, item){
		if(array.indexOf(item)!==-1){
			array.splice(array.indexOf(item),1);
		}
	}
	
	function dateDiff(left, right){
		var ms=left - right;
		if(ms>=3.154e+10)return Math.floor(ms/3.154e+10)+' years ago';
		if (ms>=2.628e+9) return Math.floor(ms/2.628e+9)+' months ago';
		if (ms>=8.64e7) return Math.floor(ms/8.64e7)+' days ago';
		if (ms>=3.6e6) return Math.floor(ms/3.6e6)+' hours ago';
		if (ms>=60000) return Math.floor(ms/60000)+' minutes ago';
		if (ms>=1000) return Math.floor(ms/1000)+' seconds ago';
		return 'just now';
	}
	
	//http://stackoverflow.com/a/9756789
	function escapeHTML(str, preserveCR) {
		return (str+'')
			.replace(/&/g, '&amp;') /* This MUST be the 1st replacement. */
			.replace(/'/g, '&apos;') /* The 4 other predefined entities, required. */
			.replace(/"/g, '&quot;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			;
	}
	
	// Number formatters
	function numberFormatter(units, plural) {
		var single=units[0]||'';
		plural=plural||units[0];
		
		return function (num) {
			var decimal;
			if (num>1000000) {
				for(var i=units.length-1; i>=0; i--) {
					decimal=Math.pow(1000, i+1);

					if(num <= -decimal || num>=decimal) {
						return (Math.round((num / decimal) * 1000) / 1000) + units[i];
					}
				}
			} else {
				num=Math.round(num * 1000) / 1000;
				if (num <= 1) return num + single;
				else return num + plural;
			}
		}
	}
	
	var metric=[
		numberFormatter([
			' volt',
			' megavolts',
			' gigavolts',
			' teravolts',
			' exavolts',
			' petavolts',
			' zettavolts',
			' yottavolts',
			' multivolts',
			' hellavolts',
			' rozettavolts',
			' jiggavolts',
			' nirvanavolts',
			' wattavolts',
			' vendettavolts'
		], ' volts'),
		numberFormatter([
			' V',
			' MV',
			' GV',
			' TV',
			' EV',
			' PV',
			' ZV',
			' YV',
			' MiV',
			' HV',
			' RV',
			' JV',
			' NV',
			' WV',
			' VV'
		])
	],
	
	magnitudes=[
		numberFormatter([
			'',
			' million',
			' billion',
			' trillion',
			' quadrillion',
			' quintillion',
			' sextillion',
			' septillion',
			' octillion',
			' nonillion',
			' decillion',
			' undecillion',
			' duodecillion',
			' tredecillion',
			' quattuordecillion',
			' quindecillion'
		]),
		numberFormatter([
			'',
			' M',
			' B',
			' T',
			' Qa',
			' Qi',
			' Sx',
			' Sp',
			' Oc',
			' No',
			' Dc',
			' UnD',
			' DoD',
			' TrD',
			' QaD',
			' QiD'
		])
	];
	
	/************************************
	GAME
	************************************/
	var Game={};
	
	Game.version=2.01601; // y.ear month
	Game.versionRead='2.016a';
	
	Game.ready=0;
	
	Game.saveFile='LBClicker';
	
	Game.init=function () {
		Game.ready=1;
		
		Game.fps=30;
		Game.T=0;
		Game.drawT=0;
		
		Game.volts=0; // in bank
		Game.voltsTot=0; // total
		Game.voltsTotAll=0; // all time
		
		Game.research=0; // in bank
		Game.researchTot=0; // total
		Game.researchTotAll=0; // all time
		
		Game.vps=0;
		Game.m_vps=0;
		Game.expps=0;
		
		// stats
		Game.clicked=0;
		Game.factName='Your Factory';
		
		// battles
		Game.currentBattle=false;
		
		// dates
		Game.sessionStart=Date.now();
		Game.gameStart=Date.now();
		Game.lastDate =Date.now();
		
		// bonuses
		Game.productionBonus=0;
		Game.clickBonus=0;
		Game.expBonus=0;
		
		// options
		Game.prefs={
			autoSave:60,
			focus:1,
			shortNum:0
		};
		
		// menu
		Game.onMenu='';
		if(location.hash) Game.onMenu = location.hash.substr(1);
		if(Game.onMenu==='main')Game.onMenu=''; // fix for refresh
		
		// track events
		Game.cursorX=0;
		Game.cursorY=0;
		$(document).on('mousemove mouseover', function(e) {
			Game.cursorX=e.pageX;
			Game.cursorY=e.pageY;
		});
		
		Game.mousedown=0;
		$(document).mousedown(function(){Game.mouseDown=1});
		$(document).mouseup(function(){Game.mouseDown=0});
		
		Game.windowW=$(window).width();
		Game.windowH=$(window).height();
		$(window).resize(function(){
			Game.windowW=$(window).width()
			Game.windowH=$(window).height()
		});
		
		// displays
		Game.displayJobs=false;
		
		// lightning
		Game.Energy.reset();
		
		// load
		Game.load();
		Game.recalc();
		
		// loop and draw
		Game.draw();
		Game.loop();
	};
	
	/************************************
	PREFERENCES
	************************************/
	Game.toggle=function(name){
		Game.prefs[name] = Game.prefs[name]?0:1;
	}
	
	/************************************
	BEAUTIFIERS
	************************************/
	function beautify(fn) {
		return function(value, base){
			var negative=(value<0)?'-':'';
			if (value < 1000000) value=+value.toFixed(base);
			var formatter=fn[Game.prefs.shortNum?1:0];
			var output=formatter(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g,',');
			return negative+output;
		}
	}
	
	var metricify=beautify(metric),
		magnitudify=beautify(magnitudes);
	
	/************************************
	BIND EVENTS
	************************************/
	Game.bindEvents=function(){
		$('#menu-main').click(Game.mainClick);
		$('#menu-options').click(Game.optionsClick);
		$('#menu-stats').click(Game.statsClick);
		$('#menu-changelog').click(Game.changelogClick);
	}
	
	Game.mainClick=function(){
		Game.onMenu='';
	}
	
	Game.optionsClick=function(){
		Game.onMenu='options';
	}
	
	Game.statsClick=function(){
		Game.onMenu='stats';
	}
	
	Game.changelogClick=function(){
		Game.onMenu='changelog';
	}
	
	Game.openJobManagement=function(){
	}
		
	/************************************
	FACTORY NAME
	************************************/
	Game.openFactoryName=function(){
		bootbox.prompt({
			title: 'Name your factory',
			value: Game.factName,
			callback: function (name) {
				if (name) {
					Game.factName=name;
					Game.refreshFactoryName();
				}
			}
		});
	}
	
	Game.refreshFactoryName=function(){
		$('#factNameDisplay').text(this.factName);
	}
	
	/************************************
	NOTIFICATIONS
	************************************/
	Game.NotifyN=0;
	Game.Notify=function(title,description,type){
		var notify=$('<div class="alert' + (type?' '+type:'') + '">' +
			'<button type="button">&times;</button>'+
			'<strong>'+title+'</strong>'+
			(description?'<p>'+description+'</p>':'')+
		'</div>');
		
		notify.delay(Game.NotifyN*100).fadeIn()
			.delay(1000).fadeOut(function(){
			$(this).remove();
			Game.NotifyN--;
		});
		$('#notify').append(notify);
		Game.NotifyN++;
	}
	
	/************************************
	LOGIC
	************************************/
	Game.logic= function () {
		Game.earn(Game.vps / Game.fps);
		Game.Level.earnExp(Game.expps / Game.fps);
		Game.Energy.refresh();
		
		if (Game.Buildings["Incandescent Lightbulb"].amount>=1)Game.unlock("Thomas Edison");
		if (Game.Buildings["Incandescent Lightbulb"].amount>=10)Game.unlock("Joseph Swan");
		if (Game.Buildings["Incandescent Lightbulb"].amount>=50)Game.unlock("Hiram Maxim");
		if (Game.Buildings["Incandescent Lightbulb"].amount>=100)Game.unlock("Patents");
		if (Game.Buildings["Incandescent Lightbulb"].amount>=250)Game.unlock("Albert Einstein Clone");
		
		if (Game.Buildings["Lightbulb Smasher"].amount>=1)Game.unlock("Experimentation Room");
		if (Game.Buildings["Lightbulb Smasher"].amount>=10)Game.unlock("Big Hammer");
		if (Game.Buildings["Lightbulb Smasher"].amount>=50)Game.unlock("Sludgehammer");
		if (Game.Buildings["Lightbulb Smasher"].amount>=100)Game.unlock("Warhammer");
		if (Game.Buildings["Lightbulb Smasher"].amount>=250)Game.unlock("Thor");
		
		if (Game.Buildings["Lightning Collector"].amount>=1)Game.unlock("Electric Panel");
		if (Game.Buildings["Lightning Collector"].amount>=10)Game.unlock("Plasma Ball");
		if (Game.Buildings["Lightning Collector"].amount>=50)Game.unlock("Hotter than Lead");
		if (Game.Buildings["Lightning Collector"].amount>=100)Game.unlock("Zeus Worshippers");
		if (Game.Buildings["Lightning Collector"].amount>=250)Game.unlock("Zeus Angerers");
		
		if (Game.Buildings["Halogen Lightbulb"].amount>=1)Game.unlock("Pressure container");
		if (Game.Buildings["Halogen Lightbulb"].amount>=10)Game.unlock("Chlorine Lightbulb");
		if (Game.Buildings["Halogen Lightbulb"].amount>=50)Game.unlock("Hydrocarbon Bromine compounds");
		if (Game.Buildings["Halogen Lightbulb"].amount>=100)Game.unlock("Krypton Gas");
		if (Game.Buildings["Halogen Lightbulb"].amount>=250)Game.unlock("Xenon Gas");
		
		if (Game.Buildings["Tan Lightbulb"].amount>=1)Game.unlock("Ultraviolet Radiator");
		if (Game.Buildings["Tan Lightbulb"].amount>=10)Game.unlock("Sunscreen lotion");
		if (Game.Buildings["Tan Lightbulb"].amount>=50)Game.unlock("Vitamin D Producer");
		if (Game.Buildings["Tan Lightbulb"].amount>=100)Game.unlock("Cancer Protection Radiator");
		if (Game.Buildings["Tan Lightbulb"].amount>=250)Game.unlock("Melanin Maker");
		
		if (Game.Buildings["LED Lightbulb"].amount>=1)Game.unlock("LED Diodes");
		if (Game.Buildings["LED Lightbulb"].amount>=10)Game.unlock("Glowstick");
		if (Game.Buildings["LED Lightbulb"].amount>=50)Game.unlock("LED Monitor");
		if (Game.Buildings["LED Lightbulb"].amount>=100)Game.unlock("Superdisplay");
		if (Game.Buildings["LED Lightbulb"].amount>=250)Game.unlock("Lifi");
		
		if (Game.Buildings["Bacterial Lightbulb"].amount>=1)Game.unlock("Fungus");
		if (Game.Buildings["Bacterial Lightbulb"].amount>=10)Game.unlock("Salmonella");
		if (Game.Buildings["Bacterial Lightbulb"].amount>=50)Game.unlock("Cellular division");
		if (Game.Buildings["Bacterial Lightbulb"].amount>=100)Game.unlock("Cyanidebacteria");
		if (Game.Buildings["Bacterial Lightbulb"].amount>=250)Game.unlock("Happinessbacteria");
		
		if (Game.Buildings["Dinosaur Lightbulb"].amount>=1)Game.unlock("Jurrasic Quarks");
		if (Game.Buildings["Dinosaur Lightbulb"].amount>=10)Game.unlock("Photinosaurus");
		if (Game.Buildings["Dinosaur Lightbulb"].amount>=50)Game.unlock("Photonsaurus");
		if (Game.Buildings["Dinosaur Lightbulb"].amount>=100)Game.unlock("Mega Dinobulbs");
		if (Game.Buildings["Dinosaur Lightbulb"].amount>=250)Game.unlock("Unextinction Event");
		
		if (Game.Buildings["Human Lightbulb"].amount>=1)Game.unlock("Evolution");
		if (Game.Buildings["Human Lightbulb"].amount>=10)Game.unlock("Worship");
		if (Game.Buildings["Human Lightbulb"].amount>=50)Game.unlock("Stone Tools");
		if (Game.Buildings["Human Lightbulb"].amount>=100)Game.unlock("Iron Tools");
		if (Game.Buildings["Human Lightbulb"].amount>=250)Game.unlock("Hi Tech");
		
		if (Game.Level.level>1)Game.unlock("Cranking Power");
		if (Game.Level.level>=15)Game.unlock("Bicycle");
		if (Game.Level.level>=25)Game.unlock("Lump of Charcoal");
		if (Game.Level.level>=35)Game.unlock("Biomass");
		if (Game.Level.level>=45)Game.unlock("Generic Brand Power Generator");
		if (Game.Level.level>=55)Game.unlock("Wind Turbines");
		if (Game.Level.level>=75)Game.unlock("Wave Power");
		if (Game.Level.level>=80)Game.unlock("Solar Power");
		
		if (Game.Level.level>=5)Game.unlock("Open the Gate of Experience");
		if (Game.Level.level>=15)Game.unlock("Experience Scrolls");
		if (Game.Level.level>=25)Game.unlock("Quantum Leaper");
		if (Game.Level.level>=35)Game.unlock("Experience Vortex");
		if (Game.Level.level>=45)Game.unlock("Level Conversion Unit");
		if (Game.Level.level>=55)Game.unlock("E=mc2 Converter");
		if (Game.Level.level>=75)Game.unlock("Energy State Manipulator");
		if (Game.Level.level>=100)Game.unlock("Energy State Manipulator");
		
		if (Game.clicked>=10)Game.unlock("Let there be light");
		if (Game.clicked>=100)Game.unlock("Taoism");
		if (Game.clicked>=250)Game.unlock("Radiator");
		if (Game.clicked>=500)Game.unlock("Shining Finger");
		if (Game.clicked>=1000)Game.unlock("Voltswaggen");
		if (Game.clicked>=2000)Game.unlock("Photino Collectors");
		if (Game.clicked>=5000)Game.unlock("Photon Collectors");
		if (Game.clicked>=20000)Game.unlock("Cosmic Microwave Collector");
		if (Game.clicked>=500000)Game.unlock("Planck Length Observer");
		if (Game.clicked>=1500000)Game.unlock("Supertasking Clicks");
		if (Game.clicked>=2500000)Game.unlock("Lightspeed Manipulator");
		
		if(Game.T%(Game.fps*2) ==0){
			document.title=metricify(this.volts)
				+ ' | Lightbulb Inc';
		}
		
		if (Game.prefs.autoSave && Game.T%(Game.prefs.autoSave*Game.fps)===0 && Game.T>Game.fps*10) Game.save();
		
		Game.lastDate =Date.now();
		Game.T++;
	};
	
	/************************************
	LOOP
	************************************/
	Game.loop=function () {
		Game.logic();
		Game.refresh();
		
		setTimeout(Game.loop, 1000/Game.fps);
	};
	
	/************************************
	DRAW
	************************************/
	Game.draw=function() {
		for (var i in Game.Buildings){
			Game.Buildings[i].draw();
		}
		
		Game.drawUpgrades();
		Game.Tooltip.hide();
		$('#job').hide();
		
		Game.bindEvents();
	};
	
	/************************************
	REFRESH
	************************************/
	Game.refresh=function(){
		Game.refreshMenu();
		Game.Tooltip.refresh();
		
		for(var i in Game.Buildings){
			Game.Buildings[i].refresh();
		}
		for(var i in Game.Upgrades){
			Game.Upgrades[i].refresh();
		}
		
		if (!Game.displayJobs && Game.WorkersN){
			$('#job').show();
			Game.displayJobs=true;
		}
		
		Game.drawT++;
	}

	/************************************
	BUTTONS
	************************************/
	Game.PreferenceButton=function(name,prefName){
		return '<p><label>'+name+':</label><input type="checkbox" id="input-'+prefName+'" '+(Game.prefs[prefName]?'checked':'')+' onclick="Game.toggle(\''+(prefName)+'\')"/></p>'
	}
	
	Game.Button=function(name,click){
		return '<button onclick="'+escapeHTML(click)+'">'+name+'</button>';
	}
	
	/************************************
	REFRESH COLUMN
	************************************/
	Game.refreshMenu=function(){
		var menu=Game.onMenu;
		var page=$('#page');
		
		var lvl=Game.Level;
		if(menu==='main'){
			$('#count').text(metricify(Math.floor(Game.volts)));
			$('#vps').text(metricify(Game.vps,2)+'/second');
			$('#level').text(lvl.level);
			$('#exp').text(magnitudify(lvl.level));
			$('#toNextLevel').text(magnitudify(lvl.toNextLevel + Game.Level.levelTotalExp - Math.floor(lvl.exp)));
			$('#levelContainer .progress-bar').css('width',((lvl.exp - lvl.levelTotalExp) / lvl.toNextLevel * 100)+'%');
		}
		else if(!menu){
			page.html(
				'<p>'+Game.factName+'</p>'+
				'<h1 id="count">'+metricify(Math.floor(Game.volts))+'</h1>'+
				'<p id="vps">'+metricify(Game.vps,2)+'/second</p>'+
				'<div id="bulbContainer">'+
					'<div id="bulb"></div>'+
				'</div>'+
				'<div id="levelContainer">'+
					'<p>'+
						'Level <span id="level">'+lvl.level+'</span> (<span id="exp">'+magnitudify(lvl.exp)+'</span> exp)<br>'+
						'<span id="toNextLevel">' + magnitudify(lvl.toNextLevel + lvl.levelTotalExp - Math.floor(lvl.exp)) + '</span> exp until next level'+
					'</p>'+
					'<div class="progress">'+
						'<div class="progress-bar" style="width:'+((lvl.exp - lvl.levelTotalExp) / lvl.toNextLevel * 100)+'%"></div>'+
					'</div>'+
				'</div>'
			)
			$('#bulb').click(Game.click);
			Game.onMenu = 'main';
		}
		else{
			if(Game.drawT%5!==0)return;
			var html='<strong class="fond">'+metricify(Math.floor(Game.volts))+'</strong>'+
				' ('+metricify(Game.vps,2)+'/second)<br>'+
				'Level <span>'+lvl.level+'</span> (<span>'+magnitudify(lvl.exp)+'</span> exp)<br>'+
				'<span>' + magnitudify(lvl.toNextLevel + lvl.levelTotalExp - Math.floor(lvl.exp)) + '</span> exp until next level';
			if(menu==='options'&&!Game.mouseDown){
				html+='<div class="stats">'+
					Game.Button('Save Game', 'Game.save()')+
					Game.Button('Reset Game', 'Game.Prompt(\'Are you sure you want to reset?<br><span class="warning"><b>Warning:</b> resetting will not gain bonuses.</span>\',[["Yes", "Game.reset();Game.ClosePrompt()"],"No"])')+
					Game.Button('Import Game', 'Game.Prompt(\'<textarea rows="5"></textarea>\',[["Import", "Game.import($(\'textarea\').val());Game.ClosePrompt()"],"Cancel"])')+
					Game.Button('Export Game', 'Game.Prompt(\'<textarea rows="5">\'+localStorage.getItem(Game.saveFile)+\'</textarea>\',["OK"])')+
					'<p><label>Autosave frequency:</label><input type="number" min="0" value='+Game.prefs.autoSave+' onchange="Game.prefs.autoSave=$(this).val()"/>'+
					Game.PreferenceButton('Defocus', 'focus')+
					Game.PreferenceButton('Short Numbers', 'shortNum')+
				'</div>';
				page.html(html);
			} else if(menu==='stats'){
				var stats = $('<div class="stats"></div>');
				
				stats.append('<h1>Upgrades</h1>');
				stats.append('<p>'+Game.UpgradesOwned+'/'+Game.UpgradesN+' bought ('+magnitudify((Game.UpgradesOwned/Game.UpgradesN)*100,2)+'%)</p>');
				var sort=function(a,b){
					return a.order>b.order;
				}
				var upgrades=Game.UpgradesById.sort(sort);
				for (var i in upgrades) {
					var upgrade=upgrades[i];
					if(upgrade.earned){
						var el=$('<div class="upgradeObj"></div>');
						var name=upgrade.name, cost=upgrade.cost,description=upgrade.description;
						Game.Tooltip.bindTo(el,0,function(){
							console.log(name);
							return '<h2>'+name+'</h2>'+
									'<p>Costs <strong class="cost">' + metricify(cost) + '</strong></p>' +
									'<p>' + description + '</p>';
						});
						stats.append(el);
					}
				}
				
				page.html(html);
				page.append(stats);
			} else if(menu==='changelog'){
				$.ajax('../changelog.html').done(function(data){
					page.html('<div class="stats">'+data+'</div>');
				}).fail(function(){
					page.html('If you see this, you are offline.<br><q>sup</q>');
				});
			}
		}
		
		$('#menu div').each(function(btn){
			if($(this).attr('id').substr(5)===menu) $(this).addClass('active');
			else $(this).removeClass('active');
		});
	}
	
	Game.openMenu=function(menu){
		Game.onMenu=menu;
	}
	
	/************************************
	VOLTS MANIPULATOR
	************************************/
	Game.earn=function(n){
		Game.volts+=n;
		Game.voltsTot+=n;
		Game.voltsTotAll+=n;
		return n;
	};
	
	Game.spend=function(n){
		if (n>Game.volts) return 0;
		Game.volts-=n;
		return n;
	};
	
	/************************************
	SAVE
	************************************/
	Game.load=function (save) {
		if (!save) {
			if (localStorage.hasOwnProperty(Game.saveFile)) {
				save=localStorage.getItem(Game.saveFile);
			} else {
				return false;
			}
		}
		
		var decoded=save.split('!'),
			version=parseFloat(decoded[0]);
		
		if (!decoded.length) {
			Game.Notify('Save error', 'Your save file is invalid.');
		} else if (isNaN(version)) {
			Game.Notify('Save error', 'Your save file version is invalid.');
		} else if (version>Game.version) {
			Game.Notify('Save error', 'Your save file is from a future version.');
		} else {
			if (version>=2) {
				Game.volts=parseInt(decoded[1]);
				Game.voltsTot=parseInt(decoded[2]);
				Game.voltsTotAll=parseInt(decoded[3]);
				
				Game.sessionStart=parseInt(decoded[4]);
				Game.gameStart=parseInt(decoded[5]);
				Game.clicked=parseInt(decoded[6]);
				
				Game.factName=decoded[7];
				Game.refreshFactoryName();
				
				var buildings=decoded[8].split(','), n=0;
				for (i in Game.Buildings) {
					Game.Buildings[i].amount=parseInt(buildings[n++])||0;
				}
				
				var upgrades=decoded[9].split(','), i;
				if (version>2.016){
					for (i=0; i < upgrades.length; i++) {
						if (Game.UpgradesById[i]) {
							Game.UpgradesById[i].earned=upgrades[i]==='1';
						}
					}
				}
				
				Game.Level.exp=parseFloat(decoded[10]);
				Game.Level.level=parseFloat(decoded[11]);
				Game.Level.toNextLevel=parseFloat(decoded[12]);
				Game.Level.levelTotalExp=parseFloat(decoded[13]);
				
				Game.prefs.autoSave=parseInt(decoded[14]);
				Game.prefs.focus=parseInt(decoded[15]);
				Game.prefs.shortNum=parseInt(decoded[16]);
		
				Game.Notify('Game loaded');
			} else {
				Game.Notify('Save error', "Sorry, we don't support this version anymore.");
			}
		}
	};
	
	Game.save=function(){
		var saveData=[];
		saveData.push(Game.version);
		saveData.push(Game.volts);
		saveData.push(Game.voltsTot);
		saveData.push(Game.voltsTotAll);
		
		saveData.push(Game.sessionStart);
		saveData.push(Game.gameStart);
		
		saveData.push(Game.clicked);
		saveData.push(Game.factName);
		
		// levels
		var buildingsAmount=[];
		for(var i in Game.Buildings) {
			var building=Game.Buildings[i];
			buildingsAmount.push(building.amount);
		}
		saveData.push(buildingsAmount.join(','));
		
		// upgrades
		var upgradesAmount=[];
		for(var i in Game.Upgrades) {
			upgradesAmount.push(Game.Upgrades[i].earned?'1':'0');
		}
		saveData.push(upgradesAmount.join(','));
		
		// levels
		saveData.push(Game.Level.exp);
		saveData.push(Game.Level.level);
		saveData.push(Game.Level.toNextLevel);
		saveData.push(Game.Level.levelTotalExp);
		
		// preferences
		saveData.push(Game.prefs.autoSave);
		saveData.push(Game.prefs.focus);
		saveData.push(Game.prefs.shortNum);
		
		var saveStr=saveData.join('!');
		
		localStorage.setItem(Game.saveFile, saveStr);
		Game.Notify('Game saved');
		return saveStr;
	}
	
	Game.reset=function(){
		for(var i in Game.Buildings){
			var building=Game.Buildings[i];
			building.amount=0;
			building.cost=building.baseCost;
			building.displayed=false;
		}
		
		for (var i in Game.Upgrades){
			var upgrade=Game.Upgrades[i];
			upgrade.earned=false;
			upgrade.displayed=false;
			upgrade.displayable=false;
		}
		
		Game.Level.exp=0;
		Game.Level.level=1;
		Game.Level.toNextLevel=100;
		Game.Level.levelTotalExp=0;
		
		Game.volts=0;
		Game.voltsTot=0;
		Game.voltsTotAll=0;
		
		Game.vps=0;
		Game.m_vps=0;
		Game.expps=0;
		
		// stats
		Game.clicked=0;
		Game.factName='Your Factory';
		
		// dates
		Game.sessionStart=Date.now();
		Game.gameStart=Date.now();
		Game.lastDate =Date.now();
		
		// options
		Game.prefs={
			autoSave:60,
			focus:1,
			shortNum:0
		};
		
		Game.refresh();
		Game.refreshFactoryName();
		Game.recalc();
	}
	
	/************************************
	CALCULATOR
	************************************/
	Game.calcVPS=function(){
		var vps=0;
		for (var i in Game.Buildings) {
			vps += Game.Buildings[i].calcVPS();
		}
		
		var level=0;
		if (Game.has('Open the Gate of Experience')) level=0.05;
		if (Game.has('Experience Scrolls')) level=0.1;
		if (Game.has('Quantum Leaper')) level=0.15;
		if (Game.has('Experience Vortex')) level=0.2;
		if (Game.has('Level Conversion Unit')) level=0.25;
		if (Game.has('E=mc2 Converter')) level=0.5;
		if (Game.has('Energy State Manipulator')) level=0.75;
		if (Game.has('Energy State Manipulator')) level=1;
		vps *= 1+(level*Game.Level.level*0.1);
		
		if(Game.productionBonus) vps*=Game.productionBonus;
		
		return Game.vps=vps;
	};
	
	Game.calcExpps=function(){
		var expps=0;
		for (var i in Game.Buildings) {
			expps += Game.Buildings[i].calcVPS();
		}
		expps *= 0.1;
		
		if(Game.has("Cranking Power")) expps*=1.01;
		if(Game.has("Bicycle")) expps*=1.05;
		if(Game.has("Lump of Charcoal")) expps*=1.1;
		if(Game.has("Biomass")) expps*=1.2;
		if(Game.has("Generic Brand Power Generator")) expps*=1.5;
		if(Game.has("Wind Turbines")) expps*=1.6;
		if(Game.has("Wave Power")) expps*=1.7;
		if(Game.has("Solar Power")) expps*=1.9;
		
		if(Game.expBonus) vps*=Game.expBonus;
		
		return Game.expps=expps;
	};
	
	Game.calcMouseVPS=function(){
		var vps=1;
		if(Game.has("Let there be light"))vps+=1;
		if(Game.has("Taoism"))vps*=2;
		if(Game.has("Radiator"))vps*=2;
		if(Game.has("Shining Finger"))vps*=2;
		if(Game.has("Voltswaggen"))vps*=2;
		if(Game.has("Photino Collectors"))vps*=2;
		
		if(Game.has("Photon Collectors"))vps+=Game.BuildingsOwned*0.1;
		if(Game.has("Cosmic Microwave Collector"))vps+=Game.BuildingsOwned*0.5;
		if(Game.has("Planck Length Observer"))vps+=Game.BuildingsOwned*10;
		if(Game.has("Supertasking Clicks"))vps+=Game.BuildingsOwned*100;
		if(Game.has("Lightspeed Manipulator"))vps+=Game.BuildingsOwned*150;
		
		if(Game.clickBonus)vps*=Game.clickBonus;
		
		return Game.m_vps=vps;
	}
	
	Game.recalc=function () {
		for (var i in Game.Buildings) {
			Game.Buildings[i].updateCost();
		}
		Game.calculateBuildingsOwned();
		Game.calculateUpgradesOwned();
		
		Game.calcVPS();
		Game.calcExpps();
		Game.calcMouseVPS();
		Game.Level.calculateNextLevel();
	};
	
	/************************************
	CLICKS
	************************************/
	Game.click=function(){
		var m_vps=Game.m_vps || Game.calcMouseVPS();
		
		Game.earn(m_vps);
		Game.Level.earnExp(m_vps);
		Game.clicked++;
		
		Game.Particle('+'+metricify(m_vps), Game.cursorX, Game.cursorY - 25);
		
		return m_vps;
	}
	
	/************************************
	CLICK PARTICLES
	************************************/
	Game.Particle=function(text, x, y){
		$('#particles').append($('<div class="particle"></div>')
			.text(text)
			.css({'left': x, 'top': y})
			.animate({ 'top': '-=20px', 'opacity': 0 }, 2000, function () {
				$(this).remove();
			}))
	}
	
	/************************************
	TOOLTIPS
	************************************/
	Game.Tooltip={x:0,y:0,showed:0,text:'',type:0,el:$('#tooltip'),box:null};
	Game.Tooltip.show=function(){
		this.el.show();
		this.showed=1;
	}
	Game.Tooltip.hide=function(){
		this.el.hide();
		this.showed=0;
	}
	Game.Tooltip.refresh=function(){
		var type=this.type,el=this.box;
		
		var top,left;
		if(type===1){
			var top=Game.cursorY;
			var left=el.width()+el.offset().left+5;
		}else if(type===2){
			var top=el.height()+el.offset().top+5;
			var left=el.offset().left;
		}else{
			var top=Game.cursorY;
			var left=Game.cursorX+10;
		}
		left=Math.min(left,Game.windowW-380)
		
		this.el.css({'top':top+'px','left':left+'px'});
		if(typeof this.text === 'function') this.el.html(this.text());
		else this.el.html(this.text);
	}
	Game.Tooltip.bindTo=function(el,type,text){
		var tooltip=Game.Tooltip;
		el.mouseover(function(){
			tooltip.type = type;
			tooltip.box=el;
			tooltip.text=text;
			tooltip.show();
		}).mouseout(function(){
			tooltip.hide();
		});
	}
	
	/************************************
	PROMPTS
	************************************/
	Game.promptOverlay=$('#overlay');
	Game.promptClose=$('#closePrompt');
	Game.promptEl=$('#prompt');
	Game.promptContent=$('#promptContent');
	Game.promptButtons=$('#promptButtons');
	Game.Prompt=function(content,buttons,updateFunc){
		Game.promptOverlay.show();
		Game.promptEl.css({'top':Game.windowH/2,'left':(Game.windowW/2-300)})
		.show();
		Game.promptContent.html(content);
		var button='';
		for (var i in buttons){
			if(typeof buttons[i]==='string') button+='<button onclick="Game.ClosePrompt()">'+buttons[i]+'</button>';
			else button+='<button onclick="'+escapeHTML(buttons[i][1])+'">'+buttons[i][0]+'</button>';
		}
		Game.promptButtons.html(button);
	}
	
	Game.promptOverlay.click(function(){Game.ClosePrompt()});
	
	Game.ClosePrompt=function(){
		Game.promptEl.hide();
		Game.promptOverlay.hide();
	}
	
	/************************************
	BUILDINGS
	************************************/
	Game.Buildings={};
	Game.BuildingsById=[];
	Game.BuildingsN=0;
	Game.BuildingsOwned=0;
	Game.Building=function Building(name, commonName, baseCost, description, displayAt, vpsFunction) {
		var commonName=commonName.split('|'),
			single=commonName[0] || name,
			plural=(commonName[1] ? commonName[1] : (single + 's')),
			actionName=(commonName[2] || 'producing');
		
		this.id=Game.BuildingsN++;
		this.name=name;
		this.single=single;
		this.plural=plural;
		this.actionName=actionName;

		this.baseCost=this.cost=baseCost;
		this.description=description;
		this.displayAt=displayAt;
		this.amount=0;
		
		this.oneVps=0;
		this.vps=0;
		
		// buy sell
		this.buy=function(n) {
			for (var i=0; i < n; i++) {
				if (Game.volts < this.cost) {
					break;
				}
				
				Game.spend(this.cost);
				this.amount++;
				Game.BuildingsOwned++;
				this.updateCost();
			}
			
			Game.calcVPS();
			Game.calcExpps();
		};
		this.buyMax=function(){
			while(Game.volts>this.cost){
				Game.spend(this.cost);
				this.amount++;
				Game.BuildingsOwned++;
				this.updateCost();
			}
			
			this.updateCost();
			Game.calcVPS();
			Game.calcExpps();
		}
		
		this.sell=function (n) {
			var totalCost=0;
			
			for (var i=1; i < n; i++) {
				if (this.amount <= 0) {
					break;
				}
				
				this.amount--;
				Game.BuildingsOwned--;
				this.updateCost();
				totalCost += this.cost * 0.25;
			}
			
			Game.earn(totalCost);
			Game.calcVPS();
			Game.calcExpps();
		};
		this.sellMax=function(){
			var totalCost=0;
			
			while(this.amount>0){
				this.amount--;
				Game.BuildingsOwned--;
				this.updateCost();
				totalCost += this.cost * 0.25;
			}
			
			Game.earn(this.cost);
			Game.calcVPS();
			Game.calcExpps();
		}
		
		// cost
		this.getCost=function (n) {
			return Math.floor(this.baseCost * Math.pow(1.15, n));
		};
		
		this.getCurrentCost=function() {
			return this.getCost(this.amount);
		};
		
		this.updateCost= function () {
			return this.cost=this.getCurrentCost();
		};
		
		// vps
		this.calcVPS=function(){
			this.oneVps=vpsFunction();
			this.vps=this.oneVps * this.amount;
			return this.vps;
		};
		
		// draw
		this.el=null;
		this.draw=function(){
			if (this.el) return;
			var self=this;
			this.el=$('<div class="buildingHolder"></div>')
			.attr('id',this.id)
			.html(
				'<div class="buildingObj btn btn-primary">' +
					'<div class="buildingAmount">' + this.amount + '</div>' +
					'<div class="buildingName">' + name + '</div>' +
					'<div class="buildingCost">' + metricify(this.cost) + '</div>' +
				'</div>' +
				'<div class="buySell">' +
					'<a class="buy10">Buy 10</a>' +
					'<a class="buyMax">Buy Max</a>' +
					'<a class="sell1">Sell 1</a>' +
					'<a class="sell10">Sell 10</a>' +
					'<a class="sellMax">Sell Max</a>' +
				'</div>'
			);
			Game.Tooltip.bindTo(this.el,1, function(){
				return '<h2>'+name+'</h2>'+
						'<span>'+description+'</span><br>' +
						'Costs <strong>'+metricify(self.cost)+'</strong><br>' +
						'<ul>' +
							'<li>Each '+single+' produces <strong>'+metricify(self.oneVps, 2)+'/second</strong></li>' +
							'<li>' +
							'<strong>'+self.amount+'</strong> '+plural+' '+actionName+' <strong>'+metricify(self.vps, 2)+'/second</strong>' +
							' (<strong>' + magnitudify((self.amount>0?(self.vps/Game.vps):0)*100, 2) + '%</strong> of total)' +
								'</li>' +
						'</ul>';
			});
			this.bindEvents();
			$('#lightbulbListContainer').append(this.el);
		}
		this.bindEvents=function(){
			var self=this;
			this.el.children('.buildingObj').click(function() {self.buy(1)});
			this.el.find('.buy10').click(function() {self.buy(10)});
			this.el.find('.buyMax').click(function() {self.buyMax()});
			this.el.find('.sell1').click(function() {self.sell(1)});
			this.el.find('.sell10').click(function() {self.sell(10)});
			this.el.find('.sellMax').click(function() {
				Game.Prompt('Are you really sure you want to sell all of your '+self.amount+' '+(self.amount===1?self.single:self.plural)+'?',[['Yes','Game.BuildingsById[$(this).parent().attr("id")].sellMax()'], 'No']);
			});
		}
		this.refresh=function() {
			this.el.find('.buildingCost').text(metricify(this.cost));
			this.el.find('.buildingAmount').text(magnitudify(this.amount));
			if (this.cost>Game.volts) {
				this.el.children('.buildingObj').addClass('disabled');
			} else {
				this.el.children('.buildingObj').removeClass('disabled');
			}
			if (!this.displayed) this.el.hide();
			if((Game.volts>=this.displayAt||this.amount) && !this.displayed){
				this.displayed=true;
				this.el.fadeIn(400).show();
			}
		}
		
		Game.Buildings[name]=this;
		Game.BuildingsById.push(this);
		return this;
	};
	
	Game.calculateBuildingsOwned=function(){
		for(var i in Game.Buildings){
			Game.BuildingsOwned += Game.Buildings[i].amount;
		}
	}
	
	/************************************
	BUILDINGS DATA
	************************************/
	new Game.Building("Incandescent Lightbulb", "incandescent lightbulb|incandescent lightbulbs|shining", 15, "The greatest invasion in history has now begun.", -1, function () {
		var add=0, mult=1;
		if (Game.has("Thomas Edison")) add += 0.1;
		if (Game.has("Joseph Swan")) mult *= 2;
		if (Game.has("Hiram Maxim")) mult *= 2;
		if (Game.has("Patents")) mult *= 2;
		if (Game.has("Albert Einstein Clone")) mult *= 2;
		return (0.1 + add) * mult;
	});
	new Game.Building("Lightbulb Smasher", "lightbulb smasher|lightbulb smashers|smashing", 50, "Hires some muscular guys to smash bulbs.", 25, function () {
		var add=0, mult=1;
		if(Game.has("Experimentation Room")) add+=0.5
		if(Game.has("Big Hammer")) mult*=2
		if(Game.has("Sludgehammer")) mult*=2
		if(Game.has("Warhammer")) mult*=2
		if(Game.has("Thor")) mult*=2
		return (0.5 + add) * mult;
	});
	new Game.Building("Lightning Collector", "lightning collector|lightning collectors|collecting", 150, "Collects lightning whenever they strike.", 100, function () {
		var add=0, mult=1;
		if(Game.has("Electric Panel")) add+=2
		if(Game.has("Plasma Ball")) mult*=2
		if(Game.has("Hotter than Lead")) mult*=2
		if(Game.has("Zeus Worshippers")) mult*=2
		if(Game.has("Zeus Angerers")) mult*=2
		return (2.5 + add) * mult;
	});
	new Game.Building("Halogen Lightbulb", "halogen lightbulb|halogen lightbulbs|shining", 500, "AHH! IT's TOO BRIGHT!", 250, function () {
		var add=0, mult=1;
		if(Game.has("Pressure container")) add+=5
		if(Game.has("Chlorine Lightbulb")) mult*=2
		if(Game.has("Hydrocarbon Bromine compounds")) mult*=2
		if(Game.has("Krypton Gas")) mult*=2
		if(Game.has("Xenon Gas")) mult*=2
		return (5 + add) * mult;
	});
	new Game.Building("Tan Lightbulb", "tan lightbulb|tan lightbulbs|shining", 1000, "ahh, much better...", 500, function () {
		var add=0, mult=1;
		if(Game.has("Ultraviolet Radiator")) add+=30
		if(Game.has("Sunscreen lotion")) mult*=2
		if(Game.has("Vitamin D Producer")) mult*=2
		if(Game.has("Cancer Protection Radiator")) mult*=2
		if(Game.has("Melanin Maker")) mult*=2
		return (50 + add) * mult;
	});
	new Game.Building("LED Lightbulb", "LED lightbulb|LED lightbulbs|shining", 10000, "LEDs you to your destiny.", 5000, function () {
		var add=0, mult=1;
		if(Game.has("LED Diodes")) add+=100
		if(Game.has("Glowstick")) mult*=2
		if(Game.has("LED Monitor")) mult*=2
		if(Game.has("Superdisplay")) mult*=2
		if(Game.has("Lifi")) mult*=2
		return (100 + add) * mult;
	});
	new Game.Building("Bacterial Lightbulb", "bacterial lightbulb||producing", 500000, "Small, tiny life forms that will soon take over the WORLD!", 19930, function () {
		var add=0, mult=1;
		if(Game.has("Fungus")) add+=400
		if(Game.has("Salmonella")) mult*=2
		if(Game.has("Cellular division")) mult*=2
		if(Game.has("Cyanidebacteria")) mult*=2
		if(Game.has("Happinessbacteria")) mult*=2
		return (500 + add) * mult;
	});
	new Game.Building("Dinosaur Lightbulb", "dinosaur lightbulb|dinosaur lightbulbs|pooping out", 2718281, "inb4 asteroids", 25000, function () {
		var add=0, mult=1;
		if(Game.has("Jurrasic Quarks")) add+=800
		if(Game.has("Photinosaurus")) mult*=2
		if(Game.has("Photonsaurus")) mult*=2
		if(Game.has("Mega Dinobulbs")) mult*=2
		if(Game.has("Unextinction Event")) mult*=2
		return (5000 + add) * mult;
	});
	new Game.Building("Human Lightbulb", "human lightbulb|human lightbulbs|creating", 500000000, "A civilization for 200,000 years", 5000000, function () {
		var add=0, mult=1;
		if(Game.has("Evolution")) add+=1500
		if(Game.has("Worship")) mult*=2
		if(Game.has("Stone Tools")) mult*=2
		if(Game.has("Iron Tools")) mult*=2
		if(Game.has("Hi Tech")) mult*=2
		return (99999 + add) * mult;
	});
	
	/************************************
	UPGRADES
	************************************/
	Game.Upgrades={};
	Game.UpgradesById=[];
	Game.UpgradesN=0;
	Game.UpgradesOwned=0;
	Game.Upgrade=function (name, cost, description) {
		this.id=Game.UpgradesN++;
		this.name=name;
		this.description=description;
		this.cost=cost;
		this.earned=false;
		
		this.displayed=false;
		this.displayable=false;
		
		this.order=this.id;
		if(order) this.order=order+this.id*0.001;
		
		this.buy=function(){
			if (this.cost>Game.volts) return false;
			Game.spend(this.cost);
			this.earned=true;
			Game.recalc();
		}
		
		// draw
		this.el=null;
		this.draw=function(){
			if(this.el)return;
			var self=this;
			this.el=$('<div class="upgradeObj"></div>')
			.html(this.id)
			//.css('background-image', 'url("images/upgrades/' + this.id + '.png")')
			
			Game.Tooltip.bindTo(this.el,2, function(){
				return '<h2>'+name+'</h2>'+
						'<p>Costs <strong class="cost">' + metricify(cost) + '</strong></p>' +
						'<p>' + description + '</p>';
			});
			
			if (!this.displayed)this.el.hide();
			this.el.click(function(){self.buy()});
			return this.el;
		}
		this.refresh=function(){
			if (this.earned) {
				this.el.hide();
				//Game.Tooltip.hide();
				return;
			}
			
			if (this.cost>Game.volts) {
				this.el.addClass('disabled');
			} else {
				this.el.removeClass('disabled');
			}
			
			if (!this.displayed) this.el.hide();
			if (this.displayable && !this.displayed){
				this.displayed=true;
				this.el.fadeIn(400).show();
			}
		}
		
		Game.Upgrades[name]=this;
		Game.UpgradesById.push(this);
		return this;
	};
	
	Game.drawUpgrades=function(){
		var fn=function(a,b){
			return a.cost>b.cost;
		};
		var sorted=Game.UpgradesById.sort(fn);
		for (var i in sorted){
			$('#upgradeListContainer').append(sorted[i].draw());
		}
	};
	
	Game.has=function (name) {
		return Game.Upgrades[name] && Game.Upgrades[name].earned;
	};
	
	Game.unlock=function(name){
		return Game.Upgrades[name].displayable=true;
	};
	
	Game.lock=function(name){
		return Game.Upgrades[name].displayable=false;
	};
	
	Game.calculateUpgradesOwned=function(){
		Game.UpgradesOwned=0;
		for(var i in Game.Upgrades){
			if (Game.Upgrades[i].earned) Game.UpgradesOwned++;
		}
	}
	
	/************************************
	UPGRADES DATA
	(don't add upgrades in the middle of these to preserve savefile)
	************************************/
	var order;
	
	// incandescent
	order=100;
	new Game.Upgrade("Thomas Edison",100,"Incandescent lightbulb gain <strong>+0.1</strong> base VPS.<br><q>1% percent inspiration, 99% perspriation.</q>");
	new Game.Upgrade("Joseph Swan",1000,"Incandescent lightbulb are <strong>twice</strong> as efficient.<q>Nice guy, long beard.</q>");
	new Game.Upgrade("Hiram Maxim",100000,"Incandescent lightbulb are <strong>twice</strong> as efficient.<br><q>Sounds like a Harry Potter spell.</q>");
	new Game.Upgrade("Patents",5000000,"Incandescent lightbulb are <strong>twice</strong> as efficient.<br><q>PATENT ALL THE THINGS!</q>");
	new Game.Upgrade("Albert Einstein Clone",50000000,"Incandescent lightbulb are <strong>twice</strong> as efficient.<br><q>Hire a clone and he'll probably help you out!</q>");
	
	// smashers
	order=200;
	new Game.Upgrade("Experimentation Room",1000,"Bulb smashers gain <strong>+0.5</strong> base VPS.<q>Put on your goggles, prepare your muscles.</q>");
	new Game.Upgrade("Big Hammer",50000,"Bulb smashers are <strong>twice</strong> as efficient.<q>Probably not a sexual innuendo.</q>");
	new Game.Upgrade("Sludgehammer",550000,"Bulb smashers are <strong>twice</strong> as efficient.<q>Stickiest weapon on Earth.</q>");
	new Game.Upgrade("Warhammer",12500000,"Bulb smashers are <strong>twice</strong> as efficient.<q>Is this Sparta?</q>");
	new Game.Upgrade("Thor",725000000,"Bulb smashers are <strong>twice</strong> as efficient.<q>The Key to Valhalla.</q>");
	
	// lightning
	order=300;
	new Game.Upgrade("Electric Panel",5000,"Thunder Collectors gain <strong>+2</strong> base VPS.<q>Ahh, much more better!</q>");
	new Game.Upgrade("Plasma Ball",50000,"Thunder Collectors are <strong>twice</strong> as efficient.<br><q>The ultimate Electric Party!</q>");
	new Game.Upgrade("Hotter than Lead",100000,"Thunder Collectors are <strong>twice</strong> as efficient.<br><q>But not hotter than Venus.</q>");
	new Game.Upgrade("Zeus Worshippers",5500000,"Thunder Collectors are <strong>twice</strong> as efficient.<br><q>Actually raised by a goat.</q>");
	new Game.Upgrade("Zeus Angerers",10000000,"Thunder Collectors are <strong>twice</strong> as efficient.<br><q>Let's just worship Uranus.</q>");
	
	// halogen
	order=400;
	new Game.Upgrade("Pressure container",5000,"Halogen Lightbulbs gain <strong>+2</strong> base VPS.<q>Ahh, much more better!</q>");
	new Game.Upgrade("Chlorine Lightbulb",10000,"Halogen Lightbulbs are <strong>twice</strong> as efficient.<q>Ahh, much more better!</q>");
	new Game.Upgrade("Hydrocarbon Bromine compounds",255000,"Halogen Lightbulbs are <strong>twice</strong> as efficient.<q>Ahh, much more better!</q>");
	new Game.Upgrade("Krypton Gas",5000000,"Halogen Lightbulbs are <strong>twice</strong> as efficient.<q>Ahh, much more better!</q>");
	new Game.Upgrade("Xenon Gas",50000000,"Halogen Lightbulbs are <strong>twice</strong> as efficient.<q>Ahh, much more better!</q>");
	
	// tan
	order=500;
	new Game.Upgrade("Ultraviolet Radiator",31415,"Tan Lightbulbs gain <strong>+30</strong> base VPS.<q>Ahh, much more better!</q>");
	new Game.Upgrade("Sunscreen lotion",173205,"Tan Lightbulbs are <strong>twice</strong> as efficient.<q>Ahh, much more better!</q>");
	new Game.Upgrade("Vitamin D Producer",1414213,"Tan Lightbulbs are <strong>twice</strong> as efficient.<q>Ahh, much more better!</q>");
	new Game.Upgrade("Cancer Protection Radiator",22360679,"Tan Lightbulbs are <strong>twice</strong> as efficient.<q>Ahh, much more better!</q>");
	new Game.Upgrade("Melanin Maker",360555127,"Tan Lightbulbs are <strong>twice</strong> as efficient.<q>Ahh, much more better!</q>");
	
	// led
	order=600;
	new Game.Upgrade("LED Diodes",50000,"LED Lightbulbs gain <strong>+100</strong> base VPS.<q>Ahh, much more better!</q>");
	new Game.Upgrade("Glowstick",200000,"LED Lightbulbs are <strong>twice</strong> as efficient.<q>Ahh, much more better!</q>");
	new Game.Upgrade("LED Monitor",3000000,"LED Lightbulbs are <strong>twice</strong> as efficient.<q>Ahh, much more better!</q>");
	new Game.Upgrade("Superdisplay",50000000,"LED Lightbulbs are <strong>twice</strong> as efficient.<q>Ahh, much more better!</q>");
	new Game.Upgrade("Lifi",800000000,"LED Lightbulbs are <strong>twice</strong> as efficient.<q>Ahh, much more better!</q>");
	
	// bacterial
	order=700;
	new Game.Upgrade("Fungus",100000,"Bacterial Lightbulbs gain <strong>+400</strong> base VPS.<br><q>I have to say, I'm quite a fungi!</q>");
	new Game.Upgrade("Salmonella",9500000,"Bacterial Lightbulbs are <strong>twice</strong> as efficient.<br><q>Lightbulbs, I salmon thee.</q>");
	new Game.Upgrade("Cellular division",12000000,"Bacterial Lightbulbs are <strong>twice</strong> as efficient.<br><q>The telomeres man, they limit everything!</q>");
	new Game.Upgrade("Cyanidebacteria",150000000,"Bacterial Lightbulbs are <strong>twice</strong> as efficient.<br><q>The bluestuff, man!<br><strong>WE NEED THE BLUE STUFF</strong></q>");
	new Game.Upgrade("Happinessbacteria",3000000000,"Bacterial Lightbulbs are <strong>twice</strong> as efficient.<br>");
	
	// dinosaur lightbulb
	order=800;
	new Game.Upgrade("Jurrasic Quarks",161803,"Dinosaur Lightbulbs gain <strong>+800</strong> base VPS.<br><q>The essential element of matter, now in dinosaur form</q>");
	new Game.Upgrade("Photinosaurus",2000000,"Dinosaur Lightbulbs are <strong>twice</strong> as efficient.<br><q>There's no tino!</q>");
	new Game.Upgrade("Photonsaurus",50000000,"Dinosaur Lightbulbs are <strong>twice</strong> as efficient.<br><q>You could quantize my electromagnetic waves goodbye.</q>");
	new Game.Upgrade("Mega Dinobulbs",100000000,"Dinosaur Lightbulbs are <strong>twice</strong> as efficient.<br><q>Still better than keys</q>");
	new Game.Upgrade("Unextinction Event",1000000000,"Dinosaur Lightbulbs are <strong>twice</strong> as efficient.<br><q>Meteor?! What meteor?</q>");
	
	// human
	order=1000;
	new Game.Upgrade("Evolution",300000000,"Human Lightbulbs gain <strong>+1500</strong> base VPS.<br><q>The Greeks proposed the theory before Charles Darwin</q>");
	new Game.Upgrade("Worship",4000000000,"Human Lightbulbs are <strong>twice</strong> as efficient.<br><q>All God does is watch us and kill us when we get boring.</q>");
	new Game.Upgrade("Stone Tools",12345678900,"Human Lightbulbs are <strong>twice</strong> as efficient.<br><q>Totally stoned, dude.</q>");
	new Game.Upgrade("Iron Tools",98765432100,"Human Lightbulbs are <strong>twice</strong> as efficient.<br><q>One small step for a man.</q>");
	new Game.Upgrade("Hi Tech",999999999999,"Human Lightbulbs are <strong>twice</strong> as efficient.<br><q>A big leap for mankind.</q>");
	
	// levels
	order=1500;
	new Game.Upgrade("Cranking Power",100,"Buildings produce <strong>+1%</strong> levels per second.<br><q>Hands are better than feets.</q>");
	new Game.Upgrade("Bicycle",750,"Buildings produce <strong>+5%</strong> levels per second.<br><q>Or are they?! <strong>*dramatic music*</strong></q>");
	new Game.Upgrade("Lump of Charcoal",5000,"Buildings produce <strong>+10%</strong> levels per second.<br><q>mfw santa doesn't love me</q>");
	new Game.Upgrade("Biomass",50000,"Buildings produce <strong>+20%</strong> levels per second.<br><q>Poop powered lightbulbs. Yep.</q>");
	new Game.Upgrade("Generic Brand Power Generator",500000,"Buildings produce <strong>+50%</strong> levels per second.<br><q>Totally trustworthy.</q>");
	new Game.Upgrade("Wind Turbines",25000000,"Buildings produce <strong>+60%</strong> levels per second.<br><q>You take my breath away.</q>");
	new Game.Upgrade("Wave Power",51200000,"Buildings produce <strong>+70%</strong> levels per second.<br><q>Tides goes in, tides comes out, you can't explain that</q>");
	new Game.Upgrade("Solar Power",102400000,"Buildings produce <strong>+90%</strong> levels per second.<br><q>SolarCity, coming soon.</q>");
	
	// levels per vps
	order=1600;
	new Game.Upgrade("Open the Gate of Experience",12800,"Volts per seconds are <strong>5%</strong> efficient per levels.<q>Powerful spirits shall be with you, for those who dare shall open this gate.</q>");
	new Game.Upgrade("Experience Scrolls",256000,"Volts per seconds are <strong>10%</strong> efficient per levels.<q>Contains the knowledge of the ancient light waves researchers</q>");
	new Game.Upgrade("Quantum Leaper",5120000,"Volts per seconds are <strong>15%</strong> efficient per levels.<q>Harnest the energy of an electron leaping in a hydrogen atom</q>");
	new Game.Upgrade("Experience Vortex",10240000,"Volts per seconds are <strong>20%</strong> efficient per levels.<q>A swirling electromagnetic energy field, converting experience into photons.</q>");
	new Game.Upgrade("Level Conversion Unit",204800000,"Volts per seconds are <strong>25%</strong> efficient per levels.<q>Highly technical machinery, created from a experience vortex and 10 quantum computers.</q>");
	new Game.Upgrade("E=mc2 Converter",4096000000,"Volts per seconds are <strong>50%</strong> efficient per levels.<q>Suprisingly complicated conversion machinery involving angular momentum and snake venoms.</q>");
	new Game.Upgrade("Energy State Manipulator",81920000000,"Volts per seconds are <strong>75%</strong> efficient per levels.<q>[filler description]</q>");
	new Game.Upgrade("Energy State Manipulator",163840000000,"Volts per seconds are <strong>100%</strong> efficient per levels.<q>[filler description]</q>");
	
	// clicks
	order=0;
	new Game.Upgrade("Let there be light",150,"The mouse gains <strong>+1</strong> volts per clicks.<br><q>And then, there was light.</q>");
	new Game.Upgrade("Taoism",500,"The mouse is <strong>twice</strong> as efficient.<br><q>Two heads are better than one.</q>");
	new Game.Upgrade("Radiator",1000,"The mouse is <strong>twice</strong> as efficient.<br><q>[filler description]</q>");
	new Game.Upgrade("Shining Finger",5000,"The mouse is <strong>twice</strong> as efficient.<br><q>What do you mean it's from Gundam?</q>");
	new Game.Upgrade("Voltswaggen",10000,"The mouse is <strong>twice</strong> as efficient.<br><q>Headlights works at lightspeed, right?</q>");
	new Game.Upgrade("Photino Collectors",150000,"The mouse is <strong>twice</strong> as efficient.<br><q>Aren't even real particles.</q>");
	new Game.Upgrade("Photon Collectors",5000000,"The mouse gains <strong>+0.1</strong> volts per building owned.<br><q>[filler description]</q>");
	new Game.Upgrade("Cosmic Microwave Collector",13813000,"The mouse gains <strong>+0.5</strong> volts per building owned.<br><q>[filler description]</q>");
	new Game.Upgrade("Planck Length Observer",200000000,"The mouse gains <strong>+5</strong> volts per building owned.<br><q>Any observations smaller than this will not make sense.<br>You have been warned.</q>");
	new Game.Upgrade("Supertasking Clicks",2500000000,"The mouse gains <strong>+50</strong> volts per building owned.<br><q>Infinite clicks in finite seconds.<br>possibly.</q>");
	new Game.Upgrade("Lightspeed Manipulator",50000000000,"The mouse gains <strong>+100</strong> volts per building owned.<br><q>Yeah, and our dark matter engines are 200% efficient.</q>");
	new Game.Upgrade("Superdupersymetric String Theory",500000000000,"The mouse gains <strong>+150</strong> volts per building owned.<br><q>e<sup>-</sup> + p &#10141; <u>n</u> + v<sub>e</sub></q>");

	/************************************
	LEVEL
	************************************/
	Game.Level={exp:0, level:1, toNextLevel:100, levelTotalExp:0};
	Game.Level.levelUp=function () {
		this.level++;
		this.levelTotalExp += this.toNextLevel;
		this.calculateNextLevel();
	};
	
	Game.Level.earnExp=function (exp) {
		this.exp += exp;
		while (this.exp>=this.toNextLevel + this.levelTotalExp) {
			this.levelUp();
		}
	};
	
	Game.Level.calculateNextLevel= function () {
		var exp=Math.pow(this.level,2.5) * 100;
		exp *= (1+Math.pow(Game.vps, 0.1));
		exp=Math.floor(exp);
		return this.toNextLevel=exp;
	};
	
	/************************************
	ENTITIES
	************************************/
	Game.Entity=function(stats){
		this.types=stats.type;
		this.stats={hp:0,atk:0,def:0,spd:0};
		for(var i in stats) this.stats[i]=stats[i];
		
		this.hasType=function(type){
			return types.indexOf(type)!==-1;
		}
		
		return this;
	}
	
	/************************************
	WORKERS
	************************************/
	Game.Workers=[];
	Game.WorkersBattle=[];
	Game.maxBattleWorkers=0;
	Game.WorkersN=0;
	Game.BattleWorkersN=0;
	Game.Worker=function(){
		//Game.Entity.apply(this);
		this.type=Game.generateRandomType();
		
		this.id=Game.WorkersN++;
		this.battleId=-1;
		
		this.name=Game.generateWorkerName();
		
		this.level=1;
		this.toNextLevel=100;
		this.rps=0;
		
		this.getRPS=function(){
			return this.rps=Math.floor(this.level * Math.pow(Game.Level.level,1.15));
		}
		
		this.levelUp=function(){
			this.level++;
			Game.spend(this.toNextLevel);
			this.toNextLevel=Math.round(25 * Math.pow(this.level, 2) * Math.pow(Game.Level.level, 1.15));
		}
		
		this.fire=function(){
			Game.Workers.splice(this.id, 1);
			this.unsetBattle();
			Game.WorkersN--;
		}
		
		this.setBattle=function(slot){
			if (slot<Game.maxBattleWorkers) return false;
			Game.Workers[slot]=this;
			this.battleId=slot;
			Game.BattleWorkersN++;
		}
		
		this.unsetBattle=function(){
			if(this.battleId===-1) return false;
			delete Game.WorkersBattle[this.battleId];
			Game.BattleWorkersN--;
		}
		
		Game.Workers.push(this);
		return this;
	}
	
	Game.calcRPS=function(){
		var rps=0;
		for(var i in Game.Workers){
			rps+=Game.Workers[i].getRPS();
		}
		return rps;
	}
	
	Game.calculateMaxBattleWorkers=function(){
		return Game.maxBattleWorkers=6;
	}
	
	Game.spawnWorker=function(){
		var worker=new Game.Worker();
		Game.Notify(worker.name+' has joined your team!', 'Click the <strong>Job</strong> button to manage the team.');
	}
	
	Game.generateWorkerName=function(){
		return choose(['Arthur','Amadeus','Amelia','Bailey','Barly','Chris','Cynthea','Derek','Dobby','Eric','Emmy','George','Hectic','Issac','Jeremie','Joe','Jonathan','Kelly','Linda','Nathan','Sally','Sam','Zoe']);
	}
	
	/************************************
	MOVES
	************************************/
	Game.Move=function(name,description,category,basePower){
		this.name=name;
		this.description=description;
		this.category=category;
		this.basePower=basePower;
	}
	
	/************************************
	BATTLE
	************************************/
	Game.Battle=function(left,right){
		this.left=left;
		this.right=right;
		
		this.turnN=0;
		this.turn=function(){
			if(this.left.health<=0||this.right.health<=0){
				return false;
			}
			
			if(this.turnN%2==0){
				var self=this;
				this.left.inputMove(function(move){
					self.log(left.name+' used '+move.name+'!');
					self.doTurn(self.left,self.right, move);
				});
			}else{
				var move = this.right.chooseMove();
				this.doTurn(this.right,this.left,move);
			}
			
			return true;
		}
		this.doTurn=function(left,right,move){
			if(move.category==='Attack'){
				var power=((left.level/10) * move.base * left.stats.atk)/right.stats.def;
				self.log(left.name+' did '+power+' damage!');
				right.health-=power;
			} else if (move.category==='Defense'){
				// todo
			}
			
			this.turnN++;
			this.turn();
		}
		
		this.log=function(){
			
		}
		
		Game.currentBattle=this;
		return this;
	}
	
	/************************************
	SPECIAL SPAWNERS
	************************************/
	Game.Energy={
		x:0,
		y:0,
		life:0, // disappear when spawn
		maxLife:0, // max time for disappearance
		effect:'', // crystal's effect
		effectTime:0, // life of crystal's effect
		maxEffectTime:0,
		cooldownTime:0, // cooldown time for spawning (5 minutes)
		forced:'' // forced crystal effect
	};
	
	Game.Energy.reset=function(){
		this.x=0;
		this.y=0;
		this.life=0;
		this.maxLife=0;
		this.effect='';
		this.effectTime=0;
		this.maxEffectTime=0;
		this.cooldownTime=Game.fps*300;
		this.forced='';
	}
	
	Game.Energy.effectProbability=[
		['energeticphoton', 60], // 0.2 second of production bonus
		['production', 30], // x20 production bonus for 60s
		//['worker', 5], // workers
		['crystalcursor', 5], // x121 click boost for 88 seconds
		['clickmult',2.5],// x88 EXP/click for 10s
		['levelup',0.5],// level up
	];
	
	Game.Energy.effects={
		'energeticphoton': {
			effect:function(){
				var bonus = (Game.vps*120)+(Game.m_vps*60);
				Game.earn(bonus);
				Game.Energy.setEffectTime(0);
				Game.Particle('Energetic Photon! Earned '+metricify(bonus)+'!', Game.cursorX, Game.cursorY);
			}
		},
		'production':{
			effect:function(){
				Game.productionBonus=15;
				Game.recalc();
				Game.Energy.setEffectTime(60);
				Game.Particle('Uncertainty Principle! x15 production bonus for 60s!', Game.cursorX, Game.cursorY);
			},
			stop:function(){
				Game.productionBonus=0;
				Game.recalc();
			}
		},
		'worker':{
			effect:function(){
				Game.spawnWorker();
				Game.Energy.setEffectTime(0);
				Game.Particle('+1 Worker!', Game.cursorX, Game.cursorY);
			}
		},
		'crystalcursor':{
			effect:function(){
				Game.clickBonus=121;
				Game.Energy.setEffectTime(40);
				Game.recalc();
				Game.Particle('Crystalline Cursor! x120 click bonus for 40s!', Game.cursorX, Game.cursorY);
			},
			stop:function(){
				Game.clickBonus=0;
				Game.recalc();
			}
		},
		'clickmult':{
			effect:function(){
				Game.expBonus=88;
				Game.Energy.setEffectTime(60);
				Game.recalc();
				Game.Particle('Click Frenzy! x88 exp/click for 60s!', Game.cursorX, Game.cursorY);
			},
			stop:function(){
				Game.expBonus=0;
				Game.recalc();
			}
		},
		'levelup':{
			effect:function(){
				Game.Level.levelUp();
				Game.recalc();
				Game.Energy.setEffectTime(0);
				Game.Particle('Level up!', Game.cursorX, Game.cursorY);
			}
		}
	}
	
	Game.Energy.refresh=function(){
		if(this.effectTime>0){
			this.effectTime--;
			$('#timer').css('width',(this.effectTime/this.maxEffectTime*100)+'%');
			if (this.effectTime<=0&&this.effects[this.effect].stop){
				this.effects[this.effect].stop();
			}
		}
		else if (this.cooldownTime>0){
			this.cooldownTime--;
		}else if(this.life>0){
			this.life--;
			if(this.life<=0) $('#crystal').hide();
			else $('#crystal').css('opacity', this.life/this.maxLife);
		}else if(this.forced||Math.random()>0.995) {
			this.x=Math.random()*($(window).width()-$('#crystal').width())
			this.y=Math.random()*($(window).height()-$('#crystal').height())
			
			var self=this;
			$('#crystal').show().css({left: this.x, top:this.y,opacity:1})
				.click(this.click);
			
			this.life=this.maxLife=240;
		}
	}
	
	Game.Energy.click=function(){
		if (Game.Energy.forced) {
			Game.Energy.effect=Game.Energy.forced;
			Game.Energy.effects[Game.Energy.effect].effect();
		} else {
			var n = Math.random();
			for (var i in Game.Energy.effectProbability){
				var probability = Game.Energy.effectProbability[i];
				if(n < probability[1]){
					Game.Energy.effect=probability[0];
					Game.Energy.effects[probability[0]].effect();
					break;
				}
			}
		}
		
		Game.Energy.life = 0;
		Game.Energy.cooldownTime = Game.fps*300;
		Game.Energy.refresh();
		$('#crystal').hide();
	}
	
	Game.Energy.changeProbability=function(name,prob){
		for (var i in this.effectProbability){
			if(this.effectProbability[i][0] === name){
				return this.effectProbability[i][1] = prob;
			}
		}
		
		this.effectProbability.push([name, prob]);
		this.effectProbability.sort(function(a,b){return a[1]<b[1]});
	}
	
	Game.Energy.setEffectTime=function(time){
		Game.Energy.effectTime=Game.Energy.maxEffectTime=time*Game.fps;
	}
	
	/************************************
	INITIALIZE GAME
	************************************/
	Game.init();
	window.Game=Game;
	
})(window, $);