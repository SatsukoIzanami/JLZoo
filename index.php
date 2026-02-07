<?php
$page_title = 'CS2 Zoo Project';
$extra_styles = ['components/animals/animal-exhibit.css'];
$extra_scripts = ['components/animals/animal-exhibit.js'];
require __DIR__ . '/includes/head.php';
require __DIR__ . '/includes/header.php';
?>
        <p id="welcome">Discover a world of wonder at JL Zoo, where you'll encounter a diverse array of fascinating animals in their natural habitats.
        From majestic lions and playful monkeys to exotic birds and reptiles, our zoo offers unforgettable experiences for all ages.
        Explore our interactive exhibits, learn about conservation efforts, and create lasting memories with your family.</p>

        <section class="container">
            <animal-exhibit></animal-exhibit>
        </section>
<?php require __DIR__ . '/includes/footer.php'; ?>
