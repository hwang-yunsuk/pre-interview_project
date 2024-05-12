/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
function getDate() {
  // 現在日付取得
  const now = new Date()

  // 年度を取得
  const year = now.getFullYear().toString()

  // 現在月
  const nowMonth = Utilities.formatDate(
    new Date(now.getFullYear(), now.getMonth(), 1),
    'Asia/Tokyo',
    'MM'
  )

  return { n: now, y: year, m: nowMonth }
}
