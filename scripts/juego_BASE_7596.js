window.addEventListener("load", function () {
  var canvasWidth = 600, canvasHeight = 600;
  var lEnemies = 5;
  var numberOfEnemies = 18;
  var score = 0;
  var fireb = true;
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
            
            enemy.interval = setInterval(this.fire, Math.random()*10000+6000, enemy);
        },
        
        fire: function (enemy) {
            
            var proj = new Q.projectile();
            proj.set(enemy.p.x, enemy.p.y + enemy.p.h/2 + proj.p.h/2, 100, true);
            Q.stage().insert(proj);
        
        } 
        
    });
    
    
    //define player    
    Q.Sprite.extend("Player",{
        init: function(p) {
            this._super(p, {
                sheet: "player",
                speed: 200
        });    
        
        this.lives = 3;
        this.p.y -= this.p.h/2;
        this.add('2d, platformerControls');
        this.firebFunction = function () {
            fireb = true;
        }
        this.fire = function(){
            if (fireb) {
                var proj = new Q.projectile();
                proj.set(this.p.x, this.p.y - this.p.h/2 - proj.p.h/2, -100, false);
                Q.stage().insert(proj);
                fireb = false;
                setTimeout(this.firebFunction, 1000);
                
            }
            
           
        }
        
        this.on("hit", function(collision) {
            if(collision.obj.isA("projectile")) {
                this.lives--;
                document.getElementById("lives").innerHTML = "Lives: "+this.lives;
                if (this.lives == 0) {
                    this.destroy();
                    Q.clearStages();
                    Q.stageScene("endGame",1, { label: "You Lost!" });
                }
            }
        })
        
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
            this.p.collisionMask = 16;
            this.on("hit", function(collision) {
                if (collision.obj.isA("projectile")) {
                        this.destroy();
                        numberOfEnemies--;
                        clearInterval(this.interval);
                        score += 100;
                        document.getElementById("score").innerHTML = "Score: "+score;
                        if (numberOfEnemies == 0) {
                            Q.clearStages();
                            Q.stageScene("endGame",1, { label: "You Won!" });
                            
                        }
                    
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
        set: function(posX, posY, v0, enemy) {
            this.p.x = posX;
            this.p.y = posY;
            this.p.vy = v0;
            if (enemy) {
                this.p.collisionMask = 16;
            }
        }
    });
    
    Q.scene('endGame',function(stage) {
        
        var box = stage.insert(new Q.UI.Container({
            x: Q.width/2, y: Q.height/2, fill: "rgba(0,0,0,0.5)"
        }));
  
        var button = box.insert(new Q.UI.Button({ x: 0, y: 0, fill: "#CCCCCC",
                                           label: "Play Again" }))         
        var label = box.insert(new Q.UI.Text({x:10, y: -10 - button.p.h, color: "#FFFFFF", 
                                        label: stage.options.label }));
        
        button.on("click",function() {
            Q.clearStages();
            Q.stageScene('level');
            
        });
  
        box.fit(20);
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
    
    function initializeData() {
        score = 0;
        lives = 3;
        document.getElementById("score").innerHTML = "Score: "+score;
        document.getElementById("lives").innerHTML = "Lives: "+lives;
    }
    

    //define scene
    Q.scene("level", function(stage){
        initializeData();
        Q.stageTMX("level.tmx", stage);
        Q.state.set ("pause", false);
    });

    //load assets
    Q.loadTMX("level.tmx, characters.jpg, sprites.json", function() {   
        Q.compileSheets("characters.jpg", "sprites.json");
        Q.stageScene("level");
    });

});
        
        
        
        
        
        