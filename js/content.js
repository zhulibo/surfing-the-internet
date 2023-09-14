const defaultStyle = 85
const defaultTime = {
  startTime: '18:00',
  endTime: '08:00'
}

function loadStyle(css) {
  const style = document.createElement('style');
  style.appendChild(document.createTextNode(css));
  document.head.appendChild(style);
}

// 添加样式
chrome.storage.local.get(['style', 'time', 'blackList'], res => {
  console.log(res)

  const style = res.style ?? defaultStyle
  const startTime = res.time?.startTime ?? defaultTime.startTime
  const endTime = res.time?.endTime ?? defaultTime.endTime

  const now = new Date()
  const numNow = now.getHours() * 60 +  now.getMinutes() // 今日已过分钟数

  const [hourStart, minuteStart] = startTime.split(':')
  const numStart = hourStart * 60 +  Number(minuteStart)

  const [hourEnd, minuteEnd] = endTime.split(':')
  const numEnd = hourEnd * 60 +  Number(minuteEnd)

  // 判断是否在时间段内
  if (numStart < numEnd && (numNow < numStart || numNow > numEnd)) return
  if (numStart > numEnd && (numNow < numStart && numNow > numEnd)) return

  if (res.blackList?.some(item => location.href.includes(item))) return

  loadStyle(`html{filter: brightness(${style}%);}`)
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
