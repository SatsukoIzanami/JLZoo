// adoption logic and UI for animal adoption

// --------- State Management ----------
const adoptedAnimals = new Set();
const adoptionContacts = new Map(); // animal name -> phone number
const adoptionNames = new Map(); // original name -> custom name
let pendingAdoption = null;

// --------- Adoption Logic ----------
/**
 * mark an animal as adopted and saves contact info
 * @param {string} originalName the original animal name
 * @param {string} [phoneNumber]  guest phone number
 * @param {string} [customName] optional custom name for the adopted animal
 */
function markAdopted(originalName, phoneNumber, customName) {
    const adoptedName = customName?.trim() || originalName;
    adoptedAnimals.add(adoptedName);
    if (phoneNumber) {
        adoptionContacts.set(adoptedName, phoneNumber);
    }
    if (customName?.trim() && customName.trim() !== originalName) {
        adoptionNames.set(originalName, customName.trim());
    }
}

/**
 * checks whether an animal is adopted.
 * @param {string} animalName 
 * @returns {boolean}
 */
function isAdopted(animalName) {
    return adoptedAnimals.has(animalName);
}

/**
 * setter for the adopter's contact info for a specific animal.
 * @param {string} animalName 
 * @param {string} phoneNumber 
 */
function saveAdoptionContact(animalName, phoneNumber) {
    adoptionContacts.set(animalName, phoneNumber);
}

/**
 * getter for the adopter's contact info for an animal
 * @param {string} animalName 
 * @returns {string|undefined}
 */
function getAdoptionContact(animalName) {
    return adoptionContacts.get(animalName);
}

/**
 * getter for the custom name for an adopted animal if one was set
 * @param {string} originalName 
 * @returns {string|undefined}
 */
function getAdoptionName(originalName) {
    return adoptionNames.get(originalName);
}

/**
 * getter for the display name for an animal (custom name if set, otherwise original)
 * @param {string} originalName 
 * @returns {string}
 */
function getDisplayName(originalName) {
    return adoptionNames.get(originalName) || originalName;
}

/**
 * setter for the currently pending adoption animal (to trigger an adoption modal, etc)
 * @param {string|null} animalName 
 */
function setPendingAdoption(animalName) {
    pendingAdoption = animalName;
}

/**
 * gets the currently pending adoption animal
 * @returns {string|null}
 */
function getPendingAdoption() {
    return pendingAdoption;
}

/**
 * clears all adoption state (adopted animals, contacts, names, and pending state)
 */
function resetAdoptions() {
    adoptedAnimals.clear();
    adoptionContacts.clear();
    adoptionNames.clear();
    pendingAdoption = null;
}

// --------- Modal Logic ----------

/**
 * creates and shows the adoption modal for a specific animal
 * then handles phone number submission and optional custom name
 * @param {string} animalName 
 * @param {function} onAdoptCallback  callback that receives (originalName, phoneNumber, customName)
 */
function showAdoptionModal(animalName, onAdoptCallback) {
    // remove any existing modal
    const prevModal = document.querySelector('.adoption-modal');
    if (prevModal) prevModal.remove();

    // modal container
    const modal = document.createElement('div');
    modal.className = 'adoption-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.style.position = 'fixed';
    modal.style.zIndex = 1000;
    modal.style.left = 0;
    modal.style.top = 0;
    modal.style.width = '100vw';
    modal.style.height = '100vh';
    modal.style.display = 'flex';
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'center';
    modal.style.backgroundColor = 'rgba(0,0,0,0.45)';

    // modal content
    const modalBox = document.createElement('div');
    modalBox.style.background = 'white';
    modalBox.style.padding = '2rem';
    modalBox.style.borderRadius = '6px';
    modalBox.style.boxShadow = '0 2px 18px #999';
    modalBox.tabIndex = 0;

    const title = document.createElement('h2');
    title.textContent = `Adopt ${animalName}`;
    
    const nameInstr = document.createElement('p');
    nameInstr.textContent = 'Give your adopted animal a custom name (optional):';
    nameInstr.style.marginTop = '0';
    nameInstr.style.marginBottom = '0.5em';

    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.placeholder = animalName;
    nameInput.value = animalName;
    nameInput.setAttribute('aria-label', 'Custom name for adopted animal');
    nameInput.setAttribute('maxlength', '40');
    nameInput.style.width = '100%';
    nameInput.style.padding = '0.5em';
    nameInput.style.marginBottom = '1em';
    nameInput.style.border = '1px solid #ccc';
    nameInput.style.borderRadius = '4px';
    nameInput.style.fontSize = '1em';

    const phoneInstr = document.createElement('p');
    phoneInstr.textContent = 'Please enter your phone number to finalize your adoption:';
    phoneInstr.style.marginBottom = '0.5em';

    const phoneInput = document.createElement('input');
    phoneInput.type = 'tel';
    phoneInput.required = true;
    phoneInput.placeholder = 'e.g. 555-555-5555';
    phoneInput.setAttribute('aria-label', 'Phone number');
    phoneInput.style.width = '100%';
    phoneInput.style.padding = '0.5em';
    phoneInput.style.marginBottom = '0.5em';
    phoneInput.style.border = '1px solid #ccc';
    phoneInput.style.borderRadius = '4px';
    phoneInput.style.fontSize = '1em';

    const errorMsg = document.createElement('div');
    errorMsg.style.color = 'red';
    errorMsg.style.fontSize = '0.9em';
    errorMsg.style.margin = '0.5em 0';
    errorMsg.style.minHeight = '1.2em';

    const btnRow = document.createElement('div');
    btnRow.style.marginTop = '1.2em';
    btnRow.style.display = 'flex';
    btnRow.style.gap = '1em';
    btnRow.style.justifyContent = 'flex-end';

    const cancelBtn = document.createElement('button');
    cancelBtn.type = 'button';
    cancelBtn.textContent = 'Cancel';
    cancelBtn.style.padding = '0.5em 1em';
    cancelBtn.style.border = '1px solid #ccc';
    cancelBtn.style.borderRadius = '4px';
    cancelBtn.style.background = 'white';
    cancelBtn.style.cursor = 'pointer';

    const adoptBtn = document.createElement('button');
    adoptBtn.textContent = 'Adopt';
    adoptBtn.type = 'submit';
    adoptBtn.style.fontWeight = 'bold';
    adoptBtn.style.padding = '0.5em 1em';
    adoptBtn.style.border = 'none';
    adoptBtn.style.borderRadius = '4px';
    adoptBtn.style.background = '#5aa2ff';
    adoptBtn.style.color = '#000';
    adoptBtn.style.cursor = 'pointer';

    btnRow.append(cancelBtn, adoptBtn);

    modalBox.append(title, nameInstr, nameInput, phoneInstr, phoneInput, errorMsg, btnRow);
    modal.appendChild(modalBox);
    document.body.appendChild(modal);

    // focus name input first, then the phone input
    nameInput.focus();
    nameInput.select();

    // clearr error messages when user types
    nameInput.addEventListener('input', () => {
        if (errorMsg.textContent) {
            errorMsg.textContent = '';
        }
    });
    
    phoneInput.addEventListener('input', () => {
        if (errorMsg.textContent) {
            errorMsg.textContent = '';
        }
    });

    // form submission handler
    const submitHandler = () => {
        // validate name first
        const customName = nameInput.value.trim();
        const nameValidation = validateName(customName);
        if (!nameValidation.valid) {
            errorMsg.textContent = nameValidation.message;
            nameInput.focus();
            return;
        }
        
        // validate phone
        const phone = phoneInput.value.trim();
        const phoneValidation = validatePhone(phone);
        if (!phoneValidation.valid) {
            errorMsg.textContent = phoneValidation.message;
            phoneInput.focus();
            return;
        }
        
        const finalName = customName || animalName;
        
        markAdopted(animalName, phone, customName);
        setPendingAdoption(null);
        if (onAdoptCallback) {
            onAdoptCallback(animalName, phone, finalName);
        }
        closeModal();
    };

    // modal event wiring
    adoptBtn.onclick = submitHandler;
    cancelBtn.onclick = closeModal;
    modal.addEventListener('click', (evt) => {
        if (evt.target === modal) closeModal();
    });
    
    // handle Enter key in both inputs
    const handleEnter = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            submitHandler();
        }
    };
    nameInput.addEventListener('keydown', handleEnter);
    phoneInput.addEventListener('keydown', handleEnter);

    function closeModal() {
        modal.remove();
    }
}

/**
 * validates the animal name.
 * @param {string} name 
 * @returns {{valid: boolean, message: string}}
 */
function validateName(name) {
    const trimmed = name.trim();
    
    // if empty, use original name
    if (trimmed === '') {
        return { valid: true, message: '' };
    }
    
    // min length check
    if (trimmed.length < 2) {
        return { valid: false, message: 'Name must be at least 2 characters long.' };
    }
    
    // max length check
    if (trimmed.length > 40) {
        return { valid: false, message: 'Name must be 40 characters or less.' };
    }
    
    // only allow letters, spaces, hyphens, and apostrophes
    // with at least 2 letters, with optional spaces, hyphens, or apostrophes between words
    const namePattern = /^(?:[A-Za-z]{2,}|[A-Za-z][\s\-']?[A-Za-z])(?:[\s\-'][A-Za-z]+)*$/;
    if (!namePattern.test(trimmed)) {
        return { valid: false, message: 'Name must contain only letters, spaces, hyphens, and apostrophes.' };
    }
    
    // don't allow names that are only spaces, hyphens, or apostrophes
    if (!/[A-Za-z]/.test(trimmed)) {
        return { valid: false, message: 'Name must contain at least one letter.' };
    }
    
    // don't allow names with only repeating letters
    const lettersOnly = trimmed.replace(/[\s\-']/g, '').toLowerCase();
    if (lettersOnly.length > 0 && /^([a-z])\1+$/.test(lettersOnly)) {
        return { valid: false, message: 'Name cannot consist of only repeating letters.' };
    }
    
    return { valid: true, message: '' };
}

/**
 * Validates a phone number with robust checks.
 * @param {string} phone 
 * @returns {{valid: boolean, message: string}}
 */
function validatePhone(phone) {
    const rawNumber = phone.trim();
    
    // format check: optional +1, then 10 digits with common separators
    const basicPattern = /^\s*(?:\+?1[.\-\s]?)?(?:\(?\d{3}\)?[.\-\s]?\d{3}[.\-\s]?\d{4})\s*$/;
    if (!basicPattern.test(rawNumber)) {
        return { valid: false, message: 'Please enter a valid phone number (10 digits).' };
    }
    
    // strip to digits only
    let digits = rawNumber.replace(/\D/g, '');
    
    // allow leading 1 (country code) but remove it for validation
    if (digits.length === 11 && digits.startsWith('1')) {
        digits = digits.slice(1);
    }
    
    // must have exactly 10 digits
    if (digits.length !== 10) {
        return { valid: false, message: 'Phone number must have exactly 10 digits.' };
    }
    
    // extract area code, exchange, and line number
    const area = digits.slice(0, 3);
    const exchange = digits.slice(3, 6);
    const line = digits.slice(6);
    
    // Area code: first digit must be 2-9 (can't be 0 or 1)
    if (area[0] < '2' || area[0] > '9') {
        return { valid: false, message: 'Area code must start with digits 2-9.' };
    }
    
    // Exchange: first digit must be 2-9 (can't be 0 or 1)
    if (exchange[0] < '2' || exchange[0] > '9') {
        return { valid: false, message: 'Phone number prefix must start with digits 2-9.' };
    }
    
    // don't allow obviously fake combos (all zeros in exchange or line)
    if (exchange === '000' || line === '0000') {
        return { valid: false, message: 'Please enter a realistic phone number, not all zeros.' };
    }
    
    // don't allow numbers where all 10 digits are the same
    if (/^(\d)\1{9}$/.test(digits)) {
        return { valid: false, message: 'Please enter a realistic phone number.' };
    }
    
    // don't allow repeating patterns (e.g., 111-111-1111, 123-123-1234, etc.)
    // Check if area code, exchange, and line are all the same
    if (area === exchange && exchange === line) {
        return { valid: false, message: 'Please enter a realistic phone number.' };
    }
    
    // don't allow sequential patterns like 123-456-7890
    const isSequential = (str) => {
        let increasing = true;
        let decreasing = true;
        for (let i = 1; i < str.length; i++) {
            if (parseInt(str[i]) !== parseInt(str[i-1]) + 1) increasing = false;
            if (parseInt(str[i]) !== parseInt(str[i-1]) - 1) decreasing = false;
        }
        return increasing || decreasing;
    };
    
    if (isSequential(digits)) {
        return { valid: false, message: 'Please enter a realistic phone number.' };
    }
    
    return { valid: true, message: '' };
}

// --------- Exported API ----------
export {
    adoptedAnimals,
    adoptionContacts,
    adoptionNames,
    pendingAdoption,
    markAdopted,
    isAdopted,
    saveAdoptionContact,
    getAdoptionContact,
    getAdoptionName,
    getDisplayName,
    setPendingAdoption,
    getPendingAdoption,
    resetAdoptions,
    showAdoptionModal,
    validatePhone
};

