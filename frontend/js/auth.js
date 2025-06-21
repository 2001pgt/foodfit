// DOM 요소
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const logoutBtn = document.getElementById('logoutBtn');
const myInfoBtn = document.getElementById('myInfoBtn');

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    setupAuthForms();
    checkAuthStatus();
});

// 인증 폼 설정
function setupAuthForms() {
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
}

// 로그인 처리
async function handleLogin(e) {
    e.preventDefault();
    
    const user_id = document.getElementById('user_id').value;
    const password = document.getElementById('password').value;
    
    if (!user_id || !password) {
        alert('모든 필드를 입력해주세요.');
        return;
    }
    
    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user_id, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // 토큰과 사용자 정보 저장
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            
            alert('로그인 성공!');
            window.location.href = '/';
        } else {
            alert(data.message || '로그인에 실패했습니다.');
        }
    } catch (error) {
        console.error('로그인 오류:', error);
        alert('로그인 중 오류가 발생했습니다.');
    }
}

// 회원가입 처리
async function handleRegister(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const user_id = document.getElementById('user_id').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (!username || !user_id || !password || !confirmPassword) {
        alert('모든 필드를 입력해주세요.');
        return;
    }
    
    if (password !== confirmPassword) {
        alert('비밀번호가 일치하지 않습니다.');
        return;
    }
    
    if (password.length < 6) {
        alert('비밀번호는 최소 6자 이상이어야 합니다.');
        return;
    }
    
    try {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, user_id, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            alert('회원가입이 완료되었습니다! 로그인해주세요.');
            window.location.href = '/login';
        } else {
            if (data.errors) {
                const errorMessages = data.errors.map(error => error.msg).join('\n');
                alert(errorMessages);
            } else {
                alert(data.message || '회원가입에 실패했습니다.');
            }
        }
    } catch (error) {
        console.error('회원가입 오류:', error);
        alert('회원가입 중 오류가 발생했습니다.');
    }
}

function checkAuthStatus() {
    const token = localStorage.getItem('token');
    
    // 네비게이션 버튼들이 존재하는 경우에만 처리
    if (logoutBtn && myInfoBtn) {
        if (token) {
            logoutBtn.style.display = 'inline-flex';
            myInfoBtn.style.display = 'inline-flex';
        } else {
            logoutBtn.style.display = 'none';
            myInfoBtn.style.display = 'none';
        }
    }
    
    // 로그인/회원가입 폼이 존재하는 경우에만 처리 (별도 페이지에서는 숨기지 않음)
    // 메인 페이지에서만 폼을 숨기고 보이는 로직을 처리
} 