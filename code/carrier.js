/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('carrier'); // -> 'a thing'
 */
 module.exports = {
	 action: function(creep)
	 {
	     if (creep.carry.energy >= creep.carryCapacity)
	     {
		 console.log(creep.name + " is full! returning to base");
		// Move back to base!
		var spawnLoc = creep.pos.findClosest(FIND_MY_SPAWNS);
		creep.moveTo(spawnLoc);
		var energy = creep.carry.energy;
		creep.transferEnergy(spawnLoc);
		Memory.energyTracking.income += energy;
		
	     }
	     else
	     {
		 if (creep.memory.harvesterId != null 
		    && Game.getObjectById(creep.memory.harvesterId) != null)
		 {
		     var harvester = Game.getObjectById(creep.memory.harvesterId);
		     console.log(creep.name + " is responsible for " + harvester.name);
		     if (!creep.pos.isNearTo(harvester))
			creep.moveTo(harvester);
		    else
		    {
			var closestDroppedEnergy = creep.pos.findClosest(FIND_DROPPED_ENERGY, {maxOps: 100});
			if (closestDroppedEnergy)
			{
			    creep.pickup(closestDroppedEnergy);
			    creep.moveTo(closestDroppedEnergy);
			}
		    }
		 }
		 else
		 {
		     // This carrier is not assigned a harvester or
		     // its harvester died. Use it as a "garbage cleaner"
			creep.memory.harvesterId = null;
		      var closestDroppedEnergy = creep.pos.findClosest(FIND_DROPPED_ENERGY, {maxOps: 300});
			if (closestDroppedEnergy)
			{
			    creep.pickup(closestDroppedEnergy);
			    creep.moveTo(closestDroppedEnergy);
			}
		 }
	     }
	 },

	 death: function(creepMemoryChunk) {
		var harvesterId = creepMemoryChunk.harvesterId;
		var associatedHarvester = Game.getObjectById(harvesterId);
		if (associatedHarvester)
			Memory.creeps[associatedHarvester.name].carriers--;
	 }
 };
