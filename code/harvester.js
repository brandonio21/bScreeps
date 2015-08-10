/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('harvester'); // -> 'a thing'
 */
 module.exports = function(creep)
 {
       console.log(creep.memory.assignedSourceId);
        if (creep.memory.assignedSourceId != null && 
        Game.getObjectById(creep.memory.assignedSourceId) != null)
        {
            var assigned = Game.getObjectById(creep.memory.assignedSourceId);
            console.log('moving to' + assigned.id);
            creep.moveTo(assigned);
            creep.harvest(assigned);
        }
        else
        {
             var source = creep.pos.findClosest(FIND_SOURCES);
            if (source)
            {
                console.log(creep.name + " harvesting..");
                creep.moveTo(source);
                creep.harvest(source);
            }
        }
           
 };
