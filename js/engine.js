// This function returns pixel ratio to support HiDPI
var PIXEL_RATIO = (function () {
  var ctx = document.createElement("canvas").getContext("2d"),
    dpr = window.devicePixelRatio || 1,
    bsr = ctx.webkitBackingStorePixelRatio ||
      ctx.mozBackingStorePixelRatio ||
      ctx.msBackingStorePixelRatio ||
      ctx.oBackingStorePixelRatio ||
      ctx.backingStorePixelRatio || 1;

  return dpr / bsr;
})();


var engine = {
  // Current scene
  scene: {},
  // Context2D
  ctx: null,
  // Pressed keys
  keys: {},
  // Game loop-specific data and logic
  gameLoop: {
    dt: 0,
    lastTime: 0,

    load: function() {
      if (!engine.scene) {
        throw "Scene is not set";
      }

      for (let objectId in engine.scene.objects) {
        engine.scene.objects[objectId].load();
      }
    },

    update: function() {
      if (!engine.scene) {
        throw "Scene is not set";
      }

      for (let objectId in engine.scene.objects) {
        engine.scene.objects[objectId].update();
      }
    },

    draw: function() {
      if (!engine.scene) {
        throw "Scene is not set";
      }

      engine.ctx.clearRect(0, 0, engine.ctx.canvas.width, engine.ctx.canvas.height);

      for (let objectId in engine.scene.objects) {
        engine.scene.objects[objectId].draw();
      }
    },

    keyDown: function(keyCode) {
      engine.keys[keyCode] = true;

      if (!engine.scene) {
        throw "Scene is not set";
      }

      for (let objectId in engine.scene.objects) {
        engine.scene.objects[objectId].keyDown(keyCode);
      }
    },

    keyUp: function(keyCode) {
      engine.keys[keyCode] = false;

      if (!engine.scene) {
        throw "Scene is not set";
      }

      for (let objectId in engine.scene.objects) {
        engine.scene.objects[objectId].keyDown(keyCode);
      }
    },


    keyPress: function(keyCode) {
      if (!engine.scene) {
        throw "Scene is not set";
      }

      for (let objectId in engine.scene.objects) {
        engine.scene.objects[objectId].keyPress(keyCode);
      }
    },

    mouseDown: function(button, posX, posY) {
      if (!engine.scene) {
        throw "Scene is not set";
      }

      for (let objectId in engine.scene.objects) {
        engine.scene.objects[objectId].mouseDown(button, posX, posY);
      }
    },
  },

  // Starts infinity gameloop
  startGameLoop: function(ctx) {
    engine.ctx = ctx;

    // Enable input for canvas
    engine.ctx.canvas.setAttribute("tabindex", 0);
    engine.ctx.canvas.focus();

    // Event listeners
    engine.ctx.canvas.addEventListener("keydown", function(event) { engine.gameLoop.keyDown(event.keyCode); }, false);
    engine.ctx.canvas.addEventListener("keyup", function(event) { engine.gameLoop.keyUp(event.keyCode); }, false);
    engine.ctx.canvas.addEventListener("keypress", function(event) { engine.gameLoop.keyPress(event.keyCode); }, false);
    engine.ctx.canvas.addEventListener("mousedown", function(event) { engine.gameLoop.mouseDown(event.button, event.clientX, event.clientY); }, false);

    // Canvas size
    engine.ctx.canvas.width = engine.ctx.canvas.clientWidth * PIXEL_RATIO;
    engine.ctx.canvas.height = engine.ctx.canvas.clientHeight * PIXEL_RATIO;
    engine.ctx.setTransform(PIXEL_RATIO, 0, 0, PIXEL_RATIO, 0, 0);

    engine.gameLoop.interval = setInterval(engine.gameLoopInternal, 0)
  },

  gameLoopInternal: function() {
    let currentTime = getTime();
    engine.gameLoop.dt = (currentTime - engine.gameLoop.lastTime) / 100;
    engine.gameLoop.lastTime = currentTime;

    engine.gameLoop.update();

    engine.gameLoop.draw();
  },

  setScene: function(scene) {
    engine.scene = scene;
    engine.gameLoop.load();

    if (engine.gameLoop.interval) {
      clearInterval(engine.gameLoop.interval);
      engine.gameLoop.interval = setInterval(engine.gameLoopInternal, 0)
    }
  },

  isKeyDown: function(keyCode) {
    return engine.keys[keyCode];
  },

  // Fabrics

  // Creates new scene
  newScene: function(ctx) {
    return {
      ctx: ctx,
      objects: []
    }
  },

  // Creates new simple game object
  newObject: function(x, y) {
    return {
      x: x || 0,
      y: y || 0,

      load: function() {},
      update: function() {},
      draw: function() {},
      keyDown: function() {},
      keyUp: function() {},
      keyPress: function() {},
      mouseDown: function() {},
    }
  },

  // Creates new filled rectangle object
  newFillRect: function(x, y, w, h, color) {
    let obj = engine.newObject(x, y);
    obj.w = w || 0;
    obj.h = h || 0;
    obj.color = color || "#FFFFFF";

    obj.draw = function() {
      let oldStyle = engine.ctx.fillStyle;

      engine.ctx.fillStyle = color;
      engine.ctx.fillRect(obj.x, obj.y, obj.w, obj.h);
      engine.ctx.fillStyle = oldStyle;
    };

    return obj;
  },

  // Creates new text object
  newText: function(x, y, text, font, color, alignment) {
    let obj = engine.newObject(x, y);
    obj.text = text || "";
    obj.font = font || "30px Arial";
    obj.color = color || "#FFFFFF";
    obj.alignment = alignment || "center";

    obj.draw = function() {
      let oldStyle = engine.ctx.fillStyle;
      let oldFont = engine.ctx.font;
      let oldAlignment = engine.ctx.textAlign;

      engine.ctx.fillStyle = obj.color;
      engine.ctx.font = obj.font;
      engine.ctx.textAlign = obj.alignment;
      engine.ctx.fillText(obj.text, obj.x, obj.y);
      engine.ctx.textAlign = oldAlignment;
      engine.ctx.font = oldFont;
      engine.ctx.fillStyle = oldStyle;
    };

    return obj;
  }
};

// Returns time in milliseconds
function getTime() {
  return (new Date()).getTime();
}