(function () {
    'use strict';

    function closeMenu(toggle, nav) {
        if (!toggle || !nav) return;
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
    }

    function openMenu(toggle, nav) {
        if (!toggle || !nav) return;
        nav.classList.add('is-open');
        toggle.setAttribute('aria-expanded', 'true');
    }

    function init() {
        var toggle = document.getElementById('nav-toggle');
        var nav = document.getElementById('site-nav');
        if (!toggle || !nav) return;

        toggle.addEventListener('click', function (e) {
            e.stopPropagation();
            var expanded = toggle.getAttribute('aria-expanded') === 'true';
            if (expanded) {
                closeMenu(toggle, nav);
            } else {
                openMenu(toggle, nav);
            }
        });

        nav.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                closeMenu(toggle, nav);
            });
        });

        document.addEventListener('click', function (e) {
            if (!nav.classList.contains('is-open')) return;
            if (toggle.contains(e.target) || nav.contains(e.target)) return;
            closeMenu(toggle, nav);
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') closeMenu(toggle, nav);
        });

        window.addEventListener(
            'resize',
            function () {
                if (window.innerWidth > 768) closeMenu(toggle, nav);
            },
            { passive: true }
        );
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
