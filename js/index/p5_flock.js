let folk_handeler;
let canvasDiv;
const functions = {
  attractAlly: (diffrence, distence2) => {
    return {
      x: (diffrence.x * distence2) / (20000000 * width),
      y: (diffrence.y * distence2) / (20000000 * width),
    };
  },
  attractCenter: (diffrence, distence2) => {
    return {
      x: (diffrence.x * distence2) / (7000 * width),
      y: (diffrence.y * distence2) / (7000 * width),
    };
  },
  repelAlly: (diffrence, distence2) => {
    return {
      x: -(diffrence.x * 10) / (distence2 / (15 * width)) / 10000,
      y: -(diffrence.y * 10) / (distence2 / (15 * width)) / 10000,
    };
  },
  reactThreat: (diffrence, distence2) => {
    return {
      x: -(diffrence.x * 100) / (distence2 / (200 * width)) / 10000,
      y: -(diffrence.y * 100) / (distence2 / (200 * width)) / 10000,
    };
  },
};

function setup() {
  canvasDiv = select("#header-canvas");
  let w = canvasDiv.width;
  let h = canvasDiv.height;
  let cnv = createCanvas(w, h);
  cnv.parent(canvasDiv);
  folk_handeler = new Main();
  noLoop();

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        loop(); // start drawing
      } else {
        noLoop(); // stop drawing
      }
    });
  });
  observer.observe(canvasDiv.elt);
}

window.addEventListener('resize', () => {
  canvasDiv = select("#header-canvas");
  let w = canvasDiv.width;
  let h = canvasDiv.height;
  resizeCanvas(w, h);
});

function draw() {
  //resize canvas to the size of the header
  if(frameCount%60==0){
    canvasDiv = select("#header-canvas");
    let w = canvasDiv.width;
    let h = canvasDiv.height;
    resizeCanvas(w, h);
  }
  clear();
  folk_handeler.updateParticles();
  folk_handeler.draw();
}

class Main {
  constructor(num_particles_ = 200, num_threats_ = 3, update_jump_ = 1) {
    this.particles = [];
    while (num_particles_--) {
      this.particles.push(new Particle());
    }

    this.threats = [];
    while (num_threats_--) {
      this.threats.push(new Threat());
    }
    this.update_jump = update_jump_ + 1;
  }

  //dette er forfærdeligt optimeret i forhold til BIG O, så dette skal laves om når jeg ikke har vigtigere ting at lave
  updateParticles() {
    this.update_jump = ceil(this.particles.length / 300);
    for (
      let i = 0;
      (frameCount % this.update_jump) + i < this.particles.length;
      i += this.update_jump
    ) {
      let obj = this.particles[(frameCount % this.update_jump) + i];
      for (let j of this.particles) {
        if (obj.pos.x != j.pos.x && obj.pos.y != j.pos.y) obj.allyReact(j.pos);
      }
      for (let j of this.threats) {
        obj.threatReact(j.pos);
      }
      if (obj.pos.x != mouseX && obj.pos.y != mouseY)
        obj.threatReact({ x: mouseX, y: mouseY });
      obj.update();
    }

    for (let i of this.threats) {
      i.update();
      i.draw();
    }
  }

  draw() {
    if (mouseIsPressed)
      this.particles.push(new Particle({ x: mouseX, y: mouseY }));
    this.drawParticles();
    this.drawThreats();
  }

  drawThreats() {
    for (let i of this.threats) {
      i.draw();
    }
  }

  drawParticles() {
    for (let i of this.particles) {
      i.draw();
    }
  }
}

class Particle {
  constructor(
    pos_ = { x: random(0, width), y: random(0, width) },
    vel_ = { x: 0, y: 0 }
  ) {
    this.pos = { ...pos_ };
    this.vel = { ...vel_ };
  }

  allyReact(allyPos) {
    const diffrence = { x: allyPos.x - this.pos.x, y: allyPos.y - this.pos.y };
    const distence2 = pow(diffrence.x, 2) + pow(diffrence.y, 2);
    const attractVec = functions.attractAlly(diffrence, distence2);
    const repelVec = functions.repelAlly(diffrence, distence2);
    const { x, y } = addVec(attractVec, repelVec);
    this.vel.x += x;
    this.vel.y += y;
  }

  centerForce() {
    const diffrence = { x: width / 2 - this.pos.x, y: height / 2 - this.pos.y };
    const distence2 = pow(diffrence.x, 2) + pow(diffrence.y, 2);
    const { x, y } = functions.attractCenter(diffrence, distence2);

    this.vel.x += x;
    this.vel.y += y;
  }

  threatReact(ThreatPos) {
    const diffrence = {
      x: ThreatPos.x - this.pos.x,
      y: ThreatPos.y - this.pos.y,
    };
    const distence2 = pow(diffrence.x, 2) + pow(diffrence.y, 2);
    const { x, y } = functions.reactThreat(diffrence, distence2);
    this.vel.x += x;
    this.vel.y += y;
  }

  drag() {
    this.vel.x =
      this.vel.x * map(folk_handeler.particles.length, 50, 500, 0.99, 0.9);
    this.vel.y =
      this.vel.y * map(folk_handeler.particles.length, 50, 500, 0.99, 0.9);
  }

  update() {
    this.centerForce();
    this.drag();
    this.constrain();
    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;
  }

  constrain() {
    if (this.pos.x < 0 && this.pos.x > width) {
      this.pos.x = constrain(this.pos.x, 0, width);
      this.vel.x = 0;
    }
    if (this.pos.y < 0 && this.pos.y > height) {
      this.pos.y = constrain(this.pos.y, 0, height);
      this.vel.y = 0;
    }

    this.vel.x = constrain(this.vel.x, -10, 10);
    this.vel.y = constrain(this.vel.y, -10, 10);
  }

  draw() {
    push();
    //stroke(color(120, 120, 150, 2.8));
    // strokeWeight(200);
    stroke(color(120, 120, 150, 100));
    strokeWeight(4);
    translate(this.pos.x, this.pos.y);
    line(0, 0, this.vel.x, this.vel.y);
    pop();
  }
}

class Threat {
  constructor(
    pos_ = { x: random(0, width), y: random(0, width) },
    vel_ = { x: 0, y: 0 }
  ) {
    this.pos = { ...pos_ };
    this.vel = { ...vel_ };
  }

  drag() {
    this.vel.x = this.vel.x * 0.99;
    this.vel.y = this.vel.y * 0.99;
  }

  update() {
    this.vel.x += random(-0.5, 0.5);
    this.vel.y += random(-0.5, 0.5);
    this.drag();
    this.constrain();
    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;
  }

  constrain() {
    this.pos.x = constrain(this.pos.x, 0, width);
    this.pos.y = constrain(this.pos.y, 0, height);

    this.vel.x = constrain(this.vel.x, -10, 10);
    this.vel.y = constrain(this.vel.y, -10, 10);
  }

  draw() {
    push();
    stroke(color(255, 150, 150, 50));
    strokeWeight(10);
    translate(this.pos.x, this.pos.y);
    line(0, 0, this.vel.x, this.vel.y);
    pop();
  }
}

function addVec(vec1, vec2) {
  return { x: (vec1.x += vec2.x), y: (vec1.y += vec2.y) };
}
