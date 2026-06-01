<?php
// Configurator Mobile Page - Vertical Stacked 3D Engine
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
    <title>3D Design Studio - Mobile</title>
    
    <!-- Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Courier+Prime:wght@400;700&family=Impact&family=Space+Grotesk:wght@400;700&family=Roboto:wght@400;700&family=Montserrat:wght@400;700&family=Oswald:wght@400;700&family=Playfair+Display:wght@400;700&family=Bebas+Neue&display=swap" rel="stylesheet">
    
    <!-- Three.js & Fabric -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/geometries/DecalGeometry.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/fabric.js/5.3.1/fabric.min.js"></script>

    <link rel="stylesheet" href="assets/css/style.css">
    <link rel="stylesheet" href="assets/css/mobile.css" media="(max-width: 768px)">
    <style>
        body { overflow-x: hidden; background-color: #FAFAFA; margin: 0; padding: 0; display: flex; flex-direction: column; min-height: 100vh;}
        header { position: sticky; top: 0; z-index: 1000; }
        .logo img { height: 40px; }
        
        .mobile-layout {
            display: flex;
            flex-direction: column;
            width: 100vw;
        }

        /* 3D Viewport stuck to top below header */
        .mobile-3d-stage {
            width: 100vw;
            height: 45vh;
            border-bottom: var(--border-width) solid var(--border-color);
            position: relative;
            background: #fff;
        }

        /* 2D Minimap taking up rest of screen */
        .mobile-2d-stage {
            padding: 1rem;
            background-color: var(--bg-color);
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        .tool-panel-mobile {
            padding: 1rem;
            background: #fff;
            border-top: var(--border-width) solid var(--border-color);
            border-bottom: var(--border-width) solid var(--border-color);
        }
        
        /* Grid specifically for mobile colors */
        .color-options-mobile {
            display: grid;
            grid-template-columns: repeat(5, 1fr);
            gap: 0.5rem;
            margin-top: 1rem;
        }
    </style>
</head>
<body>

<header>
    <div class="nav-container" style="max-width: 100%; padding: 0.5rem 1rem;">
        <a href="index.php" class="logo"><img src="slike/logo.png" alt="NeLTi Logo"></a>
        <nav id="site-nav" class="site-nav">
            <ul>
                <li><a href="index.php">SHOP</a></li>
                <li><a href="contact.php">CONTACT</a></li>
            </ul>
        </nav>
        <div class="nav-actions">
            <div class="cart-icon">
                <span style="font-size: 1.5rem;">🛒</span>
                <span class="cart-badge" id="cart-badge">0</span>
            </div>
            <button type="button" class="nav-toggle" id="nav-toggle" aria-controls="site-nav" aria-expanded="false" aria-label="Odpri meni">
                <span class="nav-toggle-bar" aria-hidden="true"></span>
                <span class="nav-toggle-bar" aria-hidden="true"></span>
                <span class="nav-toggle-bar" aria-hidden="true"></span>
            </button>
        </div>
    </div>
</header>

<main class="mobile-layout">
    <!-- 3D Viewport -->
    <div class="mobile-3d-stage" id="webgl-container">
        <div id="loader-msg" style="position: absolute; top:50%; left:50%; transform:translate(-50%, -50%); z-index: 100; font-size: 1rem; font-weight: bold; animation: blink 1s infinite;">
            LOADING 3D...
        </div>
    </div>

    <!-- Toggle & Minimap -->
    <div class="mobile-2d-stage">
        <div style="display: flex; gap: 0.5rem; width: 100%; max-width: 400px; margin-bottom: 1rem;">
            <button id="view-front-btn" class="btn" style="flex:1; padding: 0.5rem; font-size: 0.9rem; background: var(--accent-3);">FRONT</button>
            <button id="view-back-btn" class="btn" style="flex:1; padding: 0.5rem; font-size: 0.9rem; background: #fff;">BACK</button>
        </div>
        
        <p style="font-size: 0.7rem; font-weight: bold; color: #555;">TOUCH TO DRAG & SCALE</p>
        
        <div id="map-wrapper-front" style="border: 2px dashed #bbb; padding: 2px; background-color: #fff; width: 280px; height: 360px; margin: 0 auto; display: block;">
            <canvas id="design-minimap-front"></canvas>
        </div>
        
        <div id="map-wrapper-back" style="border: 2px dashed #bbb; padding: 2px; background-color: #fff; width: 280px; height: 360px; margin: 0 auto; display: none;">
            <canvas id="design-minimap-back"></canvas>
        </div>
    </div>

    <!-- Creation Tools -->
    <div class="tool-panel-mobile">
        <h3 style="font-size: 1.2rem; margin-bottom: 1rem;">DESIGN TOOLS</h3>
        <button id="add-text-btn" class="btn btn-primary" style="width: 100%; margin-bottom: 0.5rem; font-size: 1rem;">+ ADD TEXT</button>
        
        <div style="position: relative; box-sizing: border-box; margin-bottom: 1rem;">
            <input type="file" id="image-upload" accept="image/*" style="position: absolute; opacity: 0; width: 100%; height: 100%; cursor: pointer; top:0; left:0;">
            <button class="btn btn-secondary" style="width: 100%; font-size: 1rem; pointer-events: none;">+ UPLOAD GRAPHIC</button>
        </div>

        <select id="font-family" class="form-input" style="margin-bottom: 1rem;">
            <option value="Space Grotesk">Space Grotesk</option>
            <option value="Courier Prime">Courier New</option>
            <option value="Impact">Impact</option>
            <option value="Arial">Arial</option>
            <option value="Roboto">Roboto</option>
            <option value="Montserrat">Montserrat</option>
            <option value="Oswald">Oswald</option>
            <option value="Playfair Display">Playfair</option>
            <option value="Bebas Neue">Bebas Neue</option>
        </select>

        <label style="display: block; font-weight: bold; margin: 0.75rem 0 0.35rem 0; font-size: 0.9rem;">Text color (each layer)</label>
        <p style="font-size: 0.7rem; color: #666; margin: 0 0 0.5rem 0;">One color control per text layer.</p>
        <div id="text-layers-colors" style="display: flex; flex-direction: column; gap: 0.35rem; margin-bottom: 1rem;"></div>
        
        <label style="display: block; font-weight: bold; margin-bottom: 0.5rem; font-size: 0.9rem;">ALIGN HORIZONTAL</label>
        <div style="display: flex; gap: 0.5rem; width: 100%; margin-bottom: 0.5rem;">
            <button id="pos-left-btn" class="btn" style="flex:1; padding: 0.5rem; font-size: 0.8rem; background: #e0e0e0; color: #000; border: 1px solid #ccc;">LEFT</button>
            <button id="pos-hcenter-btn" class="btn" style="flex:1; padding: 0.5rem; font-size: 0.8rem; background: #e0e0e0; color: #000; border: 1px solid #ccc;">CENTER</button>
            <button id="pos-right-btn" class="btn" style="flex:1; padding: 0.5rem; font-size: 0.8rem; background: #e0e0e0; color: #000; border: 1px solid #ccc;">RIGHT</button>
        </div>

        <label style="display: block; font-weight: bold; margin-bottom: 0.5rem; font-size: 0.9rem;">ALIGN VERTICAL</label>
        <div style="display: flex; gap: 0.5rem; width: 100%; margin-bottom: 1rem;">
            <button id="pos-top-btn" class="btn" style="flex:1; padding: 0.5rem; font-size: 0.8rem; background: #e0e0e0; color: #000; border: 1px solid #ccc;">TOP</button>
            <button id="pos-vcenter-btn" class="btn" style="flex:1; padding: 0.5rem; font-size: 0.8rem; background: #e0e0e0; color: #000; border: 1px solid #ccc;">MIDDLE</button>
            <button id="pos-bot-btn" class="btn" style="flex:1; padding: 0.5rem; font-size: 0.8rem; background: #e0e0e0; color: #000; border: 1px solid #ccc;">BOTTOM</button>
        </div>
        
        <button id="delete-layer-btn" style="width:100%; background: #DC143C; color: #fff; padding: 0.75rem; border: var(--border-width) solid var(--border-color); font-weight: bold;">DELETE LAYER</button>
    </div>

    <!-- Product Options -->
    <div class="tool-panel-mobile" style="background: var(--bg-color); padding-bottom: 4rem;">
        <h3 style="font-size: 1.2rem;">PRODUCT OPTIONS</h3>
        
        <!-- Standard Color Grid -->
        <div class="color-options-mobile">
            <button class="color-btn active" data-hex="#ffffff" style="background-color: #ffffff;"></button>
            <button class="color-btn" data-hex="#121212" style="background-color: #121212;"></button>
            <button class="color-btn" data-hex="#36454F" style="background-color: #36454F;"></button>
            <button class="color-btn" data-hex="#9e9e9e" style="background-color: #9e9e9e;"></button>
            <button class="color-btn" data-hex="#DC143C" style="background-color: #DC143C;"></button>
            <button class="color-btn" data-hex="#4169E1" style="background-color: #4169E1;"></button>
            <button class="color-btn" data-hex="#228B22" style="background-color: #228B22;"></button>
            <button class="color-btn" data-hex="#FFDB58" style="background-color: #FFDB58;"></button>
            <button class="color-btn" data-hex="#FFE5B4" style="background-color: #FFE5B4;"></button>
            <button class="color-btn" data-hex="#FFB6C1" style="background-color: #FFB6C1;"></button>
        </div>

        <div class="size-options" style="margin-top: 1.5rem; justify-content: center;">
            <button class="size-btn" data-size="S">S</button>
            <button class="size-btn active" data-size="M">M</button>
            <button class="size-btn" data-size="L">L</button>
            <button class="size-btn" data-size="XL">XL</button>
        </div>
        
        <button class="btn btn-secondary add-to-cart-btn" style="width: 100%; margin-top: 1.5rem;">ADD TO CART</button>
        <button id="save-tshirt-btn" class="btn" style="width: 100%; margin-top: 1rem; background: var(--accent-3);">💾 SAVE IMAGE</button>
    </div>

</main>

<style>
    @keyframes blink {
        0% { opacity: 1; }
        50% { opacity: 0; }
        100% { opacity: 1; }
    }
</style>

<script src="assets/js/mobile-nav.js" defer></script>
<script src="assets/js/configurator_mobile.js"></script>
</body>
</html>
