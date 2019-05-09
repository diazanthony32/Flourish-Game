//code created by Alain Kassarjian
var game = new Phaser.Game(800, 1000, Phaser.AUTO, '', { preload: preload, create: create, update: update });

function preload() 
{
	//image assets
	game.load.image('box', 'assets/Box.png');
	game.load.image('player', 'assets/Player.png');
}

//global variables
var platforms;
var plant;
var player;
var input;

function create() 
{
	//enable arcade physics
	game.physics.startSystem(Phaser.Physics.ARCADE);

	//allows for access to mouse information
	game.input.mouse.capture = true;

	//the group in which the drawn plant objects will be stored
	platforms = game.add.group();
	platforms.enableBody = true;

	//create a plant to start from
	plant = platforms.create(game.world.width / 2, game.world.height / 2, 'box');
	plant.body.immovable = true;

	//adds player and its physics
	player = game.add.sprite(0, 0, 'player');
	game.physics.arcade.enable(player);

	//object to store keyboard inputs
	input = game.input.keyboard.createCursorKeys();
}

function update() 
{
	//sets player velocity to 0 if nothing is being pressed
	player.body.velocity.x = 0;
	player.body.velocity.y = 0;

	//treats the plant objects as walls
	game.physics.arcade.collide(player, platforms);

	//displays the total number of plant objects created
	game.debug.text(platforms.total, game.world.width / 2, 100);

	//creates plants if left mouse is being pressed and if another plant object does not exist
	//at the mouse's cursor coordinate
	if (game.input.activePointer.isDown && !isOccupied(game.input.mousePointer.x, game.input.mousePointer.y) && platforms.total < 100)
	{
		//makes a theoretical plant to see if it a plant
		//can officially be made here
		plant = game.add.sprite(game.input.mousePointer.x, game.input.mousePointer.y, 'box');
		game.physics.arcade.enable(plant);

		//checks if the plant part you just made is connected
		//to the main plant.
		//If it isn't, get rid of the theoretical plant
		if (game.physics.arcade.overlap(plant, platforms))
		{
			plant.destroy();
			plant = platforms.create(game.input.mousePointer.x, game.input.mousePointer.y, 'box');
			plant.body.immovable = true;
		}
		else
		{
			plant.destroy();
		}
	}

	//the following if/else statements allows for player movement
	if (input.left.isDown)
	{
		player.body.velocity.x = -150;
	}

	else if (input.right.isDown)
	{
		player.body.velocity.x = 150;
	}

	else if (input.up.isDown)
	{
		player.body.velocity.y = -150;
	}

	else if (input.down.isDown)
	{
		player.body.velocity.y = 150;
	}
}

//checks to see if an object exists at the given coordinate
function isOccupied(x, y)
{
	//getObjectsAtLocation returns an array of objects
	//in the platform group that exist at the given xy coordinate.
	//If the length of that array is 0, there must be no objects at
	//the given coordinate, so it is therefore not occupied.
	if (game.physics.arcade.getObjectsAtLocation(x, y, platforms).length == 0)
	{
		return false;
	}
	else
		return true;
}