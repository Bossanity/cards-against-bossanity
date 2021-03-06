let handDiv = new PIXI.Graphics();
function initHand() {
    handDiv.lineStyle(0, 0x000000);
    handDiv.drawRect(0, 0, 720, 200);
    handDiv.x = app.view.width / 2 - handDiv.width / 2;
    handDiv.y = app.view.height-200;
    handDiv.interactive = true;
    app.stage.addChild(handDiv);
}

function renderCard(card) {
    let sprite = new PIXI.Sprite(app.loader.resources["card"].texture);
    sprite.x = 120 * (deck.firstEmptySlot);
    sprite.alpha = 0.9;

    let nameText = new PIXI.Text(card.displayName, cardText);
    nameText.x = sprite.width / 2 - nameText.width / 2;
    nameText.y = 12;
    let descriptionText = new PIXI.Text(card.description, cardDescText);
    descriptionText.x = sprite.width / 2 - descriptionText.width / 2;
    descriptionText.y = 36;
    let costText = new PIXI.Text("Cost: "+card.cost, cardDescText);
    costText.x = sprite.width / 2 - costText.width / 2;
    costText.y = 175;

    sprite.addChild(nameText);
    sprite.addChild(descriptionText);
    sprite.addChild(costText);


    let discardButton = new PIXI.Sprite(sheet.textures["x.png"]);
    discardButton.x = 120 * (deck.firstEmptySlot) + 36;
    discardButton.y = -10;
    discardButton.anchor.set(0, 1);
    discardButton.alpha = 0.9;
    discardButton.visible = states.discarding;
    discardButton.buttonType = "discard";

    sprite.interactive = true;
    sprite.on('pointerdown', function() {playCard(card, this, discardButton)});
    discardButton.interactive = true;
    discardButton.on('pointerdown', function() {discardCard(card, sprite, this)});

    handDiv.addChild(discardButton);
    handDiv.addChild(sprite);
}

function showDiscards(show) {
    handDiv.children.forEach(function(e) {
        if(e.buttonType === "discard") {
            e.visible = show;
        }
    });
    states.discarding = show;
}