window.showToast = function(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    const icon = type === 'success' ? '✔' : '⚠';
    toast.innerHTML = `<span style="background:var(--text-color);color:#fff;padding:0.2rem 0.5rem;display:inline-block;border:2px solid var(--text-color);">${icon}</span> <span>${message}</span>`;
    container.appendChild(toast);
    
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400);
    }, 3000);
};

// ============================================
// SCISSOR-CUT PAGE TRANSITION ENGINE
// ============================================
window.scissorTransition = function(targetUrl) {
    // Don't fire if already transitioning
    if (document.querySelector('.scissor-transition')) return;

    const overlay = document.createElement('div');
    overlay.className = 'scissor-transition';
    overlay.innerHTML = `
        <div class="scissor-half scissor-half--top">
            <span class="scissor-label">PORTFOLIO SAMPLE</span>
        </div>
        <div class="scissor-half scissor-half--bottom">
            <span class="scissor-label">PORTFOLIO SAMPLE</span>
        </div>
        <div class="scissor-line"></div>
        <div class="scissor-icon">✂️</div>
        <div class="scissor-badge">PORTFOLIO SAMPLE</div>
    `;
    document.body.appendChild(overlay);

    // Navigate after the full animation plays (~3 seconds)
    setTimeout(() => {
        window.location.href = targetUrl;
    }, 3000);
};

// Internal page links use normal browser navigation (reliable with `npm start` on http://localhost).
// Optional: add class "scissor-link" on an <a> to use the dramatic transition.
document.addEventListener('click', (e) => {
    const link = e.target.closest('a.scissor-link');
    if (!link) return;
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#')) return;
    e.preventDefault();
    window.scissorTransition(href);
});

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. CART SYSTEM (localStorage) ---
    const cart = {
        items: JSON.parse(localStorage.getItem('portfolioCart') || '[]'),
        
        save() { localStorage.setItem('portfolioCart', JSON.stringify(this.items)); },
        
        add(item) {
            this.items.push({
                id: Date.now(),
                title: item.title,
                price: parseFloat(item.price),
                image: item.image,
                size: item.size || 'M',
                color: item.color || 'Default'
            });
            this.save();
            this.updateBadge();
            this.renderDrawer();
            window.showToast(`"${item.title}" added to cart!`, 'success');
        },
        
        remove(id) {
            this.items = this.items.filter(i => i.id !== id);
            this.save();
            this.updateBadge();
            this.renderDrawer();
        },
        
        getTotal() {
            return this.items.reduce((sum, i) => sum + i.price, 0).toFixed(2);
        },
        
        updateBadge() {
            document.querySelectorAll('.cart-badge, #cart-badge').forEach(b => {
                b.innerText = this.items.length;
                b.style.transform = 'scale(1.5)';
                setTimeout(() => { b.style.transform = 'scale(1)'; }, 200);
            });
        },
        
        renderDrawer() {
            const itemsEl = document.querySelector('.cart-items');
            const totalEl = document.querySelector('.cart-total-value');
            if (!itemsEl) return;
            
            if (this.items.length === 0) {
                itemsEl.innerHTML = '<div class="cart-empty">🛒 Your cart is empty</div>';
            } else {
                itemsEl.innerHTML = this.items.map(item => `
                    <div class="cart-item" data-id="${item.id}">
                        <img src="${item.image}" alt="${item.title}" class="cart-item-img">
                        <div class="cart-item-info">
                            <div class="cart-item-title">${item.title}</div>
                            <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                            <div style="font-size:0.8rem;color:#777;">Size: ${item.size} / ${item.color}</div>
                        </div>
                        <button class="cart-item-remove" data-id="${item.id}">✕</button>
                    </div>
                `).join('');
                
                // Bind remove buttons
                itemsEl.querySelectorAll('.cart-item-remove').forEach(btn => {
                    btn.addEventListener('click', () => this.remove(parseInt(btn.dataset.id)));
                });
            }
            if (totalEl) totalEl.innerText = `$${this.getTotal()}`;
        },
        
        openDrawer() {
            document.querySelector('.cart-drawer')?.classList.add('open');
            document.querySelector('.cart-drawer-overlay')?.classList.add('open');
            this.renderDrawer();
        },
        
        closeDrawer() {
            document.querySelector('.cart-drawer')?.classList.remove('open');
            document.querySelector('.cart-drawer-overlay')?.classList.remove('open');
        }
    };
    
    // Inject Cart Drawer HTML if it doesn't exist
    if (!document.querySelector('.cart-drawer')) {
        const drawerHTML = `
        <div class="cart-drawer-overlay"></div>
        <div class="cart-drawer">
            <div class="cart-drawer-header">
                <h2>🛒 YOUR CART</h2>
                <button class="cart-close-btn">✕</button>
            </div>
            <div class="cart-items"></div>
            <div class="cart-drawer-footer">
                <div class="cart-total">
                    <span>TOTAL</span>
                    <span class="cart-total-value">$0.00</span>
                </div>
                <a href="checkout.html" class="cart-checkout-btn">PROCEED TO CHECKOUT →</a>
            </div>
        </div>`;
        document.body.insertAdjacentHTML('beforeend', drawerHTML);
        
        document.querySelector('.cart-close-btn')?.addEventListener('click', () => cart.closeDrawer());
        document.querySelector('.cart-drawer-overlay')?.addEventListener('click', () => cart.closeDrawer());
    }
    
    // Open cart when clicking cart icon
    document.querySelectorAll('.cart-icon').forEach(el => {
        el.style.cursor = 'pointer';
        el.addEventListener('click', () => cart.openDrawer());
    });
    
    // Init badge count on page load
    cart.updateBadge();
    
    // Wire Add-to-Cart on product cards (including items loaded after DOM via /api/products)
    document.body.addEventListener('click', (e) => {
        const btn = e.target.closest('.add-to-cart-btn');
        if (!btn) return;
        e.preventDefault();
        const card = btn.closest('.product-card') || btn.closest('article');
        if (card) {
            const title = card.querySelector('.product-title')?.innerText || 'Custom Design';
            const priceText = card.querySelector('.product-price')?.innerText || '45.00';
            const price = priceText.replace(/[^0-9.]/g, '');
            const image = card.querySelector('.product-img')?.src || '';
            cart.add({ title, price, image });
        } else if (btn.closest('.mobile-layout') && btn.classList.contains('add-to-cart-btn')) {
            const activeColor = document.querySelector('.mobile-layout .color-btn.active');
            const activeSize = document.querySelector('.mobile-layout .size-btn.active');
            cart.add({
                title: 'Custom 3D Design',
                price: '45.00',
                image: 'assets/img/product_1.png',
                size: activeSize?.innerText || 'M',
                color: activeColor?.dataset?.hex || '#ffffff'
            });
        }
        const origText = btn.innerText;
        btn.innerText = 'ADDED ✓';
        btn.style.backgroundColor = 'var(--accent-3)';
        setTimeout(() => { btn.innerText = origText; btn.style.backgroundColor = ''; }, 1200);
    });
    
    // Wire Add-to-Cart on configurator (right sidebar)
    const configCartBtn = document.getElementById('add-to-cart-config');
    if (configCartBtn) {
        configCartBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const activeColor = document.querySelector('.color-btn.active');
            const activeSize = document.querySelector('.size-btn.active');
            cart.add({
                title: 'Custom 3D Design',
                price: '45.00',
                image: 'assets/img/product_1.png',
                size: activeSize?.innerText || 'M',
                color: activeColor?.dataset.hex || '#ffffff'
            });
            configCartBtn.innerText = 'ADDED ✓';
            configCartBtn.style.backgroundColor = 'var(--accent-3)';
            setTimeout(() => { configCartBtn.innerText = 'ADD TO CART'; configCartBtn.style.backgroundColor = ''; }, 1200);
        });
    }
    
    // Expose cart globally for checkout page
    window.portfolioCart = cart;

    // --- 2. 2D CONFIGURATOR (LEGACY/MOBILE) ---
    const mockupImg = document.getElementById('tshirt-mockup-img');
    const colorBtns = document.querySelectorAll('.color-btn');
    if (mockupImg) {
        colorBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                colorBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const color = btn.style.backgroundColor;
                mockupImg.style.backgroundColor = color;
                if(document.getElementById('selected-color')) {
                    document.getElementById('selected-color').value = color;
                }
            });
        });
    }

    // --- 3. LOGO UPLOAD & DRAG (LEGACY/MOBILE) ---
    const logoUpload = document.getElementById('logo-upload');
    const dragContainer = document.getElementById('drag-container');
    if (logoUpload && dragContainer) {
        const customLogo = document.getElementById('custom-logo');
        const resizeHandle = document.getElementById('resize-handle');
        const deleteLogo = document.getElementById('delete-logo');

        logoUpload.addEventListener('change', function(e) {
            if (e.target.files && e.target.files[0]) {
                const reader = new FileReader();
                reader.onload = function(evt) {
                    customLogo.src = evt.target.result;
                    dragContainer.style.display = 'block';
                };
                reader.readAsDataURL(e.target.files[0]);
            }
        });

        deleteLogo.addEventListener('click', () => {
            dragContainer.style.display = 'none';
            logoUpload.value = '';
            customLogo.src = '';
        });

        let isDragging = false;
        let isResizing = false;
        let startX, startY;

        dragContainer.addEventListener('mousedown', function(e) {
            if (e.target === resizeHandle || e.target === deleteLogo) return;
            isDragging = true;
            startX = e.clientX - dragContainer.offsetLeft;
            startY = e.clientY - dragContainer.offsetTop;
            e.preventDefault();
        });

        document.addEventListener('mousemove', function(e) {
            if (isDragging) {
                dragContainer.style.left = (e.clientX - startX) + 'px';
                dragContainer.style.top = (e.clientY - startY) + 'px';
            }
            if (isResizing) {
               // ... (Resize logic)
            }
        });

        document.addEventListener('mouseup', () => { isDragging = false; isResizing = false; });
    }

    // --- 4. FABRIC.JS 2D MINIMAP ENGINE (skip if dedicated configurator script runs — avoids double Three/Fabric init) ---
    const canvasFrontEl = document.getElementById('design-minimap-front');
    const usesDedicatedConfigurator = Array.from(document.scripts).some((s) => {
        const src = s.getAttribute('src') || '';
        return src.includes('configurator.js') || src.includes('configurator_mobile.js');
    });
    if (canvasFrontEl && typeof fabric !== 'undefined' && !usesDedicatedConfigurator) {
        let fCanvasFront, fCanvasBack;
        let decalTextureFront, decalTextureBack;
        let activeCanvas = null;

        const setupFabric = (id) => {
            const el = document.getElementById(id);
            if (!el) return null;
            const f = new fabric.Canvas(id);
            f.setDimensions({ width: 700, height: 900 }, { backstoreOnly: true });
            f.setDimensions({ width: 300, height: 385 }, { cssOnly: true });
            f.setBackgroundColor('transparent', f.renderAll.bind(f));
            
            // Check for THREE before creating texture
            let tex = null;
            if (typeof THREE !== 'undefined') {
                tex = new THREE.CanvasTexture(el);
                tex.anisotropy = 16;
                f.on('after:render', () => { tex.needsUpdate = true; });
            }
            return { f, tex };
        };

        const front = setupFabric('design-minimap-front');
        if (front) { fCanvasFront = front.f; decalTextureFront = front.tex; activeCanvas = fCanvasFront; }
        const back = setupFabric('design-minimap-back');
        if (back) { fCanvasBack = back.f; decalTextureBack = back.tex; }

        // Switch Logic
        const btnFront = document.getElementById('view-front-btn');
        const btnBack = document.getElementById('view-back-btn');
        if (btnFront && btnBack) {
            btnFront.addEventListener('click', () => {
                btnFront.style.background = 'var(--accent-3)';
                btnBack.style.background = '#fff';
                document.getElementById('map-wrapper-front').style.display = 'block';
                document.getElementById('map-wrapper-back').style.display = 'none';
                activeCanvas = fCanvasFront;
                // Signal 3D engine to rotate
                document.dispatchEvent(new CustomEvent('neltiViewChange', { detail: 'front' }));
            });
            btnBack.addEventListener('click', () => {
                btnBack.style.background = 'var(--accent-3)';
                btnFront.style.background = '#fff';
                document.getElementById('map-wrapper-back').style.display = 'block';
                document.getElementById('map-wrapper-front').style.display = 'none';
                activeCanvas = fCanvasBack;
                // Signal 3D engine to rotate
                document.dispatchEvent(new CustomEvent('neltiViewChange', { detail: 'back' }));
            });
        }

        // Setup UI Controls
        const addTextBtn = document.getElementById('add-text-btn');
        if (addTextBtn) {
            addTextBtn.addEventListener('click', () => {
                if (!activeCanvas) return;
                const fontSelect = document.getElementById('font-family');
                const fontFamily = fontSelect ? fontSelect.value : 'Space Grotesk';
                const text = new fabric.IText('YOUR TEXT', {
                    left: 200, top: 200, fontFamily: fontFamily,
                    fontSize: 80, fill: '#000000', fontWeight: 'bold'
                });
                activeCanvas.add(text);
                activeCanvas.setActiveObject(text);
            });
        }

        const imageUpload = document.getElementById('image-upload');
        if (imageUpload) {
            imageUpload.addEventListener('change', function(e) {
                if (e.target.files && e.target.files[0] && activeCanvas) {
                    const reader = new FileReader();
                    reader.onload = function(evt) {
                        fabric.Image.fromURL(evt.target.result, function(img) {
                            img.scaleToWidth(300);
                            img.set({ left: 200, top: 200 });
                            activeCanvas.add(img);
                            activeCanvas.setActiveObject(img);
                        });
                    };
                    reader.readAsDataURL(e.target.files[0]);
                }
            });
        }

        const fontSelect = document.getElementById('font-family');
        if (fontSelect) {
            fontSelect.addEventListener('change', (e) => {
                if (!activeCanvas) return;
                const activeObj = activeCanvas.getActiveObject();
                if (activeObj && activeObj.type === 'i-text') {
                    activeObj.set({ fontFamily: e.target.value });
                    activeCanvas.requestRenderAll();
                }
            });
        }

        const alignMap = {
            'pos-left-btn': 'left', 'pos-hcenter-btn': 'center', 'pos-right-btn': 'right',
            'pos-top-btn': 'top', 'pos-vcenter-btn': 'middle', 'pos-bot-btn': 'bottom'
        };
        for (let id in alignMap) {
            const btn = document.getElementById(id);
            if (btn) {
                btn.addEventListener('click', () => {
                    if (!activeCanvas) return;
                    const activeObj = activeCanvas.getActiveObject();
                    if (!activeObj) return;
                    const val = alignMap[id];
                    if (['left', 'center', 'right'].includes(val)) {
                        let objWidth = activeObj.getScaledWidth();
                        if (val === 'left') activeObj.set({ left: 0 });
                        if (val === 'center') activeObj.set({ left: (activeCanvas.width / 2) - (objWidth / 2) });
                        if (val === 'right') activeObj.set({ left: activeCanvas.width - objWidth });
                    } else {
                        let objHeight = activeObj.getScaledHeight();
                        if (val === 'top') activeObj.set({ top: 0 });
                        if (val === 'middle') activeObj.set({ top: (activeCanvas.height / 2) - (objHeight / 2) });
                        if (val === 'bottom') activeObj.set({ top: activeCanvas.height - objHeight });
                    }
                    activeObj.setCoords();
                    activeCanvas.requestRenderAll();
                });
            }
        }

        const deleteLayerBtn = document.getElementById('delete-layer-btn');
        if (deleteLayerBtn) {
            deleteLayerBtn.addEventListener('click', () => {
                if (!activeCanvas) return;
                const activeObjs = activeCanvas.getActiveObjects();
                if (activeObjs.length) {
                    activeObjs.forEach(obj => activeCanvas.remove(obj));
                    activeCanvas.discardActiveObject();
                    activeCanvas.requestRenderAll();
                }
            });
        }

        // --- 5. THREE.JS 3D ENGINE ---
        const container = document.getElementById('webgl-container');
        if (container && typeof THREE !== 'undefined') {
            const loaderMsg = document.getElementById('loader-msg');
            let scene, camera, renderer, controls, tshirtModel;
            let materialRefs = [];

            const init3D = () => {
                scene = new THREE.Scene();
                // Initial background color - default to white
                camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
                camera.position.set(0, 0, 2.5); // Safe framing distance
                renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, preserveDrawingBuffer: true });
                renderer.setSize(container.clientWidth, container.clientHeight);
                renderer.setPixelRatio(window.devicePixelRatio);
                renderer.shadowMap.enabled = true;
                container.appendChild(renderer.domElement);
                
                scene.add(new THREE.AmbientLight(0xffffff, 0.7));
                const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
                dirLight.position.set(5, 5, 5);
                scene.add(dirLight);

                controls = new THREE.OrbitControls(camera, renderer.domElement);
                controls.enableDamping = true;
                controls.target.set(0, 0, 0);
                controls.update();

                // Listen for UI view changes
                document.addEventListener('neltiViewChange', (e) => {
                    if (tshirtModel) {
                        // Spin to the target side smoothly
                        tshirtModel.rotation.y = (e.detail === 'back') ? Math.PI : 0;
                        // Important: Update the matrix so Decals stay pinned correctly
                        tshirtModel.updateMatrixWorld(true);
                    }
                });

                const loader = new THREE.GLTFLoader();
                const pushMeshMaterials = (mesh, arr) => {
                    if (!mesh.material) return;
                    const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
                    mats.forEach((m) => {
                        if (m && m.color) arr.push(m);
                    });
                };

                loader.load('assets/model/t_shirt.glb', (gltf) => {
                    tshirtModel = gltf.scene;
                    tshirtModel.traverse(node => {
                        if (node.isMesh) pushMeshMaterials(node, materialRefs);
                    });
                    
                    // --- CENTERING MATH ---
                    const box = new THREE.Box3().setFromObject(tshirtModel);
                    const center = box.getCenter(new THREE.Vector3());
                    tshirtModel.position.set(-center.x, -center.y, -center.z);
                    
                    // Add model to scene AFTER centering
                    scene.add(tshirtModel);
                    tshirtModel.updateMatrixWorld(true); // Extremely important for DecalGeometry to work properly!
                    
                    // Center and project decals
                    const boxAfter = new THREE.Box3().setFromObject(tshirtModel);
                    const sizeV = boxAfter.getSize(new THREE.Vector3());
                    // Decal size (width, height, depth of projection)
                    const decalWidth = sizeV.x * 0.5; // Scale relative to shirt width
                    const decalHeight = decalWidth * 1.285; // Mini-map ratio
                    // Set depth to half the shirt thickness to strictly prevent bleed-through
                    const depth = sizeV.z * 0.5; 
                    const size = new THREE.Vector3(decalWidth, decalHeight, depth); 
                    
                    const matF = new THREE.MeshBasicMaterial({ map: decalTextureFront, transparent: true, depthTest: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -4 });
                    const matB = new THREE.MeshBasicMaterial({ map: decalTextureBack, transparent: true, depthTest: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -4 });

                    tshirtModel.traverse(node => {
                        if (node.isMesh) {
                            try {
                                // Front Decal: positioned halfway between the center and the front edge
                                const gF = new THREE.DecalGeometry(node, new THREE.Vector3(0, sizeV.y * 0.1, sizeV.z * 0.25), new THREE.Euler(0,0,0), size);
                                if (gF.attributes.position.count > 0) scene.add(new THREE.Mesh(gF, matF));
                                
                                // Back Decal: positioned halfway between the center and the back edge
                                const gB = new THREE.DecalGeometry(node, new THREE.Vector3(0, sizeV.y * 0.1, -sizeV.z * 0.25), new THREE.Euler(0, Math.PI, 0), size);
                                if (gB.attributes.position.count > 0) scene.add(new THREE.Mesh(gB, matB));
                            } catch(e) { console.error('Decal Error:', e); }
                        }
                    });

                    const nl = document.getElementById('nelti-loader');
                    if (nl) { nl.style.opacity = '0'; setTimeout(() => nl.style.display = 'none', 500); }
                }, 
                (xhr) => {
                    const lb = document.getElementById('loader-bar');
                    const msg = document.getElementById('loader-msg');
                    if (xhr.lengthComputable && xhr.total > 0) {
                        const p = Math.round(xhr.loaded / xhr.total * 100);
                        if (msg) msg.innerText = p + '%';
                        if (lb) lb.style.width = p + '%';
                    } else {
                        if (msg) msg.innerText = 'LOADING ENGINE...';
                        if (lb) lb.style.width = '50%'; // Arbitrary pulse
                    }
                });
            };

            const animate = () => {
                requestAnimationFrame(animate);
                if (controls) controls.update();
                if (renderer && scene && camera) renderer.render(scene, camera);
            };

            init3D();
            animate();
            window.addEventListener('resize', () => {
                camera.aspect = container.clientWidth / container.clientHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(container.clientWidth, container.clientHeight);
            });

            // Update background color based on initial active button
            const updateBgContrast = (hex) => {
                if (!scene) return;
                const lum = getLuminance(hex);
                // White or very light -> Black Background
                // Darks -> White Background
                const bgColor = (lum > 0.6) ? "#000000" : "#ffffff";
                scene.background = new THREE.Color(bgColor);
                if (renderer) renderer.setClearColor(bgColor);
                // Also update the container CSS to prevent flashing
                if (container) container.style.backgroundColor = bgColor;
            };

            const activeBtn = document.querySelector('.color-btn.active');
            if (activeBtn) updateBgContrast(activeBtn.dataset.hex || "#ffffff");

            // Sync Color Buttons to 3D refs
            const cBtns = document.querySelectorAll('.color-btn');
            
            function getLuminance(hex) {
                if (!hex.startsWith('#')) return 1; // Default light
                const r = parseInt(hex.slice(1, 3), 16);
                const g = parseInt(hex.slice(3, 5), 16);
                const b = parseInt(hex.slice(5, 7), 16);
                return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
            }

            cBtns.forEach(b => b.addEventListener('click', () => {
                const hex = b.dataset.hex;
                if (hex) {
                    // UI Polish
                    cBtns.forEach(btn => btn.classList.remove('active'));
                    b.classList.add('active');

                    // Update model color if loaded
                    if (materialRefs.length) {
                        materialRefs.forEach(m => {
                            if (m && m.color) {
                                m.color.set(hex);
                                m.needsUpdate = true;
                            }
                        });
                    }
                    
                    // --- DYNAMIC BACKGROUND CONTRAST ---
                    updateBgContrast(hex);
                }
            }));
            
            // Save Image
            const sBtn = document.getElementById('save-tshirt-btn');
            if (sBtn) {
                sBtn.addEventListener('click', () => {
                    renderer.render(scene, camera);
                    const link = document.createElement('a');
                    const sideName = (activeCanvas === fCanvasBack) ? 'back' : 'front';
                    link.download = `nelti-design-${sideName}.png`;
                    link.href = renderer.domElement.toDataURL('image/png');
                    link.click();
                });
            }
        }
    }
});
