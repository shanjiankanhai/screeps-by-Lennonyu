Game.spawns['Spawn1'].spawnCreep( [WORK, CARRY, MOVE], 'Harvester1' );   //在spawn1（巢）的基础上，使用spawncreep方法创建一个名为harvester1的搬砖工

module.exports.loop = function () {                         //创建一个会自己搬砖的工人，但是逻辑不是很清楚
    var creep = Game.creeps['Harvester1'];
    var sources = creep.room.find(FIND_SOURCES);
    if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
        creep.moveTo(sources[0]);
    }
}



module.exports.loop = function () {                         //
    var creep = Game.creeps['Harvester1'];

    if(creep.carry.energy < creep.carryCapacity) {
        var sources = creep.room.find(FIND_SOURCES);
        if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
            creep.moveTo(sources[0]);
        }
    }
    else {
        if( creep.transfer(Game.spawns['Spawn1'], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE ) {
            creep.moveTo(Game.spawns['Spawn1']);
        }
    }
}

Game.spawns['Spawn1'].spawnCreep( [WORK, CARRY, MOVE], 'Harvester2' );   //创建另一个搬砖工

/*
要发送蠕变以获取能量，您需要使用下面文档部分中描述的方法。命令将在每个游戏时间点传递。该harvest方法要求能量源与蠕变相邻。

你用这个名字命令蠕动：Game.creeps['Harvester1']。使用FIND_SOURCES常量作为Room.find方法的参数。

*/
module.exports.loop = function () {
    var creep = Game.creeps['Harvester1'];
    var sources = creep.room.find(FIND_SOURCES);
    if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
        creep.moveTo(sources[0]);
    }
}

/*
To make the creep transfer energy back to the spawn, you need to use the method `Creep.transfer`. However, remember that it should be done when the creep is

next to the spawn, so the creep needs to walk back.

If you modify the code by adding the check .carry.energy < .carryCapacity to the creep, it will be able to go back and forth on its own, giving energy to the

spawn and returning to the source.
*/

module.exports.loop = function () {
    var creep = Game.creeps['Harvester1'];

    if(creep.carry.energy < creep.carryCapacity) {
        var sources = creep.room.find(FIND_SOURCES);
        if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
            creep.moveTo(sources[0]);
        }
    }
    else {
        if( creep.transfer(Game.spawns['Spawn1'], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE ) {
            creep.moveTo(Game.spawns['Spawn1']);
        }
    }
}
/*
This creep will now work as a harvester until it dies. Remember that almost any creep has a life cycle of 1500 game ticks, then it "ages" and dies 

(this behavior is disabled in the Tutorial).

Let's create another worker creep to help the first one. It will cost another 200 energy units, so you may need to wait until your harvester collects enough energy.

The spawnCreep method will return an error code ERR_NOT_ENOUGH_ENERGY (-6) until then.
*/
Game.spawns['Spawn1'].spawnCreep( [WORK, CARRY, MOVE], 'Harvester2' );

/* 
The second creep is ready, but it won't move until we include it into the program.

To set the behavior of both creeps we could just duplicate the entire script for the second one, but it's much better to use the for loop against all the screeps 

in Game.creeps.
*/

module.exports.loop = function () {
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];

        if(creep.carry.energy < creep.carryCapacity) {
            var sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0]);
            }
        }
        else {
            if(creep.transfer(Game.spawns['Spawn1'], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(Game.spawns['Spawn1']);
            }
        }
    }
}

/*
Now let's improve our code by taking the workers' behavior out into a separate module. Create a module called role.harvester with the help of the Modules

section on the left of the script editor and define a run function inside the module.exports object, containing the creep behavior.
*/

var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
	    if(creep.carry.energy < creep.carryCapacity) {
            var sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0]);
            }
        }
        else {
            if(creep.transfer(Game.spawns['Spawn1'], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(Game.spawns['Spawn1']);
            }
        }
	}
};

module.exports = roleHarvester;

/*
现在您可以重写主模块代码，只留下循环并通过该方法调用新模块 require('role.harvester')
*/

var roleHarvester = require('role.harvester');

module.exports.loop = function () {

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        roleHarvester.run(creep);
    }
}