document.addEventListener('DOMContentLoaded', function () {
    const menuIcon = document.querySelector('.hamburger-menu .fa-bars');
    const menuContent = document.querySelector('.hamburger-menu .menu-content');

    menuIcon.addEventListener('click', function () {
        menuContent.classList.toggle('hidden');
    });

    document.querySelectorAll('.menu-content a').forEach(item => {
        item.addEventListener('click', function (e) {
            e.preventDefault();
            const category = this.getAttribute('data-category');
            fetchCategoryDetails(category);
        });
    });

    // Also allow clicking on category images to fetch details
    document.getElementById('category-grid').addEventListener('click', function (e) {
        if (e.target.tagName === 'IMG' || e.target.tagName === 'SPAN') {
            const category = e.target.alt || e.target.textContent;
            fetchCategoryDetails(category);
        }
    });
});

async function fetchCategoryDetails(category) {
    const url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(category)}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        displayMealDetails(data.meals);
    } catch (error) {
        console.error('Error fetching category:', error);
    }
}

function displayMealDetails(meals) {
    const categoryGrid = document.getElementById('category-grid');
    categoryGrid.innerHTML = ''; // Clear previous content

    if (meals) {
        meals.forEach(meal => {
            const mealDiv = document.createElement('div');
            mealDiv.className = 'meal-item';
            mealDiv.innerHTML = `
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                <h3>${meal.strMeal}</h3>
                <p>${meal.strInstructions.substring(0, 100)}...</p> <!-- Shortened instructions -->
            `;
            categoryGrid.appendChild(mealDiv);
        });
    } else {
        categoryGrid.innerHTML = '<p>No meals found for this category.</p>';
    }
}

// Fetch and display categories on page load
document.addEventListener('DOMContentLoaded', async () => {
    const baseUrl = 'https://www.themealdb.com/api/json/v1/1/categories.php';
    const response = await fetch(baseUrl);
    const data = await response.json();
    displayCategories(data.categories);
});

function displayCategories(categories) {
    const categoryGrid = document.getElementById('category-grid');
    categoryGrid.innerHTML = ''; // Clear previous content
    categories.forEach(category => {
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'category-item';
        categoryDiv.innerHTML = `
            <img src="${category.strCategoryThumb}" alt="${category.strCategory}">
            <span>${category.strCategory}</span>
        `;
        categoryGrid.appendChild(categoryDiv);
    });
}
