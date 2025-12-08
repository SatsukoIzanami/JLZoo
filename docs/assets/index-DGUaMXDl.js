(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))s(t);new MutationObserver(t=>{for(const a of t)if(a.type==="childList")for(const r of a.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&s(r)}).observe(document,{childList:!0,subtree:!0});function e(t){const a={};return t.integrity&&(a.integrity=t.integrity),t.referrerPolicy&&(a.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?a.credentials="include":t.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function s(t){if(t.ep)return;t.ep=!0;const a=e(t);fetch(t.href,a)}})();class E extends HTMLElement{constructor(){super();const n=this.attachShadow({mode:"open"}),e=document.createElement("style");e.textContent=`
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
            `;const s=document.createElement("nav");s.className="navbar";const t=document.createElement("a");t.className="brand",t.href="index.html",t.textContent="JL Zoo";const a=document.createElement("div");a.className="links";const r=(o,i)=>{const l=document.createElement("a");return l.href=i,l.textContent=o,l};a.append(r("Home","index.html"),r("About","about.html"),r("Contact","contact.html")),s.append(t,a),n.append(e,s)}}customElements.define("site-nav",E);const g=location.hostname.endsWith("github.io")?"https://jlzoo.onrender.com/api":"http://localhost:3000/api";class C extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this.zooAnimals=[];const n=document.createElement("div");n.className="exhibit-wrapper";const e=this._createPanel("Browse by Animal");this.selectedAnimalDropdown=document.createElement("select"),this.selectedAnimalDropdown.setAttribute("aria-label","Animal Dropdown"),this.animalCardContainer=document.createElement("div"),this.animalCardContainer.className="card-container";const s=this._createRow(this.selectedAnimalDropdown);e.append(s,this.animalCardContainer);const t=this._createPanel("Search the Zoo");this.searchQueryInput=document.createElement("input"),this.searchQueryInput.type="search",this.searchQueryInput.placeholder="Search by name or class...",this.searchResultsList=document.createElement("ul"),this.searchResultsList.className="results-list",t.append(this.searchQueryInput,this.searchResultsList);const a=this._createPanel("Add an Animal");this.addAnimalForm=document.createElement("form"),this.addAnimalForm.className="form-add",this.formMessage=document.createElement("p"),this.formMessage.className="form-message";const r="^(?:[A-Za-z]{2,}|[A-Za-z][ \\-][A-Za-z])(?:[ \\-][A-Za-z]+)*$",o=this._field("Species *","species","input",{type:"text",required:"",minlength:"2",maxlength:"40",pattern:r,title:"Letters only (spaces or hyphens allowed, at least 2 letters)"}),i=this._field("Class *","class","input",{type:"text",required:"",minlength:"2",maxlength:"40",pattern:r,title:"Letters only (spaces or hyphens allowed, at least 2 letters)"}),l=this._field("Conservation Status *","conservationStatus","select",{required:""}),c=l.querySelector("select");["","Least Concern","Near Threatened","Vulnerable","Endangered","Critically Endangered"].forEach(f=>{const d=document.createElement("option");d.value=f,d.textContent=f||"— Select status —",c.appendChild(d)});const b=this._field("Habitat *","habitat","input",{type:"text",required:"",minlength:"2",maxlength:"60",pattern:r,title:"Letters only (spaces or hyphens allowed, at least 2 letters)"}),y=this._field("Image URL","img","input",{type:"url",placeholder:"https://…",pattern:"^https://.+",title:"Must start with https:// and end with .png, .jpg, .jpeg, or .gif"}),x=this._field("Description *","description","textarea",{rows:"3",placeholder:"Short description",required:"",minlength:"10",maxlength:"500"}),v=this._field("Fun Fact","more","input",{type:"text",placeholder:"Optional",maxlength:"120"}),p=this._createButton("Add to Zoo","primary");p.type="submit";const h=this._createButton("Reset","ghost");h.type="reset";const w=this._createRow([p,h]);this.addAnimalForm.append(o,i,l,b,y,x,v,w,this.formMessage),a.append(this.addAnimalForm),this._attachValidation(),n.append(e,t,a);const u=document.createElement("style");u.textContent=`
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
        `,this.shadowRoot.append(u,n)}connectedCallback(){this._wireEvents(),this._loadAnimals()}_clearNode(n){for(;n.firstChild;)n.removeChild(n.firstChild)}_createPanel(n){const e=document.createElement("section");e.className="panel";const s=document.createElement("h2");return s.textContent=n,e.appendChild(s),e}_createRow(n){const e=document.createElement("div");e.className="row";const s=Array.isArray(n)?n:[n];for(const t of s)t&&e.appendChild(t);return e}_createButton(n,e){const s=document.createElement("button");return s.textContent=n,s.className="btn"+(e?" "+e:""),s}_createLabeledInput(n,e,s){const t=document.createElement("label");t.textContent=n;const a=document.createElement("input");return a.type=e,a.name=s,t.appendChild(a),t}_createLabeledSelect(n,e,s){const t=document.createElement("label");t.textContent=n;const a=document.createElement("select");return a.name=e,s.forEach(r=>{const o=document.createElement("option");o.value=r,o.textContent=r||"Select...",a.appendChild(o)}),t.appendChild(a),t}async _loadAnimals(){try{const n=await fetch(`${g}/animals`,{cache:"no-store"});if(!n.ok)throw new Error(`Fetch failed: ${n.status}`);const e=await n.json();console.log("Fetched data:",e),this.zooAnimals=Array.isArray(e.animals)?e.animals:e,this._populateDropdown()}catch(n){console.error("Animal load error:",n),this.animalCardContainer.textContent="Could not load animals."}}_populateDropdown(){this._clearNode(this.selectedAnimalDropdown);const n=document.createElement("option");n.value="",n.textContent="- Select an Animal -",this.selectedAnimalDropdown.appendChild(n),this.zooAnimals.forEach(e=>{const s=document.createElement("option");s.value=e.name,s.textContent=e.name,this.selectedAnimalDropdown.appendChild(s)})}_field(n,e,s="input",t={}){const a=document.createElement("div");a.className="field";const r=document.createElement("label");r.setAttribute("for",e),r.textContent=n;const o=document.createElement(s);o.name=e,o.id=e,Object.entries(t).forEach(([l,c])=>o.setAttribute(l,c));const i=document.createElement("div");return i.className="field-error",i.id=`${e}-error`,i.setAttribute("aria-live","polite"),o.setAttribute("aria-describedby",i.id),a.append(r,o,i),a}_getField(n){const e=this.addAnimalForm.querySelector(`[name="${n}"]`),s=e?.closest(".field"),t=s?.querySelector(".field-error");return{wrap:s,control:e,error:t}}_setError(n,e){const{wrap:s,control:t,error:a}=this._getField(n);s&&(e?(s.classList.add("is-invalid"),t?.setAttribute("aria-invalid","true"),a&&(a.textContent=e)):(s.classList.remove("is-invalid"),t?.removeAttribute("aria-invalid"),a&&(a.textContent="")))}_validateField(n){const{control:e}=this._getField(n);if(!e)return!0;const s=e.tagName.toLowerCase(),t=e.getAttribute("type")||"";(s==="input"&&(t==="text"||t==="url")||s==="textarea")&&(e.value=e.value.trim());const a=e.validity,r={species:"Species",class:"Class",conservationStatus:"Conservation Status",habitat:"Habitat",img:"Image URL",description:"Description",more:"Fun Fact"};let o="";if(a.valueMissing?o=`${r[e.name]||"This field"} is required.`:a.tooShort?o=`Please enter at least ${e.getAttribute("minlength")} characters.`:a.tooLong?o=`Please use at most ${e.getAttribute("maxlength")} characters.`:a.typeMismatch&&e.type==="url"?o="Please enter a valid URL (https://…).":a.patternMismatch&&(["species","class","habitat"].includes(e.name)?o=`${r[e.name]} must contain letters only (you may use spaces or hyphens) and at least 2 letters.`:o="Please match the requested format."),!o&&e.name==="conservationStatus"&&e.value===""&&(o="Please select a conservation status."),!o&&e.name==="img"&&e.value){const i=e.value.trim();if(!/^https:\/\//i.test(i))o="Image URL must start with https://";else{let l=i;try{l=new URL(i).pathname}catch{}/\.(png|jpe?g|gif)$/i.test(l)||(o="Please use a URL ending in .png, .jpg, .jpeg, or .gif")}}return this._setError(e.name,o),!o}_validateForm(){const n=["species","class","conservationStatus","habitat","img","description","more"];let e=null,s=!0;for(const t of n){const a=this._validateField(t);!a&&!e&&(e=this._getField(t).control),s=s&&a}return!s&&e&&e.focus(),s}_attachValidation(){this.addAnimalForm.querySelectorAll("input, select, textarea").forEach(e=>{e.addEventListener("blur",()=>this._validateField(e.name)),e.addEventListener("input",()=>{e.checkValidity()&&this._setError(e.name,"")}),e.tagName.toLowerCase()==="select"&&e.addEventListener("change",()=>this._validateField(e.name))})}_wireEvents(){this.selectedAnimalDropdown.addEventListener("change",async()=>{const n=this.zooAnimals.find(e=>e.name===this.selectedAnimalDropdown.value);n&&this._renderCard(n)}),this.searchQueryInput.addEventListener("input",async()=>{const n=(this.searchQueryInput.value||"").trim().toLowerCase();if(this._clearNode(this.searchResultsList),!n)return;const e=t=>String(t??"").toLowerCase(),s=this.zooAnimals.filter(t=>[t.name,t.type,t.class,t.species,t.habitat,t.conservationStatus].some(r=>e(r).includes(n)));if(s.length===0){const t=document.createElement("li");t.textContent="No matches",t.className="muted",this.searchResultsList.appendChild(t);return}for(const t of s){const a=document.createElement("li"),r=t?.name??"Unknown",o=t?.type??t?.class??t?.species??"";a.textContent=o?`${r} (${o})`:r,a.addEventListener("click",()=>this._renderCard(t)),this.searchResultsList.appendChild(a)}}),this.addAnimalForm.addEventListener("submit",async n=>{if(n.preventDefault(),!this._validateForm())return;const e=new FormData(this.addAnimalForm),s={name:e.get("species"),type:e.get("class"),conservationStatus:e.get("conservationStatus"),habitat:e.get("habitat"),image:e.get("img")||"images/comingSoon.png",description:e.get("description"),funFact:e.get("more")};try{const t=await fetch(`${g}/animals`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(s)});if(!t.ok)throw new Error(`Create failed: ${t.status}`);const a=await t.json();this.zooAnimals.push(a),this._populateDropdown(),this.formMessage.textContent="Animal added!",this.addAnimalForm.reset(),["species","class","conservationStatus","habitat","img","description","more"].forEach(r=>this._setError(r,"")),setTimeout(()=>this.formMessage.textContent="",4e3)}catch(t){console.error(t),this.formMessage.textContent="Error: could not save animal."}}),this.phoneForm&&this.phoneForm.addEventListener("submit",n=>this._handlePhoneSubmit(n))}_renderCard(n){this._clearNode(this.animalCardContainer);const e=document.createElement("div");e.className="animal-card";const s=document.createElement("img");s.src=n.image,s.alt=n.name;const t=document.createElement("h3");t.textContent=n.name;const a=document.createElement("p");a.textContent=`Class: ${n.type}`;const r=document.createElement("p");r.textContent=`Status: ${n.conservationStatus}`;const o=document.createElement("p");o.textContent=`Habitat: ${n.habitat}`;const i=document.createElement("p");i.textContent=n.description||"",e.append(s,t,a,r,o,i),this.animalCardContainer.appendChild(e)}}customElements.define("animal-exhibit",C);
