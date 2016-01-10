define(function () {
	return [
		// incandescent bulbs
		{
			name: 'Thomas Edison',
			cost: 100,
			description: 'Incandescent lightbulb gain <strong>+0.1</strong> base VPS.<br><q>1% percent inspiration, 99% perspriation.</q>',
			boost: ['incandescentlightbulb', 0.1],
			displayAt: ['incandescentlightbulb', 1]
		},
		{
			name: 'Joseph Swan',
			cost: 1000,
			description: 'Incandescent lightbulb are <strong>twice</strong> as efficient.<q>Nice guy, long beard.</q>',
			boost: ['incandescentlightbulb', 'x2'],
			displayAt: ['incandescentlightbulb', 10]
		},
		{
			name: 'Hiram Maxim',
			cost: 100000,
			description: 'Incandescent lightbulb are <strong>twice</strong> as efficient.<br><q>Sounds like a Harry Potter spell.</q>',
			boost: ['incandescentlightbulb', 'x2'],
			displayAt: ['incandescentlightbulb', 50]
		},
		{
			name: 'Patents',
			cost: 5000000,
			description: 'Incandescent lightbulb are <strong>twice</strong> as efficient.<br><q>PATENT ALL THE THINGS!</q>',
			boost: ['incandescentlightbulb', 'x2'],
			displayAt: ['incandescentlightbulb', 100]
		},
		{
			name: 'Albert Einstein Clone',
			cost: 50000000,
			description: "Incandescent lightbulb are <strong>twice</strong> as efficient.<br><q>Hire a clone and he'll probably help you out!</q>",
			boost: ['incandescentlightbulb', 'x2'],
			displayAt: ['incandescentlightbulb', 250]
		},
		// bulb smasher
		{
			name: 'Experimentation Room',
			cost: 1000,
			description: "Bulb smashers gain <strong>+0.5</strong> base VPS.<q>Put on your goggles, prepare your muscles.</q>",
			boost: ['lightbulbsmasher', 0.5],
			displayAt: ['lightbulbsmasher', 1]
		},
		{
			name: 'Big Hammer',
			cost: 50000,
			description: 'Bulb smashers are <strong>twice</strong> as efficient.<q>Probably not a sexual innuendo.</q>',
			boost: ['lightbulbsmasher', 'x2'],
			displayAt: ['lightbulbsmasher', 10]
		},
		{
			name: 'Sludgehammer',
			cost: 550000,
			description: 'Bulb smashers are <strong>twice</strong> as efficient.<q>Stickiest weapon on Earth.</q>',
			boost: ['lightbulbsmasher', 'x2'],
			displayAt: ['lightbulbsmasher', 50]
		},
		{
			name: 'Warhammer',
			cost: 12500000,
			description: 'Bulb smashers are <strong>twice</strong> as efficient.<q>Is this Sparta?</q>',
			boost: ['lightbulbsmasher', 'x2'],
			displayAt: ['lightbulbsmasher', 100]
		},
		{
			name: 'Thor',
			cost: 725000000,
			description: 'Bulb smashers are <strong>twice</strong> as efficient.<q>The Key to Valhalla.</q>',
			boost: ['lightbulbsmasher', 'x2'],
			displayAt: ['lightbulbsmasher', 250]
		},
		// thundercollector
		{
			name: 'Electric Panel',
			cost: 5000,
			description: 'Thunder Collectors gain <strong>+2</strong> base VPS.<q>Ahh, much more better!</q>',
			boost: ['thundercollector', 2],
			displayAt: ['thundercollector', 1]
		},
		{
			name: 'Plasma Ball',
			description: 'Thunder Collectors are <strong>twice</strong> as efficient.<br><q>The ultimate Electric Party!</q>',
			cost: 50000,
			boost: ['thundercollector', 'x2'],
			displayAt: ['thundercollector', 10]
		},
		{
			name: 'Hotter than Lead',
			description: 'Thunder Collectors are <strong>twice</strong> as efficient.<br><q>But not hotter than Venus.</q>',
			cost: 100000,
			boost: ['thundercollector', 'x2'],
			displayAt: ['thundercollector', 50]
		},
		{
			name: 'Zeus Worshippers',
			description: 'Thunder Collectors are <strong>twice</strong> as efficient.<br><q>Actually raised by a goat.</q>',
			cost: 5500000,
			boost: ['thundercollector', 'x2'],
			displayAt: ['thundercollector', 100]
		},
		{
			name: 'Zeus Angerers',
			description: "Thunder Collectors are <strong>twice</strong> as efficient.<br><q>Let's just worship Uranus.</q>",
			cost: 10000000,
			boost: ['thundercollector', 'x2'],
			displayAt: ['thundercollector', 250]
		},
		// halogen
		{
			name: 'Pressure container',
			cost: 5000,
			description: 'Halogen Lightbulbs gain <strong>+2</strong> base VPS.<q>Ahh, much more better!</q>',
			boost: ['halogenlightbulb', 5],
			displayAt: ['halogenlightbulb', 1]
		},
		{
			name: 'Chlorine Lightbulb',
			cost: 10000,
			description: 'Halogen Lightbulbs are <strong>twice</strong> as efficient.<q>Ahh, much more better!</q>',
			boost: ['halogenlightbulb', 'x2'],
			displayAt: ['halogenlightbulb', 10]
		},
		{
			name: 'Hydrocarbon Bromine compounds',
			cost: 255000,
			description: 'Halogen Lightbulbs are <strong>twice</strong> as efficient.<q>Ahh, much more better!</q>',
			boost: ['halogenlightbulb', 'x2'],
			displayAt: ['halogenlightbulb', 50]
		},
		{
			name: 'Krypton Gas',
			cost: 5000000,
			description: 'Halogen Lightbulbs are <strong>twice</strong> as efficient.<q>Ahh, much more better!</q>',
			boost: ['halogenlightbulb', 'x2'],
			displayAt: ['halogenlightbulb', 100]
		},
		{
			name: 'Xenon Gas',
			cost: 50000000,
			description: 'Halogen Lightbulbs are <strong>twice</strong> as efficient.<q>Ahh, much more better!</q>',
			boost: ['halogenlightbulb', 'x2'],
			displayAt: ['halogenlightbulb', 250]
		},
		// tan
		{
			name: 'Ultraviolet Radiator',
			cost: 31415,
			description: 'Tan Lightbulbs gain <strong>+30</strong> base VPS.<q>Ahh, much more better!</q>',
			boost: ['tanlightbulb', 30],
			displayAt: ['tanlightbulb', 1]
		},
		{
			name: 'Sunscreen lotion',
			cost: 173205,
			description: 'Tan Lightbulbs are <strong>twice</strong> as efficient.<q>Ahh, much more better!</q>',
			boost: ['tanlightbulb', 'x2'],
			displayAt: ['tanlightbulb', 10]
		},
		{
			name: 'Vitamin D Producer',
			cost: 1414213,
			description: 'Tan Lightbulbs are <strong>twice</strong> as efficient.<q>Ahh, much more better!</q>',
			boost: ['tanlightbulb', 'x2'],
			displayAt: ['tanlightbulb', 50]
		},
		{
			name: 'Cancer Protection Radiator',
			cost: 22360679,
			description: 'Tan Lightbulbs are <strong>twice</strong> as efficient.<q>Ahh, much more better!</q>',
			boost: ['tanlightbulb', 'x2'],
			displayAt: ['tanlightbulb', 100]
		},
		{
			name: 'Melanin Maker',
			cost: 360555127,
			description: 'Tan Lightbulbs are <strong>twice</strong> as efficient.<q>Ahh, much more better!</q>',
			boost: ['tanlightbulb', 'x2'],
			displayAt: ['tanlightbulb', 250]
		},
		// led
		{
			name: 'LED Diodes',
			cost: 50000,
			description: 'LED Lightbulbs gain <strong>+100</strong> base VPS.<q>Ahh, much more better!</q>',
			boost: ['ledlightbulb', 100],
			displayAt: ['ledlightbulb', 1]
		},
		{
			name: 'Glowstick',
			cost: 200000,
			description: 'LED Lightbulbs are <strong>twice</strong> as efficient.<q>Ahh, much more better!</q>',
			boost: ['ledlightbulb', 'x2'],
			displayAt: ['ledlightbulb', 10]
		},
		{
			name: 'LED Monitor',
			cost: 3000000,
			description: 'LED Lightbulbs are <strong>twice</strong> as efficient.<q>Ahh, much more better!</q>',
			boost: ['ledlightbulb', 'x2'],
			displayAt: ['ledlightbulb', 50]
		},
		{
			name: 'Superdisplay',
			cost: 50000000,
			description: 'LED Lightbulbs are <strong>twice</strong> as efficient.<q>Ahh, much more better!</q>',
			boost: ['ledlightbulb', 'x2'],
			displayAt: ['ledlightbulb', 100]
		},
		{
			name: 'Lifi',
			cost: 800000000,
			description: 'LED Lightbulbs are <strong>twice</strong> as efficient.<q>Ahh, much more better!</q>',
			boost: ['ledlightbulb', 'x2'],
			displayAt: ['ledlightbulb', 250]
		},
		// bacterial
		{
			name: 'Fungus',
			description: "Bacterial Lightbulbs gain <strong>+400</strong> base VPS.<br><q>I have to say, I'm quite a fungi!</q>",
			cost: 100000,
			boost: ['bacteriallightbulb', 400],
			displayAt: ['bacteriallightbulb', 1]
		},
		{
			name: 'Salmonella',
			description: "Bacterial Lightbulbs are <strong>twice</strong> as efficient.<br><q>Lightbulbs, I salmon thee.</q>",
			cost: 9500000,
			boost: ['bacteriallightbulb', 'x2'],
			displayAt: ['bacteriallightbulb', 10]
		},
		{
			name: 'Cellular division',
			description: "Bacterial Lightbulbs are <strong>twice</strong> as efficient.<br><q>The telomeres man, they limit everything!</q>",
			cost: 12000000,
			boost: ['bacteriallightbulb', 'x2'],
			displayAt: ['bacteriallightbulb', 50]
		},
		{
			name: 'Cyanidebacteria',
			description: "Bacterial Lightbulbs are <strong>twice</strong> as efficient.<br><q>The bluestuff, man!<br><strong>WE NEED THE BLUE STUFF</strong></q>",
			cost: 150000000,
			boost: ['bacteriallightbulb', 'x2'],
			displayAt: ['bacteriallightbulb', 100]
		},
		{
			name: 'Happinessbacteria',
			description: "Bacterial Lightbulbs are <strong>twice</strong> as efficient.<br>",
			cost: 3000000000,
			boost: ['bacteriallightbulb', 'x2'],
			displayAt: ['bacteriallightbulb', 250]
		},
		// dinosaur
		{
			name: 'Jurrasic Quarks',
			cost: 161803,
			boost: ['dinosaurlightbulb', 800],
			description: 'Dinosaur Lightbulbs gain <strong>+800</strong> base VPS.<br><q>The essential element of matter, now in dinosaur form</q>',
			displayAt: ['dinosaurlightbulb', 1]
		},
		{
			name: 'Photinosaurus',
			cost: 2000000,
			boost: ['dinosaurlightbulb', 'x2'],
			description: "Dinosaur Lightbulbs are <strong>twice</strong> as efficient.<br><q>There's no tino!</q>",
			displayAt: ['dinosaurlightbulb', 10]
		},
		{
			name: 'Photonsaurus',
			cost: 50000000,
			boost: ['dinosaurlightbulb', 'x2'],
			description: "Dinosaur Lightbulbs are <strong>twice</strong> as efficient.<br><q>You could quantize my electromagnetic waves goodbye.</q>",
			displayAt: ['dinosaurlightbulb', 50]
		},
		{
			name: 'Mega Dinobulbs',
			cost: 100000000,
			boost: ['dinosaurlightbulb', 'x2'],
			description: 'Dinosaur Lightbulbs are <strong>twice</strong> as efficient.<br><q>Still better than keys</q>',
			displayAt: ['dinosaurlightbulb', 100]
		},
		{
			name: 'Unextinction Event',
			cost: 1000000000,
			boost: ['dinosaurlightbulb', 'x2'],
			description: 'Dinosaur Lightbulbs are <strong>twice</strong> as efficient.<br><q>Meteor?! What meteor?</q>',
			displayAt: ['dinosaurlightbulb', 250]
		},
		// human
		{
			name: 'Evolution',
			cost: 300000000,
			boost: ['humanlightbulb', 1500],
			description: 'Human Lightbulbs gain <strong>+1500</strong> base VPS.<br><q>The Greeks proposed the theory before Charles Darwin</q>',
			displayAt: ['humanlightbulb', 1]
		},
		{
			name: 'Worship',
			cost: 4000000000,
			boost: ['humanlightbulb', 'x2'],
			description: 'Human Lightbulbs are <strong>twice</strong> as efficient.<br><q>All God does is watch us and kill us when we get boring.</q>',
			displayAt: ['humanlightbulb', 10]
		},
		{
			name: 'Stone Tools',
			cost: 12345678900,
			description: 'Human Lightbulbs are <strong>twice</strong> as efficient.<br><q>Totally stoned, dude.</q>',
			boost: ['humanlightbulb', 'x2'],
			displayAt: ['humanlightbulb', 50]
		},
		{
			name: 'Iron Tools',
			cost: 98765432100,
			description: 'Human Lightbulbs are <strong>twice</strong> as efficient.<br><q>One small step for a man.</q>',
			boost: ['humanlightbulb', 'x2'],
			displayAt: ['humanlightbulb', 100]
		},
		{
			name: 'Hi Tech',
			cost: 999999999999,
			description: 'Human Lightbulbs are <strong>twice</strong> as efficient.<br><q>A big leap for mankind.</q>',
			boost: ['humanlightbulb', 'x2'],
			displayAt: ['humanlightbulb', 250]
		},
		// level evolution
		{
			name: 'Cranking Power',
			description: "Buildings produce <strong>+1%</strong> levels per second.<br><q>Hands are better than feets.</q>",
			cost: 25,
			boost: ['expps', 0.01],
			displayAt: ['level', 1]
		},
		{
			name: 'Bicycle',
			description: "Buildings produce <strong>+5%</strong> levels per second.<br><q>Or are they?! <strong>*dramatic music*</strong></q>",
			cost: 100,
			boost: ['expps', 0.05],
			displayAt: ['level', 15]
		},
		{
			name: 'Lump of Charcoal',
			description: "Buildings produce <strong>+10%</strong> levels per second.<br><q>mfw santa doesn't love me</q>",
			cost: 1000,
			boost: ['expps', 0.1],
			displayAt: ['level', 25]
		},
		{
			name: 'Biomass',
			description: 'Buildings produce <strong>+25%</strong> levels per second.<br><q>Poop powered lightbulbs. Yep.</q>',
			cost: 10000,
			boost: ['expps', 0.25],
			displayAt: ['level', 35]
		},
		{
			name: 'Generic Brand Power Generator',
			description: 'Buildings produce <strong>+50%</strong> levels per second.<br><q>Totally trustworthy.</q>',
			cost: 100000,
			boost: ['expps', 0.5],
			displayAt: ['level', 45]
		},
		{
			name: 'Wind Turbines',
			description: 'Buildings produce <strong>+60%</strong> levels per second.<br><q>You take my breath away.</q>',
			cost: 25000000,
			boost: ['expps', 0.6],
			displayAt: ['level', 55]
		},
		{
			name: 'Wave Power',
			description: "Buildings produce <strong>+75%</strong> levels per second.<br><q>Tides goes in, tides comes out, you can't explain that</q>",
			cost: 51200000,
			boost: ['expps', 0.75],
			displayAt: ['level', 75]
		},
		{
			name: 'Solar Power',
			description: 'Buildings produce <strong>+95%</strong> levels per second.<br><q>SolarCity, coming soon.</q>',
			cost: 102400000,
			boost: ['expps', 0.95],
			displayAt: ['level', 85]
		},
		// levels
		{
			name: 'Open the Gate of Experience',
			cost: 12800,
			description: "Volts per seconds are <strong>5%</strong> efficient per levels.<q>Powerful spirits shall be with you, for those who dare shall open this gate.</q>",
			boost: ['level', 0.05],
			displayAt: ['level', 5]
		},
		{
			name: 'Experience Scrolls',
			cost: 256000,
			description: "Volts per seconds are <strong>10%</strong> efficient per levels.<q>Contains the knowledge of the ancient light waves researchers</q>",
			boost: ['level', 0.1],
			displayAt: ['level', 15]
		},
		{
			name: 'Quantum Leaper',
			cost: 5120000,
			description: "Volts per seconds are <strong>15%</strong> efficient per levels.<q>Harnest the energy of an electron leaping in a hydrogen atom</q>",
			boost: ['level', 0.15],
			displayAt: ['level', 25]
		},
		{
			name: 'Experience Vortex',
			cost: 10240000,
			description: "Volts per seconds are <strong>20%</strong> efficient per levels.<q>A swirling electromagnetic energy field, converting experience into photons.</q>",
			boost: ['level', 0.2],
			displayAt: ['level', 35]
		},
		{
			name: 'Level Conversion Unit',
			cost: 204800000,
			description: "Volts per seconds are <strong>25%</strong> efficient per levels.<q>Highly technical machinery, created from a experience vortex and 10 quantum computers.</q>",
			boost: ['level', 0.25],
			displayAt: ['level', 45]
		},
		{
			name: 'E=mc2 Converter',
			cost: 4096000000,
			description: "Volts per seconds are <strong>50%</strong> efficient per levels.<q>Suprisingly complicated conversion machinery involving angular momentum and snake venoms.</q>",
			boost: ['level', 0.5],
			displayAt: ['level', 55]
		},
		{
			name: 'Energy State Manipulator',
			cost: 81920000000,
			description: "Volts per seconds are <strong>75%</strong> efficient per levels.<q>[filler description]</q>",
			boost: ['level', 0.75],
			displayAt: ['level', 75]
		},
		{
			name: 'Energy State Manipulator',
			cost: 163840000000,
			description: "Volts per seconds are <strong>100%</strong> efficient per levels.<q>[filler description]</q>",
			boost: ['level', 1],
			displayAt: ['level', 100]
		},
		// clicks
		{
			name:'Let there be light',
			cost: 150,
			description: "The mouse gains <strong>+1</strong> volts per clicks.<br><q>And then, there was light.</q>",
			boost: ['click', 1],
			displayAt: ['click', 10]
		},
		{
			name:'Taoism',
			cost: 500,
			description: "The mouse is <strong>twice</strong> as efficient.<br><q>Two heads are better than one.</q>",
			boost: ['click', 'x2'],
			displayAt: ['click', 100]
		},
		{
			name:'Radiator',
			cost: 1000,
			description: "The mouse is <strong>twice</strong> as efficient.<br><q>[filler description]</q>",
			boost: ['click', 'x2'],
			displayAt: ['click', 250]
		},
		{
			name:'Shining Finger',
			cost: 5000,
			description: "The mouse is <strong>twice</strong> as efficient.<br><q>What do you mean it's from Gundam?</q>",
			boost: ['click', 'x2'],
			displayAt: ['click', 500]
		},
		{
			name:'Voltswaggen',
			cost: 10000,
			description: "The mouse is <strong>twice</strong> as efficient.<br><q>Headlights works at lightspeed, right?</q>",
			boost: ['click', 'x2'],
			displayAt: ['click', 1000]
		},
		{
			name:'Photino Collectors',
			cost: 150000,
			description: "The mouse is <strong>twice</strong> as efficient.<br><q>Aren't even real particles.</q>",
			boost: ['click', 'x2'],
			displayAt: ['click', 2000]
		},
		{
			name:'Photon Collectors',
			cost: 5000000,
			description: "The mouse gains <strong>+0.1</strong> volts per building owned.<br><q>[filler description]</q>",
			boost: ['click', 'building', 0.1],
			displayAt: ['click', 5000]
		},
		{
			name:'Cosmic Microwave Collector',
			cost: 13813000,
			description: "The mouse gains <strong>+0.5</strong> volts per building owned.<br><q>[filler description]</q>",
			boost: ['click', 'building', 0.5],
			displayAt: ['click', 20000]
		},
		{
			name:'Planck Length Observer',
			cost: 200000000,
			description: "The mouse gains <strong>+5</strong> volts per building owned.<br><q>Any observations smaller than this will not make sense.<br>You have been warned.</q>",
			boost: ['click', 'building', 5],
			displayAt: ['click', 500000]
		},
		{
			name:'Supertasking Clicks',
			cost: 2500000000,
			description: "The mouse gains <strong>+50</strong> volts per building owned.<br><q>Infinite clicks in finite seconds.<br>possibly.</q>",
			boost: ['click', 'building', 150],
			displayAt: ['click', 1500000]
		},
		{
			name:'Lightspeed Manipulator',
			cost: 50000000000,
			description: "The mouse gains <strong>+100</strong> volts per building owned.<br><q>Yeah, and our dark matter engines are 200% efficient.</q>",
			boost: ['click', 'building', 100],
			displayAt: ['click', 2500000]
		},
		
	];
});