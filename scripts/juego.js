window.addEventListener("load", function () {
  var canvasWidth = 600, canvasHeight = 600;
  var lEnemies = 5;
  var score = 0;
  var Q = window.Q = new Quintus({development: true})
    .include("Scenes, Sprites, 2D, Input, Touch, UI, TMX, Audio")
    .setup({
      width: canvasWidth,  
      height: canvasHeight,
      scaleToFit: true
    }).controls().touch();
    
    Q.gravityY = 0;

    
    //define AI for little enemies
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
        this.fire = function(){
            var proj = new Q.projectile();
            proj.set(this.p.x, this.p.y - this.p.h/2 - proj.p.h/2, -100);
            Q.stage().insert(proj);
        }
        Q.input.on("fire", this, "fire");
        }
    });
    
    //define little enemies
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
            this.on("hit", function(collision) {
                if (collision.obj.isA("projectile")) {
                    this.destroy();
                    score += 100;
                    document.getElementById("score").innerHTML = "Score: "+score;
                }
            });
        },        
    });
    
    //define projectile
    Q.Sprite.extend("projectile", {
        init: function (p){
            this._super(p, {
                sheet: "playerprojectile"
            });
            this.add("2d");
            this.on("hit", this.destroy);
        },
        set: function(posX, posY, v0) {
            this.p.x = posX;
            this.p.y = posY;
            this.p.vy = v0;
        }
    });

    Q.setImageSmoothing(false);
    
    //add controls
    Q.input.on ("P", null, pause);    
    function pause () {
        if (Q.state.get("pause"))
            Q.unpauseGame();
        else
            Q.pauseGame();
        Q.state.set("pause", !Q.state.get("pause"));
    }

    //define scene
    Q.scene("level", function(stage){
        Q.stageTMX("level.tmx", stage);
        Q.state.set ("pause", false);
    });

    //load assets
    Q.loadTMX("level.tmx, characters.jpg, sprites.json", function() {   
        Q.compileSheets("characters.jpg", "sprites.json");
        Q.stageScene("level");
    });

});
        
        
        
        
        
        