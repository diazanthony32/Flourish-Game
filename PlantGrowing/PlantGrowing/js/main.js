//New Phaser game instance
var game = new Phaser.Game(800, 1000, Phaser.AUTO, '', { preload: preload, create: create, update: update });

//Gathering necessary assets to create the game
function preload() 
{

	//The images for the background, the floor, the stars, and the playable character
	//are put into the game
    game.load.image('sky', 'assets/sky.png');
    game.load.image('ground', 'assets/platform.png');
    game.load.image('star', 'assets/star.png');
    game.load.image('diamond', 'assets/diamond.png');
    game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
    game.load.spritesheet('baddie', 'assets/baddie.png', 32, 32);

}

//Memory locations to categorize and store objects for the game
var player;
var platforms;
var cursors;
var baddie;

var stars;
var diamond;
var score = 0;
var scoreText;

//Everything is put into place in the game in preparation for play
function create() {

    //Adds a preset physics system to the game
    game.physics.startSystem(Phaser.Physics.ARCADE);

    //Makes an instance of the sky image in the game
    game.add.sprite(0, 0, 'sky');

    //Uses group functionality to apply similar properties to all platforms
    platforms = game.add.group();

    //Adds physics to the platforms
    platforms.enableBody = true;

    //Creates a ground object
    var ground = platforms.create(0, game.world.height - 64, 'ground');

    //Adjusts the size of the sprite to fit the game window
    ground.scale.setTo(2, 2);

    //Prevents the player object from moving the ground object
    ground.body.immovable = true;

    var ledge = platforms.create(600, 600, 'ground');
    ledge.body.immovable = true;

    ledge = platforms.create(-200, 500, 'ground');
    ledge.body.immovable = true;

    ledge = platforms.create(-100, 700, 'ground');
    ledge.body.immovable = true;

    ledge = platforms.create(500, 800, 'ground');
    ledge.body.immovable = true;

    //A playable character is created and added to the game
    player = game.add.sprite(32, game.world.height - 150, 'dude');

    //Adds physics to the player
    game.physics.arcade.enable(player);

    //how much upward momentum is added upon bouncing
    player.body.bounce.y = 0.2;

    //how fast the player will fall from the air
    player.body.gravity.y = 300;

    //Treat the edges of the game windows as walls
    player.body.collideWorldBounds = true;

    //Variable to store information on the enemies
    baddie = game.add.group();
    baddie.enableBody = true;

    //Character animations
    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);

    stars = game.add.group();

    stars.enableBody = true;

    //Creates 12 identical instances of the star object 
    //and adds them to the group
    for (var i = 0; i < 12; i++)
    {
        var star = stars.create(i * 70, 0, 'star');

        star.body.gravity.y = 300;

        //The bounce factor is randomized
        star.body.bounce.y = 0.7 + Math.random() * 0.2;
    }

    //Creates a single diamond object near the top of the level
    //at a random x position
    diamond = game.add.sprite(800 - ((Math.random() * 700) + 100), 400, 'diamond');
    game.physics.arcade.enable(diamond);
    diamond.enableBody = true;
    diamond.immovable = true;

    //The text in the game labeling the score
    scoreText = game.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

    //Variable that stores the input information from the keyboard
    cursors = game.input.keyboard.createCursorKeys();

    //Creates enemies
    for (var i = 0; i < 2; i++)
    {
        var enemy = baddie.create(800 - ((Math.random() * 700) + 100), 0, 'baddie');
        enemy.animations.add('idling', [i * 2, i * 2 + 1], 10, true);
        enemy.animations.play('idling');
        enemy.body.gravity.y = 300;
    }
}

function update() {

    //Checks for collisions between the player and any platforms
    //Defaults to preventing the player from passing through it
    var hitPlatform = game.physics.arcade.collide(player, platforms);
    game.physics.arcade.collide(stars, platforms);
    game.physics.arcade.collide(baddie, platforms);

    //If the player touches a star, the collectStar function is called
    game.physics.arcade.overlap(player, stars, collectStar, null, this);

    //If the player touches the diamond, the collectDiamond function is called
    game.physics.arcade.overlap(player, diamond, collectDiamond, null, this);

    //If the player touches an enemy, the enemy dies and the player loses 25 points
    game.physics.arcade.overlap(player, baddie, attacked, null, this);

    //Stops the player movement if nothing is being pressed
    player.body.velocity.x = 0;

    if (cursors.left.isDown)
    {
        //  Move to the left
        player.body.velocity.x = -150;

        player.animations.play('left');
    }
    else if (cursors.right.isDown)
    {
        //  Move to the right
        player.body.velocity.x = 150;

        player.animations.play('right');
    }
    else
    {
        //No movement
        player.animations.stop();

        player.frame = 4;
    }
    
    //  Allows the player to jump only if they are touching the ground.
    if (cursors.up.isDown && player.body.touching.down && hitPlatform)
    {
        player.body.velocity.y = -350;
    }

}

function collectStar (player, star) 
{
    
    //Erases the star object
    star.kill();

    //Changes the score
    score += 10;
    scoreText.text = 'Score: ' + score;

}

//Replica of the collectStar function,
//expect it handles the events of the diamond
function collectDiamond (player, diamond)
{
    diamond.kill();

    score += 50;
    scoreText.text = 'Score: ' + score;
}

function attacked (player, enemy)
{
    enemy.kill();

    score -= 25;
    scoreText.text = 'Score: ' + score;
}