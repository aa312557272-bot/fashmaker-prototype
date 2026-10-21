// Shared navigation and one-page product handoff for the four local prototypes.
(()=>{
  const page=location.pathname.split('/').pop();
  const route={'index.html':'详情图生成','product-suite.html':'商品套图','product-video.html':'商品生视频','asset-library.html':'资产库'};
  const nav=document.createElement('nav');nav.className='prototype-journey';nav.setAttribute('aria-label','功能导航');
  Object.entries(route).forEach(([file,label])=>{const a=document.createElement('a');a.href=file;a.textContent=label;if(file===page)a.setAttribute('aria-current','page');nav.append(a)});
  if(page==='batch.html')document.querySelector('.header')?.append(nav);
  else if(page==='asset-library.html')document.querySelector('.pagehead')?.append(nav);
  else document.querySelector('.topbar')?.append(nav);
  if(page==='asset-library.html'){
    const foot=document.querySelector('.drawer-foot');
    if(foot){const actions=document.createElement('div');actions.className='product-handoff';actions.innerHTML='<span>用此商品创作</span><button type="button" data-create-route="index.html">详情图</button><button type="button" data-create-route="product-suite.html">商品套图</button><button type="button" data-create-route="product-video.html">商品生视频</button>';foot.prepend(actions);actions.addEventListener('click',e=>{const button=e.target.closest('[data-create-route]');if(!button||!activeProduct)return;const product={...activeProduct,name:document.querySelector('#productName').value.trim()||activeProduct.name,desc:document.querySelector('#productDesc').value,usp:[...document.querySelectorAll('.usp-input')].map(i=>i.value.trim()).filter(Boolean).join('、'),assets:[...draftAssets]};const images=product.assets.slice(0,6).map((src,i)=>({src,name:product.name+' · 商品图 '+(i+1)}));if(button.dataset.createRoute==='batch.html'){window.name='fashmaker-batch:'+JSON.stringify({mode:'main',global:{},returnTo:'asset-library.html',tasks:[{name:product.name,images,sellingPoints:product.usp||product.desc}]})}else{window.name='fashmaker-asset-product:'+JSON.stringify({...product,images})}location.href=button.dataset.createRoute})}
    return;
  }
  const picker=page==='batch.html'?document.querySelector('.asset-modal-foot'):document.querySelector('#assetModal .modal-foot');
  if(picker){const open=document.createElement('a');open.className='open-full-library';open.href='asset-library.html';open.textContent='打开完整资产库 →';open.title='前往资产库选择商品，再从商品详情打开当前创作工具';picker.prepend(open)}
  if(page==='batch.html')return;
  let incoming=null;try{if(window.name.startsWith('fashmaker-asset-product:'))incoming=JSON.parse(window.name.slice('fashmaker-asset-product:'.length))}catch(e){};
  if(!incoming)return;window.name='';
  const source=(incoming.images||[]).slice(0,16);
  if(page==='index.html'){
    images.splice(0,images.length,...source);renderUploads();if(typeof renderThumbs==='function')renderThumbs();
  }else if(page==='product-suite.html'){
    assets.splice(0,assets.length,...source);renderUploads();if(typeof render==='function')render();
  }
  const field=document.querySelector('#sellingPoints');if(field)field.value=[incoming.name,incoming.desc,incoming.usp].filter(Boolean).join('\n');
  const taskName=document.querySelector('#taskName');if(taskName)taskName.textContent=incoming.name+' · '+(page==='index.html'?'详情图':'商品套图');
})();
