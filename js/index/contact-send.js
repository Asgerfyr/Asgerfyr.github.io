// emailjs.init("YOUR_USER_ID");

const form = document.getElementById('contact-form');
console.log(form);
form.addEventListener('submit', function (event) {
    event.preventDefault();
    const formData = new FormData(form);

    const data = Object.fromEntries(formData.entries());

    console.log(formData);

    // emailjs.sendForm('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', this)
    //     .then(() => {
    //         alert('Besked sendt!');
    //         form.reset();
    //     }, (error) => {
    //         alert('Fejl ved afsendelse: ' + error.text);
    //     });
});