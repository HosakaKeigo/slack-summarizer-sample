/**
 * Googleドキュメント作成。リンクを知っている全員に閲覧権限
 */
function createDocument(title: string, body: string) {
  const doc = DocumentApp.create(title).setName(title);
  doc.getBody().setText(body);
  const fileId = doc.getId();
  return doc.getId()
}

function grantAccess(fileId: string) {
  const file = DriveApp.getFileById(fileId);
  file.setSharing(FILE_PERMISSION, FILE_PERMISSION_TYPE);
}