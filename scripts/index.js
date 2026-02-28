// Scrolling listeners.
window.addEventListener('scroll', function () {

    const scrollY = window.scrollY;

    // SCROLL INDICATOR
    const startScroll = 50;
    const endScroll = 500;

    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        if (scrollY < startScroll) {
            scrollIndicator.style.opacity = '1';
            scrollIndicator.style.visibility = 'visible';
        } else if (scrollY > endScroll) {
            scrollIndicator.style.opacity = '0';
            scrollIndicator.style.visibility = 'hidden';
        } else {
            scrollIndicator.style.opacity = (endScroll - scrollY) / (endScroll - startScroll);
            scrollIndicator.style.visibility = 'visible';
        }
    }


    // NAV BAR
    const logo = document.querySelector('.nav-logo');

    const startLogo = 300;
    const endLogo = 650;

    let scrollPercent = (scrollY - startLogo) / (endLogo - startLogo);
    scrollPercent = Math.max(0, Math.min(1, scrollPercent));

    logo.style.setProperty('--expand-progress', scrollPercent);
    logo.style.setProperty('--expand-progress', scrollPercent);


    const horizon = document.querySelector('.horizon-trigger');
    const horizonTop = horizon.offsetTop;

    if (window.scrollY > horizonTop) {
        document.body.classList.add('light-mode');
    } else {
        document.body.classList.remove('light-mode');
    }


    const sideNav = document.querySelector('.side-progress');

    if (scrollY > window.innerHeight * 0.4) {
        sideNav.classList.add('visible');
    } else {
        sideNav.classList.remove('visible');
    }

    const navLinks = document.querySelectorAll('.progress-list a');
    const navBar = document.querySelector('.side-progress');


    let current = "";

    const navAnchors = document.querySelectorAll('#about, #projects');

    navAnchors.forEach(anchor => {
        const sectionTop = anchor.getBoundingClientRect().top + window.scrollY;

        if (scrollY >= sectionTop - 500) {
            current = anchor.getAttribute('id');
        }
    });

    if (current === 'projects') {
            navBar.classList.add('light-mode');
    } else {
        navBar.classList.remove('light-mode');
    }

    navLinks.forEach(link => {
        link.classList.remove('active');
        link.classList.remove('light-mode');

        if (current && link.getAttribute('href').includes(current)) {
            link.classList.add('active');
        }

        if (current === 'projects') {
            link.classList.add('light-mode');
        }
    });



});