<script setup>

import {ref} from 'vue';

const checkBox = ref(true);

/**
 * Handles the upload of a file.
 *
 * @return {Promise<void>} A promise that resolves when the upload is complete.
 */
async function handleUpload(event) {
  event.preventDefault();
  if (!event.target.files || event.target.files.length === 0) {
    return;
  };
  const file = event.target.files[0];
  if (!file) {
    return;
  };
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
    args: [jsonData, checkBox.value],
  });
}
</script>

<template>
  <div class="container-fluid justify-content-center">
    <h5 class="text-center text-primary py-3">Json Form Filler</h5>
      <div class="d-flex justify-content-center py-1">
        <form class="d-flex justify-content-center align-items-center" id="uploadForm" @change="handleUpload($event)">
          <label class="btn btn-primary btn-sm" id="uploadLabel" for="upload">Загрузить файл</label>
          <input class="form-control" type="file" id="upload" name="upload" accept=".json"  />
          <input class="form-check-input" type="checkbox" id="checkbox" name="checkbox" v-model="checkBox" 
                title="Автоматическая отправка формы" />
        </form>
      </div>
      <footer class="d-flex justify-content-center py-3">
        <a class="link-primary" href="https://github.com/waldesem/Json-Form-Filler" target="_blank">
          GitHub
        </a>
      </footer>
  </div>
</template>

<style scoped>
input[type="file"] {
  display: none;
}
input[type="checkbox"] {
  margin-left: 10px;
}
</style>
