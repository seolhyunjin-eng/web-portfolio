// ===== 커스텀 커서 =====
const cursor = document.querySelector('.cursor');

document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
});

// 링크/버튼/태그 위에서 커서 확대
document.querySelectorAll('a, .tag_wrap span, .project_card').forEach((el) => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
});

// ===== fade-up 스크롤 애니메이션 =====
const fadeEls = document.querySelectorAll('.fade-up');

const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('show');

        ```
    // 숫자 카운트업 트리거
    const num = entry.target.querySelector('strong[data-count]');
    if (num && !num.dataset.done) {
        num.dataset.done = '1';
        countUp(num);
    }
    io.unobserve(entry.target);
});
```

    }, { threshold: 0.2 });

    fadeEls.forEach((el) => io.observe(el));

    // ===== 스티커 "팡!" 등장 =====
    const stickers = document.querySelectorAll('.sticker');

    const stickerIo = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('pop');
            stickerIo.unobserve(entry.target);
        });
    }, { threshold: 0.4 });

    stickers.forEach((el) => stickerIo.observe(el));

    // ===== 푸터 reveal: main 하단 여백 = 푸터 실제 높이 =====
    const footerEl = document.querySelector('footer');
    const mainEl = document.querySelector('main');

    function syncFooterSpace() {
        if (!footerEl || !mainEl) return;
        mainEl.style.marginBottom = footerEl.offsetHeight + 'px';
    }

    window.addEventListener('load', syncFooterSpace);
    window.addEventListener('resize', syncFooterSpace);
    syncFooterSpace();

    // ===== 숫자 카운트업 =====
    function countUp(el) {
        const target = parseInt(el.dataset.count, 10);
        const suffix = el.dataset.suffix || '';
        const duration = 1800;
        const start = performance.now();

        ```
function tick(now) {
    const p = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
    el.textContent = Math.floor(eased * target).toLocaleString() + suffix;
    if (p < 1) requestAnimationFrame(tick);
    else el.textContent = target.toLocaleString() + suffix;
}
requestAnimationFrame(tick);
```

    }