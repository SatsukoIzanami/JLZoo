<?php
// Expects: $page_title (full <title> text), $extra_styles = [], $extra_scripts = []
$extra_styles = $extra_styles ?? [];
$extra_scripts = $extra_scripts ?? [];
?>
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta http-equiv="Content-Security-Policy"
        content="
            default-src 'self' https://jlzoo.onrender.com https://satsukoizanami.github.io/JLZoo/ 'unsafe-inline';
            connect-src 'self' https://jlzoo.onrender.com http://localhost:3000 http://127.0.0.1:3000;
            img-src 'self' data: blob: https://jlzoo.onrender.com;
            style-src 'self' 'unsafe-inline';
            font-src 'self' data:;
            object-src 'none';
        ">
        <title><?php echo htmlspecialchars($page_title); ?></title>
        <link rel="stylesheet" href="styles.css" />
        <link rel="stylesheet" href="components/nav/site-nav.css" />
        <?php foreach ($extra_styles as $href): ?>
        <link rel="stylesheet" href="<?php echo htmlspecialchars($href); ?>" />
        <?php endforeach; ?>
        <link rel="stylesheet" href="components/theme/zoo-theme.css" />
        <script type="module" src="components/nav/site-nav.js" defer></script>
        <?php foreach ($extra_scripts as $src): ?>
        <script type="module" src="<?php echo htmlspecialchars($src); ?>" defer></script>
        <?php endforeach; ?>
    </head>
