emailjs.init("yMVVcoLqT3RY12VH1");

const form = document.getElementById('contact-form');

form.addEventListener('submit', function (event) {
    event.preventDefault();
    emailjs.sendForm('service_portfser', 'template_os79533', form)
        .then(() => {
            popup('Tak for din besked! Jeg vender tilbage hurtigst muligt.');
            form.reset();
        }, (error) => {
            alert('Fejl ved afsendelse: ' + error.text);
        });
});