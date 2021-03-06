//thanks stackoverflow, now removing stuff from an array is easy
Array.prototype.remove = function() {
    let what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
}

function createUnit(spriteName, name, props) {
    units[name] = new Unit(spriteName, props);
    app.stage.addChild(units[name]);
}

function moveUnit(unit, delta) {
    let animation = animations[unit.baseSprite+"Walk"];
    if(unit.moving && animation !== undefined && !unit.playing) {
        unit.textures = animation.arr;
        unit.animationSpeed = animation.speed;
        unit.play();
    }
    if(!unit.moving) {
        unit.resetAnimation();
    }
    if(Math.sin(rad*unit.direction)<0) { //negative values mean unit is going left
        unit.scale.x = Math.abs(unit.scale.x)*-1; //flip left
    } else {
        unit.scale.x = Math.abs(unit.scale.x); //flip right
    }
    if(unit.moving) {
        unit.speedX += Math.sin(rad * unit.direction);
        unit.speedY += Math.sin(rad * (unit.direction - 90));
    }
    unit.speedX *= frictionFactor;
    unit.speedY *= frictionFactor;
    let goX = unit.speedX * delta/60 * unit.moveSpeed;
    let goY = unit.speedY * delta/60 * unit.moveSpeed;
    //speedX and speedY effectively act as acceleration
    unit.x += goX;
    unit.y += goY;
    unit.x = Math.min(Math.max(unit.x, unit.width/2), app.view.width - unit.width/2);
    unit.y = Math.min(Math.max(unit.y, unit.height/2), app.view.height - unit.height/2);
}

function deleteUnit(unit) {
    unit.moving = false;
    unit.moveSpeed = 0;
    unit.ai = false;
    unit.lastHit = Infinity;
    app.stage.removeChild(unit);
}

function createProjectile(sprite, owner, props) {
    // function to create projectile, store it in list and also get it onto the screen
    let proj = projectiles.push(new Projectile(sprite, owner, props));
    app.stage.addChild(projectiles[proj-1]);
}

function moveProjectile(proj, delta) {
    let animation = animations[proj.baseSprite+"Anim"];
    if(animation !== undefined && !proj.playing) {
        proj.textures = animation.arr;
        proj.animationSpeed = animation.speed;
        proj.play();
    }
    //proj.direction being the predefined direction in degrees
    if(elapsed>proj.birth+proj.lifespan) {
        deleteProjectile(proj);
        return;
    }

    Object.keys(proj.effects).forEach(function(i) { //activate effects
        if(!Array.isArray(proj.effects[i])) {proj.effects[i] = [proj.effects[i]]}
        effects[i](proj, delta/60, proj.effects[i]);
    })

    proj.rotation = rad*(proj.direction-90); //Update rotation(if it changes)
    proj.movedX += proj.speed * delta * Math.sin(rad*proj.direction);
    proj.movedY += proj.speed * delta * Math.sin(rad*(proj.direction-90));
    if(proj.locked) {
        proj.initX = units[proj.owner].x;
        proj.initY = units[proj.owner].y;
    }
    proj.x = proj.initX + proj.movedX;
    proj.y = proj.initY + proj.movedY;
}

function deleteProjectile(proj) {
    let index = projectiles.indexOf(proj);
    app.stage.removeChild(proj);
    projectiles.splice(index, 1);
}

function createAnimation(name, path, speed) {
    animations[name] = {arr: path, speed: speed};
}

function createCard(name, displayName, effect, cost, count, description) {
    cards[name] = new Card(displayName, effect, cost, count, description);
}

function playCard(card, cardSprite, discardSprite) {
    if(units["boss"].hp>0) { //Disable cards when boss is dead
        deck.handCards[(Math.round(cardSprite.x / 120))] = "";
        cardSprite.destroy();
        card.play();
        discardSprite.destroy();
    }
}

function discardCard(card, cardSprite, discardSprite) {
    deck.handCards[(Math.round(discardSprite.x/120))] = "";
    cardSprite.destroy();
    card.discard();
    discardSprite.destroy();
    showDiscards(false);
    triggers.discard.forEach(function(effect) { //Activate all functions listed under triggers.discard, then delete them
        effect(card);
    })
    triggers.discard = [];
}

function createObstacle(sprite, props) {
    let obstacle = new Obstacle(sprite, props);
    app.stage.addChild(obstacle);
    obstacles.push(obstacle);
}

function deleteObstacle(obs) {
    app.stage.removeChild(obs);
    obstacles.remove(obs);
}

function drawTiles() {
    const tileCount = [Math.ceil(app.view.width/tileSize), Math.ceil(app.view.height/tileSize)]; //horizontally and vertically, amount of tiles to draw
    for(let i=0; i<tileCount[0]; i++) {
        for(let j=0; j<tileCount[1]; j++) {
            let value = perlin.get(i/tileCount[0], j/tileCount[1]); //get perlin noise value (usually doesn't exceed -0.5 or 0.5)
            let closest = 9999;
            for(let i in tileThresholds) {
                if(Math.abs(value - tileThresholds[i]) < Math.abs(value - closest)) {
                    closest = tileThresholds[i]; //determine tile based on what threshold is closest to the value
                }
            }
            let tileNumber = tileThresholds.indexOf(closest)+1;
            let tile = new PIXI.Sprite(sheet.textures['tile0'+tileNumber+'.png']);
            tile.x = i * tileSize;
            tile.y = j * tileSize;
            app.stage.addChild(tile);
        }
    }
}

function getPlayerDirection(unit) {
    let xDiff, yDiff;
    if(unit.constructor.name === "Projectile") {
        xDiff = units['player'].x - unit.x;
        yDiff = units['player'].y - unit.y;
    } else {
        xDiff = units['player'].x - units[unit].x;
        yDiff = units['player'].y - units[unit].y;
    }
    let diff = Math.atan2(yDiff, xDiff) / rad + 90;
    if(diff<0) {diff += 360}
    return diff;
}

function aiMove(unit) {
    let realDistance = Math.sqrt((units['player'].y - units[unit].y)**2 + (units['player'].x - units[unit].x)**2);
    if(realDistance>5) {
        units[unit].direction = getPlayerDirection(unit);
        units[unit].moving = true;
    } else {
        units[unit].moving = false;
    }
}

function collideDamage(unit) { //Checks for collisions between the a unit and all other units, deal damage if so
    let unitObj = units[unit];
    Object.keys(units).forEach(function(e){
        if(b.hit(unitObj, units[e]) && e !== unit && unitObj.lastHit+unitObj.invTime<elapsed) {
            unitObj.lastHit = elapsed;
            unitObj.takeDamage(units[e].damage);
            flashDamage(unit, unitObj.invTime);
        }
    })
}

function projectileDamage(proj) {
    Object.keys(units).forEach(function(e) {
        if(b.hit(proj, units[e]) && proj.owner !== e && units[e].lastHit+units[e].invTime<elapsed) {
            units[e].lastHit = elapsed;
            units[e].takeDamage(proj.damage);
            flashDamage(e, units[e].invTime);
            proj.lifespan = 0;
        }
    })
}

function flashDamage(unit, time) {
    let unitObj = units[unit];
    let num = 0; //15 is no tint, 0 is full tint
    let redDecay = setInterval(function(){
        if(num>=15) {
            unitObj.tint = 0xffffff; clearInterval(redDecay) //Clear itself once the flash is over
        } else {
            unitObj.tint = "0xff" + (num).toString(16).repeat(4);
        }
        num += 1;
    }, time*(1000/60)/16)
}

function checkObstacles(delta) {
    obstacles.forEach(function(e) {
        Object.keys(units).forEach(function(unit) {
            unit = units[unit]; //trickery to make object.forEach work
            if(b.hit(e, unit)) {
                for(let i in e.effects) {
                    if(i.indexOf("unit")!==-1) {
                        obstacleEffects[i](e, unit, delta, e.effects[i]);
                    }
                }
            }
        })
        projectiles.forEach(function (proj) {
            if(b.hit(e, proj)) {
                for(let i in e.effects) {
                    if(i.indexOf("proj")!==-1) {
                        obstacleEffects[i](e, proj, delta, e.effects[i]);
                    }
                }
            }
        })
    })
}