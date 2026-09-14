(function () {
    var form = document.querySelector('.contact-form');

    if (!form) {
        return;
    }

    var fields = {
        nombre: {
            input: document.getElementById('nombre'),
            error: document.getElementById('error-nombre'),
            validate: function (value) {
                if (!value) {
                    return 'Ingresa tu nombre.';
                }
                if (value.length < 2) {
                    return 'Ingresa tu nombre.';
                }
                return '';
            }
        },
        correo: {
            input: document.getElementById('correo'),
            error: document.getElementById('error-correo'),
            validate: function (value) {
                if (!value) {
                    return 'Ingresa un correo válido.';
                }
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                    return 'Ingresa un correo válido.';
                }
                return '';
            }
        },
        mensaje: {
            input: document.getElementById('mensaje'),
            error: document.getElementById('error-mensaje'),
            validate: function (value) {
                if (!value) {
                    return 'Escribe un mensaje.';
                }
                if (value.length < 10) {
                    return 'Escribe un mensaje.';
                }
                return '';
            }
        }
    };

    var success = form.querySelector('.form-success');
    var touchedWithError = {};

    if (!fields.nombre.input || !fields.correo.input || !fields.mensaje.input) {
        return;
    }

    if (!fields.nombre.error || !fields.correo.error || !fields.mensaje.error || !success) {
        return;
    }

    function getValue(input) {
        return input.value.replace(/\s+/g, ' ').trim();
    }

    function setError(name, message) {
        var field = fields[name];

        field.error.textContent = message;
        field.error.hidden = !message;
        field.input.setAttribute('aria-invalid', message ? 'true' : 'false');

        if (message) {
            touchedWithError[name] = true;
        } else {
            delete touchedWithError[name];
        }
    }

    function validateField(name) {
        var field = fields[name];
        var message = field.validate(getValue(field.input));
        setError(name, message);
        return !message;
    }

    function hideSuccess() {
        success.hidden = true;
        success.textContent = '';
    }

    Object.keys(fields).forEach(function (name) {
        var input = fields[name].input;

        input.addEventListener('blur', function () {
            validateField(name);
        });

        input.addEventListener('input', function () {
            if (touchedWithError[name]) {
                validateField(name);
            }
            if (!success.hidden) {
                hideSuccess();
            }
        });
    });

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        var firstInvalid = null;
        var isValid = true;

        Object.keys(fields).forEach(function (name) {
            if (!validateField(name) && !firstInvalid) {
                firstInvalid = fields[name].input;
                isValid = false;
            }
        });

        if (!isValid) {
            hideSuccess();
            firstInvalid.focus();
            return;
        }

        /*
         * Integración real de envío pendiente.
         * Por ahora solo se valida en el cliente; no hay backend ni servicio de correo.
         */
        form.reset();
        Object.keys(fields).forEach(function (name) {
            setError(name, '');
        });

        success.textContent = 'Mensaje validado correctamente.';
        success.hidden = false;
        success.focus();
    });

    success.setAttribute('tabindex', '-1');
})();
