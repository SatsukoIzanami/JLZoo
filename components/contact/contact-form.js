// components/contact/contact-form.js

class ContactForm extends HTMLElement {
    constructor() {
        super();

        // create form structure
        const form = document.createElement('form');
        form.className = 'contact-form';
        form.method = 'post';
        form.action = 'javascript:void(0)';

        // name field
        const nameField = this._createField('Name *', 'name', 'input', {
            type: 'text',
            required: '',
            minlength: '3',
            placeholder: 'Enter your full name'
        });

        // email field
        const emailField = this._createField('Email *', 'email', 'input', {
            type: 'email',
            required: '',
            placeholder: 'your.email@example.com'
        });

        // subject field
        const subjectField = this._createField('Subject *', 'subject', 'input', {
            type: 'text',
            required: '',
            minlength: '5',
            placeholder: 'What is your message about?'
        });

        // message field
        const messageField = this._createField('Message *', 'message', 'textarea', {
            required: '',
            rows: '6',
            placeholder: 'Please enter at least 5 words'
        });

        // submit button
        const submitButton = document.createElement('button');
        submitButton.type = 'submit';
        submitButton.className = 'btn primary';
        submitButton.textContent = 'Send Message';

        // message display area
        const formMessage = document.createElement('p');
        formMessage.className = 'form-message';

        // assemble form
        form.append(
            nameField,
            emailField,
            subjectField,
            messageField,
            submitButton,
            formMessage
        );

        // append form to component
        this.appendChild(form);
        // set form property
        this.form = form;
        // set form message property
        this.formMessage = formMessage;
        // attach validation listeners to form fields
        this._attachValidation();
    }

    connectedCallback() {
        // wire up form submission handler
        this._wireEvents();
    }

    // create a form field with label and error display
    _createField(labelText, name, tag = 'input', attributes = {}) {
        const fieldWrap = document.createElement('div');
        fieldWrap.className = 'field';

        // create label element
        const label = document.createElement('label');
        label.setAttribute('for', name);
        label.textContent = labelText;

        // create control element
        const control = document.createElement(tag);
        control.name = name;
        control.id = name;
        // set control attributes
        Object.entries(attributes).forEach(([k, v]) => control.setAttribute(k, v));

        // create error message container
        const error = document.createElement('div');
        error.className = 'field-error';
        error.id = `${name}-error`;
        error.setAttribute('aria-live', 'polite');

        // set control aria-describedby attribute
        control.setAttribute('aria-describedby', error.id);

        // append label, control, and error to field wrap
        fieldWrap.append(label, control, error);
        // return the field wrap
        return fieldWrap;
    }

    // get the field elements by name
    _getField(name) {
        const control = this.form.querySelector(`[name="${name}"]`);
        // get the closest field wrap
        const wrap = control?.closest('.field');
        // get the error element
        const error = wrap?.querySelector('.field-error');
        // return the wrap, control, and error
        return { wrap, control, error };
    }

    // set or clear error message for a field
    _setError(name, msg) {
        const { wrap, control, error } = this._getField(name);
        // if the wrap is not found, return
        if (!wrap) {
            return;
        }
        // if the message is not empty, add the is-invalid class to the wrap
        if (msg) {
            wrap.classList.add('is-invalid');
            // set the aria-invalid attribute to true
            control?.setAttribute('aria-invalid', 'true');
            // set the error text content to the message
            if (error) error.textContent = msg;
        } else {
            // remove the is-invalid class from the wrap
            wrap.classList.remove('is-invalid');
            // remove the aria-invalid attribute from the control
            control?.removeAttribute('aria-invalid');
            // set the error text content to an empty string
            if (error) error.textContent = '';
        }
    }

    // check if string has repeating characters
    _hasRepeatingChars(str) {
        return /(.)\1{2,}/.test(str);
    }

    // validate the name field
    _validateName() {
        const { control } = this._getField('name');
        if (!control) return true;

        // trim the control value
        control.value = control.value.trim();
        // get the validity of the control
        const v = control.validity;
        let msg = '';

        // if the value is missing, set the message to 'Name is required.'
        if (v.valueMissing) {
            msg = 'Name is required.';
        // if the value is too short, set the message to 'Name must be at least 3 characters.'
        } else if (v.tooShort) {
            msg = 'Name must be at least 3 characters.';
        // if the value has repeating characters, set the message
        } else if (this._hasRepeatingChars(control.value)) {
            msg = 'Name cannot contain repeating characters.';
        }

        // set the error message for the name field
        this._setError('name', msg);
        // return true if the message is empty
        return !msg;
    }

    // validate the email field
    _validateEmail() {
        const { control } = this._getField('email');
        if (!control) return true;

        // trim the control value
        control.value = control.value.trim();
        // get the validity of the control
        const v = control.validity;
        let msg = '';

        // if the value is missing, set the message to 'Email is required.'
        if (v.valueMissing) {
            msg = 'Email is required.';
        // if the value is not a valid email address, set the message to 'Please enter a valid email address.'
        } else if (v.typeMismatch) {
            msg = 'Please enter a valid email address.';
        }

        // set the error message for the email field
        this._setError('email', msg);
        // return true if the message is empty
        return !msg;
    }

    // validate the subject field
    _validateSubject() {
        const { control } = this._getField('subject');
        if (!control) return true;

        // trim the control value
        control.value = control.value.trim();
        // get the validity of the control
        const v = control.validity;
        let msg = '';

        // if the value is missing, set the message to 'Subject is required.'
        if (v.valueMissing) {
            msg = 'Subject is required.';
        // if the value is too short, set the message to 'Subject must be at least 5 characters.'
        } else if (v.tooShort) {
            msg = 'Subject must be at least 5 characters.';
        // if the value has repeating characters, set the message
        } else if (this._hasRepeatingChars(control.value)) {
            msg = 'Subject cannot contain repeating characters.';
        }

        // set the error message for the subject field
        this._setError('subject', msg);
        // return true if the message is empty
        return !msg;
    }

    // validate the message field must have at least 5 words
    _validateMessage() {
        const { control } = this._getField('message');
        if (!control) return true;

        // trim the control value
        control.value = control.value.trim();
        // get the validity of the control
        const v = control.validity;
        let msg = '';

        // if the value is missing, set the message to 'Message is required.'
        if (v.valueMissing) {
            msg = 'Message is required.';
        // if the value is too short, set the message to 'Message must contain at least 5 words.'
        } else if (v.tooShort) {
            // count words split by whitespace
            const words = control.value.split(/\s+/).filter(word => word.length > 0);
            if (words.length < 5) {
                msg = 'Message must contain at least 5 words.';
            }
        }

        // set the error message for the message field
        this._setError('message', msg);
        // return true if the message is empty
        return !msg;
    }

    // validate all form fields
    _validateForm() {
        // validate the name field
        const nameValid = this._validateName();
        // validate the email field
        const emailValid = this._validateEmail();
        // validate the subject field
        const subjectValid = this._validateSubject();
        // validate the message field
        const messageValid = this._validateMessage();

        // check if all fields are valid
        const allValid = nameValid && emailValid && subjectValid && messageValid;
        // if not all fields are valid, focus the first invalid field
        if (!allValid) {
            // focus the first invalid field
            const fields = ['name', 'email', 'subject', 'message'];
            for (const fieldName of fields) {
                const { control } = this._getField(fieldName);
                if (control && control.hasAttribute('aria-invalid')) control.focus();
            }
        }
        // return true if all fields are valid
        return allValid;
    }

    // attach validation listeners to form fields
    _attachValidation() {
        // get all input and textarea elements
        const controls = this.form.querySelectorAll('input, textarea');
        // add validation listeners to each control
        controls.forEach(ctrl => {
            // add blur event listener to the control
            ctrl.addEventListener('blur', () => {
                // validate the name field
                if (ctrl.name === 'name') this._validateName();
                // validate the email field
                else if (ctrl.name === 'email') this._validateEmail();
                // validate the subject field
                else if (ctrl.name === 'subject') this._validateSubject();
                // validate the message field
                else if (ctrl.name === 'message') this._validateMessage();
            });

            // add input event listener to the control
            ctrl.addEventListener('input', () => {
                // clear error when field becomes valid
                if (ctrl.checkValidity()) {
                    // if the control is the message field, check the word count
                    if (ctrl.name === 'message') {
                        // check word count for message field
                        const words = ctrl.value.trim().split(/\s+/).filter(word => word.length > 0);
                        if (words.length >= 5) {
                            // clear the error for the message field
                            this._setError(ctrl.name, '');
                        }
                    } else {
                        // clear the error for the other fields
                        this._setError(ctrl.name, '');
                    }
                }
            });
        });
    }

    // wire up form submission handler
    _wireEvents() {
        // add submit event listener to the form
        this.form.addEventListener('submit', async (e) => {
            // prevent the default form submission behavior
            e.preventDefault();
            e.stopPropagation();

            // validate the form
            if (!this._validateForm()) {
                return;
            }

            // TODO: add api connection here
            // const formData = new FormData(this.form);
            // const data = {
            //     name: formData.get('name')?.trim(),
            //     email: formData.get('email')?.trim(),
            //     subject: formData.get('subject')?.trim(),
            //     message: formData.get('message')?.trim()
            // };

            // show success message
            this.formMessage.className = 'form-message success';
            this.formMessage.textContent = 'Thank you! Your message has been sent. We will get back to you soon.';
            // reset the form
            this.form.reset();

            // clear all field errors
            // clear the error for each field
            ['name', 'email', 'subject', 'message'].forEach(n => this._setError(n, ''));

            // clear success message after 5 seconds
            setTimeout(() => {
                // clear the success message
                this.formMessage.textContent = '';
                // remove the success class from the form message
                this.formMessage.className = 'form-message';
            }, 5000);
        });
    }
}

customElements.define('contact-form', ContactForm);
export default ContactForm;

