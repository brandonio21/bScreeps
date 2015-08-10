var opdir = require('opdir');
/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('attacker'); // -> 'a thing'
 */
 module.exports = function(creep) {
   // First, look for enemies
   var enemies = creep.pos.findClosest(FIND_HOSTILE_CREEPS, {maxOps: 400});
   if (enemies)
   {
       // There are enemies. Make sure that we are not too close though
       if (creep.pos.getRangeTo(enemies) <= 2)
       {
           creep.move(opdir(creep.pos.getDirectionTo(enemies)));
       }
       else if (creep.rangedAttack(enemies) == -9) {
                creep.moveTo(enemies);
       }

       
   }
    else {
           creep.moveTo(creep.room.findClosest(FIND_FLAGS));
      }

     
 };
