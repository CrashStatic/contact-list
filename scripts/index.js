var S="input--error";function ot(t,e){t.classList.contains(S)||(t.classList.add(S),e.textContent="Fill in all fields!")}function x(t,e){let o=!0;return t.forEach(n=>{G(n,e),n.value.trim()||(ot(n,e),o=!1)}),o}function G(t,e){t.addEventListener("input",()=>{t.classList.remove(S),e.textContent=""})}function v(t,e,o,n){return t.has(`${e.toLowerCase()}|${o.toLowerCase()}|${n}`)}function O(t){t.textContent="This contact has already been recorded!"}function _(t,e){G(t,e);let o=/[a-zA-Z ]/gmi;return t.value.length<=3?(t.classList.add(S),e.textContent="Value cannot be shorter than 3 letters!",!1):o.test(t.value)?!0:(t.classList.add(S),e.textContent="Value must contain English letters!",!1)}function N(t,e){return G(t,e),/^\+7 \d{3} \d{3} \d{2} \d{2}$/.test(t.value)?!0:(t.classList.add(S),e.textContent="Wrong number!",!1)}function M(t,e){let o=e.children.length,n=e.parentElement;o>0?(t.classList.add("element__counter--active"),n.classList.add("element--active"),t.textContent=o):(t.classList.remove("element__counter--active"),n.classList.remove("element--active"),t.textContent=0)}var f=".element__contacts",d=".message__name",m=".message__position",p=".message__phone",A=".element__counter",l=".column__element";var c=new Map;function Z(){let t=localStorage.getItem("contacts");if(t)try{let e=JSON.parse(t);Array.isArray(e)&&e.forEach(({name:o,position:n,phone:r})=>{let s=o[0].toUpperCase(),a=document.querySelector(`[data-id="${s.toLowerCase()}"]`)?.closest(l);a&&w(o,n,r,a)})}catch(e){console.error("\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u0430\u0440\u0441\u0438\u043D\u0433\u0430 \u0434\u0430\u043D\u043D\u044B\u0445 \u0438\u0437 localStorage:",e)}}function E(){let t=Array.from(c.values());localStorage.setItem("contacts",JSON.stringify(t))}var I=t=>{let e="";t.addEventListener("input",()=>{let o=t.value.replace(/\D/g,"");if(o.length<e.length){e=o;return}o.length===1&&o[0]!=="7"&&(o=`7${o}`);let n="+7 ";o.length>1&&(n+=o.substring(1,4)),o.length>4&&(n+=` ${o.substring(4,7)}`),o.length>7&&(n+=` ${o.substring(7,9)}`),o.length>9&&(n+=` ${o.substring(9,11)}`),t.value=n,e=o})};var P=t=>t.key==="Escape";var L=document.querySelector("#edit-popup"),b=L.querySelector(".popup__input--name"),R=L.querySelector(".popup__input--position"),h=L.querySelector(".popup__input--phone"),i=null;function T(t){i=t,b.value=t.querySelector(d).textContent,R.value=t.querySelector(m).textContent,h.value=t.querySelector(p).textContent,L.classList.add("popup--open"),L.querySelector("input").focus(),document.addEventListener("keydown",rt)}function $(){if(L.classList.remove("popup--open"),i){let t=i.querySelector(".message__edit");t&&t.focus()}i=null}function nt(){let t=b.value.trim(),e=R.value.trim(),o=h.value,n=i.querySelector(d).textContent,r=i.querySelector(m).textContent,s=i.querySelector(p).textContent,a=[b,R,h],u=document.querySelector(".popup__error");if(I(h),!x(a,u))return;if(v(c,t,e,o)){O(u);return}if(!_(b,u)||!_(R,u)||!N(h,u))return;c.delete(`${n.toLowerCase()}|${r.toLowerCase()}|${s}`),c.set(`${t.toLowerCase()}|${e.toLowerCase()}|${o}`,{name:t,position:e,phone:o}),i.querySelector(d).textContent=t,i.querySelector(m).textContent=e,i.querySelector(p).textContent=o;let X=n[0].toUpperCase(),F=document.querySelector(`[data-id="${X.toLowerCase()}"]`)?.closest(l);F&&F.querySelector(f).querySelectorAll(".element__message").forEach(C=>{let Y=C.querySelector(d).textContent,tt=C.querySelector(m).textContent,et=C.querySelector(p).textContent;Y===n&&tt===r&&et===s&&(C.querySelector(d).textContent=t,C.querySelector(m).textContent=e,C.querySelector(p).textContent=o)}),E(),$()}document.querySelector(".popup").addEventListener("click",t=>{t.target.matches(".popup__button-save")&&nt(),t.target.matches(".popup__overlay")&&$(),t.target.matches(".popup__button-cancel")&&$()});function rt(t){P(t)&&(t.preventDefault(),$())}function B(t,e,o){let r=document.querySelector("#message").content.querySelector(".message").cloneNode(!0);return r.querySelector(d).textContent=t,r.querySelector(m).textContent=e,r.querySelector(p).textContent=o,r}function ct(t,e){e.innerHTML="",t.forEach(({name:o,position:n,phone:r})=>{let s=B(o,n,r);e.append(s)})}function J(t,e){let o=document.querySelector(`[data-id="${t.toLowerCase()}"]`)?.closest(l);if(o){let n=o.querySelector(f);ct(e,n);let r=o.querySelector(A);M(r,n)}}function w(t,e,o,n,r=!0){c.set(`${t.toLowerCase()}|${e.toLowerCase()}|${o}`,{name:t,position:e,phone:o});let s=t[0].toUpperCase(),a=Array.from(c.values()).filter(u=>u.name[0].toUpperCase()===s);J(s,a),r&&E()}function U(t){let e=t.target.closest(".message"),o=e.querySelector(d).textContent,n=e.querySelector(m).textContent,r=e.querySelector(p).textContent;c.delete(`${o.toLowerCase()}|${n.toLowerCase()}|${r}`),e.remove();let s=o[0].toUpperCase(),a=Array.from(c.values()).filter(u=>u.name[0].toUpperCase()===s);J(s,a),E()}function z(t){if(t.target.closest(l)){let o=t.target.closest(".element").querySelector(f);o.classList.toggle("element__contacts--open"),o.classList.contains("element__contacts--open")?o.style.maxHeight=`${o.scrollHeight}px`:o.style.maxHeight=0}}document.querySelector(".contact-table").addEventListener("click",t=>{if(t.target.matches(".message__delete")){U(t);return}if(t.target.matches(".message__edit")){let e=t.target.closest(".message");T(e);return}z(t)});document.querySelector(".contact-table").addEventListener("keydown",t=>{if(t.keyCode===32||t.key==="Enter"){if(t.preventDefault(),t.target.matches(".message__delete")){U(t);return}if(t.target.matches(".message__edit")){let e=t.target.closest(".message");T(e);return}z(t)}});var y=document.querySelector(".modal"),D=y.querySelector(".modal__input"),q=y.querySelector(".modal__search-area");function st(t){let e=[];return c.forEach(({name:o,position:n,phone:r})=>{(o.toLowerCase().includes(t)||n.toLowerCase().includes(t)||r.includes(t))&&e.push({name:o,position:n,phone:r})}),e}function W(t){if(q.innerHTML="",t.length===0){q.textContent="No results found";return}t.forEach(({name:e,position:o,phone:n})=>{let r=B(e,o,n);q.appendChild(r)})}D.addEventListener("input",()=>{let t=D.value.trim().toLowerCase();if(t){let e=st(t);W(e)}else q.innerHTML=""});function at(){let t=Array.from(c.values());W(t)}function H(){y.classList.remove("modal--open"),D.value="",q.innerHTML="",document.querySelector(".body").style.overflow="auto"}document.querySelector(".modal").addEventListener("click",t=>{if(t.target.matches(".modal__button-show")&&at(),t.target.matches(".modal__button-cancel")&&H(),t.target.matches(".modal__overlay")&&H(),t.target.matches(".message__edit")){let e=t.target.closest(".message");T(e)}t.target.matches(".message__delete")&&U(t)});var k=document.getElementById("name"),V=document.getElementById("position"),g=document.getElementById("phone");function lt(){let t=k.value.trim(),e=V.value.trim(),o=g.value.trim(),n=document.querySelector(".interaction__error");if(!x([k,V,g],n))return;if(v(c,t,e,o)){O(n);return}if(!_(k,n)||!_(V,n)||!N(g,n))return;let s=t[0].toUpperCase(),a=document.querySelector(`[data-id="${s.toLowerCase()}"]`)?.closest(l);w(t,e,o,a),k.value="",V.value="",g.value=""}function it(){document.querySelectorAll(l).forEach(t=>{let e=t.querySelector(f);e.innerHTML="";let o=t.querySelector(A);M(o,e)}),c.clear(),E()}function ut(){y.classList.add("modal--open"),document.querySelector(".body").style.overflow="hidden",y.querySelector("input").focus(),document.addEventListener("keydown",dt)}document.querySelector(".buttons").addEventListener("click",t=>{t.target.matches(".buttons__button--add")&&(t.preventDefault(),lt()),t.target.matches(".buttons__button--clear")&&it(),t.target.matches(".buttons__button--search")&&ut()});function dt(t){P(t)&&(t.preventDefault(),H())}var mt=document.querySelector("#letter").content.querySelector(".element"),pt=({letter:t,id:e})=>{let o=mt.cloneNode(!0);return o.querySelector(".element__letter").textContent=t,o.querySelector(".element__letter").dataset.id=e,o.setAttribute("tabindex","0"),o},K=(t,e)=>{let o=document.createDocumentFragment();t.forEach(n=>{let r=pt(n);o.append(r)}),e.append(o)};var j=[{letter:"A",id:"a"},{letter:"B",id:"b"},{letter:"C",id:"c"},{letter:"D",id:"d"},{letter:"E",id:"e"},{letter:"F",id:"f"},{letter:"G",id:"g"},{letter:"H",id:"h"},{letter:"I",id:"i"},{letter:"J",id:"j"},{letter:"K",id:"k"},{letter:"L",id:"l"},{letter:"M",id:"m"}],Q=[{letter:"N",id:"n"},{letter:"O",id:"o"},{letter:"P",id:"p"},{letter:"Q",id:"q"},{letter:"R",id:"r"},{letter:"S",id:"s"},{letter:"T",id:"t"},{letter:"U",id:"U"},{letter:"V",id:"v"},{letter:"W",id:"w"},{letter:"X",id:"x"},{letter:"Y",id:"y"},{letter:"Z",id:"z"}];document.addEventListener("DOMContentLoaded",()=>{let t=document.querySelector(".column-left"),e=document.querySelector(".column-right");K(j,t),K(Q,e),Z(),I(g)});
