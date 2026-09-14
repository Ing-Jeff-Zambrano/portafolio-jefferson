(function () {
    var overlay = document.getElementById('project-modal-overlay');
    var dialog = overlay ? overlay.querySelector('.modal') : null;
    var titleEl = document.getElementById('project-modal-title');
    var statusEl = overlay ? overlay.querySelector('.modal__status') : null;
    var bodyEl = overlay ? overlay.querySelector('.modal__body') : null;
    var tagsWrap = overlay ? overlay.querySelector('.modal__tags') : null;
    var tagsList = tagsWrap ? tagsWrap.querySelector('.tag-list') : null;
    var linksWrap = overlay ? overlay.querySelector('.modal__links') : null;
    var lastTrigger = null;
    var lastFocused = null;

    if (!overlay || !dialog || !titleEl || !statusEl || !bodyEl || !tagsWrap || !tagsList || !linksWrap) {
        return;
    }

    function textOf(el) {
        return el ? el.textContent.replace(/\s+/g, ' ').trim() : '';
    }

    function isExternalLink(href) {
        return href && href !== '#' && href !== '';
    }

    function readProject(card) {
        var title = textOf(card.querySelector('h3'));
        var statusNode = card.querySelector('.status-badge, .project-card__status');
        var status = textOf(statusNode);
        var statusKind = statusNode && statusNode.classList.contains('status-badge')
            ? 'badge'
            : 'text';

        var description = '';
        card.querySelectorAll(':scope > p').forEach(function (p) {
            if (!description && !p.classList.contains('project-card__status')) {
                description = textOf(p);
            }
        });

        var extras = [];
        var tags = [];

        card.querySelectorAll(':scope > div').forEach(function (block) {
            var list = block.querySelector('.tag-list');
            var label = block.querySelector('.project-card__label');

            if (list) {
                list.querySelectorAll('li').forEach(function (item) {
                    var value = textOf(item);
                    if (value) {
                        tags.push(value);
                    }
                });
                return;
            }

            if (!label) {
                return;
            }

            var extraText = [];
            block.querySelectorAll('p:not(.project-card__label)').forEach(function (p) {
                var value = textOf(p);
                if (value) {
                    extraText.push(value);
                }
            });

            if (extraText.length) {
                extras.push({
                    label: textOf(label),
                    text: extraText.join(' ')
                });
            }
        });

        var github = '';
        var demo = '';

        card.querySelectorAll('a[href]').forEach(function (link) {
            var href = link.getAttribute('href');
            var label = textOf(link).toLowerCase();

            if (!isExternalLink(href)) {
                return;
            }

            if (!github && (label.indexOf('github') !== -1 || href.indexOf('github.com') !== -1)) {
                github = href;
            } else if (!demo) {
                demo = href;
            }
        });

        return {
            title: title,
            status: status,
            statusKind: statusKind,
            description: description,
            extras: extras,
            tags: tags,
            github: github,
            demo: demo
        };
    }

    function fillModal(data) {
        titleEl.textContent = data.title;

        statusEl.textContent = data.status;
        statusEl.hidden = !data.status;
        statusEl.className = data.statusKind === 'badge'
            ? 'modal__status status-badge'
            : 'modal__status project-card__status';

        bodyEl.innerHTML = '';

        if (data.description) {
            var description = document.createElement('p');
            description.textContent = data.description;
            bodyEl.appendChild(description);
        }

        data.extras.forEach(function (extra) {
            var block = document.createElement('div');
            var label = document.createElement('p');
            var text = document.createElement('p');

            label.className = 'project-card__label';
            label.textContent = extra.label;
            text.textContent = extra.text;

            block.appendChild(label);
            block.appendChild(text);
            bodyEl.appendChild(block);
        });

        tagsList.innerHTML = '';
        data.tags.forEach(function (tag) {
            var item = document.createElement('li');
            item.textContent = tag;
            tagsList.appendChild(item);
        });
        tagsWrap.hidden = data.tags.length === 0;

        linksWrap.innerHTML = '';

        if (data.github) {
            var githubLink = document.createElement('a');
            githubLink.className = 'button button--secondary';
            githubLink.href = data.github;
            githubLink.target = '_blank';
            githubLink.rel = 'noopener noreferrer';
            githubLink.textContent = 'GitHub';
            linksWrap.appendChild(githubLink);
        }

        if (data.demo) {
            var demoLink = document.createElement('a');
            demoLink.className = 'button button--primary';
            demoLink.href = data.demo;
            demoLink.target = '_blank';
            demoLink.rel = 'noopener noreferrer';
            demoLink.textContent = 'Ver demo';
            linksWrap.appendChild(demoLink);
        }

        linksWrap.hidden = linksWrap.childElementCount === 0;
    }

    function getFocusable() {
        return Array.prototype.slice.call(
            dialog.querySelectorAll(
                'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
            )
        ).filter(function (el) {
            return !el.closest('[hidden]') && el.getClientRects().length > 0;
        });
    }

    function setBackgroundInert(inert) {
        document.querySelectorAll('body > header, body > main, body > footer').forEach(function (el) {
            if (inert) {
                el.setAttribute('inert', '');
            } else {
                el.removeAttribute('inert');
            }
        });
    }

    function openModal(card, trigger) {
        fillModal(readProject(card));
        lastTrigger = trigger;
        lastFocused = document.activeElement;
        overlay.classList.add('is-open');
        document.body.style.overflow = 'hidden';
        setBackgroundInert(true);
        dialog.focus();
    }

    function closeModal() {
        if (!overlay.classList.contains('is-open')) {
            return;
        }

        overlay.classList.remove('is-open');
        document.body.style.overflow = '';
        setBackgroundInert(false);

        var restore = lastTrigger || lastFocused;
        if (restore && typeof restore.focus === 'function') {
            restore.focus();
        }
    }

    function isOpen() {
        return overlay.classList.contains('is-open');
    }

    document.querySelectorAll('.project-card__details').forEach(function (button) {
        button.addEventListener('click', function () {
            var card = button.closest('.project-card');
            if (!card) {
                return;
            }
            openModal(card, button);
        });
    });

    overlay.addEventListener('click', function (event) {
        if (event.target === overlay || event.target.closest('[data-modal-close]')) {
            closeModal();
        }
    });

    document.addEventListener('keydown', function (event) {
        if (!isOpen()) {
            return;
        }

        if (event.key === 'Escape') {
            event.preventDefault();
            closeModal();
            return;
        }

        if (event.key !== 'Tab') {
            return;
        }

        var focusable = getFocusable();
        if (!focusable.length) {
            event.preventDefault();
            dialog.focus();
            return;
        }

        var first = focusable[0];
        var last = focusable[focusable.length - 1];
        var active = document.activeElement;

        if (event.shiftKey && (active === first || !dialog.contains(active))) {
            event.preventDefault();
            last.focus();
        } else if (!event.shiftKey && (active === last || !dialog.contains(active))) {
            event.preventDefault();
            first.focus();
        }
    });
})();
