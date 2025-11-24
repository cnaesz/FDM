document.addEventListener('DOMContentLoaded', () => {
    const viewMenuBtn = document.getElementById('view-menu-btn');
    const welcomePage = document.getElementById('welcome-page');
    const menuPage = document.getElementById('menu-page');
    const menuContainer = document.getElementById('menu-container');
    const categoryNav = document.getElementById('category-nav');

    viewMenuBtn.addEventListener('click', () => {
        welcomePage.classList.remove('active');
        menuPage.classList.add('active');
        loadMenu();
    });

    async function loadMenu() {
        try {
            const response = await fetch('menu-data.json');
            const menuData = await response.json();
            displayMenu(menuData);
        } catch (error) {
            console.error('Error loading menu:', error);
            menuContainer.innerHTML = '<p>متاسفانه در بارگذاری منو مشکلی پیش آمد.</p>';
        }
    }

    function displayMenu(data) {
        const { categories, items } = data;
        
        // ۱. اول یه Map بساز بین id و name دسته‌بندی‌ها
        const categoryMap = {};
        categories.forEach(cat => {
            categoryMap[cat.id] = {
            name: cat.name,
            color: cat.color
            };
        });
        
        // ۲. آیتم‌ها رو دسته‌بندی کن
        const groupedItems = {};
        items.forEach(item => {
            const catId = item.category;
            if (!groupedItems[catId]) groupedItems[catId] = [];
            groupedItems[catId].push(item);
        });
        
        // ۳. حالا HTML بساز
        menuContainer.innerHTML = '';
        categoryNav.innerHTML = '';
        
        categories.forEach(cat => {
            const itemsInCat = groupedItems[cat.id] || [];
            if (itemsInCat.length === 0) return; // اگر آیتمی نداشت، نیاد

            // Create nav link
            const navLink = document.createElement('a');
            navLink.href = `#category-${cat.id}`;

            let iconHTML = '';
            if (cat.icon) {
                iconHTML = `<img src="${cat.icon}" alt="">`;
            }

            navLink.innerHTML = `
                ${iconHTML}
                <span>${cat.name}</span>
            `;
            categoryNav.appendChild(navLink);
        
            const categoryEl = document.createElement('div');
            categoryEl.className = 'category';
            categoryEl.id = `category-${cat.id}`;
            // اگر خواستی رنگ پس‌زمینه دسته‌بندی رو اعمال کنی:
            categoryEl.style.backgroundColor = cat.color;
        
            const categoryHeader = document.createElement('div');
            categoryHeader.classList.add('category-header');

            //for matn
            const categoryTitle = document.createElement('span');
            categoryTitle.classList.add('header-txt')
            categoryTitle.textContent = cat.name;

            const icon = document.createElement('img');
            icon.src = cat.icon;
            icon.alt = '';
            icon.classList.add('category-icon');

            categoryHeader.appendChild(icon);
            categoryHeader.appendChild(categoryTitle);
            categoryEl.appendChild(categoryHeader);
        
            itemsInCat.forEach(item => {
            const itemEl = document.createElement('div');
            itemEl.className = 'menu-item';
            itemEl.innerHTML = `
                <img src="${item.image}" alt="${item.name}" class="menu-item-image">
                <div class="menu-item-details">
                    <div class="menu-item-header">
                        <span class="menu-item-name">${item.name}</span>
                    </div>
                    <p class="menu-item-ingredients">${item.description}</p>
                    <div class="menu-item-price">${item.price}</div>
                </div>
            `;
            categoryEl.appendChild(itemEl);
            });
        
            menuContainer.appendChild(categoryEl);
        });

        setupSpyscroller();
        }

    function setupSpyscroller() {
        const navLinks = document.querySelectorAll('#category-nav a');
        const categories = document.querySelectorAll('.category');
        const nav = document.getElementById('category-nav');

        // Smooth scroll on click
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                document.querySelector(targetId).scrollIntoView({
                    behavior: 'smooth'
                });
                setTimeout(()=>{
                    link.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
                }, 300);
            });
        });

        // Highlight active link on scroll
        window.addEventListener('scroll', () => {
            let current = '';
            categories.forEach(category => {
                const categoryTop = category.offsetTop;
                if (pageYOffset >= categoryTop - 150) { // Adjust offset as needed
                    current = category.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href').includes(current)) {
                    link.classList.add('active');
                    link.scrollIntoView({
                        behavior: 'auto',
                        inline: 'center',
                        block: 'nearest'
                    })
                }
            });
        });
    }
});
