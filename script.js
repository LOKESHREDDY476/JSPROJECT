document.addEventListener('DOMContentLoaded', function () {
    const menuIcon = document.querySelector('.hamburger-menu .fa-bars');
    const menuContent = document.querySelector('.hamburger-menu .menu-content');
    const searchButton = document.getElementById('icon');
    const searchInput = document.getElementById('search');
    const categoryGrid = document.getElementById('category-grid');

    // Toggle menu visibility on hamburger icon click
    menuIcon.addEventListener('click', function () {
        menuContent.classList.toggle('hidden');
    });

    // Fetch and display categories on page load
    fetchCategories();

    // Search functionality
    searchButton.addEventListener('click', function () {
        const searchTerm = searchInput.value.trim();
        if (searchTerm) {
            fetchMeals(searchTerm);
        }
    });

    // Handle clicks on the hamburger menu for categories
    document.querySelectorAll('.menu-content a').forEach(item => {
        item.addEventListener('click', function (e) {
            e.preventDefault();
            const category = this.getAttribute('data-category');
            fetchCategoryDetails(category);
        });
    });

    // Handle clicks on the category grid (image or text)
    categoryGrid.addEventListener('click', function (e) {
        if (e.target.tagName === 'IMG' || e.target.tagName === 'SPAN') {
            const category = e.target.alt || e.target.textContent;
            fetchCategoryDetails(category);
        }
    });
});

// Fetch categories from API and display them
async function fetchCategories() {
    const url = 'https://www.themealdb.com/api/json/v1/1/categories.php';
    try {
        const response = await fetch(url);
        const data = await response.json();
        displayCategories(data.categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
    }
}

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

// Fetch meals based on search term
async function fetchMeals(searchTerm) {
    const url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(searchTerm)}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        displayMealDetails(data.meals);
    } catch (error) {
        console.error('Error fetching meals:', error);
    }
}

// Fetch meals based on category
async function fetchCategoryDetails(category) {
    const url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${encodeURIComponent(category)}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        displayMealDetails(data.meals);
    } catch (error) {
        console.error('Error fetching category details:', error);
    }
}

// Display meal details
function displayMealDetails(meals) {
    const mealDetails = document.getElementById('meal-details');
    const mealList = document.getElementById('meal-list');
    mealList.innerHTML = ''; // Clear previous content
    mealDetails.classList.add('visible');

    if (meals && meals.length > 0) {
        meals.forEach(meal => {
            const mealDiv = document.createElement('div');
            mealDiv.className = 'meal-item';
            mealDiv.innerHTML = `
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                <h3>${meal.strMeal}</h3>
            `;
            mealList.appendChild(mealDiv);
        });
    } else {
        mealList.innerHTML = '<p>No meals found for this search.</p>';
    }
}
