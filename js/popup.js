const defaultList = [
  'google.com',
  'youtube.com',
  'reddit.com',
  'bilibili.com',
  'gamersky.com',
  'ithome.com',
]
let blackList = []
// chrome.storage.local.clear()

chrome.storage.local.get('time', res => {
  // 初始化赋值time
  if (!res.time) {
    chrome.storage.local.set({
      time: {
        startTime: '18:00',
        endTime: '08:00'
      }
    })
  }
})

// 获取黑名单
chrome.storage.local.get('blackList', res => {
  // 初始化赋值blackList
  if (!res.blackList) {
    blackList = defaultList
    chrome.storage.local.set({blackList}, () => {
      generateList()
    })
  }
  else {
    blackList = res.blackList
    generateList()
  }
})

// 添加网址
const siteInput = document.getElementById("site-input");
const siteAdd = document.getElementById("site-add");
const addSite = () => {
  if (blackList.includes(siteInput.value.trim())) {
    return alert(siteInput.value.trim() + ' already exists')
  }
  blackList.push(siteInput.value.trim())
  chrome.storage.local.set({
    blackList
  })
  generateList()
}
siteAdd.onclick = addSite;

// 删除网址
const removeSite = (item) => {
  console.log(item)
  blackList = blackList.filter(i => i !== item)
  chrome.storage.local.set({
    blackList
  })
  generateList()
}

// 更新dom
const generateList = () => {
  let html = ''
  blackList.forEach(item => {
    html += `<li>
    <span>${item}</span>
    <i class="remove-site">remove</i>
    </li>`;
  })
  document.querySelector('#site-list').innerHTML = html

  document.querySelector('#site-list').addEventListener('click', e => {
    if (e.target.className !== 'remove-site') {
      return
    }
    removeSite(e.target.previousElementSibling.innerHTML)
  })
}

// 向content发送消息
// chrome.tabs.query({
//   active: true,
//   currentWindow: true
// }, tabs => {
//   chrome.tabs.sendMessage(tabs[0].id, 'loadStyle', res => {
//     console.log(res)
//   })
// })
