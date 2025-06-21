// DOM 요소
const recipeGrid = document.getElementById('recipeGrid');
const searchIngredients = document.getElementById('searchIngredients');
const recipeCount = document.getElementById('recipeCount');
const noResults = document.getElementById('noResults');
const loginBtn = document.getElementById('loginBtn');
const registerBtn = document.getElementById('registerBtn');
const logoutBtn = document.getElementById('logoutBtn');
const myInfoBtn = document.getElementById('myInfoBtn');

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('로그인이 필요합니다.');
        window.location.href = '/login.html';
        return;
    }
    
    checkAuthStatus();
    loadSearchResults();
});

// 인증 상태 확인
function checkAuthStatus() {
    const token = localStorage.getItem('token');
    
    if (token) {
        // 로그인 상태
        loginBtn.style.display = 'none';
        registerBtn.style.display = 'none';
        logoutBtn.style.display = 'inline-flex';
        myInfoBtn.style.display = 'inline-flex';
    } else {
        // 로그아웃 상태
        loginBtn.style.display = 'inline-flex';
        registerBtn.style.display = 'inline-flex';
        logoutBtn.style.display = 'none';
        myInfoBtn.style.display = 'none';
    }
}

// 로그아웃
if (logoutBtn) {
    logoutBtn.addEventListener('click', function() {
        localStorage.removeItem('token');
        localStorage.removeItem('user_id');
        checkAuthStatus();
        alert('로그아웃되었습니다.');
        window.location.href = '/';
    });
}

// 검색 결과 로드
function loadSearchResults() {
    const urlParams = new URLSearchParams(window.location.search);
    const ingredients = urlParams.get('ingredients');

    if (!ingredients) {
        alert('검색할 재료가 없습니다. 홈으로 돌아갑니다.');
        window.location.href = '/';
        return;
    }

    // 검색 정보 표시
    searchIngredients.textContent = ingredients;
    
    // API 호출하여 레시피 검색
    fetchRecipes(ingredients);
}

// 레시피 검색 API 호출
async function fetchRecipes(ingredients) {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/recipes/search?ingredients=${encodeURIComponent(ingredients)}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || '레시피 검색에 실패했습니다.');
        }

        const recipes = await response.json();
        recipeCount.textContent = recipes.length;

        if (recipes.length === 0) {
            recipeGrid.style.display = 'none';
            noResults.style.display = 'block';
        } else {
            recipeGrid.style.display = 'grid';
            noResults.style.display = 'none';
            displayRecipes(recipes);
        }
    } catch (error) {
        console.error('레시피 검색 오류:', error);
        alert(error.message);
        recipeGrid.style.display = 'none';
        noResults.style.display = 'block';
    }
}

// 레시피 목록 표시
function displayRecipes(recipes) {
    recipeGrid.innerHTML = '';

    if (!recipes || recipes.length === 0) {
        recipeGrid.innerHTML = '<p>해당 재료로 만들 수 있는 레시피가 없습니다.</p>';
        return;
    }

    recipes.forEach(recipe => {
        const recipeCard = document.createElement('div');
        recipeCard.className = 'recipe-card';
        recipeCard.innerHTML = `
            <div class="recipe-info-simple">
                <h3>${recipe.food_name || '이름 없음'}</h3>
                <p class="match-rate">${Math.round(recipe.match_percentage)}% 매칭</p>
            </div>
        `;
        recipeCard.addEventListener('click', () => {
            // 상세 페이지로 이동하기 전에, 상세 정보를 sessionStorage에 저장
            sessionStorage.setItem('selectedRecipe', JSON.stringify(recipe));
            window.location.href = `recipe-detail.html?id=${recipe.id}`;
        });
        recipeGrid.appendChild(recipeCard);
    });
}

// 레시피 카드 생성
function createRecipeCard(recipe) {
    const card = document.createElement('div');
    card.className = 'recipe-card';
    card.addEventListener('click', () => {
        window.location.href = `/recipe/${recipe.id}`;
    });
    
    // 기본 이미지 또는 아이콘
    const imageContent = recipe.image_url ? 
        `<img src="${recipe.image_url}" alt="${recipe.name}" style="width: 100%; height: 100%; object-fit: cover;">` :
        `<i class="fas fa-utensils"></i>`;
    
    // 조리 시간 포맷팅
    const cookingTime = recipe.cooking_time ? 
        `${recipe.cooking_time}분` : 
        '시간 미정';
    
    // 난이도 표시
    const difficultyText = getDifficultyText(recipe.difficulty);
    
    card.innerHTML = `
        <div class="recipe-image">
            ${imageContent}
        </div>
        <div class="recipe-content">
            <h3 class="recipe-title">${recipe.name}</h3>
            <p class="recipe-description">${recipe.description || '설명이 없습니다.'}</p>
            <div class="recipe-meta">
                <div>
                    <span><i class="fas fa-clock"></i> ${cookingTime}</span>
                    <span style="margin-left: 1rem;"><i class="fas fa-star"></i> ${difficultyText}</span>
                </div>
                <div class="match-percentage">
                    ${recipe.match_percentage}% 매칭
                </div>
            </div>
        </div>
    `;
    
    return card;
}

// 난이도 텍스트 변환
function getDifficultyText(difficulty) {
    switch(difficulty) {
        case 1: return '쉬움';
        case 2: return '보통';
        case 3: return '어려움';
        default: return '미정';
    }
}

// 검색 결과가 없는 경우 홈으로 리다이렉트
if (window.location.pathname === '/recipes') {
    const recipes = sessionStorage.getItem('searchResults');
    if (!recipes) {
        window.location.href = '/';
    }
} 