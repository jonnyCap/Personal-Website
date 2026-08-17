// secondaryCanvas - Pure Atmospheric Particle Cloud Swarm & Ultra-Smooth Emergence with Adjusted Minimum Cloud Size

(function () {
    const canvas = document.getElementById("secondaryCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // --- High-Performance Offscreen Radial Glow Sprites ---
    function createGlowSprite(size, coreAlpha, haloAlpha) {
        const offCanvas = document.createElement("canvas");
        offCanvas.width = size;
        offCanvas.height = size;
        const offCtx = offCanvas.getContext("2d");
        const center = size / 2;
        const radius = size / 2;

        const grad = offCtx.createRadialGradient(center, center, 0, center, center, radius);
        grad.addColorStop(0.00, `rgba(255, 255, 255, ${coreAlpha})`);
        grad.addColorStop(0.30, `rgba(255, 255, 255, ${coreAlpha * 0.85})`);
        grad.addColorStop(0.60, `rgba(240, 250, 255, ${haloAlpha})`);
        grad.addColorStop(0.85, `rgba(220, 245, 255, ${haloAlpha * 0.3})`);
        grad.addColorStop(1.00, "rgba(255, 255, 255, 0.0)");

        offCtx.fillStyle = grad;
        offCtx.beginPath();
        offCtx.arc(center, center, radius, 0, Math.PI * 2);
        offCtx.fill();
        return offCanvas;
    }

    const SPRITES = {
        droplet: createGlowSprite(24, 0.95, 0.40),
        small: createGlowSprite(48, 0.85, 0.30),
        medium: createGlowSprite(80, 0.75, 0.25),
        large: createGlowSprite(130, 0.60, 0.18)
    };

    // --- Interactive Mouse State ---
    const mouse = {
        x: -1000,
        y: -1000,
        prevX: -1000,
        prevY: -1000,
        vx: 0,
        vy: 0,
        speed: 0,
        active: false,
        lastMoved: 0,
        radius: 120
    };

    // --- 7 Realistic Meteorological Cloud Archetypes ---
    const CLOUD_ARCHETYPES = [
        // 1. Cumulus Mediocris (Multi-tier towering billowing summits)
        {
            name: 'mediocris',
            baseLobes: [
                { x: 0,    y: -48, r: 58 },
                { x: -35,  y: -28, r: 52 },
                { x: 38,   y: -24, r: 50 },
                { x: -75,  y: 5,   r: 45 },
                { x: 75,   y: 8,   r: 42 },
                { x: -110, y: 22,  r: 36 },
                { x: 110,  y: 20,  r: 36 },
                { x: -50,  y: 28,  r: 48 },
                { x: 0,    y: 30,  r: 52 },
                { x: 52,   y: 26,  r: 46 }
            ]
        },
        // 2. Cumulus Humilis (Flat-bottomed classic fair-weather puff)
        {
            name: 'humilis',
            baseLobes: [
                { x: -15,  y: -30, r: 60 },
                { x: 35,   y: -22, r: 48 },
                { x: -65,  y: -8,  r: 45 },
                { x: 75,   y: 5,   r: 40 },
                { x: -90,  y: 18,  r: 35 },
                { x: -45,  y: 24,  r: 46 },
                { x: 5,    y: 25,  r: 50 },
                { x: 55,   y: 22,  r: 44 }
            ]
        },
        // 3. Stratocumulus (Elongated horizontal rolling cloud bank)
        {
            name: 'stratocumulus',
            baseLobes: [
                { x: -90,  y: -18, r: 44 },
                { x: -30,  y: -25, r: 50 },
                { x: 35,   y: -22, r: 48 },
                { x: 95,   y: -14, r: 42 },
                { x: -140, y: 12,  r: 32 },
                { x: 145,  y: 10,  r: 30 },
                { x: -80,  y: 20,  r: 42 },
                { x: 0,    y: 24,  r: 46 },
                { x: 80,   y: 20,  r: 42 }
            ]
        },
        // 4. Double-Summit Cumulus (Twin summits with a shallow saddle)
        {
            name: 'twin-peaks',
            baseLobes: [
                { x: -45,  y: -42, r: 52 },
                { x: 45,   y: -38, r: 50 },
                { x: 0,    y: -18, r: 42 },
                { x: -90,  y: -6,  r: 42 },
                { x: 92,   y: -2,  r: 40 },
                { x: -125, y: 18,  r: 32 },
                { x: 125,  y: 16,  r: 32 },
                { x: -60,  y: 26,  r: 46 },
                { x: 0,    y: 28,  r: 48 },
                { x: 60,   y: 26,  r: 46 }
            ]
        },
        // 5. Cumulus Fractus (Ragged, wind-torn wispy cloud wisp)
        {
            name: 'fractus',
            baseLobes: [
                { x: -35,  y: -25, r: 46 },
                { x: 20,   y: -15, r: 40 },
                { x: -80,  y: 0,   r: 36 },
                { x: 65,   y: 8,   r: 32 },
                { x: 115,  y: 18,  r: 25 },
                { x: -50,  y: 22,  r: 38 },
                { x: 10,   y: 24,  r: 36 }
            ]
        },
        // 6. Wind-Sheared Anvil Leaning (Blown eastward with feather tail)
        {
            name: 'wind-sheared',
            baseLobes: [
                { x: -60,  y: -40, r: 58 },
                { x: -10,  y: -30, r: 50 },
                { x: 40,   y: -15, r: 44 },
                { x: 90,   y: 0,   r: 38 },
                { x: 135,  y: 16,  r: 30 },
                { x: -95,  y: 12,  r: 42 },
                { x: -50,  y: 26,  r: 46 },
                { x: 10,   y: 28,  r: 44 },
                { x: 65,   y: 22,  r: 38 }
            ]
        },
        // 7. Altocumulus Puff Cluster (Compact buoyant cloudlet)
        {
            name: 'puff-cluster',
            baseLobes: [
                { x: 0,    y: -30, r: 54 },
                { x: -40,  y: -10, r: 46 },
                { x: 40,   y: -8,  r: 46 },
                { x: -25,  y: 22,  r: 44 },
                { x: 25,   y: 22,  r: 44 }
            ]
        }
    ];

    function generateUniqueCloudLobes(archetype) {
        const hStretch = c_random(0.88, 1.22);
        const vStretch = c_random(0.88, 1.15);
        const tilt = c_random(-0.06, 0.06);

        return archetype.baseLobes.map(lobe => {
            let jx = lobe.x * hStretch + c_random(-6, 6);
            let jy = lobe.y * vStretch + c_random(-5, 5);

            let rx = jx * Math.cos(tilt) - jy * Math.sin(tilt);
            let ry = jx * Math.sin(tilt) + jy * Math.cos(tilt);
            let rr = lobe.r * c_random(0.90, 1.14);

            return { x: rx, y: ry, r: rr };
        });
    }

    // --- Particle belonging to a Cloud Swarm ---
    class CloudSwarmParticle {
        constructor(swarm, lobe) {
            this.swarm = swarm;
            this.lobe = lobe;

            let angle = Math.random() * Math.PI * 2;
            let dist = Math.sqrt(Math.random()) * lobe.r;
            this.relX = lobe.x + Math.cos(angle) * dist;
            this.relY = lobe.y + Math.sin(angle) * dist;

            let cond = swarm.condensationFactor || 1.0;
            this.x = swarm.x + this.relX * swarm.scale * cond;
            this.y = swarm.y + this.relY * swarm.scale * cond;
            this.vx = (Math.random() - 0.5) * 0.2;
            this.vy = (Math.random() - 0.5) * 0.2;
            this.dissolved = false;

            let scaleMul = Math.max(0.85, Math.min(1.35, swarm.targetScale));
            let normDist = dist / lobe.r;
            if (normDist < 0.35) {
                this.sprite = SPRITES.large;
                this.size = (Math.random() * 22 + 45) * scaleMul;
                this.baseAlpha = Math.random() * 0.30 + 0.65;
                this.mass = 1.6;
            } else if (normDist < 0.70) {
                this.sprite = SPRITES.medium;
                this.size = (Math.random() * 18 + 28) * scaleMul;
                this.baseAlpha = Math.random() * 0.25 + 0.45;
                this.mass = 1.0;
            } else if (Math.random() < 0.25) {
                this.sprite = SPRITES.droplet;
                this.size = (Math.random() * 6 + 4) * scaleMul;
                this.baseAlpha = Math.random() * 0.35 + 0.65;
                this.mass = 0.5;
            } else {
                this.sprite = SPRITES.small;
                this.size = (Math.random() * 14 + 18) * scaleMul;
                this.baseAlpha = Math.random() * 0.20 + 0.35;
                this.mass = 0.75;
            }

            this.alpha = this.baseAlpha;
            this.wobblePhase = Math.random() * Math.PI * 2;
            this.wobbleSpeed = Math.random() * 0.02 + 0.008;
            this.wobbleAmp = (Math.random() * 5 + 2) * scaleMul;
        }

        update(time) {
            this.wobblePhase += this.wobbleSpeed;

            if (this.swarm.state === 'dissolving') {
                if (!this.dissolved) {
                    this.dissolved = true;
                    let angle = Math.random() * Math.PI * 2;
                    let spd = (Math.random() * 1.8 + 0.8) / this.mass;
                    this.vx = Math.cos(angle) * spd + mouse.vx * 0.15;
                    this.vy = Math.sin(angle) * spd + mouse.vy * 0.15;
                }

                this.vx *= 0.95;
                this.vy *= 0.95;
                this.x += this.vx + 0.10;
                this.y += this.vy;
                this.alpha = Math.max(0, this.alpha - 0.020);
                return;
            }

            let cond = this.swarm.condensationFactor || 1.0;
            let targetX = this.swarm.x + (this.relX * this.swarm.scale * cond) + Math.cos(this.wobblePhase) * this.wobbleAmp;
            let targetY = this.swarm.y + (this.relY * this.swarm.scale * cond) + Math.sin(this.wobblePhase) * this.wobbleAmp;

            let dx = targetX - this.x;
            let dy = targetY - this.y;
            let spring = 0.025 / this.mass;
            this.vx += dx * spring;
            this.vy += dy * spring;

            this.vx *= 0.93;
            this.vy *= 0.93;
            this.x += this.vx;
            this.y += this.vy;
        }

        draw(ctx) {
            let effectiveAlpha = this.alpha * this.swarm.fadeInAlpha;
            if (effectiveAlpha <= 0.005) return;
            ctx.globalAlpha = effectiveAlpha;
            let half = this.size;
            ctx.drawImage(this.sprite, this.x - half, this.y - half, half * 2, half * 2);
        }
    }

    // --- Emergent Cloud Swarm Entity ---
    class CloudSwarm {
        constructor(w, h, startX, startY, customScale, shouldEmerge = false, archetypeIndex) {
            const arch = archetypeIndex !== undefined
                ? CLOUD_ARCHETYPES[archetypeIndex % CLOUD_ARCHETYPES.length]
                : CLOUD_ARCHETYPES[Math.floor(Math.random() * CLOUD_ARCHETYPES.length)];

            this.lobes = generateUniqueCloudLobes(arch);
            this.x = startX !== undefined ? startX : -180;
            this.y = startY !== undefined ? startY : Math.random() * (h * 0.72) + (h * 0.08);

            // Minimum cloud scale raised to 0.85 (no tiny undersized clouds) up to 1.45
            this.targetScale = customScale !== undefined ? customScale : c_random(0.85, 1.45);
            this.vx = (Math.random() * 0.10 + 0.16) / Math.sqrt(this.targetScale);
            this.vy = (Math.random() - 0.5) * 0.03;
            this.scale = shouldEmerge ? this.targetScale * 0.60 : this.targetScale;
            this.radius = 130 * this.targetScale;

            // Ultra-smooth, slow atmospheric condensation (~4.5 seconds duration)
            this.state = shouldEmerge ? 'emerging' : 'drifting';
            this.emergenceProgress = shouldEmerge ? 0.0 : 1.0;
            this.fadeInAlpha = shouldEmerge ? 0.0 : 1.0;
            this.condensationFactor = shouldEmerge ? 1.40 : 1.0;
            this.particles = [];

            const count = Math.round(165 * Math.sqrt(this.targetScale));
            for (let i = 0; i < count; i++) {
                let lobe = this.lobes[i % this.lobes.length];
                this.particles.push(new CloudSwarmParticle(this, lobe));
            }
        }

        update(w, h, time) {
            this.x += this.vx;
            this.y += this.vy + Math.sin(time * 0.008 + this.x * 0.002) * 0.05;

            // Ultra-smooth, slow atmospheric emergence (~4.5s smooth S-curve / quintic smoothstep)
            if (this.state === 'emerging') {
                this.emergenceProgress += 0.0036; // Slower atmospheric condensation (~4.5s)
                let p = Math.min(1.0, this.emergenceProgress);

                // Quintic smoothstep: starts completely seamless & gradual (no sudden jump!)
                let easeAlpha = p * p * p * (p * (p * 6 - 15) + 10);
                this.fadeInAlpha = easeAlpha;
                this.scale = this.targetScale * (0.60 + 0.40 * easeAlpha);
                this.condensationFactor = 1.40 - 0.40 * easeAlpha;

                if (this.emergenceProgress >= 1.0) {
                    this.state = 'drifting';
                    this.condensationFactor = 1.0;
                    this.fadeInAlpha = 1.0;
                }
            }

            // Direct touch destruction on contact
            if (mouse.active && (this.state === 'drifting' || (this.state === 'emerging' && this.fadeInAlpha > 0.3))) {
                let dx = this.x - mouse.x;
                let dy = this.y - mouse.y;
                let dist = Math.hypot(dx, dy);

                if (dist < this.radius + mouse.radius * 0.40) {
                    this.state = 'dissolving';
                }
            }

            for (let p of this.particles) {
                p.update(time);
            }
        }

        isDead(w) {
            let allFaded = this.state === 'dissolving' && this.particles.every(p => p.alpha <= 0.02);
            let offScreen = this.x - 300 > w;
            return allFaded || offScreen;
        }

        draw(ctx) {
            for (let p of this.particles) {
                p.draw(ctx);
            }
        }
    }

    // --- Ambient Floating Sky Mist Droplets ---
    class AmbientMistDroplet {
        constructor(w, h, randomizeX = true) {
            this.reset(w, h, randomizeX);
        }

        reset(w, h, randomizeX = false) {
            this.x = randomizeX ? Math.random() * w : Math.random() * -60;
            this.y = Math.random() * h;
            this.vx = Math.random() * 0.35 + 0.20;
            this.vy = (Math.random() - 0.5) * 0.12;

            let rand = Math.random();
            if (rand < 0.4) {
                this.sprite = SPRITES.droplet;
                this.size = Math.random() * 6 + 4;
                this.alpha = Math.random() * 0.35 + 0.50;
                this.mass = 0.5;
            } else {
                this.sprite = SPRITES.small;
                this.size = Math.random() * 16 + 14;
                this.alpha = Math.random() * 0.20 + 0.25;
                this.mass = 0.8;
            }
        }

        update(w, h) {
            if (mouse.active) {
                let dx = this.x - mouse.x;
                let dy = this.y - mouse.y;
                let distSq = dx * dx + dy * dy;
                if (distSq < mouse.radius * mouse.radius && distSq > 1) {
                    let dist = Math.sqrt(distSq);
                    let factor = (1 - dist / mouse.radius);
                    this.vx += (dx / dist) * factor * 3.5 + mouse.vx * factor * 0.35;
                    this.vy += (dy / dist) * factor * 3.5 + mouse.vy * factor * 0.35;
                }
            }

            this.vx *= 0.94;
            this.vy *= 0.94;
            this.x += this.vx + 0.15;
            this.y += this.vy;

            if (this.x - this.size > w + 60) this.reset(w, h, false);
            if (this.y < -40) this.y = h + 20;
            if (this.y > h + 40) this.y = -20;
        }

        draw(ctx) {
            ctx.globalAlpha = this.alpha;
            let half = this.size;
            ctx.drawImage(this.sprite, this.x - half, this.y - half, half * 2, half * 2);
        }
    }

    // --- Main Simulation Manager ---
    const simulation = {
        swarms: [],
        ambient: [],
        time: 0,
        spawnCooldown: 0,

        getTargetCloudCount: function () {
            const w = canvas.width;
            if (w > 1200) return 5;
            if (w > 768) return 4;
            return 2;
        },

        resize: function () {
            const parent = document.querySelector(".secondaryStartSection");
            const w = parent && parent.offsetWidth > 100 ? parent.offsetWidth : window.innerWidth;
            const h = parent && parent.offsetHeight > 100 ? parent.offsetHeight : 900;
            if (canvas.width !== w || canvas.height !== h) {
                canvas.width = w;
                canvas.height = h;
            }
        },

        init: function () {
            this.resize();
            this.swarms = [];
            this.ambient = [];

            const w = canvas.width > 0 ? canvas.width : window.innerWidth;
            const h = canvas.height > 0 ? canvas.height : 900;

            // 4 well-sized initial clouds (scales: 0.90 to 1.35)
            const initialConfigs = [
                { x: w * 0.15, y: h * 0.22, s: 0.90, arch: 4 }, // Fractus
                { x: w * 0.46, y: h * 0.16, s: 1.35, arch: 0 }, // Towering Mediocris
                { x: w * 0.82, y: h * 0.28, s: 1.05, arch: 1 }, // Fair-weather Humilis
                { x: w * 0.28, y: h * 0.68, s: 1.18, arch: 3 }  // Twin-Peaks cumulus
            ];

            for (let cfg of initialConfigs) {
                this.swarms.push(new CloudSwarm(w, h, cfg.x, cfg.y, cfg.s, false, cfg.arch));
            }

            for (let i = 0; i < 65; i++) {
                this.ambient.push(new AmbientMistDroplet(w, h, true));
            }
        },

        spawnIncomingCloud: function (w, h, immediateOnScreen = false) {
            const bands = [h * 0.18, h * 0.32, h * 0.50, h * 0.70];
            let bestBand = bands[Math.floor(Math.random() * bands.length)];
            let minConflict = Infinity;

            for (let band of bands) {
                let conflict = 0;
                for (let s of this.swarms) {
                    if (s.state !== 'dissolving' && Math.abs(s.y - band) < 110) {
                        conflict++;
                    }
                }
                if (conflict < minConflict) {
                    minConflict = conflict;
                    bestBand = band;
                }
            }

            let spawnY = bestBand + (Math.random() - 0.5) * 35;
            // Minimum scale guaranteed >= 0.85
            let scale = c_random(0.85, 1.40);

            if (immediateOnScreen) {
                // Slower organic condensation on screen
                let spawnX = c_random(w * 0.18, w * 0.55);
                this.swarms.push(new CloudSwarm(w, h, spawnX, spawnY, scale, true));
            } else {
                // Normal incoming drift smoothly entering from left horizon
                let spawnX = c_random(-190, -140);
                this.swarms.push(new CloudSwarm(w, h, spawnX, spawnY, scale, false));
            }
        },

        update: function () {
            this.time += 1;
            if (this.spawnCooldown > 0) this.spawnCooldown--;

            if (mouse.active) {
                mouse.vx = (mouse.x - mouse.prevX);
                mouse.vy = (mouse.y - mouse.prevY);
                mouse.speed = Math.hypot(mouse.vx, mouse.vy);
                mouse.prevX = mouse.x;
                mouse.prevY = mouse.y;

                if (Date.now() - mouse.lastMoved > 150) {
                    mouse.vx *= 0.5;
                    mouse.vy *= 0.5;
                    mouse.speed *= 0.5;
                }
                if (Date.now() - mouse.lastMoved > 800) {
                    mouse.active = false;
                }
            }

            const w = canvas.width;
            const h = canvas.height;

            for (let i = 0; i < this.swarms.length; i++) {
                let swarm = this.swarms[i];
                swarm.update(w, h, this.time);
                if (swarm.isDead(w)) {
                    this.swarms.splice(i, 1);
                    i--;
                }
            }

            let activeDriftingClouds = this.swarms.filter(s => s.state === 'drifting' || s.state === 'emerging');
            let onScreenCount = activeDriftingClouds.filter(s => s.x > 30 && s.x < w - 30).length;
            let targetCount = this.getTargetCloudCount();

            if (onScreenCount < 2 && this.spawnCooldown <= 0) {
                this.spawnIncomingCloud(w, h, true);
                this.spawnCooldown = 50;
            } else if (activeDriftingClouds.length < targetCount && this.spawnCooldown <= 0) {
                this.spawnIncomingCloud(w, h, false);
                this.spawnCooldown = 60;
            }

            for (let mist of this.ambient) {
                mist.update(w, h);
            }
        },

        render: function () {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            ctx.save();
            for (let mist of this.ambient) {
                mist.draw(ctx);
            }
            for (let swarm of this.swarms) {
                swarm.draw(ctx);
            }
            ctx.restore();
        }
    };

    function c_random(min, max) {
        return Math.random() * (max - min) + min;
    }

    // --- Pointer & Touch Handlers ---
    function handlePointerMove(e) {
        const bounds = canvas.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;

        const scaleX = canvas.width / bounds.width;
        const scaleY = canvas.height / bounds.height;
        const realX = (clientX - bounds.left) * scaleX;
        const realY = (clientY - bounds.top) * scaleY;

        if (!mouse.active) {
            mouse.prevX = realX;
            mouse.prevY = realY;
        }

        mouse.x = realX;
        mouse.y = realY;
        mouse.active = true;
        mouse.lastMoved = Date.now();
    }

    function handlePointerDown(e) {
        handlePointerMove(e);
        mouse.radius = 180;
        setTimeout(() => {
            mouse.radius = 120;
        }, 200);
    }

    const startSection = document.querySelector(".secondaryStartSection") || canvas;
    startSection.addEventListener("mousemove", handlePointerMove, { passive: true });
    startSection.addEventListener("mousedown", handlePointerDown, { passive: true });
    startSection.addEventListener("touchmove", handlePointerMove, { passive: true });
    startSection.addEventListener("touchstart", handlePointerDown, { passive: true });

    startSection.addEventListener("mouseleave", () => {
        mouse.active = false;
    });

    window.addEventListener("resize", () => {
        simulation.resize();
    });
    window.addEventListener("load", () => {
        simulation.init();
    });

    // --- 60 FPS Loop ---
    let isVisible = true;
    let isTabVisible = !document.hidden;
    let animId = null;

    function loop() {
        if (isVisible && isTabVisible) {
            simulation.update();
            simulation.render();
            animId = requestAnimationFrame(loop);
        } else {
            animId = null;
        }
    }

    function startLoop() {
        if (!animId && isVisible && isTabVisible) {
            animId = requestAnimationFrame(loop);
        }
    }

    function stopLoop() {
        if (animId) {
            cancelAnimationFrame(animId);
            animId = null;
        }
    }

    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                isVisible = entry.isIntersecting;
                if (isVisible) startLoop();
                else stopLoop();
            });
        });
        observer.observe(canvas);
    }

    document.addEventListener("visibilitychange", () => {
        isTabVisible = !document.hidden;
        if (isTabVisible) startLoop();
        else stopLoop();
    });

    simulation.init();
    startLoop();
})();
