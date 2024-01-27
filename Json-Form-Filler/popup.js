"use strict";

const uploadForm = document.getElementById('uploadForm');
uploadForm.addEventListener('change', handleUpload);

async function handleUpload() {
  const checkBox = document.getElementById('checkbox').checked;
  const uploadInput = document.getElementById('upload');
  const filesElement = uploadInput.files;
  
  let files= [];
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
                alert(`Некорректная дата для ${jsonData['lastName']}`);
                return;
              };
              (dataForm[fieldMap[element]]).value = new Date(jsonData[element]).toLocaleDateString('ru-RU');
            } else {
              dataForm[fieldMap[element]].value = jsonData[element];
            }
          }
        });
        // Submit the form
        if (checkBox) {
          document.getElementById('submitbutton')?.click()
          console.log(`Отправка формы для ${jsonData['lastName']} выполнена`);
        } else {
          console.log('Форма заполнена');
        }
      },
      args: [jsonData, checkBox],
    });
  });
};


async function handleUpload() {
  const checkBox = document.getElementById('checkbox').checked;
  const uploadInput = document.getElementById('upload');
  const filesElement = uploadInput.files;
  
  let files= [];
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
        resolve(JSON.parse(reader.result));
      };
    });
    
    const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
    
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: (jsonData, checkBox) => {
        if (window.location.hostname === "www.i-sphere.ru") {
            const checkform = document.forms['checkform'];
            if (!checkform) {
                alert("Форма отсутствует или изменена");
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
                    if (['date', 'issueDate'].includes(fieldMap[element])) {
                        if (new Date(jsonData[element]) > new Date()) {
                            alert(`Некорректная дата для ${jsonData['lastName']}`);
                            return;
                        }
                        ;
                        checkform[fieldMap[element]].value = new Date(jsonData[element]).toLocaleDateString('ru-RU');
                    }
                    else {
                        checkform[fieldMap[element]].value = jsonData[element];
                    }
                }
            });
            
            // Submit the form
            if (checkBox) {
                document.getElementById('submitbutton').click()
                console.log('Отправка формы для выполнена');
            }
            else {
                console.log('Форма заполнена');
            }

        } else {
            const NbkiForm = document.forms['nbch302Fz'];
            const OkbForm = document.forms['experian302Fz'];
            const GroupForm = document.forms['groupRequest302fz']
            if (NbkiForm) {
              const fieldMap = {
                'lastName': 'surname',
                'firstName': 'firstname',
                'midName': 'middlename',
                'birthday': 'dateOfBirth',
                'birthplace': 'consentPersonPlaceBirth',
                'passportSerial': 'idSeries',
                'passportNumber': 'idNum',
                'passportIssueDate': 'issueDate',
                'passportIssuedBy': 'consentPersonIssueAuthority'
              };
              Object.keys(jsonData).forEach(element => {
                if (fieldMap[element]) {
                  if (['dateOfBirth', 'issueDate'].includes(fieldMap[element])) {
                    if (new Date(jsonData[element]) > new Date()) {
                      alert(`Некорректная дата для ${jsonData['lastName']}`);
                      return;
                    };
                    NbkiForm[fieldMap[element]].value = new Date(jsonData[element]).toLocaleDateString('ru-RU');
                  }
                  else {
                    NbkiForm[fieldMap[element]].value = jsonData[element];
                  }
                }
              });
              let requestReason = document.getElementById("nbch302Fz_requestReason")
              requestReason.value = '24';
              NbkiForm["consentDate"].value =  new Date().toLocaleDateString('ru-RU')
              
              // Submit the form
              if (checkBox) {
                document.getElementById('nbch302Fz_buttonSend').click()
                console.log('Отправка формы выполнена');
              }
              else {
                  console.log('Форма заполнена');
              }

            } else if (OkbForm) {
              const fieldMap = {
                'lastName': 'lastName',
                'firstName': 'firstName',
                'midName': 'middleName',
                'birthday': 'birthDate',
                'birthplace': 'birthPlace',
                'passportSerial': 'idSeries',
                'passportNumber': 'idNum',
                'passportIssueDate': 'issueDate',
                'passportIssuedBy': 'issueAuthority'
              };
                
              Object.keys(jsonData).forEach(element => {
                if (fieldMap[element]) {
                  if (['birthDate', 'issueDate'].includes(fieldMap[element])) {
                    if (new Date(jsonData[element]) > new Date()) {
                      alert(`Некорректная дата для ${jsonData['lastName']}`);
                      return;
                    };
                    OkbForm[fieldMap[element]].value = new Date(jsonData[element]).toLocaleDateString('ru-RU');
                  }
                  else {
                    OkbForm[fieldMap[element]].value = jsonData[element];
                  }
                }
              });
              let requestReason = document.getElementById("experian302Fz_requestReason")
              requestReason.value = '24';
              OkbForm["consentDate"].value =  new Date().toLocaleDateString('ru-RU')
              // Submit the form
              if (checkBox) {
                document.getElementById('experian302Fz_buttonSend').click()
                console.log('Отправка формы выполнена');
              }
              else {
                console.log('Форма заполнена');
              };

            } else if (GroupForm)  {
              document.getElementById("nbchCheckbox").checked = true
              document.getElementById("experianCheckbox").checked = true
              
              const fieldMap = {
                'lastName': 'surname',
                'firstName': 'firstname',
                'midName': 'middlename',
                'birthday': 'birthDate',
                'birthday': 'dateOfBirth',
                'passportSerial': 'idSeries',
                'passportNumber': 'idNum',
                'passportIssueDate': 'idIssueDate',
                'passportIssuedBy': 'issueAuthority'
              };

              Object.keys(jsonData).forEach(element => {
                if (fieldMap[element]) {
                  if (['birthDate', 'idIssueDate'].includes(fieldMap[element])) {
                    if (new Date(jsonData[element]) > new Date()) {
                      alert(`Некорректная дата для ${jsonData['lastName']}`);
                      return;
                    };
                    GroupForm[fieldMap[element]].value = new Date(jsonData[element]).toLocaleDateString('ru-RU');
                  } else {
                    GroupForm[fieldMap[element]].value = jsonData[element];
                  }
                }
              });
              let requestReason = document.getElementById("groupRequest302fz_requestReason")
              requestReason.value = '24';
              GroupForm["consentDate"].value =  new Date().toLocaleDateString('ru-RU')
              // Submit the form
              if (checkBox) {
                document.getElementById('groupRequest302fz_buttonSend').click()
                console.log('Отправка формы выполнена');
              }
              else {
                console.log('Форма заполнена');
              }
            } else {
          alert('Форма не найдена или изменена');
          }
        }
      },
      args: [jsonData, checkBox],
    });
  });
};