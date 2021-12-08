document.addEventListener('keydown', function(key) {
    if(!keysDown.includes(key.code)) {
        keysDown.push(key.code)
    }
})

document.addEventListener('keyup', function(key) {
    keysDown.remove(key.code)
})

function handleInput() {
    let moveKeys = ["KeyW", "KeyA", "KeyS", "KeyD"];
    let movesInputted = ""; //becomes WASD depending on what buttons are pressed, always in that order
    moveKeys.forEach(function(e) {if(keysDown.includes(e)) {movesInputted += e.slice(3,4)}});
    if(movesInputted !== "") {
        let map = {"W": 0, "D": 90, "S": 180, "A": 270, "WD": 45, "SD": 135, "AS": 225, "WA": 315};
        let direction = 0;
        Object.keys(map).forEach(function (e) {
            if (movesInputted.indexOf(e) !== -1) {
                direction = map[e];
            }
        })
        units['player'].direction = direction;
        units['player'].moving = true;
    } else {
        units['player'].moving = false;
    }
    let shootKeys = ["ArrowUp", "ArrowRight", "ArrowDown", "ArrowLeft"];
    let shootsInputted = "";
    shootKeys.forEach(function(e) {if(keysDown.includes(e)) {shootsInputted += e.slice(5)}});
    if(shootsInputted !== "") {
        let map = {"Up": 0, "Right": 90, "Down": 180, "Left": 270, "UpRight": 45, "RightDown": 135, "DownLeft": 215, "UpLeft": 315};
        let direction = 0;
        Object.keys(map).forEach(function(e) {
            if(shootsInputted.indexOf(e) !== -1) {
                direction = map[e];
            }
        })
        if(timers.playerShoot+timersLength.playerShoot<elapsed) {
            createProjectile("arrow", "player", {direction: direction, lifespan: 35});
            timers.playerShoot = elapsed;
        }
    }
}