/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const CONFIG = {
  TITLE: 'pre-interview_project'
}

function doGet(e) {
  return HtmlService.createTemplateFromFile('index.html')
    .evaluate()
    .addMetaTag('viewport', 'width=device-width, initial-scale=1.0')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .setTitle(CONFIG.TITLE)
}

function includes(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent()
}
