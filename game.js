let elapsed = 0; //Total frames
function run() {
    sheet = app.loader.resources["assets/sprites.json"].spritesheet;
    createAnimation("shooterWalk", sheet.animations['shooterwalk'], 0.15);
    createAnimation("bossWalk", sheet.animations['bossmove'], 0.07);

    createUnit("boss", "boss", {moveSpeed: 25, invTime: 10, maxHp: 2500, ai: false, x: 100});
    createUnit("shooter", "player", {moveSpeed: 70, maxHp: 15000, invTime: 40, x: app.view.width-100});

    createCard("fireShield", "Fire Shield", function(){
        for(let i = 0; i<6; i++) {
            createProjectile("arrow", "boss", {
                locked: true,
                speed: 7.5,
                direction: i*60,
                lifespan: 300,
                effects: {turn: 720}
            })}
        for(let i = 0; i<6; i++) {
            createProjectile("arrow", "boss", {
                locked: true,
                speed: 7.5,
                direction: i*60,
                lifespan: 300,
                effects: {turn: -720}
            })}
    }, 100, 5, "Fire shields the boss's butt");
    createCard("whirlwind", "Whirlwind", function(){
        for(let i = 0; i<9; i++) {
            createProjectile("arrow", "boss", {
                locked: true,
                speed: 10,
                direction: i*40,
                lifespan: 150,
                effects: {turn: 1000, tracer: [5, 0.3]}
            })}
    }, 100, 3, "Whirlwinds your behind");
    createCard("nova", "Nova", function(){
        for(let i = 0; i<90; i++) {
            createProjectile("arrow", "boss", {
                speed: 6,
                direction: i*4,
                lifespan: 80,
                effects: {decelerate: 4, turn: 120}
            })}
    }, 100, 4, "Novas ur ass LMAOOO");
    createCard("curtain", "Curtain", function(){
        for(let i=0; i<20; i++) {
            createProjectile("arrow", "boss", {
                initX: 1600/20*(i),
                initY: -100,
                lifespan: 240,
                direction: 180,
                speed: 5
            })
        }
    }, 100, 4, "Creates a curtain of projectiles from the top of the screen")
    createCard("blast", "Blast", function(){
        for(let i=0; i<5; i++) {
            createProjectile("arrow", "boss", {
                direction: getPlayerDirection("boss")+(i-2)*25,
                speed: 0.2,
                effects: {turn: (i-2)*-30, accelerate: 10, tracer: [6, 0.75]},
                lifespan: 120,
                tracerEffects: {turn: 180}
            })
        }
    }, 250, 5, "Blasts. Effective at long range")

    Object.keys(cards).forEach(function(i){deck.cards.push(cards[i])}); // automatically add all cards to deck

    let debug1 = new PIXI.Text("");
    let debug2 = new PIXI.Text("");
    debug2.y = 25;
    app.stage.addChild(debug1);
    app.stage.addChild(debug2);

    initHand();

    app.ticker.add((delta) => {
        elapsed += delta; //add time since last tick (in frames)
        for (let i in units) {
            //units move based on their moving property
            moveUnit(units[i], delta);
            if(units[i].ai) {
                aiMove(i);
            }
        }
        projectiles.forEach(function(i) {
            //projectiles always move in their predefined direction
            moveProjectile(i, delta);
            projectileDamage(i);
        })
        handleInput();
        collideDamage("player");
        if(deck.handCardCount<6 && timers.cardDraw+timersLength.cardDraw<elapsed && deck.drawPileCards !== 0) {deck.drawCard(); timers.cardDraw = elapsed}
        debug1.text = "Boss health: "+units['boss'].hp + " / " + units['boss'].maxHp;
        debug2.text = "Player health: "+units['player'].hp + " / " + units['player'].maxHp;
    });
}