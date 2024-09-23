const vscode = require('vscode');

function activate(context) {
  let disposable = vscode.commands.registerCommand('jsonCleaner.cleanJson', function () {
    const editor = vscode.window.activeTextEditor;

    if (editor) {
      const document = editor.document;
      const text = document.getText();

      try {
        let jsonObject = JSON.parse(text);
        const cleanedJson = cleanJsonValues(jsonObject);
        const cleanedText = JSON.stringify(cleanedJson, null, 2);

        editor.edit(editBuilder => {
          const start = new vscode.Position(0, 0);
          const end = new vscode.Position(
            document.lineCount - 1,
            document.lineAt(document.lineCount - 1).text.length
          );
          const entireRange = new vscode.Range(start, end);

          editBuilder.replace(entireRange, cleanedText);
        });

        vscode.window.showInformationMessage('JSON cleaned successfully!');
      } catch (error) {
        vscode.window.showErrorMessage('Invalid JSON format.');
      }
    }
  });

  context.subscriptions.push(disposable);
}

function cleanJsonValues(obj) {
  if (Array.isArray(obj)) {
    return obj.map(item => cleanJsonValues(item));
  } else if (obj && typeof obj === 'object') {
    const processedKeys = new Set();
    const cleanedObj = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (!processedKeys.has(key)) {
          processedKeys.add(key);

          if (typeof obj[key] === 'object' && obj[key] !== null) {
            // For objects and arrays, recurse into them
            cleanedObj[key] = cleanJsonValues(obj[key]);
          } else {
            // For primitive types, replace with empty value
            cleanedObj[key] = getEmptyValue(obj[key]);
          }
        } else {
          // Subsequent occurrences retain their original values
          cleanedObj[key] = obj[key];
        }
      }
    }
    return cleanedObj;
  } else {
    return obj;
  }
}

function getEmptyValue(value) {
  if (Array.isArray(value)) {
    return [];
  } else if (value && typeof value === 'object') {
    return {};
  } else if (typeof value === 'string') {
    return '';
  } else if (typeof value === 'number') {
    return 0;
  } else if (typeof value === 'boolean') {
    return false;
  } else {
    return null;
  }
}

function deactivate() {}

module.exports = {
  activate,
  deactivate
};
