// Check if a username is stored in localStorage
document.addEventListener('DOMContentLoaded', () => {
    const username = localStorage.getItem('username');
    if (!username && window.location.pathname !== '/login.html') {
        window.location.href = 'login.html';
    } else if (username) {
        const headerElement = document.querySelector('header h3');
        if (headerElement) {
            headerElement.textContent = `Dark Hours - ${username}`;
        }
    }
});
// Existing balance and last claim
let balance = localStorage.getItem('balance') ? parseInt(localStorage.getItem('balance')) : 0;
let lastClaim = localStorage.getItem('lastClaim') ? new Date(localStorage.getItem('lastClaim')) : null;
let claimTime = 4 * 60 * 60 * 1000; // 4 hours in milliseconds

// Task rewards tracking
let taskRewards = localStorage.getItem('taskRewards') ? JSON.parse(localStorage.getItem('taskRewards')) : {};

// Update balance on page load
function updateBalance() {
    const balanceElement = document.getElementById('balance');
    if (balanceElement) {
        balanceElement.textContent = balance;
    }
}

// Handle claim button and countdown timer
function updateCountdown() {
    const countdownElement = document.getElementById('countdown');
    const claimButton = document.getElementById('claimButton');
    if (lastClaim) {
        const now = new Date();
        const elapsed = now - lastClaim;
        const remaining = claimTime - elapsed;
        if (remaining > 0) {
            const hours = Math.floor(remaining / (1000 * 60 * 60));
            const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
            if (countdownElement) {
                countdownElement.textContent = `Time remaining: ${hours} hours ${minutes} minutes`;
            }
            if (claimButton) {
                claimButton.disabled = true;
            }
        } else {
            if (countdownElement) {
                countdownElement.textContent = '';
            }
            if (claimButton) {
                claimButton.disabled = false;
            }
        }
    }
}

function claimHours() {
    const now = new Date();
    if (!lastClaim || now - lastClaim >= claimTime) {
        balance += 4;
        updateBalance();
        lastClaim = new Date();
        localStorage.setItem('lastClaim', lastClaim);
        localStorage.setItem('balance', balance);
        updateCountdown();
    }
}
// Handle task completion
function startTask(taskId, url) {
    if (taskRewards[taskId]) {
        alert("You have already completed this task and received the reward.");
        return;
    }
    window.open(url, '_blank');
    setTimeout(() => {
        alert("You have received 10 hours for completing the task!");
        balance += 10;
        taskRewards[taskId] = true;
        localStorage.setItem('balance', balance);
        localStorage.setItem('taskRewards', JSON.stringify(taskRewards));
        updateBalance();
    }, 35000); // 35 seconds delay
}

// Initial setup on page load
document.addEventListener('DOMContentLoaded', () => {
    updateBalance();
    updateCountdown();
    setInterval(updateCountdown, 1000);

    // Disable completed tasks
    for (const taskId in taskRewards) {
        if (taskRewards[taskId]) {
            const button = document.querySelector(`button[onclick*="startTask('${taskId}',"]`);
            if (button) {
                button.disabled = true;
button.textContent = "Completed";
            }
        }
    }
})
