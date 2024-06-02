/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
function setTrigger() {
  // トリガー取得
  const triggers = ScriptApp.getProjectTriggers()

  // トリガーメソッドチェック
  for (let trigger of triggers) {
    const funcName = trigger.getHandlerFunction()
    // トリガーメソッドチェック
    if (funcName == POST_TO_SLACK) {
      // 古いトリガーは削除
      ScriptApp.deleteTrigger(trigger)
    }
  }

  try {
    // configシートのpost_date確認
    const configSheet = SpreadsheetApp.getActive().getSheetByName('config')
    // post_dateの値を取得
    const postDate = configSheet.getRange('E2').getValues()[0][0]

    var newTriggerAt = null
    if (postDate) {
      // postDateの指定がある場合
      // 当月＋postDate 12:10に実行
      newTriggerAt = new Date(NOW.y, NOW.m - 1, postDate, 12, 10)
    } else {
      // default
      // 第2水曜日を見つける
      const baseDate = getSecondWednesday()
      // 当月の第３週目の月曜の12:10に実行
      newTriggerAt = new Date(NOW.y, NOW.m - 1, baseDate, 12, 10)
    }

    // 新しいトリガー設定
    ScriptApp.newTrigger(POST_TO_SLACK).timeBased().at(newTriggerAt).create()
    return true
  } catch (e) {
    console.log('Error: ' + e.messege)
    return false
  }
}
