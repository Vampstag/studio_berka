// Inisialisasi Lenis Smooth Scroll
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true, // Aktifkan smooth scroll untuk Mouse (Desktop)
    smoothTouch: false, // Matikan untuk Touch (Mobile) agar lebih ringan, browser HP sudah punya native scroll yang optimal
});
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => { lenis.raf(time * 1000); });
gsap.ticker.lagSmoothing(0);

document.addEventListener('DOMContentLoaded', () => {
    // --- Cinematic Preloader Animation ---
    const preloader = document.getElementById('berka-preloader');
    const preloaderLogo = document.getElementById('berka-preloader-logo');
    
    if (preloader && preloaderLogo) {
        document.body.style.overflow = 'hidden'; // Kunci scroll bawaan
        if (typeof lenis !== 'undefined') lenis.stop(); // Kunci scroll Lenis

        const tl = gsap.timeline();
        tl.to(preloaderLogo, { opacity: 1, duration: 1, ease: "power2.out", delay: 0.2 })
          .to(preloaderLogo, { scale: 1.05, duration: 1, ease: "power2.out" }, "-=0.5")
          .to(preloader, { yPercent: -100, duration: 1.2, ease: "expo.inOut" }, "+=0.3")
          .call(() => {
              document.body.style.overflow = '';
              if (typeof lenis !== 'undefined') lenis.start(); // Kembalikan fungsionalitas scroll
              preloader.style.display = 'none';
          });
    }

    const navbar = document.getElementById('berka-navbar');
    const burger = document.getElementById('berka-burger');
    const mobileMenu = document.getElementById('berka-mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-close');
    const waWidget = document.querySelector('.berka-wa-widget');

    // Scroll Effect for Navbar Glassmorphism
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Reveal WA Widget on Scroll
        if (waWidget) {
            if (window.scrollY > 300) {
                waWidget.classList.add('visible');
            } else {
                waWidget.classList.remove('visible');
            }
        }
    });

    // Toggle Mobile Menu
    function toggleMenu() {
        const isOpen = burger.classList.toggle('open');
        mobileMenu.classList.toggle('open');
        burger.setAttribute('aria-expanded', isOpen);
        if (typeof lenis !== 'undefined') {
            if (isOpen) lenis.stop(); // Kunci scroll Lenis saat menu terbuka
            else lenis.start();
        } else {
            document.body.style.overflow = isOpen ? 'hidden' : '';
        }
    }

    burger.addEventListener('click', toggleMenu);

    // Close Menu on Link Click
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileMenu.classList.contains('open')) {
                toggleMenu();
            }
        });
    });

    // --- Animasi GSAP SplitText Hero H1 ---
    const heroTitle = document.querySelector('.display-1.second._5rem');
    const heroDesc = document.querySelector('.hero-description-smaller');
    
    if (heroTitle) {
        gsap.set(heroTitle, { visibility: 'visible' });
        
        // Memecah berdasarkan kata saja agar tidak merusak native line-height & align justify
        const split = new SplitText(heroTitle, { type: "words" });
        
        gsap.from(split.words, {
            y: 80,
            opacity: 0,
            rotation: 3,
            duration: 1.2,
            stagger: 0.03,
            ease: "power4.out",
            delay: 2.5, // Waktu tunda agar sinkron dengan terbukanya Cinematic Preloader
            force3D: true // Akselerasi Hardware (Mencegah patah-patah di HP murah)
        });
        
        if (heroDesc) {
            gsap.from(heroDesc, {
                y: 40,
                opacity: 0,
                duration: 1.2,
                ease: "power4.out",
                delay: 2.8, // Muncul sedikit setelah judul utama
                force3D: true
            });
        }
    }

    // --- Animasi Hero untuk template.html ---
    const templateTitle = document.querySelector('.heading-style-h1');
    if (templateTitle) {
        const templateDesc = document.querySelector('.project-details_description p');
        const templateInfo = document.querySelector('.project-details_info');
        const templateVisual = document.querySelector('.project-details_visual');

        // Memecah teks judul (SplitText) agar bisa dianimasikan per karakter
        const splitTemplate = new SplitText(templateTitle, { type: "words,chars" });

        // Cek jika preloader ada di halaman, beri delay lebih lama. Jika tidak ada, jalankan lebih cepat
        const delayTime = document.getElementById('berka-preloader') ? 2.5 : 0.5;

        const tl = gsap.timeline({ delay: delayTime });
        tl.from(splitTemplate.chars, {
            y: 40,
            opacity: 0,
            rotationX: -30,
            duration: 1,
            stagger: 0.02,
            ease: "power4.out",
            force3D: true
        })
        .from([templateDesc, templateInfo], {
            y: 30,
            opacity: 0,
            duration: 1,
            stagger: 0.15,
            ease: "power3.out"
        }, "-=0.6") // Animasi info berjalan saat huruf judul hampir selesai
        .from(templateVisual, {
            y: 40,
            opacity: 0,
            duration: 1.2,
            ease: "power3.out"
        }, "-=0.8");
    }

    // --- Animasi Magnetic Hover untuk Widget WA ---
    // Efek ini hanya dijalankan pada perangkat dengan kursor (Desktop/Laptop)
    if (waWidget && window.matchMedia("(pointer: fine)").matches) { 
        waWidget.addEventListener('mousemove', (e) => {
            const rect = waWidget.getBoundingClientRect();
            // Menghitung jarak kursor dari titik tengah tombol
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            gsap.to(waWidget, {
                x: x * 0.4, // Intensitas tarikan magnet (semakin besar semakin jauh tertarik)
                y: y * 0.4,
                duration: 0.4,
                ease: "power2.out"
            });
        });

        waWidget.addEventListener('mouseleave', () => {
            // Memantul kembali ke posisi semula
            gsap.to(waWidget, {
                x: 0,
                y: 0,
                duration: 0.8,
                ease: "elastic.out(1, 0.4)" 
            });
        });
    }

    // --- Animasi Parallax Lembut pada Video Hero ---
    const heroVideo = document.querySelector('.bg-video');
    if (heroVideo) {
        gsap.to(heroVideo, {
            yPercent: 30, // Video akan tertinggal/turun perlahan menciptakan efek 3D
            ease: "none",
            scrollTrigger: {
                trigger: ".top-logo",
                start: "top top",
                end: "bottom top",
                scrub: true // Animasi mengikuti kecepatan scroll pengguna (Lenis)
            }
        });
    }

    // Animasi Smooth Scroll untuk tautan jangkar (Anchor Links)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = this.getAttribute('href');
            if (target && target !== '#') lenis.scrollTo(target);
        });
    });

    // --- UX/Performance: Pause video saat tidak di layar ---
    const videos = document.querySelectorAll('video');
    if (videos.length > 0 && 'IntersectionObserver' in window) {
        const videoObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.play().catch(e => console.log("Video auto-play prevented:", e));
                } else {
                    entry.target.pause();
                }
            });
        }, { threshold: 0.1 });

        videos.forEach(video => {
            videoObserver.observe(video);
        });
    }

    // --- Tambahan UX: Animasi Scroll Reveal ---
    // Membuat elemen-elemen card muncul perlahan dari bawah saat di-scroll
    gsap.registerPlugin(ScrollTrigger);
    
    // Memilih elemen-elemen yang ingin diberi efek masuk (Reveal)
    const revealElements = document.querySelectorAll('.benefit-card-2, .service-content-wrapper, .ratecard_block, .slider.w-slider, .project-info_component, .full-image');
    
    revealElements.forEach((el) => {
        gsap.fromTo(el, 
            { opacity: 0, y: 40 }, // State awal: transparan dan sedikit turun
            {
                opacity: 1, 
                y: 0,
                duration: 0.8,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: el,
                    start: "top 85%", // Mulai animasi saat elemen menyentuh 85% layar dari atas
                    toggleActions: "play none none none" // Mainkan hanya sekali
                },
                force3D: true // Memastikan animasi ringan di HP
            }
        );
    });
});