document.addEventListener('keydown', function(key) {
    let movements = ['KeyW', 'KeyA', 'KeyS', 'KeyD'];
    let shoots = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];
    if(movements.includes(key.code)) {
        let input = key.code.slice(3,4); //'W', 'A', 'S', 'D'
        if(units['player'].moving.indexOf(input)===-1) { //Only add keypress if it doesn't exist
            units['player'].moving.push(input);
        }
        return;
    }
    if(shoots.includes(key.code)) {
        let input = key.code.slice(5,10); //'Left', 'Right', 'Up', 'Down'
        let direction;
        switch(input) {
            case "Up":
                direction = 0;
                break;
            case "Right":
                direction = 90;
                break;
            case "Down":
                direction = 180;
                break;
            case "Left":
                direction = 270;
                break;
        }
        createProjectile("arrow", "player", {direction: direction});
    }
})

document.addEventListener('keyup', function(key) {
    let movements = ['KeyW', 'KeyA', 'KeyS', 'KeyD'];
    if(movements.includes(key.code)) {
        let input = key.code.slice(3,4);
        units['player'].moving.remove(input); //remove keypress from moving array
    }
})