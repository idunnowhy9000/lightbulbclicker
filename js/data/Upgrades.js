define(function () {
	return [
		// incandescent bulbs
		{
			name: 'Thomas Edison',
			cost: 100,
			description: 'Incandescent lightbulb are <strong>twice</strong> as efficient.<br><q>Sleeping is a waste of time.</q>',
			boost: [['incandescentlightbulb', 'x2']],
			displayAt: ['incandescentlightbulb', 1]
		},
		{
			name: 'Joseph Swan',
			cost: 400,
			description: 'Incandescent lightbulb are <strong>twice</strong> as efficient.',
			boost: [['incandescentlightbulb', 'x2']],
			displayAt: ['incandescentlightbulb', 10]
		},
		{
			name: 'Hiram Maxim',
			cost: 10000,
			description: 'Incandescent lightbulb are <strong>twice</strong> as efficient.<br><q>Sounds like a Harry Potter spell.</q>',
			boost: [['incandescentlightbulb', 'x2']],
			displayAt: ['incandescentlightbulb', 20]
		},
		{
			name: 'Blueprints',
			cost: 500000,
			description: 'Incandescent lightbulb are <strong>twice</strong> as efficient.<br><q>Cause we got blueprints!</q>',
			boost: [['incandescentlightbulb', 'x2']],
			displayAt: ['incandescentlightbulb', 40]
		},
		{
			name: 'Albert Einstein Clone',
			cost: 50000000,
			description: "Incandescent lightbulb are <strong>twice</strong> as efficient.<br><q>Hire a clone and he'll probably help you out!</q>",
			boost: [['incandescentlightbulb', 'x2']],
			displayAt: ['incandescentlightbulb', 80]
		},
		// bulb smasher
		{
			name: 'Experimentation Room',
			cost: 1000,
			description: 'Bulb smashers are <strong>twice</strong> as efficient.',
			boost: [['lightbulbsmasher', 'x2']],
			displayAt: ['lightbulbsmasher', 1]
		},
		{
			name: 'Big Hammer',
			cost: 3000,
			description: 'Bulb smashers are <strong>twice</strong> as efficient.',
			boost: ['lightbulbsmasher', 'x2'],
			displayAt: ['lightbulbsmasher', 10]
		},
		{
			name: 'Sludgehammer',
			cost: 5500,
			description: 'Bulb smashers are <strong>twice</strong> as efficient.',
			boost: ['lightbulbsmasher', 'x2'],
			displayAt: ['lightbulbsmasher', 25]
		},
		{
			name: 'Warhammer',
			cost: 125000,
			description: 'Bulb smashers are <strong>twice</strong> as efficient.',
			boost: ['lightbulbsmasher', 'x2'],
			displayAt: ['lightbulbsmasher', 50]
		},
		{
			name: 'Thor',
			cost: 725000,
			description: 'Bulb smashers are <strong>twice</strong> as efficient.',
			boost: ['lightbulbsmasher', 'x2'],
			displayAt: ['lightbulbsmasher', 100]
		},
		// thundercollector
		{
			name: 'Electron Relaxation',
			cost: 200000,
			description: 'Thunder Collectors are <strong>twice</strong> as efficient.',
			boost: [['thundercollector', 1]],
			displayAt: ['thundercollector', 1]
		},
		{
			name: 'Electron Excitation',
			description: 'Thunder Collectors are <strong>twice</strong> as efficient.<br><q>The ultimate Electric Party!</q>',
			cost: 225000,
			boost: [['thundercollector', 'x2']],
			displayAt: ['thundercollector', 10]
		},
		{
			name: 'Hotter than Lead',
			description: 'Thunder Collectors are <strong>twice</strong> as efficient.<br>',
			cost: 225000,
			boost: [['thundercollector', 'x2']],
			displayAt: ['thundercollector', 10]
		},
		{
			name: 'Zeus Worshippers',
			description: 'Thunder Collectors are <strong>twice</strong> as efficient.<br>',
			cost: 225000,
			boost: [['thundercollector', 'x2']],
			displayAt: ['thundercollector', 10]
		},
		{
			name: 'Zeus Angerers',
			description: 'Thunder Collectors are <strong>twice</strong> as efficient.<br>',
			cost: 225000,
			boost: [['thundercollector', 'x2']],
			displayAt: ['thundercollector', 10]
		},
		// bacterial
		{
			name: 'Fungus',
			description: "Bacterial Lightbulbs are <strong>twice</strong> as efficient.<br>",
			cost: 30000,
			boost: [['bacteriallightbulb', 3]],
			displayAt: ['bacteriallightbulb', 1]
		},
		{
			name: 'Salmonella',
			description: "Bacterial Lightbulbs are <strong>twice</strong> as efficient.<br>",
			cost: 30000,
			boost: [['bacteriallightbulb', 3]],
			displayAt: ['bacteriallightbulb', 1]
		},
		{
			name: 'Fusionbacteria',
			description: "Bacterial Lightbulbs are <strong>twice</strong> as efficient.<br>",
			cost: 30000,
			boost: [['bacteriallightbulb', 3]],
			displayAt: ['bacteriallightbulb', 1]
		},
		{
			name: 'Cyanidebacteria',
			description: "Bacterial Lightbulbs are <strong>twice</strong> as efficient.<br>",
			cost: 30000,
			boost: [['bacteriallightbulb', 3]],
			displayAt: ['bacteriallightbulb', 1]
		},
		{
			name: 'Happinessbacteria',
			description: "Bacterial Lightbulbs are <strong>twice</strong> as efficient.<br>",
			cost: 30000,
			boost: [['bacteriallightbulb', 3]],
			displayAt: ['bacteriallightbulb', 1]
		},
		// dinosaur
		{
			name: 'Jurrasic Quarks',
			cost: 100000,
			boost: [['dinosaurlightbulb', 9]],
			description: 'Dinosaur Lightbulbs are <strong>twice</strong> as efficient.<br><q>Still better than keys</q>',
			displayAt: ['dinosaurlightbulb', 1]
		},
		{
			name: 'Photinosaurus',
			cost: 100000,
			boost: [['dinosaurlightbulb', 'x2']],
			description: 'Dinosaur Lightbulbs are <strong>twice</strong> as efficient.<br><q>Still better than keys</q>',
			displayAt: ['dinosaurlightbulb', 1]
		},
		{
			name: 'Photonsaurus',
			cost: 100000,
			boost: [['dinosaurlightbulb', 'x2']],
			description: 'Dinosaur Lightbulbs are <strong>twice</strong> as efficient.<br><q>Still better than keys</q>',
			displayAt: ['dinosaurlightbulb', 1]
		},
		{
			name: 'Mega Dinobulbs',
			cost: 100000,
			boost: [['dinosaurlightbulb', 'x2']],
			description: 'Dinosaur Lightbulbs are <strong>twice</strong> as efficient.<br><q>Still better than keys</q>',
			displayAt: ['dinosaurlightbulb', 1]
		},
		{
			name: 'Unextinction Event',
			cost: 100000,
			boost: [['dinosaurlightbulb', 'x2']],
			description: 'Dinosaur Lightbulbs are <strong>twice</strong> as efficient.<br><q>Still better than keys</q>',
			displayAt: ['dinosaurlightbulb', 1]
		},
		// human
		{
			name: 'Evolution',
			cost: 40000,
			boost: [['humanlightbulb', 27]],
			description: 'Human Lightbulbs are <strong>twice</strong> as efficient.<br><q>Fun fact: The Greeks actually proposed the theory before Charles Darwin</q>',
			displayAt: ['humanlightbulb', 1]
		},
		{
			name: 'Worship',
			cost: 400000,
			boost: [['humanlightbulb', 'x2']],
			description: 'Human Lightbulbs are <strong>twice</strong> as efficient.<br><q>All God does is watch us and kill us when we get boring.</q>',
			displayAt: ['humanlightbulb', 10]
		},
		{
			name: 'Stone Tools',
			cost: 1234567,
			description: 'Human Lightbulbs are <strong>twice</strong> as efficient.<br><q></q>',
			boost: [['humanlightbulb', 'x2']],
			displayAt: ['humanlightbulb', 100]
		},
		{
			name: 'Iron Tools',
			cost: 9876543,
			description: 'Human Lightbulbs are <strong>twice</strong> as efficient.<br><q></q>',
			boost: [['humanlightbulb', 'x2']],
			displayAt: ['humanlightbulb', 200]
		},
		{
			name: 'Hi Tech',
			cost: 123456789,
			description: 'Human Lightbulbs are <strong>twice</strong> as efficient.<br><q></q>',
			boost: [['humanlightbulb', 'x2']],
			displayAt: ['humanlightbulb', 300]
		},
		{
			name:'Snowman',
			cost: 25252525252,
			description: "Human Lightbulbs are <strong>twice</strong> as efficient.<br><q>Just imagine how much cooler it'll be in summer!</q>",
			boost: [['humanlightbulb', 'x2']],
			displayAt: ['humanlightbulb', 320]
		},
		// evolve thingy
		{
			name: 'Bicycle',
			description: "Uses bicycle as main energy fuel.<br><q>mfw santa doesn't love me</q>",
			cost: 25,
			displayAt: ['level', 1]
		},
		{
			name: 'Lump of Charcoal',
			description: "Uses charcoal as main energy fuel.<br><q>mfw santa doesn't love me</q>",
			cost: 1000,
			displayAt: ['level', 25]
		},
		{
			name: 'Biomass',
			description: 'Uses biomass as main energy fuel.<br><q>Poop powered lightbulbs. Yep.</q>',
			cost: 10000,
			displayAt: ['level', 35]
		},
		{
			name: 'Generic Brand Power Generator',
			description: 'Uses a power generator as main energy fuel.<br><q>Totally trustworthy.</q>',
			cost: 100000,
			displayAt: ['level', 40]
		},
		{
			name: 'Wind Turbines',
			description: 'Uses wind turbines as main energy fuel.<br><q>You take my breath away.</q>',
			cost: 25000000,
			displayAt: ['level', 50]
		},
		{
			name: 'Wave Power',
			description: "Uses wave power as main energy fuel.<br><q>Tides goes in, tides comes out, you can't explain that</q>",
			cost: 51200000,
			displayAt: ['level', 75]
		},
		{
			name: 'Solar Power',
			description: 'Uses solar power as main energy fuel.<br><q>Solar Freaking POWER!</q>',
			cost: 8e12,
			displayAt: ['level', 88]
		},
		// boosts all
		{
			name: 'Diode',
			cost: 999999999,
			boost: [['all', 'x0.05']],
			displayAt: ['volts', 99999999]
		},
		{
			name: 'ShamWow Guy',
			cost: 9999999999,
			description: 'Hires the ShamWow Guy to advertise lightbulbs',
			boost: [['all', 'x0.05']],
			displayAt: ['volts', 999999999]
		},
		{
			name: 'Reddit BotBulb',
			cost: 99999999999,
			boost: [['all', 'x0.05']],
			displayAt: ['volts', 9999999999]
		},
		{
			name: 'Bulb Convention',
			cost: 9999999999999,
			boost: [['all', 'x0.05']],
			displayAt: ['volts', 99999999999]
		},
		{
			name: 'Lightbulb Warzone',
			cost: 99999999999999,
			boost: [['all', 'x0.05']],
			displayAt: ['volts', 999999999999]
		},
		// misc
		{
			name: 'Time Machine',
			description: 'Enables your factory to travel through time.',
			onBuy: function (Game) {
				Game.timeTravelAble = true;
			}
		},
		{
			name: 'Prism',
			cost: 99999999999,
			description: 'Converts photon particles into experience.',
			displayAt: ['volts', 999999999]
		},
		{
			name: 'Hyperspace Travelling Machine',
			description: 'Enables your factory to travel through hyperspace.',
			displayAt: ['volts', 99999999999],
			onBuy: function (Game) {
				Game.spaceTravelAble = true;
			}
		},
		{
			name: 'Star System',
			description: 'Enables you to create stars',
			displayAt: ['volts', 99999999999]
		},
		{
			name: 'Prestiege Mode',
			description: 'Enables generating prestiege upon soft-reset.',
			cost: 999999999999,
			displayAt: ['volts', 99999999999]
		}
	];
});