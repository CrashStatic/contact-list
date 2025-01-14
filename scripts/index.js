var C="input--error";function ot(t,e){t.classList.contains(C)||(t.classList.add(C),e.textContent="Fill in all fields!")}function A(t,e){let o=!0;return t.forEach(n=>{G(n,e),n.value.trim()||(ot(n,e),o=!1)}),o}function G(t,e){t.addEventListener("input",()=>{t.classList.remove(C),e.textContent=""})}function M(t,e,o,n){return t.has(`${e.toLowerCase()}|${o.toLowerCase()}|${n}`)}function P(t){t.textContent="This contact has already been recorded!"}function _(t,e){G(t,e);let o=/[a-zA-Z ]/gmi;return t.value.length<=3?(t.classList.add(C),e.textContent="Value cannot be shorter than 3 letters!",!1):o.test(t.value)?!0:(t.classList.add(C),e.textContent="Value must contain English letters!",!1)}function w(t,e){return G(t,e),/^\+7 \d{3} \d{3} \d{2} \d{2}$/.test(t.value)?!0:(t.classList.add(C),e.textContent="Wrong number!",!1)}function q(t,e){let o=e.children.length,n=e.parentElement;o>0?(t.classList.add("element__counter--active"),n.classList.add("element--active"),t.textContent=o):(t.classList.remove("element__counter--active"),n.classList.remove("element--active"),t.textContent=0)}var S=".element__contacts",u=".message__name",i=".message__position",m=".message__phone",T=".element__counter",d=".column__element";var c=new Map;function W(){let t=localStorage.getItem("contacts");if(t)try{let e=JSON.parse(t);Array.isArray(e)&&e.forEach(({name:o,position:n,phone:r})=>{let a=o[0].toUpperCase(),s=document.querySelector(`[data-id="${a.toLowerCase()}"]`)?.closest(d);s&&I(o,n,r,s)})}catch(e){console.error("\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u0430\u0440\u0441\u0438\u043D\u0433\u0430 \u0434\u0430\u043D\u043D\u044B\u0445 \u0438\u0437 localStorage:",e)}}function f(){let t=Array.from(c.values());localStorage.setItem("contacts",JSON.stringify(t))}var b=t=>{let e="";t.addEventListener("input",()=>{let o=t.value.replace(/\D/g,"");if(o.length<e.length){e=o;return}o.length===1&&o[0]!=="7"&&(o=`7${o}`);let n="+7 ";o.length>1&&(n+=o.substring(1,4)),o.length>4&&(n+=` ${o.substring(4,7)}`),o.length>7&&(n+=` ${o.substring(7,9)}`),o.length>9&&(n+=` ${o.substring(9,11)}`),t.value=n,e=o})};var L=document.querySelector("#edit-popup"),R=L.querySelector(".popup__input--name"),$=L.querySelector(".popup__input--position"),x=L.querySelector(".popup__input--phone"),p=null;function v(t){p=t,R.value=t.querySelector(u).textContent,$.value=t.querySelector(i).textContent,x.value=t.querySelector(m).textContent,L.classList.add("popup--open"),L.querySelector("input").focus()}function B(){if(L.classList.remove("popup--open"),p){let t=p.querySelector(".message__edit");t&&t.focus()}p=null}function nt(){let t=R.value.trim(),e=$.value.trim(),o=x.value,n=p.querySelector(u).textContent,r=p.querySelector(i).textContent,a=p.querySelector(m).textContent,s=[R,$,x],l=document.querySelector(".popup__error");if(b(x),!A(s,l))return;if(M(c,t,e,o)){P(l);return}if(!_(R,l)||!_($,l)||!w(x,l))return;c.delete(`${n.toLowerCase()}|${r.toLowerCase()}|${a}`),c.set(`${t.toLowerCase()}|${e.toLowerCase()}|${o}`,{name:t,position:e,phone:o}),p.querySelector(u).textContent=t,p.querySelector(i).textContent=e,p.querySelector(m).textContent=o;let J=n[0].toUpperCase(),N=document.querySelector(`[data-id="${J.toLowerCase()}"]`)?.closest(d);N&&N.querySelector(S).querySelectorAll(".element__message").forEach(E=>{let V=E.querySelector(u).textContent,tt=E.querySelector(i).textContent,et=E.querySelector(m).textContent;V===n&&tt===r&&et===a&&(E.querySelector(u).textContent=t,E.querySelector(i).textContent=e,E.querySelector(m).textContent=o)}),f(),B()}document.querySelector(".popup").addEventListener("click",t=>{t.target.matches(".popup__button-save")&&nt(),t.target.matches(".popup__overlay")&&B(),t.target.matches(".popup__button-cancel")&&B()});var D=(t,e,o)=>{let r=document.querySelector("#message").content.querySelector(".message").cloneNode(!0);return r.querySelector(u).textContent=t,r.querySelector(i).textContent=e,r.querySelector(m).textContent=o,r};function I(t,e,o,n,r=!0){let a=D(t,e,o),s=n.querySelector(S);s.append(a);let l=n.querySelector(T);q(l,s),c.set(`${t.toLowerCase()}|${e.toLowerCase()}|${o}`,{name:t,position:e,phone:o}),r&&f()}function H(t){let e=t.target.closest(".message"),o=e.querySelector(u).textContent,n=e.querySelector(i).textContent,r=e.querySelector(m).textContent;c.delete(`${o.toLowerCase()}|${n.toLowerCase()}|${r}`),e.remove();let a=o[0].toUpperCase(),s=document.querySelector(`[data-id="${a.toLowerCase()}"]`)?.closest(d);if(s){let l=s.querySelector(S);l.querySelectorAll(".element__message").forEach(h=>{let z=h.querySelector(u).textContent,E=h.querySelector(i).textContent,V=h.querySelector(m).textContent;z===o&&E===n&&V===r&&h.remove()});let N=s.querySelector(T);q(N,l)}f()}function j(t){if(t.target.closest(d)){let o=t.target.closest(".element").querySelector(S);o.classList.toggle("element__contacts--open"),o.classList.contains("element__contacts--open")?o.style.maxHeight=`${o.scrollHeight}px`:o.style.maxHeight=0}}document.querySelector(".contact-table").addEventListener("click",t=>{if(t.target.matches(".message__delete")){H(t);return}if(t.target.matches(".message__edit")){let e=t.target.closest(".message");v(e);return}j(t)});document.querySelector(".contact-table").addEventListener("keydown",t=>{if(t.keyCode===32||t.key==="Enter"){if(t.preventDefault(),t.target.matches(".message__delete")){H(t);return}if(t.target.matches(".message__edit")){let e=t.target.closest(".message");v(e);return}j(t)}});var g=document.querySelector(".modal"),F=g.querySelector(".modal__input"),O=g.querySelector(".modal__search-area");function rt(t){let e=[];return c.forEach(({name:o,position:n,phone:r})=>{(o.toLowerCase().includes(t)||n.toLowerCase().includes(t)||r.includes(t))&&e.push({name:o,position:n,phone:r})}),e}function Q(t){if(O.innerHTML="",t.length===0){O.textContent="No results found";return}t.forEach(({name:e,position:o,phone:n})=>{let r=D(e,o,n);O.appendChild(r)})}F.addEventListener("input",()=>{let t=F.value.trim().toLowerCase();if(t){let e=rt(t);Q(e)}else O.innerHTML=""});function ct(){let t=Array.from(c.values());Q(t)}function K(){g.classList.remove("modal--open"),F.value="",O.innerHTML="",document.querySelector(".body").style.overflow="auto"}document.querySelector(".modal").addEventListener("click",t=>{if(t.target.matches(".modal__button-show")&&ct(),t.target.matches(".modal__button-cancel")&&K(),t.target.matches(".modal__overlay")&&K(),t.target.matches(".message__edit")){let e=t.target.closest(".message");v(e)}t.target.matches(".message__delete")&&H(t)});var U=document.getElementById("name"),k=document.getElementById("position"),y=document.getElementById("phone");function st(){let t=U.value.trim(),e=k.value.trim(),o=y.value.trim(),n=document.querySelector(".interaction__error");if(!A([U,k,y],n))return;if(M(c,t,e,o)){P(n);return}if(!_(U,n)||!_(k,n)||!w(y,n))return;let a=t[0].toUpperCase(),s=document.querySelector(`[data-id="${a.toLowerCase()}"]`)?.closest(d);I(t,e,o,s),U.value="",k.value="",y.value=""}function at(){document.querySelectorAll(d).forEach(t=>{let e=t.querySelector(S);e.innerHTML="";let o=t.querySelector(T);q(o,e)}),c.clear(),f()}function lt(){g.classList.add("modal--open"),document.querySelector(".body").style.overflow="hidden",g.querySelector("input").focus()}document.querySelector(".buttons").addEventListener("click",t=>{t.target.matches(".buttons__button--add")&&(t.preventDefault(),st()),t.target.matches(".buttons__button--clear")&&at(),t.target.matches(".buttons__button--search")&&lt()});var ut=document.querySelector("#letter").content.querySelector(".element"),it=({letter:t,id:e})=>{let o=ut.cloneNode(!0);return o.querySelector(".element__letter").textContent=t,o.querySelector(".element__letter").dataset.id=e,o.setAttribute("tabindex","0"),o},Z=(t,e)=>{let o=document.createDocumentFragment();t.forEach(n=>{let r=it(n);o.append(r)}),e.append(o)};var X=[{letter:"A",id:"a"},{letter:"B",id:"b"},{letter:"C",id:"c"},{letter:"D",id:"d"},{letter:"E",id:"e"},{letter:"F",id:"f"},{letter:"G",id:"g"},{letter:"H",id:"h"},{letter:"I",id:"i"},{letter:"J",id:"j"},{letter:"K",id:"k"},{letter:"L",id:"l"},{letter:"M",id:"m"}],Y=[{letter:"N",id:"n"},{letter:"O",id:"o"},{letter:"P",id:"p"},{letter:"Q",id:"q"},{letter:"R",id:"r"},{letter:"S",id:"s"},{letter:"T",id:"t"},{letter:"U",id:"U"},{letter:"V",id:"v"},{letter:"W",id:"w"},{letter:"X",id:"x"},{letter:"Y",id:"y"},{letter:"Z",id:"z"}];document.addEventListener("DOMContentLoaded",()=>{let t=document.querySelector(".column__left"),e=document.querySelector(".column__right");Z(X,t),Z(Y,e),W(),b(y)});
