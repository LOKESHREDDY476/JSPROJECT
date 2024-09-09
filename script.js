// script.js
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
