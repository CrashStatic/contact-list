var r="#letter";var E=".element";var s=".element__letter";var T=document.querySelector(r),c=T.content.querySelector(E),p=({letter:o,id:n})=>{let t=c?.cloneNode(!0);if(t){let e=t.querySelector(s);e.textContent=o,e.dataset.id=n,t.setAttribute("tabindex","0")}return t},L=(o,n)=>{let t=document.createDocumentFragment();o.forEach(e=>{let _=p(e);t.append(_)}),n.append(t)};export{L as createColumn};
