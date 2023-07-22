/**
 * Googleドキュメント作成。リンクを知っている全員に閲覧権限
 */
function createDocument(summary: Summary, original: string) {
  const doc = DocumentApp.create(summary.title);
  const docBody = doc.getBody()
  docBody.setText(summary.body).appendPageBreak();
  docBody.appendParagraph(original)
  return doc.getId()
}

function grantAccess(fileId: string) {
  const file = DriveApp.getFileById(fileId);
  file.setSharing(FILE_PERMISSION, FILE_PERMISSION_TYPE);
}