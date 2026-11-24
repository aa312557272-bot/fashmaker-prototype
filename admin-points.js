'use strict'

const $ = (id) => document.getElementById(id)
const storageKey = 'fashmaker-admin-points-v1'
const format = new Intl.NumberFormat('zh-CN')
const dates = new Intl.DateTimeFormat('zh-CN', {
  dateStyle: 'short', timeStyle: 'short', timeZone: 'Asia/Shanghai'
})
const types = { grant: '积分获得', spend: '业务消费', add: '人工增加', deduct: '人工扣减' }
const features = {
  'product-video': '商品生视频',
  'detail-page': '商品详情长图',
  'product-suite': '商品套图',
  'ai-tryon': 'AI 换装',
  'batch-image': '批量生图',
  'outfit-separation': '穿搭分离',
  'graphic-notes': '图文笔记',
  'digital-human': '数字人口播',
  'viral-remix': '爆款复刻'
}
const demoFeatures = [
  'product-video', 'detail-page', 'batch-image', 'ai-tryon', 'product-suite', null,
  'outfit-separation', 'graphic-notes', 'digital-human', 'viral-remix', 'product-video', 'product-suite'
]
const users = [
  '云岫服饰', '林间工作室', 'Studio Nami', '拾光衣橱', '西町选品', '青柚设计',
  '几何衣研社', 'Mori Studio', '春山商贸', '白昼服饰', '木棉买手店', 'Yun Studio'
].map((name, index) => ({ id: 1601 - index, name, email: `studio${index + 1}@example.test` }))
const opening = [2500, 1200, 860, 300, 1800, 100, 1200, 400, 680, 540, 900, 500]
const usage = [860, 940, 860, 120, 1260, 0, 400, 210, 400, 100, 300, 180]
const pageSize = 8
let page = 0
let sortField = 'id'
let sortDirection = -1
let draft = null
let ledgerUser = null
let noticeTimer

function createDemo() {
  const records = users.flatMap((user, index) => {
    const day = 20 - index
    const entries = [{
      userId: user.id, type: 'grant', delta: opening[index], operator: '系统',
      reason: '演示积分发放', time: Date.UTC(2026, 10, day, 2)
    }]
    if (usage[index]) entries.push({
      userId: user.id, type: 'spend', delta: -usage[index], operator: '系统',
      featureCode: demoFeatures[index], time: Date.UTC(2026, 10, day, 6)
    })
    return entries
  })
  return { defaultPoints: 100, records }
}

function readState() {
  try {
    const demo = createDemo()
    const saved = JSON.parse(localStorage.getItem(storageKey))
    if (!saved) return demo
    const demoSpends = new Map(demo.records.filter((record) => record.type === 'spend')
      .map((record) => [record.userId, record]))
    return {
      ...saved,
      records: saved.records.map((record) => {
        if (record.type !== 'spend' || record.featureCode || record.reason !== '商品内容生成') return record
        const example = demoSpends.get(record.userId)
        // Enrich only records from the previous demo fixture.
        if (example?.time !== record.time || example.delta !== record.delta) return record
        return { ...record, featureCode: example.featureCode, reason: '' }
      })
    }
  } catch {
    return createDemo()
  }
}

function saveState(next) {
  localStorage.setItem(storageKey, JSON.stringify(next))
  state = next
}

let state = readState()

function summarize(userId) {
  return state.records.reduce((totals, record) => {
    if (record.userId !== userId) return totals
    totals.balance += record.delta
    if (record.delta > 0) totals.earned += record.delta
    if (record.type === 'spend') totals.spent -= record.delta
    return totals
  }, { earned: 0, spent: 0, balance: 0 })
}

function renderUsers() {
  const query = $('search').value.trim().toLowerCase()
  const balanceFilter = $('balance-filter').value
  const matches = users.map((user) => ({ ...user, ...summarize(user.id) }))
    .filter((user) => [user.id, user.name, user.email].some((key) => String(key).toLowerCase().includes(query)))
    .filter((user) => !balanceFilter || (balanceFilter === 'zero' ? user.balance === 0 : user.balance > 0))
    .sort((a, b) => sortDirection * (a[sortField] - b[sortField]) || b.id - a.id)
  const totalPages = Math.max(1, Math.ceil(matches.length / pageSize))
  page = Math.min(page, totalPages - 1)
  $('user-rows').innerHTML = matches.slice(page * pageSize, (page + 1) * pageSize).map((user) => `
    <tr><td><div class="identity"><span class="avatar" aria-hidden="true">${user.name[0]}</span><div>
    <strong>${user.name}</strong><span class="meta">ID ${user.id} · ${user.email}</span></div></div></td>
    <td class="numeric">${format.format(user.earned)}</td><td class="numeric">${format.format(user.spent)}</td>
    <td class="numeric balance">${format.format(user.balance)}</td><td>
    <button class="row-action" data-ledger="${user.id}" aria-label="查看 ${user.name} 的积分流水">流水</button>
    <button class="row-action" data-adjust="${user.id}" aria-label="调整 ${user.name} 的积分">调整</button></td></tr>
  `).join('') || '<tr><td class="empty" colspan="5">没有符合条件的用户，请尝试修改搜索或余额筛选。</td></tr>'
  $('row-count').textContent = `共 ${matches.length} 位用户 · 第 ${page + 1} / ${totalPages} 页`
  $('prev').disabled = page === 0
  $('next').disabled = page + 1 === totalPages
}

function notify(message) {
  clearTimeout(noticeTimer)
  $('notice').textContent = message
  noticeTimer = setTimeout(() => { $('notice').textContent = '' }, 4500)
}

function showError(message = '') {
  $('adjust-error').hidden = !message
  $('adjust-error').textContent = message
}

function selectedUser() {
  return users.find((user) => user.id === Number($('user-choice').value))
}

function updatePreview() {
  const user = selectedUser()
  if (!user) {
    $('balance-preview').textContent = '选择用户后查看当前余额。'
    return
  }
  const { balance } = summarize(user.id)
  const amount = $('amount').valueAsNumber
  const next = balance + ($('direction').value === 'add' ? amount : -amount)
  const showNext = $('amount').validity.valid && next >= 0
  $('balance-preview').textContent = `当前余额 ${format.format(balance)}${showNext ? ` → 调整后 ${format.format(next)}` : ''}`
}

function setReview(reviewing) {
  $('adjust-fields').hidden = reviewing
  $('amount').disabled = reviewing
  $('user-choice').disabled = reviewing
  $('confirmation').hidden = !reviewing
  $('adjust-submit').textContent = reviewing ? '确认调整' : '核对调整'
  $('adjust-submit').classList.toggle('danger', reviewing && draft?.type === 'deduct')
  $('adjust-back').textContent = reviewing ? '返回修改' : '取消'
}

function openAdjust(userId) {
  $('adjust-form').reset()
  $('user-choice').value = userId || ''
  draft = null
  setReview(false)
  showError()
  updatePreview()
  $('adjust-dialog').showModal()
  $(userId ? 'amount' : 'user-choice').focus()
}

function renderLedger() {
  const totals = summarize(ledgerUser.id)
  const labels = { earned: '累计获得', spent: '累计消费', balance: '当前余额' }
  $('ledger-summary').innerHTML = Object.entries(labels).map(([key, label]) =>
    `<div><span class="meta">${label}</span><strong>${format.format(totals[key])}</strong></div>`
  ).join('')
  const filter = $('ledger-filter').value
  let balance = 0
  const records = state.records.filter((record) => record.userId === ledgerUser.id)
    .sort((a, b) => a.time - b.time)
    .map((record) => {
      balance += record.delta
      return { ...record, balance }
    })
    .reverse()
    .filter((record) => !filter || record.type === filter)
  const tableBody = $('ledger-rows')
  tableBody.replaceChildren()
  for (const record of records) {
    const row = tableBody.insertRow()
    const time = row.insertCell()
    time.textContent = dates.format(record.time)
    const operator = document.createElement('span')
    operator.className = 'meta'
    operator.textContent = record.operator
    time.append(operator)
    const description = row.insertCell()
    description.textContent = types[record.type]
    const feature = row.insertCell()
    feature.textContent = record.type === 'spend' ? (features[record.featureCode] ?? '未记录') : '—'
    const reason = row.insertCell()
    reason.className = 'ledger-reason'
    reason.textContent = record.reason || '—'
    const delta = row.insertCell()
    delta.className = `numeric ${record.delta > 0 ? 'credit' : 'debit'}`
    delta.textContent = `${record.delta > 0 ? '+' : '−'}${format.format(Math.abs(record.delta))}`
    const result = row.insertCell()
    result.className = 'numeric'
    result.textContent = format.format(record.balance)
  }
  if (!records.length) tableBody.innerHTML = '<tr><td colspan="6" class="empty">暂无此类流水。</td></tr>'
}

$('user-choice').innerHTML = '<option value="">请选择用户</option>' + users.map((user) =>
  `<option value="${user.id}">${user.name} · ID ${user.id} · ${user.email}</option>`
).join('')
$('default-points').value = state.defaultPoints
$('adjust-top').addEventListener('click', () => openAdjust())
$('search').addEventListener('input', () => { page = 0; renderUsers() })
$('balance-filter').addEventListener('change', () => { page = 0; renderUsers() })
$('prev').addEventListener('click', () => { page -= 1; renderUsers() })
$('next').addEventListener('click', () => { page += 1; renderUsers() })
$('ledger-filter').addEventListener('change', renderLedger)

for (const button of document.querySelectorAll('[data-tab]')) {
  button.addEventListener('click', () => {
    for (const tab of document.querySelectorAll('[data-tab]')) {
      tab.setAttribute('aria-pressed', String(tab === button))
      $(tab.dataset.tab).hidden = tab !== button
    }
  })
}

for (const button of document.querySelectorAll('[data-sort]')) {
  button.addEventListener('click', () => {
    const field = button.dataset.sort
    sortDirection = sortField === field ? -sortDirection : -1
    sortField = field
    for (const sortButton of document.querySelectorAll('[data-sort]')) {
      const label = sortButton.textContent.slice(0, -1)
      sortButton.textContent = label + (sortButton === button ? (sortDirection === -1 ? '↓' : '↑') : '↕')
      sortButton.closest('th').removeAttribute('aria-sort')
    }
    button.closest('th').setAttribute('aria-sort', sortDirection === -1 ? 'descending' : 'ascending')
    page = 0
    renderUsers()
  })
}

$('user-rows').addEventListener('click', (event) => {
  const button = event.target.closest('button')
  if (!button) return
  if (button.dataset.adjust) {
    openAdjust(button.dataset.adjust)
  } else {
    ledgerUser = users.find((user) => user.id === Number(button.dataset.ledger))
    $('ledger-user').textContent = `${ledgerUser.name} · ID ${ledgerUser.id} · ${ledgerUser.email}`
    $('ledger-filter').value = ''
    renderLedger()
    $('ledger-dialog').showModal()
  }
})

for (const button of document.querySelectorAll('[data-close]')) {
  button.addEventListener('click', () => $(button.dataset.close).close())
}

$('adjust-back').addEventListener('click', () => {
  if (!draft) {
    $('adjust-dialog').close()
    return
  }
  draft = null
  setReview(false)
  showError()
  $('amount').focus()
})

$('adjust-form').addEventListener('input', () => {
  showError()
  updatePreview()
})

$('adjust-form').addEventListener('submit', (event) => {
  event.preventDefault()
  state = readState()
  const user = selectedUser()
  const balance = summarize(user.id).balance
  if (draft) {
    if (balance !== draft.balance) {
      draft = null
      setReview(false)
      updatePreview()
      showError('该用户余额已更新，请重新核对。')
      renderUsers()
      return
    }
    const { balance: reviewedBalance, ...record } = draft
    try {
      saveState({ ...state, records: [...state.records, { ...record, time: Date.now(), operator: '演示管理员' }] })
    } catch {
      showError('浏览器未能保存本次调整，请重试。')
      return
    }
    $('adjust-dialog').close()
    renderUsers()
    notify(`${user.name} 的积分已调整，当前余额 ${format.format(reviewedBalance + record.delta)}。`)
    return
  }
  const type = $('direction').value
  const delta = (type === 'add' ? 1 : -1) * $('amount').valueAsNumber
  if (balance + delta < 0) {
    showError(`扣减数量超过当前余额 ${format.format(balance)}，请输入更小的数量。`)
    $('amount').focus()
    return
  }
  draft = { userId: user.id, type, delta, balance, reason: $('reason').value.trim() }
  updatePreview()
  $('confirmation').textContent = `确认对 ${user.name}（ID ${user.id}）${types[type]}${format.format(Math.abs(delta))} 积分？${draft.reason ? ` 说明：${draft.reason}` : ''}`
  setReview(true)
  $('adjust-submit').focus()
})

$('settings-form').addEventListener('submit', (event) => {
  event.preventDefault()
  try {
    saveState({ ...readState(), defaultPoints: $('default-points').valueAsNumber })
    notify('默认注册积分配置已保存。')
  } catch {
    notify('浏览器未能保存配置，请重试。')
  }
})

window.addEventListener('storage', (event) => {
  if (event.key !== storageKey && event.key !== null) return
  state = readState()
  renderUsers()
  if ($('ledger-dialog').open) renderLedger()
  if ($('adjust-dialog').open && !draft) updatePreview()
})

renderUsers()

function activateAdminTab(){const settings=location.hash==='#settings';for(const section of [$('users'),$('settings')])section.hidden=(section.id==='settings')!==settings;for(const button of document.querySelectorAll('.tabs [data-tab]')){const active=(button.dataset.tab==='settings')===settings;button.setAttribute('aria-pressed',String(active))}}
document.querySelectorAll('.tabs [data-tab]').forEach(button=>button.addEventListener('click',()=>{location.hash=button.dataset.tab==='settings'?'settings':'users';activateAdminTab()}));window.addEventListener('hashchange',activateAdminTab);activateAdminTab();
