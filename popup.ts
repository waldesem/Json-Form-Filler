"use strict";
declare const chrome: any;

const uploadForm = document.getElementById('uploadForm') as HTMLFormElement;
uploadForm.addEventListener('change', handleUpload);

async function handleUpload() {
  const checkBox = (document.getElementById('checkbox') as HTMLInputElement).checked;
  const uploadInput = document.getElementById('upload') as HTMLInputElement;
  const filesElement = uploadInput.files;
  
  let files: Array<File> = [];
  if (filesElement) {
    files = Array.from(filesElement);
  } else {
    return;
  };

  if (!checkBox && files.length > 1) {

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
        resolve(JSON.parse(reader.result as string));
      };
    });
    
    const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
    
    await chrome.scripting.executeScript({
      target: {tabId: tab.id},

      func: (jsonData: Record<string, string>, checkBox: boolean) => {
        const dataForm = document.forms['checkform' as keyof typeof document.forms] as HTMLFormElement;
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
          if (fieldMap[element as keyof typeof fieldMap]) {
            if (['date','issueDate'].includes(fieldMap[element as keyof typeof fieldMap])) {
              if (new Date(jsonData[element]) > new Date()) {
                alert(`Некорректная дата для ${jsonData['lastName' as keyof typeof jsonData]}`);
                return;
              };
              (dataForm[fieldMap[element as keyof typeof fieldMap]] as HTMLInputElement).value = new Date(jsonData[element]).toLocaleDateString('ru-RU');
            } else {
              (dataForm[fieldMap[element as keyof typeof fieldMap]] as HTMLInputElement).value = jsonData[element as keyof typeof jsonData];
            }
          }
        });
        // Submit the form
        if (checkBox) {
          dataForm.submit();
          console.log(`Отправка формы для ${jsonData['lastName' as keyof typeof jsonData]} выполнена`);
        } else {
          console.log('Форма заполнена');
        }
      },
      args: [jsonData, checkBox],
    });
  });
};
