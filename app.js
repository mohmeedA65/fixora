/* ==========================================================================
   FIXORA — COMPLETE INTERACTIVE JS WITH DYNAMIC ARIA ACCESSIBILITY (100% QUALITY)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    /* =========================================================
       0. DARK MODE / NIGHT THEME SYSTEM WITH PERSISTENCE
       ========================================================= */
    const themeToggleBtn = document.getElementById('theme-toggle');
    const savedTheme = localStorage.getItem('fixora_theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    function applyTheme(isDark, silent = false) {
        document.body.classList.toggle('dark-mode', isDark);
        if (themeToggleBtn) {
            const icon = themeToggleBtn.querySelector('i');
            if (icon) {
                icon.className = isDark ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
            }
            themeToggleBtn.setAttribute('title', isDark ? 'الوضع النهاري' : 'الوضع الليلي');
        }
        localStorage.setItem('fixora_theme', isDark ? 'dark' : 'light');
        if (!silent && typeof showToast === 'function') {
            showToast(
                isDark ? 'تم تفعيل الوضع الليلي 🌙' : 'تم تفعيل الوضع النهاري ☀️',
                isDark ? 'استمتع بتجربة مريحة للعينين مجهزة للوضع الليلي.' : 'تم العودة للمظهر الفاتح القياسي.',
                'info',
                3000
            );
        }
    }

    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
        applyTheme(true, true);
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const isCurrentlyDark = document.body.classList.contains('dark-mode');
            applyTheme(!isCurrentlyDark);
        });
    }

    /* =========================================================
       1. GLOBAL TOAST NOTIFICATION SYSTEM
       ========================================================= */
    const toastContainer = document.getElementById('toast-container');

    function showToast(title, message, type = 'success', duration = 4000) {
        if (!toastContainer) return;
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.setAttribute('role', 'alert');

        const iconClass = type === 'success' ? 'fa-circle-check' : (type === 'error' ? 'fa-circle-xmark' : 'fa-circle-info');

        toast.innerHTML = `
            <i class="fa-solid ${iconClass} toast-icon" aria-hidden="true"></i>
            <div class="toast-content">
                <strong>${title}</strong>
                <span>${message}</span>
            </div>
        `;

        toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(-30px)';
            toast.style.transition = 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)';
            setTimeout(() => toast.remove(), 350);
        }, duration);
    }

    /* =========================================================
       2. MODAL MANAGER & ACCESSIBILITY FOCUS TRAP
       ========================================================= */
    let lastActiveElement = null;

    function openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            lastActiveElement = document.activeElement;
            modal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
            modal.setAttribute('aria-hidden', 'false');

            // Focus on first input or close button
            const firstFocusable = modal.querySelector('input, select, textarea, button:not(.modal-close)');
            if (firstFocusable) firstFocusable.focus();
        }
    }

    function closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('hidden');
            document.body.style.overflow = '';
            modal.setAttribute('aria-hidden', 'true');

            if (lastActiveElement) {
                lastActiveElement.focus();
            }
        }
    }

    // Close modal triggers
    document.querySelectorAll('[data-close]').forEach(btn => {
        btn.addEventListener('click', () => {
            const modalId = btn.getAttribute('data-close');
            closeModal(modalId);
        });
    });

    // Close on overlay backdrop click
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                closeModal(overlay.id);
            }
        });
    });

    // Close on ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal-overlay:not(.hidden)').forEach(modal => {
                closeModal(modal.id);
            });
        }
    });

    /* =========================================================
       3. NAVIGATION & HEADER SCROLL CONTROLLER
       ========================================================= */
    const header = document.getElementById('header');
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    // Overlay element for mobile menu
    const menuOverlay = document.createElement('div');
    menuOverlay.className = 'overlay';
    menuOverlay.setAttribute('aria-hidden', 'true');
    document.body.appendChild(menuOverlay);

    function toggleMobileMenu(show) {
        const isOpen = show !== undefined ? show : !navMenu.classList.contains('open');
        navMenu.classList.toggle('open', isOpen);
        menuOverlay.classList.toggle('show', isOpen);

        if (menuToggle) {
            menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
            const icon = menuToggle.querySelector('i');
            if (icon) {
                icon.className = isOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
            }
        }
    }

    if (menuToggle) {
        menuToggle.addEventListener('click', () => toggleMobileMenu());
    }
    menuOverlay.addEventListener('click', () => toggleMobileMenu(false));
    navLinks.forEach(link => link.addEventListener('click', () => toggleMobileMenu(false)));

    // Header Shrink & Active Nav Highlight
    function handleScroll() {
        if (header) {
            header.classList.toggle('scrolled', window.scrollY > 60);
        }

        // Back-to-top button state
        const backTop = document.querySelector('.back-to-top');
        if (backTop) {
            backTop.classList.toggle('show', window.scrollY > 450);
        }

        // Active link detection
        let currentSectionId = '';
        sections.forEach(sec => {
            if (window.scrollY >= sec.offsetTop - 200) {
                currentSectionId = sec.id;
            }
        });

        navLinks.forEach(link => {
            const isCurrent = link.getAttribute('href') === '#' + currentSectionId;
            link.classList.toggle('active-link', isCurrent);
            if (isCurrent) {
                link.setAttribute('aria-current', 'page');
            } else {
                link.removeAttribute('aria-current');
            }
        });
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    /* =========================================================
       4. BACK TO TOP BUTTON
       ========================================================= */
    const backTopBtn = document.createElement('button');
    backTopBtn.className = 'back-to-top';
    backTopBtn.setAttribute('aria-label', 'العودة إلى أعلى الصفحة');
    backTopBtn.innerHTML = '<i class="fa-solid fa-chevron-up" aria-hidden="true"></i>';
    document.body.appendChild(backTopBtn);

    backTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    /* =========================================================
       5. INTERACTIVE LIVE SEARCH & FILTERING SYSTEM
       ========================================================= */
    const heroSearchForm = document.getElementById('hero-search-form');
    const searchInput = document.getElementById('search-input');
    const searchCitySelect = document.getElementById('search-city');
    const serviceCards = document.querySelectorAll('#services-grid .service-card');
    const noServicesMsg = document.getElementById('no-services-msg');

    function performSearch() {
        const query = searchInput ? searchInput.value.trim().toLowerCase() : '';
        const selectedCity = searchCitySelect ? searchCitySelect.value : '';

        let visibleCount = 0;

        serviceCards.forEach(card => {
            const serviceName = (card.getAttribute('data-name') || '').toLowerCase();
            const serviceCategory = (card.getAttribute('data-category') || '').toLowerCase();
            const cardText = card.textContent.toLowerCase();

            const matchesQuery = !query || serviceName.includes(query) || serviceCategory.includes(query) || cardText.includes(query);

            if (matchesQuery) {
                card.style.display = '';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });

        if (noServicesMsg) {
            noServicesMsg.classList.toggle('hidden', visibleCount > 0);
        }

        if (selectedCity) {
            filterProvidersByCity(selectedCity);
        }

        if (query || selectedCity) {
            const servicesSec = document.getElementById('services');
            if (servicesSec) {
                window.scrollTo({
                    top: servicesSec.offsetTop - 90,
                    behavior: 'smooth'
                });
            }
            showToast('نتائج البحث', `تم العثور على ${visibleCount} خدمة مطابقة لبحثك`, 'info');
        }
    }

    if (heroSearchForm) {
        heroSearchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            performSearch();
        });
    }

    // Live filter for Services Tabs
    const serviceFilterBtns = document.querySelectorAll('#services-filter .filter-btn');
    serviceFilterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            serviceFilterBtns.forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-selected', 'false');
            });
            btn.classList.add('active');
            btn.setAttribute('aria-selected', 'true');

            const category = btn.getAttribute('data-category');

            let visibleCount = 0;
            serviceCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                if (category === 'all' || cardCategory === category) {
                    card.style.display = '';
                    visibleCount++;
                } else {
                    card.style.display = 'none';
                }
            });

            if (noServicesMsg) {
                noServicesMsg.classList.toggle('hidden', visibleCount > 0);
            }
        });
    });

    // Providers Filter Tabs
    const providerCards = document.querySelectorAll('#providers-grid .provider-card');
    const providerFilterBtns = document.querySelectorAll('#providers-filter .filter-btn');

    function filterProvidersByCity(filterVal) {
        providerFilterBtns.forEach(b => {
            const isActive = b.getAttribute('data-filter') === filterVal;
            b.classList.toggle('active', isActive);
            b.setAttribute('aria-selected', isActive ? 'true' : 'false');
        });

        providerCards.forEach(card => {
            const status = card.getAttribute('data-status');
            const city = card.getAttribute('data-city');

            if (filterVal === 'all') {
                card.style.display = '';
            } else if (filterVal === 'online') {
                card.style.display = status === 'online' ? '' : 'none';
            } else if (city === filterVal) {
                card.style.display = '';
            } else {
                card.style.display = 'none';
            }
        });
    }

    providerFilterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filterVal = btn.getAttribute('data-filter');
            filterProvidersByCity(filterVal);
        });
    });

    // Provider Horizontal Slider Navigation Controls
    const providerSlider = document.getElementById('providers-grid');
    const slidePrevBtn = document.getElementById('slide-prev-providers');
    const slideNextBtn = document.getElementById('slide-next-providers');
    const viewAllProvidersBtn = document.getElementById('view-all-providers-btn');

    if (providerSlider && slidePrevBtn && slideNextBtn) {
        slidePrevBtn.addEventListener('click', () => {
            providerSlider.scrollBy({ left: 360, behavior: 'smooth' });
        });
        slideNextBtn.addEventListener('click', () => {
            providerSlider.scrollBy({ left: -360, behavior: 'smooth' });
        });
    }

    if (viewAllProvidersBtn) {
        viewAllProvidersBtn.addEventListener('click', () => {
            triggerBooking();
        });
    }

    // Footer filter links
    document.querySelectorAll('[data-filter-link]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const category = link.getAttribute('data-filter-link');
            const targetBtn = document.querySelector(`#services-filter .filter-btn[data-category="${category}"]`);
            if (targetBtn) {
                targetBtn.click();
            }
            const servicesSec = document.getElementById('services');
            if (servicesSec) {
                window.scrollTo({
                    top: servicesSec.offsetTop - 90,
                    behavior: 'smooth'
                });
            }
        });
    });

    /* =========================================================
       6. BOOKING / SERVICE REQUEST ENGINE
       ========================================================= */
    const bookingForm = document.getElementById('booking-form');
    const bookingServiceSelect = document.getElementById('booking-service-select');
    const bookingModalTitle = document.getElementById('booking-modal-title');

    function triggerBooking(serviceName = '', providerName = '') {
        if (bookingServiceSelect && serviceName) {
            for (let option of bookingServiceSelect.options) {
                if (option.value.includes(serviceName) || serviceName.includes(option.value)) {
                    option.selected = true;
                    break;
                }
            }
        }

        if (bookingModalTitle) {
            bookingModalTitle.textContent = providerName ? `حجز موعد مع الفني: ${providerName}` : 'طلب خدمة منزلية جديدة';
        }

        const datetimeInput = document.getElementById('booking-datetime');
        if (datetimeInput) {
            const now = new Date();
            now.setDate(now.getDate() + 1);
            now.setHours(10, 0, 0, 0);
            datetimeInput.value = now.toISOString().slice(0, 16);
        }

        openModal('modal-booking');
    }

    const heroReqBtn = document.getElementById('hero-request-btn');
    if (heroReqBtn) {
        heroReqBtn.addEventListener('click', () => triggerBooking());
    }

    document.querySelectorAll('.service-request-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const serviceName = btn.getAttribute('data-service') || '';
            triggerBooking(serviceName);
        });
    });

    document.querySelectorAll('.direct-book-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const card = btn.closest('.provider-card');
            const providerName = card ? card.getAttribute('data-name') : '';
            const job = card ? card.getAttribute('data-job') : '';
            triggerBooking(job, providerName);
        });
    });

    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('booking-name').value;
            const phone = document.getElementById('booking-phone').value;
            const service = bookingServiceSelect.value;
            const city = document.getElementById('booking-city').value;

            closeModal('modal-booking');
            bookingForm.reset();

            showToast(
                'تم تسجيل طلبك بنجاح! 🎉',
                `أهلاً بك يا ${name}، تم استلام طلبك لخدمة (${service}) في ${city}. سيتواصل معك الفني برقم (${phone}) خلال دقائق لتأكيد الموعد.`,
                'success',
                6000
            );
        });
    }

    /* =========================================================
       7. AUTHENTICATION SYSTEM & TAB SWITCHING
       ========================================================= */
    const openLoginBtn = document.getElementById('open-login-btn');
    const openRegisterBtn = document.getElementById('open-register-btn');
    const heroJoinBtn = document.getElementById('hero-join-btn');
    const ctaJoinBtn = document.getElementById('cta-join-btn');
    const authTabBtns = document.querySelectorAll('.auth-tab-btn');
    const authTabContents = document.querySelectorAll('.auth-tab-content');

    function openAuthModal(tabName = 'tab-login') {
        authTabBtns.forEach(b => {
            const isActive = b.getAttribute('data-tab') === tabName;
            b.classList.toggle('active', isActive);
            b.setAttribute('aria-selected', isActive ? 'true' : 'false');
        });
        authTabContents.forEach(c => {
            c.classList.toggle('active', c.id === tabName);
        });
        openModal('modal-auth');
    }

    if (openLoginBtn) openLoginBtn.addEventListener('click', () => openAuthModal('tab-login'));
    if (openRegisterBtn) openRegisterBtn.addEventListener('click', () => openAuthModal('tab-register'));
    if (heroJoinBtn) heroJoinBtn.addEventListener('click', () => openAuthModal('tab-register'));
    if (ctaJoinBtn) ctaJoinBtn.addEventListener('click', () => openAuthModal('tab-register'));

    authTabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');
            authTabBtns.forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-selected', 'false');
            });
            authTabContents.forEach(c => c.classList.remove('active'));
            btn.classList.add('active');
            btn.setAttribute('aria-selected', 'true');
            const targetContent = document.getElementById(targetTab);
            if (targetContent) targetContent.classList.add('active');
        });
    });

    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            closeModal('modal-auth');
            loginForm.reset();
            showToast('تم تسجيل الدخول بنجاح', 'مرحباً بك مجدداً في لوحة تحكم Fixora!', 'success');
        });
    }

    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const type = document.getElementById('reg-account-type').value;
            closeModal('modal-auth');
            registerForm.reset();

            if (type === 'provider') {
                showToast('طلب الانضمام قيد المراجعة 🛠️', 'تم تسجيل بياناتك كفني محترف. سيتم التواصل معك للتحقق من الهوية والأوراق الرسمية وتفعيل الحساب!', 'success', 6000);
            } else {
                showToast('تم إنشاء الحساب بنجاح 🥳', 'مرحباً بك كعميل في منصة Fixora. يمكنك الآن طلب أي خدمة بضمان شامل!', 'success', 5000);
            }
        });
    }

    /* =========================================================
       8. PROVIDER PROFILE MODAL VIEWER
       ========================================================= */
    const viewProfileBtns = document.querySelectorAll('.view-profile-btn');
    let currentModalProviderName = '';
    let currentModalProviderJob = '';

    viewProfileBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const card = btn.closest('.provider-card');
            if (!card) return;

            const name = card.getAttribute('data-name') || 'فني محترف';
            const job = card.getAttribute('data-job') || 'صيانة عامة';
            const rate = card.getAttribute('data-rate') || '4.9';
            const reviews = card.getAttribute('data-reviews') || '300';
            const img = card.getAttribute('data-img') || 'images/provider-1.jpg';
            const exp = card.getAttribute('data-exp') || '5 سنوات';
            const price = card.getAttribute('data-price') || '150 جنيه/زيارة';
            const city = card.getAttribute('data-city') || 'القاهرة';
            const status = card.getAttribute('data-status') === 'online' ? 'متاح الآن 🟢' : 'مشغول حالياً 🔴';

            currentModalProviderName = name;
            currentModalProviderJob = job;

            document.getElementById('prof-modal-img').src = img;
            document.getElementById('prof-modal-name').textContent = name;
            document.getElementById('prof-modal-job').textContent = job;
            document.getElementById('prof-modal-status').textContent = status;
            document.getElementById('prof-modal-status').style.background = card.getAttribute('data-status') === 'online' ? 'var(--secondary)' : '#ef4444';
            document.getElementById('prof-modal-loc').innerHTML = `<i class="fa-solid fa-location-dot" aria-hidden="true"></i> ${city}`;
            document.getElementById('prof-modal-rate').textContent = rate;
            document.getElementById('prof-modal-reviews').textContent = reviews;
            document.getElementById('prof-modal-exp').textContent = exp;
            document.getElementById('prof-modal-price').textContent = price;

            openModal('modal-profile');
        });
    });

    const profBookDirectBtn = document.getElementById('prof-book-direct-btn');
    if (profBookDirectBtn) {
        profBookDirectBtn.addEventListener('click', () => {
            closeModal('modal-profile');
            triggerBooking(currentModalProviderJob, currentModalProviderName);
        });
    }

    /* =========================================================
       9. DYNAMIC REVIEWS & STAR RATING SYSTEM
       ========================================================= */
    const openAddReviewBtn = document.getElementById('open-add-review-btn');
    const reviewForm = document.getElementById('review-form');
    const starPicks = document.querySelectorAll('#star-rating-selector .star-pick');
    const reviewStarInput = document.getElementById('review-star-input');

    if (openAddReviewBtn) {
        openAddReviewBtn.addEventListener('click', () => {
            openModal('modal-review');
        });
    }

    starPicks.forEach(star => {
        star.addEventListener('click', () => {
            const val = parseInt(star.getAttribute('data-value'));
            reviewStarInput.value = val;

            starPicks.forEach(s => {
                const sVal = parseInt(s.getAttribute('data-value'));
                const isActive = sVal <= val;
                s.classList.toggle('active', isActive);
                s.setAttribute('aria-checked', isActive ? 'true' : 'false');
            });
        });
    });

    if (reviewForm) {
        reviewForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('rev-name').value;
            const city = document.getElementById('rev-city').value;
            const comment = document.getElementById('rev-comment').value;
            const starCount = parseInt(reviewStarInput.value) || 5;

            const reviewsGrid = document.getElementById('reviews-grid');
            if (reviewsGrid) {
                const newReviewCard = document.createElement('article');
                newReviewCard.className = 'review-card reveal active';

                let starsHtml = '';
                for (let i = 0; i < 5; i++) {
                    starsHtml += i < starCount ? '<i class="fa-solid fa-star" aria-hidden="true"></i>' : '<i class="fa-regular fa-star" aria-hidden="true"></i>';
                }

                const avatarLetter = name.trim().charAt(0) || 'ع';

                newReviewCard.innerHTML = `
                    <div class="review-card-top">
                        <div class="review-stars" aria-label="${starCount} من 5 نجوم">
                            ${starsHtml}
                            <span class="review-score">${starCount}.0</span>
                        </div>
                        <span class="review-tag tag-blue"><i class="fa-solid fa-star" aria-hidden="true"></i> تقييم حديث</span>
                    </div>
                    <p class="review-text">"${comment}"</p>
                    <div class="review-author">
                        <div class="author-avatar" aria-hidden="true">${avatarLetter}</div>
                        <div class="author-info-text">
                            <h4>${name} <i class="fa-solid fa-circle-check verified-client" title="عميل موثق" aria-hidden="true"></i></h4>
                            <span>عميل — ${city}</span>
                        </div>
                        <span class="review-date">الآن</span>
                    </div>
                `;

                reviewsGrid.prepend(newReviewCard);
            }

            closeModal('modal-review');
            reviewForm.reset();
            showToast('شكراً لمشاركتك! ⭐', 'تم نشر تقييمك بنجاح وسيظهر لجميع زوار المنصة.', 'success');
        });
    }

    /* =========================================================
       9.1. SEAMLESS INFINITE MARQUEE CLONING
       ========================================================= */
    const marqueeTrack = document.getElementById('marquee-track');
    const reviewsGrid = document.getElementById('reviews-grid');

    if (marqueeTrack && reviewsGrid) {
        const clone = reviewsGrid.cloneNode(true);
        clone.removeAttribute('id');
        clone.setAttribute('aria-hidden', 'true');
        marqueeTrack.appendChild(clone);
    }

    /* =========================================================
       10. ACCESSIBLE SCROLL REVEAL & ANIMATED COUNTERS
       ========================================================= */
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal').forEach((el, i) => {
        el.style.transitionDelay = (i % 4) * 0.08 + 's';
        revealObserver.observe(el);
    });

    const counters = document.querySelectorAll('.counter');
    let countersStarted = false;

    function animateCounters() {
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            if (!target) return;

            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;

            const tick = () => {
                current += step;
                if (current < target) {
                    counter.textContent = Math.floor(current).toLocaleString('en-US');
                    requestAnimationFrame(tick);
                } else {
                    counter.textContent = target.toLocaleString('en-US') + '+';
                }
            };
            requestAnimationFrame(tick);
        });
    }

    const statsSection = document.getElementById('statistics');
    if (statsSection) {
        const statsObs = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && !countersStarted) {
                countersStarted = true;
                animateCounters();
            }
        }, { threshold: 0.25 });
        statsObs.observe(statsSection);
    }

    /* =========================================================
       11. INTERACTIVE PRICE CALCULATOR
       ========================================================= */
    const calcServiceSelect = document.getElementById('calc-service-type');
    const calcScopeSelect = document.getElementById('calc-work-scope');
    const calcUrgencySelect = document.getElementById('calc-urgency');
    const calcPriceDisplay = document.getElementById('calc-price-number');
    const calcBookNowBtn = document.getElementById('calc-book-now-btn');

    function updateCalculatedPrice() {
        if (!calcServiceSelect || !calcScopeSelect || !calcUrgencySelect || !calcPriceDisplay) return;
        const basePrice = parseFloat(calcServiceSelect.value) || 150;
        const scopeMult = parseFloat(calcScopeSelect.value) || 1;
        const urgencyExtra = parseFloat(calcUrgencySelect.value) || 0;

        const totalPrice = Math.round((basePrice * scopeMult) + urgencyExtra);
        calcPriceDisplay.textContent = totalPrice;
    }

    if (calcServiceSelect) calcServiceSelect.addEventListener('change', updateCalculatedPrice);
    if (calcScopeSelect) calcScopeSelect.addEventListener('change', updateCalculatedPrice);
    if (calcUrgencySelect) calcUrgencySelect.addEventListener('change', updateCalculatedPrice);

    if (calcBookNowBtn && calcServiceSelect) {
        calcBookNowBtn.addEventListener('click', () => {
            const selectedOpt = calcServiceSelect.options[calcServiceSelect.selectedIndex];
            const serviceName = selectedOpt ? selectedOpt.getAttribute('data-name') || 'كهرباء' : 'كهرباء';
            triggerBooking(serviceName);
        });
    }

    /* =========================================================
       12. INTERACTIVE FAQ ACCORDION
       ========================================================= */
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const questionBtn = item.querySelector('.faq-question');
        if (questionBtn) {
            questionBtn.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                faqItems.forEach(otherItem => otherItem.classList.remove('active'));
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        }
    });

    /* =========================================================
       13. ANNOUNCEMENT BAR PROMO BUTTON & CLOSE DISMISS
       ========================================================= */
    const claimDiscountBtn = document.getElementById('claim-discount-btn');
    const closeAnnouncementBtn = document.getElementById('close-announcement-btn');
    const announcementBar = document.getElementById('announcement-bar');

    if (claimDiscountBtn) {
        claimDiscountBtn.addEventListener('click', () => {
            triggerBooking();
            showToast('تم تفعيل الخصم 🎁', 'تم تطبيق كود FIX20 بنجاح خصم 20% على طلبك.', 'success');
        });
    }

    if (closeAnnouncementBtn && announcementBar) {
        closeAnnouncementBtn.addEventListener('click', () => {
            announcementBar.classList.add('closed');
        });
    }

    /* =========================================================
       14. DYNAMIC HERO FLOATING BADGE TICKERS (ALL 3 CARDS)
       ========================================================= */
    function setupBadgeTicker(containerId, items, intervalMs) {
        const container = document.getElementById(containerId);
        if (!container) return;
        const iconEl = container.querySelector('i');
        const textEl = container.querySelector('.badge-text');
        if (!iconEl || !textEl) return;

        let idx = 0;
        setInterval(() => {
            textEl.classList.add('fade-out');
            setTimeout(() => {
                idx = (idx + 1) % items.length;
                const next = items[idx];
                iconEl.className = `fa-solid ${next.icon}`;
                textEl.textContent = next.text;
                textEl.classList.remove('fade-out');
                textEl.classList.add('fade-in');
                setTimeout(() => textEl.classList.remove('fade-in'), 350);
            }, 350);
        }, intervalMs);
    }

    // Card 1: Fast Emergency Services Ticker
    setupBadgeTicker('hero-dynamic-badge', [
        { icon: 'fa-bolt', text: 'كهربائي خلال 15 دقيقة' },
        { icon: 'fa-faucet-drip', text: 'سباك طوارئ خلال 20 دقيقة' },
        { icon: 'fa-snowflake', text: 'صيانة تكييف خلال 30 دقيقة' },
        { icon: 'fa-hammer', text: 'نجار أثاث خلال 25 دقيقة' },
        { icon: 'fa-key', text: 'فتح أقفال خلال 15 دقيقة' },
        { icon: 'fa-paint-roller', text: 'فني دهانات وديكور اليوم' },
        { icon: 'fa-video', text: 'تركيب كاميرات مراقبة' }
    ], 2800);

    // Card 2: Rating & Social Proof Ticker
    setupBadgeTicker('hero-dynamic-rating', [
        { icon: 'fa-star', text: '4.9 من 5 تقييم ممتازة' },
        { icon: 'fa-trophy', text: '15,000+ عميل سعيد' },
        { icon: 'fa-comments', text: '+4,800 تقييم 5 نجوم' },
        { icon: 'fa-award', text: 'أفضل منصة صيانة 2026' },
        { icon: 'fa-thumbs-up', text: '99% نسبة رضا العملاء' }
    ], 3400);

    // Card 3: Trust & Security Badges Ticker
    setupBadgeTicker('hero-dynamic-trust', [
        { icon: 'fa-shield-halved', text: 'فني موثق بالهوية' },
        { icon: 'fa-certificate', text: 'ضمان رسمي 30 يوماً' },
        { icon: 'fa-credit-card', text: 'دفع آمن بالفيزا أو نقداً' },
        { icon: 'fa-user-shield', text: 'فحص جنائي معتمد 100%' },
        { icon: 'fa-tag', text: 'أسعار شفافة بدون زيادة' }
    ], 4000);

});
