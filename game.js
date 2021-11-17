let elapsed = 0.0; //Total frames
function run() {
    createAnimation("shooterWalk", sheet.animations['shooterwalk'], 0.15);

    createUnit("shooter", "boss", {moveSpeed: 20, scale: 2});
    createUnit("shooter", "player", {moveSpeed: 75, scale: 1.15});

    createCard("fireball", "Fireball", function(){
        createProjectile("arrow", "boss", {speed: 5, lifespan: 180, scale: 3});
    }, 100, 5);
    createCard("shooting", "Shooting", function(){
        createProjectile("arrow", "boss", {speed: 10, lifespan: 180, scale: 3});
    }, 100, 3);
    createCard("leap", "Leap", function(){
        createProjectile("arrow", "boss", {speed: 0, lifespan: 180, scale: 3});
    }, 100, 4);

    Object.keys(cards).forEach(function(i){deck.cards.push(cards[i])}); // automatically add all cards to deck

    app.ticker.add((delta) => {
        elapsed += delta; //add time since last tick (in frames)
        for (let i in units) {
            //units move based on their moving property
            moveUnit(units[i], delta);
        }
        for (let i in projectiles) {
            //projectiles always move in their predefined direction
            moveProjectile(projectiles[i], delta);
        }
        bossAiMove();
    });
}