document.getElementById('uploadForm').addEventListener('change', handleUpload);

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
    func: (jsonData) => {
      const dataForm = document.forms['checkform'];
      Object.keys(jsonData).forEach(element => {
        switch (element){
          case 'lastName':
            dataForm['last_name'].value = jsonData[element];
            break;
          case 'firstName':
            dataForm['first_name'].value = jsonData[element];
            break;
          case 'midName':
            dataForm['patronymic'].value = jsonData[element];
            break;
          case 'birthday':
            dataForm['date'].value = jsonData[element];
            break;
          case 'passportSerial':
            dataForm['passport_series'].value = jsonData[element];
            break;
          case 'passportNumber':
            dataForm['passport_number'].value = jsonData[element];
            break;
          case 'passportIssueDate':
            dataForm['issueDate'].value = jsonData[element];
            break;
          case 'inn':
            dataForm['inn'].value = jsonData[element];
            break;
          case 'snils':
            dataForm['snils'].value = jsonData[element];
            break;
          case 'contactPhone':
            dataForm['mobile_phone'].value = jsonData[element];
            break;
          case 'email':
            dataForm['email'].value = jsonData[element];
            break;
          default:
            break;
        }
        //document.getElementById('submitbutton').click()
      });
    },
    args: [jsonData],
  });
}
