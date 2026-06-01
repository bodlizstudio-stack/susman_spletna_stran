document.addEventListener('DOMContentLoaded', () => {
    
    // Global Cart Badge Logic
    const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');
    const cartBadge = document.getElementById('cart-badge');
    
    if (addToCartBtns && cartBadge) {
        addToCartBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                // Simple animation on button
                const originalText = btn.innerText;
                btn.innerText = "ADDED!";
                btn.style.backgroundColor = "var(--accent-3)";
                
                // Increment badge
                let count = parseInt(cartBadge.innerText);
                count += 1;
                cartBadge.innerText = count;
                
                // Pop animation on badge
                cartBadge.style.transform = "scale(1.5)";
                setTimeout(() => {
                    cartBadge.style.transform = "scale(1)";
                }, 200);

                setTimeout(() => {
                    btn.innerText = originalText;
                    btn.style.backgroundColor = "";
                }, 1000);
            });
        });
    }

    // Configurator Logic
    const colorBtns = document.querySelectorAll('.color-btn');
    const sizeBtns = document.querySelectorAll('.size-btn');
    const mockupImg = document.getElementById('tshirt-mockup-img');
    const configForm = document.getElementById('config-form');
    
    if (mockupImg && configForm) {
        // Handle color selection (We will use CSS filters to tint the image for demonstration)
        // Or if we have separate colored images, we switch the src. Let's use filter for a white base image.
        colorBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all
                colorBtns.forEach(b => b.classList.remove('active'));
                // Add active class to clicked
                btn.classList.add('active');
                
                // Apply a simple CSS filter based on the data-color attribute or inline background color
                // This is a naive approach; in a real app, you'd swap PNGs. But for custom hex, filters or SVG is needed.
                const color = btn.style.backgroundColor;
                document.getElementById('selected-color').value = color;
                
                // Extremely simple tint using mix-blend-mode or filter. Let's just set the background of the mockup container
                // Assuming mockupImg is a transparent PNG of a white shirt.
                mockupImg.style.backgroundColor = color;
            });
        });

        // Handle size selection
        sizeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                sizeBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                document.getElementById('selected-size').value = btn.dataset.size;
            });
        });

        // Custom Logo Upload Logic
        const logoUpload = document.getElementById('logo-upload');
        const dragContainer = document.getElementById('drag-container');
        const customLogo = document.getElementById('custom-logo');
        const resizeHandle = document.getElementById('resize-handle');
        const deleteLogo = document.getElementById('delete-logo');

        if (logoUpload && dragContainer && customLogo) {
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

            // Drag Functionality for the custom image container
            let isDragging = false;
            let startX, startY;
            
            dragContainer.addEventListener('mousedown', function(e) {
                // Prevent drag if clicking on the resize handle or delete btn
                if (e.target === resizeHandle || e.target === deleteLogo) return;
                isDragging = true;
                startX = e.clientX - dragContainer.offsetLeft;
                startY = e.clientY - dragContainer.offsetTop;
                e.preventDefault(); // prevent native image dragging
            });

            document.addEventListener('mousemove', function(e) {
                if (isDragging) {
                    const currentX = e.clientX - startX;
                    const currentY = e.clientY - startY;
                    dragContainer.style.left = currentX + 'px';
                    dragContainer.style.top = currentY + 'px';
                }
            });

            document.addEventListener('mouseup', function() {
                isDragging = false;
                isResizing = false;
            });

            // Resize Functionality
            let isResizing = false;
            let startWidth, startHeight, startMouseX, startMouseY;
            
            resizeHandle.addEventListener('mousedown', function(e) {
                isResizing = true;
                startWidth = parseInt(document.defaultView.getComputedStyle(dragContainer).width, 10);
                startHeight = parseInt(document.defaultView.getComputedStyle(dragContainer).height, 10);
                startMouseX = e.clientX;
                startMouseY = e.clientY;
                e.preventDefault();
                e.stopPropagation(); // prevent dragging container
            });

            document.addEventListener('mousemove', function(e) {
                if (isResizing) {
                    const width = startWidth + (e.clientX - startMouseX);
                    const height = startHeight + (e.clientY - startMouseY);
                    if (width > 30 && height > 30) { // Min sizes
                        dragContainer.style.width = width + 'px';
                        dragContainer.style.height = height + 'px';
                    }
                }
            });
        }
    }
});
