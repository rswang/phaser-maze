/**
 * @class mainGame
 * A Phaser scene
 */
var game = require('../game'),
  localisation = require('../locale'),
  Label = require('../classes/label');

var cursors, player, platforms;

var create = function() {
    game.analytics.trackEvent('scene', 'create', 'mainGame');

    game.stage.backgroundColor = '#ffecb3';
    game.physics.startSystem(Phaser.Physics.ARCADE);

    platforms = game.add.group();

    platforms.enableBody = true;

    var ledge = platforms.create(0, 60, 'horizontal');
    ledge.body.immovable = true;

    ledge = platforms.create(60, 140, 'horizontal');
    ledge.body.immovable = true;

    ledge = platforms.create(0, 220, 'horizontal');
    ledge.body.immovable = true;

    ledge = platforms.create(180, 220, 'vertical');
    ledge.body.immovable = true;

    ledge = platforms.create(180, 500, 'vertical');
    ledge.body.immovable = true;

    ledge = platforms.create(180, 500, 'horizontal');
    ledge.body.immovable = true;

    ledge = platforms.create(440, 260, 'vertical');
    ledge.body.immovable = true;

    ledge = platforms.create(520, 340, 'vertical');
    ledge.body.immovable = true;

    ledge = platforms.create(440, 520, 'horizontal');
    ledge.body.immovable = true;

    ledge = platforms.create(180, 420, 'horizontal');
    ledge.body.immovable = true;

    ledge = platforms.create(260, 140, 'vertical');
    ledge.body.immovable = true;

    ledge = platforms.create(260, -120, 'vertical');
    ledge.body.immovable = true;

    ledge = platforms.create(100, 300, 'vertical');
    ledge.body.immovable = true;

    ledge = platforms.create(20, 300, 'vertical');
    ledge.body.immovable = true;

    ledge = platforms.create(-80, 500, 'horizontal');
    ledge.body.immovable = true;

    ledge = platforms.create(260, 60, 'horizontal');
    ledge.body.immovable = true;

    ledge = platforms.create(340, 60, 'vertical');
    ledge.body.immovable = true;

    ledge = platforms.create(260, 260, 'horizontal');
    ledge.body.immovable = true;

    ledge = platforms.create(260, 340, 'horizontal');
    ledge.body.immovable = true;

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
    cursors = game.input.keyboard.createCursorKeys();
};

var update = function() {
    game.physics.arcade.collide(player, platforms);

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
    
    //  And this starts the animation playing by using its key ("walk")
    //  30 is the frame rate (30fps)
    //  true means it will loop when it finishes
    // player.animations.play('walk', 10, true);
};

module.exports = {
  create: create,
  update: update,

  restartGame: function () {

    game.analytics.trackEvent('scene', 'create', 'restartGame');

    game.state.start('mainMenu');
  }

};
