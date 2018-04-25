let pressEnterText = engine.newText(canvas.clientWidth / 2, canvas.clientHeight / 2, "- Press enter to start -", "30px ArcadeClassic");

// Hints for players
let hint1 = engine.newText(canvas.clientWidth / 2, canvas.clientHeight / 2 - 75, "W/S keys for 1st Player", "25px ArcadeClassic", "#FAA");
let hint2 = engine.newText(canvas.clientWidth / 2, canvas.clientHeight / 2 + 75, "Up/Down arrow keys for 2nd Player", "25px ArcadeClassic", "#AAF");

let hint3 = engine.newText(canvas.clientWidth / 2, canvas.clientHeight / 2 + 200, "Player that first reach 5 victories - win!", "25px ArcadeClassic", "#FFA");

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
    engine.setScene(gameScene);
  }
};

// Add object to scene
pressEnterScene.objects.push(pressEnterText);
pressEnterScene.objects.push(hint1);
pressEnterScene.objects.push(hint2);
pressEnterScene.objects.push(hint3);