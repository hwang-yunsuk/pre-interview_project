/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
// 日付をセット
let NOW = getDate()

// ScriptProperties
let FORM_ID = PropertiesService.getScriptProperties().getProperty('FORM_ID')
let SHEET_ID = PropertiesService.getScriptProperties().getProperty('SHEET_ID')
let NOTION_API_TOKEN = PropertiesService.getScriptProperties().getProperty('NOTION_API_TOKEN')
let NOTION_DB = PropertiesService.getScriptProperties().getProperty('NOTION_DB')
let SLACK_TOKEN_MAIN = PropertiesService.getScriptProperties().getProperty('SLACK_TOKEN_MAIN')
let SLACK_TOKEN_TEST = PropertiesService.getScriptProperties().getProperty('SLACK_TOKEN_TEST')

// シート名（yyyy年mm月）
let SHEET_NAME = Utilities.formatDate(NOW.n, 'JST', 'yyyy年MM月')

// アンケートURL
let INTERVIEW_URL =
  'https://script.google.com/macros/s/AKfycby6GMJRway99OPIpbXlc0tzY4n0NbXMGobx4TBkC-p6/dev'

let DESCRIPTION =
  'お疲れさまです。' +
  '\n' +
  NOW.m +
  '月の主任ヒアリングの日程を決めたいと思います。' +
  '\n' +
  '以下のURLから事前アンケートの作成と日程調整をお願いします。' +
  '\n' +
  INTERVIEW_URL

// trigger
let POST_TO_SLACK = 'messagePostsToSlack'
