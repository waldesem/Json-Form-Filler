const uploadForm = document.forms["uploadForm"];
const fileElement = uploadForm.upload;
fileElement.addEventListener("change", handleUpload);

async function handleUpload() {
  const checkBox = uploadForm.checkbox.checked;
  const reader = new FileReader();
  reader.readAsText(fileElement.files[0]);

  const jsonData = await new Promise((resolve) => {
    reader.onload = () => {
      resolve(JSON.parse(reader.result));
    };
  });
  await uploadData(jsonData, checkBox);
}
