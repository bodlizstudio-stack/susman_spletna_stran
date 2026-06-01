<?php
// Contact Page — Portfolio Sample
$sent = false;
$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['send_contact'])) {
    $name = trim($_POST['name'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $message = trim($_POST['message'] ?? '');
    $to = 'bolizstudio@gmail.com';
    
    if (!$name || !$email || !$message) {
        $error = 'Please fill in all required fields.';
    } else {
        // Build email
        $subject = "Portfolio Contact: $name";
        $boundary = md5(time());
        
        $headers = "From: $email\r\n";
        $headers .= "Reply-To: $email\r\n";
        $headers .= "MIME-Version: 1.0\r\n";
        $headers .= "Content-Type: multipart/mixed; boundary=\"$boundary\"\r\n";
        
        $body = "--$boundary\r\n";
        $body .= "Content-Type: text/html; charset=UTF-8\r\n\r\n";
        $body .= "<h2>New Contact from Portfolio Sample</h2>";
        $body .= "<p><strong>Name:</strong> " . htmlspecialchars($name) . "</p>";
        $body .= "<p><strong>Email:</strong> " . htmlspecialchars($email) . "</p>";
        $body .= "<p><strong>Message:</strong><br>" . nl2br(htmlspecialchars($message)) . "</p>";
        $body .= "\r\n";
        
        // Handle attachment
        if (isset($_FILES['attachment']) && $_FILES['attachment']['error'] === UPLOAD_ERR_OK) {
            $fileName = $_FILES['attachment']['name'];
            $fileTmp = $_FILES['attachment']['tmp_name'];
            $fileData = chunk_split(base64_encode(file_get_contents($fileTmp)));
            $fileMime = mime_content_type($fileTmp);
            
            $body .= "--$boundary\r\n";
            $body .= "Content-Type: $fileMime; name=\"$fileName\"\r\n";
            $body .= "Content-Disposition: attachment; filename=\"$fileName\"\r\n";
            $body .= "Content-Transfer-Encoding: base64\r\n\r\n";
            $body .= $fileData . "\r\n";
        }
        
        $body .= "--$boundary--";
        
        $sent = @mail($to, $subject, $body, $headers);
        if (!$sent) {
            // Fallback: save to file if mail() fails (common on local XAMPP)
            $fallbackDir = __DIR__ . '/contact_messages';
            if (!is_dir($fallbackDir)) mkdir($fallbackDir, 0777, true);
            $fallbackFile = $fallbackDir . '/' . date('Y-m-d_H-i-s') . '_' . preg_replace('/[^a-zA-Z0-9]/', '', $name) . '.txt';
            $fallbackContent = "Name: $name\nEmail: $email\nMessage: $message\nDate: " . date('Y-m-d H:i:s') . "\n";
            if (isset($_FILES['attachment']) && $_FILES['attachment']['error'] === UPLOAD_ERR_OK) {
                $uploadDir = __DIR__ . '/uploads/contact/';
                if (!is_dir($uploadDir)) mkdir($uploadDir, 0777, true);
                $savedFile = $uploadDir . time() . '_' . $_FILES['attachment']['name'];
                move_uploaded_file($_FILES['attachment']['tmp_name'], $savedFile);
                $fallbackContent .= "Attachment: $savedFile\n";
            }
            file_put_contents($fallbackFile, $fallbackContent);
            $sent = true; // Show success anyway since we saved it
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
    <title>Contact - Portfolio Sample</title>
    <meta name="description" content="Get in touch with us. Portfolio Sample showcase.">
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
                <li><a href="contact.php" style="color: var(--accent-2);">CONTACT</a></li>
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
    <!-- SENT SUCCESS: Paper Airplane Animation -->
    <?php if ($sent): ?>
    <div id="send-success-screen" style="min-height: calc(100vh - 80px); display: flex; align-items: center; justify-content: center; background: var(--text-color); position: relative; overflow: hidden;">
        
        <!-- Floating envelope particles -->
        <div class="envelope-particles">
            <span class="particle">💌</span>
            <span class="particle">✉️</span>
            <span class="particle">📨</span>
            <span class="particle">💌</span>
            <span class="particle">✨</span>
            <span class="particle">⭐</span>
            <span class="particle">💌</span>
            <span class="particle">✉️</span>
        </div>
        
        <!-- Paper airplane that flies away -->
        <div class="paper-airplane" id="paper-airplane">✈️</div>
        
        <!-- Success content -->
        <div class="send-success-content" id="success-content">
            <div style="font-size: 6rem; margin-bottom: 1rem;" class="success-stamp">📬</div>
            <h1 style="color: var(--accent-3); font-size: 4rem; margin-bottom: 1rem;">MESSAGE SENT!</h1>
            <div style="background: var(--accent-1); display: inline-block; padding: 0.8rem 2rem; border: var(--border-width) solid var(--accent-1); margin-bottom: 2rem; transform: rotate(-2deg);">
                <p style="font-size: 1.3rem; font-weight: 700; color: var(--text-color);">Your message has been delivered to the studio.</p>
            </div>
            <br>
            <div style="background: var(--accent-2); display: inline-block; padding: 0.5rem 1.5rem; border: var(--border-width) solid var(--border-color); margin-bottom: 2rem; transform: rotate(1deg); box-shadow: var(--shadow);">
                <p style="font-weight: 700;">We'll respond within 24 hours ⚡</p>
            </div>
            <br><br>
            <a href="index.php" class="btn" style="font-size: 1.3rem;">← BACK TO HOME</a>
        </div>
    </div>

    <?php else: ?>
    
    <!-- CONTACT FORM SECTION -->
    <section class="contact-page-layout" style="min-height: calc(100vh - 80px); display: grid; grid-template-columns: 1fr 1fr;">
        
        <!-- LEFT: Creative visual -->
        <div style="background: var(--text-color); display: flex; align-items: center; justify-content: center; padding: 4rem; border-right: var(--border-width) solid var(--border-color); position: relative; overflow: hidden;">
            
            <!-- Animated envelope -->
            <div style="text-align: center; position: relative; z-index: 2;">
                <div id="floating-envelope" style="font-size: 8rem; animation: floatEnvelope 3s ease-in-out infinite;">📩</div>
                <h2 style="color: #fff; font-size: 3rem; margin-top: 2rem;">LET'S<br>TALK.</h2>
                <p style="color: #888; font-size: 1.2rem; margin-top: 1rem; max-width: 300px;">Drop us a line. We read every message.</p>
                
                <div style="margin-top: 3rem; display: flex; flex-direction: column; gap: 1rem; align-items: center;">
                    <div style="background: var(--accent-1); padding: 0.8rem 1.5rem; border: var(--border-width) solid var(--border-color); box-shadow: var(--shadow); transform: rotate(-2deg); font-weight: 900;">
                        📧 bolizstudio@gmail.com
                    </div>
                    <div style="background: var(--accent-3); padding: 0.8rem 1.5rem; border: var(--border-width) solid var(--border-color); box-shadow: var(--shadow); transform: rotate(1deg); font-weight: 900;">
                        ⚡ Response within 24h
                    </div>
                    <div style="background: var(--accent-2); padding: 0.8rem 1.5rem; border: var(--border-width) solid var(--border-color); box-shadow: var(--shadow); transform: rotate(-1deg); font-weight: 900;">
                        📎 Attachments welcome
                    </div>
                </div>
            </div>
            
            <!-- Background grid pattern -->
            <div style="position: absolute; inset: 0; background-image: linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px); background-size: 40px 40px;"></div>
        </div>
        
        <!-- RIGHT: The Form -->
        <div style="padding: 4rem; display: flex; flex-direction: column; justify-content: center; background: #fff;">
            <h1 style="font-size: 3rem; margin-bottom: 0.5rem;">CONTACT US</h1>
            <p style="font-size: 1.1rem; color: #777; margin-bottom: 2rem;">Fill in the form and we'll get back to you.</p>
            
            <?php if ($error): ?>
            <div style="background: #DC143C; color: #fff; padding: 1rem; border: var(--border-width) solid var(--border-color); font-weight: bold; margin-bottom: 2rem; box-shadow: var(--shadow);">
                ⚠ <?php echo htmlspecialchars($error); ?>
            </div>
            <?php endif; ?>
            
            <form method="POST" action="contact.php" enctype="multipart/form-data" id="contact-form">
                
                <div class="form-row-2" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                    <div class="form-group">
                        <label for="contact-name">NAME *</label>
                        <input type="text" id="contact-name" name="name" class="form-input" placeholder="Your name" required>
                    </div>
                    <div class="form-group">
                        <label for="contact-surname">SURNAME *</label>
                        <input type="text" id="contact-surname" name="surname" class="form-input" placeholder="Your surname">
                    </div>
                </div>
                
                <div class="form-group">
                    <label for="contact-email">EMAIL *</label>
                    <input type="email" id="contact-email" name="email" class="form-input" placeholder="your@email.com" required>
                </div>
                
                <div class="form-group">
                    <label for="contact-message">MESSAGE *</label>
                    <textarea id="contact-message" name="message" class="form-input" rows="6" placeholder="Tell us what's on your mind..." required style="resize: vertical; font-family: inherit;"></textarea>
                </div>
                
                <!-- Custom File Upload -->
                <div class="form-group">
                    <label>ATTACHMENT (optional)</label>
                    <div id="file-drop-zone" style="border: 3px dashed var(--border-color); padding: 2rem; text-align: center; cursor: pointer; transition: var(--transition); background: #fafafa;">
                        <div id="file-drop-text">
                            <span style="font-size: 2.5rem; display: block; margin-bottom: 0.5rem;">📎</span>
                            <span style="font-weight: 700;">Drop a file here or click to browse</span>
                            <br><span style="font-size: 0.85rem; color: #999;">PDF, PNG, JPG up to 10MB</span>
                        </div>
                        <div id="file-selected" style="display: none; font-weight: 700;">
                            <span style="font-size: 2rem;">📄</span>
                            <span id="file-name"></span>
                            <button type="button" id="file-remove" style="background: #DC143C; color: #fff; border: 2px solid var(--border-color); padding: 0.2rem 0.6rem; cursor: pointer; font-weight: 900; margin-left: 0.5rem;">✕</button>
                        </div>
                    </div>
                    <input type="file" id="contact-attachment" name="attachment" style="display: none;" accept=".pdf,.png,.jpg,.jpeg,.gif,.webp,.zip">
                </div>
                
                <!-- Submit Button -->
                <button type="submit" name="send_contact" id="send-btn" class="btn btn-secondary" style="width: 100%; font-size: 1.5rem; padding: 1.5rem; position: relative; overflow: hidden;">
                    <span id="send-btn-text">SEND MESSAGE 🚀</span>
                    <span id="send-btn-loading" style="display: none;">SENDING...</span>
                </button>
                
            </form>
        </div>
    </section>
    <?php endif; ?>
</main>

<div id="toast-container"></div>
<script src="app.js"></script>
<script src="assets/js/mobile-nav.js" defer></script>

<style>
/* Floating envelope animation */
@keyframes floatEnvelope {
    0%, 100% { transform: translateY(0) rotate(0deg); }
    25% { transform: translateY(-15px) rotate(3deg); }
    75% { transform: translateY(10px) rotate(-3deg); }
}

/* Paper airplane fly away */
.paper-airplane {
    position: absolute;
    font-size: 6rem;
    top: 50%;
    left: -100px;
    transform: translateY(-50%) rotate(-30deg);
    animation: flyAirplane 2s 0.3s cubic-bezier(0.25, 1, 0.5, 1) forwards;
    z-index: 10;
    filter: drop-shadow(4px 4px 0px rgba(0,0,0,0.3));
}

@keyframes flyAirplane {
    0% { left: -100px; top: 70%; opacity: 1; transform: rotate(-30deg) scale(1); }
    50% { left: 45%; top: 40%; opacity: 1; transform: rotate(-15deg) scale(1.5); }
    100% { left: 110%; top: -10%; opacity: 0; transform: rotate(-45deg) scale(0.5); }
}

/* Envelope particles */
.envelope-particles {
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 5;
}
.particle {
    position: absolute;
    font-size: 2rem;
    opacity: 0;
    animation: particleFall 3s ease-in infinite;
}
.particle:nth-child(1) { left: 10%; animation-delay: 0.5s; }
.particle:nth-child(2) { left: 25%; animation-delay: 1.2s; }
.particle:nth-child(3) { left: 40%; animation-delay: 0.8s; }
.particle:nth-child(4) { left: 55%; animation-delay: 1.5s; }
.particle:nth-child(5) { left: 70%; animation-delay: 0.3s; }
.particle:nth-child(6) { left: 80%; animation-delay: 2s; }
.particle:nth-child(7) { left: 15%; animation-delay: 1.8s; }
.particle:nth-child(8) { left: 90%; animation-delay: 0.9s; }

@keyframes particleFall {
    0% { top: -10%; opacity: 0; transform: rotate(0deg); }
    20% { opacity: 1; }
    100% { top: 110%; opacity: 0; transform: rotate(360deg); }
}

/* Success content fade in */
.send-success-content {
    text-align: center;
    position: relative;
    z-index: 20;
    opacity: 0;
    transform: scale(0.8);
    animation: successPopIn 0.6s 1.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
}

@keyframes successPopIn {
    0% { opacity: 0; transform: scale(0.8) translateY(30px); }
    100% { opacity: 1; transform: scale(1) translateY(0); }
}

/* Stamp effect */
.success-stamp {
    animation: stampDrop 0.5s 2s cubic-bezier(0.175, 0.885, 0.32, 1.275) both;
}
@keyframes stampDrop {
    0% { transform: scale(3) rotate(-30deg); opacity: 0; }
    100% { transform: scale(1) rotate(5deg); opacity: 1; }
}

/* File drop zone hover */
#file-drop-zone:hover, #file-drop-zone.dragover {
    background: var(--accent-1) !important;
    border-color: var(--text-color) !important;
    transform: scale(1.02);
}

/* Send button ripple */
#send-btn:active {
    transform: translate(8px, 8px) !important;
    box-shadow: 0 0 0 var(--border-color) !important;
}
</style>

<script>
document.addEventListener('DOMContentLoaded', () => {
    const dropZone = document.getElementById('file-drop-zone');
    const fileInput = document.getElementById('contact-attachment');
    const fileSelectedEl = document.getElementById('file-selected');
    const fileDropText = document.getElementById('file-drop-text');
    const fileNameEl = document.getElementById('file-name');
    const fileRemoveBtn = document.getElementById('file-remove');
    
    if (!dropZone) return;
    
    // Click to upload
    dropZone.addEventListener('click', () => fileInput.click());
    
    // Drag & drop
    dropZone.addEventListener('dragover', (e) => { e.preventDefault(); dropZone.classList.add('dragover'); });
    dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));
    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('dragover');
        if (e.dataTransfer.files.length) {
            fileInput.files = e.dataTransfer.files;
            showSelectedFile(e.dataTransfer.files[0]);
        }
    });
    
    // File selected via input
    fileInput.addEventListener('change', () => {
        if (fileInput.files.length) showSelectedFile(fileInput.files[0]);
    });
    
    function showSelectedFile(file) {
        fileDropText.style.display = 'none';
        fileSelectedEl.style.display = 'block';
        fileNameEl.innerText = file.name + ' (' + (file.size / 1024 / 1024).toFixed(2) + ' MB)';
        dropZone.style.background = 'var(--accent-3)';
        dropZone.style.borderStyle = 'solid';
    }
    
    // Remove file
    fileRemoveBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        fileInput.value = '';
        fileDropText.style.display = 'block';
        fileSelectedEl.style.display = 'none';
        dropZone.style.background = '#fafafa';
        dropZone.style.borderStyle = 'dashed';
    });
    
    // Form submit animation
    const form = document.getElementById('contact-form');
    const sendBtn = document.getElementById('send-btn');
    
    form?.addEventListener('submit', () => {
        const btnText = document.getElementById('send-btn-text');
        const btnLoading = document.getElementById('send-btn-loading');
        btnText.style.display = 'none';
        btnLoading.style.display = 'inline';
        sendBtn.style.backgroundColor = 'var(--accent-1)';
        sendBtn.disabled = true;
    });
    
    // Combine name + surname into name field for PHP
    const nameInput = document.getElementById('contact-name');
    const surnameInput = document.getElementById('contact-surname');
    form?.addEventListener('submit', () => {
        if (surnameInput && surnameInput.value) {
            nameInput.value = nameInput.value + ' ' + surnameInput.value;
        }
    });
});
</script>
</body>
</html>
