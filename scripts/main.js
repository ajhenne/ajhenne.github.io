function changeLogo() {
    const logoImg = document.getElementById('logo');

    if (document.body.classList.contains('light-mode')) {
        logoImg.src = "/assets/burst_secondary.svg";
    } else {
        logoImg.src = "/assets/burst_primary.svg";
    }
}

document.addEventListener('DOMContentLoaded', changeLogo());

document.addEventListener('scroll', function () {
    changeLogo();
});