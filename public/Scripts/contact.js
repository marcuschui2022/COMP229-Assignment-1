// Name: Chui Kwok Yuk Student
// Number: 301246550
// Last Modified Date: 4 Feb 2023

const form = document.getElementById("contactForm");
const formData = new FormData(form);

form.addEventListener("submit", function (e) {
  //   e.preventDefault();

  let displayMsg = "This is the details you want to send: \n";

  for (const [key, value] of formData) {
    console.log(displayMsg);
    displayMsg += `${key}: ${value}\n`;
  }
  console.log(displayMsg);
  alert(displayMsg);
});
