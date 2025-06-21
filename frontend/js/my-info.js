// DOM 요소
const ingredientInput = document.getElementById('ingredientInput');
const addIngredientBtn = document.getElementById('addIngredientBtn');
const dislikedIngredientsList = document.getElementById('dislikedIngredientsList');
const logoutBtn = document.getElementById('logoutBtn');

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    checkAuthStatus();
    loadDislikedIngredients();
    setupEventListeners();
});

// 이벤트 리스너 설정
function setupEventListeners() {
    addIngredientBtn.addEventListener('click', addDislikedIngredient);
    ingredientInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addDislikedIngredient();
        }
    });
    logoutBtn.addEventListener('click', logout);
}

// 인증 상태 확인
function checkAuthStatus() {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('로그인이 필요한 페이지입니다.');
        window.location.href = '/login.html';
        return;
    }
}

// 기피 재료 목록 로드
async function loadDislikedIngredients() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/user/disliked-ingredients', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('기피 재료 목록을 불러올 수 없습니다.');
        }

        const ingredients = await response.json();
        displayDislikedIngredients(ingredients);
    } catch (error) {
        console.error('기피 재료 목록 로드 오류:', error);
        alert('기피 재료 목록을 불러오는 중 오류가 발생했습니다.');
    }
}

// 기피 재료 추가
async function addDislikedIngredient() {
    const ingredient = ingredientInput.value.trim();
    
    if (ingredient === '') {
        alert('재료를 입력해주세요.');
        return;
    }

    try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/user/disliked-ingredients', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ ingredient_name: ingredient })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || '기피 재료 추가에 실패했습니다.');
        }

        alert('기피 재료가 등록되었습니다.');
        ingredientInput.value = '';
        loadDislikedIngredients(); // 목록 새로고침
    } catch (error) {
        console.error('기피 재료 추가 오류:', error);
        alert(error.message);
    }
}

// 기피 재료 삭제
async function removeDislikedIngredient(id) {
    if (!confirm('이 기피 재료를 삭제하시겠습니까?')) {
        return;
    }

    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/user/disliked-ingredients/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('기피 재료 삭제에 실패했습니다.');
        }

        alert('기피 재료가 삭제되었습니다.');
        loadDislikedIngredients(); // 목록 새로고침
    } catch (error) {
        console.error('기피 재료 삭제 오류:', error);
        alert('기피 재료 삭제 중 오류가 발생했습니다.');
    }
}

// 기피 재료 목록 표시
function displayDislikedIngredients(ingredients) {
    dislikedIngredientsList.innerHTML = '';
    
    if (ingredients.length === 0) {
        dislikedIngredientsList.innerHTML = '<p class="no-ingredients">등록된 기피 재료가 없습니다.</p>';
        return;
    }

    ingredients.forEach(ingredient => {
        const item = document.createElement('div');
        item.className = 'ingredient-item';
        item.innerHTML = `
            <span class="ingredient-name">${ingredient.ingredient_name}</span>
            <button class="remove-btn" onclick="removeDislikedIngredient(${ingredient.id})">
                <i class="fas fa-times"></i>
            </button>
        `;
        dislikedIngredientsList.appendChild(item);
    });
}

// 로그아웃
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    alert('로그아웃되었습니다.');
    window.location.href = '/';
}

// 전역 함수로 노출
window.removeDislikedIngredient = removeDislikedIngredient; 