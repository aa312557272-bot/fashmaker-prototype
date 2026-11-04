// Local prototype video library shared by remix input and the asset library.
(()=>{
const ready=new Promise((resolve,reject)=>{const r=indexedDB.open('fashmaker-reference-videos',1);r.onupgradeneeded=()=>r.result.createObjectStore('videos',{keyPath:'id'});r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error)});
async function list(){const db=await ready;return new Promise((resolve,reject)=>{const r=db.transaction('videos').objectStore('videos').getAll();r.onsuccess=()=>resolve(r.result.sort((a,b)=>b.createdAt-a.createdAt));r.onerror=()=>reject(r.error)})}
async function add(item){const db=await ready;const video={...item,id:crypto.randomUUID(),createdAt:Date.now()};await new Promise((resolve,reject)=>{const tx=db.transaction('videos','readwrite');tx.objectStore('videos').put(video);tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error)});return video}
async function removeByNames(names){const videos=await list(),db=await ready;await new Promise((resolve,reject)=>{const tx=db.transaction('videos','readwrite');videos.filter(v=>names.includes(v.title)).forEach(v=>tx.objectStore('videos').delete(v.id));tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error)})}
window.FashReferenceVideos={list,add,removeByNames};
})();
