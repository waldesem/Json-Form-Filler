async function uploadData(jsonData, checkBox) {
  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });

  await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: (jsonData, checkBox) => {
      const checkform = document.forms["checkform"];
      const frmInn = document.forms["frmInn"];
      const nbkiForm = document.forms["nbch302Fz"];
      const okbForm = document.forms["experian302Fz"];
      const groupForm = document.forms["groupRequest302fz"];

      // checkform
      if (checkform) {
        checkform["last_name"].value = jsonData["lastName"];
        checkform["first_name"].value = jsonData["firstName"];
        checkform["patronymic"].value = jsonData["midName"];
        checkform["date"].value = new Date(
          jsonData["birthday"]
        ).toLocaleDateString("ru-RU");
        checkform["passport_series"].value = jsonData["passportSerial"];
        checkform["passport_number"].value = jsonData["passportNumber"];
        checkform["issueDate"].value = new Date(
          jsonData["passportIssueDate"]
        ).toLocaleDateString("ru-RU");
        checkform["inn"].value = jsonData["inn"];
        checkform["snils"].value = jsonData["snils"];
        checkform["mobile_phone"].value = jsonData["contactPhone"];
        checkform["email"].value = jsonData["email"];

        // uncheck boxes
        const selectors = [
          'input[name="sources[gisgmp]"]',
          'input[name="sources[notariat]"]',
          'input[name="sources[fotostrana]"]',
          'input[name="sources[twitter]"]',
          'input[name="sources[facebook]"]',
          'input[name="sources[instagram]"]',
          'input[name="sources[rossvyaz]"]',
          'input[name="sources[hlr]"]',
          'input[name="sources[smsc]"]',
          'input[name="sources[boards]"]',
          'input[name="sources[microsoft]"]',
          'input[name="sources[skype]"]',
          'input[name="sources[google]"]',
          'input[name="sources[google_name]"]',
          'input[name="sources[apple]"]',
          'input[name="sources[samsung]"]',
          'input[name="sources[truecaller]"]',
          'input[name="sources[emt]"]',
          'input[name="sources[callapp]"]',
          'input[name="sources[simpler]"]',
          'input[name="sources[eyecon]"]',
          'input[name="sources[names]"]',
          'input[name="sources[phones]"]',
          'input[name="sources[pochta]"]',
          'input[name="sources[rosneft]"]',
          'input[name="sources[papajohns]"]',
        ];
        selectors.forEach((item) => {
          checkform.querySelector(item).checked = false;
        });
        // submit form
        if (checkBox) checkform["submitbutton"].click();

        // frmInn
      } else if (frmInn) {
        frmInn["fam"].value = jsonData["lastName"];
        frmInn["nam"].value = jsonData["firstName"];
        frmInn["otch"].value = jsonData["midName"];
        frmInn["bdate"].value = new Date(
          jsonData["birthday"]
        ).toLocaleDateString("ru-RU");
        frmInn["docno"].value = `${jsonData["passportSerial"].slice(
          0,
          2
        )} ${jsonData["passportSerial"].slice(2, 4)} ${
          jsonData["passportNumber"]
        }`;
        // submit form
        if (checkBox) frmInn["btn_send"].click();

        // nbkiForm
      } else if (nbkiForm) {
        nbkiForm["nbch302Fz_requestReason"].value = "24";
        nbkiForm["consentDate"].value = new Date().toLocaleDateString("ru-RU");
        nbkiForm["surname"].value = jsonData["lastName"];
        nbkiForm["firstname"].value = jsonData["firstName"];
        nbkiForm["middlename"].value = jsonData["midName"];
        nbkiForm["dateOfBirth"].value = new Date(
          jsonData["birthday"]
        ).toLocaleDateString("ru-RU");
        nbkiForm["consentPersonPlaceBirth"].value = jsonData["birthplace"];
        nbkiForm["idSeries"].value = jsonData["passportSerial"];
        nbkiForm["idNum"].value = jsonData["passportNumber"];
        nbkiForm["issueDate"].value = new Date(
          jsonData["passportIssueDate"]
        ).toLocaleDateString("ru-RU");
        nbkiForm["consentPersonIssueAuthority"].value =
          jsonData["passportIssuedBy"];
        // submit form
        if (checkBox) nbkiForm["nbch302Fz_buttonSend"].click();

        // okbForm
      } else if (okbForm) {
        okbForm["experian302Fz_requestReason"].value = "24";
        okbForm["consentDate"].value = new Date().toLocaleDateString("ru-RU");
        okbForm["lastName"].value = jsonData["lastName"];
        okbForm["firstName"].value = jsonData["firstName"];
        okbForm["middleName"].value = jsonData["midName"];
        okbForm["birthDate"].value = new Date(
          jsonData["birthday"]
        ).toLocaleDateString("ru-RU");
        okbForm["birthPlace"].value = jsonData["birthplace"];
        okbForm["idSeries"].value = jsonData["passportSerial"];
        okbForm["idNum"].value = jsonData["passportNumber"];
        okbForm["issueDate"].value = new Date(
          jsonData["passportIssueDate"]
        ).toLocaleDateString("ru-RU");
        okbForm["issueAuthority"].value = jsonData["passportIssuedBy"];
        // submit form
        if (checkBox) okbForm["experian302Fz_buttonSend"].click();

        // groupForm
      } else if (groupForm) {
        groupForm["nbchCheckbox"].checked = true;
        groupForm["experianCheckbox"].checked = true;
        groupForm["groupRequest302fz_requestReason"].value = "24";
        groupForm["consentDate"].value = new Date().toLocaleDateString("ru-RU");
        groupForm["surname"].value = jsonData["lastName"];
        groupForm["firstname"].value = jsonData["firstName"];
        groupForm["middlename"].value = jsonData["midName"];
        groupForm["birthDate"].value = new Date(
          jsonData["birthday"]
        ).toLocaleDateString("ru-RU");
        groupForm["birthPlace"].value = jsonData["birthplace"];
        groupForm["idSeries"].value = jsonData["passportSerial"];
        groupForm["idNum"].value = jsonData["passportNumber"];
        groupForm["idIssueDate"].value = new Date(
          jsonData["passportIssueDate"]
        ).toLocaleDateString("ru-RU");
        groupForm["idIssueAuthority"].value = jsonData["passportIssuedBy"];
        // submit form
        if (checkBox) groupForm["groupRequest302fz_buttonSend"].click();
      } else {
        chrome.tabs.sendMessage(tab.id, {
          action: "showAlert",
          message: "Форма не найдена или изменена",
        });
      }
    },
    args: [jsonData, checkBox],
  });
  window.close();
}
