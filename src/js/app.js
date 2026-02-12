body = document.body;

// Загружаем текущего пользователя при загрузке страницы
window.addEventListener('DOMContentLoaded', () => {
    const headerUserProfile = document.querySelector(".header__user-profile");
    const headerAuthButtons = document.querySelector(".header__auth-buttons");
    const headerUserName = document.querySelector(".header__user-name");
    const headerLogoutButton = document.querySelector(".header__logout");

    if (!headerUserName || !headerUserProfile || !headerAuthButtons) {
        return;
    }

    import('./current_user.js')
        .then(async module => {
            const { getCurrentUser, signOutUser } = module;
            const userData = await getCurrentUser()
            
            if (userData) {
                headerUserName.textContent = userData.name + "!";
                headerUserProfile.style.display = "flex";
                headerAuthButtons.style.display = "none";   
            } else {
                headerUserProfile.style.display = "none";
                headerAuthButtons.style.display = "flex";
            }

            if (headerLogoutButton) {
                headerLogoutButton.addEventListener("click", async () => {
                    try {
                        await signOutUser();
                        headerUserProfile.style.display = "none";
                        headerAuthButtons.style.display = "flex";
                    } catch (error) {
                        console.error("Ошибка при выходе из системы:", error);
                    }
                });
            }
        })
        .catch(error => {
            console.error("Ошибка при загрузке текущего пользователя:", error);
        });
});

// Открываем сайдбар меню при нажатии на кнопку
const headerButton = document.getElementById('headerMenuButton');
const sidebar = document.getElementById('sidebar');
const sidebarMenuNav = sidebar.querySelector(".sidebar__menu-nav")

headerButton.addEventListener('click', () => {
    body.classList.toggle('lock')
    headerButton.classList.toggle('header__menu--toggle');
    sidebar.classList.toggle('sidebar--show')
    sidebarMenuNav.classList.toggle('sidebar__menu-nav--show');
});


// Промо акция для новых пользователей
const promoForm = document.querySelector("#promoForm");

if (promoForm) {
    promoForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const promoInput = document.querySelector("#promoEmailInput");

        alert(`Промо-код отправлен на почту: ${promoInput.value}`);
    })
}

// FAQ кнопки
const faqBlocks = document.querySelectorAll(".faq__question")

for (const faqBlock of faqBlocks) {
    // FAQ Блок -> div.faq__question-header -> button
    const faqBlockButton = faqBlock.children[0].children[0];

    faqBlockButton.addEventListener("click", () => {
        faqBlock.classList.toggle("faq__question--active");
    });
}


// Кнопки фильтрации
const categoriesFilter = document.querySelector("#categoriesFilter");
if (categoriesFilter) {
    for (const categoriesFilterElement of categoriesFilter.children) {
        // Фильтр -> div.col -> button
        const categoryButtonFilter = categoriesFilterElement.children[0];

        categoryButtonFilter.addEventListener("click", () => {
            categoryButtonFilter.classList.toggle("filter-panel__category-item--active");
        })
    }
}


const sortByFilters = document.querySelector("#sortByFilters");
if (sortByFilters) {
    for (const sortByFilterElement of sortByFilters.children) {
        // Фильтр -> div.col -> button
        const sortByButtonFilter = sortByFilterElement.children[0];

        sortByButtonFilter.addEventListener("click", () => {
            sortByButtonFilter.classList.toggle("filter-panel__sort-btn--active");
        })
    }
}