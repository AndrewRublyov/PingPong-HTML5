let canvas = document.getElementById("game");

function newPressEnterScene() {
  let pressEnterScene = engine.newScene();

  let pressEnterText = engine.newText(canvas.clientWidth / 2, canvas.clientHeight / 2, "- Press enter to start -", "30px ArcadeClassic");

  // Hints for players
  let hint1 = engine.newText(canvas.clientWidth / 2, canvas.clientHeight / 2 - 75, "W/S keys for 1st Player", "25px ArcadeClassic", "#FAA");
  let hint2 = engine.newText(canvas.clientWidth / 2, canvas.clientHeight / 2 + 75, "Up/Down arrow keys for 2nd Player", "25px ArcadeClassic", "#AAF");
  let hint3 = engine.newText(canvas.clientWidth / 2, canvas.clientHeight / 2 + 200, "Player that first reach 3 victories - win!", "25px ArcadeClassic", "#FFA");

  function switchTextVisibility() {
    if (pressEnterText.text === "") {
      pressEnterText.text = "- Press enter to start -";
    }
    else {
      pressEnterText.text = "";
    }
  }

  pressEnterText.load = function() {
    pressEnterText.interval = setInterval(switchTextVisibility, 500);
  };

  pressEnterText.keyDown = function(keyCode) {
    // 13 -> enter key
    if (keyCode === 13) {
      clearInterval(pressEnterText.interval);
      engine.setScene(newGameScene());
    }
  };

  // Add object to scene
  pressEnterScene.objects.push(pressEnterText);
  pressEnterScene.objects.push(hint1);
  pressEnterScene.objects.push(hint2);
  pressEnterScene.objects.push(hint3);

  return pressEnterScene;
}

function newGameScene() {
  let gameScene = engine.newScene();

  const BOARD_WIDTH = 25;
  const BOARD_HEIGHT = 150;
  const BOUNCE_SIZE = 25;
  const BOUNCE_START_SPEED = 10;
  const BOUNCE_ACCELERATION = 0.1;
  const PLAYER1_UP_KEY = 87;
  const PLAYER1_DOWN_KEY = 83;
  const PLAYER2_UP_KEY = 38;
  const PLAYER2_DOWN_KEY = 40;
  const PLAYERS_SPEED = 100;   // per second

  const CANVAS_WIDTH = parseInt(canvas.style.width);
  const CANVAS_HEIGHT = parseInt(canvas.style.height);

  const BORDER_RECTS = {
    top: {x: 0, y: 0, w: CANVAS_WIDTH, h: 1},
    bottom: {x: 0, y: CANVAS_HEIGHT, w: CANVAS_WIDTH, h: 1},
    left: {x: 0, y: 0, w: 1, h: CANVAS_HEIGHT},
    right: {x: CANVAS_WIDTH, y: 0, w: 1, h: CANVAS_HEIGHT},
  };

  let gameManager = engine.newObject();
  let player1 = engine.newFillRect(0, (CANVAS_HEIGHT - BOARD_HEIGHT) / 2, BOARD_WIDTH, BOARD_HEIGHT, "white");
  let player2 = engine.newFillRect(CANVAS_WIDTH - 25, (CANVAS_HEIGHT - BOARD_HEIGHT) / 2, BOARD_WIDTH, BOARD_HEIGHT, "white");
  let score1 = engine.newText(75, 25, "Player 1: 0", "25px ArcadeClassic", "#FAA", "left");
  let score2 = engine.newText(CANVAS_WIDTH - 75, 25, "Player 2: 0", "25px ArcadeClassic", "#AAF", "right");
  let bounce = engine.newFillRect((CANVAS_WIDTH - BOUNCE_SIZE) / 2, (CANVAS_HEIGHT - BOUNCE_SIZE) / 2, BOUNCE_SIZE, BOUNCE_SIZE, "#FFF");
  let counter = engine.newText((CANVAS_WIDTH - BOUNCE_SIZE) / 2, (CANVAS_HEIGHT - BOUNCE_SIZE) / 2 - 75, "Round starts in", "25px ArcadeClassic", "#FFF");

  let gameData;
  let timer;
  let isGameStarted;

  function colorBounds() {
    canvas.style.borderLeftColor = "#F44";
    canvas.style.borderRightColor = "#44f";

    canvas.style.borderTopColor = "#555";
    canvas.style.borderBottomColor = "#555";

    canvas.style.borderWidth = "20px";
  }

  function uncolorBounds() {
    canvas.style.borderLeftColor = "#FFF";
    canvas.style.borderRightColor = "#FFF";

    canvas.style.borderTopColor = "#FFF";
    canvas.style.borderBottomColor = "#FFF";

    canvas.style.borderWidth = "7px";
  }

  function startTimer() {
    let decreaseTimer = function() {
      timer--;

      if (timer <= 0) {
        clearInterval(interval);
        startRound();
      }
    };

    let interval = setInterval(decreaseTimer, 1000)
  }

  function startRound() {
    isGameStarted = true;
  }

  function resetState() {
    isGameStarted = false;

    player1.y = player2.y= (CANVAS_HEIGHT - BOARD_HEIGHT) / 2;

    bounce.x = (CANVAS_WIDTH - BOUNCE_SIZE) / 2;
    bounce.y = (CANVAS_HEIGHT - BOUNCE_SIZE) / 2;
    bounce.speed = BOUNCE_START_SPEED;

    score1.text = "Player 1: " + gameData.scores.player1;
    score2.text = "Player 2: " + gameData.scores.player2;

    // Seconds to prepare
    timer = 3;
    startTimer();
  }

  function isColliding(rect1, rect2) {
    return rect1.x < rect2.x + rect2.w &&
      rect1.x + rect1.w > rect2.x &&
      rect1.y < rect2.y + rect2.h &&
      rect1.h + rect1.y > rect2.y;
  }

  gameManager.load = function() {
    colorBounds();

    gameData = {
      scores: {
        player1: 0,
        player2: 0
      }
    };

    resetState();
  };

  player1.update = function() {
    if (!isGameStarted) return;

    if (engine.isKeyDown(PLAYER1_UP_KEY)) {
      player1.y = Math.max(player1.y - PLAYERS_SPEED * engine.gameLoop.dt, 0);
    }
    if (engine.isKeyDown(PLAYER1_DOWN_KEY)) {
      player1.y = Math.min(player1.y + PLAYERS_SPEED * engine.gameLoop.dt, CANVAS_HEIGHT - BOARD_HEIGHT);
    }
  };

  player2.update = function() {
    if (!isGameStarted) return;

    if (engine.isKeyDown(PLAYER2_UP_KEY)) {
      player2.y = Math.max(player2.y - PLAYERS_SPEED * engine.gameLoop.dt, 0);
    }
    if (engine.isKeyDown(PLAYER2_DOWN_KEY)) {
      player2.y = Math.min(player2.y + PLAYERS_SPEED * engine.gameLoop.dt, CANVAS_HEIGHT - BOARD_HEIGHT);
    }
  };

  counter.update = function() {
    if (isGameStarted) {
      counter.text = "";
    } else {
      counter.text = "Round starts in... " + timer;
    }
  };

  bounce.load = function() {
    bounce.direction = {x: -1, y: -1};
    bounce.speed = BOUNCE_START_SPEED;
  };

  bounce.update = function() {
    if (!isGameStarted) return;

    if (isColliding(bounce, BORDER_RECTS.top)
      || isColliding(bounce, BORDER_RECTS.bottom))
    {
      bounce.direction.y = bounce.direction.y === -1 ? 1 : -1;
    }
    else if (isColliding(bounce, player1)
    || isColliding(bounce, player2))
    {
      bounce.direction.x = bounce.direction.x === -1 ? 1 : -1;
    }
    else if (isColliding(bounce, BORDER_RECTS.left))
    {
      gameData.scores.player1++;

      if (gameData.scores.player1 === 3) {
        engine.setScene(newPressEnterScene());
      } else {
        resetState();
      }
    }
    else if (isColliding(bounce, BORDER_RECTS.right))
    {
      gameData.scores.player2++;

      if (gameData.scores.player2 === 3) {
        uncolorBounds();
        engine.setScene(newPressEnterScene());
      } else {
        resetState();
      }
    }

    bounce.x += bounce.direction.x * bounce.speed * engine.gameLoop.dt;
    bounce.y += bounce.direction.y * bounce.speed * engine.gameLoop.dt;

    bounce.speed += BOUNCE_ACCELERATION * engine.gameLoop.dt;
  };

  gameManager.keyDown = function(keyCode) {
    if (keyCode === 27 && isGameStarted) {
      uncolorBounds();

      engine.setScene(newPressEnterScene());
    }
  };

  gameScene.objects.push(gameManager);
  gameScene.objects.push(player1);
  gameScene.objects.push(player2);
  gameScene.objects.push(score1);
  gameScene.objects.push(score2);
  gameScene.objects.push(counter);
  gameScene.objects.push(bounce);

  return gameScene;
}