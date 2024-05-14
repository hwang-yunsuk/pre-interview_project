/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

function scheduleGoogleMeeting(pl) {
  const ss = SpreadsheetApp.openById(SHEET_ID).getSheetByName('config')
  const calendarId = getCalendarId('rapide-act')
  const googleMeetingFlag = ss.getRange('E2').getValue().toLowerCase()

  if (googleMeetingFlag === 'no') {
    return
  }

  // const email = ss.getRange('F2').getValue()
  const eventTitle = pl.userName + ' ヒアリングミーティング'

  const [startTime, endTime] = parseMeetingTime(pl.selectedMeetingDay, pl.selectedMeetingTime)
  if (!startTime || !endTime) {
    console.error('日付の解析に失敗しました。会議をスケジュールできません。')
    return
  }

  const event = {
    summary: eventTitle,
    location: 'Online',
    start: { dateTime: startTime.toISOString(), timeZone: 'Asia/Tokyo' },
    end: { dateTime: endTime.toISOString(), timeZone: 'Asia/Tokyo' },
    // attendees: [{ email: email }],
    conferenceData: {
      createRequest: {
        conferenceSolutionKey: { type: 'hangoutsMeet' },
        requestId: 'unique-string' // 各リクエストに対して一意である必要があります
      }
    }
  }

  try {
    const createdEvent = Calendar.Events.insert(event, calendarId, {
      conferenceDataVersion: 1,
      sendNotifications: true
    })
    const meetingLink =
      createdEvent.hangoutLink ||
      (createdEvent.conferenceData && createdEvent.conferenceData.entryPoints
        ? createdEvent.conferenceData.entryPoints.find((entry) => entry.entryPointType === 'video')
            .uri
        : undefined)

    const sendEmailFlg = ss.getRange('H2').getValue()

    if (sendEmailFlg) {
      // 主任Email（main_email)
      const recipientEmail = ss.getRange('F2').getValue()
      // メール送信
      sendNotificationEmail(
        recipientEmail,
        eventTitle,
        pl.userName,
        pl.selectedMeetingDay,
        pl.selectedMeetingTime,
        meetingLink
      )
    }

    return meetingLink
  } catch (e) {
    console.error('Error creating event with conference data:', e.toString())
  }
}

function getCalendarId(desiredCalendarId) {
  const calendars = CalendarApp.getAllCalendars()
  for (const calendar of calendars) {
    if (calendar.getName() === desiredCalendarId) {
      return calendar.getId() // カレンダーが見つかった場合
    }
  }
  return 'primary' // 見つからない場合はプライマリーカレンダーを使用
}

function parseMeetingTime(day, timeRange) {
  // 曜日情報を削除し、日付区切りをハイフンに変更
  day = day.replace(/\s*\(.\)/, '').replace(/\//g, '-')

  const datePattern = /(\d{4}-\d{2}-\d{2})/
  const timePattern = /(\d{2}:\d{2})/g

  const dateMatch = day.match(datePattern)
  const timeMatches = timeRange.match(timePattern)

  if (!dateMatch || !timeMatches || timeMatches.length < 2) {
    console.error('Failed to parse date or time:', day, timeRange)
    return null
  }

  const [startTimeStr, endTimeStr] = timeMatches
  const meetingDate = dateMatch[0]

  // ISO 8601フォーマットでタイムゾーンを明示
  const startTime = new Date(`${meetingDate}T${startTimeStr}:00+09:00`)
  const endTime = new Date(`${meetingDate}T${endTimeStr}:00+09:00`)

  if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
    console.error('Invalid date constructed', startTime, endTime)
    return null
  }

  return [startTime, endTime]
}

function sendNotificationEmail(
  recipientEmail,
  title,
  userName,
  meetingDate,
  meetingTime,
  meetingLink
) {
  const subject = `【確認依頼】 ${title}`
  const messageBody = `${userName}さんが予定を追加しました。\n\nTitle: ${title}\nMeeting Date: ${meetingDate}\nMeeting Time: ${meetingTime}\nJoin Meeting: ${meetingLink}`

  GmailApp.sendEmail(recipientEmail, subject, messageBody, {
    from: 'notice@gmail.com'
  })
}
