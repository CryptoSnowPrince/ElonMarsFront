import Phaser, { Loader } from 'phaser'
import { unitTypes } from '../utils/constants';
export class Bootstrap extends Phaser.Scene
{
	constructor()
	{
		super('bootstrap')
	}

    init()
    {

    }

	preload()
    {
        this.load.image("player1", "assets/player1.png");
        this.load.image("player2", "assets/player2.png"); 
        this.load.image("bullet", 'assets/bullet_1.png');

        unitTypes.forEach((unit, index) => {
            this.load.image(unit, 'assets/units/'+unit+'.png');
        });

        this.load.image('background', 'assets/pvp-background.png');

        
        this.load.spritesheet('dieSheet', 'assets/gif_anim/dead.png', { frameWidth: 650, frameHeight: 650 });
        this.load.spritesheet('attackSheet', 'assets/gif_anim/player_attack.png', { frameWidth: 650, frameHeight: 650 });
        this.load.spritesheet('explodeSheet', 'assets/explode.png', { frameWidth: 132, frameHeight: 132 });

        this.load.spritesheet('earthAnimSheet', 'assets/unit-earth-anim.png', { frameWidth: 330, frameHeight: 400 });
        this.load.spritesheet('tankAnimSheet', 'assets/unit-tank-die.png', { frameWidth: 280, frameHeight: 220 });
        this.load.spritesheet('earthAttackSheet', 'assets/unit-earth-attack-effect.png', { frameWidth: 1350, frameHeight: 160 });

    }

    create()
    {
        this.createNewGame();  
    }


    update() {
        
    }

    private createNewGame() 
    {
        this.scene.launch('game');
    }

    loadAssets() {
        this.load.image("player1", "assets/player1.png");
        this.load.image("player2", "assets/player2.png"); 
        this.load.image("bullet", 'assets/bullet_1.png');
    }
}
