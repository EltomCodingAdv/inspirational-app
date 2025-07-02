const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray = [];
const numberOfParticles = 100; // Adjust as needed

// Mouse position
const mouse = {
    x: null,
    y: null,
    radius: 100 // Area of influence for mouse interaction
};

window.addEventListener('mousemove', (event) => {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
});

window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
});

// Touch events
window.addEventListener('touchstart', (event) => {
    if (event.touches.length > 0) {
        mouse.x = event.touches[0].clientX;
        mouse.y = event.touches[0].clientY;
    }
}, { passive: false }); // passive: false to allow preventDefault if needed, though not used here

window.addEventListener('touchmove', (event) => {
    if (event.touches.length > 0) {
        mouse.x = event.touches[0].clientX;
        mouse.y = event.touches[0].clientY;
        event.preventDefault(); // Prevent scrolling while drawing
    }
}, { passive: false });

window.addEventListener('touchend', () => {
    // Optional: Keep particles moving towards the last touch point or reset
    // mouse.x = null;
    // mouse.y = null;
});

// Explosion particles array
let explosionParticlesArray = [];

// Click event listener for explosion
canvas.addEventListener('click', (event) => {
    const rect = canvas.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;

    for (let i = 0; i < particlesArray.length; i++) {
        const particle = particlesArray[i];
        const distance = Math.sqrt(
            (clickX - particle.x) ** 2 + (clickY - particle.y) ** 2
        );

        if (distance < particle.size) { // Check if click is within particle
            triggerExplosion(particle.x, particle.y, particle.color);
            // Optional: remove the clicked particle immediately or let it fade
            // particlesArray.splice(i, 1); 
            // i--; // Adjust index after removal
            break; // Explode one particle at a time
        }
    }
});

class ExplosionParticle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.size = Math.random() * 3 + 1; // Smaller particles for explosion
        this.speedX = Math.random() * 6 - 3; // Random horizontal speed (-3 to 3)
        this.speedY = Math.random() * 6 - 3; // Random vertical speed (-3 to 3)
        this.life = 100; // Lifespan of explosion particle (frames)
        this.opacity = 1;
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        // No shadow for explosion particles for performance & different effect
        ctx.fill();
        ctx.restore();
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.life -= 2; // Decrease life faster
        if (this.life < 0) this.life = 0;
        this.opacity = this.life / 100; // Fade out
        this.draw();
    }
}

function triggerExplosion(x, y, color) {
    const explosionParticleCount = 30; // Number of particles in an explosion
    for (let i = 0; i < explosionParticleCount; i++) {
        explosionParticlesArray.push(new ExplosionParticle(x, y, color));
    }
    // After explosion, reset the main particles
    // We can add a small delay here if needed, or reset immediately
    // For now, immediate reset after triggering.
    // A more advanced approach might wait for explosion animation to mostly finish.
    setTimeout(() => {
        init(); // Reset main particles
    }, 500); // Delay reset to allow explosion to be visible
}


class Particle {
    constructor(x, y, size, color, weight) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = color;
        this.weight = weight; // How much the particle is affected by mouse
        this.baseX = this.x; // Original x position for returning effect
        this.baseY = this.y; // Original y position for returning effect
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;

        // Glowing effect
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 15; // Adjust glow intensity

        ctx.fill();
        
        // Reset shadow for other drawings if any (though not strictly necessary here as we clearRect)
        ctx.shadowBlur = 0; 
    }

    update() {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        let forceDirectionX = dx / distance;
        let forceDirectionY = dy / distance;

        // Max distance for interaction
        let maxDistance = mouse.radius;
        // The closer the particle is to the mouse, the stronger the force
        // The further away, the force diminishes (ease out)
        let force = (maxDistance - distance) / maxDistance;

        // Ensure force isn't negative if particle is outside radius
        if (force < 0) force = 0;

        let directionX = (forceDirectionX * force * this.weight);
        let directionY = (forceDirectionY * force * this.weight);

        if (distance < mouse.radius) {
            this.x -= directionX; // Move away from mouse
            this.y -= directionY; // Move away from mouse
        } else {
            // Return to base position if mouse is not interacting
            if (this.x !== this.baseX) {
                let dx_base = this.x - this.baseX;
                this.x -= dx_base / 10; // Adjust speed of return
            }
            if (this.y !== this.baseY) {
                let dy_base = this.y - this.baseY;
                this.y -= dy_base / 10; // Adjust speed of return
            }
        }
        this.draw();
    }
}

function init() {
    particlesArray = [];
    for (let i = 0; i < numberOfParticles; i++) {
        let size = Math.random() * 5 + 2; // Particle size between 2 and 7
        let x = Math.random() * (innerWidth - size * 2) + size;
        let y = Math.random() * (innerHeight - size * 2) + size;
        // Using HSL for vibrant, easily adjustable colors
        let color = 'hsl(' + Math.random() * 360 + ', 70%, 60%)'; 
        let weight = Math.random() * 1.5 + 1; // Random weight for varied movement

        particlesArray.push(new Particle(x, y, size, color, weight));
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update and draw main particles
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
    }

    // Update and draw explosion particles
    for (let i = 0; i < explosionParticlesArray.length; i++) {
        explosionParticlesArray[i].update();
        if (explosionParticlesArray[i].life <= 0) {
            explosionParticlesArray.splice(i, 1);
            i--; // Adjust index after removal
        }
    }

    requestAnimationFrame(animate);
}

init();
animate();

// Handle window resize
window.addEventListener('resize', () => {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    mouse.radius = ((canvas.height/80) * (canvas.height/80)); // Adjust mouse radius based on screen size
    init(); // Reinitialize particles for new screen size
});
