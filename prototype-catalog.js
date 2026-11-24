(() => {
  const key = 'fashmaker-prototype-products'
  const samples = [
 {name:'无线蓝牙耳机',desc:'阿斯顿 · 降噪入耳式耳机',usp:'沉浸音质、轻盈贴合、长效续航',n:8,assets:['https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?auto=format&fit=crop&w=650&q=85','https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=650&q=85'],date:'2026-10-20 16:48',img:'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?auto=format&fit=crop&w=650&q=85'},
 {name:'便携香氛精华',desc:'木质调香氛 · 30ml',usp:'自然木香、便携喷雾、日常留香',n:6,assets:['https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=650&q=85'],date:'2026-10-16 18:18',img:'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=650&q=85'},
 {name:'轻盈针织上衣',desc:'柔软亲肤 · 日常通勤款',usp:'柔软针织、轻薄透气、易于搭配',n:4,assets:['https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=650&q=85'],date:'2026-10-14 16:08',img:'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=650&q=85'},
 {name:'植物精华面霜',desc:'舒缓保湿 · 50g',usp:'植物配方、清爽易吸收、温和滋润',n:5,assets:['https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=650&q=85'],date:'2026-09-29 12:09',img:'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=650&q=85'},
 {name:'简约通勤背包',desc:'轻量防泼水 · 多隔层收纳',usp:'轻便耐用、分区收纳、日常通勤',n:3,date:'2026-08-29 21:52',img:'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=650&q=85'},
 {name:'经典休闲卫衣',desc:'纯棉圆领 · 宽松版型',usp:'舒适纯棉、宽松版型、四季可穿',n:7,date:'2026-08-28 10:08',img:'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=650&q=85'},
 {name:'随行保温杯',desc:'双层不锈钢 · 便携杯盖',usp:'长效保温、防漏设计、单手开合',n:3,date:'2026-08-27 16:08',img:'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=650&q=85'},
 {name:'柔光护肤套装',desc:'洁面与保湿 · 日常护理',usp:'温和洁净、补水保湿、简化护肤',n:5,date:'2026-08-26 17:08',img:'https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?auto=format&fit=crop&w=650&q=85'}
].map((product, index) => ({
    ...product,
    id: `product-${index}-${product.name.length}`
  }))
  window.FashDemoCatalog = { samples }
  let products = samples
  try {
    const saved = JSON.parse(localStorage.getItem(key) || 'null')
    if (Array.isArray(saved)) {
      products = saved
      if (saved.every((product) => product.id)) return
      products = saved.map((product, index) => ({
        ...product,
        id: product.id || `product-${index}-${String(product.name || '').length}`
      }))
    }
    localStorage.setItem(key, JSON.stringify(products))
  } catch {
    // The asset library still has sample products when storage is unavailable.
  }
})()
