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


// Sample data
const user = {
    name: 'Vidhu P V',
    dpURL: 'https://media.licdn.com/dms/image/D5603AQEUXPPpzIxlQg/profile-displayphoto-shrink_200_200/0/1693378871682?e=2147483647&v=beta&t=AmZuJ3JnFS7kjHT33l1brxoDJCPwGunmD5WK-sO5GwI',
    activities: [
        { type: 'Watching:', content: 'Deadpool and Wolverine' },
        { type: 'Reading:', content: 'The Intel Trinity' },
        { type: 'Listening to:', content: 'Lithonia' }
    ]
};

const friends = [
    { name: 'Alice', dpURL: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBbEJdzbfR45OfgFLca2WE_HCerUGRYmCGGQ&s', activity: { type: 'Watching:', content: 'Breaking Bad' } },
    { name: 'Bob', dpURL: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQGd5qgLAocViyp1I_INuHGdMIW2zPiLPdIsw&s', activity: { type: 'Reading:', content: '1984' } },
    { name: 'Charlie', dpURL: 'https://www.thetimes.com/imageserver/image/%2Fmethode%2Ftimes%2Fprod%2Fweb%2Fbin%2F55fde6c6-890f-11ec-8600-c48a9935f856.jpg?crop=510%2C765%2C5%2C8', activity: { type: 'Listening to:', content: 'Stairway to Heaven' } }
];

// View switching
function showView(view) {
    profileView.style.display = 'none';
    feedView.style.display = 'none';
    recommendView.style.display = 'none';
    view.style.display = 'block';
}


// Event listeners for navigation
profileBtn.addEventListener('click', () => showView(profileView));
feedBtn.addEventListener('click', () => showView(feedView));
recommendBtn.addEventListener('click', () => showView(recommendView));

//  User profile render
function renderProfile() {
    userInfo.innerHTML = `
        <img src="${user.dpURL}"  class='dpURL'>
        <h3>${user.name}</h3>
    `;
    userActivity.innerHTML = user.activities.map(activity => 
        `<p>${getActivityEmoji(activity.type)} ${activity.type} ${activity.content}</p>`
    ).join('');
}

//  Friend feed render
function renderFeed() {
    friendsFeed.innerHTML = friends.map(friend => `
        <div class="friend-activity">
            <img src="${friend.dpURL}" alt="${friend.name}" class="dpURL">
            <div class="friend-info">
                <h3>${friend.name}</h3>
                <p>${getActivityEmoji(friend.activity.type)} ${friend.activity.type} ${friend.activity.content}</p>
            </div>
        </div>
    `).join('');
}

// Helper function to get emoji for activity type
function getActivityEmoji(type) {
    switch (type) {
        case 'Watching:': return '📺';
        case 'Reading:': return '📚';
        case 'Listening to:': return '🎵';
        default: return '❓';
    }
}

function handleNewActivity(e) {
    e.preventDefault();
    const newActivity = {
        type: activityType.value,
        content: activityContent.value
    };
    saveUserActivity(newActivity);
    activityType.value = '';
    activityContent.value = '';
}



newActivityForm.addEventListener('submit', handleNewActivity);




//Replaced Local Storage with API call
async function saveUserActivity(activity) {
    try {
        const response = await fetch('/api/activities', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(activity),
        });
        if (!response.ok) throw new Error('Failed to save activity');
        const savedActivity = await response.json();
        user.activities.unshift(savedActivity);
        renderProfile();
    } catch (error) {
        console.error('Error saving activity:', error);
        alert('Failed to save activity. Please try again.');
    }
}

async function loadUserActivities() {
    try {
        const response = await fetch('/api/activities');
        if (!response.ok) throw new Error('Failed to load activities');
        user.activities = await response.json();
        renderProfile();
    } catch (error) {
        console.error('Error loading activities:', error);
        userActivity.innerHTML = '<p style="color: red;">Failed to load activities. Please refresh the page.</p>';
    }
}



// Load saved activities on startup
document.addEventListener('DOMContentLoaded', loadUserActivities);
// Initial render
renderProfile();
renderFeed();
showView(profileView);