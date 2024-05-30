/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

// Slackにメッセージ投稿
function messagePostsToSlack() {
  // configシート
  const configSheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName('config')
  // channel_nameの値を取得
  const channelName = configSheet.getRange('C2').getValues()[0][0]
  postMessageToSlack(channelName, DESCRIPTION)
}

// 予約完了したスケジュールをDM送信
function schedulePostsToSlack(pl, meetingUrl) {
  // configシート
  const configSheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName('config')

  // ユーザー名と一致する行を取得
  const userNameColumn = configSheet.getRange('A:A').getValues()
  const channelId = []
  let memberId = null
  for (let i = 0; i < userNameColumn.length; i++) {
    if (userNameColumn[i][0] === pl.userName) {
      memberId = configSheet.getRange(i + 1, 7).getValue() // G列の値を取得 (1-indexed)
      break
    }
  }

  if (memberId === null) {
    // 一致するユーザー名が見つからなかった場合
    return false
  }

  channelId.push(memberId)
  // 担当主任のuserIdを取得
  const masterId = configSheet.getRange('F2').getValue()
  channelId.push(masterId)

  // Slackメッセージのペイロードを作成
  const message = setMessage(pl.userName, pl.selectedMeetingDay, pl.selectedMeetingTime, meetingUrl)

  return postMessageToSlack(memberId, message)
}

function setMessage(userName, meetingDate, meetingTime, meetingUrl) {
  if (meetingUrl) {
    return `${userName}さんのヒアリング予定を追加しました。\n\nMeeting Date: ${meetingDate}\nMeeting Time: ${meetingTime}\nJoin Meeting: ${meetingUrl}`
  } else {
    return `${userName}さんのヒアリング予定を追加しました。\n\nMeeting Date: ${meetingDate}\nMeeting Time: ${meetingTime}`
  }
}

function postMessageToSlack(channelIds, message) {
  const app = SlackApp.create(SLACK_TOKEN_TEST)
  let success = true

  if (Array.isArray(channelIds)) {
    for (let i = 0; i < channelIds.length; i++) {
      try {
        app.chatPostMessage(channelIds[i], message)
      } catch (e) {
        Logger.log('Error sending message to ' + channelIds[i] + ': ' + e.toString())
        success = false
      }
    }
  } else {
    try {
      app.chatPostMessage(channelIds, message)
    } catch (e) {
      Logger.log('Error sending message to ' + channelIds + ': ' + e.toString())
      success = false
    }
  }

  return success
}
