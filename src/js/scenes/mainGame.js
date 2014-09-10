/**
 * @class mainGame
 * A Phaser scene
 */
var game = require('../game'),
  localisation = require('../locale'),
  Label = require('../classes/label');

var cursors, player, player2, stars, platforms, ledge;

var create = function() {
    game.analytics.trackEvent('scene', 'create', 'mainGame');

    game.stage.backgroundColor = '#ffecb3';
    game.physics.startSystem(Phaser.Physics.ARCADE);

    platforms = game.add.group();

    platforms.enableBody = true;

    var horizontalCoordinates = [
        [0, 60],
        [60, 140],
        [0, 220],
        [180, 500],
        [440, 520],
        [180, 420],
        [-80, 500],
        [260, 60],
        [260, 260],
        [260, 340],
        [520, 260],
        [520, 340],
        [440, 180],
        [700, 80],
        [600, 420],
    ];

    var verticalCoordinates = [
        [180, 220],
        [180, 500],
        [440, 260],
        [520, 340],
        [640, 520],
        [720, 520],
        [260, 140],
        [260, -120],
        [100, 300],
        [20, 300],
        [340, 60],
        [520, -80],
        [620, 0],
        [700, 80],
    ];

    for (i = 0; i < horizontalCoordinates.length; i++) {
        ledge = platforms.create(horizontalCoordinates[i][0], horizontalCoordinates[i][1], 'horizontal');
        ledge.body.immovable = true;
    }

    for (i = 0; i < verticalCoordinates.length; i++) {
        ledge = platforms.create(verticalCoordinates[i][0], verticalCoordinates[i][1], 'vertical');
        ledge.body.immovable = true;
    }

    stars = game.add.group();

    stars.enableBody = true;

    var star = stars.create(10, 10, 'star');
    star.body.immovable = true;

    star = stars.create(770, 570, 'star');
    star.body.immovable = true;

    player = game.add.sprite(0, 0, 'dude');
    game.physics.arcade.enable(player);
    player.body.bounce.y = 0;
    player.body.gravity.y = 0;
    player.body.collideWorldBounds = true;
    player.animations.add('walk');
    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);
    player.animations.add('up', [0], 10, true);
    player.animations.add('down', [0], 10, true);

    player2 = game.add.sprite(0, 0, 'player');
    player2.scale.setTo(0.4, 0.4);
    game.physics.arcade.enable(player2);
    player2.body.bounce.y = 0;
    player2.body.gravity.y = 0;
    player2.body.collideWorldBounds = true;
    player2.animations.add('walk');
    cursors = game.input.keyboard.createCursorKeys();
};

var update = function() {
    game.physics.arcade.collide(player, platforms);
    game.physics.arcade.collide(player2, platforms);

    player.body.velocity.x = 0;
    if (cursors.left.isDown) {
        player.body.velocity.x = -150;
        player.animations.play('left');
    } else if (cursors.right.isDown) {
        player.body.velocity.x = 150;
        player.animations.play('right');
    } else if (cursors.up.isDown) {
        player.body.velocity.y = -150;
        player.animations.stop();
    } else if (cursors.down.isDown) {
        player.body.velocity.y = 150;
        player.animations.stop();
    } else {
        player.body.velocity.y = 0;
        player.animations.stop();
        player.frame = 4;
    }

    var left2 = game.input.keyboard.addKey(Phaser.Keyboard.A);
    var right2 = game.input.keyboard.addKey(Phaser.Keyboard.D);
    var up2 = game.input.keyboard.addKey(Phaser.Keyboard.W);
    var down2 = game.input.keyboard.addKey(Phaser.Keyboard.S);

    if (left2.isDown) {
        player2.body.velocity.x = -150;
        player2.animations.play('walk');
    } else if (right2.isDown) {
        player2.body.velocity.x = 150;
        player2.animations.play('walk');
    } else if (up2.isDown) {
        player2.body.velocity.y = -150;
        player2.animations.stop();
    } else if (down2.isDown) {
        player2.body.velocity.y = 150;
        player2.animations.stop();
    } else {
        player2.body.velocity.y = 0;
        player2.animations.stop();
        player2.frame = 4;
    }

    var restartKey = game.input.keyboard.addKey(Phaser.Keyboard.R);
    if (restartKey.isDown) {
      restartGame();
    }
    
};

var restartGame = function() {
  game.analytics.trackEvent('scene', 'create', 'restartGame');

   game.state.start('mainMenu');
}

module.exports = {
  create: create,
  update: update,
  restartGame: restartGame, 
};
