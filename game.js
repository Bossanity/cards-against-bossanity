let elapsed = 0; //Total frames
function run() {
    sheet = app.loader.resources["assets/sprites.json"].spritesheet;
    createAnimation("shooterWalk", sheet.animations['shooterwalk'], 0.15);
    createAnimation("bossWalk", sheet.animations['bossmove'], 0.07);

    createUnit("boss", "boss", {moveSpeed: 25});
    createUnit("shooter", "player", {moveSpeed: 75, controlled: true});

    createCard("fireShield", "Fire Shield", function(){
        for(let i = 0; i<6; i++) {
            createProjectile("arrow", "boss", {
                locked: true,
                speed: 5,
                direction: i*60,
                lifespan: 300,
                effects: {rotate: 720}
            })}
        for(let i = 0; i<6; i++) {
            createProjectile("arrow", "boss", {
                locked: true,
                speed: 7.5,
                direction: i*60,
                lifespan: 300,
                effects: {rotate: -720}
            })}
    }, 100, 5, "Fire shields the boss's butt");
    createCard("whirlwind", "Whirlwind", function(){
        for(let i = 0; i<9; i++) {
            createProjectile("arrow", "boss", {
                locked: true,
                speed: 10,
                direction: i*40,
                lifespan: 150,
                effects: {rotate: 1000, tracer: [0.3, 5]}
            })}
    }, 100, 3, "Whirlwinds your behind");
    createCard("nova", "Nova", function(){
        for(let i = 0; i<90; i++) {
            createProjectile("arrow", "boss", {
                speed: 6,
                direction: i*4,
                lifespan: 80,
                effects: {decelerate: 4, rotate: 120}
            })}
    }, 100, 4, "Novas ur ass LMAOOO");

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
        }
        projectiles.forEach(function(i) {
            //projectiles always move in their predefined direction
            moveProjectile(i, delta);
        })
        handleInput();
        bossAiMove();
        if(deck.handCardCount<6 && timers.cardDraw+360<elapsed && deck.drawPileCards !== 0) {deck.drawCard(); timers.cardDraw = elapsed}
        debug1.text = "Time to next card: "+Math.round(Math.max(timers.cardDraw+360-elapsed, 0)/6)/10+"s";
        debug2.text = "Cards in draw pile: "+deck.drawPileCards;
    });
}