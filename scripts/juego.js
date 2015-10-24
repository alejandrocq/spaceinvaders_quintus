window.addEventListener("load", function () {
  var canvasWidth = 600, canvasHeight = 600;
  var lEnemies = 5;
  var Q = window.Q = new Quintus({development: true})
    .include("Scenes, Sprites, 2D, Input, Touch, UI, TMX, Audio")
    .setup({
      width: canvasWidth,  
      height: canvasHeight,
      scaleToFit: true
    }).controls().touch();
    
    Q.gravityY = 0;
    
    Q.component ("aiLittle", {
        added: function (){
            var enemy = this.entity;
            enemy.timer = 1;
            enemy.step = function (dt) {
                this.timer -= dt;
                if (this.timer <= 0){
                    var aux = this.p.vx;
                    this.p.vx = this.p.vy;
                    this.p.vy = -aux;
                    this.timer = 2;
                }
            }
        }
    });
    
    
    //define player
    
    Q.Sprite.extend("Player",{
        init: function(p) {
            this._super(p, {
                sheet: "player",
                speed: 200
        });
            
        this.p.y -= this.p.h/2;
        this.add('2d, platformerControls');
        }
    });
    
    Q.Sprite.extend("LittleEnemy",{        
        init: function (p) {
            this._super (p, {
                sheet: "enemie".concat(Math.floor(lEnemies * Math.random())+1),
                scale: 0.5,
                vx: -40,
            });
            this.p.x -= this.p.w/2;
            this.p.y -= this.p.h/2;
            this.add("2d, aiLittle");
        },        
    });

    Q.setImageSmoothing(false);

    //define scene
    Q.scene("level", function(stage){
        Q.stageTMX("level.tmx", stage);
    });

    //load assets
    Q.loadTMX("level.tmx, characters.jpg, sprites.json", function() {   
        Q.compileSheets("characters.jpg", "sprites.json");
        Q.stageScene("level");
    });

});
        
        
        
        
        
        