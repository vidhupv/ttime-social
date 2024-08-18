// DOM elements
const profileBtn = document.getElementById('profileBtn');
const feedBtn = document.getElementById('feedBtn');
const recommendBtn = document.getElementById('recommendBtn');
const profileView = document.getElementById('profileView');
const feedView = document.getElementById('feedView');
const recommendView = document.getElementById('recommendView');
const userInfo = document.getElementById('userInfo');
const userActivity = document.getElementById('userActivity');
const friendsFeed = document.getElementById('friendsFeed');
const newActivityForm = document.getElementById('newActivityForm');
const activityType = document.getElementById('activityType');
const activityContent = document.getElementById('activityContent');

// Sample user data (you might want to fetch this from the server in a real application)
const user = {
    id: 1,
    name: 'Vidhu P V',
    dpURL: 'https://media.licdn.com/dms/image/D5603AQEUXPPpzIxlQg/profile-displayphoto-shrink_200_200/0/1693378871682?e=2147483647&v=beta&t=AmZuJ3JnFS7kjHT33l1brxoDJCPwGunmD5WK-sO5GwI',
};

// API functions
async function fetchActivities() {
    try {
        const response = await fetch('/api/activities');
        if (!response.ok) {
            throw new Error('Failed to fetch activities');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching activities:', error);
        return [];
    }
}

async function createActivity(activity) {
    try {
        const response = await fetch('/api/activities', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(activity),
        });
        if (!response.ok) {
            throw new Error('Failed to create activity');
        }
        return await response.json();
    } catch (error) {
        console.error('Error creating activity:', error);
        return null;
    }
}

async function deleteActivity(id) {
    try {
        const response = await fetch(`/api/activities/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error('Failed to delete activity');
        }
        return true;
    } catch (error) {
        console.error('Error deleting activity:', error);
        return false;
    }
}
// UI functions
function showView(view) {
    profileView.style.display = 'none';
    feedView.style.display = 'none';
    recommendView.style.display = 'none';
    view.style.display = 'block';
}

function renderProfile() {
    userInfo.innerHTML = `
        <img src="${user.dpURL}" alt="${user.name}" class="dpURL">
        <h3>${user.name}</h3>
    `;
    renderUserActivities();
}

async function renderUserActivities() {
    const activities = await fetchActivities();
    const userActivities = activities.filter(activity => activity.userId === user.id);
    userActivity.innerHTML = userActivities.map(activity => `
        <div class="activity">
            <p>${getEmojiForType(activity.type)} ${activity.type}: ${activity.content}</p>
            <small>${new Date(activity.timestamp).toLocaleString()}</small>
            <button class="delete-btn" data-id="${activity.id}">Delete</button>
        </div>
    `).join('');
    
    // Add event listeners for delete buttons
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const id = parseInt(e.target.getAttribute('data-id'));
            if (await deleteActivity(id)) {
                await renderUserActivities(); // Re-render after successful deletion
            } else {
                alert('Failed to delete activity. Please try again.');
            }
        });
    });
}

async function renderFeed() {
    const activities = await fetchActivities();
    friendsFeed.innerHTML = activities.map(activity => `
        <div class="friend-activity">
            <p><strong>User ${activity.userId}</strong> ${getEmojiForType(activity.type)} ${activity.type}: ${activity.content}</p>
            <small>${new Date(activity.timestamp).toLocaleString()}</small>
        </div>
    `).join('');
}

function getEmojiForType(type) {
    switch (type) {
        case 'watching':
            return '📺';
        case 'reading':
            return '📚';
        case 'listening':
            return '🎵';
        default:
            return '';
    }
}

// Event listeners
profileBtn.addEventListener('click', () => {
    showView(profileView);
    renderProfile();
});

feedBtn.addEventListener('click', () => {
    showView(feedView);
    renderFeed();
});

recommendBtn.addEventListener('click', () => showView(recommendView));

newActivityForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const newActivity = {
        userId: user.id,
        type: activityType.value,
        content: activityContent.value
    };
    const createdActivity = await createActivity(newActivity);
    if (createdActivity) {
        activityContent.value = '';
        renderUserActivities();
    }
});

// Initial render
showView(profileView);
renderProfile();