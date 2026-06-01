<?php
// Admin Login and Dashboard
session_start();

$error = '';
// Hardcoded authentication
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['login'])) {
    $username = $_POST['username'] ?? '';
    $password = $_POST['password'] ?? '';

    if ($username === 'user' && $password === 'user') {
        $_SESSION['authenticated'] = true;
        header('Location: admin.php');
        exit;
    } else {
        $error = 'INVALID CREDENTIALS';
    }
}

// Handle Add Product
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['add_product'])) {
    $productsStr = @file_get_contents('products.json');
    $products = $productsStr ? json_decode($productsStr, true) : [];
    
    $imagePath = 'assets/img/blank_tshirt.png';
    if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
        $tmpName = $_FILES['image']['tmp_name'];
        $fileName = basename($_FILES['image']['name']);
        $uniqueName = time() . '_' . $fileName;
        $destination = 'uploads/' . $uniqueName;
        
        if (move_uploaded_file($tmpName, $destination)) {
            $imagePath = $destination;
        }
    }

    $newProduct = [
        'id' => uniqid(),
        'title' => $_POST['title'] ?? '',
        'price' => $_POST['price'] ?? '',
        'description' => $_POST['description'] ?? '',
        'image' => $imagePath
    ];
    $products[] = $newProduct;
    file_put_contents('products.json', json_encode($products, JSON_PRETTY_PRINT));
    $_SESSION['success_msg'] = "PRODUCT ADDED";
    header('Location: admin.php');
    exit;
}

// Handle Delete Product
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['delete_product'])) {
    $deleteId = $_POST['product_id'] ?? '';
    $productsStr = @file_get_contents('products.json');
    $products = $productsStr ? json_decode($productsStr, true) : [];
    
    $filteredProducts = array_filter($products, function($p) use ($deleteId) {
        return $p['id'] !== $deleteId;
    });
    
    // Reset keys to maintain array structure in JSON
    $filteredProducts = array_values($filteredProducts);
    
    file_put_contents('products.json', json_encode($filteredProducts, JSON_PRETTY_PRINT));
    $_SESSION['success_msg'] = "PRODUCT DELETED";
    header('Location: admin.php');
    exit;
}

// Handle Logout
if (isset($_GET['logout'])) {
    session_destroy();
    header('Location: admin.php');
    exit;
}

$isAuthenticated = isset($_SESSION['authenticated']) && $_SESSION['authenticated'] === true;

// Retrieve and clear success message from session
$successMsg = $_SESSION['success_msg'] ?? '';
unset($_SESSION['success_msg']);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
    <title>Admin - Portfolio Sample</title>
    <meta name="robots" content="noindex, nofollow">
    <link rel="stylesheet" href="style.css">
    <link rel="stylesheet" href="assets/css/mobile.css" media="(max-width: 768px)">
</head>
<body style="background-color: <?php echo $isAuthenticated ? 'var(--bg-color)' : 'var(--accent-2)'; ?>;">
<div class="portfolio-ribbon">PORTFOLIO SAMPLE</div>
<div id="toast-container"></div>

<?php if (!$isAuthenticated): ?>
    <!-- Login Screen -->
    <div class="auth-wrapper">
        <div class="auth-form brutal-box">
            <h1 style="margin-bottom: 2rem; text-align: center;">ADMIN<br>ACCESS</h1>
            
            <?php if ($error): ?>
                <div style="background: var(--text-color); color: var(--accent-2); padding: 1rem; border: var(--border-width) solid var(--border-color); font-weight: bold; margin-bottom: 2rem; text-align: center;">
                    <?php echo htmlspecialchars($error); ?>
                </div>
            <?php endif; ?>

            <form method="POST" action="admin.php">
                <div class="form-group">
                    <label for="username">Username</label>
                    <input type="text" id="username" name="username" class="form-input" required>
                </div>
                <div class="form-group">
                    <label for="password">Password</label>
                    <input type="password" id="password" name="password" class="form-input" required>
                </div>
                <button type="submit" name="login" class="btn" style="width: 100%;">LOGIN</button>
            </form>
            <div style="margin-top: 2rem; text-align: center;">
                <a href="index.php" style="color: var(--text-color); font-weight: bold;">&larr; BACK TO SITE</a>
            </div>
        </div>
    </div>
<?php else: ?>
    <!-- Admin Dashboard -->
    <header class="admin-top-header" style="background: var(--text-color); color: #fff;">
        <div class="nav-container">
            <div class="logo" style="background: #fff; color: var(--text-color); font-weight:900; padding:0.3rem 0.8rem; border:var(--border-width) solid var(--border-color);">PORTFOLIO SYS</div>
            <nav id="site-nav" class="site-nav">
                <ul>
                    <li><a href="index.php" style="color: #fff;">LIVE SITE</a></li>
                    <li><a href="admin.php?logout=1" style="color: var(--accent-2);">LOGOUT</a></li>
                </ul>
            </nav>
            <div class="nav-actions">
                <button type="button" class="nav-toggle" id="nav-toggle" aria-controls="site-nav" aria-expanded="false" aria-label="Odpri meni">
                    <span class="nav-toggle-bar" aria-hidden="true"></span>
                    <span class="nav-toggle-bar" aria-hidden="true"></span>
                    <span class="nav-toggle-bar" aria-hidden="true"></span>
                </button>
            </div>
        </div>
    </header>

    <main class="admin-dashboard">
        <div class="admin-header">
            <h2>DASHBOARD</h2>
            <div>
                <?php if (!empty($successMsg)): ?>
                    <span style="background: var(--accent-3); color: var(--text-color); padding: 0.5rem 1rem; font-weight: bold; border: 2px solid var(--border-color); margin-right: 1rem;"><?php echo $successMsg; ?></span>
                <?php endif; ?>
                <button class="btn btn-secondary">SYSTEM DIAGNOSTICS</button>
            </div>
        </div>

        <div class="dashboard-grid">
            <!-- Add Product -->
            <div class="brutal-box" style="padding: 2rem;">
                <h3>ADD PRODUCT</h3>
                <form method="POST" action="admin.php" enctype="multipart/form-data" style="margin-top: 1.5rem;">
                    <div class="form-group">
                        <label>Title</label>
                        <input type="text" name="title" class="form-input" placeholder="Product Name" required>
                    </div>
                    <div class="form-group">
                        <label>Price</label>
                        <input type="number" name="price" class="form-input" placeholder="45.00" step="0.01" required>
                    </div>
                    <div class="form-group">
                        <label>Description</label>
                        <input type="text" name="description" class="form-input" placeholder="Short description" required>
                    </div>
                    <div class="form-group">
                        <label>Product Image</label>
                        <input type="file" name="image" class="form-input" accept="image/*" required>
                    </div>
                    <button type="submit" name="add_product" class="btn">SAVE PRODUCT</button>
                </form>
            </div>

            <!-- Manage Products -->
            <div class="brutal-box" style="padding: 2rem; background-color: var(--accent-1);">
                <h3>MANAGE PRODUCTS</h3>
                <div style="margin-top: 1.5rem; max-height: 400px; overflow-y: auto;">
                    <?php
                    $productsStr = @file_get_contents('products.json');
                    $productList = $productsStr ? json_decode($productsStr, true) : [];
                    
                    if (!empty($productList)) {
                        foreach ($productList as $p) {
                            echo '<div style="display: flex; justify-content: space-between; align-items: center; padding: 1rem; border-bottom: 2px dashed var(--border-color); background: #fff; margin-bottom: 0.5rem; border: 2px solid var(--border-color);">';
                            echo '<div>';
                            echo '<strong style="display:block;">' . htmlspecialchars($p['title']) . '</strong>';
                            echo '<span style="font-size:0.8rem; color: #555;">ID: ' . htmlspecialchars($p['id']) . '</span>';
                            echo '</div>';
                            echo '<form method="POST" action="admin.php" onsubmit="return confirm(\'Delete this item?\');">';
                            echo '<input type="hidden" name="product_id" value="' . htmlspecialchars($p['id']) . '">';
                            echo '<button type="submit" name="delete_product" class="btn btn-secondary" style="padding: 0.5rem 1rem; font-size: 0.8rem; background: #ff4d4d; color: #fff;">DELETE</button>';
                            echo '</form>';
                            echo '</div>';
                        }
                    } else {
                        echo '<p style="padding: 1rem; font-weight: bold;">No products in database.</p>';
                    }
                    ?>
                </div>
            </div>

            <!-- Discounts -->
            <div class="brutal-box" style="padding: 2rem; background-color: var(--accent-3);">
                <h3>DISCOUNT CODES</h3>
                <form style="margin-top: 1.5rem;" onsubmit="event.preventDefault(); alert('Code Generated!');">
                    <div class="form-group">
                        <label>Code Name</label>
                        <input type="text" class="form-input" placeholder="e.g., DROP20">
                    </div>
                    <div class="form-group">
                        <label>Discount %</label>
                        <input type="number" class="form-input" placeholder="20">
                    </div>
                    <button type="submit" class="btn btn-secondary">GENERATE</button>
                </form>
            </div>
        </div>
    </main>

    <footer style="margin-top: auto;">
        <div class="footer-bottom" style="background: var(--text-color); color: #fff; padding: 2rem; border-top: var(--border-width) solid var(--border-color);">
            &copy; <?php echo date('Y'); ?> Portfolio Sample Admin. SYSTEM SECURE.
        </div>
    </footer>
    <script src="app.js"></script>
    <script src="assets/js/mobile-nav.js" defer></script>
    <?php if (!empty($successMsg)): ?>
    <script>
        document.addEventListener('DOMContentLoaded', () => {
            if (typeof window.showToast === 'function') {
                window.showToast("Success: Product added to Demo Catalog", "success");
            }
        });
    </script>
    <?php endif; ?>
<?php endif; ?>
</body>
</html>
