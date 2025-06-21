// 전역 변수
let selectedIngredients = [];
let allIngredients = [];

// DOM 요소
const ingredientInput = document.getElementById('ingredientInput');
const addIngredientBtn = document.getElementById('addIngredientBtn');
const ingredientSuggestions = document.getElementById('ingredientSuggestions');
const ingredientTags = document.getElementById('ingredientTags');
const searchRecipesBtn = document.getElementById('searchRecipesBtn');
const loginBtn = document.getElementById('loginBtn');
const registerBtn = document.getElementById('registerBtn');
const logoutBtn = document.getElementById('logoutBtn');
const myInfoBtn = document.getElementById('myInfoBtn');

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    loadAllIngredients();
    checkAuthStatus();
    setupEventListeners();
});

// 이벤트 리스너 설정
function setupEventListeners() {
    // 재료 입력 이벤트
    ingredientInput.addEventListener('input', handleIngredientInput);
    ingredientInput.addEventListener('keypress', handleIngredientKeypress);
    
    // 재료 추가 버튼
    addIngredientBtn.addEventListener('click', addIngredient);
    
    // 요리 찾기 버튼
    searchRecipesBtn.addEventListener('click', searchRecipes);
    
    // 로그아웃 버튼
    logoutBtn.addEventListener('click', logout);
    
    // 클릭 이벤트로 제안 목록 숨기기
    document.addEventListener('click', function(e) {
        if (!ingredientInput.contains(e.target) && !ingredientSuggestions.contains(e.target)) {
            ingredientSuggestions.style.display = 'none';
        }
    });
}

// 모든 재료 목록 로드
async function loadAllIngredients() {
    try {
        const response = await fetch('/api/ingredients');
        const data = await response.json();
        allIngredients = data.ingredients;
    } catch (error) {
        console.error('재료 목록 로드 오류:', error);
    }
}

// 재료 입력 처리
function handleIngredientInput() {
    const query = ingredientInput.value.trim();
    
    if (query.length === 0) {
        ingredientSuggestions.style.display = 'none';
        return;
    }
    
    // 재료 검색
    const suggestions = allIngredients.filter(ingredient => 
        ingredient.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 10);
    
    displaySuggestions(suggestions);
}

// 재료 입력 키보드 이벤트
function handleIngredientKeypress(e) {
    if (e.key === 'Enter') {
        addIngredient();
    }
}

// 제안 목록 표시
function displaySuggestions(suggestions) {
    if (suggestions.length === 0) {
        ingredientSuggestions.style.display = 'none';
        return;
    }
    
    ingredientSuggestions.innerHTML = '';
    
    suggestions.forEach(ingredient => {
        const item = document.createElement('div');
        item.className = 'suggestion-item';
        item.textContent = ingredient;
        item.addEventListener('click', () => {
            ingredientInput.value = ingredient;
            ingredientSuggestions.style.display = 'none';
            addIngredient();
        });
        ingredientSuggestions.appendChild(item);
    });
    
    ingredientSuggestions.style.display = 'block';
}

// 재료 추가
function addIngredient() {
    const ingredient = ingredientInput.value.trim();
    
    if (ingredient === '') {
        alert('재료를 입력해주세요.');
        return;
    }
    
    if (selectedIngredients.includes(ingredient)) {
        alert('이미 추가된 재료입니다.');
        return;
    }
    
    selectedIngredients.push(ingredient);
    ingredientInput.value = '';
    ingredientSuggestions.style.display = 'none';
    updateIngredientTags();
}

// 재료 태그 업데이트
function updateIngredientTags() {
    ingredientTags.innerHTML = '';
    
    selectedIngredients.forEach(ingredient => {
        const tag = document.createElement('div');
        tag.className = 'ingredient-tag';
        tag.innerHTML = `
            <span>${ingredient}</span>
            <button class="remove-btn" onclick="removeIngredient('${ingredient}')">
                <i class="fas fa-times"></i>
            </button>
        `;
        ingredientTags.appendChild(tag);
    });
}

// 재료 제거
function removeIngredient(ingredient) {
    selectedIngredients = selectedIngredients.filter(item => item !== ingredient);
    updateIngredientTags();
}

// 요리 검색
async function searchRecipes() {
    if (selectedIngredients.length === 0) {
        alert('재료를 하나 이상 선택해주세요.');
        return;
    }
    
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('로그인이 필요한 기능입니다. 로그인 페이지로 이동합니다.');
            window.location.href = '/login.html';
            return;
        }

        const ingredients = selectedIngredients.join(',');
        
        // URL 파라미터로 재료 전달
        window.location.href = `recipes.html?ingredients=${encodeURIComponent(ingredients)}`;
    } catch (error) {
        console.error('요리 검색 오류:', error);
        alert('검색 중 오류가 발생했습니다.');
    }
}

// 인증 상태 확인
function checkAuthStatus() {
    const token = localStorage.getItem('token');
    
    if (token) {
        loginBtn.style.display = 'none';
        registerBtn.style.display = 'none';
        logoutBtn.style.display = 'inline-flex';
        myInfoBtn.style.display = 'inline-flex';
    } else {
        loginBtn.style.display = 'inline-flex';
        registerBtn.style.display = 'inline-flex';
        logoutBtn.style.display = 'none';
        myInfoBtn.style.display = 'none';
    }
}

// 로그아웃
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    checkAuthStatus();
    alert('로그아웃되었습니다.');
}

// 전역 함수로 노출
window.removeIngredient = removeIngredient; 