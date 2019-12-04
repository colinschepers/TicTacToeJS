function drawFrame() {
    push();

    ambientMaterial(0, 155, 199);

    translate(-width / 2 + barRadius, 0, 0);
    cylinder(barRadius, height);
    for (var i = 0; i < 3; i++) {
        translate((width - 2 * barRadius) / 3, 0, 0);
        cylinder(barRadius, height);
    }

    rotateZ(PI / 2);
    translate(-height / 2 + barRadius, width / 2 - barRadius, 0);
    cylinder(barRadius, width);

    for (i = 0; i < 3; i++) {
        translate((height - 2 * barRadius) / 3, 0, 0);
        cylinder(barRadius, width);
    }

    pop();
}