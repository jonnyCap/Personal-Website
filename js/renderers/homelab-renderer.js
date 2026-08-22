/**
 * homelab-renderer.js
 * Renders the n8n-style interactive K3s Cluster Topology Graph
 * with dynamic SVG bezier cables, flying animated light particles,
 * direct dashboard links, and the 1-row-per-app showcase.
 */

(function () {
    'use strict';

    /** SVG Icon definitions */
    const ICONS = {
        shield: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>`,
        server: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect><rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect><line x1="6" y1="6" x2="6.01" y2="6"></line><line x1="6" y1="18" x2="6.01" y2="18"></line></svg>`,
        git: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="18" r="3"></circle><circle cx="6" cy="6" r="3"></circle><path d="M13 6h3a2 2 0 0 1 2 2v7"></path><line x1="6" y1="9" x2="6" y2="21"></line></svg>`,
        package: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"></line><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>`,
        github: `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>`,
        activity: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>`,
        database: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>`,
        layers: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>`,
        externalLink: `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>`,
        check: `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`,
        lock: `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>`,
        flow: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="6" r="3"></circle><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="12" r="3"></circle><line x1="8.59" y1="7.41" x2="15.42" y2="10.59"></line><line x1="8.59" y1="16.59" x2="15.42" y2="13.41"></line></svg>`
    };

    /** @type {any | null} */
    let homelabData = null;
    let selectedNodeId = "k3s-core";
    let isDrawingWires = false;

    async function loadHomelabData() {
        const root = document.getElementById("homelabSection");
        if (!root) return;

        try {
            const res = await fetch("data/homelab.json");
            if (!res.ok) {
                throw new Error(`HTTP ${res.status}: ${res.statusText}`);
            }
            const data = await res.json();
            if (data && data.cluster && Array.isArray(data.infrastructure) && Array.isArray(data.applications)) {
                homelabData = data;
                renderHomelabSection();
            } else {
                throw new Error("Malformed homelab data format");
            }
        } catch (err) {
            console.error("Error loading homelab data:", err);
            renderErrorState("Could not load homelab data.");
        }
    }

    function renderErrorState(msg) {
        const root = document.getElementById("homelabSection");
        if (!root) return;
        root.innerHTML = `
            <div class="homelabContainer">
                <div class="homelabErrorState">
                    <p>${escapeHtml(msg)}</p>
                </div>
            </div>
        `;
    }

    function renderHomelabSection() {
        const homelabRoot = document.getElementById("homelabSection");
        const appsRoot = document.getElementById("deployedAppsSection");
        if (!homelabRoot || !homelabData) return;

        const cluster = homelabData.cluster;
        const appList = homelabData.applications;

        // Render Blue Homelab Topology Section
        homelabRoot.innerHTML = `
            <div class="homelabContainer">
                <!-- Section Header -->
                <div class="homelabHeaderContainer">
                    <h2 class="homelabHeader">Raspberry Pi Homelab</h2>
                    <p class="homelabSubheader">
                        A self-hosted bare-metal Raspberry Pi 5 setup running a lightweight K3s cluster. I use it to deploy and operate my personal projects with GitOps continuous delivery, Cloudflare Zero-Trust ingress, distributed storage, and shared databases.
                    </p>
                </div>

                <!-- Cluster Telemetry Bar -->
                <div class="clusterTelemetryBar">
                    <div class="telemetryStat">
                        <span class="telemetryLabel">HARDWARE</span>
                        <span class="telemetryValue">${escapeHtml(cluster.hardware)}</span>
                    </div>
                    <div class="telemetryStat">
                        <span class="telemetryLabel">ORCHESTRATION</span>
                        <span class="telemetryValue">${escapeHtml(cluster.orchestrator)}</span>
                    </div>
                    <div class="telemetryStat">
                        <span class="telemetryLabel">INGRESS / ROUTING</span>
                        <span class="telemetryValue">${escapeHtml(cluster.ingress)}</span>
                    </div>
                    <div class="telemetryStat">
                        <span class="telemetryLabel">GITOPS, DATA &amp; STORAGE</span>
                        <span class="telemetryValue">${escapeHtml(cluster.gitops)}, Postgres &amp; MinIO</span>
                    </div>
                </div>

                <!-- N8N-STYLE INTERACTIVE WORKFLOW GRAPH CANVAS (3D ISOMETRIC PERSPECTIVE & EXPANDED) -->
                <div class="flowSectionWrapper">
                    <div class="flowGraphHeader">
                        <div class="flowGraphTitleGroup">
                            <span class="flowIcon">${ICONS.flow}</span>
                            <h3 class="flowGraphTitle">Interactive 3D Topology Graph</h3>
                            <span class="flowLiveIndicator">
                                <span class="homelabLivePulse"></span>
                                Live Data Streams
                            </span>
                        </div>
                        <span class="flowGraphHint">Hover or move cursor over graph for 3D parallax &bull; Click nodes to inspect &amp; open dashboards</span>
                    </div>

                    <!-- 3D Perspective Stage -->
                    <div class="flowPerspectiveStage" id="flowPerspectiveStage">
                        <!-- Visual 3D Node Canvas -->
                        <div class="flowCanvasWrapper" id="flowCanvasWrapper">
                            <!-- SVG Bezier Connection Cables Overlay -->
                            <svg class="flowGraphSvg" id="flowGraphSvg" aria-hidden="true"></svg>

                            <!-- Topology Flow Grid -->
                            <div class="flowGrid" id="flowGrid">
                                <!-- Left Tier: Ingress & GitOps Pipeline -->
                                <div class="flowCol flowColIngress">
                                    <div class="flowColTitle">INGRESS &amp; CI/CD</div>
                                    ${renderFlowNode('cloudflare')}
                                    ${renderFlowNode('ghcr')}
                                    ${renderFlowNode('argocd')}
                                </div>

                                <!-- Center Tier: Cluster Core Hub -->
                                <div class="flowCol flowColCore">
                                    <div class="flowColTitle">K3S CORE HUB</div>
                                    ${renderFlowNode('k3s-core', true)}
                                    ${renderFlowNode('headlamp')}
                                </div>

                                <!-- Right Tier 1: Live Applications -->
                                <div class="flowCol flowColApps">
                                    <div class="flowColTitle">MICROSERVICES</div>
                                    ${renderFlowNode('snapdeck')}
                                    ${renderFlowNode('opscout')}
                                    ${renderFlowNode('pagi')}
                                </div>

                                <!-- Right Tier 2: Storage & Database Tier -->
                                <div class="flowCol flowColData">
                                    <div class="flowColTitle">DATA &amp; STORAGE</div>
                                    ${renderFlowNode('postgres')}
                                    ${renderFlowNode('minio')}
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Active Node Telemetry & Dashboard Inspector (Light Mode Theme) -->
                    <div class="flowInspectorContainer" id="flowInspector">
                        ${renderInspectorContent(getSelectedNode())}
                    </div>
                </div>
            </div>
        `;

        // Render White Deployed Applications Section with Open-Sided Creative Rows
        if (appsRoot) {
            appsRoot.innerHTML = `
                <div class="deployedAppsContainer">
                    <!-- Deployed Applications Section Header -->
                    <div class="appsSectionHeaderContainer">
                        <div class="appsHeaderLeft">
                            <span class="appsSubBadge">[ LIVE WORKLOADS ]</span>
                            <h3 class="appsSectionTitle">Deployed Services &amp; Applications</h3>
                        </div>
                        <div class="appsHeaderRight">
                            <span class="appsDomainLabel">Base Domain: <strong>*.${escapeHtml(cluster.domain)}</strong></span>
                        </div>
                    </div>

                    <!-- Open-Sided Creative Stream List -->
                    <div class="appsOpenStreamContainer" id="appsOpenStream">
                        ${appList.map((app, index) => renderAppRowCard(app, index)).join("")}
                    </div>
                </div>
            `;
        }

        // Render wires after DOM layout stabilizes
        setTimeout(drawFlowWires, 50);
        setTimeout(drawFlowWires, 250);

        attachInteractiveListeners();
        initScrollAnimations();
    }

    function getNodeData(id) {
        if (!homelabData) return null;
        const allNodes = [...(homelabData.infrastructure || []), ...(homelabData.applications || [])];
        return allNodes.find(n => n.id === id) || null;
    }

    function getSelectedNode() {
        return getNodeData(selectedNodeId) || (homelabData?.infrastructure?.[0] ?? null);
    }

    function renderFlowNode(id, isMaster = false) {
        const node = getNodeData(id);
        if (!node) return '';

        const isApp = Boolean(node.subdomain);
        const hasLogo = Boolean(node.logoImage);
        const isSelected = selectedNodeId === id;

        return `
            <div class="flowNode ${isMaster ? 'centralHub' : ''} ${isSelected ? 'activeNode' : ''}" 
                 id="node-${escapeHtml(node.id)}" 
                 data-node-id="${escapeHtml(node.id)}"
                 tabindex="0"
                 role="button"
                 aria-label="Inspect ${escapeHtml(node.name)}">
                
                <!-- Left Input Port Pin -->
                ${id !== 'cloudflare' && id !== 'ghcr' ? `
                    <div class="flowPin flowPinIn" data-pin-id="${escapeHtml(node.id)}-in"></div>
                ` : ''}

                <div class="flowNodeContent">
                    <div class="flowNodeHeader">
                        <div class="flowNodeIconWrapper ${hasLogo ? 'hasCustomLogo' : ''}">
                            ${hasLogo ? `
                                <img class="flowNodeLogoImg" src="${escapeHtml(node.logoImage)}" alt="${escapeHtml(node.name)} logo" onerror="this.style.display='none'; if(this.nextElementSibling) this.nextElementSibling.style.display='block';">
                                <span class="flowNodeLogoText" style="display:none;">${escapeHtml(node.logoText || node.name.slice(0, 2).toUpperCase())}</span>
                            ` : `
                                <span>${node.icon ? (ICONS[node.icon] || ICONS.server) : ICONS.server}</span>
                            `}
                        </div>
                        <div class="flowNodeMeta">
                            <span class="flowNodeName">${escapeHtml(node.name)}</span>
                            <span class="flowNodeCategory">${escapeHtml(node.category)}</span>
                        </div>
                    </div>

                    <div class="flowNodeFooter">
                        <span class="flowNodeBadge">${escapeHtml(node.badge || node.status || 'Active')}</span>
                        <span class="flowNodeLiveDot"></span>
                    </div>
                </div>

                <!-- Right Output Port Pin -->
                ${id !== 'postgres' && id !== 'minio' && id !== 'headlamp' ? `
                    <div class="flowPin flowPinOut" data-pin-id="${escapeHtml(node.id)}-out"></div>
                ` : ''}
            </div>
        `;
    }

    function renderInspectorContent(node) {
        if (!node) return '';
        const isApp = Boolean(node.subdomain);
        const iconSvg = node.logoImage ? `
            <img class="inspectorLogoImg" src="${escapeHtml(node.logoImage)}" alt="${escapeHtml(node.name)} logo">
        ` : (ICONS[node.icon] || ICONS.server);

        const dashboardUrl = node.dashboardUrl || node.url || null;
        const requiresAuth = node.requiresAuth || false;

        return `
            <div class="inspectorHeader">
                <div class="inspectorLeft">
                    <div class="inspectorIconWrapper">${iconSvg}</div>
                    <div>
                        <div class="inspectorTitleGroup">
                            <h4 class="inspectorTitle">${escapeHtml(node.name)}</h4>
                            <span class="inspectorCategoryBadge">${escapeHtml(node.category)}</span>
                        </div>
                        <div class="inspectorSub">${escapeHtml(node.badge || node.status || 'Connected')} &bull; ${escapeHtml(node.subdomain || node.role || 'Cluster Node')}</div>
                    </div>
                </div>
                <div class="inspectorRightActions">
                    ${requiresAuth ? `
                        <span class="inspectorAuthBadge">
                            ${ICONS.lock}
                            Auth Protected
                        </span>
                    ` : ''}
                    ${dashboardUrl ? `
                        <a href="${escapeHtml(dashboardUrl)}" target="_blank" rel="noopener noreferrer" class="button-53 inspectorLaunchBtn">
                            <span>${isApp ? 'Open Application' : 'Open Dashboard'}</span>
                            ${ICONS.externalLink}
                        </a>
                    ` : ''}
                </div>
            </div>
            
            <p class="inspectorDesc">${escapeHtml(node.description)}</p>
        `;
    }

    function getPinOffsetCenter(pinEl, canvasEl) {
        let x = 0;
        let y = 0;
        /** @type {HTMLElement | null} */
        let curr = pinEl;
        while (curr && curr !== canvasEl && curr !== document.body) {
            x += curr.offsetLeft;
            y += curr.offsetTop;
            curr = /** @type {HTMLElement | null} */ (curr.offsetParent);
        }
        x += pinEl.offsetWidth / 2;
        y += pinEl.offsetHeight / 2;
        return { x, y };
    }

    function drawFlowWires() {
        if (isDrawingWires) return;
        isDrawingWires = true;

        const svg = document.getElementById("flowGraphSvg");
        const canvas = document.getElementById("flowCanvasWrapper");
        if (!svg || !canvas || !homelabData || !homelabData.topologyConnections) {
            isDrawingWires = false;
            return;
        }

        const canvasWidth = canvas.offsetWidth;
        const canvasHeight = canvas.offsetHeight;
        if (canvasWidth === 0 || canvasHeight === 0) {
            isDrawingWires = false;
            return;
        }

        svg.setAttribute("width", String(canvasWidth));
        svg.setAttribute("height", String(canvasHeight));
        svg.setAttribute("viewBox", `0 0 ${canvasWidth} ${canvasHeight}`);

        const connections = homelabData.topologyConnections;
        let pathsHtml = '';

        connections.forEach((conn, index) => {
            const outPin = document.querySelector(`[data-pin-id="${conn.from}-out"]`);
            const inPin = document.querySelector(`[data-pin-id="${conn.to}-in"]`);

            if (outPin instanceof HTMLElement && inPin instanceof HTMLElement) {
                const p1 = getPinOffsetCenter(outPin, canvas);
                const p2 = getPinOffsetCenter(inPin, canvas);

                const dx = Math.max(40, Math.abs(p2.x - p1.x) * 0.45);
                const pathD = `M ${p1.x.toFixed(1)} ${p1.y.toFixed(1)} C ${(p1.x + dx).toFixed(1)} ${p1.y.toFixed(1)}, ${(p2.x - dx).toFixed(1)} ${p2.y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;

                const isConnectedToSelected = (conn.from === selectedNodeId || conn.to === selectedNodeId);
                const wireColor = conn.color || '#549bcf';

                pathsHtml += `
                    <!-- Base Wire -->
                    <path class="flowWireBase ${isConnectedToSelected ? 'wireActive' : ''}" 
                          data-from="${conn.from}" 
                          data-to="${conn.to}"
                          d="${pathD}" 
                          stroke="${wireColor}" />

                    <!-- Animated Light Stream Pulse -->
                    <path class="flowWireStream ${isConnectedToSelected ? 'wireActive' : ''}" 
                          data-from="${conn.from}" 
                          data-to="${conn.to}"
                          d="${pathD}" 
                          stroke="${wireColor}"
                          style="animation-delay: -${(index * 0.4).toFixed(2)}s;" />
                `;
            }
        });

        svg.innerHTML = pathsHtml;
        isDrawingWires = false;
    }

    function renderAppRowCard(app, index) {
        const hasLogo = Boolean(app.logoImage);

        return `
            <div class="appOpenRow" data-app-id="${escapeHtml(app.id)}">
                <!-- App Identity Column -->
                <div class="appOpenColIdentity">
                    <div class="appOpenLogoWrapper" style="background: ${app.logoBg || '#ffffff'};">
                        ${hasLogo ? `
                            <img class="appOpenLogoImg" src="${escapeHtml(app.logoImage)}" alt="${escapeHtml(app.name)} Logo" onerror="this.style.display='none'; if(this.nextElementSibling) this.nextElementSibling.style.display='block';">
                            <span class="appOpenLogoText" style="display:none;">${escapeHtml(app.logoText || app.name.slice(0, 2).toUpperCase())}</span>
                        ` : `
                            <span class="appOpenLogoText">${escapeHtml(app.logoText || app.name.slice(0, 2).toUpperCase())}</span>
                        `}
                    </div>
                    <div class="appOpenIdentityMeta">
                        <div class="appOpenLiveStatus">
                            <span class="appOpenLiveDot"></span>
                            <span class="appOpenLiveText">${escapeHtml(app.status || 'Live')}</span>
                        </div>
                        <h4 class="appOpenName">${escapeHtml(app.name)}</h4>
                        <span class="appOpenCategory">${escapeHtml(app.category)}</span>
                        <a href="${escapeHtml(app.url)}" target="_blank" rel="noopener noreferrer" class="appOpenSubdomainLink" aria-label="Visit ${escapeHtml(app.subdomain)}">
                            <span>${escapeHtml(app.subdomain)}</span>
                            ${ICONS.externalLink}
                        </a>
                    </div>
                </div>

                <!-- App Details Column -->
                <div class="appOpenColDetails">
                    <p class="appOpenDescription">${escapeHtml(app.description)}</p>
                </div>

                <!-- App Action Column -->
                <div class="appOpenColAction">
                    <div class="appOpenPodMetaBox">
                        <div class="appOpenPodMetaRow">
                            <span class="metaRowLabel">ROLE:</span>
                            <span class="metaRowVal">${escapeHtml(app.role || 'Microservice')}</span>
                        </div>
                        <div class="appOpenPodMetaRow">
                            <span class="metaRowLabel">INGRESS:</span>
                            <span class="metaRowVal">TLS Tunnel</span>
                        </div>
                    </div>
                    <a href="${escapeHtml(app.url)}" target="_blank" rel="noopener noreferrer" class="button-53 appOpenLaunchButton" aria-label="Launch ${escapeHtml(app.name)}">
                        <span>Launch App</span>
                        ${ICONS.externalLink}
                    </a>
                </div>
            </div>
        `;
    }

    function attachInteractiveListeners() {
        const grid = document.getElementById("flowGrid");
        const inspector = document.getElementById("flowInspector");

        if (grid && inspector) {
            // Node Click handler
            grid.addEventListener("click", (e) => {
                if (!(e.target instanceof Element)) return;
                const nodeEl = e.target.closest(".flowNode");
                if (nodeEl instanceof HTMLElement && nodeEl.dataset.nodeId) {
                    selectNode(nodeEl.dataset.nodeId);
                }
            });

            // Node Hover / Focus highlights
            grid.addEventListener("mouseover", (e) => {
                if (!(e.target instanceof Element)) return;
                const nodeEl = e.target.closest(".flowNode");
                if (nodeEl instanceof HTMLElement && nodeEl.dataset.nodeId) {
                    highlightNodeWires(nodeEl.dataset.nodeId);
                }
            });

            grid.addEventListener("mouseleave", () => {
                highlightNodeWires(selectedNodeId);
            });
        }

        init3DParallax();

        // Window resize observer to update SVG wires accurately
        let resizeTimeout;
        window.addEventListener("resize", () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(drawFlowWires, 80);
        });
    }

    function init3DParallax() {
        const stage = document.getElementById("flowPerspectiveStage");
        const canvas = document.getElementById("flowCanvasWrapper");
        if (!stage || !canvas) return;

        if (window.matchMedia("(pointer: fine) and (min-width: 1151px)").matches) {
            let isHovered = false;

            stage.addEventListener("mouseenter", () => {
                isHovered = true;
                canvas.style.transition = "transform 0.15s ease-out";
            });

            stage.addEventListener("mousemove", (e) => {
                if (!isHovered) return;
                const rect = stage.getBoundingClientRect();
                const relX = (e.clientX - rect.left) / rect.width;
                const relY = (e.clientY - rect.top) / rect.height;

                // Base tilt: topleft in back, right in front (rotateX positive, rotateY negative)
                const rotX = 7 + (0.5 - relY) * 8;
                const rotY = -7 + (relX - 0.5) * 10;
                const rotZ = 0.8 + (relX - 0.5) * 1.5;

                canvas.style.transform = `rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) rotateZ(${rotZ.toFixed(2)}deg)`;
            });

            stage.addEventListener("mouseleave", () => {
                isHovered = false;
                canvas.style.transition = "transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)";
                canvas.style.transform = `rotateX(7deg) rotateY(-7deg) rotateZ(0.8deg)`;
            });
        } else {
            canvas.style.transform = "";
        }
    }

    function selectNode(nodeId) {
        selectedNodeId = nodeId;
        const grid = document.getElementById("flowGrid");
        const inspector = document.getElementById("flowInspector");

        if (grid) {
            grid.querySelectorAll(".flowNode").forEach(n => n.classList.remove("activeNode"));
            const activeNodeEl = document.getElementById(`node-${nodeId}`);
            if (activeNodeEl) activeNodeEl.classList.add("activeNode");
        }

        highlightNodeWires(nodeId);

        if (inspector) {
            inspector.style.opacity = "0.35";
            setTimeout(() => {
                inspector.innerHTML = renderInspectorContent(getSelectedNode());
                inspector.style.opacity = "1";
            }, 100);
        }
    }

    function highlightNodeWires(nodeId) {
        const svg = document.getElementById("flowGraphSvg");
        if (!svg) return;

        svg.querySelectorAll(".flowWireBase, .flowWireStream").forEach(wire => {
            const from = wire.getAttribute("data-from");
            const to = wire.getAttribute("data-to");
            if (from === nodeId || to === nodeId) {
                wire.classList.add("wireActive");
                wire.classList.remove("wireDimmed");
            } else {
                wire.classList.remove("wireActive");
                wire.classList.add("wireDimmed");
            }
        });
    }

    function initScrollAnimations() {
        const rowElements = document.querySelectorAll(".appOpenRow, .appRowCard");
        if (!("IntersectionObserver" in window)) {
            rowElements.forEach(el => el.classList.add("revealed"));
            return;
        }

        const appObserver = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && entry.target instanceof HTMLElement) {
                    entry.target.classList.add("revealed");
                    obs.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: "0px 0px -40px 0px"
        });

        rowElements.forEach((card, i) => {
            if (card instanceof HTMLElement) {
                card.style.transitionDelay = `${(i * 0.12).toFixed(2)}s`;
                appObserver.observe(card);
            }
        });
    }

    function escapeHtml(str) {
        if (!str) return "";
        return String(str)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    // Auto-init on DOMContentLoaded or immediately if already loaded
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", loadHomelabData);
    } else {
        loadHomelabData();
    }
})();
