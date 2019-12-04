const simpleStarCount = 40;
const complexStarCount = 0;
const starRadiusMin = 5;
const starRadiusMax = 10;
const starMovement = 0.1;
const starFlickering = 3;
const starLayers = 5;

var stars = null;

class Star {
    constructor(x, y, z, radius, isComplex) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.radius = radius;
        this.isComplex = isComplex;
        this.color = {
            r: 255,
            g: 255,
            b: random(150, 255),
            a: random(0, 255)
        }
    }

    draw() {
        this.x = max(-width, min(width, this.x + random(-starMovement, starMovement)));
        this.y = max(-height, min(height, this.y + random(-starMovement, starMovement)));
        this.z = max(-width, min(width, this.z + random(-starMovement, starMovement)));
        this.color.a = max(1, min(255, this.color.a + random(-starFlickering, starFlickering)));

        translate(this.x, this.y, this.z);
        if (this.isComplex) {
            this.drawComplexStar();
        } else {
            this.drawSimpleStar();
        }
        translate(-this.x, -this.y, -this.z);
    }

    drawSimpleStar() {
        for (let t = starLayers; t > 0; t--) {
            let a = this.color.a * (t / 10);
            fill(this.color.r, this.color.g, this.color.b, a);
            circle(this.x, this.y, this.radius / (t / starLayers * 2));
        }
    }

    drawComplexStar() {
        for (let t = 2; t < 2 + starLayers; t++) {
            beginShape();

            let a = this.color.a * (1 - t / 10);
            fill(this.color.r, this.color.g, this.color.b, a);

            for (let a = 0; a < TWO_PI; a += TWO_PI / 4) {
                let sx = this.x + cos(a) * this.radius;
                let sy = this.y + sin(a) * this.radius;
                vertex(sx, sy, this.z);
                sx = this.x + cos(a + TWO_PI / 8) * this.radius / t;
                sy = this.y + sin(a + TWO_PI / 8) * this.radius / t;
                vertex(sx, sy, this.z);
            }

            endShape();
        }
    }
}

function createStars() {
    let stars = [];
    for (let i = 0; i < simpleStarCount + complexStarCount; i++) {
        let x = random(-width / 2, width / 2);
        let y = random(-height / 2, height / 2);
        let radius = random(starRadiusMin, starRadiusMax);
        stars.push(new Star(x, y, -width, radius, i >= simpleStarCount));
    }
    return stars;
}

function drawStars() {
    if (!stars) {
        stars = createStars();
    }
    for (let s of stars) {
        s.draw();
    }
}