function loadStyle(css) {
  const style = document.createElement('style');
  style.appendChild(document.createTextNode(css));
  document.head.appendChild(style);
}

// 添加样式
chrome.storage.local.get(['time', 'blackList'], res => {
  console.log(res)
  if (!res.time) return
  const startTime = res.time.startTime?? '18:00'
  const endTime = res.time.endTime?? '08:00'

  const now = new Date()
  const numNow = now.getHours() * 60 +  now.getMinutes() // 今日已过分钟数

  const [hourStart, minuteStart] = startTime.split(':')
  const numStart = hourStart * 60 +  Number(minuteStart)

  const [hourEnd, minuteEnd] = endTime.split(':')
  const numEnd = hourEnd * 60 +  Number(minuteEnd)

  // 判断是否在时间段内
  if (numStart < numEnd && (numNow < numStart || numNow > numEnd)) return
  if (numStart > numEnd && (numNow < numStart && numNow > numEnd)) return

  if (res.blackList.some(item => location.href.includes(item))) return

  loadStyle('html{filter: brightness(80%);}')
})

// 监听黑名单变化
chrome.storage.onChanged.addListener(function(a, b){
  console.log(a)
});

// // 接收popup消息
// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//   console.log(request)
//   if(request === 'loadStyle') {
//     loadStyle('body{filter: brightness(80%);}')
//     sendResponse('已执行')
//   }
// })
