(()=>{
 const page=location.pathname.split('/').pop()||'index.html';
 document.body.classList.add('fm-shell');
 if(['index.html','product-suite.html'].includes(page))document.body.classList.add('fm-image-shell');
 const old=document.querySelector('aside.sidebar');const side=document.createElement('aside');side.className='sidebar fm-sidebar';
 const paths={home:'M3 10 12 3l9 7v10h-6v-6H9v6H3Z',image:'M3 4h18v16H3Zm2 12 5-6 4 4 3-3 4 5M7 8h.01',video:'M3 6h12v12H3Zm12 4 6-4v12l-6-4',square:'M4 4h16v16H4Z',copy:'M8 8h13v13H8ZM3 16V3h13',outfit:'M12 4v4l8 5v4H4v-4l8-5',note:'M5 3h14v18H5Zm4 5h6m-6 4h6m-6 4h4',folder:'M3 6h7l2 3h9v11H3Z',clock:'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm0 4v6l4 2',gear:'M12 3v3m0 12v3M3 12h3m12 0h3M6 6l2 2m8 8 2 2M6 18l2-2M16 8l2-2M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z'};
 const icon=k=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${paths[k]||paths.video}"/></svg>`;
 const link=(name,file,k)=>`<a href="${file}" ${file===page?'class="active" aria-current="page"':''}>${icon(k)}<span>${name}</span></a>`;
 side.innerHTML=`<div class="fm-brand"><span class="fm-brand-mark">FM</span><div>FashMaker<small>电商内容工作台</small></div></div><nav aria-label="主导航">${link('首页','index.html#home','home')}<div class="fm-nav-label">创作工具</div>${link('视频创作','product-video.html#video','video')}${link('详情长图','index.html','image')}${link('商品套图','product-suite.html','square')}${link('商品生视频','product-video.html','video')}${link('爆款复刻','viral-remix.html','copy')}${link('AI 换装','ai-tryon.html','outfit')}${link('穿搭分离','outfit-separation.html','outfit')}${link('数字人口播','digital-human.html','video')}${link('图文笔记','graphic-notes.html','note')}${link('资产库','asset-library.html','folder')}<div class="fm-nav-label">管理</div><button type="button" data-shell-history>${icon('clock')}<span>创作记录</span></button><button type="button" data-shell-settings>${icon('gear')}<span>设置</span></button></nav><div class="fm-account"><span class="fm-account-avatar">R</span><div><b>Ricky Tang</b><small>个人空间</small></div><span class="fm-account-more">···</span></div>`;
 if(old)old.replaceWith(side);else document.body.prepend(side);
 const css=document.createElement('link');css.rel='stylesheet';css.href='shared-sidebar.css?v=20261110-layout-3';document.head.append(css);
 side.querySelector('[data-shell-settings]').onclick=()=>document.querySelector('.fm-model-entry')?.click();
 side.querySelector('[data-shell-history]').onclick=()=>{const b=document.querySelector('#historyBtn,#history,.task-history-open,#openHistory');if(b)b.click();else alert('当前页面没有创作历史，请进入对应创作工具查看。')};
})();
