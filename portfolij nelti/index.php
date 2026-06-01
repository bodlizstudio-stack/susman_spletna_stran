<?php
// Main Landing Page
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
    <title>Portfolio Sample - Premium Custom T-Shirts</title>
    <!-- Add SEO Meta Tags -->
    <meta name="description" content="Design and buy premium, neo-brutalist custom t-shirts. Portfolio Sample showcase.">
    <link rel="stylesheet" href="style.css">
    <link rel="stylesheet" href="assets/css/mobile.css" media="(max-width: 768px)">
</head>
<body>

<div class="portfolio-ribbon">PORTFOLIO SAMPLE</div>

<header>
    <div class="nav-container">
        <a href="index.php" class="logo" style="font-weight:900; font-size:1.5rem; text-decoration:none; color:var(--text-color); background:var(--accent-1); padding:0.3rem 0.8rem; border:var(--border-width) solid var(--border-color); box-shadow:4px 4px 0px var(--border-color);">PORTFOLIO SAMPLE</a>
        <nav id="site-nav" class="site-nav">
            <ul>
                <li><a href="configurator.php">DESIGN</a></li>
                <li><a href="contact.php">CONTACT</a></li>
                <li><a href="admin.php">ADMIN</a></li>
            </ul>
        </nav>
        <div class="nav-actions">
            <div class="cart-icon">
                <span style="font-size: 2rem;">🛒</span>
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

<main>
    <section class="hero">
        <div class="hero-content">
            <h1>Wear the<br>Exception.</h1>
            <p>Unapologetic shapes, harsh lines, premium quality fabric. Design your statement piece today.</p>
            <a href="configurator.php" class="btn">Start Designing</a>
        </div>
        <div class="hero-image brutal-box">
            <!-- Hero mockup image -->
            <img src="assets/img/product_1.png" alt="Neo Brutalist T-Shirt" />
        </div>
    </section>

    <section class="how-it-works-section" style="padding: 6rem 2rem; border-bottom: var(--border-width) solid var(--border-color); background-color: var(--accent-1); background-image: linear-gradient(var(--border-color) 1px, transparent 1px), linear-gradient(90deg, var(--border-color) 1px, transparent 1px); background-size: 50px 50px;">
        <div class="how-it-works-inner" style="background-color: #fff; padding: 4rem; max-width: 800px; margin: 0 auto; border: var(--border-width) solid var(--border-color); box-shadow: var(--shadow);">
            <h2 class="section-title" style="transform: none; margin-bottom: 2rem;">How It Works</h2>
            <ol style="font-size: 1.5rem; line-height: 2; padding-left: 2rem; font-weight: bold;">
                <li>Select a base template from our premium cut blanks.</li>
                <li>Upload your decal or graphic into the Studio.</li>
                <li>Drag, resize, and align your vision.</li>
                <li>We print and ship within 48 hours.</li>
            </ol>
        </div>
    </section>

    <section class="reviews-section" style="padding: 6rem 2rem; background-color: var(--text-color); color: #fff; border-bottom: var(--border-width) solid var(--border-color);">
        <h2 class="section-title" style="background-color: var(--accent-3); color: var(--text-color);">Customer Reviews</h2>
        <div class="grid">
            <div class="brutal-box" style="background-color: #fff; color: var(--text-color); padding: 2rem;">
                <p style="font-size: 1.2rem; margin-bottom: 1rem;">"The thickest collar I've ever felt. The blanks are insane quality."</p>
                <strong>- ALEX J.</strong>
            </div>
            <div class="brutal-box" style="background-color: #FAFAFA; color: var(--text-color); padding: 2rem; transform: rotate(2deg);">
                <p style="font-size: 1.2rem; margin-bottom: 1rem;">"Brutalism aesthetic translated perfectly to fabric. Fast shipping."</p>
                <strong>- SARAH M.</strong>
            </div>
            <div class="brutal-box" style="background-color: var(--accent-2); color: var(--text-color); padding: 2rem; transform: rotate(-2deg);">
                <p style="font-size: 1.2rem; margin-bottom: 1rem;">"Configurator is deeply satisfying to use. Love the results."</p>
                <strong>- DAMIAN R.</strong>
            </div>
        </div>
    </section>

    <section class="product-section">
        <h2 class="section-title">New Drops</h2>
        <div class="grid">
            <?php
            // Read products from json
            $productsJson = @file_get_contents('products.json');
            $products = $productsJson ? json_decode($productsJson, true) : [];
            
            if (!empty($products)) {
                foreach ($products as $product) {
                    echo '<article class="product-card">';
                    echo '<img src="' . htmlspecialchars($product['image']) . '" alt="' . htmlspecialchars($product['title']) . '" class="product-img">';
                    echo '<div class="product-info">';
                    echo '<h3 class="product-title">' . htmlspecialchars($product['title']) . '</h3>';
                    echo '<p style="margin-bottom: 1rem; font-size: 0.9rem;">' . htmlspecialchars($product['description']) . '</p>';
                    echo '<p class="product-price">$ ' . htmlspecialchars($product['price']) . '</p>';
                    echo '<button class="btn btn-secondary add-to-cart-btn">Add to Cart</button>';
                    echo '</div>';
                    echo '</article>';
                }
            } else {
                echo '<p style="font-weight: bold;">No products available yet. Check back soon.</p>';
            }
            ?>
        </div>
    </section>
</main>

<footer>
    <div class="footer-content">
        <div class="footer-col">
            <h4>PORTFOLIO SAMPLE</h4>
            <p>Unconventional apparel for the modern era.</p>
        </div>
        <div class="footer-col">
            <h4>Links</h4>
            <ul>
                <li><a href="#">TOS</a></li>
                <li><a href="#">Privacy Policy</a></li>
                <li><a href="contact.php">Contact Us</a></li>
            </ul>
        </div>
        <div class="footer-col">
            <h4>Social</h4>
            <ul>
                <li><a href="#">Instagram</a></li>
                <li><a href="#">Twitter/X</a></li>
                <li><a href="#">TikTok</a></li>
            </ul>
        </div>
        <div class="footer-col">
            <h4>Newsletter</h4>
            <div class="newsletter-form">
                <input type="email" placeholder="YOUR EMAIL" class="form-input">
                <button class="btn" style="padding: 1rem;">GO</button>
            </div>
        </div>
    </div>
    <div class="footer-bottom">
        <a href="slike/doflamingo.mp4" style="text-decoration: none; color: inherit;">&copy;</a> <?php echo date('Y'); ?> PORTFOLIO SAMPLE. ALL RIGHTS RESERVED.
    </div>
</footer>

<div id="toast-container"></div>
    <script src="app.js"></script>
    <script src="assets/js/mobile-nav.js" defer></script>
</body>
</html>
