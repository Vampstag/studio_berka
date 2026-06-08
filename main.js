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
    // --- Premium UI Sound Effect (Web Audio API) ---
    // Inisialisasi Web Audio API untuk efek suara ketukan (click) UI yang elegan
    let uiAudioCtx;
    const playClickSound = () => {
        try {
            if (!uiAudioCtx) uiAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
            if (uiAudioCtx.state === 'suspended') uiAudioCtx.resume();
            
            const osc = uiAudioCtx.createOscillator();
            const gain = uiAudioCtx.createGain();
            
            osc.connect(gain);
            gain.connect(uiAudioCtx.destination);
            
            osc.type = 'sine'; // Suara bulat dan halus
            osc.frequency.setValueAtTime(600, uiAudioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(100, uiAudioCtx.currentTime + 0.05); // Pitch drop sangat cepat
            
            gain.gain.setValueAtTime(0.15, uiAudioCtx.currentTime); // Volume rendah (15%) agar terasa elegan
            gain.gain.exponentialRampToValueAtTime(0.001, uiAudioCtx.currentTime + 0.05); // Fade out cepat
            
            osc.start();
            osc.stop(uiAudioCtx.currentTime + 0.05); // Durasi sangat singkat (50ms)
        } catch (e) {
            // Abaikan jika browser lawas tidak mendukung
        }
    };

    // Suara saat elemen disorot (Hover Tick) - Sangat pelan dan singkat
    const playHoverSound = () => {
        try {
            if (!uiAudioCtx) uiAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
            if (uiAudioCtx.state === 'suspended') uiAudioCtx.resume();
            
            const osc = uiAudioCtx.createOscillator();
            const gain = uiAudioCtx.createGain();
            
            osc.connect(gain);
            gain.connect(uiAudioCtx.destination);
            
            osc.type = 'sine';
            osc.frequency.setValueAtTime(800, uiAudioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(300, uiAudioCtx.currentTime + 0.03); 
            
            gain.gain.setValueAtTime(0.015, uiAudioCtx.currentTime); // Sangat pelan (1.5% volume) agar tidak mengganggu
            gain.gain.exponentialRampToValueAtTime(0.001, uiAudioCtx.currentTime + 0.03); 
            
            osc.start();
            osc.stop(uiAudioCtx.currentTime + 0.03); // Sangat singkat
        } catch (e) {}
    };

    // Suara Notifikasi Sukses (Crystal Chime) - Bernada tinggi dengan gema panjang
    const playSuccessSound = () => {
        try {
            if (!uiAudioCtx) uiAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
            if (uiAudioCtx.state === 'suspended') uiAudioCtx.resume();
            
            const osc = uiAudioCtx.createOscillator();
            const gain = uiAudioCtx.createGain();
            
            osc.connect(gain);
            gain.connect(uiAudioCtx.destination);
            
            osc.type = 'triangle'; // Karakter suara marimba/bell kristal
            osc.frequency.setValueAtTime(900, uiAudioCtx.currentTime); // Nada tinggi cerah
            
            gain.gain.setValueAtTime(0.08, uiAudioCtx.currentTime); // Volume sedang-pelan (8%)
            gain.gain.exponentialRampToValueAtTime(0.001, uiAudioCtx.currentTime + 0.8); // Gema (sustain) memudar pelan
            
            osc.start();
            osc.stop(uiAudioCtx.currentTime + 0.8);
        } catch (e) {}
    };

    // Suara Hembusan Angin (Swoosh) saat Preloader Terbuka
    const playSwooshSound = () => {
        try {
            if (!uiAudioCtx) uiAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
            if (uiAudioCtx.state === 'suspended') uiAudioCtx.resume();
            
            const bufferSize = uiAudioCtx.sampleRate * 1.5; // Durasi 1.5 detik
            const buffer = uiAudioCtx.createBuffer(1, bufferSize, uiAudioCtx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = Math.random() * 2 - 1; // Membuat white noise (statis) dasar
            }
            
            const noise = uiAudioCtx.createBufferSource();
            noise.buffer = buffer;
            
            const filter = uiAudioCtx.createBiquadFilter();
            filter.type = 'lowpass'; // Memotong frekuensi tinggi agar terdengar seperti angin (bukan statis TV)
            filter.frequency.setValueAtTime(100, uiAudioCtx.currentTime);
            filter.frequency.exponentialRampToValueAtTime(1000, uiAudioCtx.currentTime + 0.5); // Frekuensi angin membesar
            filter.frequency.exponentialRampToValueAtTime(100, uiAudioCtx.currentTime + 1.2); // Frekuensi angin mereda
            
            const gain = uiAudioCtx.createGain();
            gain.gain.setValueAtTime(0, uiAudioCtx.currentTime);
            gain.gain.linearRampToValueAtTime(0.08, uiAudioCtx.currentTime + 0.5); // Volume perlahan naik ke 8%
            gain.gain.linearRampToValueAtTime(0, uiAudioCtx.currentTime + 1.2); // Fade out perlahan
            
            noise.connect(filter);
            filter.connect(gain);
            gain.connect(uiAudioCtx.destination);
            
            noise.start();
        } catch (e) {}
    };

    // Suara Menutup Panel (Close Bloop) - Nada lebih rendah dan turun
    const playCloseSound = () => {
        try {
            if (!uiAudioCtx) uiAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
            if (uiAudioCtx.state === 'suspended') uiAudioCtx.resume();
            
            const osc = uiAudioCtx.createOscillator();
            const gain = uiAudioCtx.createGain();
            
            osc.connect(gain);
            gain.connect(uiAudioCtx.destination);
            
            osc.type = 'sine'; // Suara bulat
            osc.frequency.setValueAtTime(300, uiAudioCtx.currentTime); // Mulai dari nada lebih rendah dari klik standar
            osc.frequency.exponentialRampToValueAtTime(50, uiAudioCtx.currentTime + 0.08); // Turun dengan cepat ke nada bass
            
            gain.gain.setValueAtTime(0.15, uiAudioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, uiAudioCtx.currentTime + 0.08); 
            
            osc.start();
            osc.stop(uiAudioCtx.currentTime + 0.08); 
        } catch (e) {}
    };

    // Terapkan suara klik ke elemen navigasi
    const navClickElements = document.querySelectorAll('.berka-nav-link, .berka-mobile-link, .logo-link, .dot-link, .berka-burger, .berka-back-to-top, .berka-scroll-indicator');
    navClickElements.forEach(el => {
        el.addEventListener('click', () => {
            playClickSound();
        });
    });

    // Terapkan suara hover (Hover Tick) ke elemen kartu dan tombol interaktif
    const hoverElements = document.querySelectorAll('.bcp-card, .berka-case-cta-btn, .p-tab-btn, .share-btn, .slider_arrow, .berka-scroll-indicator');
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            playHoverSound();
        });
    });

    // --- Cinematic Preloader Animation ---
    const preloader = document.getElementById('berka-preloader');
    const preloaderLogo = document.getElementById('berka-preloader-logo');
    const preloaderCounter = document.getElementById('preloader-counter');
    const preloaderProgress = document.getElementById('preloader-progress');
    
    if (preloader && preloaderLogo) {
        document.body.style.overflow = 'hidden'; // Kunci scroll bawaan
        if (typeof lenis !== 'undefined') lenis.stop(); // Kunci scroll Lenis

        const tl = gsap.timeline();
        const counter = { val: 0 };
        
        tl.to(counter, { val: 100, duration: 1.5, ease: "power3.inOut", onUpdate: () => { if(preloaderCounter) preloaderCounter.innerText = Math.round(counter.val) + '%'; } }, 0)
          .to(preloaderProgress, { width: "100%", duration: 1.5, ease: "power3.inOut" }, 0)
          .to(preloaderLogo, { y: 0, opacity: 1, duration: 1, ease: "power3.out" }, 0.2)
          .to(preloaderCounter, { y: 0, opacity: 1, duration: 1, ease: "power3.out" }, 0.3)
          .to([preloaderLogo, preloaderCounter], { y: -20, opacity: 0, duration: 0.6, ease: "power2.in" }, 1.7)
          .to(preloader, { 
              yPercent: -100, 
              duration: 1.2, 
              ease: "expo.inOut",
              onStart: () => {
                  playSwooshSound(); // Mainkan suara hembusan angin saat tirai preloader mulai naik
              }
          }, 1.8)
          .from('.berka-hero-large-logo', { y: 60, opacity: 0, duration: 1.5, ease: "power3.out" }, 2.0)
          .from('.hero-center-desc', { y: 30, opacity: 0, duration: 1.5, ease: "power3.out" }, 2.4)
          .from('.berka-scroll-indicator', { opacity: 0, duration: 1, ease: "power2.out" }, 2.6)
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
    const backToTopBtn = document.getElementById('back-to-top');

    // Scroll Effect for Navbar Glassmorphism
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
        
        // Reveal WA Widget on Scroll
        if (waWidget) {
            waWidget.classList.toggle('visible', window.scrollY > 300);
        }
        
        // Reveal Back to Top Button
        if (backToTopBtn) {
            backToTopBtn.classList.toggle('visible', window.scrollY > 500);
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

    // Close Menu on Click Outside (Menutup menu jika klik area di luar menu)
    document.addEventListener('click', (e) => {
        if (mobileMenu.classList.contains('open') && !mobileMenu.contains(e.target) && !burger.contains(e.target)) {
            toggleMenu();
        }
    });

    // Back to Top Click Action
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            if (typeof lenis !== 'undefined') {
                lenis.scrollTo(0, { duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
            } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    }

    // --- Animasi GSAP SplitText Hero H1 ---
    const heroTitle = document.querySelector('.display-1.second._5rem');
    const heroDesc = document.querySelector('.hero-description-smaller');
    
    if (heroTitle && !document.body.classList.contains('error-404')) {
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
            delay: 2.2, // Sinkronisasi alur waktu baru yang lebih gesit
            force3D: true // Akselerasi Hardware (Mencegah patah-patah di HP murah)
        });
        
        if (heroDesc) {
            gsap.from(heroDesc, {
                y: 40,
                opacity: 0,
                duration: 1.2,
                ease: "power4.out",
                delay: 2.5, // Muncul sedikit setelah judul utama
                force3D: true
            });
        }
        
        const heroIllust = document.querySelector('.story-illustration-img');
        if (heroIllust) {
            gsap.from(heroIllust, {
                x: -40,
                opacity: 0,
                duration: 1.5,
                ease: "power3.out",
                delay: 2.3, // Muncul seirama sesaat setelah teks Hero pertama muncul
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
        const delayTime = document.getElementById('berka-preloader') ? 2.2 : 0.5;

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

    // --- Efek Magnetic / Mouse Parallax di Hero (Non-HP) ---
    const heroSection = document.querySelector('.berka-fullscreen-hero');
    const heroLogo = document.querySelector('.berka-hero-large-logo');
    const heroSub = document.querySelector('.berka-hero-subtitle');

    if (heroSection && window.matchMedia("(pointer: fine)").matches) {
        heroSection.addEventListener('mousemove', (e) => {
            // Normalisasi posisi X dan Y menjadi rentang -1 hingga 1
            const x = (e.clientX / window.innerWidth - 0.5) * 2;
            const y = (e.clientY / window.innerHeight - 0.5) * 2;

            // Bergerak berlawanan arah dengan pergerakan kursor (Parallax Illusion)
            gsap.to(heroLogo, { x: x * -20, y: y * -20, duration: 1, ease: "power2.out" });
            gsap.to(heroSub, { x: x * -10, y: y * -10, duration: 1.2, ease: "power2.out" }); // Bergerak lebih lambat dari logo
        });

        heroSection.addEventListener('mouseleave', () => {
            // Memantul kembali ke titik tengah awal saat mouse keluar layar
            gsap.to([heroLogo, heroSub], { x: 0, y: 0, duration: 1.5, ease: "elastic.out(1, 0.3)" });
        });
    }

    // Animasi Smooth Scroll untuk tautan jangkar (Anchor Links)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation(); // Mencegah Webflow JS membajak efek scroll dan mengabaikan offset
            const target = this.getAttribute('href');
            if (target && target !== '#') {
                if (typeof lenis !== 'undefined') {
                    lenis.scrollTo(target, { offset: -140 }); // Jarak aman diperbesar agar nafas lebih lega
                } else {
                    const targetEl = document.querySelector(target);
                    if (targetEl) {
                        window.scrollTo({ top: targetEl.getBoundingClientRect().top + window.scrollY - 140, behavior: 'smooth' });
                    }
                }
            }
        });
    });

    // --- ScrollSpy: Menyorot Tautan Navigasi yang Aktif ---
    const navItems = document.querySelectorAll('a[href^="#"]');
    const sections = [];
    navItems.forEach(link => {
        const targetId = link.getAttribute('href').substring(1);
        if (targetId) {
            const el = document.getElementById(targetId);
            if (el && !sections.includes(el)) sections.push(el);
        }
    });
    
    if (sections.length > 0 && navItems.length > 0) {
        window.addEventListener('scroll', () => {
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.getBoundingClientRect().top + window.scrollY;
                if (window.scrollY >= sectionTop - 200) { // Offset 200px dari atas
                    current = section.getAttribute('id');
                }
            });
            
            navItems.forEach(link => {
                link.classList.remove('active'); // Pastikan Anda memiliki class .active di CSS Anda
                if (current && link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        });
    }

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
    const revealElements = document.querySelectorAll('.service-content-wrapper, .slider.w-slider, .project-info_component, .full-image');
    
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
                force3D: true, // Memastikan animasi ringan di HP
                clearProps: "transform,opacity" // FIX: Menghapus sisa inline style GSAP agar tidak merusak Interaksi Webflow IX2 (Dropdown Layanan)
            }
        );
    });

    // --- Animasi Stagger Masuk untuk Kartu Portofolio (Mencegah tampilan kaku) ---
    const bcpCards = document.querySelectorAll('.bcp-card');
    if (bcpCards.length > 0) {
        gsap.from(bcpCards, {
            scrollTrigger: {
                trigger: ".berka-custom-portfolio",
                start: "top 85%",
                toggleActions: "play none none none"
            },
            y: 40,
            opacity: 0,
            duration: 1,
            stagger: 0.15, // Berurutan 
            ease: "power3.out",
            force3D: true,
            clearProps: "transform"
        });
    }

    // --- Animasi Stagger Masuk untuk List Proses Kami (Langkah 1-6) ---
    const stepCards = document.querySelectorAll('.steps-card');
    if (stepCards.length > 0) {
        gsap.from(stepCards, {
            scrollTrigger: {
                trigger: ".steps-cards",
                start: "top 80%",
                toggleActions: "play none none none"
            },
            x: 30, // Meluncur halus dari arah kanan (karena ada video di sebelah kiri)
            opacity: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: "power2.out",
            force3D: true,
            clearProps: "transform"
        });
    }

    // --- Animasi Premium Masuk 1-per-1 (Non-3D) untuk Kartu Prinsip Kami ---
    const principleCardsAnim = document.querySelectorAll('.berka-principle-card');
    if (principleCardsAnim.length > 0) {
        gsap.from(principleCardsAnim, {
            scrollTrigger: {
                trigger: ".berka-principles-grid",
                start: "top 85%", // Mulai saat elemen masuk sedikit ke layar agar efek cascade terlihat jelas
                toggleActions: "play none none none"
            },
            y: 60, // Meluncur lembut dari bawah
            opacity: 0,
            duration: 1, // Durasi elegan
            stagger: 0.15, // Jeda yang tegas agar muncul satu per satu berurutan (cascade)
            ease: "expo.out", // Kurva deselerasi yang sangat mulus dan premium di akhir gerakan
            force3D: true,
            clearProps: "transform" // Melepaskan gaya agar efek CSS Hover berfungsi lancar
        });
    }

    // --- Animasi Premium Masuk 3D untuk Payment Cards ---
    const paymentCardsAnim = document.querySelectorAll('.payment-card');
    if (paymentCardsAnim.length > 0) {
        gsap.from(paymentCardsAnim, {
            scrollTrigger: {
                trigger: ".berka-payment-section",
                start: "top 75%",
                toggleActions: "play none none none"
            },
            y: 100,
            opacity: 0,
            rotationX: -10, // Efek tilt lipatan 3D dari bawah 
            transformOrigin: "bottom center",
            duration: 1.2,
            stagger: 0.2, // Muncul berurutan dengan elegan
            ease: "power3.out",
            force3D: true,
            clearProps: "transform" // Bersihkan sisa animasi agar fitur tilt mousemove tidak bentrok
        });
    }

    // --- Animasi Masuk Elegan untuk List Termin Pembayaran ---
    const paymentLists = document.querySelectorAll('.berka-payment-list');
    paymentLists.forEach(list => {
        const items = list.querySelectorAll('.berka-payment-item');
        if (items.length > 0) {
            gsap.from(items, {
                scrollTrigger: {
                    trigger: list,
                    start: "top 85%",
                    toggleActions: "play none none none"
                },
                y: 20, // Muncul normal dari bawah
                opacity: 0,
                duration: 0.8, // Sedikit dipercepat agar terasa natural
                stagger: 0.15, // Muncul berurutan satu per satu
                ease: "power2.out", // Kurva animasi standar yang lebih santai
                force3D: true,
                clearProps: "transform"
            });
        }
    });

    // --- Premium Footer Overlap Parallax ---
    const footerReveal = document.querySelector('.footer');
    if (footerReveal) {
        const prevSection = footerReveal.previousElementSibling;
        if (prevSection) {
            gsap.fromTo(prevSection, 
                { y: 0 }, 
                {
                    y: 150, // Section sebelumnya turun perlahan menciptakan ilusi tertutup oleh footer
                    ease: "none",
                    scrollTrigger: {
                        trigger: footerReveal,
                        start: "top bottom", // Mulai saat atap footer terlihat
                        end: "bottom bottom", // Berakhir saat scroll halaman mentok
                        scrub: true 
                    }
                }
            );
        }
    }

    // --- Animasi Premium 3D Flip untuk Ratecard ---
    const rcCards = document.querySelectorAll('.rc-card');
    if (rcCards.length > 0) {
        rcCards.forEach((card) => {
            gsap.from(card, {
                scrollTrigger: {
                    trigger: card,
                    start: "top 85%", // Mulai animasi saat SETIAP KARTU masuk ke layar (bukan menunggu section-nya)
                    toggleActions: "play none none none"
                },
                y: 80,
                opacity: 0,
                rotationX: -15, // Efek kartu terlipat dari bawah ke atas (3D)
                transformOrigin: "bottom center",
                duration: 1.2,
                ease: "power3.out",
                force3D: true,
                clearProps: "transform" // Membersihkan sisa animasi inline GSAP agar bersih
            });
        });
    }

    // --- Accordion Interaktif untuk Ratecard ---
    const rcToggles = document.querySelectorAll('.rc-toggle');
    rcToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const card = toggle.closest('.rc-card');
            const isOpen = card.classList.contains('is-open');
            
            if (isOpen) {
                playCloseSound(); // Memainkan nada rendah/turun jika panel sedang ditutup
            } else {
                playClickSound(); // Memainkan ketukan tinggi/standar jika panel baru dibuka
            }
            
            // Menutup seluruh kartu yang sedang terbuka
            document.querySelectorAll('.rc-card').forEach(c => {
                c.classList.remove('is-open');
            });

            // Membuka kartu yang di-klik jika sebelumnya tertutup
            if (!isOpen) {
                card.classList.add('is-open');
                
                // UX Tambahan: Scroll otomatis agar kartu yang baru dibuka berada nyaman di layar
                setTimeout(() => {
                    const yOffset = card.getBoundingClientRect().top + window.scrollY - 140; // 140px offset yang lebih lega agar tak tertutup navbar
                    if (typeof lenis !== 'undefined') {
                        lenis.scrollTo(yOffset, { duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
                    } else {
                        window.scrollTo({ top: yOffset, behavior: 'smooth' });
                    }
                }, 400); // Diperlambat ke 400ms: menunggu kartu lain nyaris selesai menutup, sehingga kalkulasi koordinat Y tidak meleset
            }
            
            // Refresh sistem posisi dari GSAP ScrollTrigger
            setTimeout(() => { ScrollTrigger.refresh(); }, 600);
        });
    });

    // --- Interaktif Render vs Realita (Image Comparison Slider) ---
    function initComparisons() {
        const containers = document.querySelectorAll(".img-comp-container");
        containers.forEach(container => {
            const overlay = container.querySelector(".img-comp-overlay");
            const slider = container.querySelector(".img-comp-slider");
            const img = overlay.querySelector("img");
            let clicked = 0;
            let w = container.offsetWidth;
            
            // Menyesuaikan ukuran gambar agar tidak terdistorsi saat overlay mengecil
            function setWidth() {
                w = container.offsetWidth;
                img.style.width = w + "px";
                overlay.style.width = (w / 2) + "px";
                slider.style.left = (w / 2) + "px";
            }
            setWidth();
            window.addEventListener("resize", setWidth);

            // Event Listener (Mouse & Touch)
            slider.addEventListener("mousedown", slideReady);
            window.addEventListener("mouseup", slideFinish);
            slider.addEventListener("touchstart", slideReady, {passive: true});
            window.addEventListener("touchend", slideFinish);

            function slideReady(e) {
                e.preventDefault();
                clicked = 1;
                window.addEventListener("mousemove", slideMove);
                window.addEventListener("touchmove", slideMove, {passive: false});
                if (typeof lenis !== 'undefined') lenis.stop(); // Berhentikan scroll halaman saat sedang nge-drag gambar
            }
            function slideFinish() {
                clicked = 0;
                window.removeEventListener("mousemove", slideMove);
                window.removeEventListener("touchmove", slideMove);
                if (typeof lenis !== 'undefined') lenis.start(); // Kembalikan fungsi scroll
            }
            function slideMove(e) {
                if (clicked === 0) return false;
                let rect = container.getBoundingClientRect();
                let eventPos = e.changedTouches ? e.changedTouches[0] : e;
                let pos = eventPos.clientX - rect.left;
                
                if (pos < 0) pos = 0;
                if (pos > w) pos = w;
                
                overlay.style.width = pos + "px";
                slider.style.left = pos + "px";
            }
        });
    }
    setTimeout(initComparisons, 500); // Beri jeda 0.5 detik agar gambar termuat sempurna sebelum dikalkulasi

    // --- Premium Tabs Logic (Render vs Realita) ---
    const tabBtns = document.querySelectorAll('.p-tab-btn');
    const tabPanes = document.querySelectorAll('.p-tab-pane');
    
    if (tabBtns.length > 0) {
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                tabBtns.forEach(b => b.classList.remove('active'));
                tabPanes.forEach(p => p.classList.remove('active'));
                
                btn.classList.add('active');
                const target = document.getElementById(btn.getAttribute('data-target'));
                if (target) target.classList.add('active');
            });
        });
    }

    // --- Inisialisasi GLightbox untuk Galeri ---
    if (typeof GLightbox !== 'undefined') {
        const lightbox = GLightbox({ selector: '.gallery-lightbox', loop: true });
    }

    // --- Premium Copy Link Toast Notification ---
    const copyBtns = document.querySelectorAll('.share-btn.link');
    if (copyBtns.length > 0) {
        // Membangun elemen Toast secara dinamis
        const toast = document.createElement('div');
        toast.className = 'berka-toast';
        toast.innerHTML = `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg> Tautan proyek berhasil disalin!`;
        document.body.appendChild(toast);

        let toastTimeout;
        copyBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                navigator.clipboard.writeText(window.location.href).then(() => {
                    playSuccessSound(); // Memainkan nada lonceng kristal
                    // Memunculkan toast
                    toast.classList.add('show');
                    clearTimeout(toastTimeout);
                    // Menyembunyikan toast secara otomatis setelah 3 detik
                    toastTimeout = setTimeout(() => {
                        toast.classList.remove('show');
                    }, 3000);
                });
            });
        });
    }

    // --- Premium Background Music Player ---
    const bgMusic = document.getElementById('berka-bgm');
    const musicToggle = document.getElementById('berka-music-toggle');

    if (bgMusic && musicToggle) {
        // Membangun elemen Toast khusus Musik
        const musicToast = document.createElement('div');
        musicToast.className = 'berka-toast';
        document.body.appendChild(musicToast);
        let musicToastTimeout;

        // --- 1. Memori Status Musik Lintas Halaman (Session Storage) ---
        const savedTime = sessionStorage.getItem('berkaBgMusicTime');
        const isPlaying = sessionStorage.getItem('berkaBgMusicPlaying') === 'true';

        if (savedTime) {
            bgMusic.currentTime = parseFloat(savedTime); // Kembalikan ke detik terakhir lagu
        }

        if (isPlaying) {
            bgMusic.volume = 0; // Mulai dari 0 untuk fade-in otomatis
            bgMusic.play().then(() => {
                musicToggle.classList.add('playing');
                gsap.to(bgMusic, { volume: 0.15, duration: 2, ease: "power2.inOut" }); // Fade-in saat pindah halaman
            }).catch(() => {
                // Jika browser memblokir autoplay di halaman baru, reset ke pause
                sessionStorage.setItem('berkaBgMusicPlaying', 'false');
                bgMusic.volume = 0.15;
            });
        } else {
            bgMusic.volume = 0.15;
        }

        // Simpan waktu pemutaran setiap 1 detik
        setInterval(() => {
            if (!bgMusic.paused) {
                sessionStorage.setItem('berkaBgMusicTime', bgMusic.currentTime);
            }
        }, 1000);

        // Simpan status pasti tepat sebelum pengunjung pindah halaman
        window.addEventListener('beforeunload', () => {
            sessionStorage.setItem('berkaBgMusicTime', bgMusic.currentTime);
            sessionStorage.setItem('berkaBgMusicPlaying', !bgMusic.paused);
        });

        // --- 2. Efek Fade-in & Fade-out Playback ---
        const toggleMusic = () => {
            if (bgMusic.paused) {
                bgMusic.volume = 0; // Persiapan Fade-in
                bgMusic.play();
                musicToggle.classList.add('playing');
                gsap.killTweensOf(bgMusic); // Hentikan transisi volume sebelumnya jika ada
                gsap.to(bgMusic, { volume: 0.15, duration: 1.5, ease: "power2.inOut" }); // Fade-in 1.5 detik
                sessionStorage.setItem('berkaBgMusicPlaying', 'true');

                // Munculkan toast notifikasi dengan ikon nada
                musicToast.innerHTML = `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg> Ambience on. Take your time.`;
                musicToast.classList.add('show');
                clearTimeout(musicToastTimeout);
                musicToastTimeout = setTimeout(() => { musicToast.classList.remove('show'); }, 3000);
            } else {
                musicToggle.classList.remove('playing');
                gsap.killTweensOf(bgMusic);
                // Efek Fade-out mewah sebelum benar-benar berhenti
                gsap.to(bgMusic, { 
                    volume: 0, 
                    duration: 1, 
                    ease: "power2.inOut",
                    onComplete: () => {
                        bgMusic.pause(); // Lagu benar-benar berhenti setelah suaranya habis
                        sessionStorage.setItem('berkaBgMusicPlaying', 'false');
                    }
                });

                // Munculkan toast notifikasi dengan ikon senyap (mute)
                musicToast.innerHTML = `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg> Silence, then.`;
                musicToast.classList.add('show');
                clearTimeout(musicToastTimeout);
                musicToastTimeout = setTimeout(() => { musicToast.classList.remove('show'); }, 3000);
            }
        };

        musicToggle.addEventListener('click', (e) => {
            e.stopPropagation(); // Mencegah trigger dari event listener window
            toggleMusic();
        });
    }

    // --- Premium UX Utility: Reading Progress Bar ---
    // Fitur ini hanya menyala di halaman Studi Kasus Proyek
    if (document.body.classList.contains('project-page')) {
        const progressBar = document.createElement('div');
        progressBar.className = 'berka-reading-progress';
        document.body.appendChild(progressBar); // Suntikkan garis ke dalam HTML

        const updateProgress = () => {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            if (scrollHeight > 0) {
                const progress = (scrollTop / scrollHeight) * 100;
                progressBar.style.width = progress + '%';
            }
        };

        window.addEventListener('scroll', updateProgress, { passive: true });
        updateProgress(); // Inisialisasi kalkulasi saat halaman pertama kali dimuat
    }

    // --- Premium 3D Magnetic Tilt & Spotlight Glow untuk Payment Cards ---
    // Interaksi tingkat tinggi ala Awwwards khusus pengguna desktop
    const paymentCards = document.querySelectorAll('.payment-card');
    if (paymentCards.length > 0 && window.matchMedia("(pointer: fine)").matches) {
        paymentCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                // Set variabel CSS dinamis untuk mengatur posisi cahaya senter kaca
                card.style.setProperty('--mouse-x', `${x}px`);
                card.style.setProperty('--mouse-y', `${y}px`);

                // Kalkulasi sudut kemiringan (tilt) berlawanan dengan arah pergerakan mouse
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = ((y - centerY) / centerY) * -6; // Maksimal miring 6 derajat
                const rotateY = ((x - centerX) / centerX) * 6;

                gsap.to(card, {
                    rotationX: rotateX,
                    rotationY: rotateY,
                    duration: 0.4,
                    ease: "power2.out",
                    transformPerspective: 1000 // Menyalakan ruang dimensi 3D mutlak
                });
            });

            card.addEventListener('mouseleave', () => {
                // Kembalikan posisi kartu menjadi rata dengan efek pantulan karet (elastic recoil)
                gsap.to(card, {
                    rotationX: 0,
                    rotationY: 0,
                    duration: 0.8,
                    ease: "elastic.out(1, 0.4)" 
                });
            });
        });
    }

    // --- Smart Auto-Scroll & Tap Support untuk Dropdown Layanan Kami ---
    const serviceWrappers = document.querySelectorAll('.service-content-wrapper');
    let hoverScrollTimeout; // Variabel untuk mencegah scroll liar (glitch)

    serviceWrappers.forEach(wrapper => {
        // --- 1. Auto-Scroll saat diketuk/diklik (Mobile & Layar Sentuh) ---
        wrapper.addEventListener('click', () => {
            wrapper.classList.toggle('is-open');
            serviceWrappers.forEach(w => {
                if (w !== wrapper) w.classList.remove('is-open'); // Menutup kartu lain secara otomatis
            });

            // Gulir layar halus setelah kartu mulai terbuka
            if (wrapper.classList.contains('is-open')) {
                setTimeout(() => {
                    const yOffset = wrapper.getBoundingClientRect().top + window.scrollY - 140; // Offset 140px untuk menghindari tertutup Navbar
                    if (typeof lenis !== 'undefined') {
                        lenis.scrollTo(yOffset, { duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
                    } else {
                        window.scrollTo({ top: yOffset, behavior: 'smooth' });
                    }
                }, 300);
            }
        });

        // --- 2. Auto-Scroll Cerdas saat disorot/hover (Desktop) ---
        if (window.matchMedia("(pointer: fine)").matches) {
            wrapper.addEventListener('mouseenter', () => {
                clearTimeout(hoverScrollTimeout);
                // Beri jeda 300ms. Jika pengunjung hanya tak sengaja lewat, scroll batal.
                // Jika ia diam untuk membaca, layar otomatis menyesuaikan presisi.
                hoverScrollTimeout = setTimeout(() => {
                    const yOffset = wrapper.getBoundingClientRect().top + window.scrollY - 140;
                    if (typeof lenis !== 'undefined') {
                        lenis.scrollTo(yOffset, { duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
                    } else {
                        window.scrollTo({ top: yOffset, behavior: 'smooth' });
                    }
                }, 300);
            });

            wrapper.addEventListener('mouseleave', () => {
                clearTimeout(hoverScrollTimeout); // Membatalkan perintah scroll jika kursor pergi
            });
        }
    });

});