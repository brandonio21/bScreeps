

module.exports = {

	get_energy_capacity: function(room) {
		var totalEnergyCapacity = 0;
		var energyHolderList = 
			room.find(FIND_MY_SPAWNS).concat(room.find(FIND_MY_STRUCTURES, {
				filter: function(possibleStructure) {
					return (possibleStructure.structureType == STRUCTURE_EXTENSION ||
					    possibleStructure.structureType == STRUCTURE_LINK);
				}}));
		for (var i = 0; i < energyHolderList.length; i++)
			totalEnergyCapacity += energyHolderList[i].energyCapacity;

		return totalEnergyCapacity;
	},

	get_total_energy: function(room) {
		var totalEnergyy = 0;
		var energyHolderList = 
			room.find(FIND_MY_SPAWNS).concat(room.find(FIND_MY_STRUCTURES, {
				filter: function(possibleStructure) {
					return (possibleStructure.structureType == STRUCTURE_EXTENSION ||
					    possibleStructure.structureType == STRUCTURE_LINK);
				}}));
		for (var i = 0; i < energyHolderList.length; i++)
			totalEnergy += energyHolderList[i].energy;

		return totalEnergy;
	}


}
