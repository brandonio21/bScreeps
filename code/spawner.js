var cost = require('cost');
module.exports = 
{
	initialize_queue: function(spawn) {
		if (Memory.spawns[spawn.name] == undefined)
			Memory.spawns[spawn.name] = {};
		if (Memory.spawns[spawn.name].queue == undefined)
			Memory.spawns[spawn.name].queue = [];
	},

	add_to_queue: function(spawn, item, prioritize) {
		this.initialize_queue(spawn);

		if (prioritize)
			Memory.spawns[spawn.name].queue.unshift(item);
		else
			Memory.spawns[spawn.name].queue.push(item);

	},

	produce_next_queue: function(spawn) {
		this.initialize_queue(spawn);
		console.log('queue: ' + Memory.spawns[spawn.name].queue.length);
			

		if (Memory.spawns[spawn.name].queue.length <= 0)
			return;

		var thingToSpawn = Memory.spawns[spawn.name].queue[0];
		console.log('producing: ' + thingToSpawn.name);
		if (spawn.canCreateCreep(thingToSpawn.parts) == 0) {
			console.log(' canproducing: ' + thingToSpawn.memory.role);
			spawn.createCreep(thingToSpawn.parts, 
				thingToSpawn.name, thingToSpawn.memory);
			var usedEnergy = cost.getCost(thingToSpawn.parts);
			Memory.spawns[spawn.name].queue.shift();
			Memory.energyTracking.outcome += usedEnergy;
		}
	}
}
