function createUnit(name, height, width, speed) {
    let unit = new Unit(height, width, speed);
    units[name] = unit;
    app.stage.addChild(units[name]);
}

function moveUnit(unit, delta) {
    let input = unit.moving;
    //Perhaps this list of ifs could be done better
    //Some sort of genius solution
    if(input.includes("W")) {
        unit.speedY-=1;
    }
    if(input.includes("A")) {
        unit.speedX-=1;
    }
    if(input.includes("D")) {
        unit.speedX+=1;
    }
    if(input.includes("S")) {
        unit.speedY+=1;
    }
    unit.speedX *= frictionFactor;
    unit.speedY *= frictionFactor;
    //speedX and speedY effectively act as acceleration
    unit.x += unit.speedX * delta/60 * unit.moveSpeed;
    unit.y += unit.speedY * delta/60 * unit.moveSpeed;
}

function createProjectile(owner, props) {
    // function to create projectile, store it in list and also get it onto the screen
    let proj = projectiles.push(new Projectile(owner, props));
    app.stage.addChild(projectiles[proj-1]);
}

function moveProjectile(proj, delta) {
    //proj.direction being the predefined direction in degrees
    if(elapsed>proj.birth+proj.lifespan) {
        let index = projectiles.indexOf(proj);
        app.stage.removeChild(proj);
        projectiles.splice(index, 1);
    }
    proj.x += proj.speed * delta * Math.sin(rad*proj.direction);
    proj.y += proj.speed * delta * Math.sin(rad*(proj.direction-90));
}