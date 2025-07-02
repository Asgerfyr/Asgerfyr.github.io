emailjs.init("yMVVcoLqT3RY12VH1");

const form = document.getElementById('contact-form');
let popup;

document.addEventListener('DOMContentLoaded', function () {
    popup = document.getElementById('popup');
});

form.addEventListener('submit', function (event) {
    event.preventDefault();
    emailjs.sendForm('service_portfser', 'template_os79533', form)
        .then(() => {
            console.log(popup);
            popup.textContent = 'Besked er sendt';
            popup.classList.add('active');
            setTimeout(() => {
                popup.classList.remove('active');
            }, 2000);
            form.reset();
        }, (error) => {
            alert('Fejl ved afsendelse: ' + error.text);
        });
});