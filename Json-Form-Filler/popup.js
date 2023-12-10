"use strict";

document.getElementById('uploadForm').addEventListener('change', handleUpload);

async function handleUpload() {
  const checkBox = document.getElementById('checkbox').checked;
  const files = Array.from(document.getElementById('upload').files);

  if (!files) {
    return;
  };

  const lenFiles = files.length;
  if (!checkBox && lenFiles > 1) {
    const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
    
    await chrome.scripting.executeScript({
      target: {tabId: tab.id},

      func: () => {
        alert('Отправка нескольких файлов возможна только в автоматическом режиме');
          return;
        }
    });
    return;
  };

  files.forEach(async (file) => {
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
              if (new Date(jsonData[element]) > new Date()) {
                alert('Некорректная дата');
                return;
              };
              dataForm[fieldMap[element]].value = new Date(jsonData[element]).toLocaleDateString('ru-RU');
            } else {
              dataForm[fieldMap[element]].value = jsonData[element];
            }
          }
        });
        // Submit the form
        if (checkBox) {
          dataForm.submit();
          console.log(`Отправка формы для ${jsonData['lastName']} выполнена`);
        } else {
          console.log('Форма заполнена');
        }
      },
      args: [jsonData, checkBox],
    });
  })
}
