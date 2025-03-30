// Create event page functionality
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('create-event-form');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const eventName = document.getElementById('event-name').value;
        const eventDate = document.getElementById('event-date').value;
        const eventLocation = document.getElementById('event-location').value;
        const eventDescription = document.getElementById('event-description').value;
        const eventCategory = document.getElementById('event-category').value;
        const isPrivate = document.getElementById('private-event').checked;
        const routeFile = document.getElementById('route-file').files[0];
        
        if (!eventName || !eventDate || !eventLocation || !eventDescription) {
            alert('Kérjük, töltsd ki az összes kötelező mezőt!');
            return;
        }
        
        const newEvent = {
            id: generateId(),
            title: eventName,
            date: eventDate,
            location: eventLocation,
            description: eventDescription,
            category: eventCategory,
            participants: [],
            comments: [],
            isPrivate: isPrivate,
            routeFile: null
        };
        
        // In a real app, we would upload and process the route file here
        if (routeFile) {
            alert('Az útvonal fájl feltöltése sikeres volt! (Ez egy demo, a fájl nem kerül mentésre)');
        }
        
        // Save the new event
        const events = getEvents();
        events.push(newEvent);
        saveEvents(events);
        
        // Redirect to event detail page
        window.location.href = `event-detail.html?id=${newEvent.id}`;
    });
});

// Make utility functions available
function generateId() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

function getEvents() {
    return JSON.parse(localStorage.getItem('events'));
}

function saveEvents(events) {
    localStorage.setItem('events', JSON.stringify(events));
}