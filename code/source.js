module.exports = 
{
	initialize_memory: function(source) {
		if (Memory.sources == undefined)
			Memory.sources = {};
		if (Memory.sources[source.id] == undefined)
			Memory.sources[source.id] = {};
		if (Memory.sources[source.id].harvesterCount == undefined)
			Memory.sources[source.id].harvesterCount = 0;
	},

	get_free_adjacent_count: function(position) {
		var count = 0;
		for (var dx = -1; dx < 2; ++dx) {
			for (var dy = -1; dy < 2; ++dy) {
				if (dx == 0 && dy == 0)
					continue;
				var dPos = new RoomPosition(position.x + dx, position.y + dy, position.roomName);
				var posContents = dPos.look();
				posContents.forEach(function(lookObject) {
					if (lookObject.type == 'terrain' && lookObject.terrain != 'wall')
						count++;
				});
			}
		}
		return count; // don't double count the source itself
	},

	get_free_spots: function(source) {
		this.initialize_memory(source);
		var freeSpots =  this.get_free_adjacent_count(source.pos) - Memory.sources[source.id].harvesterCount;
		console.log(source.id + " -------- " + freeSpots + " free spots");
		return freeSpots;
	},

	add_harvester: function(source) {
		console.log("AH");
		this.initialize_memory(source);
		Memory.sources[source.id].harvesterCount++;
	},

	subtract_harvester: function(source) {
		this.initialize_memory(source);
		Memory.sources[source.id].harvesterCount--;

	}
}
