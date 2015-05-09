(function (Game) {
    "use strict";
    Game.upgradesD = [
        // incandescent bulbs
        {
            name: "Thomas Edison",
            cost: 100,
            boost: [["incandescentlightbulb", 0.1]],
            displayAt: ["incandescentlightbulb", 1]
        },
        {
            name: "Joseph Swan",
            cost: 400,
            boost: [["incandescentlightbulb", "x2"]],
            displayAt: ["incandescentlightbulb", 10]
        },
        {
            name: "Hiram Maxim",
            cost: 10000,
            boost: [["incandescentlightbulb", "x2"]],
            displayAt: ["incandescentlightbulb", 20]
        },
        {
            name: "Blueprints",
            cost: 500000,
            boost: [["incandescentlightbulb", "x2"]],
            displayAt: ["incandescentlightbulb", 40]
        },
        {
            name: "Albert Einstein Clone",
            cost: 50000000,
            description: "Hire a clone and he'll (probably) help you out!",
            boost: [["incandescentlightbulb", "x2"]],
            displayAt: ["incandescentlightbulb", 80]
        },
        // bulb smasher
        {
            name: "Experimentation Room",
            cost: 1000,
            boost: [["lightbulbsmasher", 0.3]],
            displayAt: ["lightbulbsmasher", 1]
        },
        {
            name: "Big Hammer",
            cost: 10000,
            boost: ["lightbulbsmasher", "x2"],
            displayAt: ["lightbulbsmasher", 10]
        },
        // thundercollector
        {
            name: "Electron Relaxation",
            cost: 5000,
            boost: [["thundercollector", 1]],
            displayAt: ["thundercollector", 1]
        },
        {
            name: "Electron Excitation",
            description: "The ultimate Electric Party!",
            cost: 500000,
            boost: [["thundercollector", "x2"]],
            displayAt: ["thundercollector", 10]
        },
        // bacterial
        {
            name: "Fungus",
            description: "I have to say, I'm a fungi!",
            cost: 30000,
            boost: [["bacteriallightbulb", 3]],
            displayAt: ["bacteriallightbulb", 1]
        },
        // dinosaur
        {
            name: "Mega DinoBulbs",
            cost: 100000,
            boost: [["dinosaurlightbulb", 9]],
            description: "Still better than keys",
            displayAt: ["dinosaurlightbulb", 1]
        },
        // human
        {
            name: "Evolution",
            cost: 400000,
            boost: [["humanlightbulb", 27]],
            description: "Fun fact: The Greeks actually proposed the theory before Charles Darwin",
            displayAt: ["humanlightbulb", 1]
        },
        {
            name: "Worship",
            cost: 400000000,
            boost: [["humanlightbulb", "x2"]],
            description: 'All God does is watch us and kill us when we get boring.',
            displayAt: ["humanlightbulb", 10]
        },
        {
            name: "Wooden Tools",
            cost: 4000000000,
            boost: [["humanlightbulb", "x2"]],
            displayAt: ["humanlightbulb", 50]
        },
        {
            name: "Stone Tools",
            cost: 2000000000,
            boost: [["humanlightbulb", "x2"]],
            displayAt: ["humanlightbulb", 100]
        },
        {
            name: "Iron Tools",
            cost: 30000000000,
            boost: [["humanlightbulb", "x2"]],
            displayAt: ["humanlightbulb", 200]
        },
        {
            name: "Gold Tools",
            cost: 40000000000000,
            boost: [["humanlightbulb", "x2"]],
            displayAt: ["humanlightbulb", 250]
        },
        {
            name: "Hi Tech",
            cost: 1500000000000000,
            boost: [["humanlightbulb", "x2"]],
            displayAt: ["humanlightbulb", 300]
        },
        {
            name:"Snowman",
            cost: 1225000000000000,
            description: "Just imagine how much cooler it'll be in summer!",
            boost: [["humanlightbulb", "x2"]],
            displayAt: ["humanlightbulb", 320]
        },
        // boosts all
        {
            name: "Diode",
            cost: 999999999,
            boost: [["all", "x0.05"]],
            displayAt: ["volts", 99999999]
        },
        {
            name: "ShamWow Guy",
            cost: 9999999999,
            description: "Revive the ShamWow Guy to advertise lightbulbs",
            boost: [["all", "x0.05"]],
            displayAt: ["volts", 999999999]
        },
        {
            name: "Reddit BotBulb",
            cost: 99999999999,
            boost: [["all", "x0.05"]],
            displayAt: ["volts", 9999999999]
        },
        {
            name: "Bulb Convention",
            cost: 9999999999999,
            boost: [["all", "x0.05"]],
            displayAt: ["volts", 99999999999]
        },
        {
            name: "Lightbulb Warzone",
            cost: 99999999999999,
            boost: [["all", "x0.05"]],
            displayAt: ["volts", 999999999999]
        },
        // misc
        {
            name: "Time Machine",
            description: "Enables your factory to travel through time.",
            onBuy: function (Game) {
                Game.timeTravelAble = true;
            }
        },
        {
            name: "Prism",
            cost: 99999999999,
            description: "Converts photon particles into experience.",
            displayAt: ["volts", 999999999]
        },
        {
            name: "Hyperspace Travelling Machine",
            description: "Enables your factory to travel through hyperspace.",
            onBuy: function (Game) {
                Game.spaceTravelAble = true;
            }
        },
        {
            name: "Star System",
            description: "Enables you to create stars",
        },
        {
            name: "Prestiege Mode",
            description: "Enables generating prestiege upon soft-reset.",
            cost: 999999999999,
            displayAt: ["volts", 99999999999]
        },
        // evolve thingy
        {
            name: "Wooden Gas",
            description: "Uses wooden gas as main energy fueller",
        },
        {
            name: "Biomass",
            description: "Uses biomass as main energy fueller",
        },
        {
            name: "Power Generator",
            description: "Uses a power generator as main energy fueller",
        },
        {
            name: "Wind Turbines",
            description: "Uses wind turbines as main energy fueller",
        },
        {
            name: "Wave Power",
            description: "Uses wave power as main energy fueller",
        },
        {
            name: "Solar Power",
            description: "Uses solar power as main energy fueller",
        },
    ];
})(window.Game || {});