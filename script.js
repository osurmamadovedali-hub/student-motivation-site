// ==================== ДАННЫЕ ДЛЯ ГАЛЕРЕИ ====================
const imagesData = [
    { id: 1, title: "Усердная учёба", description: "Книги и знания - твой путь к успеху!", category: "study", likes: 0, img: "https://picsum.photos/id/20/400/300" },
    { id: 2, title: "Достижение цели", description: "Вершина успеха после долгого пути.", category: "success", likes: 0, img: "https://picsum.photos/id/26/400/300" },
    { id: 3, title: "Планирование", description: "Ставь цели и достигай их шаг за шагом.", category: "goal", likes: 0, img: "https://picsum.photos/id/0/400/300" },
    { id: 4, title: "Командная работа", description: "Вместе мы можем больше!", category: "study", likes: 0, img: "https://picsum.photos/id/100/400/300" },
    { id: 5, title: "Успех и деньги", description: "Финансовая грамотность - ключ к свободе.", category: "success", likes: 0, img: "https://picsum.photos/id/1/400/300" },
    { id: 6, title: "Медитация и фокус", description: "Концентрация на главном.", category: "goal", likes: 0, img: "https://picsum.photos/id/125/400/300" },
    { id: 7, title: "Выпускной", description: "Первый шаг во взрослую жизнь.", category: "success", likes: 0, img: "https://picsum.photos/id/15/400/300" },
    { id: 8, title: "Новые знания", description: "Каждый день учись чему-то новому.", category: "study", likes: 0, img: "https://picsum.photos/id/24/400/300" }
];

// Глобальные переменные
let currentFilter = 'all';
let currentView = 'grid';
let totalLikes = 0;

// ==================== ФУНКЦИИ ДЛЯ ГАЛЕРЕИ ====================
function renderGallery() {
    const galleryGrid = document.getElementById('image-gallery');
    if (!galleryGrid) return;

    let filteredImages = imagesData;
    if (currentFilter !== 'all') {
        filteredImages = imagesData.filter(img => img.category === currentFilter);
    }

    galleryGrid.innerHTML = '';
    
    filteredImages.forEach(image => {
        const card = document.createElement('article');
        card.className = 'image-card';
        card.setAttribute('data-category', image.category);
        
        card.innerHTML = `
            <div class="card-image">
                <img src="${image.img}" alt="${image.title}" class="gallery-img" loading="lazy">
                <div class="image-overlay">
                    <button class="like-btn" data-id="${image.id}">
                        <i class="far fa-heart"></i>
                        <span class="like-count">${image.likes}</span>
                    </button>
                    <button class="zoom-btn" onclick="window.open('${image.img}', '_blank')">
                        <i class="fas fa-expand"></i>
                    </button>
                </div>
            </div>
            <div class="card-content">
                <h3 class="image-title">${image.title}</h3>
                <p class="image-description">${image.description}</p>
                <div class="image-tags">
                    <span class="tag">${getCategoryName(image.category)}</span>
                </div>
            </div>
        `;
        galleryGrid.appendChild(card);
    });

    updateCounters();
    attachLikeEvents();
}

function getCategoryName(category) {
    const names = { study: 'Учёба', success: 'Успех', goal: 'Цели' };
    return names[category] || category;
}

function updateCounters() {
    const imageCounter = document.getElementById('image-counter');
    const totalLikesElem = document.getElementById('total-likes');
    
    if (imageCounter) {
        let visibleImages = imagesData;
        if (currentFilter !== 'all') {
            visibleImages = imagesData.filter(img => img.category === currentFilter);
        }
        imageCounter.textContent = visibleImages.length;
    }
    
    if (totalLikesElem) {
        totalLikes = imagesData.reduce((sum, img) => sum + img.likes, 0);
        totalLikesElem.textContent = totalLikes;
    }
}

function attachLikeEvents() {
    document.querySelectorAll('.like-btn').forEach(btn => {
        btn.removeEventListener('click', handleLikeClick);
        btn.addEventListener('click', handleLikeClick);
    });
}

function handleLikeClick(e) {
    e.stopPropagation();
    const btn = e.currentTarget;
    const imageId = parseInt(btn.getAttribute('data-id'));
    const image = imagesData.find(img => img.id === imageId);
    const likeSpan = btn.querySelector('.like-count');
    const heartIcon = btn.querySelector('i');
    
    if (btn.classList.contains('liked')) {
        image.likes--;
        btn.classList.remove('liked');
        heartIcon.classList.remove('fas');
        heartIcon.classList.add('far');
    } else {
        image.likes++;
        btn.classList.add('liked');
        heartIcon.classList.remove('far');
        heartIcon.classList.add('fas');
    }
    
    likeSpan.textContent = image.likes;
    updateCounters();
    
    // Анимация
    btn.style.transform = 'scale(1.2)';
    setTimeout(() => { btn.style.transform = 'scale(1)'; }, 200);
}

// ==================== ФУНКЦИИ ДЛЯ УПРАВЛЕНИЯ ====================
function setupViewButtons() {
    const gridBtn = document.getElementById('grid-view');
    const listBtn = document.getElementById('list-view');
    const galleryGrid = document.getElementById('image-gallery');
    
    if (!gridBtn || !listBtn || !galleryGrid) return;
    
    gridBtn.addEventListener('click', () => {
        currentView = 'grid';
        galleryGrid.classList.remove('list-view');
        gridBtn.classList.add('active');
        listBtn.classList.remove('active');
    });
    
    listBtn.addEventListener('click', () => {
        currentView = 'list';
        galleryGrid.classList.add('list-view');
        listBtn.classList.add('active');
        gridBtn.classList.remove('active');
    });
}

function setupFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.getAttribute('data-filter');
            renderGallery();
            
            // Сохраняем вид после перерисовки
            const galleryGrid = document.getElementById('image-gallery');
            if (galleryGrid && currentView === 'list') {
                galleryGrid.classList.add('list-view');
            }
        });
    });
}

// ==================== ФУНКЦИИ ДЛЯ СТРАНИЦЫ КОНТАКТОВ ====================
function setupContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Спасибо за ваше сообщение! Мы свяжемся с вами в ближайшее время.');
        form.reset();
    });
}

// ==================== ОБЩИЕ ФУНКЦИИ ====================
function setCurrentYear() {
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
}

// ==================== ЗАПУСК ПРИ ЗАГРУЗКЕ СТРАНИЦЫ ====================
document.addEventListener('DOMContentLoaded', () => {
    console.log('Сайт полностью загружен и готов к работе!');
    
    setCurrentYear();
    renderGallery();
    setupViewButtons();
    setupFilters();
    setupContactForm();
});