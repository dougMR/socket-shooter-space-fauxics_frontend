console.log("module-draw.js");
import { degreesToRadians } from "./module-angles.js";
import {
    asteroids,
    missiles,
    mines,
    debris,
    obstacles,
    ships,
    gameInProgress,
    players,
    clientPlayer,
    shockwaves,
} from "./main.js";
import {
    setAlpha,
    brightenColor,
    darkenColor,
    mixHexColors,
} from "./libs/colorUtilities.js";
import { checkKeys } from "./module-keys.js";
// import { Keys } from "./module-keys.js";
import { devToolsVisualsOn, playerNamesON } from "./dev-tools.js";

const canvas = document.getElementById("game-canvas");
const context = canvas.getContext("2d");
console.log("canvas:", canvas);
// setCircleRectCanvas(canvas);

const ctx = context;
const asteroidImage = new Image();
asteroidImage.src =
    Math.random() < 0.5
        ? "./images/asteroid-contrast.png"
        : "./images/asteroid3-contrast.png"; //
const shipImage = new Image();
shipImage.src = "./images/spaceship.png";
const shipImage2 = new Image();
shipImage2.src = "./images/spaceship2.png";
const scoreDisplay = document.getElementById("score-box");

const padNumber = (num, size) => {
    let numString = num.toString();
    while (numString.length < size) numString = "0" + numString;
    return numString;
};

const setClientScore = (score) => {
    if (isNaN(score)) return;
    scoreDisplay.innerHTML = padNumber(score, 3);
};

const getCoordByPct = (pct) => {
    return pct * canvas.width * 0.01;
};
const getPctByCoord = (coord) => {
    return (coord / canvas.width) * 100;
};

const showMass = (value) => {
    if (devToolsVisualsOn) {
        ctx.font = "14px sans-serif";
        ctx.fillStyle = "#ffffffbb";
        ctx.strokeStyle = "#000000bb";
        ctx.lineWidth = 2;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.strokeText(value, 0, 0);
        ctx.fillText(value, 0, 0);
    }
};

// Draw Circle (basic game object)
//
const drawCircle = (circle) => {
    const x = getCoordByPct(circle.x);
    const y = getCoordByPct(circle.y);
    const radius = getCoordByPct(circle.radius);
    ctx.translate(x, y);
    ctx.rotate(degreesToRadians(circle.facing));
    //
    // console.log("draw",circle.type);
    if (circle.type === "asteroid") {
        ctx.drawImage(asteroidImage, -radius, -radius, radius * 2, radius * 2);
    } else if (circle.image !== null) {
        ctx.drawImage(circle.image, -radius, -radius, radius * 2, radius * 2);
    } else {
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, 2 * Math.PI);
        ctx.closePath();
        if (circle.color === "gradient") {
            // Create Radial
            const grd = ctx.createRadialGradient(
                getCoordByPct(circle.radius * 0.2),
                getCoordByPct(-circle.radius * 0.2),
                getCoordByPct(circle.radius * 0.1),
                0,
                0,
                getCoordByPct(circle.radius)
            );
            grd.addColorStop(0, "pink");
            grd.addColorStop(1, "brown");
            ctx.fillStyle = grd;
        } else {
            ctx.fillStyle = circle.color;
        }
        ctx.fill();
    }
    // TEMP show mass
    showMass(circle.mass);

    // un-rotate, un-translate
    ctx.rotate(-degreesToRadians(circle.facing));
    ctx.translate(-x, -y);
};

// Draw Missile
const drawMissile = (missile) => {
    // console.log('drawMissile',missile);
    const radius = getCoordByPct(missile.radius);
    //
    if (missile.image !== null) {
        // rotate, translate
        const x = getCoordByPct(missile.x);
        const y = getCoordByPct(missile.y);
        const radius = getCoordByPct(missile.radius);
        ctx.translate(x, y);
        ctx.rotate(degreesToRadians(missile.facing));

        ctx.drawImage(missile.image, -radius, -radius, radius * 2, radius * 2);
        // un-rotate, un-translate
        ctx.rotate(-degreesToRadians(missile.facing));
        ctx.translate(-x, -y);
    } else {
        const alphaIncr = 1 / missile.xyHistory.length;
        for (let i = 0; i < missile.xyHistory.length; i++) {
            // Draw Circle
            const x = getCoordByPct(missile.xyHistory[i].x);
            const y = getCoordByPct(missile.xyHistory[i].y);
            const rad = missile.xyHistory[i].radians;
            ctx.beginPath();

            // ctx.arc(
            //     x,
            //     y,
            //     radius * 2 - radius * 2 * (0.025 * i),
            //     0,
            //     2 * Math.PI
            // );
            const r = radius - radius * (0.025 * i);
            ctx.ellipse(x, y, r * 6, r * 1.5, rad, 0, 2 * Math.PI);
            ctx.closePath();
            ctx.fillStyle = setAlpha(missile.color, 0.5 - i * alphaIncr);
            ctx.fill();

            ctx.beginPath();
            // ctx.arc(x, y, radius - radius * (0.025 * i), 0, 2 * Math.PI);
            ctx.ellipse(x, y, r * 3, r, rad, 0, 2 * Math.PI);
            ctx.fillStyle = setAlpha(missile.color, 1 - i * alphaIncr);
            ctx.fill();
        }
    }
};

// Draw Mine
const drawMine = (mine) => {
    // console.log('drawMine',mine);
    const radius = getCoordByPct(mine.radius);
    const x = getCoordByPct(mine.x);
    const y = getCoordByPct(mine.y);
    ctx.translate(x, y);
    if (mine.image !== null) {
        // rotate, translate
        ctx.rotate(degreesToRadians(mine.facing));
        ctx.drawImage(mine.image, -radius, -radius, radius * 2, radius * 2);
        // un-rotate, un-translate
        ctx.rotate(-degreesToRadians(mine.facing));
    } else {
        // Draw Circle
        const gradient = ctx.createRadialGradient(
            -radius * 0.8,
            -radius * 0.8,
            radius * 0.1,
            -radius * 0.8,
            -radius * 0.8,
            radius * 2
        );
        gradient.addColorStop(0, mine.color);
        // gradient.addColorStop(0.5, "white");
        gradient.addColorStop(0.9, darkenColor(mine.color, 80));
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fillStyle = gradient;
        ctx.fill();

        // ctx.beginPath();
        // ctx.arc(0, 0, radius*0.5, 0, 2 * Math.PI);
        // ctx.closePath();
        // ctx.lineWidth = 2;
        // ctx.strokeStyle = "yellow"; //darkenColor(mine.color,50);
        // ctx.stroke();
    }
    // TEMP show mass
    showMass(mine.mass);
    //  un-translate
    ctx.translate(-x, -y);
};

// Draw Rectangle
const drawRectangle = (rectangle) => {
    // const verts = rectangle_relativeVertices;
    const x = getCoordByPct(rectangle.x);
    const y = getCoordByPct(rectangle.y);
    const w = getCoordByPct(rectangle.width);
    const h = getCoordByPct(rectangle.height);
    //
    ctx.translate(x, y);
    ctx.rotate(degreesToRadians(rectangle.rotation));

    ctx.strokeStyle = darkenColor(rectangle.color, 30);
    ctx.lineWidth = 4;
    ctx.strokeRect(0, 0, w, h);
    //

    const gradient = ctx.createLinearGradient(w * 0.4, 0, w * 0.6, h);

    // Add three color stops
    gradient.addColorStop(0, rectangle.color);
    gradient.addColorStop(0.48, brightenColor(rectangle.color, 50));
    gradient.addColorStop(0.52, darkenColor(rectangle.color, 50));
    gradient.addColorStop(1, rectangle.color);

    // Set the fill style and draw a rectangle
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, w, h);
    //

    ctx.rotate(degreesToRadians(-rectangle.rotation));
    ctx.translate(-x, -y);

    // Draw Rightmost Vertex (this is for dev)
    if (devToolsVisualsOn) {
        const rightMost = rectangle.vertices.reduce(
            (highestV, currentVertex) =>
                currentVertex.x > highestV.x ? currentVertex : highestV,
            rectangle.vertices[0]
        );
        ctx.beginPath();
        ctx.fillStyle = "red";
        ctx.arc(
            getCoordByPct(rightMost.x),
            getCoordByPct(rightMost.y),
            5,
            0,
            2 * Math.PI
        );
        ctx.fill();
        ctx.closePath();
        ctx.beginPath();
        ctx.fillStyle = "lime";
        ctx.arc(
            getCoordByPct(rectangle.vertices[0].x),
            getCoordByPct(rectangle.vertices[0].y),
            3,
            0,
            2 * Math.PI
        );
        ctx.fill();
    }
    // const rightX = getCoordByPct(rectangle.rightMostX);
    // ctx.beginPath();
    // ctx.moveTo(rightX,0);
    // ctx.lineTo(rightX,getCoordByPct(100));
    // ctx.strokeStyle = "red";
    // ctx.lineWidth = 1;
    // ctx.stroke();
    // ctx.closePath();
};

// Draw Ship

const drawShip = (ship) => {
    // super.draw();
    const x = getCoordByPct(ship.x);
    const y = getCoordByPct(ship.y);
    const radius = getCoordByPct(ship.radius);
    // rotate, translate
    ctx.translate(x, y);
    ctx.rotate(degreesToRadians(ship.facing));
    //
    // ship.image = shipImage;
    // if (ship.image !== null) {
    // if (ship.playerId === clientPlayer?.id) {
    //     ctx.drawImage(shipImage, -radius, -radius, radius * 2, radius * 2);
    // } else {
    //     ctx.drawImage(shipImage2, -radius, -radius, radius * 2, radius * 2);

    // SHip
    ctx.beginPath();
    ctx.moveTo(radius, 0);
    ctx.lineTo(-radius, 0.7 * radius);
    ctx.lineTo(-radius, -0.7 * radius);
    ctx.lineTo(radius, 0);
    ctx.closePath();
    // outline
    ctx.strokeStyle = "#00000088";
    ctx.lineWidth = "1px";
    ctx.stroke();
    // fill
    ctx.fillStyle = ship.color;
    ctx.fill();

    // }
    if (ship.thrusting) {
        const thrusterColors = ["orange", "yellow", "white"]; //["lightskyblue", "deepskyblue", "white"];
        const numLoops = thrusterColors.length;
        for (let i = 0; i < numLoops; i++) {
            const halfWidth = 0.5 - i * 0.15;
            ctx.moveTo(-radius, -radius * halfWidth);
            ctx.beginPath();
            ctx.lineTo(-radius, radius * halfWidth);
            ctx.lineTo(-radius * 1.8, 0);
            ctx.lineTo(-radius, -radius * halfWidth);
            ctx.fillStyle = thrusterColors[i];
            ctx.fill();
        }
    }

    // un-rotate / un-translate
    ctx.rotate(-degreesToRadians(ship.facing));
    // TEMP show mass
    showMass(ship.mass);
    ctx.translate(-x, -y);
};

const drawShockwave = (sw) => {
    return;
    const x = getCoordByPct(sw.x);
    const y = getCoordByPct(sw.y);
    const radius = getCoordByPct(sw.radius);
    // rotate, translate
    ctx.translate(x, y);

    // Draw Circle
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.lineWidth = getCoordByPct(sw.velocity);
    ctx.strokeStyle = "black";
    ctx.stroke();
    // ctx.fillStyle = "black";
    // ctx.fill();

    ctx.translate(-x, -y);
};

// Canvas (draw whole game etc)

const drawOnce = () => {
    clearCanvas();

    // draw everything
    // const everything = [
    //     ...missiles,
    //     ...asteroids,
    //     ...ships,
    //     ...obstacles,
    //     ...debris,
    // ];
    // for (const thing of everything) {
    //     thing.draw();
    // }
    // draw obstacles
    for (const o of obstacles) {
        drawRectangle(o);
    }

    // draw shockwaves
    // for (const sw of shockwaves) {
    //     drawShockwave(sw);
    // }

    // draw asteroids
    for (const a of asteroids) {
        drawCircle(a);
    }

    // draw debris
    for (const d of debris) {
        drawCircle(d);
    }

    // draw missiles
    for (const m of missiles) {
        drawMissile(m);
    }

    // draw mines
    for (const m of mines) {
        drawMine(m);
    }

    // if (!gameInProgress) {
    drawNames();
    // }

    // draw ships
    for (const ship of ships) {
        drawShip(ship);
    }

    // draw screen text
    for (let index = screenTexts.length - 1; index >= 0; index--) {
        const nextTextObj = screenTexts[index];
        if (nextTextObj.expirationTime < performance.now()) {
            // remove from screenTexts array
            screenTexts.splice(index, 1);
        } else {
            drawText(
                nextTextObj.text,
                nextTextObj.x,
                nextTextObj.y,
                nextTextObj.color
            );
        }
    }
};

function clearCanvas() {
    // Create a radial gradient
    // The inner circle is at x=110, y=90, with radius=30
    // The outer circle is at x=100, y=100, with radius=70
    const gradient = context.createRadialGradient(
        canvas.width * 0.5,
        canvas.height * 0.5,
        canvas.width * 0.3,
        canvas.width * 0.5,
        canvas.height * 0.5,
        canvas.width * 0.4
    );

    // Add three color stops
    gradient.addColorStop(0, "#221133");
    // gradient.addColorStop(0.5, "white");
    gradient.addColorStop(0.7, "#110022");
    // black space
    // gradient.addColorStop(1, "#0f0027");

    // Set the fill style and draw a rectangle
    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);
}

const drawNames = () => {
    if (!playerNamesON) return;
    ctx.font = "12px sans-serif";
    ctx.fillStyle = "#ffffffbb";
    ctx.strokeStyle = "#000000bb";
    ctx.lineWidth = 2;
    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";
    for (const p of players) {
        if (p.ship.alive && p.connected) {
            const x = getCoordByPct(p.ship.x);
            const y = getCoordByPct(p.ship.y) - getCoordByPct(p.ship.radius);
            // Draw Name
            ctx.strokeText(p.name, x, y);
            ctx.fillText(p.name, x, y);
        }
    }
};

const screenTexts = [];
const addScreenText = (text, xPct, yPct, durationMS = 2000, color = "#dddddd88") => {
    screenTexts.push({
        x: getCoordByPct(xPct),
        y: getCoordByPct(yPct),
        text,
        color,
        expirationTime: performance.now() + durationMS,
    });
};
const drawText = (text, x, y, color) => {
    ctx.font = "bold 14px sans-serif";
    ctx.fillStyle = color;
    ctx.strokeStyle = "#000000bb";
    const lw = 3;//getCoordByPct(0.1);
    ctx.lineWidth = lw;
    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";
    // Draw Text
    ctx.strokeText(text, x, y);
    ctx.fillText(text, x, y);
};

const drawLoop = (timeStamp) => {
    if (!startTime) {
        startTime = timeStamp;
    }

    checkKeys();

    clearCanvas();

    drawOnce();

    if (gameInProgress) {
        window.requestAnimationFrame(drawLoop);
    } else {
        // End Game
        console.log("Game Over");
        startTime = null;
    }
};

const startDrawLoop = () => {
    window.requestAnimationFrame(drawLoop);
};

const resizeCanvas = () => {
    const size = Math.min(window.innerWidth, window.innerHeight);
    canvas.width = size;
    canvas.height = size - 4;
    if (window.innerWidth > window.innerHeight) {
        document.body.classList.add("layout-wide");
        document.body.classList.remove("layout-tall");
    } else {
        document.body.classList.add("layout-tall");
        document.body.classList.remove("layout-wide");
    }
};

// Timer
const showTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    seconds -= 60 * mins;
    const timerText = `${mins}:${padNumber(seconds, 2)}`;
    document.getElementById("timer-box").innerHTML = timerText;
};

let startTime = null;

export {
    // drawCircle,
    // drawMissile,
    // drawMine,
    // drawRectangle,
    drawShip,
    drawNames,
    addScreenText,
    clearCanvas,
    resizeCanvas,
    drawOnce,
    showTime,
    startDrawLoop,
    setClientScore,
};
