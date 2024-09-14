document.addEventListener('DOMContentLoaded', () => {
    const menuIcon = document.querySelector('.hamburger-menu .fa-bars');
    const menuCancel = document.querySelector('.hamburger-menu .fa-xmark');
    const menuContent = document.querySelector('.hamburger-menu .menu-content');
    const searchButton = document.getElementById('icon');
    const searchInput = document.getElementById('search');
    const categoryGrid = document.getElementById('category-grid');

    // Toggle menu
    menuIcon.addEventListener('click', () => toggleMenu(menuIcon, menuCancel, menuContent));
    menuCancel.addEventListener('click', () => toggleMenu(menuCancel, menuIcon, menuContent));

    // Search button functionality
    searchButton.addEventListener('click', () => {
        const searchTerm = searchInput.value.trim();
        if (searchTerm) fetchMeals(searchTerm);
        searchInput.value = '';
    });

    // Fetch categories for the hamburger menu and category grid
    fetchCategoriesForMenu();
    fetchCategories();

    categoryGrid.addEventListener('click', (e) => {
        if (e.target.tagName === 'IMG' || e.target.tagName === 'SPAN') {
            fetchCategoryDetails(e.target.alt || e.target.textContent);
        }
    });
});

const toggleMenu = (hideElement, showElement, menuContent) => {
    menuContent.classList.toggle('hidden');
    hideElement.style.display = 'none';
    showElement.style.display = 'block';
};

// Fetch categories from API for both hamburger menu and grid
async function fetchCategoriesForMenu() {
    try {
        const response = await fetch('https://www.themealdb.com/api/json/v1/1/categories.php');
        const data = await response.json();
        if (data.categories) displayMenuCategories(data.categories);
    } catch (error) {
        console.error('Error fetching menu categories:', error);
    }
}

function displayMenuCategories(categories) {
    const menuList = document.getElementById('menu-list');
    menuList.innerHTML = categories.map(category => `
        <li><a href="#" data-category="${category.strCategory}">${category.strCategory}</a></li>
    `).join('');

    // Add event listeners to each menu item
    menuList.querySelectorAll('a').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            fetchCategoryDetails(item.getAttribute('data-category'));
        });
    });
}
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
function displayDetailedMealInfo(meal) {
    const mealDetails = document.getElementById('meal-details');
    const mealList = document.getElementById('meal-list');
    const descriptionDiv = document.getElementById('category-description'); // Get description div
    const categoriesHeading = document.querySelector('.categories h2'); // Get h2 heading

    // Hide the h2 heading and description when displaying meal details
    descriptionDiv.style.display = 'none'; // Hide description
    categoriesHeading.style.display = 'none'; // Hide h2 heading

    // Hide the category section
    document.querySelector('.categories').style.display = 'none';

    // Clear the current meal list and show the detailed meal information
    mealList.innerHTML = `
    <div>
        <div id='heading'>
            <span class='p' style='font-size:20px'><i class="fa-solid fa-house"></i></span>
            <span class='p'><i class="fa-solid fa-forward"></i></span>
            <span id="para2">${meal.strMeal}</span>
        </div>
            <h3 id='heading-3'>MEAL DETAILS</h3>
            <div class='flexx'> 
                <img src='${meal.strMealThumb}' width=40% alt="${meal.strMeal}" id="clickImg2"/>
                <section class='section1'>   
                    <h3 id='heading-31'>${meal.strMeal}</h3>
                    <h4 id=heading-4>CATEGORY: <span>${meal.strCategory}</span></h4>
                    <p style='color:black'><b>Source:</b> <a href="${meal.strYoutube}" target="_blank">${meal.strYoutube}</a></p>
                    <p id='tags'><b>Tags: </b><span>${meal.strTags}</span></p>
           
                    <div>
                        <h3>Ingredients:</h3>
                        <ol style='display:grid;grid-template-columns:auto auto;'>
                            ${getIngredients(meal)}
                        </ol>
                    </div>
                </section>
            </div>
                    <div style='backGroundColor:white'>
                        <h3>Measures:</h3>
                        <ul style='display:grid;grid-template-columns:auto auto auto;list-style:none'>
                        <li>${getIngredientsList(meal)}</li>
                        </ul>
                        <p><strong>Instructions:</strong> ${meal.strInstructions}</p> 
                    </div>
    `;
}


function getIngredients(meal) {
    let ingredients = '';
    for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        if (ingredient && ingredient !== '') {
            ingredients += `<li style='list-style:number;'></i> ${ingredient}</li>`;
        }
    }
    return ingredients;
}
function getIngredientsList(meal) {
    let ingredientsList = '';
    for (let i = 1; i <= 15; i++) {
        const measure = meal[`strMeasure${i}`];
        if (measure && measure !== '') {
            ingredientsList += `<li style='list-style:none;'><i class="fa-solid fa-spoon" style='color:orange'></i> ${measure} </li>`;
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


