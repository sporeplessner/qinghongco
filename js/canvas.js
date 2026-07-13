/* ==========================================================================
   Qinghongco - Canvas Animations
   Particle networks, code rain, waveform, orbiting nodes
   ========================================================================== */

(function () {
    'use strict';

    /* ===========================================
       Particle Network (Hero Background)
       =========================================== */

    function initParticleNetwork(canvasId, options = {}) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const config = Object.assign({
            particleCount: 80,
            maxDistance: 140,
            particleColor: 'rgba(232, 33, 39, 0.8)',
            lineColor: 'rgba(232, 33, 39, 0.15)',
            particleSize: 1.5,
            speed: 0.4
        }, options);

        let particles = [];
        let width = 0;
        let height = 0;
        let dpr = Math.min(window.devicePixelRatio || 1, 2);

        function resize() {
            const rect = canvas.parentElement.getBoundingClientRect();
            width = rect.width;
            height = rect.height;
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            canvas.style.width = width + 'px';
            canvas.style.height = height + 'px';
            ctx.scale(dpr, dpr);
            initParticles();
        }

        function initParticles() {
            particles = [];
            for (let i = 0; i < config.particleCount; i++) {
                particles.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    vx: (Math.random() - 0.5) * config.speed,
                    vy: (Math.random() - 0.5) * config.speed,
                    radius: Math.random() * config.particleSize + 0.5
                });
            }
        }

        function draw() {
            ctx.clearRect(0, 0, width, height);

            // Update + draw particles
            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];
                p.x += p.vx;
                p.y += p.vy;

                if (p.x < 0 || p.x > width) p.vx *= -1;
                if (p.y < 0 || p.y > height) p.vy *= -1;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = config.particleColor;
                ctx.fill();

                // Connections
                for (let j = i + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const dx = p.x - p2.x;
                    const dy = p.y - p2.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < config.maxDistance) {
                        const opacity = (1 - dist / config.maxDistance) * 0.5;
                        ctx.strokeStyle = `rgba(232, 33, 39, ${opacity * 0.3})`;
                        ctx.lineWidth = 0.6;
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                }
            }

            requestAnimationFrame(draw);
        }

        window.addEventListener('resize', resize, { passive: true });
        resize();
        draw();
    }

    /* ===========================================
       Waveform (Music / Audio Visual)
       =========================================== */

    function initWaveform(canvasId) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let width, height, dpr;

        function resize() {
            const rect = canvas.parentElement.getBoundingClientRect();
            width = rect.width;
            height = rect.height;
            dpr = Math.min(window.devicePixelRatio || 1, 2);
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            canvas.style.width = width + 'px';
            canvas.style.height = height + 'px';
            ctx.scale(dpr, dpr);
        }

        let phase = 0;
        function draw() {
            ctx.clearRect(0, 0, width, height);
            const cx = width / 2;
            const cy = height / 2;
            const bars = 80;
            const radius = Math.min(width, height) * 0.28;

            for (let i = 0; i < bars; i++) {
                const angle = (i / bars) * Math.PI * 2;
                const wave = Math.sin(phase + i * 0.2) * 0.5 + Math.sin(phase * 1.5 + i * 0.1) * 0.3 + 0.5;
                const barLen = 20 + wave * 60;

                const x1 = cx + Math.cos(angle) * radius;
                const y1 = cy + Math.sin(angle) * radius;
                const x2 = cx + Math.cos(angle) * (radius + barLen);
                const y2 = cy + Math.sin(angle) * (radius + barLen);

                const opacity = 0.3 + wave * 0.7;
                const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
                gradient.addColorStop(0, `rgba(232, 33, 39, 0)`);
                gradient.addColorStop(0.5, `rgba(232, 33, 39, ${opacity})`);
                gradient.addColorStop(1, `rgba(232, 33, 39, ${opacity})`);

                ctx.strokeStyle = gradient;
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.stroke();
            }

            phase += 0.04;
            requestAnimationFrame(draw);
        }

        window.addEventListener('resize', resize, { passive: true });
        resize();
        draw();
    }

    /* ===========================================
       Orbit Nodes (Privacy / Security Visual)
       =========================================== */

    function initOrbitNodes(canvasId) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let width, height, dpr;
        const nodes = [];
        const numNodes = 24;

        function resize() {
            const rect = canvas.parentElement.getBoundingClientRect();
            width = rect.width;
            height = rect.height;
            dpr = Math.min(window.devicePixelRatio || 1, 2);
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            canvas.style.width = width + 'px';
            canvas.style.height = height + 'px';
            ctx.scale(dpr, dpr);

            nodes.length = 0;
            for (let i = 0; i < numNodes; i++) {
                nodes.push({
                    angle: (i / numNodes) * Math.PI * 2,
                    radius: 60 + (i % 3) * 50,
                    speed: 0.002 + Math.random() * 0.003,
                    size: 2 + Math.random() * 3,
                    direction: i % 2 === 0 ? 1 : -1
                });
            }
        }

        function draw() {
            ctx.clearRect(0, 0, width, height);
            const cx = width / 2;
            const cy = height / 2;
            const maxRadius = Math.min(width, height) * 0.4;

            // Draw orbital rings
            for (let r = 0; r < 3; r++) {
                const ringR = 60 + r * 50;
                if (ringR > maxRadius) continue;
                ctx.strokeStyle = `rgba(255, 255, 255, ${0.04 - r * 0.01})`;
                ctx.lineWidth = 1;
                ctx.setLineDash([2, 4]);
                ctx.beginPath();
                ctx.arc(cx, cy, ringR, 0, Math.PI * 2);
                ctx.stroke();
            }
            ctx.setLineDash([]);

            // Draw connecting lines between nearby nodes
            for (let i = 0; i < nodes.length; i++) {
                const n1 = nodes[i];
                const r1 = Math.min(n1.radius, maxRadius);
                const x1 = cx + Math.cos(n1.angle) * r1;
                const y1 = cy + Math.sin(n1.angle) * r1;

                for (let j = i + 1; j < nodes.length; j++) {
                    const n2 = nodes[j];
                    const r2 = Math.min(n2.radius, maxRadius);
                    const x2 = cx + Math.cos(n2.angle) * r2;
                    const y2 = cy + Math.sin(n2.angle) * r2;
                    const dx = x1 - x2;
                    const dy = y1 - y2;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 110) {
                        const op = (1 - dist / 110) * 0.3;
                        ctx.strokeStyle = `rgba(232, 33, 39, ${op})`;
                        ctx.lineWidth = 0.5;
                        ctx.beginPath();
                        ctx.moveTo(x1, y1);
                        ctx.lineTo(x2, y2);
                        ctx.stroke();
                    }
                }
            }

            // Draw nodes
            nodes.forEach((n, i) => {
                n.angle += n.speed * n.direction;
                const r = Math.min(n.radius, maxRadius);
                const x = cx + Math.cos(n.angle) * r;
                const y = cy + Math.sin(n.angle) * r;

                ctx.fillStyle = i % 5 === 0 ? '#e82127' : 'rgba(255,255,255,0.7)';
                ctx.shadowBlur = i % 5 === 0 ? 12 : 0;
                ctx.shadowColor = '#e82127';
                ctx.beginPath();
                ctx.arc(x, y, n.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.shadowBlur = 0;

                // Inner core
                if (i % 4 === 0) {
                    ctx.fillStyle = '#e82127';
                    ctx.beginPath();
                    ctx.arc(x, y, n.size * 0.4, 0, Math.PI * 2);
                    ctx.fill();
                }
            });

            // Center shield icon
            ctx.fillStyle = 'rgba(232, 33, 39, 0.15)';
            ctx.beginPath();
            ctx.arc(cx, cy, 32, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#e82127';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.arc(cx, cy, 32, 0, Math.PI * 2);
            ctx.stroke();

            requestAnimationFrame(draw);
        }

        window.addEventListener('resize', resize, { passive: true });
        resize();
        draw();
    }

    /* ===========================================
       Code Matrix (Binary Rain)
       =========================================== */

    function initCodeMatrix(canvasId) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let width, height, dpr;
        const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
        const fontSize = 14;
        let columns = 0;
        let drops = [];

        function resize() {
            const rect = canvas.parentElement.getBoundingClientRect();
            width = rect.width;
            height = rect.height;
            dpr = Math.min(window.devicePixelRatio || 1, 2);
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            canvas.style.width = width + 'px';
            canvas.style.height = height + 'px';
            ctx.scale(dpr, dpr);
            columns = Math.floor(width / fontSize);
            drops = [];
            for (let i = 0; i < columns; i++) {
                drops[i] = Math.random() * height / fontSize;
            }
        }

        function draw() {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.06)';
            ctx.fillRect(0, 0, width, height);

            ctx.fillStyle = '#e82127';
            ctx.font = `${fontSize}px monospace`;

            for (let i = 0; i < drops.length; i++) {
                const text = chars.charAt(Math.floor(Math.random() * chars.length));
                ctx.fillStyle = `rgba(232, 33, 39, ${0.3 + Math.random() * 0.7})`;
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);

                if (drops[i] * fontSize > height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }

            requestAnimationFrame(draw);
        }

        window.addEventListener('resize', resize, { passive: true });
        resize();
        draw();
    }

    /* ===========================================
       Initialize all canvases when DOM ready
       =========================================== */

    document.addEventListener('DOMContentLoaded', () => {
        initParticleNetwork('hero-canvas');
        initWaveform('waveform-canvas');
        initOrbitNodes('orbit-canvas');
        initCodeMatrix('matrix-canvas');
    });

})();