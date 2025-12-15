// components/animals/animal-exhibit.js
import { API_BASE } from '../config.js';
import { showAdoptionModal, adoptedAnimals, adoptionContacts, getDisplayName, getAdoptionContact, markAdopted, resetAdoptions } from './adoption.js';

class AnimalExhibit extends HTMLElement {
    constructor() {
        super();
        
        // internal state
        this.zooAnimals = [];
        
        // root container
        const wrapper = document.createElement('div');
        wrapper.className = 'exhibit-wrapper';

            // dropdown list section    
        const browsePanel = this._createPanel('Browse by Animal');
        this.selectedAnimalDropdown = document.createElement('select');
        this.selectedAnimalDropdown.setAttribute('aria-label', 'Animal Dropdown');

        this.animalCardContainer = document.createElement('div');
        this.animalCardContainer.className = 'card-container';

        const browseRow = this._createRow(this.selectedAnimalDropdown);
        browsePanel.append(browseRow, this.animalCardContainer);

        // adopted animals section
        const adoptedPanel = this._createPanel('Adopted Animals');
        this.adoptedAnimalsList = document.createElement('ul');
        this.adoptedAnimalsList.className = 'adopted-list';
        adoptedPanel.append(this.adoptedAnimalsList);

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
        this.addAnimalForm.className = 'form-add';
        this.addAnimalForm.method = 'post';
        this.addAnimalForm.action = 'javascript:void(0)';

        this.formMessage = document.createElement('p');
        this.formMessage.className = 'form-message';

        // pattern for letters with spaces or hyphens
        const lettersPattern = '^(?:[A-Za-z]{2,}|[A-Za-z][ \\-][A-Za-z])(?:[ \\-][A-Za-z]+)*$';

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

        // populate conservation status options
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

        // form buttons
        const addButton = this._createButton('Add to Zoo', 'primary');
        addButton.type = 'submit';

        const resetButton = this._createButton('Reset', 'ghost');
        resetButton.type = 'reset';

        const buttonRow = this._createRow([addButton, resetButton]);

        // assemble form fields
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

        // combine all panels
        wrapper.append(browsePanel, adoptedPanel, searchPanel, addPanel);

        // append wrapper to component
        this.append(wrapper);
    }

    connectedCallback() {
        this._wireEvents();
        this._loadAnimals();
        this._renderAdoptedList();
    }

    // utility methods
    // clear all children from a node
    _clearNode(node) {
        while (node.firstChild) {
            node.removeChild(node.firstChild);
        }
    }

    // create a panel section with title
    _createPanel(titleText) {
        const panel = document.createElement('section');
        panel.className = 'panel';
        const heading = document.createElement('h2');
        heading.textContent = titleText;
        panel.appendChild(heading);
        return panel;
    }

    // create a row container for elements
    _createRow(children) {
        const row = document.createElement('div');
        row.className = 'row';
        const items = Array.isArray(children) ? children : [children];
        for (const c of items) if (c) row.appendChild(c);
        return row;
    }

    // create a button with optional variant class
    _createButton(text, variant) {
        const btn = document.createElement('button');
        btn.textContent = text;
        btn.className = 'btn' + (variant ? ' ' + variant : '');
        return btn;        
    }

    // create labeled input field
    _createLabeledInput(labelText, type, name) {
        const label = document.createElement('label');
        label.textContent = labelText;
        const input = document.createElement('input');
        input.type = type;
        input.name = name;
        label.appendChild(input);
        return label;
    }

    // create labeled select dropdown
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

    // load animals from api
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

    // populate dropdown with animal names
    _populateDropdown() {
        this._clearNode(this.selectedAnimalDropdown);
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

    // create form field with label control and error display
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

        // error message container
        const err = document.createElement('div');
        err.className = 'field-error';
        err.id = `${aName}-error`;
        err.setAttribute('aria-live', 'polite');

        control.setAttribute('aria-describedby', err.id);

        wrap.append(label, control, err);
        return wrap;
    }

    // get field elements by name
    _getField(name) {
        const control = this.addAnimalForm.querySelector(`[name="${name}"]`);
        const wrap = control?.closest('.field');
        const error = wrap?.querySelector('.field-error');
        return { wrap, control, error };
    }

    // set or clear error message for a field
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

    // validate a single form field
    _validateField(name) {
        const { control } = this._getField(name);
        if (!control) return true;

        // trim text inputs before validation
        const tag = control.tagName.toLowerCase();
        const type = control.getAttribute('type') || '';
        if (tag === 'input' && (type === 'text' || type === 'url') || tag === 'textarea') {
            control.value = control.value.trim();
        }

        // check built in validity
        const v = control.validity;

        // field name mapping for error messages
        const labelMap = {
            species: 'Species',
            class: 'Class',
            conservationStatus: 'Conservation Status',
            habitat: 'Habitat',
            img: 'Image URL',
            description: 'Description',
            more: 'Fun Fact'
        };

        // build error message based on validation state
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

        // check conservation status was selected
        if (!msg && control.name === 'conservationStatus' && control.value === '') {
            msg = 'Please select a conservation status.';
        }

        // validate image url format
        if (!msg && control.name === 'img' && control.value) {
            const val = control.value.trim();

            // must start with https
            if (!/^https:\/\//i.test(val)) {
                msg = 'Image URL must start with https://';
            } else {
            // must end with image extension
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

    // validate all form fields
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

    // attach validation listeners to form fields
    _attachValidation() {
        const controls = this.addAnimalForm.querySelectorAll('input, select, textarea');
        controls.forEach(ctrl => {
            ctrl.addEventListener('blur', () => this._validateField(ctrl.name));
            ctrl.addEventListener('input', () => {
                // clear error when field becomes valid
                if (ctrl.checkValidity()) this._setError(ctrl.name, '');
            });
            if (ctrl.tagName.toLowerCase() === 'select') {
                ctrl.addEventListener('change', () => this._validateField(ctrl.name));
            }
        });
    }

    // wire up event listeners
    _wireEvents() {
        // dropdown change handler
        this.selectedAnimalDropdown.addEventListener('change', async () => {
            const selected = this.zooAnimals.find(a => a.name === this.selectedAnimalDropdown.value);
            if (selected) this._renderCard(selected);
        });

        // search input handler
        this.searchQueryInput.addEventListener('input', async () => {
        const q = (this.searchQueryInput.value || '').trim().toLowerCase();
        this._clearNode(this.searchResultsList);

        // return early if search is empty
        if (!q) return;

        // convert value to lowercase for comparison
        const hay = v => String(v ?? '').toLowerCase();

        // filter animals by search query
        const matches = this.zooAnimals.filter(a => {
            const fields = [
            a.name, a.type, a.class, a.species,
            a.habitat, a.conservationStatus
            ];
            return fields.some(f => hay(f).includes(q));
        });

        // show no matches message
        if (matches.length === 0) {
            const li = document.createElement('li');
            li.textContent = 'No matches';
            li.className = 'muted';
            this.searchResultsList.appendChild(li);
            return;
        }

        // display search results
        for (const animal of matches) {
            const li = document.createElement('li');
            const name = animal?.name ?? 'Unknown';
            const type = animal?.type ?? animal?.class ?? animal?.species ?? '';
            li.textContent = type ? `${name} (${type})` : name;
            li.addEventListener('click', () => this._renderCard(animal));
            this.searchResultsList.appendChild(li);
        }
        });

        // form submit handler
        this.addAnimalForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (!this._validateForm()) return;

            const formData = new FormData(this.addAnimalForm);
            
            // build animal object from form data
            const newAnimal = {
                name: formData.get('species')?.trim(),
                type: formData.get('class')?.trim(),
                conservationStatus: formData.get('conservationStatus')?.trim(),
                habitat: formData.get('habitat')?.trim(),
                description: formData.get('description')?.trim(),
            };

            // add optional image url
            const imgValue = formData.get('img')?.trim();
            if (imgValue) {
                newAnimal.image = imgValue;
            } else {
                newAnimal.image = 'images/comingSoon.png';
            }

            // add optional fun fact
            const funFactValue = formData.get('more')?.trim();
            if (funFactValue) {
                newAnimal.funFact = funFactValue;
            }

            // validate required fields
            const requiredFields = ['name', 'type', 'conservationStatus', 'habitat', 'description'];
            for (const field of requiredFields) {
                if (!newAnimal[field] || newAnimal[field].trim() === '') {
                    this.formMessage.textContent = `Error: ${field} is required.`;
                    return;
                }
            }

            try {
                console.log('Sending animal data:', newAnimal);
                const res = await fetch(`${API_BASE}/animals`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newAnimal),
                });
                
                if (!res.ok) {
                    const errorText = await res.text();
                    console.error('Server error response:', errorText);
                    throw new Error(`Create failed: ${res.status} - ${errorText}`);
                }
                
                // handle 204 no content response
                let saved = null;
                if (res.status === 204) {
                    // reload animals list for 204 response
                    await this._loadAnimals();
                    saved = this.zooAnimals.find(a => a.name === newAnimal.name && a.type === newAnimal.type) || newAnimal;
                } else {
                    saved = await res.json();
                    this.zooAnimals.push(saved);
                    this._populateDropdown();
                }
                
                // update dropdown if not already updated
                if (res.status !== 204) {
                    this._populateDropdown();
                }

                // show success message and reset form
                this.formMessage.textContent = 'Animal added!';
                // reset form
                this.addAnimalForm.reset();
                ['species','class','conservationStatus','habitat','img','description','more']
                    .forEach(n => this._setError(n, ''));
                setTimeout(() => (this.formMessage.textContent = ''), 4000); // clear message after 4 seconds
            } catch (err) {
                console.error(err);
                this.formMessage.textContent = 'Error: could not save animal.';
            }
        });
    }

    // render animal card in display area
    _renderCard(animal) {
        this._clearNode(this.animalCardContainer);

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
            showAdoptionModal(animal.name, (originalName, phoneNumber, customName) => {
                // refresh adopted list after adoption
                this._renderAdoptedList();
            });
        });

        // append card elements
        card.append(img, nameEl, typeEl, statusEl, habitatEl, descEl, adoptBtn);
        // append card to container
        this.animalCardContainer.appendChild(card);
    }

    // render list of adopted animals
    _renderAdoptedList() {
        this._clearNode(this.adoptedAnimalsList);

        // show message if no adopted animals
        if (!adoptedAnimals || adoptedAnimals.size === 0) {
            const li = document.createElement('li');
            li.className = 'muted';
            li.textContent = 'No adopted animals yet.';
            this.adoptedAnimalsList.appendChild(li);
            return;
        }

        // render each adopted animal
        for (const adoptedName of adoptedAnimals) {
            const li = document.createElement('li');

            const info = document.createElement('div');
            info.className = 'adopt-info';

            const label = document.createElement('span');
            label.textContent = adoptedName;

            // get and display contact phone
            const phone = getAdoptionContact(adoptedName);
            const phoneEl = document.createElement('span');
            phoneEl.className = 'adopt-phone';
            phoneEl.textContent = phone ? `Phone: ${phone}` : '';

            // append info elements
            info.append(label);
            if (phone) info.append(phoneEl);

            // remove button
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'btn danger sm';
            btn.textContent = 'Remove';
            btn.setAttribute('aria-label', `Remove adoption for ${adoptedName}`);
            btn.addEventListener('click', () => {
                adoptedAnimals.delete(adoptedName);
                adoptionContacts.delete(adoptedName);
                this._renderAdoptedList();
            });

            // append list item elements
            li.append(info, btn);
            // append list item to container
            this.adoptedAnimalsList.appendChild(li);
        }
    }
}

customElements.define('animal-exhibit', AnimalExhibit);
export default AnimalExhibit;