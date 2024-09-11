document.addEventListener('DOMContentLoaded', function () {
    const menuIcon = document.querySelector('.hamburger-menu .fa-bars');
    const menuContent = document.querySelector('.hamburger-menu .menu-content');

    // Toggle menu visibility on hamburger icon click
    menuIcon.addEventListener('click', function () {
        menuContent.classList.toggle('hidden');
    });

    // Hamburger menu click handling for specific categories
    document.querySelectorAll('.menu-content a').forEach(item => {
        item.addEventListener('click', function (e) {
            e.preventDefault();
            const category = this.getAttribute('data-category');
            fetchCategoryDetails(category);
        });
    });

    // Handle clicks on the category grid (image or span text)
    document.getElementById('category-grid').addEventListener('click', function (e) {
        if (e.target.tagName === 'IMG' || e.target.tagName === 'SPAN') {
            const category = e.target.alt || e.target.textContent;
            fetchCategoryDetails(category);
        }
    });

    // Fetch and display categories on page load
    fetchCategories();
});

async function fetchCategoryDetails(category) {
    // API URLs for specific categories
    let url = '';
    switch (category.toLowerCase()) {
        case 'dessert':
            url = 'https://www.themealdb.com/api/json/v1/1/filter.php?c=Dessert';
            break;
        case 'miscellaneous':
            url = 'https://www.themealdb.com/api/json/v1/1/filter.php?c=Miscellaneous';
            break;
        case 'side':
            url = 'https://www.themealdb.com/api/json/v1/1/filter.php?c=Side';
            break;
        case 'starter':
            url = 'https://www.themealdb.com/api/json/v1/1/filter.php?c=Starter';
            break;
        default:
            url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${encodeURIComponent(category)}`;
    }

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
                <p>${meal.strInstructions ? meal.strInstructions.substring(0, 100) : 'No instructions available.'}...</p>
            `;
            categoryGrid.appendChild(mealDiv);
        });
    } else {
        categoryGrid.innerHTML = '<p>No meals found for this category.</p>';
    }
}

async function fetchCategories() {
    const baseUrl = 'https://www.themealdb.com/api/json/v1/1/categories.php';
    try {
        const response = await fetch(baseUrl);
        const data = await response.json();
        displayCategories(data.categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
    }
}

function displayCategories(categories) {
    const categoryGrid = document.getElementById('category-grid');
    categoryGrid.innerHTML = ''; // Clear previous content

    // Add default categories fetched from API
    const categoryNames = categories.map(category => category.strCategory.toLowerCase());

    // Display fetched categories from the API
    categories.forEach(category => {
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'category-item';
        categoryDiv.innerHTML = `
            <img src="${category.strCategoryThumb}" alt="${category.strCategory}">
            <span>${category.strCategory}</span>
        `;
        categoryGrid.appendChild(categoryDiv);
    });

    // Add specific categories (Dessert, Miscellaneous, Side, Starter) only if they are not in the API response
    const additionalCategories = [
        { name: 'Dessert', thumb: 'https://www.themealdb.com/images/category/dessert.png' },
        { name: 'Miscellaneous', thumb: 'https://www.themealdb.com/images/category/miscellaneous.png' },
        { name: 'Side', thumb: 'https://www.themealdb.com/images/category/side.png' },
        { name: 'Starter', thumb: 'https://www.themealdb.com/images/category/starter.png' }
    ];

    additionalCategories.forEach(category => {
        // Check if the category is not already in the fetched categories
        if (!categoryNames.includes(category.name.toLowerCase())) {
            const categoryDiv = document.createElement('div');
            categoryDiv.className = 'category-item';
            categoryDiv.innerHTML = `
                <img src="${category.thumb}" alt="${category.name}">
                <span>${category.name}</span>
            `;
            categoryGrid.appendChild(categoryDiv);
        }
    });
}
