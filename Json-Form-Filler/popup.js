"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const uploadForm = document.getElementById('uploadForm');
uploadForm.addEventListener('change', handleUpload);
function handleUpload() {
    return __awaiter(this, void 0, void 0, function* () {
        const checkBox = document.getElementById('checkbox').checked;
        const uploadInput = document.getElementById('upload');
        const filesElement = uploadInput.files;
        let files = [];
        if (filesElement) {
            files = Array.from(filesElement);
        }
        else {
            return;
        }
        ;
        if (!checkBox && files.length > 1) {
            const [tab] = yield chrome.tabs.query({ active: true, currentWindow: true });
            yield chrome.scripting.executeScript({
                target: { tabId: tab.id },
                func: () => {
                    alert('Отправка нескольких файлов возможна только в автоматическом режиме');
                    return;
                }
            });
            return;
        }
        ;
        files.forEach((file) => __awaiter(this, void 0, void 0, function* () {
            const reader = new FileReader();
            reader.readAsText(file);
            const jsonData = yield new Promise((resolve) => {
                reader.onload = () => {
                    resolve(JSON.parse(reader.result));
                };
            });
            const [tab] = yield chrome.tabs.query({ active: true, currentWindow: true });
            yield chrome.scripting.executeScript({
                target: { tabId: tab.id },
                func: (jsonData, checkBox) => {
                    var _a;
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
                            if (['date', 'issueDate'].includes(fieldMap[element])) {
                                if (new Date(jsonData[element]) > new Date()) {
                                    alert(`Некорректная дата для ${jsonData['lastName']}`);
                                    return;
                                }
                                ;
                                dataForm[fieldMap[element]].value = new Date(jsonData[element]).toLocaleDateString('ru-RU');
                            }
                            else {
                                dataForm[fieldMap[element]].value = jsonData[element];
                            }
                        }
                    });
                    // Submit the form
                    if (checkBox) {
                        (_a = document.getElementById('submitbutton')) === null || _a === void 0 ? void 0 : _a.click();
                        console.log(`Отправка формы для ${jsonData['lastName']} выполнена`);
                    }
                    else {
                        console.log('Форма заполнена');
                    }
                },
                args: [jsonData, checkBox],
            });
        }));
    });
}
;
