const t=new Set(["input","onpropertychange"]),n=["start_string","in_string","out_string"];let e="",o="",l="";function r(t){return document.getElementById(t).value}function i(){let t=r("start_string"),n=r("in_string"),i=r("out_string");if(""!==n&&(t!==e||n!==o||i!==l)){e=t,o=n,l=i;let r=function(t,n,e){let o=[{s:t,parent:null,depth:0,loop_of:null}],l=0;for(;l<o.length&&l<500;){if(null===o[l].loop_of)for(let t of function*(t,n,e){let o=t.s.indexOf(n);for(;-1!==o;){let l=t.s.substring(0,o)+e+t.s.substring(o+n.length),r=function t(n,e){return -1!==e.indexOf(n.s)?n:null===n.parent?null:t(n.parent,e)}(t,l);yield{s:l,parent:t,depth:t.depth+1,loop_of:r},o=t.s.indexOf(n,o+1)}}(o[l],n,e))o.push(t);l+=1}return o}//# sourceMappingURL=index.d3005432.js.map
(e,o,l),u=r.map(t=>`<li>${t.depth}: ${function(t){if(null===t.loop_of)return t.s;{let n=t.s.indexOf(t.loop_of.s);return`${t.s.substring(0,n)}<b>${t.loop_of.s}</b>${t.s.substring(n+t.loop_of.s.length)}`}}(t)} </li>`),s=`<ul>${u.join("")}</ul>`,f=document.getElementById("output");f.innerHTML=s}}window.onload=()=>{(function(){let t=new URL(window.location.href).searchParams;n.forEach(n=>{let e=document.getElementById(n),o=t.get(n);o&&(e.value=o)}),i()})(),n.forEach(n=>{t.forEach(t=>{let e=document.getElementById(n);e.addEventListener(t,t=>{i()})}),i()})};
//# sourceMappingURL=index.d3005432.js.map
