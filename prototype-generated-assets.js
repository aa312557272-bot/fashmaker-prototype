(function(){
  const key='fashmaker-prototype-generated-assets';
  function read(){try{const value=JSON.parse(localStorage.getItem(key)||'[]');return Array.isArray(value)?value:[]}catch{return []}}
  function thumbnail(src){if(!src?.startsWith('blob:'))return Promise.resolve(src);return new Promise(resolve=>{const img=new Image();img.onload=()=>{try{const canvas=document.createElement('canvas');const scale=Math.min(1,360/Math.max(img.width,img.height));canvas.width=Math.max(1,Math.round(img.width*scale));canvas.height=Math.max(1,Math.round(img.height*scale));canvas.getContext('2d').drawImage(img,0,0,canvas.width,canvas.height);resolve(canvas.toDataURL('image/jpeg',.68))}catch{resolve(src)}};img.onerror=()=>resolve(src);img.src=src})}
  async function add(items){const now=Date.now();const entries=await Promise.all(items.map(async(item,index)=>({id:`${now}-${index}-${Math.random().toString(36).slice(2,7)}`,name:item.name||'未命名作品',type:item.type==='video'?'video':'image',source:item.source||'',preview:await thumbnail(item.preview||''),createdAt:now,origin:item.origin||'',demo:true})));try{localStorage.setItem(key,JSON.stringify([...entries,...read()].slice(0,100)))}catch(error){console.warn('演示资产保存失败',error)}return entries}
  function removeByNames(names){const selected=new Set(names);localStorage.setItem(key,JSON.stringify(read().filter(item=>!selected.has(item.name))))}
  window.FashGeneratedAssets={read,add,removeByNames};
})();
