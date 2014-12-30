/*************************************************
* Lightbulb Clicker's drawer script file
* Controls drawing functions of the main game
*************************************************/
(function (window) {
	"use strict";
	window.Game.drawer = {
		draw: function () {
			if (!window.Game.drawed) {
				var container = l('#container'),
					colLeft = document.createElement('div'),
					colMid = document.createElement('div'),
					colRight = document.createElement('div');
				// draw
				// colLeft
				colLeft.setAttribute('id','col1');

				var lightbulbListContainer = document.createElement('div');
				lightbulbListContainer.setAttribute('id', 'lightbulbListContainer');
				colLeft.appendChild(lightbulbListContainer);

				var lightbulbListTitle = document.createElement('p');
				lightbulbListTitle.setAttribute('id', 'lightbulbListTitle');
				lightbulbListTitle.setAttribute('class', 'large');
				lightbulbListTitle.appendChild(document.createTextNode('Lightbulbs'));
				lightbulbListContainer.appendChild(lightbulbListTitle);

				var store = document.createElement('div');
				store.setAttribute('id', 'lightbulb');
				lightbulbListContainer.appendChild(store);
				// drawed in Buildings.draw

				// colMid
				colMid.setAttribute('id','col2');

				var factNameDisplay = document.createElement('div');
				factNameDisplay.setAttribute('id', 'factNameDisplay');
				factNameDisplay.setAttribute('class', 'medium');
				factNameDisplay.appendChild(document.createTextNode('Your Factory'));
				colMid.appendChild(factNameDisplay);

				var voltCounter = document.createElement('div');
				voltCounter.setAttribute('id', 'count');
				voltCounter.setAttribute('class', 'large fond');
				voltCounter.appendChild(document.createTextNode('0 volt'));
				colMid.appendChild(voltCounter);

				var vpsDisplay = document.createElement('div');
				vpsDisplay.setAttribute('id', 'vpsDisplay');
				vpsDisplay.appendChild(document.createTextNode('0 volt/second'));
				colMid.appendChild(vpsDisplay);

				var bulbContainer = document.createElement('div');
				bulbContainer.setAttribute('id', 'bulbContainer');
				colMid.appendChild(bulbContainer);

				var bulb = document.createElement('div');
				bulb.setAttribute('id', 'bulb');
				colMid.appendChild(bulb);

				var progress = document.createElement('div');
				progress.setAttribute('id', 'pbar');
				colMid.appendChild(progress);

				var levelContainer = document.createElement('div');
				levelContainer.setAttribute('id', 'levelContainer');
				colMid.appendChild(levelContainer);
				
				var levelBarContainer = document.createElement('div');
				levelBarContainer.setAttribute('id', 'levelBarContainer');
				colMid.appendChild(levelBarContainer);

				var options = document.createElement('div');
				options.setAttribute('id', 'options');
				options.setAttribute('class', 'btn');
				options.appendChild(document.createTextNode('Options'));
				colMid.appendChild(options);

				// colRight
				colRight.setAttribute('id','col3');

				var upgradeListContainer = document.createElement('div');
				upgradeListContainer.setAttribute('id', 'upgradeListContainer');
				colRight.appendChild(upgradeListContainer);

				var upgradeListTitle = document.createElement('p');
				upgradeListTitle.setAttribute('id', 'upgradeListTitle');
				upgradeListTitle.setAttribute('class', 'large');
				upgradeListTitle.appendChild(document.createTextNode('Upgrades'));
				upgradeListContainer.appendChild(upgradeListTitle);

				var upgradeStore = document.createElement('div');
				upgradeStore.setAttribute('id', 'upgrade');
				upgradeListContainer.appendChild(upgradeStore);
				// drawed in Upgrade.draw

				// container
				container.appendChild(colLeft);
				container.appendChild(colMid);
				container.appendChild(colRight);
				window.Game.drawed = true;
			}
			return window.Game.drawed;
		},
		sortUpgrades: function () {
			var self = window.Game,
				sortedUpgrades = self.upgradeStore,
				upgrades = sortedUpgrades.childNodes,
				upgradesArr = [];
			for (var i in upgrades) {
				if (upgrades[i].nodeType === 1) { // get rid of the whitespace text nodes
					upgradesArr.push(upgrades[i]);
				}
			}
			upgradesArr.sort(function (a, b) {
				var upgradeIdA = a.getAttribute("id").split('-')[1],
					upgradeIdB = b.getAttribute("id").split('-')[1];
				if (!self.upgrades[upgradeIdA] || !self.upgrades[upgradeIdB]) return 0;
				var upgradeA = self.upgrades[upgradeIdA],
					upgradeB = self.upgrades[upgradeIdB];
				if (upgradeA.cost > upgradeB.cost) return 1;
				else if (upgradeA.cost < upgradeB.cost) return -1;
				return 0;
			});
		},
		refreshCount: function () {
			var self = window.Game;
			self.count.childNodes[0].nodeValue = Tools.beautify(Math.floor(self.volts)) + " volt" + (Math.floor(self.volts) > 1 ? "s" : "");
			self.vpsDisplay.childNodes[0].nodeValue = Tools.beautify(self._vps) + " volt" + (self._vps > 1 ? "s" : "") + "/second";
		},
	}
})(window);