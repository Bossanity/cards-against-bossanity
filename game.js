//unit name, height, width, movement speed
createUnit("boss", {size: 60, moveSpeed: 20, color: 0x660000});
createUnit("player", {size: 25, moveSpeed: 75, color: 0x000066});

//Global ticker
let elapsed = 0.0; //Total frames
app.ticker.add((delta) => {
    elapsed += delta; //add time since last tick (in frames)
    let secondCount = Math.floor(elapsed/60); // Total secondCount
    for(let i in units) {
        //units move based on their moving property
        moveUnit(units[i], delta);
    }
    for(let i in projectiles) {
        //projectiles always move in their predefined direction
        moveProjectile(projectiles[i], delta);
    }
    bossAiMove();
});