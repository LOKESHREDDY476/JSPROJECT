document.addEventListener('DOMContentLoaded', function () {
    const menuIcon = document.querySelector('.hamburger-menu .fa-bars');
    const menuCancel = document.querySelector('.hamburger-menu .fa-solid.fa-xmark');
    const menuContent = document.querySelector('.hamburger-menu .menu-content');
    const searchButton = document.getElementById('icon');
    const searchInput = document.getElementById('search');
    const categoryGrid = document.getElementById('category-grid');

    // Toggle menu visibility on hamburger icon click
    menuIcon.addEventListener('click', function () {
        menuContent.classList.toggle('hidden');
        menuIcon.style.display = 'none'; // Hide hamburger icon
        menuCancel.style.display = 'block'; // Show cancel icon
    });

    menuCancel.addEventListener('click', function () {
        menuContent.classList.toggle('hidden');
        menuCancel.style.display = 'none'; // Hide cancel icon
        menuIcon.style.display = 'block'; // Show hamburger icon
    });

    // Fetch and display categories on page load
    fetchCategories();

    // Search functionality
    searchButton.addEventListener('click', function () {
        const searchTerm = searchInput.value.trim();
        if (searchTerm) {
            fetchMeals(searchTerm);
            searchInput.value = ''; // Clear search input after search
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
        console.log(data);  // Log the entire API response to inspect it
        if(data.categories) {
            displayCategories(data.categories);
        } else {
            console.error('Categories data not found');
        }
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
            <span>${category.strCategory}</span>
            <img src="${category.strCategoryThumb}" alt="${category.strCategory}" data-description="${category.strCategoryDescription || 'No description available.'}">
        `;
        categoryGrid.appendChild(categoryDiv);

        // Add click event to fetch and display category description
        categoryDiv.querySelector('img').addEventListener('click', function () {
            const description = this.getAttribute('data-description');
            // console.log(description); // Debugging description value
            displayCategoryDescription(this.dataset.description);
        }); 
    });
}

// Function to display the category description
function displayCategoryDescription(description) {
    const descriptionDiv = document.getElementById('category-description');
    // descriptionDiv.textContent = description ? description : 'No description available.'; // Fallback if description is empty
    descriptionDiv.textContent = description;
    descriptionDiv.style.display = 'block'; // Make the description visible
}

// Fetch meals based on search term
async function fetchMeals(searchTerm) {
    const url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${(searchTerm)}`;
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
    const url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${(category)}`;
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
    const categoriesSection = document.querySelector('.categories');
    mealList.innerHTML = ''; 
    mealDetails.classList.add('visible');
    categoriesSection.style.display = 'none';

    if (meals && meals.length > 0) {
        meals.forEach(meal => {
            const mealDiv = document.createElement('div');
            mealDiv.className = 'meal-item';
            mealDiv.innerHTML = ` 
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}" data-id="${meal.idMeal}">
                <h3>${meal.strMeal}</h3>
            `;

            mealList.appendChild(mealDiv);
            mealDiv.querySelector('img').addEventListener('click', function () {
                const mealId = this.getAttribute('data-id');
                fetchMealDetails(mealId); // Fetch detailed meal info
            });
        });
    } else {
        mealList.innerHTML = '<p>No meals found for this search.</p>';
    }
}

async function fetchMealDetails(mealId) {
    const url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        displayDetailedMealInfo(data.meals[0]); // Pass the meal object to display
    } catch (error) {
        console.error('Error fetching meal details:', error);
    }
}

// Display detailed meal info, including description and ingredients
function displayDetailedMealInfo(meal) {
    const mealDetails = document.getElementById('meal-details');
    const mealList = document.getElementById('meal-list');

    // Clear the current meal list and show the detailed meal information
    mealList.innerHTML = `
        <div class="meal-detailed">
             <i class="fa-solid fa-house"></i>
             <i class="fa-solid fa-forward"></i>
            <span><h2>${meal.strMeal}</h2></span>
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
            <p><strong>Category:</strong> ${meal.strCategory}</p>
            <p><strong>Area:</strong> ${meal.strArea}</p>
            <p><strong>Instructions:</strong> ${meal.strInstructions}</p>
            <h3>Ingredients:</h3>
            <ul>
                ${getIngredientsList(meal)}
            </ul>
        </div>
    `;
}

// Helper function to generate ingredients and measurements list
function getIngredientsList(meal) {
    let ingredientsList = '';
    
    // Loop through the ingredients (strIngredient1, strIngredient2, etc.) and measurements
    for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        const measure = meal[`strMeasure${i}`];
        
        if (ingredient && ingredient !== '') {
            ingredientsList += `<li>${measure} ${ingredient}</li>`;
        } 
    }

    return ingredientsList;
}

function showCategories() {
    const categoriesSection = document.querySelector('.categories');
    const mealDetails = document.getElementById('meal-details');

    categoriesSection.style.display = 'block'; // Show categories section
    mealDetails.classList.remove('visible'); // Hide the meal details section
}
