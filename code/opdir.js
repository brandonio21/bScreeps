/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('opdir'); // -> 'a thing'
 */
 module.exports = function(direction)
 {
     if (direction == TOP)
        return BOTTOM;
    else if (direction == TOP_RIGHT)
        return BOTTOM_LEFT;
    else if (direction == RIGHT)
        return LEFT;
    else if (direction == BOTTOM_RIGHT)
        return TOP_LEFT;
    else if (direction == BOTTOM)
        return TOP;
    else if (direction == BOTTOM_LEFT)
        return TOP_RIGHT;
    else if (direction == LEFT)
        return RIGHT;
    else
        return BOTTOM_RIGHT;
 }
