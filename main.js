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
        
        const heroIllust = document.querySelector('.story-illustration-img');
        if (heroIllust) {
            gsap.from(heroIllust, {
                x: -40,
                opacity: 0,
                duration: 1.5,
                ease: "power3.out",
                delay: 2.6, // Muncul seirama sesaat setelah teks Hero pertama muncul
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
    const revealElements = document.querySelectorAll('.service-content-wrapper, .ratecard_block, .slider.w-slider, .project-info_component, .full-image, .payment-card');
    
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

    // --- Animasi Premium 3D Flip untuk Ratecard ---
    const rcCards = document.querySelectorAll('.rc-card');
    if (rcCards.length > 0) {
        gsap.from(rcCards, {
            scrollTrigger: {
                trigger: ".berka-ratecard-section",
                start: "top 75%", // Mulai animasi saat judul ratecard masuk ke layar
                toggleActions: "play none none none"
            },
            y: 80,
            opacity: 0,
            rotationX: -15, // Efek kartu terlipat dari bawah ke atas (3D)
            transformOrigin: "bottom center",
            duration: 1.2,
            stagger: 0.15, // Muncul beruntun satu per satu
            ease: "power3.out",
            force3D: true,
            clearProps: "transform" // Membersihkan sisa animasi inline GSAP agar bersih
        });
    }

    // --- Accordion Interaktif untuk Ratecard ---
    const rcToggles = document.querySelectorAll('.rc-toggle');
    rcToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const card = toggle.closest('.rc-card');
            const isOpen = card.classList.contains('is-open');
            
            // Menutup seluruh kartu yang sedang terbuka
            document.querySelectorAll('.rc-card').forEach(c => {
                c.classList.remove('is-open');
            });

            // Membuka kartu yang di-klik jika sebelumnya tertutup
            if (!isOpen) {
                card.classList.add('is-open');
                
                // UX Tambahan: Scroll otomatis agar kartu yang baru dibuka berada nyaman di layar
                setTimeout(() => {
                    const yOffset = card.getBoundingClientRect().top + window.scrollY - 120; // 120px offset untuk header navbar
                    if (typeof lenis !== 'undefined') {
                        lenis.scrollTo(yOffset, { duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
                    } else {
                        window.scrollTo({ top: yOffset, behavior: 'smooth' });
                    }
                }, 300); // Eksekusi persis ketika animasi kartu terbuka sedang memantul
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
        bgMusic.volume = 0.4; // Volume elegan (40%) agar tidak mengagetkan
        let isUserInteracted = false;

        const toggleMusic = () => {
            if (bgMusic.paused) {
                bgMusic.play();
                musicToggle.classList.add('playing');
            } else {
                bgMusic.pause();
                musicToggle.classList.remove('playing');
            }
        };

        musicToggle.addEventListener('click', (e) => {
            e.stopPropagation(); // Mencegah trigger dari event listener window
            isUserInteracted = true; // Tandai bahwa user sengaja mengontrol musik
            toggleMusic();
        });

        // Coba autoplay saat pengguna mulai berinteraksi dengan website
        const autoPlayMusic = () => {
            if (!isUserInteracted && bgMusic.paused) {
                bgMusic.play().then(() => {
                    musicToggle.classList.add('playing');
                    window.removeEventListener('click', autoPlayMusic);
                    window.removeEventListener('scroll', autoPlayMusic);
                    window.removeEventListener('keydown', autoPlayMusic);
                }).catch(() => {
                    // Gagal (kebijakan browser mengharuskan klik), akan dicoba lagi pada interaksi berikutnya
                });
            }
        };

        window.addEventListener('click', autoPlayMusic);
        window.addEventListener('scroll', autoPlayMusic, { passive: true });
        window.addEventListener('keydown', autoPlayMusic);
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

    // --- Premium Marquee Interaction: Melambat Halus saat di-hover ---
    const marqueeTracks = document.querySelectorAll('.marquee-track');
    marqueeTracks.forEach(track => {
        track.addEventListener('mouseenter', () => {
            track.getAnimations().forEach(anim => {
                gsap.to(anim, { playbackRate: 0.15, duration: 0.6, ease: "power2.out" }); // Melambat jadi 15% secara halus
            });
        });
        track.addEventListener('mouseleave', () => {
            track.getAnimations().forEach(anim => {
                gsap.to(anim, { playbackRate: 1, duration: 0.6, ease: "power2.inOut" }); // Kembali ke kecepatan normal
            });
        });
    });
});