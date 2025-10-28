// zoo/components/nav/site-nav.js

class SiteNav extends HTMLElement {
    constructor() {
        super();

        // attach shadow DOM
        const shadow = this.attachShadow({ mode: 'open' });

        // styles

        const style = document.createElement('style');
        style.textContent = `
            :host { display:block; width:100%; }

            .navbar {
              position: sticky;
              top: 0;
              z-index: 1000;
              background: #fff;
              border-bottom: 1px solid #eaeaea;

              display: flex;
              align-items: center;
              justify-content: space-between;
              padding: 0.75rem 1rem;}

            .brand {
              font-weight: 800;
              font-size: 1.6rem;
              color: #111;
              white-space: nowrap;}

            .links {
              display: flex;
              gap: 1.5rem;
              flex-wrap: nowrap;}

            a {
              color: var(--font-color, #333);
              text-decoration: none;
              padding: 0.4rem 0.6rem;
              border-radius: var(--border-radius, 6px);
              transition: background 0.2s, color 0.2s;}

            a:hover,
            a:focus-visible {
              color: var(--accent-color, #0077cc);
              background: rgba(0, 119, 204, 0.08);
              outline: none;}
            `;

        // build structure
        const nav = document.createElement('nav');
        nav.className = 'navbar';

        const brand = document.createElement('a');
        brand.className = 'brand';
        brand.href = 'index.html';
        brand.textContent = 'JL Zoo';

        const links = document.createElement('div');
        links.className = 'links';

        const mkLink = (text, href) => {
            const a = document.createElement('a');
            a.href = href;
            a.textContent = text;
            return a;
        };

        links.append(
            mkLink('Home', 'index.html'),
            mkLink('About', 'about.html'),
            mkLink('Contact', 'contact.html')
        );

        nav.append(brand, links);
        shadow.append(style, nav);
    }
}

customElements.define('site-nav', SiteNav);
export default SiteNav;

