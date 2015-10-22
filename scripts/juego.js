window.addEventListener("load", function () {
  var canvasWidth = 800, canvasHeight = 450;
  var Q = window.Q = new Quintus({development: true})
    .include("Scenes, Sprites, 2D, Input, Touch, UI, TMX, Audio")
    .setup({
      width: canvasWidth,   //to fit devices with a screne resolution of 1280 x 720
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
        this.add('2d, platformerControls');

      }
    });

    Q.setImageSmoothing(false);

    //define scene
    Q.scene("level", function(stage){
      stage.insert(new Q.Player());
    });

    //load assets
    Q.load("sprites.png, sprites.json", function() {    
    Q.compileSheets("sprites.png","sprites.json");
    Q.stageScene("level1");
  });

});
        
        
        
        
        
        