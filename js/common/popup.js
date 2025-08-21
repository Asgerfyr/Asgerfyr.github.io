let popup_element;

document.addEventListener('DOMContentLoaded', function () {
    popup_element = document.getElementById('popup');
});

function popup(String){
    popup_element.textContent = String;
    popup_element.classList.add('active');
    setTimeout(() => {
        popup_element.classList.remove('active');
    }, 4000);
}