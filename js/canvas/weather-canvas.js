/**
 * weather-canvas.js
 * Unified Atmospheric & Digital Weather Engine
 * Blends Realistic Meteorological Clouds across 3 Dynamic Stages:
 *
 * Stage 1: Fair-Weather Cumulus & Isobar Flow (Bright clouds drifting with wind vectors)
 * Stage 2: Nimbus Clouds & Digital Rain (Clouds darken into slate-nimbus; rain precipitates from cloud bases with splash hydrodynamics)
 * Stage 3: Thunderhead Supercells & Fractal Lightning (Clouds darken into deep storm tempests; lightning discharges originate from clouds)
 */

(function () {
    const canvas = /** @type {HTMLCanvasElement | null} */ (document.getElementById("canvas"));
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // High DPI Retina Support
    let dpr = window.devicePixelRatio || 1;
    let width = 900;
    let height = 600;

    function resizeCanvas() {
        const parent = canvas.parentElement;
        const rectWidth = parent ? (parent.clientWidth || parent.offsetWidth || 900) : 900;
        const rectHeight = parent ? (parent.clientHeight || parent.offsetHeight || 600) : 600;

        width = Math.max(300, Math.floor(rectWidth));
        height = Math.max(250, Math.floor(rectHeight));

        dpr = window.devicePixelRatio || 1;
        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);
        canvas.style.width = "100%";
        canvas.style.height = "100%";

        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.scale(dpr, dpr);
    }

    // --- State & Navigation ---
    const STATE = {
        currentStage: 0,       // 0: Vapor, 1: Rain, 2: Lightning
        targetStage: 0,
        stageProgress: 0.0,    // 0.0 to 2.0 continuous
        scrollProgress: 0.0,
        isProgrammaticNav: false,
        programmaticTargetIdx: -1,
        programmaticUntil: 0,
        time: 0,
        mouseX: -1000,
        mouseY: -1000,
        prevMouseX: -1000,
        prevMouseY: -1000,
        mouseVx: 0,
        mouseVy: 0,
        mouseActive: false,
        lastCardStage: -1
    };

    const STAGE_META = [
        {
            title: "01 // CLOUD VAPOR",
            subtitle: "Fair-Weather Cumulus & Isobars",
            badge: "Cumulus Clouds | Wind Flow",
            desc: "Realistic fair-weather cumulus cloud swarms drifting along aerodynamic isobar streamlines.",
            cardBadge: "[ Software Engineer & Cloud Architecture ]",
            cardHeader: "About me",
            cardText: "Hey, I'm Jonathan, a passionate software developer specializing in high-performance backend systems, distributed architectures, network protocols, and modern machine learning applications.<br><br>Currently pursuing my Master's in Business Informatics at TU Wien after graduating with distinction in Software Engineering &amp; Management (BSc) from TU Graz.",
            cardBtnText: "&gt; Learn more",
            cardBtnAction: function (e) {
                if (e) {
                    if (typeof e.preventDefault === "function") e.preventDefault();
                    if (typeof e.stopPropagation === "function") e.stopPropagation();
                }
                if (typeof Links !== "undefined" && typeof Links.goToPage === "function") {
                    Links.goToPage(1, 0, 0);
                } else {
                    sessionStorage.setItem("currentPage", "0");
                    window.location.href = "about.html#about";
                }
            }
        },
        {
            title: "02 // DIGITAL RAIN",
            subtitle: "Darkening Nimbus & Precipitation",
            badge: "Nimbus Rain | Splash Physics",
            desc: "Clouds condense into slate nimbus; precipitation falls directly from cloud bases with splash hydrodynamics.",
            cardBadge: "[ Cloud Architecture | Microservices & Kafka ]",
            cardHeader: "Experience &amp; Systems",
            cardText: "Designing scalable cloud microservices, asynchronous messaging pipelines, and resilient backend architectures.<br><br>Hands-on enterprise experience across cloud platforms, event-driven streaming with Java &amp; Apache Kafka, and modern full-stack web solutions.",
            cardBtnText: "&gt; View Experience",
            cardBtnAction: function (e) {
                if (e) {
                    if (typeof e.preventDefault === "function") e.preventDefault();
                    if (typeof e.stopPropagation === "function") e.stopPropagation();
                }
                if (typeof Links !== "undefined" && typeof Links.goToPage === "function") {
                    Links.goToPage(1, 0, 0);
                } else {
                    sessionStorage.setItem("currentPage", "0");
                    window.location.href = "about.html#about";
                }
            }
        },
        {
            title: "03 // LIGHTNING STORM",
            subtitle: "Thunderhead Supercell & Tempest Rain",
            badge: "Storm Supercell | Rain & Lightning",
            desc: "Deep tempest supercells with dielectric breakdown branching lightning alongside torrential precipitation.",
            cardBadge: "[ Bare-Metal K3s | Homelab & Microservices ]",
            cardHeader: "Projects &amp; Homelab",
            cardText: "Deploying and orchestrating personal cloud services on a self-hosted bare-metal Raspberry Pi 5 K3s cluster with automated GitOps delivery via ArgoCD and GitHub Container Registry.<br><br>Active creator of live applications including OpScout, SnapDeck, and Pagi.",
            cardBtnText: "&gt; Explore Projects &amp; Apps",
            cardBtnAction: function (e) {
                if (e) {
                    if (typeof e.preventDefault === "function") e.preventDefault();
                    if (typeof e.stopPropagation === "function") e.stopPropagation();
                }
                if (typeof Links !== "undefined" && typeof Links.goToPage === "function") {
                    Links.goToPage(1, 1, 0);
                } else {
                    sessionStorage.setItem("currentPage", "1");
                    window.location.href = "about.html#projects";
                }
            }
        }
    ];

    function c_random(min, max) {
        return Math.random() * (max - min) + min;
    }

    // =========================================================================
    // MULTI-TIER REALISTIC CLOUD SPRITES (Fair, Nimbus & Storm)
    // =========================================================================
    function createGlowSprite(size, r, g, b, coreAlpha, haloAlpha) {
        const offCanvas = document.createElement("canvas");
        offCanvas.width = size;
        offCanvas.height = size;
        const offCtx = offCanvas.getContext("2d");
        const center = size / 2;
        const radius = size / 2;

        const grad = offCtx.createRadialGradient(center, center, 0, center, center, radius);
        grad.addColorStop(0.00, `rgba(${r}, ${g}, ${b}, ${coreAlpha})`);
        grad.addColorStop(0.30, `rgba(${r}, ${g}, ${b}, ${coreAlpha * 0.85})`);
        grad.addColorStop(0.60, `rgba(${r - 10}, ${g - 5}, ${b}, ${haloAlpha})`);
        grad.addColorStop(0.85, `rgba(${r - 20}, ${g - 10}, ${b}, ${haloAlpha * 0.3})`);
        grad.addColorStop(1.00, `rgba(${r}, ${g}, ${b}, 0.0)`);

        offCtx.fillStyle = grad;
        offCtx.beginPath();
        offCtx.arc(center, center, radius, 0, Math.PI * 2);
        offCtx.fill();
        return offCanvas;
    }

    // 1. Fair Weather Sprites (Pure brilliant white with bright halo)
    const SPRITES_FAIR = {
        droplet: createGlowSprite(24, 255, 255, 255, 1.0, 0.70),
        small: createGlowSprite(48, 255, 255, 255, 1.0, 0.60),
        medium: createGlowSprite(80, 255, 255, 255, 0.98, 0.50),
        large: createGlowSprite(130, 255, 255, 255, 0.92, 0.40)
    };

    // 2. Rain Nimbus Sprites (Slate-blue & gathering condensation)
    const SPRITES_RAIN = {
        droplet: createGlowSprite(24, 130, 168, 200, 0.98, 0.50),
        small: createGlowSprite(48, 110, 150, 188, 0.90, 0.40),
        medium: createGlowSprite(80, 95, 135, 175, 0.82, 0.35),
        large: createGlowSprite(130, 80, 120, 160, 0.72, 0.28)
    };

    // 3. Storm Thunderhead Sprites (Deep tempest navy & dark electric core)
    const SPRITES_STORM = {
        droplet: createGlowSprite(24, 75, 105, 135, 0.98, 0.55),
        small: createGlowSprite(48, 58, 88, 118, 0.92, 0.45),
        medium: createGlowSprite(80, 45, 72, 102, 0.85, 0.40),
        large: createGlowSprite(130, 35, 58, 88, 0.78, 0.32)
    };

    // =========================================================================
    // 7 METEOROLOGICAL CLOUD ARCHETYPES (from About Me Page)
    // =========================================================================
    const CLOUD_ARCHETYPES = [
        // 1. Cumulus Mediocris (Multi-tier billowing summits)
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
        // 2. Cumulus Humilis (Flat-bottomed fair-weather puff)
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
        // 3. Stratocumulus (Elongated horizontal cloud bank)
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
        // 4. Double-Summit Cumulus (Twin summits)
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
        // 5. Cumulus Fractus (Ragged wispy cloud)
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
        // 6. Wind-Sheared Anvil
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
        // 7. Altocumulus Puff Cluster
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

    // =========================================================================
    // REALISTIC CLOUD SWARM PARTICLE & ENTITY
    // =========================================================================
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
            this.type = normDist < 0.35 ? 'large' : (normDist < 0.70 ? 'medium' : (Math.random() < 0.25 ? 'droplet' : 'small'));

            if (this.type === 'large') {
                this.size = (Math.random() * 22 + 45) * scaleMul;
                this.baseAlpha = Math.random() * 0.15 + 0.82;
                this.mass = 1.6;
            } else if (this.type === 'medium') {
                this.size = (Math.random() * 18 + 28) * scaleMul;
                this.baseAlpha = Math.random() * 0.15 + 0.78;
                this.mass = 1.0;
            } else if (this.type === 'droplet') {
                this.size = (Math.random() * 6 + 4) * scaleMul;
                this.baseAlpha = Math.random() * 0.15 + 0.85;
                this.mass = 0.5;
            } else {
                this.size = (Math.random() * 14 + 18) * scaleMul;
                this.baseAlpha = Math.random() * 0.15 + 0.72;
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
                    this.vx = Math.cos(angle) * spd + STATE.mouseVx * 0.15;
                    this.vy = Math.sin(angle) * spd + STATE.mouseVy * 0.15;
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

            // Interactive wind displacement across ALL stages
            if (STATE.mouseActive) {
                let mdx = this.x - STATE.mouseX;
                let mdy = this.y - STATE.mouseY;
                let mdist = Math.hypot(mdx, mdy);
                if (mdist < 140 && mdist > 1) {
                    let force = (1 - mdist / 140) * 0.40;
                    this.vx += (mdx / mdist) * force + STATE.mouseVx * 0.05;
                    this.vy += (mdy / mdist) * force + STATE.mouseVy * 0.05;
                }
            }

            this.vx *= 0.93;
            this.vy *= 0.93;
            this.x += this.vx;
            this.y += this.vy;
        }

        draw(ctx, stageProgress) {
            let effectiveAlpha = this.alpha * this.swarm.fadeInAlpha;
            if (effectiveAlpha <= 0.005) return;

            let half = this.size;
            let drawX = this.x - half;
            let drawY = this.y - half;
            let diam = half * 2;

            if (stageProgress <= 1.0) {
                let p = Math.max(0, Math.min(1, stageProgress));
                let spriteFair = SPRITES_FAIR[this.type];
                let spriteRain = SPRITES_RAIN[this.type];

                if (p < 0.98) {
                    ctx.globalAlpha = effectiveAlpha * (1 - p);
                    ctx.drawImage(spriteFair, drawX, drawY, diam, diam);
                }
                if (p > 0.02) {
                    ctx.globalAlpha = effectiveAlpha * p;
                    ctx.drawImage(spriteRain, drawX, drawY, diam, diam);
                }
            } else {
                let p = Math.max(0, Math.min(1, stageProgress - 1.0));
                let spriteRain = SPRITES_RAIN[this.type];
                let spriteStorm = SPRITES_STORM[this.type];

                if (p < 0.98) {
                    ctx.globalAlpha = effectiveAlpha * (1 - p);
                    ctx.drawImage(spriteRain, drawX, drawY, diam, diam);
                }
                if (p > 0.02) {
                    ctx.globalAlpha = effectiveAlpha * p;
                    ctx.drawImage(spriteStorm, drawX, drawY, diam, diam);
                }
            }
        }
    }

    class CloudSwarm {
        constructor(w, h, startX, startY, customScale, shouldEmerge = false, archetypeIndex) {
            const arch = archetypeIndex !== undefined
                ? CLOUD_ARCHETYPES[archetypeIndex % CLOUD_ARCHETYPES.length]
                : CLOUD_ARCHETYPES[Math.floor(Math.random() * CLOUD_ARCHETYPES.length)];

            this.lobes = generateUniqueCloudLobes(arch);
            this.x = startX !== undefined ? startX : -180;
            this.y = startY !== undefined ? startY : Math.random() * (h * 0.45) + (h * 0.08);

            this.targetScale = customScale !== undefined ? customScale : c_random(0.85, 1.35);
            this.vx = (Math.random() * 0.10 + 0.16) / Math.sqrt(this.targetScale);
            this.vy = (Math.random() - 0.5) * 0.03;
            this.scale = shouldEmerge ? this.targetScale * 0.60 : this.targetScale;
            this.radius = 130 * this.targetScale;

            this.state = shouldEmerge ? 'emerging' : 'drifting';
            this.emergenceProgress = shouldEmerge ? 0.0 : 1.0;
            this.fadeInAlpha = shouldEmerge ? 0.0 : 1.0;
            this.condensationFactor = shouldEmerge ? 1.40 : 1.0;
            this.particles = [];

            const count = Math.round(150 * Math.sqrt(this.targetScale));
            for (let i = 0; i < count; i++) {
                let lobe = this.lobes[i % this.lobes.length];
                this.particles.push(new CloudSwarmParticle(this, lobe));
            }
        }

        update(w, h, time) {
            this.x += this.vx;
            this.y += this.vy + Math.sin(time * 0.008 + this.x * 0.002) * 0.05;

            if (this.state === 'emerging') {
                this.emergenceProgress += 0.004;
                let p = Math.min(1.0, this.emergenceProgress);
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

            if (STATE.mouseActive && (this.state === 'drifting' || (this.state === 'emerging' && this.fadeInAlpha > 0.3))) {
                let dx = this.x - STATE.mouseX;
                let dy = this.y - STATE.mouseY;
                let dist = Math.hypot(dx, dy);

                if (dist < this.radius + 50) {
                    this.state = 'dissolving';
                }
            }

            for (let p of this.particles) {
                p.update(time);
            }
        }

        isDead(w) {
            let allFaded = this.state === 'dissolving' && this.particles.every(p => p.alpha <= 0.02);
            let offScreen = this.x - 280 > w;
            return allFaded || offScreen;
        }

        draw(ctx, stageProgress) {
            ctx.save();
            for (let p of this.particles) {
                p.draw(ctx, stageProgress);
            }
            ctx.restore();
            ctx.globalAlpha = 1.0;
        }
    }

    // =========================================================================
    // ISOBAR STREAMLINES & ATMOSPHERIC WIND FLOW (Active across all 3 stages)
    // =========================================================================
    class IsobarStreamlineSystem {
        constructor() {
            this.isobars = [];
        }

        init(w, h) {
            this.isobars = [];
            for (let i = 0; i < 3; i++) {
                this.isobars.push({
                    baseY: h * (0.24 + i * 0.22),
                    amp: Math.random() * 10 + 8,
                    freq: Math.random() * 0.005 + 0.004,
                    speed: Math.random() * 0.015 + 0.01,
                    baseHpa: 1018.4 - i * 3.8
                });
            }
        }

        draw(ctx) {
            ctx.save();

            // Atmospheric pressure drops as storm develops (Fair 1018hPa -> Rain 1004hPa -> Storm 984hPa)
            const pressureDrop = STATE.stageProgress * 16.0;

            for (let ib of this.isobars) {
                const currentHpa = (ib.baseHpa - pressureDrop).toFixed(1);

                ctx.beginPath();
                if (STATE.stageProgress < 1.0) {
                    ctx.strokeStyle = "rgba(84, 155, 207, 0.35)";
                } else if (STATE.stageProgress < 1.5) {
                    ctx.strokeStyle = "rgba(45, 110, 160, 0.32)";
                } else {
                    ctx.strokeStyle = "rgba(0, 210, 255, 0.30)";
                }

                ctx.lineWidth = 1.2;
                ctx.setLineDash([8, 6]);

                for (let x = 0; x <= width; x += 15) {
                    let baseLineY = ib.baseY + Math.sin(x * ib.freq + STATE.time * ib.speed) * ib.amp;
                    let mouseDisplacement = 0;

                    // Mouse creates aerodynamic wake across the streamlines
                    if (STATE.mouseActive) {
                        let mdx = x - STATE.mouseX;
                        let mdy = baseLineY - STATE.mouseY;
                        let dist = Math.hypot(mdx, mdy);
                        if (dist < 130) {
                            mouseDisplacement = Math.sin((1 - dist / 130) * Math.PI) * (STATE.mouseVy * 0.6 + (mdy / (dist + 1)) * 14);
                        }
                    }

                    const y = baseLineY + mouseDisplacement;
                    if (x === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
                ctx.stroke();
                ctx.setLineDash([]);

                const labelX = width * 0.80;
                let labelY = ib.baseY + Math.sin(labelX * ib.freq + STATE.time * ib.speed) * ib.amp;

                if (STATE.stageProgress >= 1.5) {
                    ctx.fillStyle = "rgba(0, 210, 255, 0.85)";
                    ctx.font = "bold 9px monospace";
                    ctx.textAlign = "left";
                    ctx.fillText(`[ LOW ] ${currentHpa} hPa`, labelX - 25, labelY - 4);
                } else {
                    ctx.fillStyle = "rgba(35, 92, 135, 0.80)";
                    ctx.font = "9px monospace";
                    ctx.textAlign = "left";
                    ctx.fillText(`${currentHpa} hPa`, labelX, labelY - 4);
                }
            }

            ctx.restore();
        }
    }

    // =========================================================================
    // STAGE 2: DIGITAL RAIN (Spawns directly from Darkening Clouds)
    // =========================================================================
    class DigitalRainSystem {
        constructor() {
            this.drops = [];
            this.splashes = [];
            this.ripples = [];
            this.umbrellaRadius = 80;
        }

        init(w, h) {
            this.drops = [];
            this.splashes = [];
            this.ripples = [];

            const totalDrops = Math.min(220, Math.floor((w * h) / 2400));
            for (let i = 0; i < totalDrops; i++) {
                this.drops.push(this.createDrop(w, h, true));
            }
        }

        createDrop(w, h, randomizeY = false, cloudSource = null) {
            const speed = Math.random() * 6 + 12;
            let startX, startY;

            if (cloudSource) {
                startX = cloudSource.x + (Math.random() - 0.5) * (cloudSource.radius * 1.6);
                startY = cloudSource.y + Math.random() * 25 + 10;
            } else {
                startX = Math.random() * (w + 140) - 70;
                startY = randomizeY ? Math.random() * h : Math.random() * -70 - 10;
            }

            return {
                x: startX,
                y: startY,
                speed,
                length: Math.random() * 10 + 16,
                slant: Math.random() * 1.2 + 2.0,
                alpha: Math.random() * 0.35 + 0.55,
                thickness: Math.random() * 0.8 + 1.1,
                color: Math.random() < 0.35 ? "#0284c7" : (Math.random() < 0.35 ? "#0369a1" : "#549bcf")
            };
        }

        createFloorSplash(x, y) {
            const count = Math.floor(Math.random() * 3) + 3;
            for (let i = 0; i < count; i++) {
                const angle = (Math.random() * 0.75 + 0.12) * -Math.PI;
                const spd = Math.random() * 3.2 + 1.8;
                this.splashes.push({
                    x,
                    y,
                    vx: Math.cos(angle) * spd + (Math.random() - 0.5) * 1.2,
                    vy: Math.sin(angle) * spd,
                    alpha: 1.0,
                    size: Math.random() * 1.0 + 1.3,
                    color: Math.random() < 0.4 ? "#0284c7" : "#0ea5e9",
                    decay: Math.random() * 0.035 + 0.035
                });
            }

            this.ripples.push({
                x,
                y,
                rx: 2.0,
                ry: 0.6,
                alpha: 0.65,
                color: "#0284c7",
                maxRx: Math.random() * 8 + 10
            });
        }

        createUmbrellaSplash(hitX, hitY, centerMx, centerMy) {
            const normalAngle = Math.atan2(hitY - centerMy, hitX - centerMx);
            const side = (hitX < centerMx) ? -1 : 1;
            const tangentAngle = normalAngle + (Math.PI / 2) * side;

            const count = Math.floor(Math.random() * 2) + 3;
            for (let i = 0; i < count; i++) {
                const spd = Math.random() * 3.0 + 2.0;
                const jitter = (Math.random() - 0.5) * 0.6;
                const sprayAngle = tangentAngle + jitter;

                this.splashes.push({
                    x: hitX,
                    y: hitY,
                    vx: Math.cos(sprayAngle) * spd + (side * 0.8),
                    vy: Math.sin(sprayAngle) * spd * 0.7 - 1.0,
                    alpha: 1.0,
                    size: Math.random() * 0.8 + 1.4,
                    color: Math.random() < 0.4 ? "#00d2ff" : "#0284c7",
                    decay: Math.random() * 0.04 + 0.035
                });
            }
        }

        update(w, h, activeClouds) {
            const floorY = h - 52;

            for (let d of this.drops) {
                d.x += d.slant;
                d.y += d.speed;

                // Mouse wind shear aerodynamic deflection on raindrops across all stages
                if (STATE.mouseActive) {
                    let rdx = d.x - STATE.mouseX;
                    let rdy = d.y - STATE.mouseY;
                    let rdist = Math.hypot(rdx, rdy);
                    if (rdist < 130 && rdist > 1) {
                        let windPush = (1 - rdist / 130) * 0.45;
                        d.x += STATE.mouseVx * 0.05 + (rdx / rdist) * windPush;
                    }
                }

                if (STATE.mouseActive) {
                    const umbrellaCenterY = STATE.mouseY - 8;
                    const dx = d.x - STATE.mouseX;
                    const dy = d.y - umbrellaCenterY;
                    const dist = Math.hypot(dx, dy);

                    if (dist < this.umbrellaRadius && dy < 15 && dy > -this.umbrellaRadius) {
                        this.createUmbrellaSplash(d.x, d.y, STATE.mouseX, umbrellaCenterY);
                        const parentCloud = activeClouds.length > 0 ? activeClouds[Math.floor(Math.random() * activeClouds.length)] : null;
                        Object.assign(d, this.createDrop(w, h, false, parentCloud));
                        continue;
                    }
                }

                if (d.y >= floorY) {
                    this.createFloorSplash(d.x, floorY);
                    const parentCloud = activeClouds.length > 0 ? activeClouds[Math.floor(Math.random() * activeClouds.length)] : null;
                    Object.assign(d, this.createDrop(w, h, false, parentCloud));
                }
            }

            for (let i = 0; i < this.splashes.length; i++) {
                const s = this.splashes[i];
                s.vy += 0.22;
                s.vx *= 0.97;
                s.x += s.vx;
                s.y += s.vy;
                s.alpha -= s.decay;

                if (s.alpha <= 0) {
                    this.splashes.splice(i, 1);
                    i--;
                }
            }

            for (let i = 0; i < this.ripples.length; i++) {
                const r = this.ripples[i];
                r.rx += 0.65;
                r.ry += 0.22;
                r.alpha -= 0.028;

                if (r.alpha <= 0 || r.rx > r.maxRx) {
                    this.ripples.splice(i, 1);
                    i--;
                }
            }
        }

        // 1. Rain Streaks (drawn behind clouds)
        drawRain(ctx, opacity) {
            if (opacity <= 0.01) return;
            ctx.save();
            ctx.globalAlpha = opacity;

            for (let d of this.drops) {
                ctx.beginPath();
                ctx.moveTo(d.x, d.y);
                ctx.lineTo(d.x - d.slant * 1.6, d.y - d.length);
                ctx.strokeStyle = d.color;
                ctx.lineWidth = d.thickness;
                ctx.globalAlpha = opacity * d.alpha;
                ctx.stroke();
            }

            ctx.restore();
        }

        // 2. Foreground Elements (Floor surface, ripples, splashes, and Umbrella Shield)
        drawForeground(ctx, opacity) {
            if (opacity <= 0.01) return;
            ctx.save();
            ctx.globalAlpha = opacity;

            const floorY = height - 52;
            ctx.globalAlpha = opacity * 0.40;
            ctx.strokeStyle = "rgba(84, 155, 207, 0.55)";
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.moveTo(0, floorY);
            ctx.lineTo(width, floorY);
            ctx.stroke();

            for (let r of this.ripples) {
                ctx.globalAlpha = opacity * r.alpha;
                ctx.strokeStyle = "rgba(2, 132, 199, 0.75)";
                ctx.lineWidth = 1.2;
                ctx.beginPath();
                ctx.ellipse(r.x, r.y, r.rx, r.ry, 0, 0, Math.PI * 2);
                ctx.stroke();
            }

            for (let s of this.splashes) {
                ctx.globalAlpha = opacity * s.alpha;
                ctx.strokeStyle = s.color;
                ctx.fillStyle = s.color;
                ctx.lineWidth = 1.2;

                ctx.beginPath();
                ctx.moveTo(s.x, s.y);
                ctx.lineTo(s.x - s.vx * 1.5, s.y - s.vy * 1.5);
                ctx.stroke();

                ctx.beginPath();
                ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
                ctx.fill();
            }

            if (STATE.mouseActive) {
                const umbrellaCenterY = STATE.mouseY - 8;

                ctx.globalAlpha = opacity * 0.85;
                ctx.strokeStyle = "#00d2ff";
                ctx.lineWidth = 2.0;

                ctx.beginPath();
                ctx.arc(STATE.mouseX, umbrellaCenterY, this.umbrellaRadius, Math.PI * 0.92, Math.PI * 2.08);
                ctx.stroke();

                const shieldGrad = ctx.createRadialGradient(
                    STATE.mouseX, umbrellaCenterY, 0,
                    STATE.mouseX, umbrellaCenterY, this.umbrellaRadius
                );
                shieldGrad.addColorStop(0, "rgba(0, 210, 255, 0.16)");
                shieldGrad.addColorStop(0.75, "rgba(0, 210, 255, 0.08)");
                shieldGrad.addColorStop(1, "rgba(0, 210, 255, 0.0)");
                ctx.fillStyle = shieldGrad;
                ctx.beginPath();
                ctx.arc(STATE.mouseX, umbrellaCenterY, this.umbrellaRadius, Math.PI * 0.92, Math.PI * 2.08);
                ctx.fill();

                ctx.fillStyle = "rgba(35, 92, 135, 0.90)";
                ctx.font = "bold 9px monospace";
                ctx.textAlign = "center";
                ctx.fillText("[ FORCEFIELD UMBRELLA ]", STATE.mouseX, umbrellaCenterY - this.umbrellaRadius - 6);
            }

            ctx.restore();
        }
    }

    // =========================================================================
    // STAGE 3: PROCEDURAL FRACTAL LIGHTNING (Originates from Storm Clouds)
    // =========================================================================
    class LightningStormSystem {
        constructor() {
            this.bolts = [];
            this.groundSparks = [];
            this.skyFlashAlpha = 0;
            this.lastStrikeTime = 0;
        }

        init(w, h) {
            this.bolts = [];
            this.groundSparks = [];
            this.lastStrikeTime = Date.now();
        }

        createBolt(startX, startY, endX, endY, depth = 5, branchProb = 0.65) {
            const segments = [];

            const generateBranch = (x1, y1, x2, y2, curDepth, branchFactor) => {
                if (curDepth === 0) {
                    segments.push({ x1, y1, x2, y2, alpha: 1.0 });
                    return;
                }

                const midX = (x1 + x2) / 2;
                const midY = (y1 + y2) / 2;
                const dist = Math.hypot(x2 - x1, y2 - y1);
                const offset = (Math.random() - 0.5) * dist * 0.38;

                const angle = Math.atan2(y2 - y1, x2 - x1) + Math.PI / 2;
                const dispX = midX + Math.cos(angle) * offset;
                const dispY = midY + Math.sin(angle) * offset;

                generateBranch(x1, y1, dispX, dispY, curDepth - 1, branchFactor);
                generateBranch(dispX, dispY, x2, y2, curDepth - 1, branchFactor);

                if (Math.random() < branchFactor && curDepth >= 2) {
                    const branchAngle = angle + (Math.random() - 0.5) * 1.2;
                    const branchLength = dist * 0.45;
                    const bx = dispX + Math.cos(branchAngle) * branchLength;
                    const by = dispY + Math.sin(branchAngle) * branchLength;
                    generateBranch(dispX, dispY, bx, by, curDepth - 2, branchFactor * 0.5);
                }
            };

            generateBranch(startX, startY, endX, endY, depth, branchProb);

            return {
                segments,
                alpha: 1.0,
                decay: 0.045,
                color: Math.random() < 0.3 ? "#ffffff" : "#00d2ff",
                hitX: endX,
                hitY: endY
            };
        }

        strike(activeClouds, targetX = null, targetY = null) {
            let startX, startY;

            if (activeClouds && activeClouds.length > 0) {
                const cloud = activeClouds[Math.floor(Math.random() * activeClouds.length)];
                startX = cloud.x + (Math.random() - 0.5) * (cloud.radius * 0.8);
                startY = cloud.y + 15;
            } else {
                startX = width * (0.2 + Math.random() * 0.6);
                startY = height * 0.12;
            }

            const endX = targetX !== null ? targetX : (width * (0.15 + Math.random() * 0.7));
            const endY = targetY !== null ? targetY : (height - 52);

            const bolt = this.createBolt(startX, startY, endX, endY);
            this.bolts.push(bolt);
            this.skyFlashAlpha = 0.30;

            for (let i = 0; i < 14; i++) {
                const angle = Math.random() * Math.PI + Math.PI;
                const spd = Math.random() * 6 + 2;
                this.groundSparks.push({
                    x: endX,
                    y: endY,
                    vx: Math.cos(angle) * spd,
                    vy: Math.sin(angle) * spd * 0.9,
                    alpha: 1.0,
                    decay: Math.random() * 0.06 + 0.04
                });
            }
        }

        update(w, h, activeClouds, lightningOp) {
            // Strictly only execute strikes during Stage 3
            if (lightningOp <= 0.01) return;

            if (Date.now() - this.lastStrikeTime > 2600) {
                this.strike(activeClouds);
                this.lastStrikeTime = Date.now();
            }

            if (this.skyFlashAlpha > 0) {
                this.skyFlashAlpha = Math.max(0, this.skyFlashAlpha - 0.03);
            }

            for (let i = 0; i < this.bolts.length; i++) {
                const b = this.bolts[i];
                b.alpha -= b.decay;
                if (b.alpha <= 0) {
                    this.bolts.splice(i, 1);
                    i--;
                }
            }

            for (let i = 0; i < this.groundSparks.length; i++) {
                const sp = this.groundSparks[i];
                sp.vy += 0.25;
                sp.x += sp.vx;
                sp.y += sp.vy;
                sp.alpha -= sp.decay;
                if (sp.alpha <= 0) {
                    this.groundSparks.splice(i, 1);
                    i--;
                }
            }
        }

        draw(ctx, opacity) {
            if (opacity <= 0.01) return;
            ctx.save();
            ctx.globalAlpha = opacity;

            if (this.skyFlashAlpha > 0.01) {
                ctx.fillStyle = `rgba(180, 230, 255, ${this.skyFlashAlpha * opacity})`;
                ctx.fillRect(0, 0, width, height);
            }

            for (let b of this.bolts) {
                ctx.strokeStyle = "rgba(0, 210, 255, 0.35)";
                ctx.lineWidth = 8;
                ctx.globalAlpha = opacity * b.alpha;
                ctx.beginPath();
                for (let seg of b.segments) {
                    ctx.moveTo(seg.x1, seg.y1);
                    ctx.lineTo(seg.x2, seg.y2);
                }
                ctx.stroke();

                ctx.strokeStyle = b.color;
                ctx.lineWidth = 3;
                ctx.globalAlpha = opacity * b.alpha;
                ctx.stroke();

                ctx.strokeStyle = "#ffffff";
                ctx.lineWidth = 1.2;
                ctx.globalAlpha = opacity * b.alpha * 0.9;
                ctx.stroke();
            }

            for (let sp of this.groundSparks) {
                ctx.globalAlpha = opacity * sp.alpha;
                ctx.fillStyle = "#ffffff";
                ctx.beginPath();
                ctx.arc(sp.x, sp.y, 2.5, 0, Math.PI * 2);
                ctx.fill();
            }

            ctx.restore();
        }
    }

    // =========================================================================
    // MAIN CLOUD SIMULATION MANAGER & UNIFIED ORCHESTRATOR
    // =========================================================================
    const cloudManager = {
        swarms: [],
        time: 0,
        spawnCooldown: 0,

        getTargetCount: function () {
            return width > 800 ? 3 : 2;
        },

        init: function (w, h) {
            this.swarms = [];
            const initialConfigs = [
                { x: w * 0.20, y: h * 0.22, s: 0.95, arch: 4 }, // Fractus
                { x: w * 0.58, y: h * 0.18, s: 1.30, arch: 0 }, // Mediocris
                { x: w * 0.35, y: h * 0.38, s: 1.10, arch: 1 }  // Humilis
            ];

            for (let cfg of initialConfigs) {
                this.swarms.push(new CloudSwarm(w, h, cfg.x, cfg.y, cfg.s, false, cfg.arch));
            }
        },

        spawnIncomingCloud: function (w, h, immediateOnScreen = false) {
            const bands = [h * 0.16, h * 0.26, h * 0.38];
            let bestBand = bands[Math.floor(Math.random() * bands.length)];
            let minConflict = Infinity;

            for (let band of bands) {
                let conflict = 0;
                for (let s of this.swarms) {
                    if (s.state !== 'dissolving' && Math.abs(s.y - band) < 90) {
                        conflict++;
                    }
                }
                if (conflict < minConflict) {
                    minConflict = conflict;
                    bestBand = band;
                }
            }

            let spawnY = bestBand + (Math.random() - 0.5) * 30;
            let scale = c_random(0.85, 1.35);

            if (immediateOnScreen) {
                let spawnX = c_random(w * 0.20, w * 0.55);
                this.swarms.push(new CloudSwarm(w, h, spawnX, spawnY, scale, true));
            } else {
                let spawnX = c_random(-180, -130);
                this.swarms.push(new CloudSwarm(w, h, spawnX, spawnY, scale, false));
            }
        },

        update: function (w, h, time) {
            if (this.spawnCooldown > 0) this.spawnCooldown--;

            for (let i = 0; i < this.swarms.length; i++) {
                let swarm = this.swarms[i];
                swarm.update(w, h, time);
                if (swarm.isDead(w)) {
                    this.swarms.splice(i, 1);
                    i--;
                }
            }

            let activeDrifting = this.swarms.filter(s => s.state === 'drifting' || s.state === 'emerging');
            let onScreen = activeDrifting.filter(s => s.x > 30 && s.x < w - 30).length;
            let targetCount = this.getTargetCount();

            if (onScreen < 2 && this.spawnCooldown <= 0) {
                this.spawnIncomingCloud(w, h, true);
                this.spawnCooldown = 50;
            } else if (activeDrifting.length < targetCount && this.spawnCooldown <= 0) {
                this.spawnIncomingCloud(w, h, false);
                this.spawnCooldown = 60;
            }
        },

        draw: function (ctx, stageProgress) {
            ctx.save();
            for (let swarm of this.swarms) {
                swarm.draw(ctx, stageProgress);
            }
            ctx.restore();
            ctx.globalAlpha = 1.0;
        }
    };

    const isobars = new IsobarStreamlineSystem();
    const rainSystem = new DigitalRainSystem();
    const lightningSystem = new LightningStormSystem();

    function initAll() {
        resizeCanvas();
        cloudManager.init(width, height);
        isobars.init(width, height);
        rainSystem.init(width, height);
        lightningSystem.init(width, height);
        updateUIBadges();
    }

    function setStage(index, shouldScroll = true) {
        if (index < 0 || index > 2) return;
        STATE.targetStage = index;
        STATE.isProgrammaticNav = true;
        STATE.programmaticTargetIdx = index;
        STATE.programmaticUntil = Date.now() + 1000;
        updateUIBadges();

        if (shouldScroll) {
            const heroWrapper = document.getElementById("heroScrollWrapper");
            if (heroWrapper) {
                const scrollDistance = heroWrapper.offsetHeight - window.innerHeight;
                if (scrollDistance > 0) {
                    // Stage 0: 10% progress in About Me (progress ~ 0.37)
                    // Stage 1: 50% progress in About Me (progress ~ 0.65)
                    // Stage 2: 85% progress in About Me (progress ~ 0.895)
                    const stageTargets = [0.10, 0.50, 0.85];
                    const targetAlgoProg = stageTargets[index] !== undefined ? stageTargets[index] : 0.50;
                    const targetOverallProg = 0.30 + targetAlgoProg * 0.70;
                    const targetScrollY = heroWrapper.offsetTop + scrollDistance * targetOverallProg;

                    window.scrollTo({
                        top: targetScrollY,
                        behavior: "smooth"
                    });
                }
            }
        }
    }

    function setScrollProgress(progress) {
        STATE.scrollProgress = progress;

        // If the user clicked a stage button, lock the stage until smooth scroll arrives or completes
        if (STATE.isProgrammaticNav) {
            const stageTargets = [0.10, 0.50, 0.85];
            const targetProg = stageTargets[STATE.programmaticTargetIdx] !== undefined ? stageTargets[STATE.programmaticTargetIdx] : 0.50;

            // Unlock once smooth scroll arrives within close proximity or timeout expires
            if (Math.abs(progress - targetProg) < 0.08 || Date.now() > STATE.programmaticUntil) {
                STATE.isProgrammaticNav = false;
            } else {
                // Keep targetStage locked to clicked index during intermediate scroll frames
                STATE.targetStage = STATE.programmaticTargetIdx;
                updateUIBadges();
                return;
            }
        }

        if (progress < 0.33) {
            STATE.targetStage = 0;
        } else if (progress < 0.66) {
            STATE.targetStage = 1;
        } else {
            STATE.targetStage = 2;
        }
        updateUIBadges();
    }

    function updateUIBadges() {
        const stageIdx = STATE.targetStage;
        const meta = STAGE_META[stageIdx];

        const pills = document.querySelectorAll(".algoStagePill");
        pills.forEach((p, idx) => {
            if (idx === stageIdx) {
                p.classList.add("active");
            } else {
                p.classList.remove("active");
            }
        });

        const statusHeader = document.getElementById("algoHudTitle");
        const statusBadge = document.getElementById("algoHudBadge");
        if (statusHeader) statusHeader.textContent = meta.title;
        if (statusBadge) statusBadge.textContent = meta.badge;

        const dynamicBadge = document.getElementById("aboutMeSubBadge");
        const headerEl = document.querySelector(".aboutMeHeader");
        const textEl = document.querySelector(".aboutMeText");
        const btnEl = document.querySelector(".aboutMeButton");

        if (dynamicBadge) {
            dynamicBadge.textContent = meta.cardBadge || `[ ${meta.badge} ]`;
        }

        if (headerEl instanceof HTMLElement && textEl instanceof HTMLElement && STATE.lastCardStage !== stageIdx) {
            STATE.lastCardStage = stageIdx;

            headerEl.style.transition = "opacity 0.2s ease, transform 0.2s ease";
            textEl.style.transition = "opacity 0.2s ease, transform 0.2s ease";
            headerEl.style.opacity = "0";
            textEl.style.opacity = "0";
            headerEl.style.transform = "translateY(3px)";
            textEl.style.transform = "translateY(3px)";

            setTimeout(() => {
                headerEl.innerHTML = meta.cardHeader;
                textEl.innerHTML = meta.cardText;
                if (btnEl instanceof HTMLElement) {
                    btnEl.innerHTML = meta.cardBtnText;
                    btnEl.onclick = meta.cardBtnAction;
                }
                headerEl.style.opacity = "1";
                textEl.style.opacity = "1";
                headerEl.style.transform = "translateY(0)";
                textEl.style.transform = "translateY(0)";
            }, 180);
        }
    }

    window.algorithmPlayground = {
        setStage: setStage,
        setScrollProgress: setScrollProgress,
        getStage: () => STATE.targetStage
    };

    // =========================================================================
    // POINTER & TOUCH INTERACTIONS
    // =========================================================================
    function handlePointer(e) {
        const rect = canvas.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;

        const currentX = clientX - rect.left;
        const currentY = clientY - rect.top;

        if (!STATE.mouseActive) {
            STATE.prevMouseX = currentX;
            STATE.prevMouseY = currentY;
        } else {
            STATE.mouseVx = currentX - STATE.prevMouseX;
            STATE.mouseVy = currentY - STATE.prevMouseY;
            STATE.prevMouseX = currentX;
            STATE.prevMouseY = currentY;
        }

        STATE.mouseX = currentX;
        STATE.mouseY = currentY;
        STATE.mouseActive = true;
    }

    function handleClick(e) {
        handlePointer(e);

        // Wind shockwave ripple pushes clouds across ALL stages
        for (let s of cloudManager.swarms) {
            for (let p of s.particles) {
                const dx = p.x - STATE.mouseX;
                const dy = p.y - STATE.mouseY;
                const d = Math.hypot(dx, dy);
                if (d < 160 && d > 1) {
                    p.vx += (dx / d) * 4.2;
                    p.vy += (dy / d) * 4.2;
                }
            }
        }

        if (STATE.targetStage === 2) {
            // Lightning strike directly to cursor in storm
            lightningSystem.strike(cloudManager.swarms, STATE.mouseX, STATE.mouseY);
            // Dynamic impact spray at strike point
            for (let i = 0; i < 10; i++) {
                const angle = Math.random() * Math.PI * 2;
                const spd = Math.random() * 4.0 + 2.0;
                rainSystem.splashes.push({
                    x: STATE.mouseX,
                    y: STATE.mouseY,
                    vx: Math.cos(angle) * spd,
                    vy: Math.sin(angle) * spd - 1.5,
                    alpha: 1.0,
                    size: Math.random() * 1.0 + 1.4,
                    color: Math.random() < 0.6 ? "#00d2ff" : "#ffffff",
                    decay: 0.04
                });
            }
        } else if (STATE.targetStage === 1) {
            for (let i = 0; i < 10; i++) {
                const angle = Math.random() * Math.PI * 2;
                const spd = Math.random() * 3.5 + 1.5;
                rainSystem.splashes.push({
                    x: STATE.mouseX,
                    y: STATE.mouseY,
                    vx: Math.cos(angle) * spd,
                    vy: Math.sin(angle) * spd - 1.0,
                    alpha: 1.0,
                    size: Math.random() * 0.8 + 1.4,
                    color: Math.random() < 0.5 ? "#00d2ff" : "#0284c7",
                    decay: 0.04
                });
            }
            rainSystem.ripples.push({
                x: STATE.mouseX,
                y: STATE.mouseY,
                rx: 2.5,
                ry: 0.8,
                alpha: 0.7,
                color: "#0284c7",
                maxRx: 16
            });
        }
    }

    const container = canvas.parentElement || canvas;
    container.addEventListener("mousemove", handlePointer, { passive: true });
    container.addEventListener("touchmove", handlePointer, { passive: true });
    container.addEventListener("click", handleClick, { passive: true });
    container.addEventListener("mouseleave", () => {
        STATE.mouseActive = false;
    });
    window.addEventListener("wheel", () => {
        STATE.isProgrammaticNav = false;
    }, { passive: true });

    window.addEventListener("touchstart", () => {
        STATE.isProgrammaticNav = false;
    }, { passive: true });

    window.addEventListener("resize", () => {
        initAll();
    });

    // =========================================================================
    // UNIFIED ANIMATION LOOP (60 FPS)
    // =========================================================================
    let animId = null;
    let isVisible = true;

    function render() {
        STATE.time++;

        // Smoothly interpolate stage progress
        STATE.stageProgress += (STATE.targetStage - STATE.stageProgress) * 0.08;
        STATE.currentStage = STATE.stageProgress;

        // Weights for weather effects across stages
        // Rain enters at stageProgress ~0.25, reaches full strength at Stage 2 (1.0), and STAYS fully active in Stage 3!
        let rainOp = STATE.stageProgress < 1.0
            ? Math.max(0, (STATE.stageProgress - 0.25) / 0.75)
            : 1.0;
        // STRICT: Lightning ONLY active in Stage 3 (stageProgress >= 1.35)
        let lightningOp = STATE.stageProgress >= 1.35 ? Math.min(1, (STATE.stageProgress - 1.35) / 0.65) : 0;

        ctx.globalAlpha = 1.0;
        ctx.clearRect(0, 0, width, height);

        // =====================================================================
        // DYNAMIC SKY BACKGROUND GRADIENT (Smoothly darkens/deepens per stage)
        // Stage 1: Sunny azure blue -> Stage 2: Overcast slate -> Stage 3: Tempest navy
        // =====================================================================
        const skyTop1 = [205, 233, 252]; // Stage 1: Fair Sky Top
        const skyMid1 = [226, 242, 253]; // Stage 1: Fair Sky Mid
        const skyBot1 = [238, 248, 254]; // Stage 1: Fair Sky Bottom

        const skyTop2 = [135, 168, 196]; // Stage 2: Nimbus Overcast Top
        const skyMid2 = [162, 190, 212]; // Stage 2: Nimbus Overcast Mid
        const skyBot2 = [185, 208, 226]; // Stage 2: Nimbus Overcast Bottom

        const skyTop3 = [42, 60, 80];    // Stage 3: Tempest Storm Top
        const skyMid3 = [58, 80, 104];   // Stage 3: Tempest Storm Mid
        const skyBot3 = [82, 108, 134];  // Stage 3: Tempest Storm Bottom

        function lerpColor(c1, c2, factor) {
            const f = Math.max(0, Math.min(1, factor));
            return [
                Math.round(c1[0] + (c2[0] - c1[0]) * f),
                Math.round(c1[1] + (c2[1] - c1[1]) * f),
                Math.round(c1[2] + (c2[2] - c1[2]) * f)
            ];
        }

        let curTop, curMid, curBot;
        if (STATE.stageProgress <= 1.0) {
            let f = Math.max(0, Math.min(1, STATE.stageProgress));
            curTop = lerpColor(skyTop1, skyTop2, f);
            curMid = lerpColor(skyMid1, skyMid2, f);
            curBot = lerpColor(skyBot1, skyBot2, f);
        } else {
            let f = Math.max(0, Math.min(1, STATE.stageProgress - 1.0));
            curTop = lerpColor(skyTop2, skyTop3, f);
            curMid = lerpColor(skyMid2, skyMid3, f);
            curBot = lerpColor(skyBot2, skyBot3, f);
        }

        const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
        skyGrad.addColorStop(0, `rgb(${curTop[0]}, ${curTop[1]}, ${curTop[2]})`);
        skyGrad.addColorStop(0.55, `rgb(${curMid[0]}, ${curMid[1]}, ${curMid[2]})`);
        skyGrad.addColorStop(1, `rgb(${curBot[0]}, ${curBot[1]}, ${curBot[2]})`);

        ctx.globalAlpha = 1.0;
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, width, height);

        // 1. Update Realistic Clouds across all 3 stages
        cloudManager.update(width, height, STATE.time);

        // 2. Update Weather Systems
        const activeClouds = cloudManager.swarms.filter(s => s.state === 'drifting' || s.state === 'emerging');
        if (rainOp > 0.01) rainSystem.update(width, height, activeClouds);
        if (lightningOp > 0.01) lightningSystem.update(width, height, activeClouds, lightningOp);

        // =====================================================================
        // REALISTIC DEPTH & Z-INDEX RENDER ORDER:
        // 1. Background Isobars (active across all 3 stages)
        // 2. Lightning arcs (drawn behind clouds, branching downwards)
        // 3. Falling Rain streaks (drawn behind clouds, emerging from base)
        // 4. Clouds (HIGHEST Z-INDEX in the sky layer)
        // 5. Foreground surface elements (Floor ripples, splashes & Umbrella Shield)
        // =====================================================================
        isobars.draw(ctx);
        if (lightningOp > 0.01) lightningSystem.draw(ctx, lightningOp);
        if (rainOp > 0.01) rainSystem.drawRain(ctx, rainOp);

        // Clouds cover rain and lightning origins
        cloudManager.draw(ctx, STATE.stageProgress);

        // Foreground water floor & interactive umbrella
        if (rainOp > 0.01) rainSystem.drawForeground(ctx, rainOp);

        if (isVisible) {
            animId = requestAnimationFrame(render);
        }
    }

    function startLoop() {
        if (!animId && isVisible) {
            animId = requestAnimationFrame(render);
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

    if ("ResizeObserver" in window && canvas.parentElement) {
        const resizeObserver = new ResizeObserver(() => {
            const parent = canvas.parentElement;
            if (parent && (parent.clientWidth !== width || parent.clientHeight !== height)) {
                resizeCanvas();
            }
        });
        resizeObserver.observe(canvas.parentElement);
    }

    initAll();
    startLoop();
})();
