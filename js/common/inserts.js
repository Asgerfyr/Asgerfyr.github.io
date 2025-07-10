document.addEventListener("DOMContentLoaded", () => {
    age_insert();

    semester_insert();
})


function age_insert(){
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
}

function semester_insert(){
    Array.from(document.getElementsByClassName("semester")).forEach(element => {
        const today = new Date();
        const enddate = new Date("2028-12-30");
        const years = enddate.getFullYear() - today.getFullYear();
        const m = enddate.getMonth() - today.getMonth();
        const semesters = 7 - Math.max(0,(years * 2 + ((m >= 6) ? 1 : 0)));
        element.textContent = semesters;
    });
}