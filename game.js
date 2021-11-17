let elapsed = 0.0; //Total frames
function run() {
    createUnit("dude", "boss", {moveSpeed: 20, scale: 2});
    createUnit("shooter", "player", {moveSpeed: 75});

    app.ticker.add((delta) => {
        elapsed += delta; //add time since last tick (in frames)
        let secondCount = Math.floor(elapsed / 60); // Total secondCount
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