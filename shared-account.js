(()=>{
 const css=document.createElement('link');css.rel='stylesheet';css.href='shared-account.css?v=20261113-team-link-4';document.head.append(css);
 const svg=(path)=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${path}"/></svg>`;
 const icons={gift:'M12 3v18M3 8h18v5H3Zm2 5v8h14v-8M12 8C4 8 6 1 10 4Zm0 0c8 0 6-7 2-4Z',contact:'M21 11a9 9 0 0 1-9 9H4l1-5a9 9 0 1 1 16-4Z',credits:'M4 4h16v16H4ZM8 15v-3m4 3V8m4 7v-5',card:'M3 5h18v14H3Zm0 5h18M7 15h3',team:'M8 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM2 21v-2a6 6 0 0 1 12 0v2m2-16a4 4 0 0 1 0 8m1 3a5 5 0 0 1 5 5',user:'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm0 4a3 3 0 1 0 0 6 3 3 0 0 0 0-6ZM6 19a6 6 0 0 1 12 0',exit:'M10 4h10v16H10M4 12h11m-7-4-4 4 4 4'};
 const menu=document.createElement('dialog');menu.className='fm-profile-menu';menu.id='fmProfileMenu';menu.setAttribute('aria-label','个人菜单');
 const item=(key,label,extra='')=>`<button type="button" data-account-action="${key}">${svg(icons[key])}<span>${extra}${label}</span>${key==='team'?'<span class="fm-team-switch-label">切换</span>':key==='gift'?'<span class="fm-chevron">›</span>':''}</button>`;
 menu.innerHTML=`<div class="fm-profile-heading"><span class="fm-profile-avatar">R</span><b>Ricky Tang</b><button type="button" data-dismiss aria-label="关闭个人菜单">×</button></div><button type="button" class="fm-recharge-row" data-recharge><span class="fm-sparkle">✦</span>0 · 充值</button>${item('gift','邀请有礼')}${item('contact','联系我们')}${item('credits','积分明细')}${item('card','订单明细')}${item('team','个人账户','<small>当前团队</small>')}${item('user','账号管理')}${item('exit','退出系统')}`;
 const menuFeedback=document.createElement('p');menuFeedback.className='fm-menu-feedback';menuFeedback.setAttribute('role','status');menu.append(menuFeedback);
 document.body.append(menu);
 const plans=[
 {name:'自定义模型版',style:'custom',description:'自备模型，灵活创作',teamManagement:false},
 {name:'个人版',price:'999',style:'personal',description:'一个人，也能高效创作',teamManagement:false},
 {name:'团队版',price:'1999',style:'team',description:'共享创作能力，协同管理团队',teamManagement:true}
 ];
 const featureGroups=[{title:'创作工具',items:['视频创作','详情长图','商品套图','商品生视频','爆款复刻','AI 换装','穿搭分离','数字人口播','图文笔记']},{title:'管理功能',items:['店铺管理']}];
 const recharge=document.createElement('dialog');recharge.className='fm-recharge-dialog';recharge.id='fmRechargeDialog';recharge.setAttribute('aria-labelledby','fmRechargeTitle');
 recharge.innerHTML=`<button type="button" class="fm-recharge-close" data-dismiss aria-label="关闭充值弹窗">×</button><header><h2 id="fmRechargeTitle">选择适合你的创作方案</h2><p>个人与团队，核心创作功能一致；团队版增加团队管理与更多积分</p></header><div class="fm-plan-grid">${plans.map(p=>`<article class="fm-plan ${p.style}">${p.style==='team'?'<span class="fm-plan-badge">团队协作</span>':''}${p.style==='custom'?'<span class="fm-plan-badge">自备模型 · 免费使用</span>':''}<h3>${p.name}</h3><div class="fm-plan-price">${p.style==='custom'?'免费':`<small>¥</small> ${p.price} <small>/ 年</small>`}</div><p class="fm-plan-offer">${p.description}</p>${p.style==='custom'?'<a class="fm-plan-cta" href="model-management.html">去配置模型</a>':`<button type="button" class="fm-plan-cta" data-contact>咨询${p.name}</button>`}<div class="fm-plan-points">${p.style==='custom'?'<b>不赠送积分</b><small>配置自己的图片 / 视频 / 文案模型</small>':`<b>${p.style==='team'?'更多赠送积分':'赠送创作积分'}</b><small>${p.style==='team'?'高于个人版，具体数量待定':'具体数量待定'}</small>`}</div>${featureGroups.map(group=>`<h4>${group.title}</h4><ul>${group.items.map(name=>`<li><span>✓</span>${name}</li>`).join('')}</ul>`).join('')}<h4 class="fm-other-heading">独家功能</h4><ul><li><span>✓</span>无限画布全部组件</li><li><span>✓</span>批量视频生成</li><li class="${p.teamManagement?'':'unavailable'}"><span>${p.teamManagement?'✓':'×'}</span>团队管理</li><li><span>✓</span>自主配置大模型 API</li></ul><h4 class="fm-other-heading">其他权益</h4><ul><li><span>✓</span>1v1专属客服</li><li><span>✓</span>去除品牌水印</li></ul></article>`).join('')}</div><p class="fm-plan-comparison">个人版与团队版的其他功能和服务一致，团队版额外提供团队管理及更多积分。</p><p class="fm-recharge-note">静态原型演示，不产生真实付款、会员开通或积分变动。赠送积分数量待定；自备模型的调用费用按供应商规则结算。</p><p class="fm-recharge-feedback" role="status"></p>`;
 // Periods are explicit: annual prices are confirmed; monthly pricing is not inferred.
 const year=document.createElement('section');year.id='fmBilling-year';year.className='fm-billing-panel';year.setAttribute('role','tabpanel');year.setAttribute('aria-labelledby','fmTab-year');
 const grid=recharge.querySelector('.fm-plan-grid'),comparison=recharge.querySelector('.fm-plan-comparison');grid.before(year);year.append(grid,comparison);
 const month=year.cloneNode(true);month.id='fmBilling-month';month.setAttribute('aria-labelledby','fmTab-month');month.hidden=true;
 month.querySelectorAll('.fm-plan:not(.custom)').forEach(card=>{card.querySelector('.fm-plan-price').innerHTML='价格待定 <small>/ 月</small>';card.querySelector('.fm-plan-offer').textContent='月付价格及赠送积分待定'});
 year.after(month);
 const packs=[{name:'新手套餐',price:38,credits:3800,bonus:0},{name:'轻享套餐',price:98,credits:9800,bonus:1100,months:1},{name:'进阶套餐',price:198,credits:19800,bonus:5000,months:1},{name:'高级套餐',price:698,credits:69800,bonus:30000,months:6}];
 const numbers=n=>n.toLocaleString('en-US');
 const topup=document.createElement('section');topup.id='fmBilling-topup';topup.className='fm-billing-panel';topup.setAttribute('role','tabpanel');topup.setAttribute('aria-labelledby','fmTab-topup');topup.hidden=true;
 topup.innerHTML=`<div class="fm-topup-heading"><h3>平台积分补充包</h3><p>单独购买积分，用于平台生图、改图和视频等功能。按需补充，不改变当前会员版本。</p></div><div class="fm-topup-grid">${packs.map(pack=>`<article class="fm-credit-pack"><h3>${pack.name}</h3><div class="fm-plan-price"><small>¥</small> ${pack.price} <small>/ 单次充值</small></div><div class="fm-credit-amount">${numbers(pack.credits)} <small>积分</small></div><p class="fm-credit-bonus">${pack.bonus?`另赠 ${numbers(pack.bonus)} 积分`:'按需购买，轻量补充'}</p><ul><li>充值积分永久有效</li><li>${pack.bonus?`赠送积分有效期 ${pack.months} 个月`:'不含赠送积分'}</li><li>适用于平台图片与视频功能</li><li>一次购买，随时使用</li></ul><button type="button" class="fm-plan-cta" data-credit-pack="${pack.name}">选择此套餐</button></article>`).join('')}</div><p class="fm-topup-note">积分包金额、数量与有效期按参考图展示，均为待确认的演示配置；实际消耗以所用模型和任务为准。</p>`;
 month.after(topup);
 const tabs=document.createElement('div');tabs.className='fm-billing-tabs';tabs.setAttribute('role','tablist');tabs.setAttribute('aria-label','购买方式');
 tabs.innerHTML=[['month','按月'],['year','按年'],['topup','充值积分包']].map(([id,label])=>`<button type="button" role="tab" id="fmTab-${id}" data-billing-tab="${id}" aria-controls="fmBilling-${id}" aria-selected="${id==='year'}" tabindex="${id==='year'?0:-1}">${label}</button>`).join('');
 year.before(tabs);
 const panels={year,month,topup};
 function selectBilling(id){recharge.dataset.billing=id;for(const tab of tabs.querySelectorAll('[role=tab]')){const active=tab.dataset.billingTab===id;tab.setAttribute('aria-selected',String(active));tab.tabIndex=active?0:-1}for(const [key,panel] of Object.entries(panels))panel.hidden=key!==id;recharge.querySelector('.fm-recharge-feedback').textContent='';}
 tabs.addEventListener('click',e=>{const tab=e.target.closest('[data-billing-tab]');if(tab)selectBilling(tab.dataset.billingTab)});
 tabs.addEventListener('keydown',e=>{const buttons=[...tabs.querySelectorAll('[role=tab]')],index=buttons.indexOf(document.activeElement);if(index<0||!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();const next=e.key==='Home'?0:e.key==='End'?buttons.length-1:(index+(e.key==='ArrowRight'?1:-1)+buttons.length)%buttons.length;selectBilling(buttons[next].dataset.billingTab);buttons[next].focus()});
 topup.querySelectorAll('[data-credit-pack]').forEach(button=>button.onclick=()=>{recharge.querySelector('.fm-recharge-feedback').textContent='已选择'+button.dataset.creditPack+'。当前为静态演示，未创建订单、付款或增加积分。'});
 recharge.querySelector('.fm-recharge-note').textContent='静态原型演示，不产生真实付款、会员开通或积分变动。月付价格、会员赠送积分待定；自备模型费用由供应商结算。';
 function openRecharge(){selectBilling('year');recharge.showModal();recharge.scrollTop=0;}
 selectBilling('year');
 document.body.append(recharge);
 const notice=document.createElement('div');notice.className='fm-account-notice';notice.setAttribute('role','status');document.body.append(notice);let timer;
 function inform(text){if(menu.open){menuFeedback.textContent=text;return}notice.textContent=text;notice.classList.add('visible');clearTimeout(timer);timer=setTimeout(()=>notice.classList.remove('visible'),3000)}
 let opener;
 const triggers=[...document.querySelectorAll('.fm-account,.top-actions .avatar')];
 const mobile=document.createElement('button');mobile.type='button';mobile.className='fm-mobile-account';mobile.textContent='R';mobile.setAttribute('aria-label','打开个人菜单');mobile.setAttribute('aria-haspopup','dialog');document.body.append(mobile);triggers.push(mobile);
 function openMenu(event){opener=event.currentTarget;const rect=opener.getBoundingClientRect();menu.style.left=Math.max(12,Math.min(rect.left,innerWidth-312))+'px';menu.style.top=Math.max(12,Math.min(rect.bottom+8,innerHeight-570))+'px';menu.showModal();opener.setAttribute('aria-expanded','true')}
 triggers.forEach(t=>{if(t.tagName!=='BUTTON'){t.setAttribute('role','button');t.tabIndex=0;t.setAttribute('aria-label','打开个人菜单');t.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openMenu(e)}})}t.addEventListener('click',openMenu)});
 menu.addEventListener('close',()=>{if(opener){opener.setAttribute('aria-expanded','false');opener.focus()}});
 [menu,recharge].forEach(d=>{d.querySelector('[data-dismiss]').onclick=()=>d.close();d.addEventListener('click',e=>{if(e.target!==d)return;const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close()})});
 menu.querySelector('[data-recharge]').onclick=()=>{menu.close();openRecharge()};
 document.querySelectorAll('.top-actions .credit').forEach(b=>b.addEventListener('click',()=>openRecharge()));
 menu.querySelectorAll('[data-account-action]').forEach(b=>b.onclick=()=>inform(`${b.querySelector('span').textContent.replace('当前团队','')}：当前为静态演示，暂未接入账号服务。`));
 // The account menu and center read one shared workspace store.
 const accountStore=window.FashAccountStore;
 const escape=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const navigate=(tab,workspaceId)=>{const url=new URL('account-center.html',location.href);url.searchParams.set('tab',tab);if(workspaceId)url.searchParams.set('workspace',workspaceId);location.href=url.href};
 function syncWorkspace(){try{const current=accountStore.current(),balance=accountStore.balance(current.id),small=document.querySelector('.fm-account small');if(small)small.textContent=current.kind==='personal'?'个人空间':current.name;menu.querySelector('[data-account-action=team] span').innerHTML='<small>当前团队</small>'+escape(current.name);menu.querySelector('[data-recharge]').innerHTML='<span class="fm-sparkle">✦</span>'+balance.toLocaleString('zh-CN')+' · 充值';const credit=document.querySelector('.top-actions .credit');if(credit)credit.textContent='✦ '+balance.toLocaleString('zh-CN');}catch(error){menuFeedback.textContent=error.message}}
 menu.querySelector('[data-account-action=team]').onclick=()=>navigate('members',accountStore.current().id);
 menu.querySelector('[data-account-action=credits]').onclick=()=>navigate('credits',accountStore.current().id);
 menu.querySelector('[data-account-action=card]').onclick=()=>navigate('orders',accountStore.current().id);
 menu.querySelector('[data-account-action=gift]').onclick=()=>{const url=new URL('account-center.html',location.href);url.search=new URLSearchParams({tab:'credits',workspace:accountStore.current().id,type:'invite_reward'}).toString();location.href=url.href};
 window.FashAccountUI={openRecharge};window.addEventListener('fashmaker-account-changed',syncWorkspace);syncWorkspace();
 recharge.querySelectorAll('[data-contact]').forEach(b=>b.onclick=()=>{recharge.querySelector('.fm-recharge-feedback').textContent='当前为静态演示，暂未接入客服与支付服务。'});
})();
