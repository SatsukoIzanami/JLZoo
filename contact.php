<?php
$page_title = 'Contact Us - JL Zoo';
$extra_styles = ['components/contact/contact-form.css'];
$extra_scripts = ['components/contact/contact-form.js'];
require __DIR__ . '/includes/head.php';
require __DIR__ . '/includes/header.php';
?>
        <section class="container">
            <p id="contact-intro">Have a question or feedback? We'd love to hear from you! Please fill out the form below and we'll get back to you as soon as possible.</p>
            <contact-form></contact-form>
        </section>
<?php require __DIR__ . '/includes/footer.php'; ?>
