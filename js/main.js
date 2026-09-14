(function () {
    var navToggle = document.querySelector('.nav-toggle');
    var navLinks = document.getElementById('nav-links');
    var desktopQuery = window.matchMedia('(min-width: 1025px)');

    if (!navToggle || !navLinks) {
        return;
    }

    function isMenuOpen() {
        return navToggle.getAttribute('aria-expanded') === 'true';
    }

    function setMenuOpen(open) {
        navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        navToggle.setAttribute(
            'aria-label',
            open ? 'Cerrar menú de navegación' : 'Abrir menú de navegación'
        );
    }

    function closeMenu() {
        if (isMenuOpen()) {
            setMenuOpen(false);
        }
    }

    navToggle.addEventListener('click', function () {
        setMenuOpen(!isMenuOpen());
    });

    navLinks.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') {
            closeMenu();
        }
    });

    function handleViewportChange(event) {
        if (event.matches) {
            closeMenu();
        }
    }

    if (desktopQuery.addEventListener) {
        desktopQuery.addEventListener('change', handleViewportChange);
    } else if (desktopQuery.addListener) {
        desktopQuery.addListener(handleViewportChange);
    }
})();
