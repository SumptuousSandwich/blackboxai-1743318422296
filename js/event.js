// Event detail page functionality
document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const eventId = urlParams.get('id');
    
    if (eventId) {
        const event = getEventById(eventId);
        if (event) {
            // Display event details
            document.getElementById('event-title').textContent = event.title;
            document.getElementById('event-date').textContent = formatDate(event.date);
            document.getElementById('event-location').textContent = event.location;
            document.getElementById('event-description').textContent = event.description;
            document.getElementById('event-category').textContent = getCategoryName(event.category);
            
            // Set up invite link
            const inviteLink = document.getElementById('invite-link');
            inviteLink.value = `${window.location.origin}${window.location.pathname}?id=${event.id}`;
            
            document.getElementById('copy-link').addEventListener('click', () => {
                inviteLink.select();
                document.execCommand('copy');
                alert('Meghívó link másolva!');
            });

            // Initialize map (placeholder - would use Leaflet with GPX/KML in real implementation)
            const map = L.map('map').setView([46.7700, 23.5800], 13); // Default to Cluj-Napoca
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);

            // Load participants
            updateParticipantsList(event);

            // Handle participation
            setupParticipation(event);

            // Load comments
            loadComments(event);

            // Setup comment submission
            document.getElementById('submit-comment').addEventListener('click', () => {
                const commentInput = document.getElementById('comment-input');
                const commentText = commentInput.value.trim();
                
                if (commentText) {
                    const newComment = {
                        name: localStorage.getItem('currentParticipant') || 'Vendég',
                        text: commentText,
                        timestamp: new Date().toISOString()
                    };
                    
                    if (!event.comments) {
                        event.comments = [];
                    }
                    
                    event.comments.push(newComment);
                    updateEvent(event);
                    loadComments(event);
                    commentInput.value = '';
                }
            });

            // ICS file download
            document.getElementById('download-ics').addEventListener('click', () => {
                downloadICS(event);
            });
        } else {
            // Event not found
            window.location.href = '404.html';
        }
    } else {
        // No event ID provided
        window.location.href = 'events.html';
    }
});

function updateParticipantsList(event) {
    const participantsList = document.getElementById('participants-list');
    const participantCount = document.getElementById('participant-count');
    
    if (event.participants && event.participants.length > 0) {
        participantsList.innerHTML = '';
        event.participants.forEach(participant => {
            const li = document.createElement('li');
            li.className = 'flex items-center';
            li.innerHTML = `
                <i class="fas fa-user-circle mr-2 text-gray-500"></i>
                <span>${participant}</span>
            `;
            participantsList.appendChild(li);
        });
        participantCount.textContent = event.participants.length;
    } else {
        participantsList.innerHTML = '<li class="text-gray-500">Még nincsenek résztvevők</li>';
        participantCount.textContent = '0';
    }
}

function setupParticipation(event) {
    const currentParticipant = localStorage.getItem('currentParticipant');
    const joinForm = document.getElementById('join-form');
    const leaveSection = document.getElementById('leave-section');
    
    if (currentParticipant && event.participants.includes(currentParticipant)) {
        // User is already participating
        joinForm.classList.add('hidden');
        leaveSection.classList.remove('hidden');
        
        document.getElementById('leave-button').addEventListener('click', () => {
            event.participants = event.participants.filter(p => p !== currentParticipant);
            updateEvent(event);
            joinForm.classList.remove('hidden');
            leaveSection.classList.add('hidden');
            updateParticipantsList(event);
        });
    } else {
        // User can join
        joinForm.classList.remove('hidden');
        leaveSection.classList.add('hidden');
        
        document.getElementById('join-button').addEventListener('click', () => {
            const participantName = document.getElementById('participant-name').value.trim();
            
            if (participantName) {
                if (!event.participants.includes(participantName)) {
                    event.participants.push(participantName);
                    updateEvent(event);
                    localStorage.setItem('currentParticipant', participantName);
                    joinForm.classList.add('hidden');
                    leaveSection.classList.remove('hidden');
                    updateParticipantsList(event);
                }
            } else {
                alert('Kérjük, add meg a neved!');
            }
        });
    }
}

function loadComments(event) {
    const commentsContainer = document.getElementById('comments-container');
    
    if (event.comments && event.comments.length > 0) {
        commentsContainer.innerHTML = '';
        event.comments.forEach(comment => {
            const commentDiv = document.createElement('div');
            commentDiv.className = 'bg-gray-100 p-4 rounded-lg';
            commentDiv.innerHTML = `
                <div class="flex justify-between items-center mb-2">
                    <span class="font-semibold">${comment.name}</span>
                    <span class="text-sm text-gray-500">${formatDateTime(comment.timestamp)}</span>
                </div>
                <p>${comment.text}</p>
            `;
            commentsContainer.appendChild(commentDiv);
        });
    } else {
        commentsContainer.innerHTML = '<p class="text-gray-500 text-center">Nincsenek hozzászólások</p>';
    }
}

function downloadICS(event) {
    const icsContent = `
BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Kolozsvári Keresztény Sportklub//NONSGML v1.0//EN
BEGIN:VEVENT
UID:${event.id}@kksk.ro
DTSTAMP:${formatDateForICS(new Date())}
DTSTART:${formatDateForICS(new Date(event.date))}
SUMMARY:${event.title}
DESCRIPTION:${event.description}
LOCATION:${event.location}
END:VEVENT
END:VCALENDAR
    `.trim();

    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${event.title.replace(/\s+/g, '_')}.ics`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function formatDateForICS(date) {
    return date.toISOString().replace(/[-:]/g, '').replace(/\..+/, '');
}

function formatDateTime(dateTimeString) {
    const options = { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return new Date(dateTimeString).toLocaleDateString('hu-HU', options);
}