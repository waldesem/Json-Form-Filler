"use strict";

document.getElementById('uploadForm').addEventListener('change', handleUpload);
/**
 * Handles the upload of a file.
 *
 * @return {Promise<void>} A promise that resolves when the upload is complete.
 */
async function handleUpload() {
  const checkBox = document.getElementById('checkbox').checked;
  const file = document.getElementById('upload').files[0];
  const reader = new FileReader();
  reader.readAsText(file);
  
  const jsonData = await new Promise((resolve) => {
    reader.onload = () => {
      resolve(JSON.parse(reader.result));
    };
  });
  
  const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
  
  await chrome.scripting.executeScript({
    target: {tabId: tab.id},
    /**
     * Generates a comment for the given function body.
     *
     * @param {Object} jsonData - The JSON data to process.
     * @param {boolean} checkBox - Whether to submit the form or not.
     */
    func: (jsonData, checkBox) => {
      const dataForm = document.forms['checkform'];
      if (!dataForm) {
        return;
      }
      const fieldMap = {
        'lastName': 'last_name',
        'firstName': 'first_name',
        'midName': 'patronymic',
        'birthday': 'date',
        'passportSerial': 'passport_series',
        'passportNumber': 'passport_number',
        'passportIssueDate': 'issueDate',
        'inn': 'inn',
        'snils': 'snils',
        'contactPhone': 'mobile_phone',
        'email': 'email'
      };
      Object.keys(jsonData).forEach(element => {
        if (fieldMap[element]) {
          if (['date','issueDate'].includes(fieldMap[element])) {
            dataForm[fieldMap[element]].value = new Date(jsonData[element]).toLocaleDateString('ru-RU');
          } else {
            dataForm[fieldMap[element]].value = jsonData[element];
          }
        }
      });
      // Submit the form
      if (checkBox) {
        dataForm.submit();
      }
    },
    args: [jsonData, checkBox],
  });
}
