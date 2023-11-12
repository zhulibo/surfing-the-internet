const defaultStyle = 85
const defaultTime = {
  startTime: '17:00',
  endTime: '08:00'
}
const defaultList = [
  'google.com',
  'youtube.com',
  'reddit.com',
  'twitch.tv',
  'gamersky.com',
  'ithome.com',
]

let blackList = []

// chrome.storage.local.clear()

// 初始style
chrome.storage.local.get('style', res => {
  if (!res.style) {
    chrome.storage.local.set({
      style: 85
    })
    document.getElementById("style-input").value = defaultStyle
  }
  else {
    document.getElementById("style-input").value = res.style
  }
})

// 保存style
document.querySelector('#style-add').onclick = () => {
  const styleInput = document.getElementById("style-input");
  const style = styleInput.value.trim()

  if (style < 0 || style > 100) {
    return alert('brightness must be between 0 and 100')
  }

  chrome.storage.local.set({
    style
  })
}

// 初始time
chrome.storage.local.get('time', res => {
  console.log(res.time)

  if (!res.time) {
    chrome.storage.local.set({
      time: {
        startTime: defaultTime.startTime,
        endTime: defaultTime.endTime
      }
    })
    const [hourStart, minuteStart] = defaultTime.startTime.split(':')
    const [hourEnd, minuteEnd] = defaultTime.endTime.split(':')

    document.querySelector('#hour-start').value = hourStart
    document.querySelector('#minute-start').value = minuteStart
    document.querySelector('#hour-end').value = hourEnd
    document.querySelector('#minute-end').value = minuteEnd
  }
  else {
    const {startTime, endTime} = res.time
    const [hourStart, minuteStart] = startTime.split(':')
    const [hourEnd, minuteEnd] = endTime.split(':')

    document.querySelector('#hour-start').value = hourStart
    document.querySelector('#minute-start').value = minuteStart
    document.querySelector('#hour-end').value = hourEnd
    document.querySelector('#minute-end').value = minuteEnd
  }
})

// 保存time
document.querySelector('#save-time').onclick = () => {
  const hourStart = document.querySelector('#hour-start').value
  const minuteStart = document.querySelector('#minute-start').value
  const hourEnd = document.querySelector('#hour-end').value
  const minuteEnd = document.querySelector('#minute-end').value

  const startTime = `${hourStart}:${minuteStart}`
  const endTime = `${hourEnd}:${minuteEnd}`
  chrome.storage.local.set({
    time: {
      startTime,
      endTime
    }
  })
}

// 初始赋值blackList
chrome.storage.local.get('blackList', res => {
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
