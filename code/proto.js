/* All defined prototypes go here */
var roles = require('roles');
var harvester = require('harvester');
var carrier = require('carrier');

module.exports = function()
{
	Creep.prototype.assignRole = function(role) {
		Memory.creeps[this.name].role = role;
	}

	Creep.prototype.getRole = function() {
		return Memory.creeps[this.name].role;
	}

	Creep.prototype.doTick = function() {
		switch(this.getRole()) {
			case roles.HARVESTER:
				harvester.action(this);
				break;
			case roles.CARRIER:
				carrier.action(this);
				break;
		}
	}
}:
