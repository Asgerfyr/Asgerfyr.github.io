
function downloadPDF() {
    const element = document.getElementById('pdf-content');
    const offsetX = element.getBoundingClientRect().left + window.scrollX;
    const offsetY = element.getBoundingClientRect().top + window.scrollY;
    html2pdf().set({
    margin: 0,
    filename: 'Asger_G_Stidsen_CV.pdf',
    image: { type: 'jpeg', quality: 1 },
    html2canvas: {
        scale: 2,
        scrollX: 0,
        scrollY: 0,
        x: offsetX, // Force no offset
        y: offsetY,
    },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    }).from(element).save();
}


if(new URLSearchParams(window.location.search).get("download") === "true") {
    downloadPDF();
    setTimeout(() => window.close(),500);
}
