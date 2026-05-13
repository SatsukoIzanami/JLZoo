import { useMemo, useState } from "react";
import "./ContactForm.css";

const initialForm = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

export default function ContactForm() {
  const [form, setForm] = useState(initialForm);
  const [touched, setTouched] = useState({});
  const [toast, setToast] = useState("");

  const errors = useMemo(
    () => ({
      name: form.name.trim().length >= 3 ? "" : "Name must be at least 3 characters.",
      email: /^\S+@\S+\.\S+$/.test(form.email) ? "" : "Please enter a valid email address.",
      subject:
        form.subject.trim().length >= 5
          ? ""
          : "Subject must be at least 5 characters.",
      message:
        form.message.trim().length >= 20
          ? ""
          : "Message must contain at least 20 characters.",
    }),
    [form]
  );

  function updateField(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function submit(event) {
    event.preventDefault();
    setTouched({ name: true, email: true, subject: true, message: true });
    const hasError = Object.values(errors).some(Boolean);
    if (hasError) return;

    setForm(initialForm);
    setTouched({});
    setToast("Thank you! Your message has been sent. We will get back to you soon.");
    window.setTimeout(() => setToast(""), 3500);
  }

  return (
    <>
      <form className="contact-form" onSubmit={submit} noValidate>
        <div className="field">
          <label htmlFor="name">Name *</label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Enter your full name"
            value={form.name}
            onBlur={() => setTouched((prev) => ({ ...prev, name: true }))}
            onChange={updateField}
          />
          {touched.name && errors.name ? <p className="field-error">{errors.name}</p> : null}
        </div>
        <div className="field">
          <label htmlFor="email">Email *</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="your.email@example.com"
            value={form.email}
            onBlur={() => setTouched((prev) => ({ ...prev, email: true }))}
            onChange={updateField}
          />
          {touched.email && errors.email ? <p className="field-error">{errors.email}</p> : null}
        </div>
        <div className="field">
          <label htmlFor="subject">Subject *</label>
          <input
            id="subject"
            name="subject"
            type="text"
            placeholder="What is your message about?"
            value={form.subject}
            onBlur={() => setTouched((prev) => ({ ...prev, subject: true }))}
            onChange={updateField}
          />
          {touched.subject && errors.subject ? (
            <p className="field-error">{errors.subject}</p>
          ) : null}
        </div>
        <div className="field">
          <label htmlFor="message">Message *</label>
          <textarea
            id="message"
            name="message"
            rows="6"
            placeholder="Please enter at least 5 words"
            value={form.message}
            onBlur={() => setTouched((prev) => ({ ...prev, message: true }))}
            onChange={updateField}
          />
          {touched.message && errors.message ? (
            <p className="field-error">{errors.message}</p>
          ) : null}
        </div>
        <div className="button-row">
          <button type="submit">Send Message</button>
        </div>
      </form>
      {toast ? <p className="toast-message">{toast}</p> : null}
    </>
  );
}
