(function () {
    var STORAGE_KEY = 'portfolio-theme';
    var root = document.documentElement;
    var themeToggle = null;
    var systemSchemeQuery = window.matchMedia('(prefers-color-scheme: dark)');

    function getStoredTheme() {
        var stored = localStorage.getItem(STORAGE_KEY);

        if (stored === 'light' || stored === 'dark') {
            return stored;
        }

        return null;
    }

    function getPreferredTheme() {
        var stored = getStoredTheme();

        if (stored) {
            return stored;
        }

        if (systemSchemeQuery.matches) {
            return 'dark';
        }

        return 'light';
    }

    function applyTheme(theme) {
        root.setAttribute('data-theme', theme);
        updateThemeToggle(theme);
    }

    function updateThemeToggle(theme) {
        if (!themeToggle) {
            return;
        }

        var nextTheme = theme === 'dark' ? 'claro' : 'oscuro';
        themeToggle.setAttribute('aria-label', 'Cambiar a tema ' + nextTheme);
    }

    function toggleTheme() {
        var nextTheme = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';

        localStorage.setItem(STORAGE_KEY, nextTheme);
        applyTheme(nextTheme);
    }

    function handleSystemThemeChange(event) {
        if (getStoredTheme()) {
            return;
        }

        applyTheme(event.matches ? 'dark' : 'light');
    }

    applyTheme(getPreferredTheme());

    function initThemeToggle() {
        themeToggle = document.querySelector('.theme-toggle');

        if (!themeToggle) {
            return;
        }

        updateThemeToggle(root.getAttribute('data-theme') || getPreferredTheme());
        themeToggle.addEventListener('click', toggleTheme);
    }

    if (systemSchemeQuery.addEventListener) {
        systemSchemeQuery.addEventListener('change', handleSystemThemeChange);
    } else if (systemSchemeQuery.addListener) {
        systemSchemeQuery.addListener(handleSystemThemeChange);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initThemeToggle);
    } else {
        initThemeToggle();
    }
})();
