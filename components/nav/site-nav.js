// zoo/components/nav/site-nav.js

class SiteNav extends HTMLElement {
    constructor() {
        super();

        // build structure
        const nav = document.createElement('nav');
        nav.className = 'navbar';

        // brand link
        const brand = document.createElement('a');
        brand.className = 'brand';
        brand.href = 'index.php';
        brand.textContent = 'JL Zoo';

        // links container
        const links = document.createElement('div');
        links.className = 'links';

        // get current page filename (support both .php and .html for flexibility)
        const currentPage = window.location.pathname.split('/').pop() || 'index.php';

        // create link element
        const mkLink = (text, href) => {
            const a = document.createElement('a');
            a.href = href;
            a.textContent = text;
            const isIndex = href === 'index.php' || href === 'index.html';
            const isCurrent = href === currentPage || (isIndex && (currentPage === '' || currentPage === 'index.php' || currentPage === 'index.html'));
            if (isCurrent) a.classList.add('active');
            return a;
        };

        // append links to container
        links.append(
            mkLink('Home', 'index.php'),
            mkLink('About', 'about.php'),
            mkLink('Contact', 'contact.php')
        );

        // append brand and links to nav
        nav.append(brand, links);
        // append nav to component
        this.appendChild(nav);
    }
}

customElements.define('site-nav', SiteNav);
export default SiteNav;

