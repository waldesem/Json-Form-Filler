"use strict";

document.getElementById('uploadForm').addEventListener('change', handleUpload);

/**
 * Handles the upload of a file.
 *
 * @return {Promise<void>} A promise that resolves when the upload is complete.
 */
async function handleUpload() {
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
     * Updates the values of form fields based on the provided JSON data.
     *
     * @param {object} jsonData - The JSON data containing the values to be updated.
     */
    func: (jsonData) => {
      const dataForm = document.forms['checkform'];
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
          dataForm[fieldMap[element]].value = jsonData[element];
        }
      });
    },
    args: [jsonData],
  });
}
