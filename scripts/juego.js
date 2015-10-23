window.addEventListener("load", function () {
  var canvasWidth = 800, canvasHeight = 450;
  var canvasWidth = 600, canvasHeight = 600;
  var Q = window.Q = new Quintus({development: true})
    .include("Scenes, Sprites, 2D, Input, Touch, UI, TMX, Audio")
    .setup({
      width: canvasWidth,  
      height: canvasHeight,
      scaleToFit: true
    }).controls().touch();
    
    Q.gravityY = 0;
    
    
    
    //define player
    
    Q.Sprite.extend("Player",{
        init: function(p) {
            this._super(p, {
                sheet: "player",
                x: canvasWidth/2,
                y: canvasHeight,
                speed: 200
        });
            
        this.p.y -= this.p.h/2;
        this.add('2d, platformerControls');

        }
    });

    Q.setImageSmoothing(false);

    //define scene
    Q.scene("level", function(stage){
        Q.stageTMX("level.tmx", stage);
        stage.insert(new Q.Player());
      
    });

    //load assets
    Q.loadTMX("level.tmx, border.png, sprites.png, sprites.json", function() {   
        Q.compileSheets("sprites.png", "border.png", "sprites.json");
        Q.compileSheets("sprites.png", "sprites.json");
        Q.stageScene("level");
    });

});
        
        
        
        
        
        