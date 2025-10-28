(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))a(t);new MutationObserver(t=>{for(const s of t)if(s.type==="childList")for(const i of s.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&a(i)}).observe(document,{childList:!0,subtree:!0});function e(t){const s={};return t.integrity&&(s.integrity=t.integrity),t.referrerPolicy&&(s.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?s.credentials="include":t.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function a(t){if(t.ep)return;t.ep=!0;const s=e(t);fetch(t.href,s)}})();class A extends HTMLElement{constructor(){super();const n=this.attachShadow({mode:"open"}),e=document.createElement("style");e.textContent=`
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
            `;const a=document.createElement("nav");a.className="navbar";const t=document.createElement("a");t.className="brand",t.href="index.html",t.textContent="JL Zoo";const s=document.createElement("div");s.className="links";const i=(o,r)=>{const l=document.createElement("a");return l.href=r,l.textContent=o,l};s.append(i("Home","index.html"),i("About","about.html"),i("Contact","contact.html")),a.append(t,s),n.append(e,a)}}customElements.define("site-nav",A);const b=location.hostname.endsWith("github.io")?"https://jlzoo.onrender.com/api":"http://localhost:3000/api";class C extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this.zooAnimals=[],this.adoptedAnimals=new Set;const n=document.createElement("div");n.className="exhibit-wrapper";const e=this._createPanel("Browse by Animal");this.selectedAnimalDropdown=document.createElement("select"),this.selectedAnimalDropdown.setAttribute("aria-label","Animal Dropdown"),this.animalCardContainer=document.createElement("div"),this.animalCardContainer.className="card-container";const a=this._createRow(this.selectedAnimalDropdown);e.append(a,this.animalCardContainer);const t=this._createPanel("Search the Zoo");this.searchQueryInput=document.createElement("input"),this.searchQueryInput.type="search",this.searchQueryInput.placeholder="Search by name or class...",this.searchResultsList=document.createElement("ul"),this.searchResultsList.className="results-list",t.append(this.searchQueryInput,this.searchResultsList);const s=this._createPanel("Add an Animal");this.addAnimalForm=document.createElement("form"),this.addAnimalForm.className="form-add",this.formMessage=document.createElement("p"),this.formMessage.className="form-message";const i="^(?:[A-Za-z]{2,}|[A-Za-z][ \\-][A-Za-z])(?:[ \\-][A-Za-z]+)*$",o=this._field("Species *","species","input",{type:"text",required:"",minlength:"2",maxlength:"40",pattern:i,title:"Letters only (spaces or hyphens allowed, at least 2 letters)"}),r=this._field("Class *","class","input",{type:"text",required:"",minlength:"2",maxlength:"40",pattern:i,title:"Letters only (spaces or hyphens allowed, at least 2 letters)"}),l=this._field("Conservation Status *","conservationStatus","select",{required:""}),d=l.querySelector("select");["","Least Concern","Near Threatened","Vulnerable","Endangered","Critically Endangered"].forEach(g=>{const c=document.createElement("option");c.value=g,c.textContent=g||"— Select status —",d.appendChild(c)});const x=this._field("Habitat *","habitat","input",{type:"text",required:"",minlength:"2",maxlength:"60",pattern:i,title:"Letters only (spaces or hyphens allowed, at least 2 letters)"}),y=this._field("Image URL","img","input",{type:"url",placeholder:"https://…",pattern:"^https://.+",title:"Must start with https:// and end with .png, .jpg, .jpeg, or .gif"}),v=this._field("Description *","description","textarea",{rows:"3",placeholder:"Short description",required:"",minlength:"10",maxlength:"500"}),E=this._field("Fun Fact","more","input",{type:"text",placeholder:"Optional",maxlength:"120"}),m=this._createButton("Add to Zoo","primary");m.type="submit";const u=this._createButton("Reset","ghost");u.type="reset";const w=this._createRow([m,u]);this.addAnimalForm.append(o,r,l,x,y,v,E,w,this.formMessage),s.append(this.addAnimalForm),this._attachValidation();const h=this._createPanel("Adopted Animals");this.adoptedAnimalsList=document.createElement("ul"),this.adoptedAnimalsList.className="adopted-list",h.append(this.adoptedAnimalsList),n.append(e,t,s,h);const f=document.createElement("style");f.textContent=`
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
        `,this.shadowRoot.append(f,n)}connectedCallback(){this._wireEvents(),this._loadAnimals()}_createPanel(n){const e=document.createElement("section");e.className="panel";const a=document.createElement("h2");return a.textContent=n,e.appendChild(a),e}_createRow(n){const e=document.createElement("div");e.className="row";const a=Array.isArray(n)?n:[n];for(const t of a)t&&e.appendChild(t);return e}_createButton(n,e){const a=document.createElement("button");return a.textContent=n,a.className="btn"+(e?" "+e:""),a}_createLabeledInput(n,e,a){const t=document.createElement("label");t.textContent=n;const s=document.createElement("input");return s.type=e,s.name=a,t.appendChild(s),t}_createLabeledSelect(n,e,a){const t=document.createElement("label");t.textContent=n;const s=document.createElement("select");return s.name=e,a.forEach(i=>{const o=document.createElement("option");o.value=i,o.textContent=i||"Select...",s.appendChild(o)}),t.appendChild(s),t}async _loadAnimals(){try{const n=await fetch(`${b}/animals`,{cache:"no-store"});if(!n.ok)throw new Error(`Fetch failed: ${n.status}`);const e=await n.json();console.log("Fetched data:",e),this.zooAnimals=Array.isArray(e.animals)?e.animals:e,this._populateDropdown()}catch(n){console.error("Animal load error:",n),this.animalCardContainer.textContent="Could not load animals."}}_populateDropdown(){this.selectedAnimalDropdown.innerHTML="";const n=document.createElement("option");n.value="",n.textContent="- Select an Animal -",this.selectedAnimalDropdown.appendChild(n),this.zooAnimals.forEach(e=>{const a=document.createElement("option");a.value=e.name,a.textContent=e.name,this.selectedAnimalDropdown.appendChild(a)})}_field(n,e,a="input",t={}){const s=document.createElement("div");s.className="field";const i=document.createElement("label");i.setAttribute("for",e),i.textContent=n;const o=document.createElement(a);o.name=e,o.id=e,Object.entries(t).forEach(([l,d])=>o.setAttribute(l,d));const r=document.createElement("div");return r.className="field-error",r.id=`${e}-error`,r.setAttribute("aria-live","polite"),o.setAttribute("aria-describedby",r.id),s.append(i,o,r),s}_getField(n){const e=this.addAnimalForm.querySelector(`[name="${n}"]`),a=e?.closest(".field"),t=a?.querySelector(".field-error");return{wrap:a,control:e,error:t}}_setError(n,e){const{wrap:a,control:t,error:s}=this._getField(n);a&&(e?(a.classList.add("is-invalid"),t?.setAttribute("aria-invalid","true"),s&&(s.textContent=e)):(a.classList.remove("is-invalid"),t?.removeAttribute("aria-invalid"),s&&(s.textContent="")))}_validateField(n){const{control:e}=this._getField(n);if(!e)return!0;const a=e.tagName.toLowerCase(),t=e.getAttribute("type")||"";(a==="input"&&(t==="text"||t==="url")||a==="textarea")&&(e.value=e.value.trim());const s=e.validity,i={species:"Species",class:"Class",conservationStatus:"Conservation Status",habitat:"Habitat",img:"Image URL",description:"Description",more:"Fun Fact"};let o="";if(s.valueMissing?o=`${i[e.name]||"This field"} is required.`:s.tooShort?o=`Please enter at least ${e.getAttribute("minlength")} characters.`:s.tooLong?o=`Please use at most ${e.getAttribute("maxlength")} characters.`:s.typeMismatch&&e.type==="url"?o="Please enter a valid URL (https://…).":s.patternMismatch&&(["species","class","habitat"].includes(e.name)?o=`${i[e.name]} must contain letters only (you may use spaces or hyphens) and at least 2 letters.`:o="Please match the requested format."),!o&&e.name==="conservationStatus"&&e.value===""&&(o="Please select a conservation status."),!o&&e.name==="img"&&e.value){const r=e.value.trim();if(!/^https:\/\//i.test(r))o="Image URL must start with https://";else{let l=r;try{l=new URL(r).pathname}catch{}/\.(png|jpe?g|gif)$/i.test(l)||(o="Please use a URL ending in .png, .jpg, .jpeg, or .gif")}}return this._setError(e.name,o),!o}_validateForm(){const n=["species","class","conservationStatus","habitat","img","description","more"];let e=null,a=!0;for(const t of n){const s=this._validateField(t);!s&&!e&&(e=this._getField(t).control),a=a&&s}return!a&&e&&e.focus(),a}_attachValidation(){this.addAnimalForm.querySelectorAll("input, select, textarea").forEach(e=>{e.addEventListener("blur",()=>this._validateField(e.name)),e.addEventListener("input",()=>{e.checkValidity()&&this._setError(e.name,"")}),e.tagName.toLowerCase()==="select"&&e.addEventListener("change",()=>this._validateField(e.name))})}_renderAdoptedList(){if(this.adoptedAnimalsList.innerHTML="",!this.adoptedAnimals||this.adoptedAnimals.size===0){const n=document.createElement("li");n.className="muted",n.textContent="No adopted animals yet.",this.adoptedAnimalsList.appendChild(n);return}for(const n of this.adoptedAnimals){const e=document.createElement("li"),a=document.createElement("span");a.textContent=n;const t=document.createElement("button");t.type="button",t.className="btn danger sm",t.textContent="Remove",t.setAttribute("aria-label",`Remove adoption for ${n}`),t.addEventListener("click",()=>this._unadopt(n)),e.append(a,t),this.adoptedAnimalsList.appendChild(e)}}_unadopt(n){n&&this.adoptedAnimals?.delete(n)&&this._renderAdoptedList()}_wireEvents(){this.selectedAnimalDropdown.addEventListener("change",async()=>{const n=this.zooAnimals.find(e=>e.name===this.selectedAnimalDropdown.value);n&&this._renderCard(n)}),this.searchQueryInput.addEventListener("input",async()=>{const n=(this.searchQueryInput.value||"").trim().toLowerCase();if(this.searchResultsList.innerHTML="",!n)return;const e=t=>String(t??"").toLowerCase(),a=this.zooAnimals.filter(t=>[t.name,t.type,t.class,t.species,t.habitat,t.conservationStatus].some(i=>e(i).includes(n)));if(a.length===0){const t=document.createElement("li");t.textContent="No matches",t.className="muted",this.searchResultsList.appendChild(t);return}for(const t of a){const s=document.createElement("li"),i=t?.name??"Unknown",o=t?.type??t?.class??t?.species??"";s.textContent=o?`${i} (${o})`:i,s.addEventListener("click",()=>this._renderCard(t)),this.searchResultsList.appendChild(s)}}),this.addAnimalForm.addEventListener("submit",async n=>{if(n.preventDefault(),!this._validateForm())return;const e=new FormData(this.addAnimalForm),a={name:e.get("species"),type:e.get("class"),conservationStatus:e.get("conservationStatus"),habitat:e.get("habitat"),image:e.get("img")||"images/comingSoon.png",description:e.get("description"),funFact:e.get("more")};try{const t=await fetch(`${b}/animals`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(a)});if(!t.ok)throw new Error(`Create failed: ${t.status}`);const s=await t.json();this.zooAnimals.push(s),this._populateDropdown(),this.formMessage.textContent="Animal added!",this.addAnimalForm.reset(),["species","class","conservationStatus","habitat","img","description","more"].forEach(i=>this._setError(i,"")),setTimeout(()=>this.formMessage.textContent="",4e3)}catch(t){console.error(t),this.formMessage.textContent="Error: could not save animal."}})}_renderCard(n){this.animalCardContainer.innerHTML="";const e=document.createElement("div");e.className="animal-card";const a=document.createElement("img");a.src=n.image,a.alt=n.name;const t=document.createElement("h3");t.textContent=n.name;const s=document.createElement("p");s.textContent=`Class: ${n.type}`;const i=document.createElement("p");i.textContent=`Status: ${n.conservationStatus}`;const o=document.createElement("p");o.textContent=`Habitat: ${n.habitat}`;const r=document.createElement("p");r.textContent=n.description||"";const l=this._createButton("Adopt","primary");l.addEventListener("click",()=>{this.adoptedAnimals.add(n.name),this._renderAdoptedList()}),e.append(a,t,s,i,o,r,l),this.animalCardContainer.appendChild(e)}}customElements.define("animal-exhibit",C);
