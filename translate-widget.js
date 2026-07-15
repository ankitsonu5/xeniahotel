const DEFAULT_TRANSLATE_LANGUAGES = [
    { code: 'en', label: 'English' },
    { code: 'as', label: 'Assamese' },
    { code: 'awa', label: 'Awadhi' },
    { code: 'brx', label: 'Bodo' },
    { code: 'bn', label: 'Bengali' },
    { code: 'bho', label: 'Bhojpuri' },
    { code: 'doi', label: 'Dogri' },
    { code: 'gu', label: 'Gujarati' },
    { code: 'hi', label: 'Hindi' },
    { code: 'ks', label: 'Kashmiri' },
    { code: 'kn', label: 'Kannada' },
    { code: 'kok', label: 'Kokborok' },
    { code: 'kha', label: 'Khasi' },
    { code: 'mai', label: 'Maithili' },
    { code: 'ml', label: 'Malayalam' },
    { code: 'mni', label: 'Manipuri' },
    { code: 'mr', label: 'Marathi' },
    { code: 'mwr', label: 'Marwadi' },
    { code: 'ne', label: 'Nepali' },
    { code: 'or', label: 'Odia (Oriya)' },
    { code: 'pa', label: 'Punjabi (Gurmukhi)' },
    { code: 'sa', label: 'Sanskrit' },
    { code: 'sat', label: 'Santali (Ol Chiki)' },
    { code: 'sd', label: 'Sindhi' },
    { code: 'ta', label: 'Tamil' },
    { code: 'te', label: 'Telugu' },
    { code: 'trp', label: 'Tulu' },
    { code: 'ur', label: 'Urdu' }
];

function setGoogleTranslateCookie(languageCode) {
    const cookieValue = `/en/${languageCode}`;
    document.cookie = `googtrans=${cookieValue};path=/`;
    document.cookie = `googtrans=${cookieValue};path=/;domain=${window.location.hostname}`;
}

function readCurrentLanguage() {
    const match = document.cookie.match(/(?:^|;\s*)googtrans=\/[^/]+\/([^;]+)/);
    return match ? match[1] : 'en';
}

function getTranslateLanguages(googleSelect) {
    if (!googleSelect) {
        return DEFAULT_TRANSLATE_LANGUAGES;
    }

    const languages = [{ code: 'en', label: 'English' }];
    Array.from(googleSelect.options).forEach((option) => {
        if (!option.value) {
            return;
        }

        languages.push({
            code: option.value,
            label: option.textContent.trim()
        });
    });
    return languages;
}

function updateTranslateButton(button) {
    button.firstChild.textContent = 'Translate';
}

function updateActiveLanguage(widget, activeLanguage) {
    widget.querySelectorAll('.translate-option').forEach((option) => {
        option.classList.toggle('is-active', option.dataset.lang === activeLanguage);
    });
}

function renderTranslateOptions(widget, button, languages) {
    const languageGrid = widget.querySelector('.translate-language-grid');
    if (!languageGrid) {
        return;
    }

    languageGrid.innerHTML = '';

    languages.forEach((language) => {
        const option = document.createElement('button');
        option.type = 'button';
        option.className = 'translate-option';
        option.dataset.lang = language.code;
        option.textContent = language.label;
        option.addEventListener('click', () => applyLanguage(language.code, widget, button, languages));
        languageGrid.appendChild(option);
    });

    updateActiveLanguage(widget, readCurrentLanguage());
}

function applyLanguage(languageCode, widget, button, languages) {
    const googleSelect = document.querySelector('.goog-te-combo');
    setGoogleTranslateCookie(languageCode);

    if (languageCode === 'en') {
        updateTranslateButton(button);
        updateActiveLanguage(widget, languageCode);
        widget.classList.remove('is-open');
        window.location.reload();
        return;
    }

    if (googleSelect) {
        googleSelect.value = languageCode;
        googleSelect.dispatchEvent(new Event('change'));
    } else {
        window.location.reload();
        return;
    }

    updateTranslateButton(button);
    updateActiveLanguage(widget, languageCode);
    widget.classList.remove('is-open');
}

function buildTranslateDropdown(widget, googleSelect) {
    if (!widget || widget.dataset.translateEnhanced === 'true') {
        return;
    }

    const button = widget.querySelector('.translate-button');
    if (!button) {
        return;
    }

    const buttonLabel = document.createTextNode('Translate');
    button.textContent = '';
    button.appendChild(buttonLabel);

    const dropdown = document.createElement('div');
    dropdown.className = 'translate-dropdown';
    dropdown.innerHTML = `
        <div class="translate-dropdown-header">
            <div>
                <p class="translate-dropdown-title">Select Language</p>
                <p class="translate-dropdown-subtitle">Instant page translation</p>
            </div>
        </div>
        <div class="translate-language-grid"></div>
    `;

    const languages = getTranslateLanguages(googleSelect);

    widget.appendChild(dropdown);
    widget.dataset.translateEnhanced = 'true';
    renderTranslateOptions(widget, button, languages);

    button.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        widget.classList.toggle('is-open');
    });

    document.addEventListener('click', (event) => {
        if (!widget.contains(event.target)) {
            widget.classList.remove('is-open');
        }
    });

    widget.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            widget.classList.remove('is-open');
        }
    });

    const activeLanguage = readCurrentLanguage();
    updateTranslateButton(button);
    updateActiveLanguage(widget, activeLanguage);
}

window.initializeCustomTranslateWidget = function initializeCustomTranslateWidget() {
    const widget = document.querySelector('.translate-widget');
    if (!widget) {
        return;
    }

    buildTranslateDropdown(widget, document.querySelector('.goog-te-combo'));

    const attachWhenReady = () => {
        const googleSelect = document.querySelector('.goog-te-combo');
        if (!googleSelect) {
            window.setTimeout(attachWhenReady, 250);
            return;
        }

        const languages = getTranslateLanguages(googleSelect);
        const button = widget.querySelector('.translate-button');
        renderTranslateOptions(widget, button, languages);
    };

    attachWhenReady();
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        if (window.initializeCustomTranslateWidget) {
            window.initializeCustomTranslateWidget();
        }
    });
} else if (window.initializeCustomTranslateWidget) {
    window.initializeCustomTranslateWidget();
}
