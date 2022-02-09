let elapsed = 0; //Total frames
function run() {
    sheet = app.loader.resources["assets/sprites.json"].spritesheet;

    drawTiles();

    //createObstacle("rock", app.view.width/2-32, app.view.height/2-32);

    createAnimation("energyBallAnim", sheet.animations['energyBallAnim'], 0.2);
    createAnimation("shooterWalk", sheet.animations['shooterWalk'], 0.15);
    createAnimation("bossWalk", sheet.animations['bossWalk'], 0.07);

    createUnit("boss", "boss", {moveSpeed: 25, invTime: 10, maxHp: 2500, ai: true, x: 100});
    createUnit("shooter", "player", {moveSpeed: 70, maxHp: 150, invTime: 40, x: app.view.width-100});

    createCards(); // all cards, saved in cards.js

    Object.keys(cards).forEach(function(i){deck.cards.push(cards[i])}); // automatically add all cards to deck

    createObstacle("rock", {x: app.view.width/2, y: app.view.height/2, scale: 1, effects: {unitCollide: 1, projDelete: 1}}); // testing rock

    let debug1 = new PIXI.Text("");
    let debug2 = new PIXI.Text("");
    debug2.y = 25;
    app.stage.addChild(debug1);
    app.stage.addChild(debug2);

    initHand();

    app.ticker.add((delta) => {
        elapsed += delta; //add time since last tick (in frames)
        for (let i in units) {
            //units move based on their direction and speed
            moveUnit(units[i], delta);
            if(units[i].ai) { //Units with ai:true will automatically pursue the player.
                aiMove(i);
            }
        }
        projectiles.forEach(function(i) {
            //projectiles move based on their direction and speed
            moveProjectile(i, delta);
            projectileDamage(i); //if the projectile hits a non-owner unit, deal damage and disappear
        })
        handleInput();
        collideDamage("player"); //Check for collision with other units
        if(deck.handCardCount === 0 && deck.drawPileCards === 0) {
            deck.resetDrawPile();
            timers.cardDraw = elapsed;
        }
        if(deck.handCardCount<6 && timers.cardDraw+timersLength.cardDraw<elapsed && deck.drawPileCards !== 0) {
            deck.drawCard();
            timers.cardDraw = elapsed;
        }
        checkObstacles(delta);
        debug1.text = "Boss health: "+units['boss'].hp;
        debug2.text = "Player health: "+units['player'].hp + " / " + units['player'].maxHp;
    });
}