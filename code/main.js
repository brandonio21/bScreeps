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
}



for (var roomName in Game.rooms)
{
    for (var spawnName in Game.spawns)
    {
        var spawnInitiated = false;
        
        // Check to see if there are any allies in distress
        var creepList = Game.rooms[roomName].find(FIND_MY_CREEPS);
        var enemiesNear = false;
        for (var i = 0; i < creepList.length; ++i)
        {
            if (creepList[i].areEnemiesNearby()) {
                console.log("ENEMIES NEAR");
                enemiesNear = true;
                break;
            }
                
        }
        if (enemiesNear) {
             // We need to spawn an attacker 
            if (Game.spawns[spawnName].canCreateCreep(attackerBody) == 0 && !spawnInitiated)
            {
                console.log("Spawning attacker");
                var creepName = Game.spawns[spawnName].createCreep(attackerBody, 'Attacker' + Memory.attackerTicker++);
                Memory.creeps[creepName].role = 'attacker';
                spawnInitiated = true;
            }
        }
        
        // First check to make sure all harvesters have carriers
        var harvesterList = Game.rooms[roomName].find(FIND_MY_CREEPS, {
            filter: function(possibleHarvester) {
                if ((possibleHarvester.spawning == false) &&
                    (possibleHarvester.memory.role == 'harvester') &&
                    ((!("carrierName" in possibleHarvester.memory)) ||
                        (Game.creeps[possibleHarvester.memory.carrierName] == null)))
                            return true;
                else
                    return false;
        }});
        for (var i = 0; i < harvesterList.length; ++i)
        {
            var harvester = harvesterList[i];
            console.log("carrierId" in harvester.memory);
            // We need to spawn a carrier for this harvester
            if (Game.spawns[spawnName].canCreateCreep(carrierBody) == 0 && !spawnInitiated)
            {
                console.log(harvester + " has no carrier - spawning carrier");
                var creepName = Game.spawns[spawnName].createCreep(carrierBody, 'Carrier' + Memory.carrierTicker++);
                Memory.creeps[creepName].role = 'carrier';
                Memory.creeps[creepName].harvesterId = harvester.id;
                harvester.memory.carrierName = creepName;
                spawnInitiated = true;
            }
            
        }
        
        // Check if there are sources that have yet to be harvested
        var possibleSources = Game.rooms[roomName].find(FIND_SOURCES, {
                                filter: function(source)
                                {
                                    console.log("Judging " + source.id);
                                    if (source.pos.findInRange(FIND_HOSTILE_CREEPS, 20).length > 0) {
                                            console.log(source.id + " - bad");
                                            return false;
                                    }
                                    else
                                        return true;
                                }});
        console.log(possibleSources);
        if (possibleSources.length > 0 && Game.spawns[spawnName].pos.findClosest(possibleSources) != null)
        {
            
            // We need to spawn a harvester for this source
            var closestSource = Game.spawns[spawnName].pos.findClosest(possibleSources);
            if (Game.spawns[spawnName].canCreateCreep(harvesterBody) == 0 && !spawnInitiated) 
            {
                
                 console.log("Found a source. Spawning a harvester");
                var creepName = Game.spawns[spawnName].createCreep(harvesterBody, 'Harvester' + Memory.harvesterTicker++);
                Memory.creeps[creepName].role = 'harvester';
                Memory.creeps[creepName].assignedSourceId = closestSource.id;
                spawnInitiated = true;
            }
        }
        else
        {
            // We need to spawn an attacker 
            if (Game.spawns[spawnName].canCreateCreep(attackerBody) == 0 && !spawnInitiated)
            {
                console.log("Spawning attacker");
                var creepName = Game.spawns[spawnName].createCreep(attackerBody, 'Attacker' + Memory.attackerTicker++);
                Memory.creeps[creepName].role = 'attacker';
                spawnInitiated = true;
            }
        }
      
        
    }   
}
    


for (var creep in Game.creeps) {
    var creepObject = Game.creeps[creep];
    if (Memory.creeps[creep].role == 'harvester')
        harvesterFunction(creepObject);
    else if (Memory.creeps[creep].role == 'attacker')
        attackerFunction(creepObject);
    else if (Memory.creeps[creep].role == 'carrier')
        carrierFunction(creepObject);
}



