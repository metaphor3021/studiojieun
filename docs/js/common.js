document.addEventListener('DOMContentLoaded', () => {
    includeHTML('#header', '/views/components/header.html');
    includeHTML('#sidebar', '/views/components/sidebar.html')
        .then(() => {
            setActiveLink('.sidebar a[href]');
        })
        .catch(err => console.error('사이드바 include 실패:', err));
    includeHTML('#menu', '/views/components/menu.html')
        .then(() => {
            initMobileMenu(); // 삽입 완료 후 이벤트 연결
            setActiveLink('.menu a[href]');
        })
        .catch(err => console.error('메뉴 include 실패:', err));
});

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
        menu.style.top = headerHeight + "px";
        menu.style.height = `calc(100vh - ${headerHeight}px)`;
    }

    window.addEventListener("load", setMenuPosition);
    window.addEventListener("resize", setMenuPosition);

    toggleBtn.addEventListener('click', () => {
        const isActive = menu.classList.toggle('active');

        toggleBtn.textContent = isActive ? "✕" : "☰";
    });
}

function setActiveLink(selector) {
    const currentPage = window.location.pathname.split('/').pop(); // 현재 파일명
    const links = document.querySelectorAll(selector);

    links.forEach(link => {
        const hrefPage = link.getAttribute('href')?.split('/').pop();
        if (hrefPage === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

