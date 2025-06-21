// DOM 요소
const recipeDetail = document.getElementById('recipeDetail');
const loginBtn = document.getElementById('loginBtn');
const registerBtn = document.getElementById('registerBtn');
const logoutBtn = document.getElementById('logoutBtn');
const myInfoBtn = document.getElementById('myInfoBtn');

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    checkAuthStatus();
    loadRecipeDetail();
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

// 레시피 상세 정보 로드
async function loadRecipeDetail() {
    const recipeId = getRecipeIdFromUrl();
    
    if (!recipeId) {
        showError('레시피 ID를 찾을 수 없습니다.');
        return;
    }
    
    try {
        const response = await fetch(`/api/recipes/${recipeId}`);
        const data = await response.json();
        
        if (response.ok) {
            displayRecipeDetail(data.recipe);
        } else {
            showError(data.message || '레시피를 찾을 수 없습니다.');
        }
    } catch (error) {
        console.error('레시피 상세 정보 로드 오류:', error);
        showError('레시피 정보를 불러오는 중 오류가 발생했습니다.');
    }
}

// URL에서 레시피 ID 추출
function getRecipeIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

// 레시피 상세 정보 표시
function displayRecipeDetail(recipe) {
    // 페이지 제목 업데이트
    document.title = `${recipe.food_name} - FootFit`;
    
    // 재료 목록 HTML
    const ingredientsHtml = recipe.ingredients && recipe.ingredients.length > 0 ?
        recipe.ingredients.map(ingredient => 
            `<li>
                <span>${ingredient.ingredient_name}</span>
                <span>${ingredient.quantity || '적당량'}</span>
            </li>`
        ).join('') :
        '<li>재료 정보가 없습니다.</li>';
    
    recipeDetail.innerHTML = `
        <div class="recipe-header">
            <h1>${recipe.food_name}</h1>
            <div class="recipe-meta">
                <span><i class="fas fa-clock"></i> 시간 미정</span>
                <span><i class="fas fa-star"></i> 미정</span>
                <span><i class="fas fa-user"></i> 인분 미정</span>
            </div>
        </div>
        
        <div class="recipe-content">
            <div class="recipe-section">
                <h3><i class="fas fa-list"></i> 재료</h3>
                <ul class="ingredients-list">
                    ${ingredientsHtml}
                </ul>
            </div>
            
            <div class="recipe-section">
                <h3><i class="fas fa-utensils"></i> 조리 방법</h3>
                <div class="cooking-instructions">
                    ${recipe.recipe ? recipe.recipe.replace(/\\n/g, '<br>') : '조리 방법이 없습니다.'}
                </div>
            </div>
        </div>
    `;
}

// 영양 정보 HTML 생성
function createNutritionHtml(nutrition) {
    const nutritionItems = [
        { key: 'calories', label: '칼로리', unit: 'kcal' },
        { key: 'protein', label: '단백질', unit: 'g' },
        { key: 'fat', label: '지방', unit: 'g' },
        { key: 'carbohydrates', label: '탄수화물', unit: 'g' },
        { key: 'fiber', label: '식이섬유', unit: 'g' },
        { key: 'sugar', label: '당류', unit: 'g' },
        { key: 'sodium', label: '나트륨', unit: 'mg' },
        { key: 'cholesterol', label: '콜레스테롤', unit: 'mg' }
    ];
    
    return nutritionItems.map(item => {
        const value = nutrition[item.key];
        if (value !== undefined && value !== null) {
            return `
                <div class="nutrition-item">
                    <div class="nutrition-value">${value}${item.unit}</div>
                    <div class="nutrition-label">${item.label}</div>
                </div>
            `;
        }
        return '';
    }).join('');
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

// 에러 표시
function showError(message) {
    recipeDetail.innerHTML = `
        <div style="text-align: center; padding: 3rem;">
            <i class="fas fa-exclamation-triangle" style="font-size: 4rem; color: #ff6b6b; margin-bottom: 1rem;"></i>
            <h3>오류가 발생했습니다</h3>
            <p>${message}</p>
            <a href="/recipes" class="btn btn-primary">
                <i class="fas fa-arrow-left"></i> 레시피 목록으로 돌아가기
            </a>
        </div>
    `;
} 