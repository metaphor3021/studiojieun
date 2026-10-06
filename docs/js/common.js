document.addEventListener('DOMContentLoaded', () => {

    initPageFadeOutOnly();
    initScrollFade();
    initProjectNotesAnimation();

    includeHTML('#header', '/views/components/header.html')
        .then(() => {
            setActiveLink('.header-nav a[href]');
            initHeaderAutoHide();
            includeHTML('#menu', '/views/components/menu.html')
                .then(() => {
                    initMobileMenu();
                    setActiveLink('.menu a[href]');
                })
                .catch(err => console.error('메뉴 include 실패:', err));
        })
        .catch(err => console.error('헤더 include 실패:', err));

    // 우클릭 비활성화
    document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
    });

    // 드래그 비활성화
    document.addEventListener('dragstart', (e) => {
        e.preventDefault();
    });

});

window.addEventListener("pageshow", function(event) {
    if (event.persisted) {
        document.querySelector('.layout').classList.remove("fade-out");
    }
});


function initPageFadeOutOnly() {

    const layout = document.querySelector('.layout');
    if (!layout) return;

    // 링크 클릭 감지
    document.addEventListener("click", (e) => {

        const link = e.target.closest("a");
        if (!link) return;

        const href = link.getAttribute("href");

        // 예외 처리
        if (!href) return;
        if (href.startsWith("#")) return;
        if (href.startsWith("http")) return;
        if (href.startsWith("mailto")) return;
        if (href.startsWith("tel")) return;
        if (link.target === "_blank") return;

        e.preventDefault();

        // 페이드 아웃
        layout.classList.add("fade-out");

        // 페이지 이동
        setTimeout(() => {
            window.location.href = href;
        }, 450); // CSS transition duration과 동일하게 설정
    });
}


function openNewTab(event, url) {
    window.open(url, '_blank'); // 새 탭에서 열기
}

function includeHTML(selector, filePath) {
    return fetch(filePath)
        .then(res => {
            if (!res.ok) throw new Error('Failed to fetch ' + filePath);
            return res.text();
        })
        .then(html => {
            const container = document.querySelector(selector);
            if (!container) throw new Error('No container for ' + selector);
            container.innerHTML = html;
        });
}

function initMobileMenu() {
    const header = document.querySelector('.header');
    const menu = document.querySelector('.menu-overlay');
    const toggleBtn = document.querySelector('.menu-toggle');

    if (!toggleBtn || !menu) {
        console.warn('Mobile menu 요소를 찾을 수 없음');
        return;
    }

    function setMenuPosition() {
        const headerHeight = header.offsetHeight;
        menu.style.paddingTop = headerHeight + 20 + "px"; // 헤더 높이 + 여백
    }

    window.addEventListener("load", setMenuPosition);
    window.addEventListener("resize", setMenuPosition);

    toggleBtn.addEventListener('click', () => {
        const isActive = menu.classList.toggle('active');

        // 스크롤 잠금
        document.body.style.overflow = isActive ? "hidden" : "";

        toggleBtn.textContent = isActive ? "✕" : "☰";
    });
}

function setActiveLink(selector) {
    const path = window.location.pathname;
    const currentPage = path.split('/').pop(); // 현재 파일명
    const links = document.querySelectorAll(selector);

    links.forEach(link => {
        const hrefPage = link.getAttribute('href')?.split('/').pop();
        let isActive = hrefPage === currentPage;

        if (path.includes('/works/') && hrefPage === 'works.html') {
            isActive = true;
        }
        if (isActive) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

function initScrollFade() {

    const elements = document.querySelectorAll(".scroll-fade");

    const observer = new IntersectionObserver((entries) => {

        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        });

    }, {
        threshold: 0.15
    });

    elements.forEach(el => {

        const imgs = el.querySelectorAll("img");

        if (imgs.length === 0) {
            // 이미지가 없으면 바로 observer 등록
            observer.observe(el);
        } else {
            // 이미지가 있으면 로딩 후 observer 등록
            let loadedCount = 0;

            imgs.forEach(img => {
                if (img.complete) {
                    loadedCount++;
                } else {
                    img.addEventListener("load", () => {
                        loadedCount++;
                        if (loadedCount === imgs.length) {
                            observer.observe(el);
                        }
                    });
                    img.addEventListener("error", () => {
                        loadedCount++;
                        if (loadedCount === imgs.length) {
                            observer.observe(el);
                        }
                    });
                }
            });

            // 모든 이미지가 이미 로딩 완료된 경우
            if (loadedCount === imgs.length) {
                observer.observe(el);
            }
        }

    });
}

function initProjectNotesAnimation() {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    document.querySelectorAll('.project-notes').forEach(notes => {
        const summary = notes.querySelector('summary');
        const content = notes.querySelector('.project-notes-content');
        if (!summary || !content || typeof content.animate !== 'function') return;

        let animation = null;
        let expanded = notes.open;

        function finish() {
            const current = animation;
            animation = null;
            if (current) {
                current.onfinish = null;
                current.cancel();
            }
            notes.open = expanded;
        }

        summary.addEventListener('click', event => {
            if (reducedMotion.matches) {
                if (animation) finish();
                return;
            }

            event.preventDefault();
            expanded = animation ? !expanded : !notes.open;

            if (animation) {
                animation.reverse();
                return;
            }

            // Keep the notes visible until the fade-out and downward movement finish.
            notes.open = true;

            animation = content.animate([
                { opacity: 0, transform: 'translateY(18px)' },
                { opacity: 1, transform: 'translateY(0)' }
            ], {
                duration: 650,
                easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
                direction: expanded ? 'normal' : 'reverse'
            });
            animation.onfinish = finish;
        });

        // Restore native toggling when the user enables reduced motion.
        const resetAnimation = () => {
            if (animation) finish();
        };
        reducedMotion.addEventListener('change', resetAnimation);
    });
}

function initHeaderAutoHide() {
    const header = document.querySelector(".header");
    if (!header) return;

    let lastScroll = window.pageYOffset;

    window.addEventListener("scroll", () => {

        const currentScroll = window.pageYOffset;

        if (currentScroll > lastScroll && currentScroll > 80) {
            header.classList.add("hide");
        } else {
            header.classList.remove("hide");
        }

        lastScroll = currentScroll;

    });
}

