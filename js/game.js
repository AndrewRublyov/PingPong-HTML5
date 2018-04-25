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

let bounds = engine.newObject();

bounds.load = function() {
  colorBounds();
};

bounds.keyDown = function(keyCode) {
  if (keyCode === 27) {
    uncolorBounds();
    engine.setScene(pressEnterScene);
  }
};

gameScene.objects.push(bounds);