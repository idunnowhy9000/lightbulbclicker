(function (window, $) {
	
	// Utilities
	function toId(text) {
		return text.toString().toLowerCase().replace(/[^a-z0-9]+/g, '');
	}
	
	// Number formatters
	function numberFormatter(units, plural) {
		var single = units[0]||'';
		if (!plural) plural = '';
		
		return function (num) {
			return beautify(function () {
				var decimal;
				if (num > 1000000) {
					for(var i=units.length-1; i>=0; i--) {
						decimal = Math.pow(1000, i+1);

						if(num <= -decimal || num >= decimal) {
							return (Math.round((num / decimal) * 1000) / 1000) + units[i];
						}
					}
				} else {
					num = Math.round(num * 1000) / 1000;
					if (num < 1) return num + single;
					else return num + plural;
				}
			}());
		}
	}
	
	function beautify(value) {
		return value.replace(/\B(?=(\d{3})+(?!\d))/g,',');
	}
	
	var metric = numberFormatter([
		' volt',
		' megavolts',
		' gigavolts',
		' teravolts',
		' exavolts',
		' petavolts',
		' zettavolts',
		' yottavolts',
		' rozettavolts',
		' jiggavolts',
		' hellavolts',
		' multivolts'
	], ' volts'),
	
	metricShort = numberFormatter([
		' V',
		' MV',
		' GV',
		' TV',
		' EV',
		' PV',
		' ZV',
		' YV',
		' RV',
		' JV',
		' HV',
		' MiV',
	]),
	
	magnitudes = numberFormatter([
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
		' undecillion'
	]);
	
	/************************************
	GAME
	************************************/
	var Game = {};
	
	Game.version = 2.016;
	Game.versionRead = '2.016a';
	
	Game.ready = 0;
	
	Game.saveFile = 'LBClicker';
	
	Game.init = function () {
		Game.ready = 1;
		
		Game.fps=30;
		Game.T=0;
		Game.drawT=0;
		
		Game.volts = 0;
		Game.voltsTot = 0;
		Game.voltsTotAll = 0;
		
		Game.vps = 0;
		Game.m_vps = 0;
		Game.expps = 0;
		
		// stats
		Game.clicked = 0;
		Game.factName = 'Your Factory';
		
		// dates
		Game.sessionStart=Date.now();
		Game.gameStart=Date.now();
		Game.lastDate =Date.now();
		
		// options
		Game.prefs = {
			autoSave:60
		};
		
		// track events
		Game.cursor={x:0,y:0};
		$(document).on('mousemove mouseover', function(e) {
			Game.cursor.x = e.pageX;
			Game.cursor.y = e.pageY;
		});
		
		Game.load();
		Game.recalc();
		
		Game.draw();
		Game.loop();
	};
	
	/************************************
	DRAW
	************************************/
	Game.draw = function() {
		for (var i in Game.Buildings){
			Game.Buildings[i].draw();
		}
		
		for (var i in Game.Upgrades) {
			Game.Upgrades[i].draw();
		}
		
		Game.Level.draw();
		Game.refreshFactoryName();
		
		Game.bindEvents();
	};
	
	/************************************
	BIND EVENTS
	************************************/
	Game.bindEvents=function(){
		$('#bulb').click(Game.click);
		$('#saveG').click(Game.saveGClick);
		$('#resetG').click(Game.resetGClick);
		$('#importG').click(Game.importGClick);
		$('#exportG').click(Game.exportGClick);
		$('#factNameDisplay').click(Game.openFactoryName);
	}
	
	Game.saveGClick=function(){
		Game.save();
	}
	
	Game.resetGClick=function(){
		bootbox.dialog({
			title: 'Reset',
			message: 'Are you sure you want to reset?<br><span class="warning"><b>Warning:</b> resetting will not gain bonuses.</span>',
			buttons: {
				success: {
					label: "Yes",
					className: "btn-success",
					callback: function() {
						Game.reset();
						Game.refresh();
						return;
					}
				},
				danger: {
					label: "No",
					className: "btn-danger",
					callback: function() {return;}
				}
			}
		});
	}
	
	Game.importGClick=function(){
		bootbox.dialog({
			title: 'Import Game',
			message: '<div class="form-group"><textarea class="form-control import" rows="5"></textarea></div>',
			buttons: {
				success: {
					label: "Import",
					className: "btn-primary",
					callback: function() {
						var save = $('textarea.import').val();
						if (save) {
							Game.load(save);
							Game.recalc();
						}
					}
				}
			}
		});
	}
	
	Game.exportGClick=function(){
		bootbox.alert({
			title: 'Export Game',
			message: '<div class="form-group"><textarea class="form-control" rows="5">' + localStorage.getItem('LBClicker') + '</textarea></div>'
		});
	}
	
	/************************************
	REFRESH
	************************************/
	Game.refresh=function(){
		Game.refreshCount();
		for(var i in Game.Buildings){
			Game.Buildings[i].refresh();
		}
		for(var i in Game.Upgrades){
			Game.Upgrades[i].refresh();
		}
		
		Game.Level.refresh();
	}
	
	/************************************
	COUNTS
	************************************/
	Game.refreshCount=function(){
		$('#count').text(metric(Math.floor(this.volts)));
		$('#vps').text(metric(this.vps, 2));
	}
	
	Game.refreshTitle = function(){
		document.title = metric(Math.floor(this.volts))
			+ ' | Lightbulb Inc';
	}
	
	/************************************
	FACTORY NAME
	************************************/
	Game.openFactoryName=function(){
		var self = this;
		bootbox.prompt({
			title: 'Name your factory',
			value: this.factName,
			callback: function (name) {
				if (name) {
					self.factName = name;
					self.refreshFactoryName();
				}
			}
		});
	}
	
	Game.refreshFactoryName=function(){
		$('#factNameDisplay').text(this.factName);
	}
	
	/************************************
	LOOP
	************************************/
	Game.loop = function () {
		Game.logicElasped++;
		Game.logic();
		
		if (document.hasFocus || Game.T%5==0) Game.refresh();
		if (Game.T%15==0)Game.refreshTitle();
		
		setTimeout(Game.loop, 1000/Game.fps);
	};

	Game.logic= function () {
		Game.earn(Game.vps / Game.fps);
		Game.Level.calculateNextLevel();
		Game.Level.earnExp(Game.expps / Game.fps);
		
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
		if (Game.Level.level>=85)Game.unlock("Solar Power");
		
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
		
		if (Game.prefs.autoSave && Game.T%(Game.prefs.autoSave*Game.fps)===0 && Game.T>Game.fps*10) Game.save();
		
		Game.T++;
	};
	
	/************************************
	VOLTS MANIPULATOR
	************************************/
	Game.earn = function(n){
		Game.volts+=n;
		Game.voltsTot+=n;
		Game.voltsTotAll+=n;
		return n;
	};
	
	Game.spend = function(n){
		Game.volts-=n;
		return n;
	};
	
	/************************************
	SAVE
	************************************/
	Game.load = function (save) {
		if (!save) {
			if (localStorage.hasOwnProperty(Game.saveFile)) {
				save = localStorage.getItem(Game.saveFile);
			} else {
				return false;
			}
		}
		
		var decoded = save.split('!'),
			version = parseFloat(decoded[0]);
		
		if (!decoded.length) {
			Game.notify('Your save file is invalid.');
		} else if (isNaN(version)) {
			Game.notify('Your save file version is invalid.');
		} else if (version > Game.version) {
			Game.notify('Your save file is from a future version.');
		} else {
			if (version >= 2) {
				Game.volts = parseInt(decoded[1]);
				Game.voltsTot = parseInt(decoded[2]);
				Game.voltsTotAll = parseInt(decoded[3]);
				
				Game.sessionStart = parseInt(decoded[4]);
				Game.gameStart = parseInt(decoded[5]);
				Game.clicked = parseInt(decoded[6]);
				Game.factName = decoded[7];
				
				var buildings = decoded[8].split(','), n = 0;
				for (i in Game.Buildings) {
					Game.Buildings[i].amount = parseInt(buildings[n++])||0;
				}
				
				var upgrades = decoded[9].split(','), i;
				for (i = 0; i < upgrades.length; i++) {
					if(Game.UpgradesById[upgrades[i]]) {
						Game.UpgradesById[upgrades[i]].earned = true;
					}
				}
				
				Game.Level.exp=0;
				Game.Level.earnExp(parseFloat(decoded[10]));
			} else {
				Game.notify("Sorry, we don't support this version anymore.");
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
			var building = Game.Buildings[i];
			buildingsAmount.push(building.amount);
		}
		saveData.push(buildingsAmount.join(','));
		
		// upgrades
		var upgradesAmount=[];
		for(var i in Game.Upgrades) {
			var upgrade = Game.Upgrades[i];
			if(upgrade.earned) upgradesAmount.push(upgrade.id);
		}
		saveData.push(upgradesAmount.join(','));
		
		// levels
		saveData.push(Game.Level.exp);
		
		// preferences
		saveData.push(Game.prefs.autoSave);
		
		var saveStr = saveData.join('!');
		
		localStorage.setItem(Game.saveFile, saveStr);
		return saveStr;
	}
	
	Game.reset=function(){
		for(var i in Game.Buildings){
			var building=Game.Buildings[i];
			building.amount=0;
			building.cost = building.baseCost;
			building.displayed=false;
		}
		
		for (var i in Game.Upgrades){
			var upgrade=Game.Upgrades[i];
			upgrade.earned=false;
			upgrade.displayed=false;
		}
		
		Game.Level.exp=0;
		Game.Level.level=1;
		Game.Level.toNextLevel=100;
		Game.Level.levelTotalExp=0;
		
		Game.volts = 0;
		Game.voltsTot = 0;
		Game.voltsTotAll = 0;
		
		Game.vps = 0;
		Game.m_vps = 0;
		Game.expps = 0;
		
		// stats
		Game.clicked = 0;
		Game.factName = 'Your Factory';
		
		// dates
		Game.sessionStart=Date.now();
		Game.gameStart=Date.now();
		Game.lastDate =Date.now();
		
		// options
		Game.prefs = {
			autoSave:60
		};
		
		Game.refresh();
		Game.recalc();
	}
	
	/************************************
	CALCULATOR
	************************************/
	Game.calcVPS = function(){
		var vps = 0;
		for (var i in Game.Buildings) {
			vps += Game.Buildings[i].calcVPS();
		}
		
		var level=0;
		if (Game.has('Open the Gate of Experience')) level = 1.05;
		if (Game.has('Experience Scrolls')) level = 1.1;
		if (Game.has('Quantum Leaper')) level = 1.15;
		if (Game.has('Experience Vortex')) level = 1.2;
		if (Game.has('Level Conversion Unit')) level = 1.25;
		if (Game.has('E=mc2 Converter')) level = 1.5;
		if (Game.has('Energy State Manipulator')) level = 1.75;
		if (Game.has('Energy State Manipulator')) level = 2;
		vps *= 1+(level * 0.1);
		
		return Game.vps = vps;
	};
	
	Game.calcExpps = function(){
		var expps = 0;
		for (var i in Game.Buildings) {
			expps += Game.Buildings[i].calcVPS();
		}
		expps *= 0.1;
		
		var mult = 1;
		if(Game.has("Cranking Power")) mult+=0.01;
		if(Game.has("Bicycle")) mult+=0.05;
		if(Game.has("Lump of Charcoal")) mult+=0.1;
		if(Game.has("Biomass")) mult+=0.25;
		if(Game.has("Generic Brand Power Generator")) mult+=0.5;
		if(Game.has("Wind Turbines")) mult+=0.6;
		if(Game.has("Wave Power")) mult+=0.75;
		if(Game.has("Solar Power")) mult+=0.95;
		expps *= mult;
		
		return Game.expps = expps;
	};
	
	Game.calcMouseVPS = function(){
		var vps = 1;
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
		return Game.m_vps = vps;
	}
	
	Game.recalc = function () {
		Game.calcVPS();
		Game.calcExpps();
		Game.calcMouseVPS();
		
		for (var i in Game.Buildings) {
			Game.Buildings[i].updateCost();
		}
	};
	
	/************************************
	CLICKS
	************************************/
	Game.click = function(){
		var m_vps = Game.m_vps || Game.calcMouseVPS();
		
		Game.earn(m_vps);
		Game.Level.earnExp(m_vps);
		Game.clicked++;
		
		Game.Particle('+'+m_vps, Game.cursor.x, Game.cursor.y - 25);
		
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
	BUILDINGS
	************************************/
	Game.Buildings = {};
	Game.BuildingsOwned = 0;
	Game.Building = function Building(name, commonName, baseCost, description, displayAt, vps) {
		var commonName = commonName.split('|'),
			single = commonName[0] || name,
			plural = (commonName[1] ? commonName[1] : (single + 's')),
			actionName = (commonName[2] || 'producing');
		
		this.id=toId(name);
		this.name = name;
		this.single=single;
		this.plural=plural;
		this.actionName=actionName;

		this.baseCost = this.cost = baseCost;
		this.description = description;
		this.displayAt = displayAt;
		this.amount = 0;
		
		this.oneVps = 0;
		this.vps = 0;
		
		// buy sell
		this.buy=function(n) {
			for (var i = 0; i < n; i++) {
				if (Game.volts < this.cost) {
					Game.calcVPS();
					Game.calcExpps();
					return i;
				}
				
				Game.spend(this.cost);
				this.amount++;
				this.updateCost();
			}
			
			Game.calcVPS();
			Game.calcExpps();
			return n;
		};
		this.buyMax=function(){
			while(Game.volts>this.cost){
				Game.spend(this.cost);
				this.amount++;
				this.updateCost();
			}
			
			this.updateCost();
			Game.calcVPS();
			Game.calcExpps();
		}
		
		this.sell=function (n) {
			var totalCost = 0;
			
			for (var i = 1; i < n; i++) {
				if (this.amount <= 0) {
					break;
				}
				
				this.amount--;
				this.updateCost();
				totalCost += this.cost * 0.25;
			}
			
			Game.earn(totalCost);
			Game.calcVPS();
			Game.calcExpps();
			return n;
		};
		this.sellMax=function(){
			var totalCost = 0;
			
			while(this.amount>0){
				this.amount--;
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
			return this.cost = this.getCurrentCost();
		};
		
		// vps
		this.calcVPS=function(){
			this.oneVps = vps();
			this.vps = this.oneVps * this.amount;
			return this.vps;
		};
		
		// draw
		this.el = null;
		this.draw=function(){
			if (this.el) return;
			var self=this;
			this.el = $('<div class="buildingHolder"></div>')
			.html(
				'<div class="buildingObj btn btn-primary" id="<%= id %>">' +
					'<div class="buildingAmount">' + this.amount + '</div>' +
					'<div class="buildingInfo">' +
						'<div class="buildingName">' + name + '</div>' +
						'<div class="buildingCost">' + metric(this.cost) + '</div>' +
					'</div>' +
				'</div>' +
				'<div class="buySell">' +
					'<a class="buy10">Buy 10</a>' +
					'<a class="buyMax">Buy Max</a>' +
					'<a class="sell10">Sell 10</a>' +
					'<a class="sellMax">Sell Max</a>' +
				'</div>'
			)
			.popover({
				trigger:'hover',
				html:true,
				container:'body',
				content:function(){
					return '<span>'+description+'</span><br>' +
							'Costs <strong>'+metric(self.cost)+'</strong><br>' +
							'<ul>' +
								'<li>Each '+single+' produces <strong>'+metric(self.oneVps)+'/second</strong></li>' +
								'<li><strong>'+self.amount+'</strong> '+plural+' '+actionName+' <strong>'+metric(self.vps)+'/second</strong></li>' +
							'</ul>';
				},
				placement: 'right',
				title: this.name
			});
			this.bindEvents();
			$('#lightbulbListContainer').append(this.el);
		}
		this.bindEvents=function(){
			var self=this;
			this.el.children('.buildingObj').click(function() {self.buy(1)});
			this.el.find('.buy10').click(function() {self.buy(10)});
			this.el.find('.buyMax').click(function() {self.buyMax()});
			this.el.find('.sell10').click(function() {self.sell(10)});
			this.el.find('.sellMax').click(function() {self.sellMax()});
		}
		this.refresh = function() {
			this.el.find('.buildingCost').text(metric(this.cost));
			this.el.find('.buildingAmount').text(magnitudes(this.amount));
			if (this.cost > Game.volts) {
				this.el.children('.buildingObj').addClass('disabled');
			} else {
				this.el.children('.buildingObj').removeClass('disabled');
			}
			if (!this.displayed) this.el.hide();
			if(Game.volts>=this.displayAt && !this.displayed){
				this.displayed = true;
				this.el.fadeIn(400).show();
			}
		}
		
		Game.Buildings[name] = this;
		Game.BuildingsOwned++;
	};
	
	/************************************
	UPGRADES
	************************************/
	Game.Upgrades = {};
	Game.UpgradesById = {};
	Game.UpgradesOwned = 0;
	Game.Upgrade = function (name, cost, description) {
		this.id=toId(name);
		this.name=name;
		this.description=description;
		this.cost=cost;
		this.earned=false;
		
		this.displayed=false;
		this.displayable=false;
		
		this.buy=function(){
			if (this.cost > Game.volts) return false;
			Game.spend(this.cost);
			this.earned = true;
			Game.recalc();
		}
		
		// draw
		this.el=null;
		this.draw=function(){
			if(this.el)return;
			var self=this;
			this.el=$('<div class="upgradeObj"></div>')
			.css('background-image', 'url(images/upgrades/' + this.id + ')')
			.popover({
				trigger:'hover',
				html:true,
				container:'body',
				content:function(){
					return '<p>Costs <strong class="cost">' + metric(cost) + '</strong></p>' +
						'<p>' + description + '</p>';
				},
				placement: 'bottom',
				title: this.name
			});
			
			if (!this.displayed)this.el.hide();
			this.el.click(function(){self.buy()});
			$('#upgradeListContainer').append(this.el);
		}
		this.refresh=function(){
			if (this.earned) {
				this.el.hide().popover('hide');
				return;
			}
			
			if (this.cost > Game.volts) {
				this.el.addClass('disabled');
			} else {
				this.el.removeClass('disabled');
			}
			
			if (!this.displayed) this.el.hide();
			if (this.displayable && !this.displayed){
				this.displayed = true;
				this.el.fadeIn(400).show();
			}
		}
		
		Game.Upgrades[name] = this;
		Game.UpgradesById[this.id] = this;
		Game.UpgradesOwned++;
	};
	
	Game.has = function (name) {
		return Game.Upgrades[name] && Game.Upgrades[name].earned;
	};
	
	Game.unlock=function(name){
		return Game.Upgrades[name].displayable=true;
	};
	
	Game.lock=function(name){
		return Game.Upgrades[name].displayable=false;
	};
	
	/************************************
	BUILDINGS DATA
	************************************/
	new Game.Building("Incandescent Lightbulb", "incandescent lightbulb||shining", 15, "The greatest invasion in history has now begun.", -1, function () {
		var add = 0, mult = 1;
		if (Game.has("Thomas Edison")) add += 0.1;
		if (Game.has("Joseph Swan")) mult *= 2;
		if (Game.has("Hiram Maxim")) mult *= 2;
		if (Game.has("Patents")) mult *= 2;
		if (Game.has("Albert Einstein Clone")) mult *= 2;
		return (0.1 + add) * mult;
	});
	new Game.Building("Lightbulb Smasher", "lightbulb smasher||smashing", 50, "Hires some muscular guys to smash bulbs.", 25, function () {
		var add = 0, mult = 1;
		if(Game.has("Experimentation Room")) add+=0.5
		if(Game.has("Big Hammer")) mult*=2
		if(Game.has("Sludgehammer")) mult*=2
		if(Game.has("Warhammer")) mult*=2
		if(Game.has("Thor")) mult*=2
		return (0.5 + add) * mult;
	});
	new Game.Building("Lightning Collector", "thunder collector||collecting", 150, "Collects lightning whenever they strike.", 100, function () {
		var add = 0, mult = 1;
		if(Game.has("Electric Panel")) add+=2
		if(Game.has("Plasma Ball")) mult*=2
		if(Game.has("Hotter than Lead")) mult*=2
		if(Game.has("Zeus Worshippers")) mult*=2
		if(Game.has("Zeus Angerers")) mult*=2
		return (2.5 + add) * mult;
	});
	new Game.Building("Halogen Lightbulb", "halogen lightbulb||shining", 500, "AHH! IT's TOO BRIGHT!", 250, function () {
		var add = 0, mult = 1;
		if(Game.has("Pressure container")) add+=5
		if(Game.has("Chlorine Lightbulb")) mult*=2
		if(Game.has("Hydrocarbon Bromine compounds")) mult*=2
		if(Game.has("Krypton Gas")) mult*=2
		if(Game.has("Xenon Gas")) mult*=2
		return (5 + add) * mult;
	});
	new Game.Building("Tan Lightbulb", "tan lightbulb||shining", 1000, "ahh, much better...", 500, function () {
		var add = 0, mult = 1;
		if(Game.has("Ultraviolet Radiator")) add+=30
		if(Game.has("Sunscreen lotion")) mult*=2
		if(Game.has("Vitamin D Producer")) mult*=2
		if(Game.has("Cancer Protection Radiator")) mult*=2
		if(Game.has("Melanin Maker")) mult*=2
		return (25 + add) * mult;
	});
	new Game.Building("LED Lightbulb", "LED lightbulb||shining", 10000, "LEDs you to your destiny.", 5000, function () {
		var add = 0, mult = 1;
		if(Game.has("LED Diodes")) add+=100
		if(Game.has("Glowstick")) mult*=2
		if(Game.has("LED Monitor")) mult*=2
		if(Game.has("Superdisplay")) mult*=2
		if(Game.has("Lifi")) mult*=2
		return (50 + add) * mult;
	});
	new Game.Building("Bacterial Lightbulb", "bacterial lightbulb||producing", 500000, "Small, tiny life forms that will soon take over the WORLD!", 19930, function () {
		var add = 0, mult = 1;
		if(Game.has("Fungus")) add+=400
		if(Game.has("Salmonella")) mult*=2
		if(Game.has("Cellular division")) mult*=2
		if(Game.has("Cyanidebacteria")) mult*=2
		if(Game.has("Happinessbacteria")) mult*=2
		return (500 + add) * mult;
	});
	new Game.Building("Dinosaur Lightbulb", "dinosaur lightbulb||pooping out", 2718281, "inb4 asteroids", 25000, function () {
		var add = 0, mult = 1;
		if(Game.has("Jurrasic Quarks")) add+=800
		if(Game.has("Photinosaurus")) mult*=2
		if(Game.has("Photonsaurus")) mult*=2
		if(Game.has("Mega Dinobulbs")) mult*=2
		if(Game.has("Unextinction Event")) mult*=2
		return (2500 + add) * mult;
	});
	new Game.Building("Human Lightbulb", "human lightbulb||creating", 500000000, "A civilization for 200,000 years", 5000000, function () {
		var add = 0, mult = 1;
		if(Game.has("Evolution")) add+=1500
		if(Game.has("Worship")) mult*=2
		if(Game.has("Stone Tools")) mult*=2
		if(Game.has("Iron Tools")) mult*=2
		if(Game.has("Hi Tech")) mult*=2
		return (99999 + add) * mult;
	});
	
	/************************************
	UPGRADES DATA
	************************************/
	// incandescent
	new Game.Upgrade("Thomas Edison",100,"Incandescent lightbulb gain <strong>+0.1</strong> base VPS.<br><q>1% percent inspiration, 99% perspriation.</q>");
	new Game.Upgrade("Joseph Swan",1000,"Incandescent lightbulb are <strong>twice</strong> as efficient.<q>Nice guy, long beard.</q>");
	new Game.Upgrade("Hiram Maxim",100000,"Incandescent lightbulb are <strong>twice</strong> as efficient.<br><q>Sounds like a Harry Potter spell.</q>");
	new Game.Upgrade("Patents",5000000,"Incandescent lightbulb are <strong>twice</strong> as efficient.<br><q>PATENT ALL THE THINGS!</q>");
	new Game.Upgrade("Albert Einstein Clone",50000000,"Incandescent lightbulb are <strong>twice</strong> as efficient.<br><q>Hire a clone and he'll probably help you out!</q>");
	
	// smashers
	new Game.Upgrade("Experimentation Room",1000,"Bulb smashers gain <strong>+0.5</strong> base VPS.<q>Put on your goggles, prepare your muscles.</q>");
	new Game.Upgrade("Big Hammer",50000,"Bulb smashers are <strong>twice</strong> as efficient.<q>Probably not a sexual innuendo.</q>");
	new Game.Upgrade("Sludgehammer",550000,"Bulb smashers are <strong>twice</strong> as efficient.<q>Stickiest weapon on Earth.</q>");
	new Game.Upgrade("Warhammer",12500000,"Bulb smashers are <strong>twice</strong> as efficient.<q>Is this Sparta?</q>");
	new Game.Upgrade("Thor",725000000,"Bulb smashers are <strong>twice</strong> as efficient.<q>The Key to Valhalla.</q>");
	
	// lightning
	new Game.Upgrade("Electric Panel",5000,"Thunder Collectors gain <strong>+2</strong> base VPS.<q>Ahh, much more better!</q>");
	new Game.Upgrade("Plasma Ball",50000,"Thunder Collectors are <strong>twice</strong> as efficient.<br><q>The ultimate Electric Party!</q>");
	new Game.Upgrade("Hotter than Lead",100000,"Thunder Collectors are <strong>twice</strong> as efficient.<br><q>But not hotter than Venus.</q>");
	new Game.Upgrade("Zeus Worshippers",5500000,"Thunder Collectors are <strong>twice</strong> as efficient.<br><q>Actually raised by a goat.</q>");
	new Game.Upgrade("Zeus Angerers",10000000,"Thunder Collectors are <strong>twice</strong> as efficient.<br><q>Let's just worship Uranus.</q>");
	
	// halogen
	new Game.Upgrade("Pressure container",5000,"Halogen Lightbulbs gain <strong>+2</strong> base VPS.<q>Ahh, much more better!</q>");
	new Game.Upgrade("Chlorine Lightbulb",10000,"Halogen Lightbulbs are <strong>twice</strong> as efficient.<q>Ahh, much more better!</q>");
	new Game.Upgrade("Hydrocarbon Bromine compounds",255000,"Halogen Lightbulbs are <strong>twice</strong> as efficient.<q>Ahh, much more better!</q>");
	new Game.Upgrade("Krypton Gas",5000000,"Halogen Lightbulbs are <strong>twice</strong> as efficient.<q>Ahh, much more better!</q>");
	new Game.Upgrade("Xenon Gas",50000000,"Halogen Lightbulbs are <strong>twice</strong> as efficient.<q>Ahh, much more better!</q>");
	
	// tan
	new Game.Upgrade("Ultraviolet Radiator",31415,"Tan Lightbulbs gain <strong>+30</strong> base VPS.<q>Ahh, much more better!</q>");
	new Game.Upgrade("Sunscreen lotion",173205,"Tan Lightbulbs are <strong>twice</strong> as efficient.<q>Ahh, much more better!</q>");
	new Game.Upgrade("Vitamin D Producer",1414213,"Tan Lightbulbs are <strong>twice</strong> as efficient.<q>Ahh, much more better!</q>");
	new Game.Upgrade("Cancer Protection Radiator",22360679,"Tan Lightbulbs are <strong>twice</strong> as efficient.<q>Ahh, much more better!</q>");
	new Game.Upgrade("Melanin Maker",360555127,"Tan Lightbulbs are <strong>twice</strong> as efficient.<q>Ahh, much more better!</q>");
	
	// led
	new Game.Upgrade("LED Diodes",50000,"LED Lightbulbs gain <strong>+100</strong> base VPS.<q>Ahh, much more better!</q>");
	new Game.Upgrade("Glowstick",200000,"LED Lightbulbs are <strong>twice</strong> as efficient.<q>Ahh, much more better!</q>");
	new Game.Upgrade("LED Monitor",3000000,"LED Lightbulbs are <strong>twice</strong> as efficient.<q>Ahh, much more better!</q>");
	new Game.Upgrade("Superdisplay",50000000,"LED Lightbulbs are <strong>twice</strong> as efficient.<q>Ahh, much more better!</q>");
	new Game.Upgrade("Lifi",800000000,"LED Lightbulbs are <strong>twice</strong> as efficient.<q>Ahh, much more better!</q>");
	
	// bacterial
	new Game.Upgrade("Fungus",100000,"Bacterial Lightbulbs gain <strong>+400</strong> base VPS.<br><q>I have to say, I'm quite a fungi!</q>");
	new Game.Upgrade("Salmonella",9500000,"Bacterial Lightbulbs are <strong>twice</strong> as efficient.<br><q>Lightbulbs, I salmon thee.</q>");
	new Game.Upgrade("Cellular division",12000000,"Bacterial Lightbulbs are <strong>twice</strong> as efficient.<br><q>The telomeres man, they limit everything!</q>");
	new Game.Upgrade("Cyanidebacteria",150000000,"Bacterial Lightbulbs are <strong>twice</strong> as efficient.<br><q>The bluestuff, man!<br><strong>WE NEED THE BLUE STUFF</strong></q>");
	new Game.Upgrade("Happinessbacteria",3000000000,"Bacterial Lightbulbs are <strong>twice</strong> as efficient.<br>");
	
	// dinosaur lightbulb
	new Game.Upgrade("Jurrasic Quarks",161803,"Dinosaur Lightbulbs gain <strong>+800</strong> base VPS.<br><q>The essential element of matter, now in dinosaur form</q>");
	new Game.Upgrade("Photinosaurus",2000000,"Dinosaur Lightbulbs are <strong>twice</strong> as efficient.<br><q>There's no tino!</q>");
	new Game.Upgrade("Photonsaurus",50000000,"Dinosaur Lightbulbs are <strong>twice</strong> as efficient.<br><q>You could quantize my electromagnetic waves goodbye.</q>");
	new Game.Upgrade("Mega Dinobulbs",100000000,"Dinosaur Lightbulbs are <strong>twice</strong> as efficient.<br><q>Still better than keys</q>");
	new Game.Upgrade("Unextinction Event",1000000000,"Dinosaur Lightbulbs are <strong>twice</strong> as efficient.<br><q>Meteor?! What meteor?</q>");
	
	// human
	new Game.Upgrade("Evolution",300000000,"Human Lightbulbs gain <strong>+1500</strong> base VPS.<br><q>The Greeks proposed the theory before Charles Darwin</q>");
	new Game.Upgrade("Worship",4000000000,"Human Lightbulbs are <strong>twice</strong> as efficient.<br><q>All God does is watch us and kill us when we get boring.</q>");
	new Game.Upgrade("Stone Tools",12345678900,"Human Lightbulbs are <strong>twice</strong> as efficient.<br><q>Totally stoned, dude.</q>");
	new Game.Upgrade("Iron Tools",98765432100,"Human Lightbulbs are <strong>twice</strong> as efficient.<br><q>One small step for a man.</q>");
	new Game.Upgrade("Hi Tech",999999999999,"Human Lightbulbs are <strong>twice</strong> as efficient.<br><q>A big leap for mankind.</q>");
	
	// levels
	new Game.Upgrade("Cranking Power",25,"Buildings produce <strong>+1%</strong> levels per second.<br><q>Hands are better than feets.</q>");
	new Game.Upgrade("Bicycle",100,"Buildings produce <strong>+5%</strong> levels per second.<br><q>Or are they?! <strong>*dramatic music*</strong></q>");
	new Game.Upgrade("Lump of Charcoal",1000,"Buildings produce <strong>+10%</strong> levels per second.<br><q>mfw santa doesn't love me</q>");
	new Game.Upgrade("Biomass",10000,"Buildings produce <strong>+25%</strong> levels per second.<br><q>Poop powered lightbulbs. Yep.</q>");
	new Game.Upgrade("Generic Brand Power Generator",100000,"Buildings produce <strong>+50%</strong> levels per second.<br><q>Totally trustworthy.</q>");
	new Game.Upgrade("Wind Turbines",25000000,"Buildings produce <strong>+60%</strong> levels per second.<br><q>You take my breath away.</q>");
	new Game.Upgrade("Wave Power",51200000,"Buildings produce <strong>+75%</strong> levels per second.<br><q>Tides goes in, tides comes out, you can't explain that</q>");
	new Game.Upgrade("Solar Power",102400000,"Buildings produce <strong>+95%</strong> levels per second.<br><q>SolarCity, coming soon.</q>");
	
	// levels per vps
	new Game.Upgrade("Open the Gate of Experience",12800,"Volts per seconds are <strong>5%</strong> efficient per levels.<q>Powerful spirits shall be with you, for those who dare shall open this gate.</q>");
	new Game.Upgrade("Experience Scrolls",256000,"Volts per seconds are <strong>10%</strong> efficient per levels.<q>Contains the knowledge of the ancient light waves researchers</q>");
	new Game.Upgrade("Quantum Leaper",5120000,"Volts per seconds are <strong>15%</strong> efficient per levels.<q>Harnest the energy of an electron leaping in a hydrogen atom</q>");
	new Game.Upgrade("Experience Vortex",10240000,"Volts per seconds are <strong>20%</strong> efficient per levels.<q>A swirling electromagnetic energy field, converting experience into photons.</q>");
	new Game.Upgrade("Level Conversion Unit",204800000,"Volts per seconds are <strong>25%</strong> efficient per levels.<q>Highly technical machinery, created from a experience vortex and 10 quantum computers.</q>");
	new Game.Upgrade("E=mc2 Converter",4096000000,"Volts per seconds are <strong>50%</strong> efficient per levels.<q>Suprisingly complicated conversion machinery involving angular momentum and snake venoms.</q>");
	new Game.Upgrade("Energy State Manipulator",81920000000,"Volts per seconds are <strong>75%</strong> efficient per levels.<q>[filler description]</q>");
	new Game.Upgrade("Energy State Manipulator",163840000000,"Volts per seconds are <strong>100%</strong> efficient per levels.<q>[filler description]</q>");
	
	// clicks
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

	/************************************
	LEVEL
	************************************/
	Game.Level = {exp:0, level:1, toNextLevel:100, levelTotalExp:0};
	Game.Level.levelUp = function () {
		this.level++;
		this.levelTotalExp += this.toNextLevel;
		this.calculateNextLevel();
	};
	
	Game.Level.earnExp = function (exp) {
		this.exp += exp;
		while (this.exp >= this.toNextLevel + this.levelTotalExp) {
			this.levelUp();
		}
	};
	
	Game.Level.calculateNextLevel= function () {
		var exp = Math.pow(this.level,3) * 100;
		if (Game.vps) exp *= Math.pow(Game.vps, 0.2);
		exp = Math.floor(exp);
		return this.toNextLevel = exp;
	};
	
	Game.Level.el=null;
	Game.Level.draw=function(){
		if(this.el)return;
		this.el=$('#levelContainer')
		.html('<p>'+
			'Level <span class="level">'+this.level+'</span> (<span class="exp">'+magnitudes(this.exp)+'</span> exp)<br>'+
			'<span class="neededToNext">' + magnitudes(this.toNextLevel + this.levelTotalExp - Math.floor(this.exp)) + '</span> exp until next level'+
		'</p>'+
		'<div class="progress" style="margin-top: 15px;  margin-right: 50px; margin-left: 50px; height: 30px">'+
			'<div class="progress-bar"></div>'+
		'</div>')
	}
	Game.Level.refresh=function(){
		this.el.find('.level').text(this.level);
		this.el.find('.exp').text(magnitudes(Math.floor(this.exp)));
		this.el.find('.neededToNext').text(magnitudes(this.toNextLevel + this.levelTotalExp - Math.floor(this.exp)));
		this.el.find('.progress-bar').css('width', ((this.exp - this.levelTotalExp) / this.toNextLevel * 100) + '%');
	}
	
	/************************************
	INITIALIZE GAME
	************************************/
	Game.init();
	window.Game = Game;
	
})(window, $);