/*
* TODO: Make carriers and harvesters have a 1-1 relationship
* Prevent harvesters from going into enemy territories. (Check to see if there are available sources before spawning)
* Create new melee unit
* If there is more than one enemy in range of the ranged attacker, do mass attack
* Add a healer who pairs up with attackers
* Fix bug where attackers are too close to spawn so they stop productivity
*/

var harvesterFunction = require('harvester');
var attackerFunction = require('attacker');
var carrierFunction = require('carrier');
var spawnFunction = require('spawner');
var sourceFunction = require('source');
var harvesterBody = [WORK, MOVE];
var attackerBody = [MOVE,RANGED_ATTACK];
var carrierBody = [CARRY, MOVE];

Creep.prototype.areEnemiesNearby = function() 
{
    return this.pos.findInRange(FIND_HOSTILE_CREEPS, 75);
}


if (!(Memory.harvesterTicker)) {
    Memory.harvesterTicker = 0;
    Memory.attackerTicker = 0;
    Memory.carrierTicker = 0;
    Memory.ticker = 0;
    Memory.energyTracking = {};
    Memory.energyTracking.energyPerFive = 0;
    Memory.energyTracking.begEnergy = 0;
}


/* Handle screep deaths before anything */
for (var i in Memory.creeps) {
	if (!Game.creeps[i]) {
		if (Memory.creeps[i].role == 'harvester')
			harvesterFunction.death(Memory.creeps[i]);
		else if (Memory.creeps[i].role == 'attacker')
			attackerFunction.death(Memory.creeps[i]);
		else if (Memory.creeps[i].role == 'carrier')
			carrierFunction.death(Memory.creeps[i]);
		delete Memory.creeps[i];
	}
}



/* Look for sources in need of harvesters */
for (var roomName in Game.rooms) {
	var sourceList = Game.rooms[roomName].find(FIND_SOURCES_ACTIVE, {
		filter: function(possibleSource) {
			if (possibleSource.pos.findInRange(FIND_HOSTILE_CREEPS, 30).length > 0
			    || possibleSource.pos.findInRange(FIND_HOSTILE_STRUCTURES, 30).length > 0
			    || possibleSource.pos.findInRange(FIND_HOSTILE_SPAWNS, 30).length > 0) {
				console.log(possibleSource.id  + ' bad because of hostiles');
				return false;
			}
			else
			{
				if (sourceFunction.get_free_spots(possibleSource) > 0)
					return true;
				else {
					console.log(possibleSource.id + ' bad because of no free spots');
					return false;
				}
			}
		}});
	console.log('count' + sourceList.length);
	for (var spawn in Game.spawns) {
		var spawnInQuestion = Game.spawns[spawn];
		while (sourceList.length > 0) {
			var closeSource = spawnInQuestion.pos.findClosest(sourceList);
			sourceList.splice(sourceList.indexOf(closeSource), 1);

			while (sourceFunction.get_free_spots(closeSource) > 0) {
			var harvester = {
					'parts' : harvesterBody,
					'name'  : 'Harvester' + Memory.harvesterTicker++,
					'memory' : {
							'role' : 'harvester',
							'assignedSourceId' : closeSource.id,
							'carriers' : 0,
							'neededCarriers' : 
								Math.ceil(closeSource.pos.getRangeTo(spawnInQuestion) / 10)

						   }
					};

			spawnFunction.add_to_queue(spawnInQuestion, harvester, false);
			sourceFunction.add_harvester(closeSource);
			}

		}
	}
}

/* Loop logic: Look for harvesters without carriers */
for (var roomName in Game.rooms) {
	var harvesters = Game.rooms[roomName].find(FIND_MY_CREEPS, {
		filter: function(possibleHarvester) {
			if (possibleHarvester.spawning == false && 
					possibleHarvester.memory.carriers <
					possibleHarvester.memory.neededCarriers)
				return true;
			else
				return false;
		}});
	for (var i = 0; i < harvesters.length; ++i) {
		/* Look to see if there are any available carriers, first */
		var availableCarriers = Game.rooms[roomName].find(FIND_MY_CREEPS, {
			filter: function(possibleCarrier) {
				if (possibleCarrier.memory.role == 'carrier' &&
						possibleCarrier.memory.harvesterId == null)
					return true;
				else
					return false;
			}});
		if (availableCarriers.length > 0)
			availableCarriers[0].memory.harvesterId = harvesters[i].id;
		else {

			console.log('Looking into carrier for ' + harvesters[i].name);
			var carrier = {
					'parts' : carrierBody,
					'name'  : 'Carrier' + Memory.carrierTicker++,
					'memory': {
							'role' : 'carrier',
							'harvesterId' : harvesters[i].id
						  }
				      };
			spawnFunction.add_to_queue(harvesters[i].pos.findClosest(FIND_MY_SPAWNS), carrier, true);
			harvesters[i].memory.carriers++;
		}
	}


	/* Tally energy */
	if (Memory.ticker == 5)
	{
		var spawnList = Game.rooms[roomName].find(FIND_MY_SPAWNS);
		var totalEnergy = 0;
		for (var i = 0; i < spawnList.length; ++i) 
			totalEnergy += spawnList[i].energy;
		Memory.energyTracking.energyPerFive = (totalEnergy - Memory.energyTracking.begEnergy) / 5;
		Memory.energyTracking.begEnergy = totalEnergy;
		Memory.ticker = 0;
		console.log("ENERGY/5: " + Memory.energyTracking.energyPerFive);
	}
	Memory.ticker += 1;
}
    


for (var creep in Game.creeps) {
    var creepObject = Game.creeps[creep];
    if (Memory.creeps[creep].role == 'harvester')
        harvesterFunction.action(creepObject);
    else if (Memory.creeps[creep].role == 'attacker')
        attackerFunction.action(creepObject);
    else if (Memory.creeps[creep].role == 'carrier')
        carrierFunction.action(creepObject);
}
for (var spawnName in Game.spawns) {
	spawnFunction.produce_next_queue(Game.spawns[spawnName]);
}
