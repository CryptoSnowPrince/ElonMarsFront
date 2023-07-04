import * as Phaser from 'phaser';
import { Store } from 'redux';
import configureStore from "../store";
import { getUnitHealth, unitTypes } from '../utils/constants';
import { HealthBar } from './HealthBar';
import { unitTypesDetail } from '../utils/constants';
import { playerReady, sceneReady } from '../store/pvp/actions';
import socket from '../utils/socket';
import { PLAYER_SOCKET, UNIT_SOCKET } from '../utils/socket_api';
import { decryptData } from '../utils/socketHelper';


const rstore = configureStore();

interface PlayerData {
    healthBar: any;
    player: any;
    hp: number;
    unit: any;
    unitHp: number;
    unitType: string;
    unitHealthBar: any;
    bonusDamage: number;
}

interface UnitDestroyAnims {
    tank: any;
    earth: any;
}

interface PlayerAnims {
    die: any;
    unitDestroy: UnitDestroyAnims;
    attack: any;
    explode: any;
    explodeUnit: any;
}

interface PlayerAnimations {
    localPlayer: PlayerAnims;
    remotePlayer: PlayerAnims;
    effects: any;
}

interface UnitDestroyAnims {
    [key: string]: any; // Define an index signature that allows for using any string as key 
  }

export class Game extends Phaser.Scene
{
    private store: any;

    private sceneWidth: number = 0;
    private sceneHeight: number = 0;
    private playerPosition:any = [];
    private playerWidth:number = Math.min(300, window.innerWidth/5);
    private unitWidth:number = Math.min(250, window.innerWidth/6);
    private scenePadding:number = Math.min(10, window.innerWidth/20);
    private unit: Array<string> = [];
    private pvpData = {};

    private playerData = {
        localPlayer: {
            healthBar: null,
            player: null,
            hp: 1000,
            unit: null,
            unitHp: 1000,
            unitType: "",
            unitHealthBar: null,
            bonusDamage: 0,
        },
        remotePlayer: {
            healthBar: null,
            player: null,
            hp: 1000,
            unit: null,
            unitHp: 500,
            unitType: "",
            unitHealthBar: null,
            bonusDamage: 0,
        }
    }as {
        localPlayer: PlayerData;
        remotePlayer: PlayerData;
    };

    private Anims:PlayerAnimations = {
        localPlayer: {
            die: null,
            unitDestroy: {
                tank: null,
                earth: null
            },
            attack: null,
            explode: null,
            explodeUnit: null,

        },
        remotePlayer: {
            die: null,
            unitDestroy: {
                tank: null,
                earth: null
            },
            attack: null,
            explode: null,
            explodeUnit: null,
        },
        effects:{
            earth: null,
        }
    }

	constructor()
	{
		super('game');
        this.store = rstore;
	}

    getStoreData() {
        const reducers = this.store.getState();
        return reducers;
    }

    startGame(){
        console.log("start game in game scene");

        const {pvpModule} = this.getStoreData();
        const {pvpRoom, roomDetail} = pvpModule;

        
        // this.playerData.localPlayer.unitHealthBar = new HealthBar(this, this.playerPosition[0] + this.playerWidth, this.sceneHeight-280, this.unitWidth-4, 1000);
        // if(isReady) this.playerData.remotePlayer.unitHealthBar = new HealthBar(this, this.playerPosition[1] - this.unitWidth, this.sceneHeight-280, this.unitWidth-4, 1000);

        this.add.image(window.innerWidth/2, window.innerHeight/2, 'background')
            .setScale(Math.max(window.innerWidth/1920, window.innerHeight/1080))
            .setScrollFactor(0).setDepth(-1);
            
        this.showPlayer(true, 1); 
        this.showPlayer(false, 0.2);

        if(pvpRoom.roomid == roomDetail.myAddress) {
            this.showUnit(true, pvpRoom.localPlayer.unit, pvpRoom.localPlayer.unitHp);
        }

        this.animationDefine();
        this.eventDefine();
        
        this.defineSocketEvent();

    }

    init()
    {
        
        this.children.removeAll();
        const {pvpModule} = this.getStoreData();
        const {pvpRoom} = pvpModule;


        this.playerData.localPlayer.unitType = pvpRoom.localPlayer.unit;
        //this.playerData.remotePlayer.unitType = "earth";
        

        this.sceneWidth = window.innerWidth;
        this.sceneHeight = window.innerHeight;
        this.playerPosition = [this.scenePadding, this.sceneWidth-this.scenePadding-this.playerWidth];

    }

    setUnit(isHost:boolean, unitType: string){

    }

    showUnit(isHost: boolean, type: string, health: number) {

        if(isHost) {
            if(this.playerData.localPlayer.unit !== null) {
                this.playerData.localPlayer.unit.setTexture(type);
            } else {
                this.playerData.localPlayer.unitType = type;
                this.playerData.localPlayer.unit = this.physics.add.sprite(this.playerPosition[0] + this.playerWidth, window.innerHeight, type).setName("unit1");
                this.playerData.localPlayer.unit.displayWidth = this.unitWidth;
                this.playerData.localPlayer.unit.scaleY = this.playerData.localPlayer.unit.scaleX;
                this.playerData.localPlayer.unit.setOrigin(0, 1);

                this.playerData.localPlayer.unitHealthBar = new HealthBar(this, this.playerPosition[0] + this.playerWidth, this.sceneHeight-this.unitWidth, this.unitWidth-4, health);
            }

            
        } else {

            if(this.playerData.remotePlayer.unit !== null) {
                this.playerData.remotePlayer.unit.setTexture(type);
            } else {
                this.playerData.remotePlayer.unitType = type;
                this.playerData.remotePlayer.unit = this.physics.add.sprite(this.playerPosition[1] - this.unitWidth, window.innerHeight, type).setName("unit2");
                this.playerData.remotePlayer.unit.displayWidth = this.unitWidth;
                this.playerData.remotePlayer.unit.scaleY = this.playerData.remotePlayer.unit.scaleX;
                this.playerData.remotePlayer.unit.setOrigin(0, 1);
                this.playerData.remotePlayer.unit.flipX = true;
    
                this.playerData.remotePlayer.unitHealthBar = new HealthBar(this, this.playerPosition[1] - this.unitWidth, this.sceneHeight-this.unitWidth, this.unitWidth-4, health);
            }
            
        }
    }

    showPlayer(isHost: boolean, alpha: number) {

        console.log("show Player == ", isHost, alpha);

        if(isHost) {
            
            if(this.playerData.localPlayer.player !== null) {
                this.playerData.localPlayer.player.setTexture("player1");
                this.playerData.localPlayer.player.setAlpha(alpha);
            } else {
                this.playerData.localPlayer.player = this.physics.add.sprite(this.playerPosition[0], window.innerHeight, "player1").setName("player1");
                this.playerData.localPlayer.player.setAlpha(alpha);
                this.playerData.localPlayer.player.setOrigin(0, 1).setScale(this.playerWidth/650);
            }

            if(this.playerData.localPlayer.healthBar == null && alpha == 1)
                this.playerData.localPlayer.healthBar = new HealthBar(this, this.playerPosition[0], this.sceneHeight-(this.playerWidth*1.1), this.playerWidth-4, 1000);

        }
        else {

            if(this.playerData.remotePlayer.player !== null) {
                this.playerData.remotePlayer.player.setTexture("player2");
                this.playerData.remotePlayer.player.setAlpha(alpha);
            } else {
                this.playerData.remotePlayer.player = this.physics.add.sprite(this.playerPosition[1], window.innerHeight, "player2").setName("player2");
                this.playerData.remotePlayer.player.setAlpha(alpha);
                this.playerData.remotePlayer.player.setOrigin(0, 1).setScale(this.playerWidth/650);
            }

            if(this.playerData.remotePlayer.healthBar == null && alpha == 1){
                this.playerData.remotePlayer.healthBar = new HealthBar(this, this.playerPosition[1], this.sceneHeight-(this.playerWidth*1.1), this.playerWidth-4, 1000);
            }

        }
    }

    animationDefine() {
        let self = this;

        //#region --------------------------- Die Animation ---------------------------
        this.anims.create({
            key: 'die-anim',
            frames: this.anims.generateFrameNumbers('dieSheet', { start: 0, end: 23 }),
            frameRate: 10,
            repeat: 0
        });
        this.Anims.localPlayer.die = this.add.sprite(this.playerPosition[0], window.innerHeight, 'dieSheet');
        this.Anims.localPlayer.die.setOrigin(0, 1).setScale(this.playerWidth/650);
        this.Anims.localPlayer.die.setVisible(false);

        this.Anims.localPlayer.die.on('animationcomplete', function (animation:any, frame:any) {
            if (animation.key === 'die-anim') {
                // self.Anims.localPlayer.die.setVisible(false);
                // self.playerData.localPlayer.player.destroy(true);
            }
        }, this);


        this.Anims.remotePlayer.die = this.add.sprite(this.playerPosition[1], window.innerHeight, 'dieSheet');
        this.Anims.remotePlayer.die.setOrigin(0, 1).setScale(this.playerWidth/650);
        this.Anims.remotePlayer.die.flipX = true;
        this.Anims.remotePlayer.die.setVisible(false);



        this.Anims.remotePlayer.die.on('animationcomplete', function (animation:any, frame:any) {
            if (animation.key === 'die-anim') {
                // self.Anims.remotePlayer.die.setVisible(false);
                // self.playerData.remotePlayer.player.destroy(true);
            }
        }, this);
        //#endregion

        //#region --------------------------- Attack Animation ---------------------------
        this.anims.create({
            key: 'attack-anim',
            frames: this.anims.generateFrameNumbers('attackSheet', { start: 0, end: 7 }),
            frameRate: 10,
            repeat: 0
        });

        this.Anims.localPlayer.attack = this.add.sprite(this.playerPosition[0], window.innerHeight, 'attackSheet');
        this.Anims.localPlayer.attack.setOrigin(0, 1).setScale(this.playerWidth/650);
        this.Anims.localPlayer.attack.setVisible(false);
        
        this.Anims.localPlayer.attack.on('animationcomplete', function (animation:any, frame:any) {
            if (animation.key === 'attack-anim') {
                self.Anims.localPlayer.attack.setVisible(false);
                self.playerData.localPlayer.player.setVisible(true);
            }
        }, this);

        this.Anims.remotePlayer.attack = this.add.sprite(this.playerPosition[1], window.innerHeight, 'attackSheet');
        this.Anims.remotePlayer.attack.setOrigin(0, 1).setScale(this.playerWidth/650, this.playerWidth/650);
        this.Anims.remotePlayer.attack.flipX = true;
        this.Anims.remotePlayer.attack.setVisible(false);
        
        this.Anims.remotePlayer.attack.on('animationcomplete', function (animation:any, frame:any) {
            if (animation.key === 'attack-anim') {
                self.Anims.remotePlayer.attack.setVisible(false);
                self.playerData.remotePlayer.player.setVisible(true);
            }
        }, this);
        //#endregion

        //#region --------------------------- Explode Animation ---------------------------
        this.anims.create({
            key: 'explode-anim',
            frames: this.anims.generateFrameNumbers('explodeSheet', { start: 0, end: 4 }),
            frameRate: 10,
            repeat: 0
        });

        this.Anims.localPlayer.explode = this.add.sprite(this.playerWidth-(this.playerWidth/5), window.innerHeight-(this.playerWidth*2/5), 'explodeSheet').setDepth(2);
        this.Anims.localPlayer.explode.setVisible(false);
        this.Anims.localPlayer.explode.on('animationcomplete', function (animation:any, frame:any) {
            if (animation.key === 'explode-anim') {
                self.Anims.localPlayer.explode.setVisible(false);
            }
        }, this);


        this.Anims.remotePlayer.explode = this.add.sprite(this.playerPosition[1]+(this.playerWidth*2/5), window.innerHeight-(this.playerWidth*2/5), 'explodeSheet').setDepth(2);
        this.Anims.remotePlayer.explode.setScale(-1, 1);
        this.Anims.remotePlayer.explode.setVisible(false);
        this.Anims.remotePlayer.explode.on('animationcomplete', function (animation:any, frame:any) {
            if (animation.key === 'explode-anim') {
                self.Anims.remotePlayer.explode.setVisible(false);
            }
        }, this);


        // Unit Explode Animation

        this.Anims.localPlayer.explodeUnit = this.add.sprite(this.playerWidth+(this.playerWidth*4/5), window.innerHeight-(this.playerWidth*2/5), 'explodeSheet').setDepth(2);
        this.Anims.localPlayer.explodeUnit.displayWidth = this.playerWidth / 2;
        this.Anims.localPlayer.explodeUnit.setVisible(false);
        this.Anims.localPlayer.explodeUnit.on('animationcomplete', function (animation:any, frame:any) {
            if (animation.key === 'explode-anim') {
                self.Anims.localPlayer.explodeUnit.setVisible(false);
            }
        }, this);


        this.Anims.remotePlayer.explodeUnit = this.add.sprite(this.playerPosition[1]-(this.playerWidth*4/5), window.innerHeight-(this.playerWidth*2/5), 'explodeSheet').setDepth(2);
        this.Anims.remotePlayer.explodeUnit.displayWidth = this.playerWidth / 2;
        this.Anims.remotePlayer.explodeUnit.flipX = true;
        this.Anims.remotePlayer.explodeUnit.setVisible(false);
        this.Anims.remotePlayer.explodeUnit.on('animationcomplete', function (animation:any, frame:any) {
            if (animation.key === 'explode-anim') {
                self.Anims.remotePlayer.explodeUnit.setVisible(false);
            }
        }, this);
        //#endregion

        //#region --------------------------- Destroy Unit Animation ---------------------------

        // tank destroy animation

        this.anims.create({
            key: 'tank-destroy-anim',
            frames: this.anims.generateFrameNumbers('tankAnimSheet', { start: 0, end: 34 }),
            frameRate: 10,
            repeat: 0
        });

        this.Anims.localPlayer.unitDestroy['tank'] = this.add.sprite(this.playerPosition[0] + this.playerWidth, window.innerHeight, 'tankAnimSheet').setDepth(1);
        this.Anims.localPlayer.unitDestroy['tank'].setVisible(false);
        this.Anims.localPlayer.unitDestroy['tank'].setOrigin(0, 1);

        this.Anims.localPlayer.unitDestroy['tank'].displayWidth = this.unitWidth;
        this.Anims.localPlayer.unitDestroy['tank'].scaleY = this.Anims.localPlayer.unitDestroy['tank'].scaleX;

        this.Anims.localPlayer.unitDestroy['tank'].on('animationcomplete', function (animation:any, frame:any) {
            if (animation.key === 'tank-destroy-anim') {
                self.Anims.localPlayer.unitDestroy['tank'].setVisible(false);
            }
        }, this);


        this.Anims.remotePlayer.unitDestroy['tank'] = this.add.sprite(this.playerPosition[1] - this.unitWidth, window.innerHeight, 'tankAnimSheet').setDepth(1);
        this.Anims.remotePlayer.unitDestroy['tank'].setOrigin(0, 1);
        this.Anims.remotePlayer.unitDestroy['tank'].flipX = true;
        this.Anims.remotePlayer.unitDestroy['tank'].setVisible(false);

        this.Anims.remotePlayer.unitDestroy['tank'].displayWidth = this.unitWidth;
        this.Anims.remotePlayer.unitDestroy['tank'].scaleY = this.Anims.remotePlayer.unitDestroy['tank'].scaleX;

        this.Anims.remotePlayer.unitDestroy['tank'].on('animationcomplete', function (animation:any, frame:any) {
            if (animation.key === 'tank-destroy-anim') {
                self.Anims.remotePlayer.unitDestroy['tank'].setVisible(false);
            }
        }, this);

        // earth attack effect
        //#region ------------------------ Earth Unit Effect Animation ------------------------

        this.anims.create({
            key: 'earth-attack-effect',
            frames: this.anims.generateFrameNumbers('earthAttackSheet', { start: 0, end: 21 }),
            frameRate: 10,
            repeat: 0,
            duration: 100
        });

        this.Anims.effects['earth'] = this.add.sprite(this.playerPosition[0] + this.playerWidth, window.innerHeight, 'earthAttackSheet').setDepth(2);
        this.Anims.effects['earth'].setVisible(false);
        this.Anims.effects['earth'].setOrigin(0, 1);
        this.Anims.effects['earth'].displayWidth = this.playerWidth * 4;
        this.Anims.effects['earth'].displayHeight = this.playerWidth / 2;

        this.Anims.effects['earth'].scaleY = this.Anims.effects['earth'].scaleX;

        this.Anims.effects['earth'].on('animationcomplete', function (animation:any, frame:any) {
            if (animation.key === 'earth-attack-effect') {
                self.Anims.effects['earth'].setVisible(false);
            }
        }, this);

        //#endregion

        // earth attack animation

        this.anims.create({
            key: 'earth-attack-anim',
            frames: this.anims.generateFrameNumbers('earthAnimSheet', { start: 0, end: 29 }),
            frameRate: 10,
            repeat: 0,
            duration: 1000,
        });

        this.anims.create({
            key: 'earth-destroy-anim',
            frames: this.anims.generateFrameNumbers('earthAnimSheet', { start: 30, end: 56 }),
            frameRate: 10,
            repeat: 0
        });

        this.Anims.localPlayer.unitDestroy['earth'] = this.add.sprite(this.playerPosition[0] + this.playerWidth, window.innerHeight, 'earthAnimSheet').setDepth(1);
        this.Anims.localPlayer.unitDestroy['earth'].setVisible(false);
        this.Anims.localPlayer.unitDestroy['earth'].setOrigin(0, 1);

        this.Anims.localPlayer.unitDestroy['earth'].displayWidth = this.unitWidth;
        this.Anims.localPlayer.unitDestroy['earth'].scaleY = this.Anims.localPlayer.unitDestroy['earth'].scaleX;

        this.Anims.localPlayer.unitDestroy['earth'].on('animationcomplete', function (animation:any, frame:any) {
            if (animation.key === 'earth-destroy-anim') {
                self.Anims.localPlayer.unitDestroy['earth'].setVisible(false);
                self.playerData.localPlayer.unit.setVisible(false);
            }
            if (animation.key == 'earth-attack-anim') {
                self.Anims.effects['earth'].flipX = false;

                if(self.playerData.localPlayer.unitHealthBar.getHp()<0.1) {
                    self.Anims.localPlayer.unitDestroy['earth'].setVisible(false);
                    self.playerData.localPlayer.unit.setVisible(false);
                }

                let pos = self.playerWidth+self.unitWidth+self.scenePadding;
                self.Anims.effects['earth'].x = Math.max(pos, self.playerPosition[1]-1350+self.playerWidth );

                self.Anims.effects['earth'].setVisible(true);
                self.Anims.effects['earth'].anims.play('earth-attack-effect');
                
                let damage = unitTypesDetail['earth'].attack;
            }
        }, this);


        this.Anims.remotePlayer.unitDestroy['earth'] = this.add.sprite(this.playerPosition[1] - this.unitWidth, window.innerHeight, 'earthAnimSheet').setDepth(1);
        this.Anims.remotePlayer.unitDestroy['earth'].setVisible(false);
        this.Anims.remotePlayer.unitDestroy['earth'].setOrigin(0, 1);
        this.Anims.remotePlayer.unitDestroy['earth'].flipX = true;
        
        this.Anims.remotePlayer.unitDestroy['earth'].displayWidth = this.unitWidth;
        this.Anims.remotePlayer.unitDestroy['earth'].scaleY = this.Anims.localPlayer.unitDestroy['earth'].scaleX;

        this.Anims.remotePlayer.unitDestroy['earth'].on('animationcomplete', function (animation:any, frame:any) {
            if (animation.key === 'earth-destroy-anim') {
                self.Anims.remotePlayer.unitDestroy['earth'].setVisible(false);
                self.playerData.remotePlayer.unit.setVisible(false);
            }
            if (animation.key == 'earth-attack-anim') {
                self.Anims.effects['earth'].flipX = true;

                if(self.playerData.remotePlayer.unitHealthBar.getHp()<0.1) {
                    self.Anims.remotePlayer.unitDestroy['earth'].setVisible(false);
                    self.playerData.remotePlayer.unit.setVisible(false);
                }

                let pos = self.playerPosition[1]-self.unitWidth-1350;
                self.Anims.effects['earth'].x = Math.min(pos, 50);

                self.Anims.effects['earth'].setVisible(true);
                self.Anims.effects['earth'].anims.play('earth-attack-effect');
                
                
            }
        }, this);
    }

    decreaseHealth(isHost: boolean, isPlayer: boolean, damage: number) {
        if(isHost) {
            if(isPlayer) this.playerData.localPlayer.healthBar.decrease(damage);
            else this.playerData.localPlayer.unitHealthBar.decrease(damage);

        } else {
            if(isPlayer) this.playerData.remotePlayer.healthBar.decrease(damage);
            else this.playerData.remotePlayer.unitHealthBar.decrease(damage);
        }

        if(this.playerData.localPlayer.healthBar.getHp() < 0.1) {
            if(this.playerData.localPlayer.player.active) {
                this.destroyPlayer(true);
            }
        }
        if(this.playerData.remotePlayer.healthBar.getHp() < 0.1) {
            if(this.playerData.remotePlayer.player.active) {
                this.destroyPlayer(false);
            }
        }
        if(this.playerData.localPlayer.unitHealthBar.getHp() < 0.1) {
            this.playerData.localPlayer.unitHealthBar.hideHealthBar();
            
            if(this.playerData.localPlayer.unit.active) {
                this.playerData.localPlayer.unit.setVisible(false);
                this.destroyUnit(true);
            }
        }
        if(this.playerData.remotePlayer.unitHealthBar.getHp() < 0.1) {
            this.playerData.remotePlayer.unitHealthBar.hideHealthBar();
            
            if(this.playerData.remotePlayer.unit.active) {
                this.playerData.remotePlayer.unit.setVisible(false);
                this.destroyUnit(false);
            }
        }
    }

    defineSocketEvent() {
    
        socket.on(PLAYER_SOCKET.ATTACK, (data:any) =>{
            data = decryptData(data);
            this.attackPlayerEvent({
                turn: data.roomid == data.address? "local" : "remote",
                type: data.type != "double-shot" ? "default" : "double-shot",
                damage: data.damage,
                health: data.health,
            });

            if(data.roomid == data.address) {
                this.attackBonusEvent({
                    localDamage: 0,
                    remoteDamage: this.playerData.remotePlayer.bonusDamage
                });
            } else {
                this.attackBonusEvent({
                    localDamage: this.playerData.localPlayer.bonusDamage, 
                    remoteDamage: 0
                });
            }
        })
    
        socket.on(PLAYER_SOCKET.UPDATE_BONUS_DAMAGE, (data:any) =>{
            data = decryptData(data);
            this.playerData.remotePlayer.bonusDamage = data.remoteDamage;
            this.playerData.localPlayer.bonusDamage = data.localDamage;
        })
    
        socket.on(UNIT_SOCKET.ATTACK, (data:any) =>{
            data = decryptData(data);
            this.attackUnitEvent(data.roomid == data.address ? "local" : "remote");
        })

        socket.on("getBattleData", (data:any) =>{
            data = decryptData(data);
            console.log("get battle data in scene", data);
            this.buildBattleScreen(data.localUnit, data.remoteUnit);
        });

        const myEvent = new CustomEvent('ready-game-scene', {
            detail: {
            },
        });
        
        window.dispatchEvent(myEvent);
    }

    attackPlayerEvent(event:any) {

        if(event.turn == "local") {
            if(this.playerData.remotePlayer.unitHealthBar.getHp()>0) {
                this.decreaseHealth(false, false, event.damage);
            } else {
                this.decreaseHealth(false, true, event.damage);
            }
        } else {
            
            if(this.playerData.localPlayer.unitHealthBar.getHp()>0) {
                this.decreaseHealth(true, false, event.damage);
            } else {
                this.decreaseHealth(true, true, event.damage);
            }    
        }
        
        this.playAttackAnimation(event.turn == "local", event.type, event.damage);
        this.decreaseHealth(event.turn == "local", true, -event.health);
    }

    attackUnitEvent(turn: string) {
        this.attackUnit(turn == "local");
    }

    attackBonusEvent(event: any) {
        
        if(this.playerData.localPlayer.unitHealthBar.getHp() == 0) {
            this.decreaseHealth(true, true, event.remoteDamage);
        } else {
            this.decreaseHealth(true, false, event.remoteDamage);
        }
        
        if(this.playerData.remotePlayer.unitHealthBar.getHp() == 0) {
            this.decreaseHealth(false, true, event.localDamage);
        } else {
            this.decreaseHealth(false, false, event.localDamage);
        }
        
    }

    eventDefine() {
        window.addEventListener("clear-scene", (event:any) => {
            this.children.removeAll();
        });
    }

    buildBattleScreen(localUnit:string, remoteUnit:string) {
        const {pvpModule} = this.getStoreData();
        const {pvpRoom, roomDetail} = pvpModule;

        console.log(localUnit, remoteUnit);

        if(pvpRoom.roomid != roomDetail.myAddress) {
            this.showUnit(true, localUnit, getUnitHealth(localUnit));
        }

        this.showUnit(false, remoteUnit, getUnitHealth(remoteUnit));

        this.showPlayer(false, 1);

        playerReady(pvpRoom.roomid);
    }

    preload() {
        
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

        console.log("asset loaded...");
    }
    create()
    {

        
    }

    playAttackAnimation(isHost: boolean, bulletType: string = "default", damage: number) {
        
        const bullet = this.physics.add.sprite(
            isHost ? this.playerPosition[0] + this.playerWidth-(this.playerWidth/5*2) : this.playerPosition[1],
            window.innerHeight-(this.playerWidth/5*2), "bullet"
        ).setName("bullet1");

        bullet.setData("damage", damage);

        const doubleBullet = this.physics.add.sprite(
            isHost ? this.playerPosition[0] + this.playerWidth-(this.playerWidth/5*2) : this.playerPosition[1],
            window.innerHeight-(this.playerWidth/5*2), "bullet"
        ).setName('bullet2');

        doubleBullet.displayWidth = (this.playerWidth/5);
        bullet.displayWidth = (this.playerWidth/5);

        doubleBullet.displayHeight = (this.playerWidth/18);
        bullet.displayHeight = (this.playerWidth/18);

        bullet.setOrigin(0, 1);
        doubleBullet.setOrigin(0, 1);

        this.anims.create({
            key: 'attack-anim',
            frames: this.anims.generateFrameNumbers('attackSheet', { start: 0, end: 7 }),
            frameRate: 10,
            repeat: 0
        });


        if(isHost) {


            this.physics.add.collider(bullet, this.playerData.remotePlayer.player, this.collisionHandler, undefined, this);
            this.physics.add.collider(bullet, this.playerData.remotePlayer.unit, this.collisionHandler, undefined, this);

            this.physics.add.collider(doubleBullet, this.playerData.remotePlayer.player, this.collisionHandler, undefined, this);
            this.physics.add.collider(doubleBullet, this.playerData.remotePlayer.unit, this.collisionHandler, undefined, this);

            this.playerData.localPlayer.player.setVisible(false);
            this.Anims.localPlayer.attack.setVisible(true);
            this.Anims.localPlayer.attack.anims.play("attack-anim");
        }
        else {
            
            
            this.physics.add.collider(bullet, this.playerData.localPlayer.player, this.collisionHandler, undefined, this);
            this.physics.add.collider(bullet, this.playerData.localPlayer.unit, this.collisionHandler, undefined, this);

            this.physics.add.collider(doubleBullet, this.playerData.localPlayer.player, this.collisionHandler, undefined, this);
            this.physics.add.collider(doubleBullet, this.playerData.localPlayer.unit, this.collisionHandler, undefined, this);

            this.playerData.remotePlayer.player.setVisible(false);
            this.Anims.remotePlayer.attack.setVisible(true);
            this.Anims.remotePlayer.attack.anims.play("attack-anim");
        }

        if(bulletType != "default") {
            this.tweens.add({
                targets: doubleBullet,
                x: isHost?this.playerPosition[1]:this.playerPosition[0],
                duration: 500,
                delay: 100,
                ease: "Bullet2",
                loop: 0,
                onComplete: function () {
                    doubleBullet.setVisible(false);
                }
            });
        } else {
            doubleBullet.destroy();
        }
        this.tweens.add({
            targets: bullet,
            x: isHost?this.playerPosition[1]:this.playerPosition[0],
            duration: 500,
            ease: "Bullet1",
            loop: 0,
            onComplete: function () {
                bullet.setVisible(false);
            }
        });
        
        
    }

    destroyUnit(isHost: boolean) {
        if(isHost) {
            this.playerData.localPlayer.unit.destroy();
            let type = this.playerData.localPlayer.unitType;
            this.Anims.localPlayer.unitDestroy[type].setVisible(true);
            this.Anims.localPlayer.unitDestroy[type].anims.play(type+'-destroy-anim');

            this.playerData.localPlayer.unitHealthBar.hideHealthBar();
        } else {
            this.playerData.remotePlayer.unit.destroy();
            let type = this.playerData.remotePlayer.unitType;
            this.Anims.remotePlayer.unitDestroy[type].setVisible(true);
            this.Anims.remotePlayer.unitDestroy[type].anims.play(type+'-destroy-anim');

            this.playerData.remotePlayer.unitHealthBar.hideHealthBar();
        }
    }
    destroyPlayer(isHost: boolean) {
        if(isHost) {
            // this.playerData.localPlayer.player.setVisible(false);
            this.playerData.localPlayer.player.destroy();
    
            this.Anims.localPlayer.die.setVisible(true);
            this.Anims.localPlayer.die.anims.play('die-anim');
        } else {
            // this.playerData.remotePlayer.player.setVisible(false);
            this.playerData.remotePlayer.player.destroy();
            
            this.Anims.remotePlayer.die.setVisible(true);
            this.Anims.remotePlayer.die.anims.play('die-anim');
        }
    }

    attackUnit(isHost: boolean) {
        if(isHost) {
            this.playerData.localPlayer.unit.setVisible(false);
            let type = this.playerData.localPlayer.unitType;
            this.Anims.localPlayer.unitDestroy[type].setVisible(true);
            this.Anims.localPlayer.unitDestroy[type].anims.play(type+'-attack-anim');

            let damage = 0;
            if(type == "earth") damage = unitTypesDetail[type].attack;

            this.decreaseHealth(false, true, damage);
            this.decreaseHealth(false, false, damage);

        } else {
            this.playerData.remotePlayer.unit.setVisible(false);
            let type = this.playerData.remotePlayer.unitType;
            this.Anims.remotePlayer.unitDestroy[type].setVisible(true);
            this.Anims.remotePlayer.unitDestroy[type].anims.play(type+'-attack-anim');

            let damage = 0;
            if(type == "earth") damage = unitTypesDetail[type].attack;

            this.decreaseHealth(true, true, damage);
            this.decreaseHealth(true, false, damage);

        }
    }

    collisionHandler(bullet:any, player:any) {

        let damage = bullet.getData('damage');
        bullet.destroy();

        if(bullet.name == "bullet2") {
            return;
        }

        if(player.name == "player1") {
            this.Anims.localPlayer.explode.setVisible(true);
            this.Anims.localPlayer.explode.anims.play("explode-anim");

        }
        if(player.name == "player2") {
            this.Anims.remotePlayer.explode.setVisible(true);
            this.Anims.remotePlayer.explode.anims.play("explode-anim");

        }
        if(player.name == "unit1") {
            this.Anims.localPlayer.explodeUnit.setVisible(true);
            this.Anims.localPlayer.explodeUnit.anims.play("explode-anim");
 
        }
        if(player.name == "unit2") {
            this.Anims.remotePlayer.explodeUnit.setVisible(true);
            this.Anims.remotePlayer.explodeUnit.anims.play("explode-anim");
 
        }
    }

    update() {

    }
}
