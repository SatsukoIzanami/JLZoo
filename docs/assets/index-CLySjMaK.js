(function(){const a=document.createElement("link").relList;if(a&&a.supports&&a.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))t(n);new MutationObserver(n=>{for(const o of n)if(o.type==="childList")for(const i of o.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&t(i)}).observe(document,{childList:!0,subtree:!0});function e(n){const o={};return n.integrity&&(o.integrity=n.integrity),n.referrerPolicy&&(o.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?o.credentials="include":n.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function t(n){if(n.ep)return;n.ep=!0;const o=e(n);fetch(n.href,o)}})();class S extends HTMLElement{constructor(){super();const a=this.attachShadow({mode:"open"}),e=document.createElement("style");e.textContent=`
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
            `;const t=document.createElement("nav");t.className="navbar";const n=document.createElement("a");n.className="brand",n.href="index.html",n.textContent="JL Zoo";const o=document.createElement("div");o.className="links";const i=(s,l)=>{const r=document.createElement("a");return r.href=l,r.textContent=s,r};o.append(i("Home","index.html"),i("About","about.html"),i("Contact","contact.html")),t.append(n,o),a.append(e,t)}}customElements.define("site-nav",S);const L=location.hostname.endsWith("github.io")?"https://jlzoo.onrender.com/api":"http://localhost:3000/api",E=new Set,C=new Map,F=new Map;function k(c,a,e){const t=e?.trim()||c;E.add(t),a&&C.set(t,a),e?.trim()&&e.trim()!==c&&F.set(c,e.trim())}function P(c){return C.get(c)}function z(c,a){const e=document.querySelector(".adoption-modal");e&&e.remove();const t=document.createElement("div");t.className="adoption-modal",t.setAttribute("role","dialog"),t.setAttribute("aria-modal","true"),t.style.position="fixed",t.style.zIndex=1e3,t.style.left=0,t.style.top=0,t.style.width="100vw",t.style.height="100vh",t.style.display="flex",t.style.alignItems="center",t.style.justifyContent="center",t.style.backgroundColor="rgba(0,0,0,0.45)";const n=document.createElement("div");n.style.background="#101820",n.style.padding="2rem",n.style.borderRadius="12px",n.style.boxShadow="0 8px 24px rgba(0,0,0,0.5)",n.style.color="#f0f4ff",n.style.fontFamily="system-ui, sans-serif",n.style.maxWidth="400px",n.style.width="90%",n.tabIndex=0;const o=document.createElement("h2");o.textContent=`Adopt ${c}`,o.style.marginTop="0",o.style.marginBottom="1rem",o.style.fontSize="1.25rem";const i=document.createElement("p");i.textContent="Give your adopted animal a custom name (optional):",i.style.marginTop="0",i.style.marginBottom="0.5em",i.style.color="#f0f4ff";const s=document.createElement("input");s.type="text",s.placeholder=c,s.value=c,s.setAttribute("aria-label","Custom name for adopted animal"),s.setAttribute("maxlength","40"),s.style.width="100%",s.style.padding="8px 10px",s.style.marginBottom="1em",s.style.border="1px solid #1a2440",s.style.borderRadius="10px",s.style.fontSize="1em",s.style.background="#0b1223",s.style.color="#f0f4ff",s.style.boxSizing="border-box";const l=document.createElement("p");l.textContent="Please enter your phone number to finalize your adoption:",l.style.marginBottom="0.5em",l.style.color="#f0f4ff";const r=document.createElement("input");r.type="tel",r.required=!0,r.placeholder="e.g. 555-555-5555",r.setAttribute("aria-label","Phone number"),r.style.width="100%",r.style.padding="8px 10px",r.style.marginBottom="0.5em",r.style.border="1px solid #1a2440",r.style.borderRadius="10px",r.style.fontSize="1em",r.style.background="#0b1223",r.style.color="#f0f4ff",r.style.boxSizing="border-box";const d=document.createElement("div");d.style.color="#ffb4a3",d.style.fontSize="0.9em",d.style.margin="0.5em 0",d.style.minHeight="1.2em";const p=document.createElement("form");p.style.margin=0,p.addEventListener("submit",m=>{m.preventDefault()});const f=document.createElement("div");f.style.marginTop="1.2em",f.style.display="flex",f.style.gap="1em",f.style.justifyContent="flex-end";const h=document.createElement("button");h.type="button",h.textContent="Cancel",h.style.padding="8px 14px",h.style.border="1px solid #5aa2ff",h.style.borderRadius="8px",h.style.background="transparent",h.style.color="#f0f4ff",h.style.cursor="pointer",h.style.fontSize="1em",h.style.fontFamily="inherit";const u=document.createElement("button");u.textContent="Adopt",u.type="submit",u.style.fontWeight="bold",u.style.padding="8px 14px",u.style.border="none",u.style.borderRadius="8px",u.style.background="#5aa2ff",u.style.color="#000",u.style.cursor="pointer",u.style.fontSize="1em",u.style.fontFamily="inherit",f.append(h,u),p.append(i,s,l,r,d,f),n.append(o,p),t.appendChild(n),document.body.appendChild(t),s.focus(),s.select(),s.addEventListener("input",()=>{d.textContent&&(d.textContent="")}),r.addEventListener("input",()=>{d.textContent&&(d.textContent="")});const y=()=>{const m=s.value.trim(),v=N(m);if(!v.valid){d.textContent=v.message,s.focus();return}const g=r.value.trim(),A=R(g);if(!A.valid){d.textContent=A.message,r.focus();return}const _=m||c;k(c,g,m),a&&a(c,g,_),b()};p.addEventListener("submit",y),u.onclick=y,h.onclick=b,t.addEventListener("click",m=>{m.target===t&&b()});const x=m=>{m.key==="Enter"&&(m.preventDefault(),y())};s.addEventListener("keydown",x),r.addEventListener("keydown",x);const w=m=>{m.addEventListener("focus",()=>{m.style.outline="none",m.style.borderColor="#5aa2ff"}),m.addEventListener("blur",()=>{m.style.borderColor="#1a2440"})};w(s),w(r);function b(){t.remove()}}function N(c){const a=c.trim();if(a==="")return{valid:!0,message:""};if(a.length<2)return{valid:!1,message:"Name must be at least 2 characters long."};if(a.length>40)return{valid:!1,message:"Name must be 40 characters or less."};if(!/^(?:[A-Za-z]{2,}|[A-Za-z][\s\-']?[A-Za-z])(?:[\s\-'][A-Za-z]+)*$/.test(a))return{valid:!1,message:"Name must contain only letters, spaces, hyphens, and apostrophes."};if(!/[A-Za-z]/.test(a))return{valid:!1,message:"Name must contain at least one letter."};const t=a.replace(/[\s\-']/g,"").toLowerCase();return t.length>0&&/^([a-z])\1+$/.test(t)?{valid:!1,message:"Name cannot consist of only repeating letters."}:{valid:!0,message:""}}function R(c){const a=c.trim();if(!/^\s*(?:\+?1[.\-\s]?)?(?:\(?\d{3}\)?[.\-\s]?\d{3}[.\-\s]?\d{4})\s*$/.test(a))return{valid:!1,message:"Please enter a valid phone number (10 digits)."};let t=a.replace(/\D/g,"");if(t.length===11&&t.startsWith("1")&&(t=t.slice(1)),t.length!==10)return{valid:!1,message:"Phone number must have exactly 10 digits."};const n=t.slice(0,3),o=t.slice(3,6),i=t.slice(6);return n[0]<"2"||n[0]>"9"?{valid:!1,message:"Area code must start with digits 2-9."}:o[0]<"2"||o[0]>"9"?{valid:!1,message:"Phone number prefix must start with digits 2-9."}:o==="000"||i==="0000"?{valid:!1,message:"Please enter a realistic phone number, not all zeros."}:/^(\d)\1{9}$/.test(t)?{valid:!1,message:"Please enter a realistic phone number."}:n===o&&o===i?{valid:!1,message:"Please enter a realistic phone number."}:(l=>{let r=!0,d=!0;for(let p=1;p<l.length;p++)parseInt(l[p])!==parseInt(l[p-1])+1&&(r=!1),parseInt(l[p])!==parseInt(l[p-1])-1&&(d=!1);return r||d})(t)?{valid:!1,message:"Please enter a realistic phone number."}:{valid:!0,message:""}}class $ extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this.zooAnimals=[];const a=document.createElement("div");a.className="exhibit-wrapper";const e=this._createPanel("Browse by Animal");this.selectedAnimalDropdown=document.createElement("select"),this.selectedAnimalDropdown.setAttribute("aria-label","Animal Dropdown"),this.animalCardContainer=document.createElement("div"),this.animalCardContainer.className="card-container";const t=this._createRow(this.selectedAnimalDropdown);e.append(t,this.animalCardContainer);const n=this._createPanel("Search the Zoo");this.searchQueryInput=document.createElement("input"),this.searchQueryInput.type="search",this.searchQueryInput.placeholder="Search by name or class...",this.searchResultsList=document.createElement("ul"),this.searchResultsList.className="results-list",n.append(this.searchQueryInput,this.searchResultsList);const o=this._createPanel("Add an Animal");this.addAnimalForm=document.createElement("form"),this.addAnimalForm.className="form-add",this.addAnimalForm.method="post",this.addAnimalForm.action="javascript:void(0)",this.formMessage=document.createElement("p"),this.formMessage.className="form-message";const i="^(?:[A-Za-z]{2,}|[A-Za-z][ \\-][A-Za-z])(?:[ \\-][A-Za-z]+)*$",s=this._field("Species *","species","input",{type:"text",required:"",minlength:"2",maxlength:"40",pattern:i,title:"Letters only (spaces or hyphens allowed, at least 2 letters)"}),l=this._field("Class *","class","input",{type:"text",required:"",minlength:"2",maxlength:"40",pattern:i,title:"Letters only (spaces or hyphens allowed, at least 2 letters)"}),r=this._field("Conservation Status *","conservationStatus","select",{required:""}),d=r.querySelector("select");["","Least Concern","Near Threatened","Vulnerable","Endangered","Critically Endangered"].forEach(v=>{const g=document.createElement("option");g.value=v,g.textContent=v||"— Select status —",d.appendChild(g)});const p=this._field("Habitat *","habitat","input",{type:"text",required:"",minlength:"2",maxlength:"60",pattern:i,title:"Letters only (spaces or hyphens allowed, at least 2 letters)"}),f=this._field("Image URL","img","input",{type:"url",placeholder:"https://…",pattern:"^https://.+",title:"Must start with https:// and end with .png, .jpg, .jpeg, or .gif"}),h=this._field("Description *","description","textarea",{rows:"3",placeholder:"Short description",required:"",minlength:"10",maxlength:"500"}),u=this._field("Fun Fact","more","input",{type:"text",placeholder:"Optional",maxlength:"120"}),y=this._createButton("Add to Zoo","primary");y.type="submit";const x=this._createButton("Reset","ghost");x.type="reset";const w=this._createRow([y,x]);this.addAnimalForm.append(s,l,r,p,f,h,u,w,this.formMessage),o.append(this.addAnimalForm),this._attachValidation();const b=this._createPanel("Adopted Animals");this.adoptedAnimalsList=document.createElement("ul"),this.adoptedAnimalsList.className="adopted-list",b.append(this.adoptedAnimalsList),a.append(e,n,o,b);const m=document.createElement("style");m.textContent=`
        :host { display: block; font-family: system-ui, sans-serif; color: #f0f4ff; --label-w: 160px; --field-w: 420px; background: #2a3441; padding: 20px; min-height: 100vh;}
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
        .results-list li { 
            background: #182635; 
            border-radius: 8px; 
            padding: 6px 10px; 
            margin-top: 6px; 
            cursor: pointer; 
            }
        .adopted-list li {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 8px;
            padding: 6px 8px;
            border: 1px solid var(--border, #1a2440);
            border-radius: 8px;
            margin: 6px 0;
            background: #182635;
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
        .btn.sm { padding: 4px 8px; font-size: 12px; border-radius: 8px; }
        .btn.danger { background: #4a1111; border-color: #6b1b1b; }
        .btn.danger:hover { background: #5a1515; }
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
        `,this.shadowRoot.append(m,a)}connectedCallback(){this._wireEvents(),this._loadAnimals(),this._renderAdoptedList()}_clearNode(a){for(;a.firstChild;)a.removeChild(a.firstChild)}_createPanel(a){const e=document.createElement("section");e.className="panel";const t=document.createElement("h2");return t.textContent=a,e.appendChild(t),e}_createRow(a){const e=document.createElement("div");e.className="row";const t=Array.isArray(a)?a:[a];for(const n of t)n&&e.appendChild(n);return e}_createButton(a,e){const t=document.createElement("button");return t.textContent=a,t.className="btn"+(e?" "+e:""),t}_createLabeledInput(a,e,t){const n=document.createElement("label");n.textContent=a;const o=document.createElement("input");return o.type=e,o.name=t,n.appendChild(o),n}_createLabeledSelect(a,e,t){const n=document.createElement("label");n.textContent=a;const o=document.createElement("select");return o.name=e,t.forEach(i=>{const s=document.createElement("option");s.value=i,s.textContent=i||"Select...",o.appendChild(s)}),n.appendChild(o),n}async _loadAnimals(){try{const a=await fetch(`${L}/animals`,{cache:"no-store"});if(!a.ok)throw new Error(`Fetch failed: ${a.status}`);const e=await a.json();console.log("Fetched data:",e),this.zooAnimals=Array.isArray(e.animals)?e.animals:e,this._populateDropdown()}catch(a){console.error("Animal load error:",a),this.animalCardContainer.textContent="Could not load animals."}}_populateDropdown(){this._clearNode(this.selectedAnimalDropdown);const a=document.createElement("option");a.value="",a.textContent="- Select an Animal -",this.selectedAnimalDropdown.appendChild(a),this.zooAnimals.forEach(e=>{const t=document.createElement("option");t.value=e.name,t.textContent=e.name,this.selectedAnimalDropdown.appendChild(t)})}_field(a,e,t="input",n={}){const o=document.createElement("div");o.className="field";const i=document.createElement("label");i.setAttribute("for",e),i.textContent=a;const s=document.createElement(t);s.name=e,s.id=e,Object.entries(n).forEach(([r,d])=>s.setAttribute(r,d));const l=document.createElement("div");return l.className="field-error",l.id=`${e}-error`,l.setAttribute("aria-live","polite"),s.setAttribute("aria-describedby",l.id),o.append(i,s,l),o}_getField(a){const e=this.addAnimalForm.querySelector(`[name="${a}"]`),t=e?.closest(".field"),n=t?.querySelector(".field-error");return{wrap:t,control:e,error:n}}_setError(a,e){const{wrap:t,control:n,error:o}=this._getField(a);t&&(e?(t.classList.add("is-invalid"),n?.setAttribute("aria-invalid","true"),o&&(o.textContent=e)):(t.classList.remove("is-invalid"),n?.removeAttribute("aria-invalid"),o&&(o.textContent="")))}_validateField(a){const{control:e}=this._getField(a);if(!e)return!0;const t=e.tagName.toLowerCase(),n=e.getAttribute("type")||"";(t==="input"&&(n==="text"||n==="url")||t==="textarea")&&(e.value=e.value.trim());const o=e.validity,i={species:"Species",class:"Class",conservationStatus:"Conservation Status",habitat:"Habitat",img:"Image URL",description:"Description",more:"Fun Fact"};let s="";if(o.valueMissing?s=`${i[e.name]||"This field"} is required.`:o.tooShort?s=`Please enter at least ${e.getAttribute("minlength")} characters.`:o.tooLong?s=`Please use at most ${e.getAttribute("maxlength")} characters.`:o.typeMismatch&&e.type==="url"?s="Please enter a valid URL (https://…).":o.patternMismatch&&(["species","class","habitat"].includes(e.name)?s=`${i[e.name]} must contain letters only (you may use spaces or hyphens) and at least 2 letters.`:s="Please match the requested format."),!s&&e.name==="conservationStatus"&&e.value===""&&(s="Please select a conservation status."),!s&&e.name==="img"&&e.value){const l=e.value.trim();if(!/^https:\/\//i.test(l))s="Image URL must start with https://";else{let r=l;try{r=new URL(l).pathname}catch{}/\.(png|jpe?g|gif)$/i.test(r)||(s="Please use a URL ending in .png, .jpg, .jpeg, or .gif")}}return this._setError(e.name,s),!s}_validateForm(){const a=["species","class","conservationStatus","habitat","img","description","more"];let e=null,t=!0;for(const n of a){const o=this._validateField(n);!o&&!e&&(e=this._getField(n).control),t=t&&o}return!t&&e&&e.focus(),t}_attachValidation(){this.addAnimalForm.querySelectorAll("input, select, textarea").forEach(e=>{e.addEventListener("blur",()=>this._validateField(e.name)),e.addEventListener("input",()=>{e.checkValidity()&&this._setError(e.name,"")}),e.tagName.toLowerCase()==="select"&&e.addEventListener("change",()=>this._validateField(e.name))})}_wireEvents(){this.selectedAnimalDropdown.addEventListener("change",async()=>{const a=this.zooAnimals.find(e=>e.name===this.selectedAnimalDropdown.value);a&&this._renderCard(a)}),this.searchQueryInput.addEventListener("input",async()=>{const a=(this.searchQueryInput.value||"").trim().toLowerCase();if(this._clearNode(this.searchResultsList),!a)return;const e=n=>String(n??"").toLowerCase(),t=this.zooAnimals.filter(n=>[n.name,n.type,n.class,n.species,n.habitat,n.conservationStatus].some(i=>e(i).includes(a)));if(t.length===0){const n=document.createElement("li");n.textContent="No matches",n.className="muted",this.searchResultsList.appendChild(n);return}for(const n of t){const o=document.createElement("li"),i=n?.name??"Unknown",s=n?.type??n?.class??n?.species??"";o.textContent=s?`${i} (${s})`:i,o.addEventListener("click",()=>this._renderCard(n)),this.searchResultsList.appendChild(o)}}),this.addAnimalForm.addEventListener("submit",async a=>{if(a.preventDefault(),a.stopPropagation(),!this._validateForm())return;const e=new FormData(this.addAnimalForm),t={name:e.get("species")?.trim(),type:e.get("class")?.trim(),conservationStatus:e.get("conservationStatus")?.trim(),habitat:e.get("habitat")?.trim(),description:e.get("description")?.trim()},n=e.get("img")?.trim();n?t.image=n:t.image="images/comingSoon.png";const o=e.get("more")?.trim();o&&(t.funFact=o);const i=["name","type","conservationStatus","habitat","description"];for(const s of i)if(!t[s]||t[s].trim()===""){this.formMessage.textContent=`Error: ${s} is required.`;return}try{console.log("Sending animal data:",t);const s=await fetch(`${L}/animals`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)});if(!s.ok){const r=await s.text();throw console.error("Server error response:",r),new Error(`Create failed: ${s.status} - ${r}`)}let l=null;s.status===204?(await this._loadAnimals(),l=this.zooAnimals.find(r=>r.name===t.name&&r.type===t.type)||t):(l=await s.json(),this.zooAnimals.push(l),this._populateDropdown()),s.status!==204&&this._populateDropdown(),this.formMessage.textContent="Animal added!",this.addAnimalForm.reset(),["species","class","conservationStatus","habitat","img","description","more"].forEach(r=>this._setError(r,"")),setTimeout(()=>this.formMessage.textContent="",4e3)}catch(s){console.error(s),this.formMessage.textContent="Error: could not save animal."}})}_renderCard(a){this._clearNode(this.animalCardContainer);const e=document.createElement("div");e.className="animal-card";const t=document.createElement("img");t.src=a.image,t.alt=a.name;const n=document.createElement("h3");n.textContent=a.name;const o=document.createElement("p");o.textContent=`Class: ${a.type}`;const i=document.createElement("p");i.textContent=`Status: ${a.conservationStatus}`;const s=document.createElement("p");s.textContent=`Habitat: ${a.habitat}`;const l=document.createElement("p");l.textContent=a.description||"";const r=this._createButton("Adopt","primary");r.addEventListener("click",()=>{z(a.name,(d,p,f)=>{this._renderAdoptedList()})}),e.append(t,n,o,i,s,l,r),this.animalCardContainer.appendChild(e)}_renderAdoptedList(){if(this._clearNode(this.adoptedAnimalsList),!E||E.size===0){const a=document.createElement("li");a.className="muted",a.textContent="No adopted animals yet.",this.adoptedAnimalsList.appendChild(a);return}for(const a of E){const e=document.createElement("li"),t=document.createElement("div");t.className="adopt-info";const n=document.createElement("span");n.textContent=a;const o=P(a),i=document.createElement("span");i.className="adopt-phone",i.textContent=o?`Phone: ${o}`:"",t.append(n),o&&t.append(i);const s=document.createElement("button");s.type="button",s.className="btn danger sm",s.textContent="Remove",s.setAttribute("aria-label",`Remove adoption for ${a}`),s.addEventListener("click",()=>{E.delete(a),C.delete(a),this._renderAdoptedList()}),e.append(t,s),this.adoptedAnimalsList.appendChild(e)}}}customElements.define("animal-exhibit",$);
