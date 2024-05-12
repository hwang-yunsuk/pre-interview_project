/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

// Schedule登録処理
function apiSetSchedule(payload) {
  payload = JSON.parse(payload)
  // ヒアリング日程登録処理
  const meetingDay = payload.selectedMeetingDay
  const meetingTime = payload.selectedMeetingTime
  const userName = payload.selectedUser

  const ss = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME)

  // 日付と時間に一致するセルを検索
  const dateColumn = ss.getRange('A:A').getValues().flat().indexOf(meetingDay) + 1
  const timeRow = ss.getRange('1:1').getValues()[0].indexOf(meetingTime) + 1

  // 日付と時間が見つからない場合は終了
  if (dateColumn === 0 || timeRow === 0) {
    return JSON.stringify({
      call: false,
      message: '指定された日付または時間が見つかりませんでした。'
    })
  }

  // カラムにすでに登録されているかチェック
  const cellValue = ss.getRange(dateColumn, timeRow).getValue()
  if (cellValue !== '') {
    return JSON.stringify({
      call: false,
      message: '選択した日付または時間はすでに登録されています。'
    })
  }

  const isExist = isUserNameRegisteredInRange(userName, dateColumn, timeRow)
  if (isExist) {
    return JSON.stringify({
      call: false,
      message: 'お名前はすでに登録されています。'
    })
  }

  // 登録処理
  const result = ss.getRange(dateColumn, timeRow).setValue(userName)

  return JSON.stringify({
    data: result,
    call: true,
    message: '登録完了しました。'
  })
}

// inputDataシートにデータを登録する
function registerDataSheet(payload) {
  payload = JSON.parse(payload)

  const ss = SpreadsheetApp.openById(SHEET_ID).getSheetByName('inputData')

  // 登録するデータ
  const pl = createPayload(payload)

  // 既存のデータを検索
  const lastRow = ss.getLastRow()
  const dataRange = ss.getRange(1, 1, lastRow, 3) // A列とB列だけをチェック
  const data = dataRange.getValues()

  // 名前と日付の重複チェック
  let isDuplicate = false
  let maxNo = 0
  data.forEach(function (row) {
    // No列の更新値取得
    if (!isNaN(row[0]) && typeof row[0] === 'number') {
      maxNo = Math.max(maxNo, row[0]) // 最大の番号を更新
    }
    // 名前と日付の重複チェック
    if (row[1] === pl.userName && row[2] === pl.date) {
      isDuplicate = true
    }
  })

  // 重複があれば、処理終了
  if (isDuplicate) {
    return JSON.stringify({
      call: false,
      message: '名前と日付の重複データが存在します'
    })
  } else {
    // googleカレンダーにスケジュール登録
    const meetingUrl = scheduleGoogleMeeting(pl)

    let newRow = []
    // meetingUrlが存在すれば追加
    if (meetingUrl) {
      // 重複がなければ新しいデータを追加
      newRow = [
        maxNo + 1,
        pl.userName,
        pl.date,
        pl.selectedMeetingDay,
        pl.selectedMeetingTime,
        meetingUrl,
        pl.projectName,
        pl.workDetail,
        pl.deferredExistence,
        pl.pointingOut,
        pl.workingStatus,
        pl.communication,
        pl.inTrouble,
        pl.nextProject,
        pl.initiatives,
        pl.opinion,
        pl.createdAt
      ]
    } else {
      // 重複がなければ新しいデータを追加
      newRow = [
        maxNo + 1,
        pl.userName,
        pl.date,
        pl.selectedMeetingDay,
        pl.selectedMeetingTime,
        null, // meetingUrlがなかったらnullを入れる
        pl.projectName,
        pl.workDetail,
        pl.deferredExistence,
        pl.pointingOut,
        pl.workingStatus,
        pl.communication,
        pl.inTrouble,
        pl.nextProject,
        pl.initiatives,
        pl.opinion,
        pl.createdAt
      ]
    }

    // inputシートに追加
    ss.appendRow(newRow)

    // Notionに貼り付ける用のデータを追加
    addToSpreadsheet(pl)
  }

  return JSON.stringify({
    call: true,
    message: '登録完了しました'
  })
}

function addToSpreadsheet(pl) {
  const ss = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME)
  // A列の最後の値が入っている行を取得
  const lastRow = ss.getLastRow()
  const targetRow = lastRow + 4 // 最後の値の3行後

  // データの登録
  const data = [
    ['お名前', pl.userName],
    ['現場の状況（技術的な部分をメインで）'],
    ['作業内容', pl.projectName],
    ['作業内容（遅延がある場合は、リカバリなどタスク完了に向けた動きを確認）', pl.workDetail],
    ['遅延有無', pl.deferredExistence],
    ['現場からの指摘有無', pl.pointingOut],
    ['稼働状況（稼働が高い場合はその理由等を確認）', pl.workingStatus],
    ['コミュニケーションは問題なく取れているか', pl.comunication],
    ['現場で困っていることなどがあれば', pl.inTrouble],
    ['案件について'],
    ['今後やってみたい案件とその理由', pl.nextProject],
    ['自身で現在取り組んでいること', pl.initiatives],
    ['会社に対する意見・要望', pl.opinion],
    ['その他、何かあれば'],
    ['こちらから連携することがあれば伝える']
  ]

  // データをシートに書き込む
  data.forEach(function (row, index) {
    const currentRow = targetRow + index
    ss.getRange(currentRow, 1).setValue(row[0]) // A列
    if (row.length > 1 && row[1] !== undefined) {
      ss.getRange(currentRow, 2).setValue(row[1]) // B列
    }
  })
}
