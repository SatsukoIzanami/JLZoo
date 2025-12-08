(function(){const a=document.createElement("link").relList;if(a&&a.supports&&a.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))t(n);new MutationObserver(n=>{for(const s of n)if(s.type==="childList")for(const r of s.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&t(r)}).observe(document,{childList:!0,subtree:!0});function e(n){const s={};return n.integrity&&(s.integrity=n.integrity),n.referrerPolicy&&(s.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?s.credentials="include":n.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function t(n){if(n.ep)return;n.ep=!0;const s=e(n);fetch(n.href,s)}})();class C extends HTMLElement{constructor(){super();const a=this.attachShadow({mode:"open"}),e=document.createElement("style");e.textContent=`
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
            `;const t=document.createElement("nav");t.className="navbar";const n=document.createElement("a");n.className="brand",n.href="index.html",n.textContent="JL Zoo";const s=document.createElement("div");s.className="links";const r=(o,l)=>{const i=document.createElement("a");return i.href=l,i.textContent=o,i};s.append(r("Home","index.html"),r("About","about.html"),r("Contact","contact.html")),t.append(n,s),a.append(e,t)}}customElements.define("site-nav",C);const w=location.hostname.endsWith("github.io")?"https://jlzoo.onrender.com/api":"http://localhost:3000/api",A=new Set,_=new Map,L=new Map;function S(d,a,e){const t=e?.trim()||d;A.add(t),a&&_.set(t,a),e?.trim()&&e.trim()!==d&&L.set(d,e.trim())}function F(d,a){const e=document.querySelector(".adoption-modal");e&&e.remove();const t=document.createElement("div");t.className="adoption-modal",t.setAttribute("role","dialog"),t.setAttribute("aria-modal","true"),t.style.position="fixed",t.style.zIndex=1e3,t.style.left=0,t.style.top=0,t.style.width="100vw",t.style.height="100vh",t.style.display="flex",t.style.alignItems="center",t.style.justifyContent="center",t.style.backgroundColor="rgba(0,0,0,0.45)";const n=document.createElement("div");n.style.background="white",n.style.padding="2rem",n.style.borderRadius="6px",n.style.boxShadow="0 2px 18px #999",n.tabIndex=0;const s=document.createElement("h2");s.textContent=`Adopt ${d}`;const r=document.createElement("p");r.textContent="Give your adopted animal a custom name (optional):",r.style.marginTop="0",r.style.marginBottom="0.5em";const o=document.createElement("input");o.type="text",o.placeholder=d,o.value=d,o.setAttribute("aria-label","Custom name for adopted animal"),o.setAttribute("maxlength","40"),o.style.width="100%",o.style.padding="0.5em",o.style.marginBottom="1em",o.style.border="1px solid #ccc",o.style.borderRadius="4px",o.style.fontSize="1em";const l=document.createElement("p");l.textContent="Please enter your phone number to finalize your adoption:",l.style.marginBottom="0.5em";const i=document.createElement("input");i.type="tel",i.required=!0,i.placeholder="e.g. 555-555-5555",i.setAttribute("aria-label","Phone number"),i.style.width="100%",i.style.padding="0.5em",i.style.marginBottom="0.5em",i.style.border="1px solid #ccc",i.style.borderRadius="4px",i.style.fontSize="1em";const c=document.createElement("div");c.style.color="red",c.style.fontSize="0.9em",c.style.margin="0.5em 0",c.style.minHeight="1.2em";const m=document.createElement("div");m.style.marginTop="1.2em",m.style.display="flex",m.style.gap="1em",m.style.justifyContent="flex-end";const p=document.createElement("button");p.type="button",p.textContent="Cancel",p.style.padding="0.5em 1em",p.style.border="1px solid #ccc",p.style.borderRadius="4px",p.style.background="white",p.style.cursor="pointer";const u=document.createElement("button");u.textContent="Adopt",u.type="submit",u.style.fontWeight="bold",u.style.padding="0.5em 1em",u.style.border="none",u.style.borderRadius="4px",u.style.background="#5aa2ff",u.style.color="#000",u.style.cursor="pointer",m.append(p,u),n.append(s,r,o,l,i,c,m),t.appendChild(n),document.body.appendChild(t),o.focus(),o.select(),o.addEventListener("input",()=>{c.textContent&&(c.textContent="")}),i.addEventListener("input",()=>{c.textContent&&(c.textContent="")});const x=()=>{const h=o.value.trim(),v=P(h);if(!v.valid){c.textContent=v.message,o.focus();return}const g=i.value.trim(),y=k(g);if(!y.valid){c.textContent=y.message,i.focus();return}const E=h||d;S(d,g,h),a&&a(d,g,E),f()};u.onclick=x,p.onclick=f,t.addEventListener("click",h=>{h.target===t&&f()});const b=h=>{h.key==="Enter"&&(h.preventDefault(),x())};o.addEventListener("keydown",b),i.addEventListener("keydown",b);function f(){t.remove()}}function P(d){const a=d.trim();if(a==="")return{valid:!0,message:""};if(a.length<2)return{valid:!1,message:"Name must be at least 2 characters long."};if(a.length>40)return{valid:!1,message:"Name must be 40 characters or less."};if(!/^(?:[A-Za-z]{2,}|[A-Za-z][\s\-']?[A-Za-z])(?:[\s\-'][A-Za-z]+)*$/.test(a))return{valid:!1,message:"Name must contain only letters, spaces, hyphens, and apostrophes."};if(!/[A-Za-z]/.test(a))return{valid:!1,message:"Name must contain at least one letter."};const t=a.replace(/[\s\-']/g,"").toLowerCase();return t.length>0&&/^([a-z])\1+$/.test(t)?{valid:!1,message:"Name cannot consist of only repeating letters."}:{valid:!0,message:""}}function k(d){const a=d.trim();if(!/^\s*(?:\+?1[.\-\s]?)?(?:\(?\d{3}\)?[.\-\s]?\d{3}[.\-\s]?\d{4})\s*$/.test(a))return{valid:!1,message:"Please enter a valid phone number (10 digits)."};let t=a.replace(/\D/g,"");if(t.length===11&&t.startsWith("1")&&(t=t.slice(1)),t.length!==10)return{valid:!1,message:"Phone number must have exactly 10 digits."};const n=t.slice(0,3),s=t.slice(3,6),r=t.slice(6);return n[0]<"2"||n[0]>"9"?{valid:!1,message:"Area code must start with digits 2-9."}:s[0]<"2"||s[0]>"9"?{valid:!1,message:"Phone number prefix must start with digits 2-9."}:s==="000"||r==="0000"?{valid:!1,message:"Please enter a realistic phone number, not all zeros."}:/^(\d)\1{9}$/.test(t)?{valid:!1,message:"Please enter a realistic phone number."}:n===s&&s===r?{valid:!1,message:"Please enter a realistic phone number."}:(l=>{let i=!0,c=!0;for(let m=1;m<l.length;m++)parseInt(l[m])!==parseInt(l[m-1])+1&&(i=!1),parseInt(l[m])!==parseInt(l[m-1])-1&&(c=!1);return i||c})(t)?{valid:!1,message:"Please enter a realistic phone number."}:{valid:!0,message:""}}class z extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this.zooAnimals=[];const a=document.createElement("div");a.className="exhibit-wrapper";const e=this._createPanel("Browse by Animal");this.selectedAnimalDropdown=document.createElement("select"),this.selectedAnimalDropdown.setAttribute("aria-label","Animal Dropdown"),this.animalCardContainer=document.createElement("div"),this.animalCardContainer.className="card-container";const t=this._createRow(this.selectedAnimalDropdown);e.append(t,this.animalCardContainer);const n=this._createPanel("Search the Zoo");this.searchQueryInput=document.createElement("input"),this.searchQueryInput.type="search",this.searchQueryInput.placeholder="Search by name or class...",this.searchResultsList=document.createElement("ul"),this.searchResultsList.className="results-list",n.append(this.searchQueryInput,this.searchResultsList);const s=this._createPanel("Add an Animal");this.addAnimalForm=document.createElement("form"),this.addAnimalForm.className="form-add",this.formMessage=document.createElement("p"),this.formMessage.className="form-message";const r="^(?:[A-Za-z]{2,}|[A-Za-z][ \\-][A-Za-z])(?:[ \\-][A-Za-z]+)*$",o=this._field("Species *","species","input",{type:"text",required:"",minlength:"2",maxlength:"40",pattern:r,title:"Letters only (spaces or hyphens allowed, at least 2 letters)"}),l=this._field("Class *","class","input",{type:"text",required:"",minlength:"2",maxlength:"40",pattern:r,title:"Letters only (spaces or hyphens allowed, at least 2 letters)"}),i=this._field("Conservation Status *","conservationStatus","select",{required:""}),c=i.querySelector("select");["","Least Concern","Near Threatened","Vulnerable","Endangered","Critically Endangered"].forEach(g=>{const y=document.createElement("option");y.value=g,y.textContent=g||"— Select status —",c.appendChild(y)});const m=this._field("Habitat *","habitat","input",{type:"text",required:"",minlength:"2",maxlength:"60",pattern:r,title:"Letters only (spaces or hyphens allowed, at least 2 letters)"}),p=this._field("Image URL","img","input",{type:"url",placeholder:"https://…",pattern:"^https://.+",title:"Must start with https:// and end with .png, .jpg, .jpeg, or .gif"}),u=this._field("Description *","description","textarea",{rows:"3",placeholder:"Short description",required:"",minlength:"10",maxlength:"500"}),x=this._field("Fun Fact","more","input",{type:"text",placeholder:"Optional",maxlength:"120"}),b=this._createButton("Add to Zoo","primary");b.type="submit";const f=this._createButton("Reset","ghost");f.type="reset";const h=this._createRow([b,f]);this.addAnimalForm.append(o,l,i,m,p,u,x,h,this.formMessage),s.append(this.addAnimalForm),this._attachValidation(),a.append(e,n,s);const v=document.createElement("style");v.textContent=`
        :host { display: block; font-family: system-ui, sans-serif; color: #f0f4ff; --label-w: 160px; --field-w: 420px;}
        .exhibit-wrapper { display: grid; gap: 20px; }
        .panel { 
            background: #101820; 
            border-radius: 12px; 
            padding: 16px; 
            box-shadow: 0 4px 12px rgba(0,0,0,.3); 
            }
        .panel h2 { margin-top: 0; font-size: 1.25rem; }
        .row { display: flex; gap: 10px; flex-wrap: wrap; margin: 10px 0; }
        .card-container { margin-top: 12px; }
        .results-list { list-style: none; padding: 0; margin: 0; }
        .results-list li { 
            background: #182635; 
            border-radius: 8px; 
            padding: 6px 10px; 
            margin-top: 6px; 
            cursor: pointer; 
            }
        .btn { padding: 8px 14px; border-radius: 8px; cursor: pointer; border: none; }
        .btn.primary { background: #5aa2ff; color: #000; margin-left: 1rem;}
        .btn.ghost { background: transparent; border: 1px solid #5aa2ff; }
        .form-message { min-height: 1em; font-size: 0.9rem; color: #53e0c1; }
        /* Add-form layout */
        .form-add {
        display: grid;
        row-gap: 12px;
        }
        .form-add .field {
        display: grid;
        grid-template-columns: var(--label-w) minmax(0, var(--field-w));
        align-items: center;
        column-gap: 16px;
        }
        .form-add label {
        font-weight: 600;
        }
        /* inputs look tidy */
        .form-add input,
        .form-add select,
        .form-add textarea {
        width: 100%;
        padding: 8px 10px;
        border: 1px solid var(--border, #1a2440);
        background: #0b1223;
        color: inherit;
        border-radius: 10px;
        }
        /* stack label above input on small screens */
        @media (max-width: 640px) {
            .form-add .field {
                grid-template-columns: 1fr;
                row-gap: 6px;
            }
        }
        .field-error {
            color: #ffb4a3;
            font-size: 12px;
            margin-top: 4px;
            min-height: 1.2em; /* reserves space even when empty */
            }
        .is-invalid input,
        .is-invalid select,
        .is-invalid textarea {
            border-color: #b23a3a;
            outline: none;
            }
        `,this.shadowRoot.append(v,a)}connectedCallback(){this._wireEvents(),this._loadAnimals()}_clearNode(a){for(;a.firstChild;)a.removeChild(a.firstChild)}_createPanel(a){const e=document.createElement("section");e.className="panel";const t=document.createElement("h2");return t.textContent=a,e.appendChild(t),e}_createRow(a){const e=document.createElement("div");e.className="row";const t=Array.isArray(a)?a:[a];for(const n of t)n&&e.appendChild(n);return e}_createButton(a,e){const t=document.createElement("button");return t.textContent=a,t.className="btn"+(e?" "+e:""),t}_createLabeledInput(a,e,t){const n=document.createElement("label");n.textContent=a;const s=document.createElement("input");return s.type=e,s.name=t,n.appendChild(s),n}_createLabeledSelect(a,e,t){const n=document.createElement("label");n.textContent=a;const s=document.createElement("select");return s.name=e,t.forEach(r=>{const o=document.createElement("option");o.value=r,o.textContent=r||"Select...",s.appendChild(o)}),n.appendChild(s),n}async _loadAnimals(){try{const a=await fetch(`${w}/animals`,{cache:"no-store"});if(!a.ok)throw new Error(`Fetch failed: ${a.status}`);const e=await a.json();console.log("Fetched data:",e),this.zooAnimals=Array.isArray(e.animals)?e.animals:e,this._populateDropdown()}catch(a){console.error("Animal load error:",a),this.animalCardContainer.textContent="Could not load animals."}}_populateDropdown(){this._clearNode(this.selectedAnimalDropdown);const a=document.createElement("option");a.value="",a.textContent="- Select an Animal -",this.selectedAnimalDropdown.appendChild(a),this.zooAnimals.forEach(e=>{const t=document.createElement("option");t.value=e.name,t.textContent=e.name,this.selectedAnimalDropdown.appendChild(t)})}_field(a,e,t="input",n={}){const s=document.createElement("div");s.className="field";const r=document.createElement("label");r.setAttribute("for",e),r.textContent=a;const o=document.createElement(t);o.name=e,o.id=e,Object.entries(n).forEach(([i,c])=>o.setAttribute(i,c));const l=document.createElement("div");return l.className="field-error",l.id=`${e}-error`,l.setAttribute("aria-live","polite"),o.setAttribute("aria-describedby",l.id),s.append(r,o,l),s}_getField(a){const e=this.addAnimalForm.querySelector(`[name="${a}"]`),t=e?.closest(".field"),n=t?.querySelector(".field-error");return{wrap:t,control:e,error:n}}_setError(a,e){const{wrap:t,control:n,error:s}=this._getField(a);t&&(e?(t.classList.add("is-invalid"),n?.setAttribute("aria-invalid","true"),s&&(s.textContent=e)):(t.classList.remove("is-invalid"),n?.removeAttribute("aria-invalid"),s&&(s.textContent="")))}_validateField(a){const{control:e}=this._getField(a);if(!e)return!0;const t=e.tagName.toLowerCase(),n=e.getAttribute("type")||"";(t==="input"&&(n==="text"||n==="url")||t==="textarea")&&(e.value=e.value.trim());const s=e.validity,r={species:"Species",class:"Class",conservationStatus:"Conservation Status",habitat:"Habitat",img:"Image URL",description:"Description",more:"Fun Fact"};let o="";if(s.valueMissing?o=`${r[e.name]||"This field"} is required.`:s.tooShort?o=`Please enter at least ${e.getAttribute("minlength")} characters.`:s.tooLong?o=`Please use at most ${e.getAttribute("maxlength")} characters.`:s.typeMismatch&&e.type==="url"?o="Please enter a valid URL (https://…).":s.patternMismatch&&(["species","class","habitat"].includes(e.name)?o=`${r[e.name]} must contain letters only (you may use spaces or hyphens) and at least 2 letters.`:o="Please match the requested format."),!o&&e.name==="conservationStatus"&&e.value===""&&(o="Please select a conservation status."),!o&&e.name==="img"&&e.value){const l=e.value.trim();if(!/^https:\/\//i.test(l))o="Image URL must start with https://";else{let i=l;try{i=new URL(l).pathname}catch{}/\.(png|jpe?g|gif)$/i.test(i)||(o="Please use a URL ending in .png, .jpg, .jpeg, or .gif")}}return this._setError(e.name,o),!o}_validateForm(){const a=["species","class","conservationStatus","habitat","img","description","more"];let e=null,t=!0;for(const n of a){const s=this._validateField(n);!s&&!e&&(e=this._getField(n).control),t=t&&s}return!t&&e&&e.focus(),t}_attachValidation(){this.addAnimalForm.querySelectorAll("input, select, textarea").forEach(e=>{e.addEventListener("blur",()=>this._validateField(e.name)),e.addEventListener("input",()=>{e.checkValidity()&&this._setError(e.name,"")}),e.tagName.toLowerCase()==="select"&&e.addEventListener("change",()=>this._validateField(e.name))})}_wireEvents(){this.selectedAnimalDropdown.addEventListener("change",async()=>{const a=this.zooAnimals.find(e=>e.name===this.selectedAnimalDropdown.value);a&&this._renderCard(a)}),this.searchQueryInput.addEventListener("input",async()=>{const a=(this.searchQueryInput.value||"").trim().toLowerCase();if(this._clearNode(this.searchResultsList),!a)return;const e=n=>String(n??"").toLowerCase(),t=this.zooAnimals.filter(n=>[n.name,n.type,n.class,n.species,n.habitat,n.conservationStatus].some(r=>e(r).includes(a)));if(t.length===0){const n=document.createElement("li");n.textContent="No matches",n.className="muted",this.searchResultsList.appendChild(n);return}for(const n of t){const s=document.createElement("li"),r=n?.name??"Unknown",o=n?.type??n?.class??n?.species??"";s.textContent=o?`${r} (${o})`:r,s.addEventListener("click",()=>this._renderCard(n)),this.searchResultsList.appendChild(s)}}),this.addAnimalForm.addEventListener("submit",async a=>{if(a.preventDefault(),!this._validateForm())return;const e=new FormData(this.addAnimalForm),t={name:e.get("species"),type:e.get("class"),conservationStatus:e.get("conservationStatus"),habitat:e.get("habitat"),image:e.get("img")||"images/comingSoon.png",description:e.get("description"),funFact:e.get("more")};try{const n=await fetch(`${w}/animals`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)});if(!n.ok)throw new Error(`Create failed: ${n.status}`);const s=await n.json();this.zooAnimals.push(s),this._populateDropdown(),this.formMessage.textContent="Animal added!",this.addAnimalForm.reset(),["species","class","conservationStatus","habitat","img","description","more"].forEach(r=>this._setError(r,"")),setTimeout(()=>this.formMessage.textContent="",4e3)}catch(n){console.error(n),this.formMessage.textContent="Error: could not save animal."}}),this.phoneForm&&this.phoneForm.addEventListener("submit",a=>this._handlePhoneSubmit(a))}_renderCard(a){this._clearNode(this.animalCardContainer);const e=document.createElement("div");e.className="animal-card";const t=document.createElement("img");t.src=a.image,t.alt=a.name;const n=document.createElement("h3");n.textContent=a.name;const s=document.createElement("p");s.textContent=`Class: ${a.type}`;const r=document.createElement("p");r.textContent=`Status: ${a.conservationStatus}`;const o=document.createElement("p");o.textContent=`Habitat: ${a.habitat}`;const l=document.createElement("p");l.textContent=a.description||"";const i=this._createButton("Adopt","primary");i.addEventListener("click",()=>{F(a.name,(c,m,p)=>{console.log(`Adopted ${c}${p!==c?` as ${p}`:""} with phone ${m}`)})}),e.append(t,n,s,r,o,l,i),this.animalCardContainer.appendChild(e)}}customElements.define("animal-exhibit",z);
