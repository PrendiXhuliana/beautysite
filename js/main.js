document.addEventListener('DOMContentLoaded', () => {

    // --- Mobile Navigation Toggle ---
    const navToggle = document.querySelector('.nav-toggle');
    const mainNav = document.getElementById('main-nav');

    if (navToggle && mainNav) {
        navToggle.addEventListener('click', () => {
            const isNavActive = mainNav.classList.toggle('nav-active');
            navToggle.classList.toggle('active');
            navToggle.setAttribute('aria-expanded', isNavActive);
            document.body.style.overflow = isNavActive ? 'hidden' : '';
        });

        mainNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                // Se è un link interno alla pagina (ancora) o un link ad altra pagina
                if (href.startsWith('#') && href.length > 1 && document.querySelector(href) || !href.startsWith('#')) {
                     if (mainNav.classList.contains('nav-active')) {
                        mainNav.classList.remove('nav-active');
                        navToggle.classList.remove('active');
                        navToggle.setAttribute('aria-expanded', 'false');
                        document.body.style.overflow = '';
                    }
                }
                // Se è un'ancora valida, lo smooth scroll (gestito sotto) si occuperà del preventDefault
                // Se non è un'ancora valida (solo #), preveniamo il salto in cima
                if (href === "#") {
                    e.preventDefault();
                }
            });
        });
    }


    // --- Hero Slider ---
    const sliderContainer = document.querySelector('.hero-slider');
    if (sliderContainer) {
        const slides = sliderContainer.querySelectorAll('.slide');
        const prevButton = sliderContainer.querySelector('.prev');
        const nextButton = sliderContainer.querySelector('.next');
        const dotsContainer = sliderContainer.querySelector('.slider-dots');
        let currentSlide = 0;
        let slideInterval;

        function showSlide(index) {
            slides.forEach((slide, i) => {
                slide.classList.remove('active');
                if (i === index) {
                    slide.classList.add('active');
                }
            });
            if (dotsContainer) updateDots(index);
            currentSlide = index;
        }

        function nextSlide() {
            let newSlide = (currentSlide + 1) % slides.length;
            showSlide(newSlide);
        }

        function prevSlide() {
            let newSlide = (currentSlide - 1 + slides.length) % slides.length;
            showSlide(newSlide);
        }

        function updateDots(index) {
            if (!dotsContainer) return;
            const dots = dotsContainer.querySelectorAll('.dot');
            dots.forEach((dot, i) => {
                dot.classList.remove('active');
                dot.setAttribute('aria-selected', 'false');
                if (i === index) {
                    dot.classList.add('active');
                    dot.setAttribute('aria-selected', 'true');
                }
            });
        }

        if (slides.length > 1) { // Attiva slider solo se c'è più di uno slide
            if (dotsContainer) {
                slides.forEach((_, i) => {
                    const dot = document.createElement('button');
                    dot.classList.add('dot');
                    dot.setAttribute('aria-label', `Vai allo slide ${i + 1}`);
                    dot.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
                    if (i === 0) dot.classList.add('active');
                    dot.addEventListener('click', () => {
                        showSlide(i);
                        resetInterval();
                    });
                    dotsContainer.appendChild(dot);
                });
            }

            if (prevButton) prevButton.addEventListener('click', () => {
                prevSlide();
                resetInterval();
            });
            if (nextButton) nextButton.addEventListener('click', () => {
                nextSlide();
                resetInterval();
            });

            function startInterval() {
                slideInterval = setInterval(nextSlide, 7000); // Aumentato intervallo
            }
            function resetInterval() {
                clearInterval(slideInterval);
                startInterval();
            }
            startInterval();
        }
        if (slides.length > 0) {
             showSlide(0); // Mostra il primo slide anche se è l'unico
        } else {
            // Nascondi controlli se non ci sono slide
            if(prevButton) prevButton.style.display = 'none';
            if(nextButton) nextButton.style.display = 'none';
            if(dotsContainer) dotsContainer.style.display = 'none';
        }
    }


    // --- Anno Corrente nel Footer ---
    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }


    // --- Animazione Fade-in allo Scroll ---
    const fadeElements = document.querySelectorAll('.fade-in');
    if (window.IntersectionObserver) { // Controlla supporto browser
        const fadeInObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target); 
                }
            });
        }, { threshold: 0.1 }); 

        fadeElements.forEach(el => fadeInObserver.observe(el));
    } else { // Fallback per browser senza IntersectionObserver
        fadeElements.forEach(el => el.classList.add('visible'));
    }


    // --- Pulsante Scroll to Top ---
    const scrollToTopBtn = document.getElementById('scrollToTopBtn');
    if (scrollToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) { 
                scrollToTopBtn.classList.add('show');
            } else {
                scrollToTopBtn.classList.remove('show');
            }
        }, { passive: true }); // Migliora performance scroll
        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // --- Validazione Form Contatti ---
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault(); 
            let isValid = true;

            function setError(fieldId, message) {
                const field = document.getElementById(fieldId);
                const errorElement = document.getElementById(fieldId + 'Error');
                if (field && errorElement) {
                    errorElement.textContent = message;
                    field.classList.add('error');
                    field.setAttribute('aria-invalid', 'true');
                    field.setAttribute('aria-describedby', fieldId + 'Error');
                }
                isValid = false;
            }
            function clearError(fieldId) {
                const field = document.getElementById(fieldId);
                const errorElement = document.getElementById(fieldId + 'Error');
                 if (field && errorElement) {
                    errorElement.textContent = '';
                    field.classList.remove('error');
                    field.removeAttribute('aria-invalid');
                    field.removeAttribute('aria-describedby');
                }
            }

            const fieldsToValidate = ['name', 'email', 'subject', 'message'];
            fieldsToValidate.forEach(id => clearError(id));

            const nameField = document.getElementById('name');
            if (nameField.value.trim() === '') {
                setError('name', 'Il nome è obbligatorio.');
            }

            const emailField = document.getElementById('email');
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (emailField.value.trim() === '') {
                setError('email', "L'email è obbligatoria.");
            } else if (!emailPattern.test(emailField.value.trim())) {
                setError('email', "Inserisci un'email valida.");
            }

            const subjectField = document.getElementById('subject');
            if (subjectField.value.trim() === '') {
                setError('subject', "L'oggetto è obbligatorio.");
            }

            const messageField = document.getElementById('message');
            if (messageField.value.trim() === '') {
                setError('message', 'Il messaggio è obbligatorio.');
            }

            const successMessageDiv = document.getElementById('formSuccessMessage');
            if (isValid) {
                console.log('Form valido, pronto per l\'invio!');
                // Qui normalmente invieresti i dati al server (es. con fetch API)
                // fetch('/api/contact', { method: 'POST', body: new FormData(contactForm) })
                // .then(response => response.json())
                // .then(data => { ... })
                // .catch(error => { ... });

                if (successMessageDiv) {
                    successMessageDiv.style.display = 'block';
                    successMessageDiv.setAttribute('aria-live', 'assertive');
                }
                contactForm.reset(); 
                fieldsToValidate.forEach(id => clearError(id)); // Pulisce anche gli attributi aria

                setTimeout(() => {
                    if (successMessageDiv) {
                        successMessageDiv.style.display = 'none';
                        successMessageDiv.removeAttribute('aria-live');
                    }
                }, 5000);
            } else {
                console.log('Form non valido.');
                 if (successMessageDiv) successMessageDiv.style.display = 'none';
                 // Focus sul primo campo con errore
                 const firstErrorField = contactForm.querySelector('.error');
                 if (firstErrorField) {
                    firstErrorField.focus();
                 }
            }
        });
    }

    // --- Smooth scroll per ancore interne (es. prodotti.html#labbra) ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href.length > 1) { // Deve essere più di un semplice '#'
                try {
                    const targetElement = document.querySelector(href);
                    if (targetElement) {
                        e.preventDefault();
                        targetElement.scrollIntoView({
                            behavior: 'smooth'
                        });
                        // Opzionale: aggiorna l'URL senza ricaricare la pagina (per ancore visibili)
                        // history.pushState(null, null, href);
                    }
                } catch (err) {
                    console.warn("Errore nello scrollare all'ancora: ", href, err);
                }
            } else if (href === "#") {
                 e.preventDefault(); // Evita il salto alla cima della pagina per link vuoti
            }
        });
    });

});