document
  .getElementById("contactForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    let isValid = true;

    const name = document.getElementById("name");
    const email = document.getElementById("email");
    const message = document.getElementById("message");

    const nameError = document.getElementById("nameError");
    const emailError = document.getElementById("emailError");
    const messageError = document.getElementById("messageError");

    if (name.value.trim() === "") {
      nameError.classList.remove("hidden");
      isValid = false;
    } else {
      nameError.classList.add("hidden");
    }

    if (email.value.trim() === "" || !email.value.includes("@")) {
      emailError.classList.remove("hidden");
      isValid = false;
    } else {
      emailError.classList.add("hidden");
    }

    if (message.value.trim() === "") {
      messageError.classList.remove("hidden");
      isValid = false;
    } else {
      messageError.classList.add("hidden");
    }

    if (isValid) {
      alert("Form submitted successfully!");
    }
  });
