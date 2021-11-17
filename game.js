let elapsed = 0.0; //Total frames
function run() {
    createAnimation("shooterWalk", sheet.animations['shooterwalk'], 0.15);
    createUnit("shooter", "boss", {moveSpeed: 20, scale: 2});
    createUnit("shooter", "player", {moveSpeed: 75, scale: 1.15});

    app.ticker.add((delta) => {
        elapsed += delta; //add time since last tick (in frames)
        let secondCount = Math.floor(elapsed / 60); // Total secondCount
        for (let i in units) {
            //move units based on their 'moving' property
            moveUnit(units[i], delta);
        }
        for (let i in projectiles) {
            //move projectiles based on their direction
            moveProjectile(projectiles[i], delta);
        }
        bossAiMove();
    });
}