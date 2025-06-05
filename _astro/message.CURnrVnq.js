function u(i){return new Promise(t=>setTimeout(t,i))}class m{queue;constructor(t=document.body){this.reset(t)}reset(t=document.body){this.queue?.remove(),this.queue=document.createElement("div"),this.queue.className="na-message-queue",t.append(this.queue)}async emit(t){const e=document.createElement("div");let n=2e3,a="",r={},s=t??"☘";if(typeof s!="string"&&(n=s.duration??2e3,a=`${s.primary??""}`,r=s.style??{},s=`${s.content??"☘"}`),e.innerHTML=`
            <div class="na-message">
                <p class="na-paragraph">${s}</p>
            </div>
        `,a){const o=e.firstElementChild;o.dataset.primary=a,Object.entries(r).map(c=>o.style.setProperty(...c))}this.queue.appendChild(e),e.style.height=`${e.offsetHeight}px`,e.style.transition="opacity 1s, height 2s",await u(n),e.style.opacity="0",e.style.height="0",await u(2e3),this.queue.removeChild(e)}}const l=new m,p=(...i)=>l.emit(...i);export{l as _,p as m};
