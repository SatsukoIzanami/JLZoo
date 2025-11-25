(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))o(t);new MutationObserver(t=>{for(const a of t)if(a.type==="childList")for(const i of a.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&o(i)}).observe(document,{childList:!0,subtree:!0});function e(t){const a={};return t.integrity&&(a.integrity=t.integrity),t.referrerPolicy&&(a.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?a.credentials="include":t.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function o(t){if(t.ep)return;t.ep=!0;const a=e(t);fetch(t.href,a)}})();class P extends HTMLElement{constructor(){super();const n=this.attachShadow({mode:"open"}),e=document.createElement("style");e.textContent=`
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
            `;const o=document.createElement("nav");o.className="navbar";const t=document.createElement("a");t.className="brand",t.href="index.html",t.textContent="JL Zoo";const a=document.createElement("div");a.className="links";const i=(s,r)=>{const l=document.createElement("a");return l.href=r,l.textContent=s,l};a.append(i("Home","index.html"),i("About","about.html"),i("Contact","contact.html")),o.append(t,a),n.append(e,o)}}customElements.define("site-nav",P);const w=location.hostname.endsWith("github.io")?"https://jlzoo.onrender.com/api":"http://localhost:3000/api";class N extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this.zooAnimals=[],this.adoptedAnimals=new Set,this.adoptionContacts=new Map,this.pendingAdoption=null;const n=document.createElement("div");n.className="exhibit-wrapper";const e=this._createPanel("Browse by Animal");this.selectedAnimalDropdown=document.createElement("select"),this.selectedAnimalDropdown.setAttribute("aria-label","Animal Dropdown"),this.animalCardContainer=document.createElement("div"),this.animalCardContainer.className="card-container";const o=this._createRow(this.selectedAnimalDropdown);e.append(o,this.animalCardContainer);const t=this._createPanel("Search the Zoo");this.searchQueryInput=document.createElement("input"),this.searchQueryInput.type="search",this.searchQueryInput.placeholder="Search by name or class...",this.searchResultsList=document.createElement("ul"),this.searchResultsList.className="results-list",t.append(this.searchQueryInput,this.searchResultsList);const a=this._createPanel("Add an Animal");this.addAnimalForm=document.createElement("form"),this.addAnimalForm.className="form-add",this.formMessage=document.createElement("p"),this.formMessage.className="form-message";const i="^(?:[A-Za-z]{2,}|[A-Za-z][ \\-][A-Za-z])(?:[ \\-][A-Za-z]+)*$",s=this._field("Species *","species","input",{type:"text",required:"",minlength:"2",maxlength:"40",pattern:i,title:"Letters only (spaces or hyphens allowed, at least 2 letters)"}),r=this._field("Class *","class","input",{type:"text",required:"",minlength:"2",maxlength:"40",pattern:i,title:"Letters only (spaces or hyphens allowed, at least 2 letters)"}),l=this._field("Conservation Status *","conservationStatus","select",{required:""}),d=l.querySelector("select");["","Least Concern","Near Threatened","Vulnerable","Endangered","Critically Endangered"].forEach(C=>{const h=document.createElement("option");h.value=C,h.textContent=C||"— Select status —",d.appendChild(h)});const A=this._field("Habitat *","habitat","input",{type:"text",required:"",minlength:"2",maxlength:"60",pattern:i,title:"Letters only (spaces or hyphens allowed, at least 2 letters)"}),_=this._field("Image URL","img","input",{type:"url",placeholder:"https://…",pattern:"^https://.+",title:"Must start with https:// and end with .png, .jpg, .jpeg, or .gif"}),L=this._field("Description *","description","textarea",{rows:"3",placeholder:"Short description",required:"",minlength:"10",maxlength:"500"}),F=this._field("Fun Fact","more","input",{type:"text",placeholder:"Optional",maxlength:"120"}),f=this._createButton("Add to Zoo","primary");f.type="submit";const g=this._createButton("Reset","ghost");g.type="reset";const S=this._createRow([f,g]);this.addAnimalForm.append(s,r,l,A,_,L,F,S,this.formMessage),a.append(this.addAnimalForm),this._attachValidation();const b=this._createPanel("Adopted Animals");this.adoptedAnimalsList=document.createElement("ul"),this.adoptedAnimalsList.className="adopted-list",b.append(this.adoptedAnimalsList),this.phoneModal=document.createElement("div"),this.phoneModal.className="modal";const c=document.createElement("div");c.className="modal-dialog";const x=document.createElement("h3");x.textContent="Adopt this animal!";const y=document.createElement("p");y.textContent="Enter a phone number so we can notify you about your adopted animal.",this.phoneForm=document.createElement("form"),this.phoneInput=document.createElement("input"),this.phoneInput.type="tel",this.phoneInput.name="phone",this.phoneInput.required=!0,this.phoneInput.placeholder="ie. 715-555-1234",this.phoneInput.setAttribute("autocomplete","tel"),this.phoneError=document.createElement("div"),this.phoneError.className="modal-error",this.phoneError.setAttribute("aria-live","polite");const p=document.createElement("div");p.className="modal-actions";const m=this._createButton("Cancel","ghost");m.type="button";const E=this._createButton("Confirm Adoption","primary");E.type="submit",p.append(m,E),this.phoneForm.append(this.phoneInput,this.phoneError,p),c.append(x,y,this.phoneForm),this.phoneModal.appendChild(c),m.addEventListener("click",()=>this._closePhoneModal()),this.phoneInput.addEventListener("input",()=>{this.phoneError.textContent=""}),n.append(e,t,a,b);const v=document.createElement("style");v.textContent=`
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
        .results-list, .adopted-list { list-style: none; padding: 0; margin: 0; }
        .results-list li, .adopted-list li { 
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
        .adopted-list { padding-left: 0; list-style: none; }
        .adopted-list li {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 8px;
            padding: 6px 8px;
            border: 1px solid var(--border, #1a2440);
            border-radius: 8px;
            margin: 6px 0;
            }
        .btn.sm { padding: 4px 8px; font-size: 12px; border-radius: 8px; }
        .btn.danger { background: #4a1111; border-color: #6b1b1b; }
        .btn.danger:hover { background: #5a1515; }
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
                .adopt-info {
            flex: 1 1 auto;
            display: flex;
            flex-direction: column;
        }
        .adopt-phone {
            font-size: 11px;
            opacity: 0.8;
        }

        .modal {
            position: fixed;
            inset: 0;
            display: none;
            align-items: center;
            justify-content: center;
            background: rgba(0,0,0,0.6);
            z-index: 1000;
        }
        .modal.open {
            display: flex;
        }
        .modal-dialog {
            background: #101820;
            padding: 16px 20px;
            border-radius: 12px;
            max-width: 340px;
            width: 90%;
            box-shadow: 0 8px 24px rgba(0,0,0,0.5);
        }
        .modal-dialog h3 {
            margin-top: 0;
            margin-bottom: 0.5rem;
        }
        .modal-dialog p {
            margin-top: 0;
            margin-bottom: 0.75rem;
            font-size: 0.9rem;
        }
        .modal-dialog input[type="tel"] {
            width: 100%;
            padding: 8px 10px;
            border-radius: 10px;
            border: 1px solid var(--border, #1a2440);
            background: #0b1223;
            color: inherit;
        }
        .modal-actions {
            display: flex;
            justify-content: flex-end;
            gap: 8px;
            margin-top: 12px;
        }
        .modal-error {
            color: #ffb4a3;
            font-size: 12px;
            margin-top: 4px;
            min-height: 1.2em;
        }
        `,this.shadowRoot.append(v,n,this.phoneModal)}connectedCallback(){this._wireEvents(),this._loadAnimals()}_clearNode(n){for(;n.firstChild;)n.removeChild(n.firstChild)}_createPanel(n){const e=document.createElement("section");e.className="panel";const o=document.createElement("h2");return o.textContent=n,e.appendChild(o),e}_createRow(n){const e=document.createElement("div");e.className="row";const o=Array.isArray(n)?n:[n];for(const t of o)t&&e.appendChild(t);return e}_createButton(n,e){const o=document.createElement("button");return o.textContent=n,o.className="btn"+(e?" "+e:""),o}_createLabeledInput(n,e,o){const t=document.createElement("label");t.textContent=n;const a=document.createElement("input");return a.type=e,a.name=o,t.appendChild(a),t}_createLabeledSelect(n,e,o){const t=document.createElement("label");t.textContent=n;const a=document.createElement("select");return a.name=e,o.forEach(i=>{const s=document.createElement("option");s.value=i,s.textContent=i||"Select...",a.appendChild(s)}),t.appendChild(a),t}async _loadAnimals(){try{const n=await fetch(`${w}/animals`,{cache:"no-store"});if(!n.ok)throw new Error(`Fetch failed: ${n.status}`);const e=await n.json();console.log("Fetched data:",e),this.zooAnimals=Array.isArray(e.animals)?e.animals:e,this._populateDropdown()}catch(n){console.error("Animal load error:",n),this.animalCardContainer.textContent="Could not load animals."}}_populateDropdown(){this._clearNode(this.selectedAnimalDropdown);const n=document.createElement("option");n.value="",n.textContent="- Select an Animal -",this.selectedAnimalDropdown.appendChild(n),this.zooAnimals.forEach(e=>{const o=document.createElement("option");o.value=e.name,o.textContent=e.name,this.selectedAnimalDropdown.appendChild(o)})}_field(n,e,o="input",t={}){const a=document.createElement("div");a.className="field";const i=document.createElement("label");i.setAttribute("for",e),i.textContent=n;const s=document.createElement(o);s.name=e,s.id=e,Object.entries(t).forEach(([l,d])=>s.setAttribute(l,d));const r=document.createElement("div");return r.className="field-error",r.id=`${e}-error`,r.setAttribute("aria-live","polite"),s.setAttribute("aria-describedby",r.id),a.append(i,s,r),a}_getField(n){const e=this.addAnimalForm.querySelector(`[name="${n}"]`),o=e?.closest(".field"),t=o?.querySelector(".field-error");return{wrap:o,control:e,error:t}}_setError(n,e){const{wrap:o,control:t,error:a}=this._getField(n);o&&(e?(o.classList.add("is-invalid"),t?.setAttribute("aria-invalid","true"),a&&(a.textContent=e)):(o.classList.remove("is-invalid"),t?.removeAttribute("aria-invalid"),a&&(a.textContent="")))}_validateField(n){const{control:e}=this._getField(n);if(!e)return!0;const o=e.tagName.toLowerCase(),t=e.getAttribute("type")||"";(o==="input"&&(t==="text"||t==="url")||o==="textarea")&&(e.value=e.value.trim());const a=e.validity,i={species:"Species",class:"Class",conservationStatus:"Conservation Status",habitat:"Habitat",img:"Image URL",description:"Description",more:"Fun Fact"};let s="";if(a.valueMissing?s=`${i[e.name]||"This field"} is required.`:a.tooShort?s=`Please enter at least ${e.getAttribute("minlength")} characters.`:a.tooLong?s=`Please use at most ${e.getAttribute("maxlength")} characters.`:a.typeMismatch&&e.type==="url"?s="Please enter a valid URL (https://…).":a.patternMismatch&&(["species","class","habitat"].includes(e.name)?s=`${i[e.name]} must contain letters only (you may use spaces or hyphens) and at least 2 letters.`:s="Please match the requested format."),!s&&e.name==="conservationStatus"&&e.value===""&&(s="Please select a conservation status."),!s&&e.name==="img"&&e.value){const r=e.value.trim();if(!/^https:\/\//i.test(r))s="Image URL must start with https://";else{let l=r;try{l=new URL(r).pathname}catch{}/\.(png|jpe?g|gif)$/i.test(l)||(s="Please use a URL ending in .png, .jpg, .jpeg, or .gif")}}return this._setError(e.name,s),!s}_validateForm(){const n=["species","class","conservationStatus","habitat","img","description","more"];let e=null,o=!0;for(const t of n){const a=this._validateField(t);!a&&!e&&(e=this._getField(t).control),o=o&&a}return!o&&e&&e.focus(),o}_attachValidation(){this.addAnimalForm.querySelectorAll("input, select, textarea").forEach(e=>{e.addEventListener("blur",()=>this._validateField(e.name)),e.addEventListener("input",()=>{e.checkValidity()&&this._setError(e.name,"")}),e.tagName.toLowerCase()==="select"&&e.addEventListener("change",()=>this._validateField(e.name))})}_openPhoneModal(n){console.log("Opening adoption modal for:",n?.name),this.pendingAdoption=n,this.phoneInput&&(this.phoneInput.value="",this.phoneError.textContent="",setTimeout(()=>this.phoneInput.focus(),0)),this.phoneModal&&this.phoneModal.classList.add("open")}_closePhoneModal(){this.phoneModal&&this.phoneModal.classList.remove("open"),this.pendingAdoption=null}_handlePhoneSubmit(n){if(n.preventDefault(),!this.pendingAdoption){this._closePhoneModal();return}const e=(this.phoneInput?.value||"").trim();if(!/^\s*(?:\+?1[.\-\s]?)?(?:\(?\d{3}\)?[.\-\s]?\d{3}[.\-\s]?\d{4})\s*$/.test(e)){this.phoneError.textContent="Please enter a valid phone number (10 digits).",this.phoneInput?.focus();return}let t=e.replace(/\D/g,"");if(t.length===11&&t.startsWith("1")&&(t=t.slice(1)),t.length!==10){this.phoneError.textContent="Phone number must have exactly 10 digits.",this.phoneInput?.focus();return}const a=t.slice(0,3),i=t.slice(3,6),s=t.slice(6);if(a[0]<"2"||a[0]>"9"){this.phoneError.textContent="Area code must start with digits 2–9.",this.phoneInput?.focus();return}if(i[0]<"2"||i[0]>"9"){this.phoneError.textContent="Phone number prefix must start with digits 2–9.",this.phoneInput?.focus();return}if(i==="000"||s==="0000"){this.phoneError.textContent="Please enter a realistic phone number, not all zeros.",this.phoneInput?.focus();return}if(/^(\d)\1{9}$/.test(t)){this.phoneError.textContent="Please enter a realistic phone number.",this.phoneInput?.focus();return}this.adoptedAnimals.add(this.pendingAdoption.name),this.adoptionContacts&&this.adoptionContacts.set(this.pendingAdoption.name,e),this._renderAdoptedList(),this._closePhoneModal()}_renderAdoptedList(){if(this._clearNode(this.adoptedAnimalsList),!this.adoptedAnimals||this.adoptedAnimals.size===0){const n=document.createElement("li");n.className="muted",n.textContent="No adopted animals yet.",this.adoptedAnimalsList.appendChild(n);return}for(const n of this.adoptedAnimals){const e=document.createElement("li"),o=document.createElement("div");o.className="adopt-info";const t=document.createElement("span");t.textContent=n;const a=this.adoptionContacts?.get(n),i=document.createElement("span");i.className="adopt-phone",i.textContent=a?`Phone: ${a}`:"",o.append(t),a&&o.append(i);const s=document.createElement("button");s.type="button",s.className="btn danger sm",s.textContent="Remove",s.setAttribute("aria-label",`Remove adoption for ${n}`),s.addEventListener("click",()=>this._unadopt(n)),e.append(o,s),this.adoptedAnimalsList.appendChild(e)}}_unadopt(n){n&&this.adoptedAnimals?.delete(n)&&(this.adoptionContacts?.delete(n),this._renderAdoptedList())}_wireEvents(){this.selectedAnimalDropdown.addEventListener("change",async()=>{const n=this.zooAnimals.find(e=>e.name===this.selectedAnimalDropdown.value);n&&this._renderCard(n)}),this.searchQueryInput.addEventListener("input",async()=>{const n=(this.searchQueryInput.value||"").trim().toLowerCase();if(this._clearNode(this.searchResultsList),!n)return;const e=t=>String(t??"").toLowerCase(),o=this.zooAnimals.filter(t=>[t.name,t.type,t.class,t.species,t.habitat,t.conservationStatus].some(i=>e(i).includes(n)));if(o.length===0){const t=document.createElement("li");t.textContent="No matches",t.className="muted",this.searchResultsList.appendChild(t);return}for(const t of o){const a=document.createElement("li"),i=t?.name??"Unknown",s=t?.type??t?.class??t?.species??"";a.textContent=s?`${i} (${s})`:i,a.addEventListener("click",()=>this._renderCard(t)),this.searchResultsList.appendChild(a)}}),this.addAnimalForm.addEventListener("submit",async n=>{if(n.preventDefault(),!this._validateForm())return;const e=new FormData(this.addAnimalForm),o={name:e.get("species"),type:e.get("class"),conservationStatus:e.get("conservationStatus"),habitat:e.get("habitat"),image:e.get("img")||"images/comingSoon.png",description:e.get("description"),funFact:e.get("more")};try{const t=await fetch(`${w}/animals`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(o)});if(!t.ok)throw new Error(`Create failed: ${t.status}`);const a=await t.json();this.zooAnimals.push(a),this._populateDropdown(),this.formMessage.textContent="Animal added!",this.addAnimalForm.reset(),["species","class","conservationStatus","habitat","img","description","more"].forEach(i=>this._setError(i,"")),setTimeout(()=>this.formMessage.textContent="",4e3)}catch(t){console.error(t),this.formMessage.textContent="Error: could not save animal."}}),this.phoneForm&&this.phoneForm.addEventListener("submit",n=>this._handlePhoneSubmit(n))}_renderCard(n){this._clearNode(this.animalCardContainer);const e=document.createElement("div");e.className="animal-card";const o=document.createElement("img");o.src=n.image,o.alt=n.name;const t=document.createElement("h3");t.textContent=n.name;const a=document.createElement("p");a.textContent=`Class: ${n.type}`;const i=document.createElement("p");i.textContent=`Status: ${n.conservationStatus}`;const s=document.createElement("p");s.textContent=`Habitat: ${n.habitat}`;const r=document.createElement("p");r.textContent=n.description||"";const l=this._createButton("Adopt","primary");l.addEventListener("click",()=>{this._openPhoneModal(n)}),e.append(o,t,a,i,s,r,l),this.animalCardContainer.appendChild(e)}}customElements.define("animal-exhibit",N);
