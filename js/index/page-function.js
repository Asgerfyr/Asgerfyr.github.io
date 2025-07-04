

function readMore(){
    document.getElementById('about-me').classList.toggle('compresed');
    document.getElementById('fade').classList.toggle('hidden');
    const button = document.getElementById('about-me-read-more');
    if (button.textContent === '↓') {
        button.textContent = '↑';
    } else {
        button.textContent = '↓';
    }
}