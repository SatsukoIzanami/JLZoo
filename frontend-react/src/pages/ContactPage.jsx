import ContactForm from "../components/ContactForm.jsx";
import "./ContactPage.css";

export default function ContactPage() {
  return (
    <section className="container">
      <p id="contact-intro">
        Have a question or feedback? We'd love to hear from you! Please fill out the form below and we'll get back
        to you as soon as possible.
      </p>
      <ContactForm />
    </section>
  );
}
