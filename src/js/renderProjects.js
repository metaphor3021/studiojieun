document.addEventListener('DOMContentLoaded', () => {
    const wrapper = document.getElementById('main-wrapper');
    const filteredWorks = works.filter(work => work.showOnMain);
    filteredWorks.sort((a, b) => a.orderOnMain - b.orderOnMain);
    filteredWorks.forEach(work => {
        const html = `
        <div class="main-container">
            <a href="/src/views/projects/${work.link}" class="main-link" style="text-decoration: none;">
                <img src="/src/assets/images/${work.thumbnail}" alt="${work.title}">
                <div class="main-descript">${work.title}, ${work.material}, ${work.year}</div>
            </a>
        </div>
        `;
        wrapper.innerHTML += html;
    });
});


document.addEventListener('DOMContentLoaded', () => {
    const wrapper = document.getElementById('works-wrapper');
    const filteredWorks = works.filter(work => work.show);
    filteredWorks.sort((a, b) => b.id - a.id);
    filteredWorks.forEach(work => {
        const html = `
        <div class="work-container">
            <a href="/src/views/projects/${work.link}" style="text-decoration: none;">
                <img src="/src/assets/images/${work.thumbnail}" alt="${work.title}">
                <div class="project-title">${work.title}</div>
                <div class="project-details">${work.material}, ${work.year}</div>
            </a>
        </div>
        `;
        wrapper.innerHTML += html;
    });
})