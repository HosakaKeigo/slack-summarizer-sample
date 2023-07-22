/**
 * Googleドキュメント作成。リンクを知っている全員に閲覧権限
 */
function createDocument(summary: Summary) {
  const doc = DocumentApp.create(summary.title);
  doc.getBody().setText(summary.body);
  return doc.getId()
}

function grantAccess(fileId: string) {
  const file = DriveApp.getFileById(fileId);
  file.setSharing(FILE_PERMISSION, FILE_PERMISSION_TYPE);
}