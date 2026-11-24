(()=>{
 const page=location.pathname.split('/').pop()||'index.html';
 document.body.classList.add('fm-shell');
 if(['index.html','product-suite.html'].includes(page))document.body.classList.add('fm-image-shell');
 const old=document.querySelector('aside.sidebar');const side=document.createElement('aside');side.className='sidebar fm-sidebar';
 const paths={home:'M3 10 12 3l9 7v10h-6v-6H9v6H3Z',image:'M3 4h18v16H3Zm2 12 5-6 4 4 3-3 4 5M7 8h.01',video:'M3 6h12v12H3Zm12 4 6-4v12l-6-4',square:'M4 4h16v16H4Z',copy:'M8 8h13v13H8ZM3 16V3h13',outfit:'M12 4v4l8 5v4H4v-4l8-5',note:'M5 3h14v18H5Zm4 5h6m-6 4h6m-6 4h4',folder:'M3 6h7l2 3h9v11H3Z',clock:'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm0 4v6l4 2',gear:'M12 3v3m0 12v3M3 12h3m12 0h3M6 6l2 2m8 8 2 2M6 18l2-2M16 8l2-2M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z'};
 const icon=k=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${paths[k]||paths.video}"/></svg>`;
 const current = page === 'product-detail.html' ? 'asset-library.html' : page;
 const links = [
   ['详情长图','index.html','image'],
   ['商品套图','product-suite.html','square'],
   ['商品生视频','product-video.html','video'],
   ['爆款复刻','viral-remix.html','copy'],
   ['AI 换装','ai-tryon.html','outfit'],
   ['穿搭分离','outfit-separation.html','outfit'],
   ['数字人口播','digital-human.html','video'],
   ['图文笔记','graphic-notes.html','note']
 ];
 const management = [
   ['资产库','asset-library.html','folder'],
   ['店铺管理','shop-management.html','folder'],
   ['模型管理','model-management.html','gear'],
   ['账户中心','account-center.html','note']
 ];
 const link=(name,file,key)=>`<a href="${file}" ${file===current?'class="active" aria-current="page"':''}>${icon(key)}<span>${name}</span></a>`;
 const navigation=`<div class="fm-nav-label">创作工具</div>${links.map(args=>link(...args)).join('')}<div class="fm-nav-label">管理</div>${management.map(args=>link(...args)).join('')}`;
 const historyButton=`<button type="button" data-shell-history>${icon('clock')}<span>创作记录</span></button>`;
 side.innerHTML=`<div class="fm-brand"><span class="fm-brand-mark">FM</span><div>FashMaker<small>电商内容工作台</small></div><a class="fm-admin-switch" href="total-admin.html" title="打开 FashMaker 总后台">总后台 ↗</a></div><nav aria-label="主导航">${navigation}${historyButton}</nav><button type="button" class="fm-account" aria-label="打开个人菜单" aria-haspopup="dialog" aria-expanded="false"><span class="fm-account-avatar">R</span><div><b>Ricky Tang</b><small>个人空间</small></div><span class="fm-account-more">···</span></button>`;
 if(old)old.replaceWith(side);else document.body.prepend(side);
 const mobile=document.createElement('details');
 mobile.className='fm-mobile-nav fm-sidebar';
 mobile.innerHTML=`<summary>FashMaker · 功能导航</summary><nav aria-label="移动端主导航">${navigation}${historyButton}</nav>`;
 side.after(mobile);
 const loadAccount=()=>{const script=document.createElement('script');script.src='shared-account.js?v=20261124-ocp';document.body.append(script)};if(window.FashAccountStore)loadAccount();else{const script=document.createElement('script');script.src='account-store.js?v=20261113-transfers-2';script.onload=loadAccount;document.body.append(script)};
 const css=document.createElement('link');css.rel='stylesheet';css.href='shared-sidebar.css?v=20261124-nav';document.head.append(css);
 for(const button of [side,mobile].map(shell=>shell.querySelector('[data-shell-history]'))){
   button.onclick=()=>{
     mobile.open=false;
     const history=document.querySelector('#historyBtn,#history,.task-history-open,#openHistory');
     if(history)history.click();
     else if(page==='asset-library.html'){
       document.querySelector('[data-main=materials]')?.click();
       document.getElementById('materialTabs')?.querySelector('button')?.click();
     }
     else location.href='asset-library.html';
   };
 }
})();
