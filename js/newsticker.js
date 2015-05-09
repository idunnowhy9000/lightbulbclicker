/*************************************************
* Lightbulb Clicker's upgrade script file
* Controls drawing/accessing the news
*************************************************/
(function (Game) {
    var NewsTicker = {
        tickerAge: 0,
        ticker: '',
        tickerN: 0,
        getNews: function () {
            var list = [];
            if (Game.TickerN % 2 == 0 || Game.cookiesEarned >= 10100000000) {
                if (Game.buildings['incandescentlightbulb'].amount > 0) list.push(Game.choose([
                    'Incandescent lightbulbs are being washed away from supermarkets.',
                    'Your power generation room is getting hot',
                    'People are considering to donate cooling incandescent bulbs'
                ]));
                if (Game.buildings['lightbulbsmasher'].amount > 0) list.push(Game.choose([
                    'Analyses shows the bulb smashers are stronger than ice',
                    'We came<sig>The Smashers</sig>',
                    'The Smashers biggest hit are being broadcast on television today.',
                    'We\'re gonna rekt it<sig>The Smashers</sig>',
                    'NEWS: The Smashers are now the number one band'
                ]));
                if (Game.buildings['thundercollector'].amount > 0) list.push(Game.choose([
                    'NEWS: Bug in a thunder collector caused ' + Math.floor(Math.random() * 1000 + 2) + ' controllers died.',
                    'NEWS: ' + Math.floor(Math.random() * 1000 + 2) + ' thunder collector controllers shocked to the hospital.',
                    'NEWS: Volts collected by thunder collectors are 20% more powerful'
                ]));
                if (Game.buildings['halogenlightbulb'].amount > 0) list.push(Game.choose([
                    'PSA: Stay away from ' + Game.factName || "your factory" + ' as they contain halogen radiation',
                    'NEWS: ' + Math.floor(Math.random() * 1000 + 2) + ' childrens died near halogen radition from ' + Game.factName || "your factory",
                    'UV radiation from Halogen bulbs almost burned the factory.'
                ]));
                if (Game.buildings['tanlightbulb'].amount > 0) list.push(Game.choose([
                    'PSA: Wear sunscreen before going to ' + Game.factName || "your factory",
                    'NEWS: ' + Math.floor(Math.random() * 1000 + 2) + ' childrens burned near tan bulbs'
                ]));
                if (Game.buildings['ledlightbulb'].amount > 0) list.push(Game.choose([
                    'Your factory is now colorfuller than ever.',
                    'WOAH....<sig>The Citizens</sig>'
                ]));
                if (Game.buildings['bacteriallightbulb'].amount > 0) list.push(Game.choose([
                    'Your factory is now colorfuller than ever.',
                    'WOAH....<sig>The Citizens</sig>'
                ]));
                
                if (Game.cookiesEarned >= 10000) list.push(
                    'NEWS: ' + Game.choose([
                        'new movie starring the creator of ' + Game.factName || "your factory",
                        'new book about ' + Game.factName || "your factory" + ': "Bulbs: The story on how a man dreamed of success."',
                        Game.factName || "your factory" + ' is more popular than ' + Game.choose(['cheese','Instagram','television dramas','video games','rap music','pie charts','butts']),
                    ]),
                    'New TV show starring the creator of ' + Game.factName || "your factory" + ', all about The Smashers'
                );
            }
            if (list.length == 0) {
                if (Game.voltsTotAll < 1) list.push('You are a mechanic, you work for Harvour\'s electric factory.');
                else if (Game.voltsTotAll < 2) list.push('Your bright idea for a new power source has emerged, using lightbulbs to generate power.');
                else if (Game.voltsTotAll < 3) list.push('Your boss has denied your idea, saying, "That\'s not possible, and it never will"');
                else if (Game.voltsTotAll < 4) list.push('You feel sad, however you won\'t give up.');
                else if (Game.voltsTotAll < 5) list.push('You spin your bicycle wheels to generate power. Your adventure begins.');
                else if (Game.voltsTotAll < 50) list.push('You have enough energy to charge your own phone.');
                else if (Game.voltsTotAll < 100) list.push('Your house is now using your energy.');
                else if (Game.voltsTotAll < 500) list.push('Your local coffee shop is paying to use your energy.');
                else if (Game.voltsTotAll < 1000) list.push('The whole neighborhood is paying to use your energy.');
                else if (Game.voltsTotAll < 3000) list.push('People from miles around are paying to use your energy.');
                else if (Game.voltsTotAll < 6000) list.push('Paris travellers are paying to use your energy.');
                else if (Game.voltsTotAll < 10000) list.push('You\'ve open your official company!');
                else if (Game.voltsTotAll < 20000) list.push('Your company now owns a website!');
                else if (Game.voltsTotAll < 30000) list.push('Distant countries are paying for your power.');
                else if (Game.voltsTotAll < 40000) list.push('Your company now starts growing, 100 employees a day.');
                else if (Game.voltsTotAll < 60000) list.push('Your company has been expanded!');
                else if (Game.voltsTotAll < 80000) list.push('Harvour\'s electric factory has been closed. Take that old boss!');
                else if (Game.voltsTotAll < 100000) list.push('Your company is in The Museum of Science and Industry!');
                 else if (Game.cookiesEarned < 10100000000) list.push('i hope you\'re not hospitalized... or died.');
            }
            //else if (Game.voltsTotAll < 200000) list.push('');
            this.tickerAge = Game.fps * 10;
            this.ticker = Game.choose(list);
            this.tickerN++;
        },
    }
})(window.Game || {});