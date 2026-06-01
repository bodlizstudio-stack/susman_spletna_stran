<?php
// Checkout Page
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
    <title>Checkout - Portfolio Sample</title>
    <meta name="description" content="Complete your order. Portfolio Sample showcase.">
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
                <li><a href="index.php">SHOP</a></li>
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
    <div class="checkout-layout">
        <!-- LEFT: Form -->
        <section class="checkout-form-section">
            <h1 style="margin-bottom: 2rem;">CHECKOUT</h1>
            
            <form id="checkout-form">
                <h3 style="margin-bottom: 1.5rem; background: var(--accent-3); display: inline-block; padding: 0.3rem 1rem; border: var(--border-width) solid var(--border-color);">SHIPPING INFO</h3>
                
                <div class="form-group">
                    <label for="checkout-name">Full Name</label>
                    <input type="text" id="checkout-name" class="form-input" placeholder="John Doe" required>
                </div>
                
                <div class="form-group">
                    <label for="checkout-email">Email</label>
                    <input type="email" id="checkout-email" class="form-input" placeholder="john@example.com" required>
                </div>
                
                <div class="form-group">
                    <label for="checkout-address">Address</label>
                    <input type="text" id="checkout-address" class="form-input" placeholder="123 Street, City" required>
                </div>
                
                <div class="form-row-2" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                    <div class="form-group">
                        <label for="checkout-city">City</label>
                        <input type="text" id="checkout-city" class="form-input" placeholder="Ljubljana" required>
                    </div>
                    <div class="form-group">
                        <label for="checkout-zip">ZIP Code</label>
                        <input type="text" id="checkout-zip" class="form-input" placeholder="1000" required>
                    </div>
                </div>

                <h3 style="margin: 2rem 0 1.5rem; background: var(--accent-2); display: inline-block; padding: 0.3rem 1rem; border: var(--border-width) solid var(--border-color);">PAYMENT</h3>
                
                <div class="form-group">
                    <label for="checkout-card">Card Number</label>
                    <input type="text" id="checkout-card" class="form-input" placeholder="4242 4242 4242 4242" maxlength="19" required>
                </div>
                
                <div class="form-row-2" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                    <div class="form-group">
                        <label for="checkout-exp">Expiry</label>
                        <input type="text" id="checkout-exp" class="form-input" placeholder="MM/YY" maxlength="5" required>
                    </div>
                    <div class="form-group">
                        <label for="checkout-cvv">CVV</label>
                        <input type="text" id="checkout-cvv" class="form-input" placeholder="123" maxlength="4" required>
                    </div>
                </div>

                <button type="submit" id="place-order-btn" class="btn btn-secondary" style="width: 100%; font-size: 1.5rem; padding: 1.5rem; margin-top: 1rem;">
                    PLACE ORDER →
                </button>
            </form>
        </section>

        <!-- RIGHT: Order Summary -->
        <section class="checkout-summary-section">
            <h2 style="margin-bottom: 2rem;">ORDER SUMMARY</h2>
            
            <div id="checkout-items">
                <!-- Populated by JS -->
            </div>
            
            <div class="checkout-grand-total">
                <span>TOTAL</span>
                <span id="checkout-total">$0.00</span>
            </div>
            
            <div style="margin-top: 2rem; padding: 1.5rem; background: #fff; border: var(--border-width) solid var(--border-color); box-shadow: var(--shadow);">
                <p style="font-weight: 700; margin-bottom: 0.5rem;">📦 FREE SHIPPING</p>
                <p style="font-size: 0.9rem; color: #555;">Estimated delivery: 3-5 business days</p>
            </div>

            <div style="margin-top: 1.5rem; padding: 1.5rem; background: var(--accent-3); border: var(--border-width) solid var(--border-color); box-shadow: var(--shadow);">
                <p style="font-weight: 900; text-align: center;">⚠️ DEMO ONLY — NO REAL CHARGES</p>
            </div>
        </section>
    </div>
    
    <!-- Order Confirmation Modal -->
    <div id="order-confirm-modal" style="display:none; position:fixed; top:0; left:0; width:100vw; height:100vh; background:rgba(18,18,18,0.8); z-index:99999; display:none; align-items:center; justify-content:center;">
        <div style="background:#fff; padding:4rem; border:var(--border-width) solid var(--border-color); box-shadow:16px 16px 0px var(--accent-2); max-width:600px; text-align:center;">
            <div style="font-size:5rem; margin-bottom:1rem;">🎉</div>
            <h1 style="margin-bottom:1rem;">ORDER PLACED!</h1>
            <p style="font-size:1.3rem; margin-bottom:0.5rem;">Thank you for your demo purchase.</p>
            <p style="font-size:1rem; color:#777; margin-bottom:2rem;">Order #<span id="order-number"></span></p>
            <p style="font-size:0.9rem; color:#999; margin-bottom:2rem;">This is a portfolio demo — no real payment was processed.</p>
            <a href="index.php" class="btn" style="display:inline-block;">← BACK TO HOME</a>
        </div>
    </div>
</main>

<div id="toast-container"></div>
<script src="app.js"></script>
<script src="assets/js/mobile-nav.js" defer></script>
<script>
document.addEventListener('DOMContentLoaded', () => {
    const cart = window.portfolioCart;
    if (!cart) return;
    
    const itemsEl = document.getElementById('checkout-items');
    const totalEl = document.getElementById('checkout-total');
    
    if (cart.items.length === 0) {
        itemsEl.innerHTML = '<p style="font-weight:700; padding:2rem 0;">Your cart is empty. <a href="index.php" style="color:var(--text-color);">Go shopping →</a></p>';
    } else {
        itemsEl.innerHTML = cart.items.map(item => `
            <div class="checkout-summary-item">
                <span>${item.title} (${item.size})</span>
                <span>$${item.price.toFixed(2)}</span>
            </div>
        `).join('');
    }
    
    totalEl.innerText = `$${cart.getTotal()}`;
    
    // Handle form submission
    const form = document.getElementById('checkout-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Generate fake order number
        const orderNum = 'PS-' + Date.now().toString(36).toUpperCase();
        document.getElementById('order-number').innerText = orderNum;
        
        // Clear cart
        cart.items = [];
        cart.save();
        cart.updateBadge();
        
        // Show confirmation modal
        const modal = document.getElementById('order-confirm-modal');
        modal.style.display = 'flex';
        
        window.showToast('Order placed successfully!', 'success');
    });
});
</script>
</body>
</html>
