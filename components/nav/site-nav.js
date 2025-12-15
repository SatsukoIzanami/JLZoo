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
        brand.href = 'index.html';
        brand.textContent = 'JL Zoo';

        // links container
        const links = document.createElement('div');
        links.className = 'links';

        // get current page filename
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';

        // create link element
        const mkLink = (text, href) => {
            const a = document.createElement('a');
            a.href = href;
            a.textContent = text;
            // add active class if current page matches
            if (href === currentPage || (href === 'index.html' && (currentPage === '' || currentPage === 'index.html'))) {
                a.classList.add('active');
            }
            return a;
        };

        // append links to container
        links.append(
            mkLink('Home', 'index.html'),
            mkLink('About', 'about.html'),
            mkLink('Contact', 'contact.html')
        );

        // append brand and links to nav
        nav.append(brand, links);
        // append nav to component
        this.appendChild(nav);
    }
}

customElements.define('site-nav', SiteNav);
export default SiteNav;

