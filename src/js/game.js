/**
 * @class game
 * This is used to store a reference to the Phaser game object
 **/
var Phaser = require('phaser');

var game = new Phaser.Game(800, 600, Phaser.AUTO, 'content', null);

module.exports = game;
