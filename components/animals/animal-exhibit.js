// components/animals/animal-exhibit.js
import { API_BASE } from '../config.js';

class   AnimalExhibit extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        
        // internal state
        this.zooAnimals = [];
        this.adoptedAnimals = new Set();
        
        // root container
        const wrapper = document.createElement('div');
        wrapper.className = 'exhibit-wrapper';

        // dropdown list
        const browsePanel = this._createPanel('Browse by Animal');
        this.selectedAnimalDropdown = document.createElement('select');
        this.selectedAnimalDropdown.setAttribute('aria-label', 'Animal Dropdown');

        this.animalCardContainer = document.createElement('div');
        this.animalCardContainer.className = 'card-container';

        const browseRow = this._createRow(this.selectedAnimalDropdown);
        browsePanel.append(browseRow, this.animalCardContainer);

        // search section
        const searchPanel = this._createPanel('Search the Zoo');
        this.searchQueryInput = document.createElement('input');
        this.searchQueryInput.type = 'search';
        this.searchQueryInput.placeholder = 'Search by name or class...';

        this.searchResultsList = document.createElement('ul');
        this.searchResultsList.className = 'results-list';

        searchPanel.append(this.searchQueryInput, this.searchResultsList);

        // add animal section
        const addPanel = this._createPanel('Add an Animal');

        this.addAnimalForm = document.createElement('form');
        this.addAnimalForm.className = 'form-add';   // uses grid CSS

        this.formMessage = document.createElement('p');
        this.formMessage.className = 'form-message';

        const lettersPattern = '^(?:[A-Za-z]{2,}|[A-Za-z][ \\-][A-Za-z])(?:[ \\-][A-Za-z]+)*$';  // words of letters, separated by space or hyphen

        const speciesField = this._field('Species *', 'species', 'input', {
        type: 'text', required: '', minlength: '2', maxlength: '40',
        pattern: lettersPattern, title: 'Letters only (spaces or hyphens allowed, at least 2 letters)'
        });

        const classField = this._field('Class *', 'class', 'input', {
        type: 'text', required: '', minlength: '2', maxlength: '40',
        pattern: lettersPattern, title: 'Letters only (spaces or hyphens allowed, at least 2 letters)'
        });

        const statusField = this._field('Conservation Status *', 'conservationStatus', 'select', {
        required: ''
        });

        // populate select options
        const statusSelect = statusField.querySelector('select');
        ['', 'Least Concern', 'Near Threatened', 'Vulnerable', 'Endangered', 'Critically Endangered']
        .forEach(txt => {
            const opt = document.createElement('option');
            opt.value = txt;
            opt.textContent = txt || '— Select status —';
            statusSelect.appendChild(opt);
        });

        const habitatField = this._field('Habitat *', 'habitat', 'input', {
        type: 'text', required: '', minlength: '2', maxlength: '60',
        pattern: lettersPattern, title: 'Letters only (spaces or hyphens allowed, at least 2 letters)'
        });

        const imageField = this._field('Image URL', 'img', 'input', {
        type: 'url', placeholder: 'https://…', pattern: '^https://.+', title: 'Must start with https:// and end with .png, .jpg, .jpeg, or .gif'
        });

        const descriptionField = this._field('Description *', 'description', 'textarea', {
        rows: '3', placeholder: 'Short description', required: '', minlength: '10', maxlength: '500'
        });

        const factField = this._field('Fun Fact', 'more', 'input', {
        type: 'text', placeholder: 'Optional', maxlength: '120'
        });

        // buttons
        const addButton = this._createButton('Add to Zoo', 'primary');
        addButton.type = 'submit';

        const resetButton = this._createButton('Reset', 'ghost');
        resetButton.type = 'reset';

        const buttonRow = this._createRow([addButton, resetButton]);

        // assemble form
        this.addAnimalForm.append(
        speciesField,
        classField,
        statusField,
        habitatField,
        imageField,
        descriptionField,
        factField,
        buttonRow,
        this.formMessage
        );

        addPanel.append(this.addAnimalForm);
        this._attachValidation();

        // adopt section
        const adoptedPanel = this._createPanel('Adopted Animals');
        this.adoptedAnimalsList = document.createElement('ul');
        this.adoptedAnimalsList.className = 'adopted-list';
        adoptedPanel.append(this.adoptedAnimalsList);

        // track phone number and modal state for adoption
        this.adoptionContacts = new Map();
        this.pendingAdoption = null;

        // phone number modal - element creation
        this.phoneModal = document.createElement('div');
        this.phoneModal.className = 'modal';

        
        const modalDialog = document.createElement('div');
        modalDialog.className = 'modal-dialog';

        const modalTitle = document.createElement('h3');
        modalTitle.textContent = 'Adopt this animal!';

        const modalText = document.createElement('p');
        modalText.textContent = 'Enter a phone number so we can notify you about your adopted animal.';

        this.phoneForm = document.createElement('form');

        this.phoneInput = document.createElement('input');
        this.phoneInput.type = 'tel';
        this.phoneInput.name = 'phone';
        this.phoneInput.required = true;
        this.phoneInput.placeholder = 'ie. 715-555-1234';
        this.phoneInput.setAttribute('autocomplete', 'tel');

        this.phoneError = document.createElement('div');
        this.phoneError.className = 'modal-error';
        this.phoneError.setAttribute = ('aria-live', 'polite');

        const actions = document.createElement('div');
        actions.className = 'modal-actions';

        const cancelBtn = this._createButton('Cancel', 'ghost');
        cancelBtn.type = 'button';

        const okBtn = this._createButton('Confirm Adoption', 'primary');
        okBtn.type = 'submit';

        // append modal elements
        actions.append(cancelBtn, okBtn);
        this.phoneForm.append(this.phoneInput, this.phoneError, actions);

        modalDialog.append(modalTitle, modalText, this.phoneForm);
        this.phoneModal.appendChild(modalDialog);

        // close modal on cancel button click
        cancelBtn.addEventListener('click', () => this._closePhoneModal());

        // clear error while typing
        this.phoneInput.addEventListener('input', () => {
            this.phoneError.textContent = '';
        });

        // put panels together
        wrapper.append(browsePanel, searchPanel, addPanel, adoptedPanel);

        // scoped CSS
        const style = document.createElement('style');
        style.textContent = `
        :host { display: block; font-family: system-ui, sans-serif; color: #f0f4ff; --label-w: 160px; --field-w: 420px;}
        .exhibit-wrapper { display: grid; gap: 20px; }
        .panel { 
            background: #101820; 
            border-radius: 12px; 
            padding: 16px; 
            box-shadow: 0 4px 12px rgba(0,0,0,.3); 
            }
        .panel h2 { margin-top: 0; font-size: 1.25rem; }
        .row { display: flex; gap: 10px; flex-wrap: wrap; margin: 10px 0; }
        .card-container { margin-top: 12px; }
        .results-list, .adopted-list { list-style: none; padding: 0; margin: 0; }
        .results-list li, .adopted-list li { 
            background: #182635; 
            border-radius: 8px; 
            padding: 6px 10px; 
            margin-top: 6px; 
            cursor: pointer; 
            }
        .btn { padding: 8px 14px; border-radius: 8px; cursor: pointer; border: none; }
        .btn.primary { background: #5aa2ff; color: #000; margin-left: 1rem;}
        .btn.ghost { background: transparent; border: 1px solid #5aa2ff; }
        .form-message { min-height: 1em; font-size: 0.9rem; color: #53e0c1; }
        .adopted-list { padding-left: 0; list-style: none; }
        .adopted-list li {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 8px;
            padding: 6px 8px;
            border: 1px solid var(--border, #1a2440);
            border-radius: 8px;
            margin: 6px 0;
            }
        .btn.sm { padding: 4px 8px; font-size: 12px; border-radius: 8px; }
        .btn.danger { background: #4a1111; border-color: #6b1b1b; }
        .btn.danger:hover { background: #5a1515; }
        /* Add-form layout */
        .form-add {
        display: grid;
        row-gap: 12px;
        }
        .form-add .field {
        display: grid;
        grid-template-columns: var(--label-w) minmax(0, var(--field-w));
        align-items: center;
        column-gap: 16px;
        }
        .form-add label {
        font-weight: 600;
        }
        /* inputs look tidy */
        .form-add input,
        .form-add select,
        .form-add textarea {
        width: 100%;
        padding: 8px 10px;
        border: 1px solid var(--border, #1a2440);
        background: #0b1223;
        color: inherit;
        border-radius: 10px;
        }
        /* stack label above input on small screens */
        @media (max-width: 640px) {
            .form-add .field {
                grid-template-columns: 1fr;
                row-gap: 6px;
            }
        }
        .field-error {
            color: #ffb4a3;
            font-size: 12px;
            margin-top: 4px;
            min-height: 1.2em; /* reserves space even when empty */
            }
        .is-invalid input,
        .is-invalid select,
        .is-invalid textarea {
            border-color: #b23a3a;
            outline: none;
            }
                .adopt-info {
            flex: 1 1 auto;
            display: flex;
            flex-direction: column;
        }
        .adopt-phone {
            font-size: 11px;
            opacity: 0.8;
        }

        .modal {
            position: fixed;
            inset: 0;
            display: none;
            align-items: center;
            justify-content: center;
            background: rgba(0,0,0,0.6);
            z-index: 1000;
        }
        .modal.open {
            display: flex;
        }
        .modal-dialog {
            background: #101820;
            padding: 16px 20px;
            border-radius: 12px;
            max-width: 340px;
            width: 90%;
            box-shadow: 0 8px 24px rgba(0,0,0,0.5);
        }
        .modal-dialog h3 {
            margin-top: 0;
            margin-bottom: 0.5rem;
        }
        .modal-dialog p {
            margin-top: 0;
            margin-bottom: 0.75rem;
            font-size: 0.9rem;
        }
        .modal-dialog input[type="tel"] {
            width: 100%;
            padding: 8px 10px;
            border-radius: 10px;
            border: 1px solid var(--border, #1a2440);
            background: #0b1223;
            color: inherit;
        }
        .modal-actions {
            display: flex;
            justify-content: flex-end;
            gap: 8px;
            margin-top: 12px;
        }
        .modal-error {
            color: #ffb4a3;
            font-size: 12px;
            margin-top: 4px;
            min-height: 1.2em;
        }
        `;

    this.shadowRoot.append(style, wrapper, this.phoneModal);
    }

    connectedCallback() {
        this._wireEvents();
        this._loadAnimals();
    }

    // utilities
    _createPanel(titleText) {
        const panel = document.createElement('section');
        panel.className = 'panel';
        const heading = document.createElement('h2');
        heading.textContent = titleText;
        panel.appendChild(heading);
        return panel;
    }

    _createRow(children) {
        const row = document.createElement('div');
        row.className = 'row';
        const items = Array.isArray(children) ? children : [children];
        for (const c of items) if (c) row.appendChild(c);
        return row;
    }

    _createButton(text, variant) {
        const btn = document.createElement('button');
        btn.textContent = text;
        btn.className = 'btn' + (variant ? ' ' + variant : '');
        return btn;        
    }

    _createLabeledInput(labelText, type, name) {
        const label = document.createElement('label');
        label.textContent = labelText;
        const input = document.createElement('input');
        input.type = type;
        input.name = name;
        label.appendChild(input);
        return label;
    }

    _createLabeledSelect(labelText, name, options) {
        const label = document.createElement('label');
        label.textContent = labelText;
        const select = document.createElement('select');
        select.name = name;
        options.forEach(opt => {
            const optionEl = document.createElement('option');
            optionEl.value = opt;
            optionEl.textContent = opt || 'Select...';
            select.appendChild(optionEl);
        });
        label.appendChild(select);
        return label;
    }

    // data load
    async _loadAnimals() {
        try {
            const response = await fetch(`${API_BASE}/animals`, { cache: 'no-store' });
            if (!response.ok) throw new Error(`Fetch failed: ${response.status}`);

            const data = await response.json();
            console.log('Fetched data:', data);

            this.zooAnimals = Array.isArray(data.animals) ? data.animals : data;

            this._populateDropdown();
        }
        catch (err) {
            console.error('Animal load error:', err);
            this.animalCardContainer.textContent = 'Could not load animals.';
        }
    }

    _populateDropdown() {
        this.selectedAnimalDropdown.innerHTML = '';
        const placeholder = document.createElement('option');
        placeholder.value = '';
        placeholder.textContent = '- Select an Animal -';
        this.selectedAnimalDropdown.appendChild(placeholder);

        this.zooAnimals.forEach(animal => {
            const option = document.createElement('option');
            option.value = animal.name;
            option.textContent = animal.name;
            this.selectedAnimalDropdown.appendChild(option);
        });
    }

    _field(labelText, aName, tag = 'input', attributes = {}) {
        const wrap = document.createElement('div');
        wrap.className = 'field';

        const label = document.createElement('label');
        label.setAttribute('for', aName);
        label.textContent = labelText;

        const control = document.createElement(tag);
        control.name = aName;
        control.id = aName;
        Object.entries(attributes).forEach(([k, v]) => control.setAttribute(k, v));

        // inline error slot
        const err = document.createElement('div');
        err.className = 'field-error';
        err.id = `${aName}-error`;
        err.setAttribute('aria-live', 'polite');

        control.setAttribute('aria-describedby', err.id);

        wrap.append(label, control, err);
        return wrap;
    }

    _getField(name) {
        // returns {wrap, control, error}
        const control = this.addAnimalForm.querySelector(`[name="${name}"]`);
        const wrap = control?.closest('.field');
        const error = wrap?.querySelector('.field-error');
        return { wrap, control, error };
    }

    _setError(name, msg) {
        const { wrap, control, error } = this._getField(name);
        if (!wrap) return;
        if (msg) {
            wrap.classList.add('is-invalid');
            control?.setAttribute('aria-invalid', 'true');
            if (error) error.textContent = msg;
        } else {
            wrap.classList.remove('is-invalid');
            control?.removeAttribute('aria-invalid');
            if (error) error.textContent = '';
        }
    }

    _validateField(name) {
        const { control } = this._getField(name);
        if (!control) return true;

        // Trim value for text-like inputs before validating length/patterns
        const tag = control.tagName.toLowerCase();
        const type = control.getAttribute('type') || '';
        if (tag === 'input' && (type === 'text' || type === 'url') || tag === 'textarea') {
            control.value = control.value.trim();
        }

        // Built-in validity first
        const v = control.validity;

        // Custom messages per field
        const labelMap = {
            species: 'Species',
            class: 'Class',
            conservationStatus: 'Conservation Status',
            habitat: 'Habitat',
            img: 'Image URL',
            description: 'Description',
            more: 'Fun Fact'
        };

        let msg = '';
        if (v.valueMissing) msg = `${labelMap[control.name] || 'This field'} is required.`;
        else if (v.tooShort) msg = `Please enter at least ${control.getAttribute('minlength')} characters.`;
        else if (v.tooLong) msg = `Please use at most ${control.getAttribute('maxlength')} characters.`;
        else if (v.typeMismatch && control.type === 'url') msg = `Please enter a valid URL (https://…).`;
        else if (v.patternMismatch) {
            if (['species','class','habitat'].includes(control.name)) {
            msg = `${labelMap[control.name]} must contain letters only (you may use spaces or hyphens) and at least 2 letters.`;
            } else {
                msg = `Please match the requested format.`;
            }
        }

        // for the select, ensure user didn’t leave the placeholder
        if (!msg && control.name === 'conservationStatus' && control.value === '') {
            msg = 'Please select a conservation status.';
        }

        if (!msg && control.name === 'img' && control.value) {
            const val = control.value.trim();

            // 1) must start with https://  (case-insensitive, just in case)
            if (!/^https:\/\//i.test(val)) {
                msg = 'Image URL must start with https://';
            } else {
            // 2) must end with a common image extension (ignore query/hash)
            let path = val;
            try { path = new URL(val).pathname; } catch { /* if invalid, built-in validity already caught it */ }

            const extOK = /\.(png|jpe?g|gif)$/i.test(path);
            if (!extOK) {
            msg = 'Please use a URL ending in .png, .jpg, .jpeg, or .gif';
            }
        }
    }

        this._setError(control.name, msg);
        return !msg;
    }

    _validateForm() {
        const names = ['species','class','conservationStatus','habitat','img','description','more'];
        let firstInvalid = null;
        let ok = true;
        for (const n of names) {
            const valid = this._validateField(n);
            if (!valid && !firstInvalid) firstInvalid = this._getField(n).control;
            ok = ok && valid;
        }
        if (!ok && firstInvalid) firstInvalid.focus();
        return ok;
    }

    _attachValidation() {
        // Live validation on blur and input
        const controls = this.addAnimalForm.querySelectorAll('input, select, textarea');
        controls.forEach(ctrl => {
            ctrl.addEventListener('blur', () => this._validateField(ctrl.name));
            ctrl.addEventListener('input', () => {
                // Clear the error as soon as it becomes valid
                if (ctrl.checkValidity()) this._setError(ctrl.name, '');
            });
            if (ctrl.tagName.toLowerCase() === 'select') {
                ctrl.addEventListener('change', () => this._validateField(ctrl.name));
            }
        });
    }

    // helpers for adoption modal and validation
    _openPhoneModal(animal) {
        this.pendingAdoption = animal;
        if (this.phoneInput) {
            this.phoneInput.value = '';
            this.phoneError.textContent = '';
            setTimeout(() => this.phoneInput.focus(), 0);
        }
        if (this.phoneModal) {
            this.phoneModal.classList.add('open');
        }
    }

    _closePhoneModal() {
        if (this.phoneModal) {
            this.phoneModal.classList.remove('open');
        }
        this.pendingAdoption = null;
    }

    _handlePhoneSubmit(e) {
        e.preventDefault();
        if (!this.pendingAdoption) {
            this._closePhoneModal();
            return;
        }

        const rawNumber = (this.phoneInput?.value || '').trim();

        // standard 10 digit phone regex w/ optional +1
        const phonePattern = /^(?:\+1[-.\s]?)?(?:\(?\d{3}\)?[-.\s]?)\d{3}[-.\s]?\d{4}$/;

        if (!rawNumber || !phonePattern.test(rawaNumber)) {
            this.phoneError.textContent = 'Please enter a valid phone number (10 digits).';
            this.phoneInput?.focus();
            return;
        }

        // on success, record atoption and phone number
        this.adoptedAnimals.add(this.pendingAdoption.name);
        if (this.adoptionContacts) {
            this.adoptionContacts.set(this.pendingAdoption.name, rawNumber);
        }
        this._renderAdoptedList();
        this._closePhoneModal();
    }

    _renderAdoptedList() {
        this.adoptedAnimalsList.innerHTML = '';

        if (!this.adoptedAnimals || this.adoptedAnimals.size === 0) {
            const li = document.createElement('li');
            li.className = 'muted';
            li.textContent = 'No adopted animals yet.';
            this.adoptedAnimalsList.appendChild(li);
            return;
        }

        for (const name of this.adoptedAnimals) {
            const li = document.createElement('li');

            const info = document.createElement('div');
            info.className = 'adopt-info';

            const label = document.createElement('span');
            label.textContent = name;

            const phone = this.adoptionContacts?.get(name);
            const phoneEl = document.createElement('span');
            phoneEl.className = 'adopt-phone';
            phoneEl.textContent = phone ? `Phone: ${phone}` : '';

            info.append(label);
            if (phone) info.append(phoneEl);

            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'btn danger sm';
            btn.textContent = 'Remove';
            btn.setAttribute('aria-label', `Remove adoption for ${name}`);
            btn.addEventListener('click', () => this._unadopt(name));

            li.append(label, btn);
            this.adoptedAnimalsList.appendChild(li);
        }
    }

    _unadopt(aName) {
        if (!aName) return;
        if (this.adoptedAnimals?.delete(aName)) {
            this.adoptionContacts?.delete(aName);
            this._renderAdoptedList();   // redraw the list
        }
    }

    _wireEvents() {
        this.selectedAnimalDropdown.addEventListener('change', async () => {
            const selected = this.zooAnimals.find(a => a.name === this.selectedAnimalDropdown.value);
            if (selected) this._renderCard(selected);
        });

        // Search across name, type, class, species, habitat, status, description
        this.searchQueryInput.addEventListener('input', async () => {
        const q = (this.searchQueryInput.value || '').trim().toLowerCase();
        this.searchResultsList.innerHTML = '';

        // If empty query, bail gracefully (keeps list cleared)
        if (!q) return;

        const hay = v => String(v ?? '').toLowerCase();

        const matches = this.zooAnimals.filter(a => {
            const fields = [
            a.name, a.type, a.class, a.species,
            a.habitat, a.conservationStatus
            ];
            return fields.some(f => hay(f).includes(q));
        });

        if (matches.length === 0) {
            const li = document.createElement('li');
            li.textContent = 'No matches';
            li.className = 'muted';
            this.searchResultsList.appendChild(li);
            return;
        }

        for (const animal of matches) {
            const li = document.createElement('li');
            const name = animal?.name ?? 'Unknown';
            const type = animal?.type ?? animal?.class ?? animal?.species ?? '';
            li.textContent = type ? `${name} (${type})` : name;
            li.addEventListener('click', () => this._renderCard(animal));
            this.searchResultsList.appendChild(li);
        }
        });

        this.addAnimalForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (!this._validateForm()) return;

            const formData = new FormData(this.addAnimalForm);
            const newAnimal = {
                name: formData.get('species'),
                type: formData.get('class'),
                conservationStatus: formData.get('conservationStatus'),
                habitat: formData.get('habitat'),
                image: formData.get('img') || ('images/comingSoon.png'),
                description: formData.get('description'),
                funFact: formData.get('more'),
            };

            try {
                const res = await fetch(`${API_BASE}/animals`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newAnimal),
                });
                if (!res.ok) throw new Error(`Create failed: ${res.status}`);
                const saved = await res.json();

                this.zooAnimals.push(saved);
                this._populateDropdown();

                this.formMessage.textContent = 'Animal added!';
                this.addAnimalForm.reset();
                ['species','class','conservationStatus','habitat','img','description','more']
                    .forEach(n => this._setError(n, ''));
                setTimeout(() => (this.formMessage.textContent = ''), 4000);
            } catch (err) {
                console.error(err);
                this.formMessage.textContent = 'Error: could not save animal.';
            }
        });

        // phone form submit for adoptions
        if (this.phoneForm) {
            this.phoneForm.addEventListener('submit', (e) => this._handlePhoneSubmit(e));
        }
    }

    _renderCard(animal) {
        this.animalCardContainer.innerHTML = '';

        const card = document.createElement('div');
        card.className = 'animal-card';

        const img = document.createElement('img');
        img.src = animal.image;
        img.alt = animal.name;

        const nameEl = document.createElement('h3');
        nameEl.textContent = animal.name;            
        
        const typeEl = document.createElement('p');
        typeEl.textContent = `Class: ${animal.type}`;

        const statusEl = document.createElement('p');
        statusEl.textContent = `Status: ${animal.conservationStatus}`;

        const habitatEl = document.createElement('p');
        habitatEl.textContent = `Habitat: ${animal.habitat}`;

        const descEl = document.createElement('p');
        descEl.textContent = animal.description || '';

        const adoptBtn = this._createButton('Adopt', 'primary');
        adoptBtn.addEventListener('click', () => {
            this._openPhoneModal(animal);
        });

        card.append(img, nameEl, typeEl, statusEl, habitatEl, descEl, adoptBtn);
        this.animalCardContainer.appendChild(card);
    }
}

customElements.define('animal-exhibit', AnimalExhibit);
export default AnimalExhibit;