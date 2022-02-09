function createCards() {
    createCard("fireShield", "Fire Shield", function () {
        for (let i = 0; i < 12; i++) {
            createProjectile("energyBall", "boss", {
                locked: true,
                speed: 10,
                direction: i * 30,
                lifespan: 300,
                effects: {turn: 720}
            })
        }
        for (let i = 0; i < 12; i++) {
            createProjectile("energyBall", "boss", {
                locked: true,
                speed: 10,
                direction: i * 30,
                lifespan: 300,
                effects: {turn: -720}
            })
        }
    }, 100, 5, "Gives the boss a fire shield");

    createCard("whirlwind", "Whirlwind", function () {
        for (let i = 0; i < 9; i++) {
            createProjectile("arrow", "boss", {
                locked: true,
                speed: 10,
                direction: i * 40,
                lifespan: 150,
                effects: {turn: 1000, tracer: [5, 0.3]}
            })
        }
    }, 100, 3, "/r/funny")

    createCard("nova", "Nova", function () {
        for (let i = 0; i < 90; i++) {
            createProjectile("iceArrow", "boss", {
                speed: 24,
                direction: i * 4,
                lifespan: 25,
                effects: {decelerate: 60, turn: 100}
            })
        }
    }, 100, 4, "Throws out a quickie");
    createCard("curtain", "Curtain Call", function () {
        for (let i = 0; i < Math.floor(app.view.width / 80) + 1; i++) { //every 80 pixels
            createProjectile("energyBall", "boss", {
                initX: app.view.width / Math.floor(app.view.width / 80) * (i + Math.random() / 5),
                initY: -100,
                lifespan: 240,
                direction: 180,
                speed: 5
            })
        }
    }, 100, 4, "Creates a curtain of projectiles from the top of the screen")

    createCard("blast", "Blast", function () {
        for (let i = 0; i < 5; i++) {
            createProjectile("fireArrow", "boss", {
                direction: getPlayerDirection("boss") + (i - 2) * 25,
                speed: 0.2,
                effects: {turn: (i - 2) * -30, accelerate: 10, tracer: [6, 0.75]},
                lifespan: 120,
                tracerEffects: {turn: 180}
            })
        }
    }, 250, 5, "Blasts. Effective at long range")

}