

module.exports = {

	getCost: function(parts) {
		var totalCost = 0;
		var costDictionary = new Array();
		costDictionary[MOVE] = 50;
		costDictionary[WORK] = 100;
		costDictionary[CARRY] = 50;
		costDictionary[ATTACK] = 80;
		costDictionary[RANGED_ATTACK] = 150;
		costDictionary[HEAL] = 250;
		costDictionary[TOUGH] = 10;

		for (var i = 0; i < parts.length; ++i)
			totalCost += costDictionary[parts[i]];
		
		return totalCost;
	}


};
