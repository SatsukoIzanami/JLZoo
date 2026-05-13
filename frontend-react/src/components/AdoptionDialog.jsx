import { useState } from "react";
import "./AdoptionDialog.css";

export default function AdoptionDialog({ animal, onClose, onSave }) {
  const [customName, setCustomName] = useState(animal.name);
  const [phone, setPhone] = useState("");
  const [touched, setTouched] = useState(false);
  const hasPhoneError = touched && !phone.trim();

  function submit() {
    setTouched(true);
    if (!phone.trim()) return;
    onSave({ customName: customName.trim(), phone: phone.trim() });
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(event) => event.stopPropagation()}>
        <h2>Adopt {animal.name}</h2>
        <p>Give your adopted animal a custom name (optional):</p>
        <input
          className="full-width"
          type="text"
          value={customName}
          onChange={(event) => setCustomName(event.target.value)}
        />

        <p>Please enter your phone number to finalize your adoption:</p>
        <input
          className="full-width"
          type="tel"
          placeholder="e.g. 555-555-5555"
          value={phone}
          onBlur={() => setTouched(true)}
          onChange={(event) => setPhone(event.target.value)}
        />
        {hasPhoneError ? (
          <p className="field-error">Phone number is required.</p>
        ) : null}

        <div className="modal-actions">
          <button type="button" onClick={onClose}>
            Cancel
          </button>
          <button type="button" onClick={submit}>
            Adopt
          </button>
        </div>
      </div>
    </div>
  );
}
