// Local configuration prototype: never sends credentials, prompts, or media to an API.
(()=>{
'use strict';
const key='fashmaker-custom-models-v1',page=location.pathname.split('/').pop()||'index.html';
const video=['product-video.html','viral-remix.html','digital-human.html'].includes(page);
const kinds=['image','video','text'],kindNames={image:'图片',video:'视频',text:'文案'},protocols={image:'image-api',video:'video-task',text:'text-chat'};
const preferenceKey='fashmaker-model-preferences-v1';
let preferences={};try{preferences=JSON.parse(localStorage.getItem(preferenceKey)||'{}')}catch{}
let models=[];
try{models=JSON.parse(localStorage.getItem(key)||'[]');if(!Array.isArray(models))models=[]}catch{}
const el=(tag,text)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;return n};
const css=el('link');css.rel='stylesheet';css.href='custom-models.css?v=20261110-models-2';document.head.append(css);
const modal=el('dialog');modal.className='fm-model-dialog';modal.setAttribute('aria-labelledby','fmModelTitle');
modal.innerHTML=`<header><div><small>FASHMAKER · MODEL SETTINGS</small><h2 id="fmModelTitle">自定义模型</h2></div><button type="button" data-close aria-label="关闭模型配置">✕</button></header><p class="fm-muted">配置图片、视频和文案模型；各类型可独立选择平台默认或某个自配模型。</p><p class="fm-demo">本地配置演示，不调用真实接口。请使用测试 Key；Key 仅在当前标签页会话保存。</p><div class="fm-model-list"></div><form class="fm-model-form"><h3>添加模型</h3><div class="fm-model-grid"><label>模型用途<select name="kind"><option value="image">图片生成</option><option value="video">视频生成</option><option value="text">文案生成</option></select></label><label>配置名称<input name="name" required maxlength="50" placeholder="例如：公司的商品图模型"></label></div><label>接口协议<select name="protocol"><option value="image-api">图片生成 / 编辑 API</option><option value="video-task">视频异步任务 API</option><option value="text-chat">文案 / 对话 API</option></select></label><label>完整接口地址<input name="endpoint" type="url" required placeholder="https://api.example.com/v1/images/generations"></label><label>API Key<input name="apiKey" type="password" autocomplete="off" required placeholder="仅保存至当前标签页会话"></label><label>模型 ID<input name="modelId" required maxlength="150" placeholder="填写供应商提供的准确模型 ID"></label><p class="fm-muted">协议选项仅为接入配置示意。真实请求格式、素材上传及视频任务查询需要后端适配。</p><p class="fm-model-status" role="status"></p><footer><button type="button" data-check>检查配置格式</button><button type="submit" class="fm-primary">保存模型</button></footer></form>`;
document.body.append(modal);
const form=modal.querySelector('form'),f=form.elements,status=modal.querySelector('[role=status]');let editing=null;
function readSession(id){try{return sessionStorage.getItem(key+':'+id)||''}catch{return ''}}
function resolveModel(kind,select){if(!kinds.includes(kind))throw Error('未知模型类型');if(select)return snapshot(select);const id=preferences[kind],m=models.find(m=>m.id===id&&m.kind===kind&&m.enabled!==false);return m?{id:m.id,name:m.name,kind,modelId:m.modelId,protocol:m.protocol,endpoint:m.endpoint,source:'custom'}:{id:'platform-'+kind,name:'平台默认'+kindNames[kind]+'模型',kind,source:'platform'}}
function snapshot(select){const value=select?.value||'';const m=models.find(x=>x.id===value);return m?{id:m.id,name:m.name,kind:m.kind,modelId:m.modelId,protocol:m.protocol,endpoint:m.endpoint,source:'custom'}:{id:value,name:select?.selectedOptions[0]?.textContent||value,kind:select?.dataset.fmModel||(video?'video':'image'),source:'platform'}}
window.FashCustomModels={options:kind=>models.filter(m=>m.kind===kind).map(m=>m.id),label:id=>{const m=models.find(m=>m.id===id);return m?m.name+' · 自定义':id},snapshot:()=>{const selected=[...document.querySelectorAll('[data-fm-model]')].map(snapshot);for(const kind of kinds)if(!selected.some(m=>m.kind===kind))selected.push(resolveModel(kind));return selected},restore(items){for(const saved of items||[]){const select=[...document.querySelectorAll('[data-fm-model]')].find(s=>s.dataset.fmModel===saved.kind);if(!select)continue;if(![...select.options].some(o=>o.value===saved.id)){select.add(new Option(saved.name+'（历史配置）',saved.id))}select.value=saved.id;select.dispatchEvent(new Event('change',{bubbles:true}))}}};
function sync(){document.querySelectorAll('[data-fm-model],select[data-override-field="model"]').forEach(select=>{const kind=select.dataset.fmModel||'image',value=select.value;select.querySelectorAll('[data-custom-model]').forEach(n=>n.remove());models.filter(m=>m.kind===kind).forEach(m=>{const o=new Option(m.name+' · 自定义'+(m.enabled===false?'（已停用）':''),m.id);o.disabled=m.enabled===false;o.dataset.customModel='true';select.add(o)});if([...select.options].some(o=>o.value===value))select.value=value;else if(value.startsWith('custom-')){const o=new Option('已移除的模型（请重新选择）',value);o.dataset.customModel='true';select.add(o);select.value=value}})}
function renderList(){const list=modal.querySelector('.fm-model-list');list.replaceChildren();if(!models.length)list.append(el('p','尚未添加自定义模型，创作时继续使用平台模型。'));models.forEach(m=>{const row=el('div');row.className='fm-model-row';const copy=el('div');copy.append(el('b',m.name),el('small',kindNames[m.kind]+' · '+m.modelId+' · '+(readSession(m.id)?'当前会话已填 Key':'需重新填写 Key')));const edit=el('button','编辑');edit.type='button';edit.onclick=()=>{editing=m.id;for(const k of ['kind','name','protocol','endpoint','modelId'])f[k].value=m[k];f.apiKey.value='';f.apiKey.required=false;f.apiKey.placeholder='留空保留当前标签页已配置的 Key';f.kind.disabled=true;form.querySelector('h3').textContent='编辑模型';status.textContent='';f.name.focus()};const remove=el('button','删除');remove.type='button';remove.onclick=()=>{if(!confirm('删除此模型配置？已保存的历史结果不会删除。'))return;try{window.FashCustomModels.remove(m.id);renderList();if(editing===m.id)reset()}catch{status.textContent='删除失败，请检查浏览器存储。'}};row.append(copy,edit,remove);list.append(row)})}
function reset(){editing=null;form.reset();f.kind.disabled=false;f.apiKey.required=true;f.apiKey.placeholder='仅保存至当前标签页会话';form.querySelector('h3').textContent='添加模型';status.textContent='';setProtocol()}
function setProtocol(){f.protocol.value=protocols[f.kind.value];f.endpoint.placeholder={image:'https://api.example.com/v1/images/generations',video:'https://api.example.com/v1/videos',text:'https://api.example.com/v1/chat/completions'}[f.kind.value]}
f.kind.onchange=setProtocol;
function validate(){if(!form.reportValidity())return false;try{const u=new URL(f.endpoint.value);if(!['http:','https:'].includes(u.protocol))throw Error();if(u.username||u.password)throw Error()}catch{status.textContent='请填写有效的 HTTP(S) 接口地址，地址中不能包含账号密码。';return false}if(!f.name.value.trim()||!f.modelId.value.trim()||(!f.apiKey.value.trim()&&(!editing||!readSession(editing)))){status.textContent='名称、模型 ID 和 API Key 不能为空。';return false}if(f.protocol.value!==protocols[f.kind.value]){status.textContent='接口协议需要与模型用途一致。';return false}return true}
modal.querySelector('[data-check]').onclick=()=>{if(validate())status.textContent='配置格式有效；未发起网络请求，接口连通性与模型能力尚未验证。'};
form.onsubmit=e=>{e.preventDefault();if(!validate())return;const id=editing||'custom-'+crypto.randomUUID(),m={...models.find(x=>x.id===id),id,kind:f.kind.value,name:f.name.value.trim(),protocol:f.protocol.value,endpoint:f.endpoint.value.trim(),modelId:f.modelId.value.trim(),enabled:models.find(x=>x.id===id)?.enabled!==false,updatedAt:Date.now(),testStatus:'untested',lastTest:null};const next=[...models.filter(x=>x.id!==id),m];try{if(f.apiKey.value.trim())sessionStorage.setItem(key+':'+id,f.apiKey.value.trim());localStorage.setItem(key,JSON.stringify(next));models=next;sync();renderList();reset();window.dispatchEvent(new Event('fashmaker-models-changed'));status.textContent='已保存，已加入对应功能的模型选择。'}catch{status.textContent='保存失败，请检查浏览器存储空间。'}};
modal.querySelector('[data-close]').onclick=()=>modal.close();
function open(){reset();renderList();modal.showModal()}
const entry=el('button','⚙ 自定义模型');entry.type='button';entry.className='fm-model-entry';entry.textContent='⚙ 模型管理';entry.onclick=()=>location.href='model-management.html';if(page==='model-management.html')entry.setAttribute('aria-current','page');const side=document.querySelector('.side-nav,.sidebar .nav,.sidebar nav');if(side)side.append(entry);else(document.querySelector('.header,.topbar,.pagehead')||document.body).append(entry);
const mobileEntry=entry.cloneNode(true);mobileEntry.classList.add('fm-model-mobile');mobileEntry.onclick=entry.onclick;document.querySelector('.topbar,.header,.pagehead,.shop-top,.model-top')?.append(mobileEntry);
if(!['asset-library.html','product-detail.html','shop-management.html','model-management.html','account-center.html'].includes(page)){
 let select=document.querySelector('select#model');
 if(!select){const field=el('div');field.className='fm-model-field';const label=el('label',video?'视频模型':'图片模型');select=el('select');select.id='fmGenerationModel';label.htmlFor=select.id;(video?['平台视频模型']:['平台图片模型']).forEach(name=>select.add(new Option(name,name)));const manage=el('button','管理模型 ↗');manage.type='button';manage.onclick=entry.onclick;field.append(label,select,manage);const target=document.querySelector('.config .scroll,.config-scroll,.config-content,.config .form-scroll,.config form,.config,.chat .source');if(target)target.append(field);else document.querySelector('main')?.prepend(field)}
 // Keep model controls at the bottom of task settings, before submission controls.
 const generated=select.closest('.fm-model-field');
 let field=generated;
 const originalField=select.closest('.field'),originalParent=select.parentElement;
 if(!field){field=el('div');field.className='fm-model-field';const label=el('label',video?'视频模型':'图片模型');label.htmlFor=select.id;field.append(label,select);}
 const config=document.querySelector('.config');
 if(page==='batch.html'){document.querySelector('.form-grid')?.append(field);if(originalField&&!originalField.children.length)originalField.remove()}
 else if(page==='graphic-notes.html'){document.querySelector('.composer')?.insertBefore(field,document.querySelector('.composer>div:last-child'))}
 else if(config){
  const dock=config.querySelector('.generate-dock,.config-dock,form>footer');
  if(dock){const hint=[...dock.children].find(n=>n.matches('p,.hint'));dock.insertBefore(field,hint||null)}
  else {const scroll=config.querySelector('.config-scroll,.scroll,.config-content');(scroll||config).append(field)}
 }
 if(!generated&&originalParent&&!originalParent.contains(select)&&!originalParent.querySelector('input,select,button,textarea')&&/模型/.test(originalParent.textContent))originalParent.remove();
 select.dataset.fmModel=video?'video':'image';select.dataset.fmPlatformDefault=select.options[0]?.value||'';
 // Batch overrides are rendered dynamically; update their options after each render.
 const tasks=document.querySelector('#tasks');if(tasks)new MutationObserver(()=>{for(const s of tasks.querySelectorAll('select[data-override-field="model"]'))if(!s.dataset.fmModel){s.dataset.fmModel='image';sync()}}).observe(tasks,{childList:true,subtree:true});
}
sync();

const api=window.FashCustomModels;
Object.assign(api,{
 resolve:resolveModel,list:()=>structuredClone(models),getPreferences:()=>structuredClone(preferences),hasKey:id=>!!readSession(id),
 openEditor(id,kind){open();if(id){const m=models.find(x=>x.id===id);if(!m)return;editing=id;for(const k of ['kind','name','protocol','endpoint','modelId'])f[k].value=m[k];f.kind.disabled=true;f.apiKey.required=false;f.apiKey.placeholder='留空保留当前标签页 Key';form.querySelector('h3').textContent='编辑模型'}else if(kind){f.kind.value=kind;setProtocol()}},
 update(id,patch){const next=models.map(m=>m.id===id?{...m,...patch,updatedAt:Date.now()}:m);localStorage.setItem(key,JSON.stringify(next));models=next;if(patch.enabled===false)for(const k of kinds)if(preferences[k]===id)delete preferences[k];localStorage.setItem(preferenceKey,JSON.stringify(preferences));sync();window.dispatchEvent(new Event('fashmaker-models-changed'))},
 remove(id){const next=models.filter(m=>m.id!==id);const prefs={...preferences};for(const k of kinds)if(prefs[k]===id)delete prefs[k];localStorage.setItem(key,JSON.stringify(next));models=next;preferences=prefs;localStorage.setItem(preferenceKey,JSON.stringify(prefs));sessionStorage.removeItem(key+':'+id);sync();window.dispatchEvent(new Event('fashmaker-models-changed'))},
 setDefault(kind,id){if(!kinds.includes(kind))throw Error('未知模型类型');const m=models.find(x=>x.id===id);if(id&&(!m||m.kind!==kind||m.enabled===false))throw Error('请选择已启用且类型匹配的模型');const next={...preferences};if(id)next[kind]=id;else delete next[kind];localStorage.setItem(preferenceKey,JSON.stringify(next));preferences=next;window.dispatchEvent(new Event('fashmaker-models-changed'))}
});
// Defaults affect new tasks only, never an already edited draft or a historical restore.
api.applyDefaults=()=>{for(const select of document.querySelectorAll('[data-fm-model]')){if(select.matches('[data-override-field]'))continue;const id=preferences[select.dataset.fmModel],value=id&&models.some(m=>m.id===id&&m.enabled!==false)?id:select.dataset.fmPlatformDefault;for(const o of select.options)o.defaultSelected=o.value===value;select.value=value;select.dispatchEvent(new Event('change',{bubbles:true}))}};
for(const select of document.querySelectorAll('[data-fm-model]')){const id=preferences[select.dataset.fmModel];if(select.value===select.dataset.fmPlatformDefault&&id&&models.some(m=>m.id===id&&m.enabled!==false)){for(const o of select.options)o.defaultSelected=o.value===id;select.value=id;select.dispatchEvent(new Event('change',{bubbles:true}))}}
for(const select of document.querySelectorAll('[data-fm-model]'))if(!select.closest('.fm-model-field')?.querySelector('button')){const link=el('button','管理模型 ↗');link.type='button';link.onclick=entry.onclick;select.parentElement.append(link)}
document.addEventListener('click',e=>{const button=e.target.closest('#newTask,#newVideo,#newSingleTask,#newResult,#newBatch');if(button?.onclick&&!button.dataset.fmDefaultWrapped){const original=button.onclick;button.dataset.fmDefaultWrapped='true';button.onclick=async function(event){const result=await original.call(this,event);api.applyDefaults();return result}}},true);
if(new URLSearchParams(location.search).get('modelSettings')==='1')location.replace('model-management.html');
window.addEventListener('storage',e=>{if(e.key===preferenceKey){try{preferences=JSON.parse(e.newValue||'{}')}catch{}return}if(e.key===key){try{models=JSON.parse(e.newValue||'[]');sync();renderList()}catch{}}});
// All prototype AI operations share the same routing rule. No requests are sent.
const textActions='#analyze,#aiCopy,#aiAnalyze,#globalAiWrite,[data-ai],#generateProductText,#recognizeProduct,#analyzeBtn,#adjustBtn,#refreshScripts,#refreshPackage,#generatePrompts';
const directImageActions='#generateAvatar,#generateModel,#makeModel,#multiMakeModel';
const imageActions='#generateSelected,#generateImages,#confirmGenerate,#confirmBatch';
function prepare(event,types,useControls=true){
 try{const resolved=types.map(kind=>{const selects=useControls?[...document.querySelectorAll('[data-fm-model]')].filter(s=>s.dataset.fmModel===kind):[];
  for(const select of selects)if(select.value.startsWith('custom-')&&!models.some(m=>m.id===select.value&&m.kind===kind&&m.enabled!==false))throw Error('所选模型已停用或移除，请重新选择。');
  return resolveModel(kind,selects[0]);});
  const detail={at:Date.now(),demo:true,models:resolved};api.lastInvocation=detail;
  const control=event.target.closest('button,form');if(control)control.fmModelSnapshot=structuredClone(detail);
  window.dispatchEvent(new CustomEvent('fashmaker-model-resolved',{detail}));return true;
 }catch(error){event.preventDefault();event.stopImmediatePropagation();alert(error.message);return false}
}
document.addEventListener('click',e=>{
 if(e.target.closest(textActions))return prepare(e,['text'],false);
 if(e.target.closest(directImageActions))return prepare(e,['image'],false);
 if(e.target.closest('#generate'))return prepare(e,[page==='index.html'?'text':video?'video':'image'],page!=='index.html');
 if(e.target.closest(imageActions))return prepare(e,['image']);
 if(e.target.closest('#generateBtn'))return prepare(e,[video?'video':'image']);
},true);
document.addEventListener('submit',e=>{if(e.target===form)return;if(e.target.id==='chatForm')prepare(e,['text','image']);else if(['ai-tryon.html','outfit-separation.html'].includes(page))prepare(e,['image']);},true);
})();
