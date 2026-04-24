document.addEventListener('DOMContentLoaded', () => {
    // Page Loader
    // const pageLoader = document.getElementById('pageLoader');
    // window.addEventListener('load', () => {
    //     setTimeout(() => {
    //         pageLoader.classList.add('hidden');
    //     }, 1000);
    // });

    // Scroll Progress Bar
    const scrollProgress = document.getElementById('scrollProgress');
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        scrollProgress.style.width = `${scrollPercent}%`;
    });

    // Mouse Follower
    const mouseFollower = document.getElementById('mouseFollower');
    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;
    const speed = 0.1;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        mouseFollower.classList.add('active');
    });

    function animateFollower() {
        followerX += (mouseX - followerX) * speed;
        followerY += (mouseY - followerY) * speed;
        mouseFollower.style.transform = `translate(${followerX}px, ${followerY}px)`;
        requestAnimationFrame(animateFollower);
    }

    animateFollower();

    // Hero Particles
    const heroParticles = document.getElementById('heroParticles');
    function createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.animationDelay = `${Math.random() * 8}s`;
        heroParticles.appendChild(particle);
        setTimeout(() => particle.remove(), 8000);
    }

    for (let i = 0; i < 20; i++) {
        setTimeout(createParticle, i * 200);
    }
    setInterval(createParticle, 400);

    // Navbar Scroll Effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Back to Top Button
    const backToTop = document.getElementById('backToTop');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Stat Counter Animation
    const statNumbers = document.querySelectorAll('.stat-number');
    const animateStats = () => {
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-count'));
            let count = 0;
            const increment = target / 100;
            const updateCount = () => {
                if (count < target) {
                    count += increment;
                    stat.textContent = Math.ceil(count);
                    requestAnimationFrame(updateCount);
                } else {
                    stat.textContent = target;
                }
            };
            const observer = new IntersectionObserver(entries => {
                if (entries[0].isIntersecting) {
                    updateCount();
                    observer.disconnect();
                }
            }, { threshold: 0.5 });
            observer.observe(stat);
        });
    };

    animateStats();

    // Tilt Effect
    const tiltElements = document.querySelectorAll('.tilt-effect');
    tiltElements.forEach(element => {
        element.addEventListener('mousemove', (e) => {
            const rect = element.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect-height / 2;
            const moveX = (e.clientX - centerX) / 20;
            const moveY = (e.clientY - centerY) / 20;
            element.style.transform = `perspective(1000px) rotateX(${moveY}deg) rotateY(${moveX}deg)`;
        });
        element.addEventListener('mouseleave', () => {
            element.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
        });
    });

    // Magnetic Buttons
    const magneticElements = document.querySelectorAll('.magnetic');
    magneticElements.forEach(element => {
        element.addEventListener('mousemove', (e) => {
            const rect = element.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const moveX = (e.clientX - centerX) / 10;
            const moveY = (e.clientY - centerY) / 10;
            element.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });
        element.addEventListener('mouseleave', () => {
            element.style.transform = 'translate(0, 0)';
        });
    });

    // Active Nav Link Highlight
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');
    
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop - 100 && window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === current) {
                link.classList.add('active');
            }
        });
    });
});