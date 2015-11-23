define(['underscore'], function (_) {
	
	var Calculator = function (Game) {
		this.game = Game;
	};
	
	var CProto = Calculator.prototype;
	
	CProto.calcCost = function (cost, amount, increase) {
		increase = increase || 1.1;
		return Math.round(cost * Math.pow(increase, amount));
	};
	
	CProto.calcBdVPS = function (building) {
		
	};
	
	return Calculator;
	
});