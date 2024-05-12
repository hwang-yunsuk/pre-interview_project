/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

// Slackにメッセージ投稿
function messagePostsToSlack() {
  // configシート
  const configSheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName('config')
  // channel_nameの値を取得
  const channelName = configSheet.getRange('C2').getValues()[0][0]
  postMessage(channelName, DESCRIPTION)

  // Slackに投稿
  function postMessage(channelId, message) {
    const token = SLACK_TOKEN_TEST
    const app = SlackApp.create(token)
    app.chatPostMessage(channelId, message)
  }
}
