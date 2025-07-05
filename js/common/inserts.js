document.addEventListener("DOMContentLoaded", () => {
    Array.from(document.getElementsByClassName("age")).forEach(element => {
        const birthday = new Date("2005-04-08");
        const today = new Date();
        let age = today.getFullYear() - birthday.getFullYear();
        const m = today.getMonth() - birthday.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthday.getDate())) {
            age--;
        }
        element.textContent = age;
    });
})