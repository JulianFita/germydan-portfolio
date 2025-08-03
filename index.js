// ===================== SERVICES TOGGLE

const servicesButtons = document.querySelectorAll('.service__item');
const serviceDetails = document.querySelector('.services__right');

const getService = (category) => {
    const details = servicesData.find(item => item.category === category);
    serviceDetails.innerHTML = `
        <h3>${details.title}</h3>
        ${details.description.map(paragraph => "<p>" + paragraph + "</p>").join('')}
    `
}

const removeActiveClass = () => {
    servicesButtons.forEach(button => {
        button.classList.remove('active');
    })
}

servicesButtons.forEach(item => {
    item.addEventListener('click', () => {
        removeActiveClass();
        const serviceClass = item.classList[1];
        getService(serviceClass)
        item.classList.add('active')
    })
})

getService('prop')

// ===================== MIX IT UP

const containerEl = document.querySelector('.projects__container');
var mixer = mixitup(containerEl, {
    animation: {
        enable: false
    }
});

mixer.filter('*');

/*    ==================================== COVERS ====================================   */

// Lógica para mostrar y ocultar el cover de manera automática
const categories = document.querySelectorAll('.projects__categories li');
// La clase .project-covers ahora está en el propio article, no en un contenedor.
// No necesitas la segunda clase en el selector.
const allCovers = document.querySelectorAll('.project-covers');

categories.forEach(category => {
    category.addEventListener('click', function() {
        const filter = this.getAttribute('data-filter');

        // Primero, oculta todos los covers
        allCovers.forEach(cover => {
            cover.style.display = 'none';
        });

        // Si el filtro no es "All", intenta encontrar y mostrar el cover correspondiente
        if (filter !== '*') {
            // Busca el cover que coincida con el filtro seleccionado
            const activeCover = document.querySelector(`[data-filter-cover="${filter}"]`);
            if (activeCover) {
                activeCover.style.display = 'flex';
            }
        }
    });
});

/*    ==================================== COVERS ====================================   */

// ===================== NAV TOGGLE (small screens)

const navMenu = document.querySelector('.nav__menu')
const navOpenBtn = document.querySelector('.nav__toggle-open')
const navCloseBtn = document.querySelector('.nav__toggle-close')

const openNavHandler = () => {
    navMenu.style.display = 'flex';
    navOpenBtn.style.display = 'none';
    navCloseBtn.style.display = 'inline-block';
}

const closeNavHandler = () => {
    navMenu.style.display = 'none';
    navOpenBtn.style.display = 'inline-block';
    navCloseBtn.style.display = 'none';
}

navOpenBtn.addEventListener('click', openNavHandler)
navCloseBtn.addEventListener('click', closeNavHandler)


// Close nav menu on click of nav link on small screens
const navItems  = navMenu.querySelectorAll('a');
if(window.innerWidth < 768 ) {
    navItems.forEach(item => {
        item.addEventListener('click', closeNavHandler)
    })
}


// ===================== THEME TOGGLE (light & dark mode)
const themeBtn = document.querySelector('.nav__theme-btn');
themeBtn.addEventListener('click', () => {
    let bodyClass = document.body.className;
    if (!bodyClass) {
        bodyClass = 'dark';
        document.body.className = bodyClass;
        // change toggle icon
        themeBtn.innerHTML = "<i class='il uil-sun'></i>";
        // save theme to local storage
        window.localStorage.setItem('theme', bodyClass);
    } else {
        bodyClass = '';
        document.body.className = bodyClass;
        // change toggle icon
        themeBtn.innerHTML = "<i class='il uil-moon'></i>";
        // save theme to local storage
        window.localStorage.setItem('theme', bodyClass);
    }
})


// ===================== CONTACT TOGGLE
const oberser = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        console.log(entry)
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
        } else {
            entry.target.classList.remove('show')
        }
    });
});

const hiddenElemtns = document.querySelectorAll('.hidden');
hiddenElemtns.forEach((el) => oberser.observe((el)));


// load theme on load
window.addEventListener('load', () => {
    document.body.className = window.localStorage.getItem('theme');
})

