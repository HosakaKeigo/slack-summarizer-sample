/**
 * Googleドキュメント作成。リンクを知っている全員に閲覧権限
 */
function createDocument(summary: Summary, original: string) {
  const doc = DocumentApp.create(summary.title)
  const docBody = doc.getBody()
  docBody.setText(summary.body).appendPageBreak()
  docBody.appendParagraph(original)

  const fileId = doc.getId()
  const docFile = DriveApp.getFileById(fileId)
  moveDocument(docFile)
  grantAccess(docFile)

  return fileId
}

function grantAccess(file: GoogleAppsScript.Drive.File) {
  file.setSharing(FILE_PERMISSION, FILE_PERMISSION_TYPE);
}

function moveDocument(file: GoogleAppsScript.Drive.File) {
  const date = new Date();
  const folderPath = `${DIRECTORY_NAME}/${date.getFullYear()}/${date.getMonth() + 1}`
  const destinationFolder = createNestedFolder(folderPath);
  file.moveTo(destinationFolder);
}


function createNestedFolder(path: string): GoogleAppsScript.Drive.Folder {
  const folders = path.split('/');
  let parent = DriveApp.getRootFolder();

  for (var i = 0; i < folders.length; i++) {
    const nextFolder = getOrCreateFolder(parent, folders[i]);
    parent = nextFolder;
  }

  return parent;
}

function getOrCreateFolder(parent: GoogleAppsScript.Drive.Folder, folderName: string) {
  const folders = parent.getFoldersByName(folderName);
  if (folders.hasNext()) {
    return folders.next();
  } else {
    return parent.createFolder(folderName);
  }
}
