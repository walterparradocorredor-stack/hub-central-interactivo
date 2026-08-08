// ==========================================
// J&M RESPONSIVELAB - DISPOSITIVOS & LOGICA
// ==========================================

const DEVICES = [
    { id: "iphone-15-pro", name: "iPhone 15 Pro", width: 393, height: 852, type: "mobile", icon: "smartphone", defaultActive: true },
    { id: "samsung-s23", name: "Samsung Galaxy S23", width: 360, height: 780, type: "mobile", icon: "smartphone", defaultActive: true },
    { id: "ipad-air", name: "iPad Air (10.9\")", width: 820, height: 1180, type: "tablet", icon: "tablet", defaultActive: true },
    { id: "apple-watch-ultra", name: "Apple Watch Ultra (49mm)", width: 205, height: 251, type: "watch", icon: "watch", defaultActive: false },
    { id: "pos-handheld", name: "Terminal POS 5.5\"", width: 360, height: 640, type: "mobile", icon: "badge-percent", defaultActive: false },
    { id: "pos-desktop", name: "Pantalla POS 10.1\"", width: 800, height: 1280, type: "tablet", icon: "monitor-smartphone", defaultActive: false },
    { id: "laptop-14", name: "Laptop Estándar (14\")", width: 1366, height: 768, type: "desktop", icon: "laptop", defaultActive: false, defaultLandscape: true }
];

const THEMES = {
    indigo: { primary: "#6366f1", secondary: "#06b6d4", gradient: "linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)", focus: "rgba(99, 102, 241, 0.5)" },
    emerald: { primary: "#25D366", secondary: "#128C7E", gradient: "linear-gradient(135deg, #25D366 0%, #128C7E 100%)", focus: "rgba(37, 211, 102, 0.5)" },
    cyberpunk: { primary: "#ec4899", secondary: "#8b5cf6", gradient: "linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)", focus: "rgba(236, 72, 153, 0.5)" },
    amber: { primary: "#f59e0b", secondary: "#ef4444", gradient: "linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)", focus: "rgba(245, 158, 11, 0.5)" },
    neon: { primary: "#06b6d4", secondary: "#3b82f6", gradient: "linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)", focus: "rgba(6, 182, 212, 0.5)" }
};

let state = {
    url: "http://localhost:3000",
    zoom: 75,
    globalOrientation: "portrait",
    activeDevices: DEVICES.filter(d => d.defaultActive).map(d => d.id),
    layoutMode: "grid",
    singleDeviceSelected: "iphone-15-pro",
    deviceOrientations: {},
    currentTheme: "indigo"
};

DEVICES.forEach(d => {
    state.deviceOrientations[d.id] = d.defaultLandscape ? "landscape" : "portrait";
});

// Elementos del DOM
const urlInput = document.getElementById("url-input");
const btnGo = document.getElementById("btn-go");
const btnRefresh = document.getElementById("btn-refresh");
const btnPortrait = document.getElementById("btn-portrait");
const btnLandscape = document.getElementById("btn-landscape");
const zoomRange = document.getElementById("zoom-range");
const zoomValue = document.getElementById("zoom-value");
const viewGrid = document.getElementById("view-grid");
const viewSingle = document.getElementById("view-single");
const singleDeviceSelect = document.getElementById("single-device-select");
const deviceCheckboxList = document.getElementById("device-checkbox-list");
const devicesContainer = document.getElementById("devices-container");
const currentUrlDisplay = document.getElementById("current-url-display");
const btnOpenExternal = document.getElementById("btn-open-external");
const btnStartTour = document.getElementById("btn-start-tour");
const btnThemeToggle = document.getElementById("btn-theme-toggle");

const deviceModal = document.getElementById("device-modal");
const btnAddCustomDevice = document.getElementById("btn-add-custom-device");
const btnCloseDeviceModal = document.getElementById("btn-close-device-modal");
const btnCancelDevice = document.getElementById("btn-cancel-device");
const btnSaveDevice = document.getElementById("btn-save-device");
const customDeviceName = document.getElementById("custom-device-name");
const customDeviceWidth = document.getElementById("custom-device-width");
const customDeviceHeight = document.getElementById("custom-device-height");
const customDeviceType = document.getElementById("custom-device-type");

const corsGuideModal = document.getElementById("cors-guide-modal");
const btnOpenCorsGuide = document.getElementById("btn-open-cors-guide");
const btnCloseCorsModal = document.getElementById("btn-close-cors-modal");
const btnCloseCorsGuide = document.getElementById("btn-close-cors-guide");

const btnXray = document.getElementById("btn-xray");
const btnKeyboard = document.getElementById("btn-keyboard");
const btnTouchCursor = document.getElementById("btn-touch-cursor");
const selectDaltonism = document.getElementById("select-daltonism");

const tourOverlay = document.getElementById("tour-overlay");
const tourCard = document.getElementById("tour-card");
const tourTitle = document.getElementById("tour-title");
const tourDesc = document.getElementById("tour-desc");
const tourPrevBtn = document.getElementById("tour-prev");
const tourNextBtn = document.getElementById("tour-next");
const tourSkipBtn = document.getElementById("tour-skip");
const tourStepDots = document.querySelectorAll(".tour-step-dot");

let currentTourStep = 0;
const tourSteps = [
    {
        title: "¡Te damos la bienvenida a ResponsiveLab!",
        desc: "Esta herramienta interactiva te permite previsualizar y diagnosticar la responsividad de tus sitios web en múltiples dispositivos simultáneamente en tiempo real.",
        elementId: null,
        position: "center"
    },
    {
        title: "Ingresa la dirección de tu proyecto",
        desc: "Ingresa cualquier dirección web aquí (por ejemplo, tu servidor de desarrollo local `http://localhost:3000` o un puerto de Live Server) y haz clic en la flecha para cargarla en todos los iframes.",
        elementId: "step-url-section",
        position: "right"
    },
    {
        title: "Escala e inclinación",
        desc: "Usa el control deslizante para alejar o acercar el área de trabajo y haz clic en los botones para alternar la orientación horizontal/vertical global.",
        elementId: "step-workspace-settings",
        position: "right"
    },
    {
        title: "Diseño Cuadrícula o Individual",
        desc: "Elige ver todos los dispositivos a la vez en una cuadrícula ('Grid') o concéntrate en un dispositivo específico seleccionándolo en el menú desplegable.",
        elementId: "step-layout-toggle",
        position: "right"
    },
    {
        title: "Personaliza tu tema de colores",
        desc: "Elige entre 5 temas de color glassmorphic integrados (Índigo, WhatsApp, Cyberpunk, Ámbar o Azul Neón) para adaptar el simulador a tu gusto.",
        elementId: "step-theme-picker",
        position: "right"
    },
    {
        title: "Dispositivos Activos",
        desc: "Elige qué dispositivos quieres ver en pantalla marcando o desmarcando las casillas. ¡Hemos incluido Apple Watch Ultra y Laptop estándar para pruebas exhaustivas!",
        elementId: "step-device-selector",
        position: "right"
    },
    {
        title: "Sugerencias y Soporte Directo",
        desc: "Tu opinión nos ayuda a mejorar. Si deseas sugerir nuevos dispositivos, plantear mejoras o solicitar un proyecto a medida, puedes escribirnos directamente a nuestro WhatsApp (+57 304 578 8873).",
        elementId: "step-privacy-badge",
        position: "bottom"
    }
];

function init() {
    const savedCustomDevices = JSON.parse(localStorage.getItem("responsive-lab-custom-devices") || "[]");
    savedCustomDevices.forEach(d => {
        if (!DEVICES.some(dev => dev.id === d.id)) {
            DEVICES.push(d);
        }
    });

    state.url = localStorage.getItem("responsive-lab-url") || urlInput.value.trim() || "http://localhost:3000";
    urlInput.value = state.url;
    currentUrlDisplay.textContent = state.url;

    const savedZoom = localStorage.getItem("responsive-lab-zoom");
    if (savedZoom) {
        state.zoom = parseInt(savedZoom);
        zoomRange.value = state.zoom;
    }

    const savedActive = localStorage.getItem("responsive-lab-active-devices");
    if (savedActive) {
        state.activeDevices = JSON.parse(savedActive);
    }

    const savedLayout = localStorage.getItem("responsive-lab-layout-mode");
    if (savedLayout) {
        state.layoutMode = savedLayout;
        if (state.layoutMode === "grid") {
            viewGrid.classList.add("active");
            viewSingle.classList.remove("active");
            singleDeviceSelect.classList.add("hidden");
        } else {
            viewSingle.classList.add("active");
            viewGrid.classList.remove("active");
            singleDeviceSelect.classList.remove("hidden");
        }
    }

    renderDeviceCheckboxes();
    populateSingleDeviceSelect();
    renderWorkspace();
    setupEventListeners();

    const savedTheme = localStorage.getItem("responsive-lab-theme") || "indigo";
    setAccentTheme(savedTheme);

    lucide.createIcons();

    if (!localStorage.getItem("responsive-lab-tour-completed")) {
        setTimeout(startTour, 1000);
    }

    const isLightMode = localStorage.getItem("responsive-lab-light-mode") === "true";
    if (isLightMode) {
        document.body.classList.add("light-theme");
        updateThemeToggleIcon(true);
    } else {
        updateThemeToggleIcon(false);
    }
}

function setAccentTheme(themeName) {
    if (!THEMES[themeName]) return;
    state.currentTheme = themeName;
    const theme = THEMES[themeName];
    
    document.documentElement.style.setProperty('--accent-primary', theme.primary);
    document.documentElement.style.setProperty('--accent-secondary', theme.secondary);
    document.documentElement.style.setProperty('--accent-gradient', theme.gradient);
    document.documentElement.style.setProperty('--border-focus', theme.focus);
    
    localStorage.setItem("responsive-lab-theme", themeName);
    
    document.querySelectorAll(".theme-btn").forEach(btn => {
        if (btn.getAttribute("data-theme") === themeName) {
            btn.classList.add("active");
        } else {
            btn.classList.remove("active");
        }
    });

    const logoAccent = document.querySelector(".logo-accent");
    if (logoAccent) {
        logoAccent.style.background = theme.gradient;
        logoAccent.style.webkitBackgroundClip = "text";
    }
}

function renderDeviceCheckboxes() {
    deviceCheckboxList.innerHTML = "";
    DEVICES.forEach(device => {
        const item = document.createElement("div");
        item.className = "device-item";
        
        const isChecked = state.activeDevices.includes(device.id) ? "checked" : "";
        
        item.innerHTML = `
            <label class="device-checkbox-label" for="chk-${device.id}">
                <i data-lucide="${device.icon}" style="width:16px;height:16px;color:var(--text-muted)"></i>
                <span>${device.name}</span>
            </label>
            <div style="display: flex; align-items: center; gap: 8px;">
                <span class="device-meta">${device.width}x${device.height}</span>
                <input type="checkbox" class="device-checkbox" id="chk-${device.id}" data-id="${device.id}" ${isChecked}>
            </div>
        `;
        deviceCheckboxList.appendChild(item);
    });
}

function populateSingleDeviceSelect() {
    singleDeviceSelect.innerHTML = "";
    DEVICES.forEach(device => {
        const option = document.createElement("option");
        option.value = device.id;
        option.textContent = device.name;
        if (device.id === state.singleDeviceSelected) {
            option.selected = true;
        }
        singleDeviceSelect.appendChild(option);
    });
}

function renderWorkspace() {
    devicesContainer.innerHTML = "";
    
    let devicesToRender = [];
    if (state.layoutMode === "grid") {
        devicesToRender = DEVICES.filter(d => state.activeDevices.includes(d.id));
    } else {
        const selected = DEVICES.find(d => d.id === state.singleDeviceSelected);
        if (selected) devicesToRender = [selected];
    }

    if (devicesToRender.length === 0) {
        devicesContainer.innerHTML = `
            <div style="text-align: center; padding: 40px; color: var(--text-muted)">
                <i data-lucide="smartphone-off" style="width: 48px; height: 48px; margin-bottom: 12px; color: var(--text-dark)"></i>
                <p>No hay dispositivos seleccionados.</p>
                <p style="font-size: 12px; margin-top: 4px;">Activa al menos uno en el panel lateral.</p>
            </div>
        `;
        lucide.createIcons();
        return;
    }

    devicesToRender.forEach(device => {
        const wrapper = document.createElement("div");
        wrapper.className = "device-wrapper";
        
        const orientation = state.deviceOrientations[device.id] || "portrait";
        const width = orientation === "portrait" ? device.width : device.height;
        const height = orientation === "portrait" ? device.height : device.width;
        
        let deviceClass = "mobile";
        if (device.type === "tablet") deviceClass = "tablet";
        if (device.type === "watch") deviceClass = "watch";
        if (device.type === "desktop") deviceClass = "desktop";
        if (device.id === "iphone-15-pro") deviceClass = "iphone-15-pro";
        if (device.id === "samsung-s23") deviceClass = "samsung-s23";
        if (device.id === "apple-watch-ultra") deviceClass = "apple-watch-ultra";
        if (device.id === "pos-handheld") deviceClass = "pos-handheld";

        wrapper.innerHTML = `
            <div class="device-header">
                <span class="device-name-tag">${device.name}</span>
                <div style="display: flex; align-items: center; gap: 8px;">
                    <span class="device-res">${width} x ${height}</span>
                    <button class="device-orient-btn" data-id="${device.id}" title="Rotar dispositivo">
                        <i data-lucide="rotate-cw" style="width:12px;height:12px"></i>
                    </button>
                    <button class="device-orient-btn btn-refresh-single" data-id="${device.id}" title="Recargar esta pantalla">
                        <i data-lucide="refresh-cw" style="width:12px;height:12px"></i>
                    </button>
                </div>
            </div>
            <div class="device-frame">
                <div class="device-chrome ${deviceClass} ${orientation}">
                    ${deviceClass === "iphone-15-pro" ? '<div class="dynamic-island"></div>' : ''}
                    ${deviceClass === "samsung-s23" ? '<div class="camera-hole"></div>' : ''}
                    <div class="device-screen">
                        <iframe src="${state.url}" title="${device.name}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                    </div>
                </div>
            </div>
        `;
        devicesContainer.appendChild(wrapper);
    });

    applyZoom();
    lucide.createIcons();
    applyDevToolsState();
}

function applyZoom() {
    const scale = state.zoom / 100;
    devicesContainer.style.transform = `scale(${scale})`;
    zoomValue.textContent = `${state.zoom}%`;
}

function setupEventListeners() {
    btnGo.addEventListener("click", updateUrl);
    urlInput.addEventListener("keydown", e => { if (e.key === "Enter") updateUrl(); });
    btnRefresh.addEventListener("click", refreshAllIframes);
    
    document.querySelectorAll(".quick-link-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            urlInput.value = btn.getAttribute("data-url");
            updateUrl();
        });
    });

    zoomRange.addEventListener("input", e => {
        state.zoom = parseInt(e.target.value);
        applyZoom();
        localStorage.setItem("responsive-lab-zoom", state.zoom);
    });

    btnPortrait.addEventListener("click", () => setGlobalOrientation("portrait"));
    btnLandscape.addEventListener("click", () => setGlobalOrientation("landscape"));

    viewGrid.addEventListener("click", () => setLayoutMode("grid"));
    viewSingle.addEventListener("click", () => setLayoutMode("single"));
    singleDeviceSelect.addEventListener("change", e => {
        state.singleDeviceSelected = e.target.value;
        renderWorkspace();
    });

    deviceCheckboxList.addEventListener("change", e => {
        if (e.target.classList.contains("device-checkbox")) {
            const id = e.target.getAttribute("data-id");
            if (e.target.checked) {
                if (!state.activeDevices.includes(id)) state.activeDevices.push(id);
            } else {
                state.activeDevices = state.activeDevices.filter(d => d !== id);
            }
            localStorage.setItem("responsive-lab-active-devices", JSON.stringify(state.activeDevices));
            renderWorkspace();
        }
    });

    devicesContainer.addEventListener("click", e => {
        const orientBtn = e.target.closest(".device-orient-btn:not(.btn-refresh-single)");
        if (orientBtn) {
            const id = orientBtn.getAttribute("data-id");
            state.deviceOrientations[id] = state.deviceOrientations[id] === "portrait" ? "landscape" : "portrait";
            renderWorkspace();
            return;
        }

        const refreshBtn = e.target.closest(".btn-refresh-single");
        if (refreshBtn) {
            const id = refreshBtn.getAttribute("data-id");
            const wrapper = refreshBtn.closest(".device-wrapper");
            if (wrapper) {
                const iframe = wrapper.querySelector("iframe");
                if (iframe) iframe.src = state.url;
            }
        }
    });

    btnOpenExternal.addEventListener("click", () => window.open(state.url, "_blank"));
    if (btnStartTour) btnStartTour.addEventListener("click", startTour);
    if (btnThemeToggle) btnThemeToggle.addEventListener("click", toggleThemeMode);

    document.querySelectorAll(".theme-btn").forEach(btn => {
        btn.addEventListener("click", () => setAccentTheme(btn.getAttribute("data-theme")));
    });

    if (btnAddCustomDevice) btnAddCustomDevice.addEventListener("click", () => deviceModal.classList.remove("hidden"));
    if (btnCloseDeviceModal) btnCloseDeviceModal.addEventListener("click", () => deviceModal.classList.add("hidden"));
    if (btnCancelDevice) btnCancelDevice.addEventListener("click", () => deviceModal.classList.add("hidden"));
    if (btnSaveDevice) btnSaveDevice.addEventListener("click", saveCustomDevice);

    if (btnOpenCorsGuide) btnOpenCorsGuide.addEventListener("click", () => corsGuideModal.classList.remove("hidden"));
    if (btnCloseCorsModal) btnCloseCorsModal.addEventListener("click", () => corsGuideModal.classList.add("hidden"));
    if (btnCloseCorsGuide) btnCloseCorsGuide.addEventListener("click", () => corsGuideModal.classList.add("hidden"));

    if (btnXray) btnXray.addEventListener("click", toggleXray);
    if (btnKeyboard) btnKeyboard.addEventListener("click", toggleKeyboard);
    if (btnTouchCursor) btnTouchCursor.addEventListener("click", toggleTouchCursor);
    if (selectDaltonism) selectDaltonism.addEventListener("change", e => setDaltonism(e.target.value));

    if (tourNextBtn) tourNextBtn.addEventListener("click", nextTourStep);
    if (tourPrevBtn) tourPrevBtn.addEventListener("click", prevTourStep);
    if (tourSkipBtn) tourSkipBtn.addEventListener("click", endTour);
}

function updateUrl() {
    let url = urlInput.value.trim();
    if (!url) return;
    if (!/^https?:\/\//i.test(url)) url = "http://" + url;

    state.url = url;
    urlInput.value = url;
    currentUrlDisplay.textContent = url;
    localStorage.setItem("responsive-lab-url", url);

    const iframes = devicesContainer.querySelectorAll("iframe");
    iframes.forEach(iframe => iframe.src = url);
}

function refreshAllIframes() {
    const iframes = devicesContainer.querySelectorAll("iframe");
    iframes.forEach(iframe => iframe.src = state.url);
}

function setGlobalOrientation(orient) {
    state.globalOrientation = orient;
    btnPortrait.classList.toggle("active", orient === "portrait");
    btnLandscape.classList.toggle("active", orient === "landscape");
    DEVICES.forEach(d => state.deviceOrientations[d.id] = orient);
    renderWorkspace();
}

function setLayoutMode(mode) {
    state.layoutMode = mode;
    viewGrid.classList.toggle("active", mode === "grid");
    viewSingle.classList.toggle("active", mode === "single");
    singleDeviceSelect.classList.toggle("hidden", mode !== "single");
    localStorage.setItem("responsive-lab-layout-mode", mode);
    renderWorkspace();
}

function saveCustomDevice() {
    const name = customDeviceName.value.trim();
    const width = parseInt(customDeviceWidth.value);
    const height = parseInt(customDeviceHeight.value);
    const type = customDeviceType.value;

    if (!name || isNaN(width) || isNaN(height)) {
        alert("Por favor completa el nombre, ancho y alto del dispositivo.");
        return;
    }

    const newDevice = {
        id: `custom-${Date.now()}`,
        name: name,
        width: width,
        height: height,
        type: type,
        icon: type === "tablet" ? "tablet" : (type === "watch" ? "watch" : (type === "desktop" ? "laptop" : "smartphone")),
        defaultActive: true
    };

    DEVICES.push(newDevice);
    state.activeDevices.push(newDevice.id);

    const customSaved = JSON.parse(localStorage.getItem("responsive-lab-custom-devices") || "[]");
    customSaved.push(newDevice);
    localStorage.setItem("responsive-lab-custom-devices", JSON.stringify(customSaved));
    localStorage.setItem("responsive-lab-active-devices", JSON.stringify(state.activeDevices));

    deviceModal.classList.add("hidden");
    customDeviceName.value = "";
    customDeviceWidth.value = "";
    customDeviceHeight.value = "";

    renderDeviceCheckboxes();
    populateSingleDeviceSelect();
    renderWorkspace();
}

// ==========================================
// SISTEMA DE GUÍA INTERACTIVA (TOUR AUTO-SMOOTH)
// ==========================================
function startTour(e) {
    if (e && e.preventDefault) e.preventDefault();
    currentTourStep = 0;
    tourOverlay.classList.remove("hidden");
    tourOverlay.classList.add("active");
    tourCard.classList.add("show");
    showTourStep(currentTourStep);

    tourOverlay.onclick = (event) => {
        if (event.target === tourOverlay) {
            endTour();
        }
    };
}

function showTourStep(stepIdx) {
    const step = tourSteps[stepIdx];
    tourTitle.textContent = step.title;
    tourDesc.textContent = step.desc;

    document.querySelectorAll(".highlighted-element").forEach(el => {
        el.classList.remove("highlighted-element");
    });

    tourStepDots.forEach((dot, idx) => {
        dot.classList.toggle("active", idx === stepIdx);
    });

    if (stepIdx === 0) {
        tourPrevBtn.classList.add("hidden");
    } else {
        tourPrevBtn.classList.remove("hidden");
    }

    tourNextBtn.textContent = (stepIdx === tourSteps.length - 1) ? "Finalizar" : "Siguiente";

    tourCard.removeAttribute("data-arrow");
    
    if (step.elementId) {
        const targetEl = document.getElementById(step.elementId);
        if (targetEl) {
            targetEl.classList.add("highlighted-element");
            targetEl.scrollIntoView({ behavior: "smooth", block: "center" });

            setTimeout(() => {
                const rect = targetEl.getBoundingClientRect();
                const cardHeight = tourCard.offsetHeight || 220;
                let topPos = rect.top;

                if (topPos + cardHeight > window.innerHeight - 20) {
                    topPos = Math.max(10, window.innerHeight - cardHeight - 20);
                }

                if (step.position === "right") {
                    tourCard.style.top = `${Math.max(10, topPos)}px`;
                    tourCard.style.left = `${rect.right + 20}px`;
                    tourCard.style.transform = "scale(1)";
                    tourCard.setAttribute("data-arrow", "left");
                } else if (step.position === "bottom") {
                    const bottomPos = Math.min(rect.bottom + 15, window.innerHeight - cardHeight - 20);
                    tourCard.style.top = `${Math.max(10, bottomPos)}px`;
                    tourCard.style.left = `${Math.max(160, rect.left + (rect.width / 2))}px`;
                    tourCard.style.transform = "translateX(-50%) scale(1)";
                    tourCard.setAttribute("data-arrow", "top");
                }
            }, 120);
        }
    } else {
        tourCard.style.top = "50%";
        tourCard.style.left = "50%";
        tourCard.style.transform = "translate(-50%, -50%) scale(1)";
    }
}

function nextTourStep() {
    if (currentTourStep < tourSteps.length - 1) {
        currentTourStep++;
        showTourStep(currentTourStep);
    } else {
        endTour();
    }
}

function prevTourStep() {
    if (currentTourStep > 0) {
        currentTourStep--;
        showTourStep(currentTourStep);
    }
}

function endTour() {
    document.querySelectorAll(".highlighted-element").forEach(el => {
        el.classList.remove("highlighted-element");
    });
    tourCard.classList.remove("show");
    tourOverlay.classList.remove("active");
    setTimeout(() => {
        tourOverlay.classList.add("hidden");
    }, 300);

    localStorage.setItem("responsive-lab-tour-completed", "true");
}

let devtoolsState = { xray: false, keyboard: false, touchCursor: false, daltonism: "normal" };

function toggleXray() {
    devtoolsState.xray = !devtoolsState.xray;
    btnXray.classList.toggle("active", devtoolsState.xray);
    applyDevToolsState();
}

function toggleKeyboard() {
    devtoolsState.keyboard = !devtoolsState.keyboard;
    btnKeyboard.classList.toggle("active", devtoolsState.keyboard);
    document.body.classList.toggle("keyboard-active", devtoolsState.keyboard);
}

function toggleTouchCursor() {
    devtoolsState.touchCursor = !devtoolsState.touchCursor;
    btnTouchCursor.classList.toggle("active", devtoolsState.touchCursor);
    document.body.classList.toggle("touch-cursor-active", devtoolsState.touchCursor);
}

function setDaltonism(mode) {
    devtoolsState.daltonism = mode;
    const workspace = document.getElementById("workspace");
    workspace.className = "workspace";
    if (mode !== "normal") {
        workspace.classList.add(`daltonism-${mode}`);
    }
}

function applyDevToolsState() {
    const iframes = devicesContainer.querySelectorAll("iframe");
    iframes.forEach(iframe => {
        try {
            const doc = iframe.contentDocument || iframe.contentWindow.document;
            if (!doc) return;
            let xrayStyle = doc.getElementById("jm-xray-style");
            if (xrayStyle) xrayStyle.remove();
            if (devtoolsState.xray) {
                const style = doc.createElement("style");
                style.id = "jm-xray-style";
                style.textContent = "* { outline: 1px solid rgba(239, 68, 68, 0.4) !important; background: rgba(239, 68, 68, 0.02) !important; }";
                doc.head.appendChild(style);
            }
        } catch (e) {}
    });
}

function toggleThemeMode(e) {
    if (e && e.preventDefault) e.preventDefault();
    const isLight = document.body.classList.toggle("light-theme");
    localStorage.setItem("responsive-lab-light-mode", isLight ? "true" : "false");
    updateThemeToggleIcon(isLight);
}

function updateThemeToggleIcon(isLight) {
    if (!btnThemeToggle) return;
    if (isLight) {
        btnThemeToggle.innerHTML = `<i data-lucide="sun" style="width: 12px; height: 12px; display: inline-block; vertical-align: middle; margin-right: 2px;"></i> Modo Día`;
    } else {
        btnThemeToggle.innerHTML = `<i data-lucide="moon" style="width: 12px; height: 12px; display: inline-block; vertical-align: middle; margin-right: 2px;"></i> Modo Noche`;
    }
    lucide.createIcons();
}

window.addEventListener("DOMContentLoaded", () => {
    init();
});
