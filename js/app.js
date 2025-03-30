// Initialize event storage if it doesn't exist
if (!localStorage.getItem('events')) {
    localStorage.setItem('events', JSON.stringify([]));
}

// Sample data for testing (can be removed later)
const sampleEvents = [
    {
        id: '1',
        title: 'Hegyi túra a Tordai-hasadékhoz',
        date: '2023-12-15',
        location: 'Torda, Románia',
        description: 'Közepes nehézségű túra a gyönyörű Tordai-hasadékhoz. Felszerelés: kényelmes cipő, víz, snack.',
        category: 'hiking',
        participants: ['Kovács János', 'Nagy Anna'],
        comments: [
            {name: 'Kovács János', text: 'Már nagyon várom!', timestamp: '2023-11-20T10:30:00'},
            {name: 'Nagy Anna', text: 'Mennyi idő lesz az egész túra?', timestamp: '2023-11-21T14:15:00'}
        ],
        isPrivate: false,
        routeFile: null
    },
    {
        id: '2',
        title: 'Kerékpártúra a Kolozsvár környékén',
        date: '2023-12-10',
        location: 'Kolozsvár, Románia',
        description: 'Könnyed kerékpáros túra a város környékén. Útvonal hossza kb. 25 km.',
        category: 'biking',
        participants: ['Tóth Béla'],
        comments: [],
        isPrivate: false,
        routeFile: null
    }
];

// Load sample data if no events exist
if (JSON.parse(localStorage.getItem('events')).length === 0) {
    localStorage.setItem('events', JSON.stringify(sampleEvents));
}

// Utility functions
function generateId() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

function getEvents() {
    return JSON.parse(localStorage.getItem('events'));
}

function saveEvents(events) {
    localStorage.setItem('events', JSON.stringify(events));
}

function getEventById(id) {
    const events = getEvents();
    return events.find(event => event.id === id);
}

function updateEvent(updatedEvent) {
    const events = getEvents();
    const index = events.findIndex(event => event.id === updatedEvent.id);
    if (index !== -1) {
        events[index] = updatedEvent;
        saveEvents(events);
    }
}

// Load events on the home page
if (document.getElementById('featured-events')) {
    const eventsContainer = document.getElementById('featured-events');
    const events = getEvents().slice(0, 3); // Show first 3 events on home page
    
    if (events.length > 0) {
        eventsContainer.innerHTML = '';
        events.forEach(event => {
            const eventCard = document.createElement('div');
            eventCard.className = 'bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition';
            eventCard.innerHTML = `
                <img src="https://images.pexels.com/photos/2662816/pexels-photo-2662816.jpeg?auto=compress&cs=tinysrgb&w=600" alt="${event.title}" class="w-full h-48 object-cover">
                <div class="p-4">
                    <div class="flex justify-between items-start mb-2">
                        <h3 class="text-lg font-bold">${event.title}</h3>
                        <span class="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">${getCategoryName(event.category)}</span>
                    </div>
                    <p class="text-gray-600 mb-2"><i class="fas fa-calendar-alt mr-2"></i>${formatDate(event.date)}</p>
                    <p class="text-gray-600 mb-4"><i class="fas fa-map-marker-alt mr-2"></i>${event.location}</p>
                    <a href="event-detail.html?id=${event.id}" class="block text-center bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Részletek</a>
                </div>
            `;
            eventsContainer.appendChild(eventCard);
        });
    }
}

// Load events on the events page
if (document.getElementById('events-container')) {
    const eventsContainer = document.getElementById('events-container');
    const events = getEvents();
    
    if (events.length > 0) {
        eventsContainer.innerHTML = '';
        events.forEach(event => {
            const eventCard = document.createElement('div');
            eventCard.className = 'bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition event-card';
            eventCard.dataset.category = event.category;
            eventCard.innerHTML = `
                <img src="${getCategoryImage(event.category)}" alt="${event.title}" class="w-full h-48 object-cover">
                <div class="p-4">
                    <div class="flex justify-between items-start mb-2">
                        <h3 class="text-lg font-bold">${event.title}</h3>
                        <span class="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">${getCategoryName(event.category)}</span>
                    </div>
                    <p class="text-gray-600 mb-2"><i class="fas fa-calendar-alt mr-2"></i>${formatDate(event.date)}</p>
                    <p class="text-gray-600 mb-4"><i class="fas fa-map-marker-alt mr-2"></i>${event.location}</p>
                    <a href="event-detail.html?id=${event.id}" class="block text-center bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Részletek</a>
                </div>
            `;
            eventsContainer.appendChild(eventCard);
        });
    }
}

// Category filter functionality
if (document.querySelectorAll('.category-filter')) {
    const filterButtons = document.querySelectorAll('.category-filter');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const category = button.dataset.category;
            
            // Update active button
            filterButtons.forEach(btn => {
                btn.classList.remove('bg-blue-700', 'text-white');
                btn.classList.add('bg-gray-200');
            });
            button.classList.remove('bg-gray-200');
            button.classList.add('bg-blue-700', 'text-white');
            
            // Filter events
            const eventCards = document.querySelectorAll('.event-card');
            eventCards.forEach(card => {
                if (category === 'all' || card.dataset.category === category) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// Helper functions
function getCategoryName(category) {
    const categories = {
        hiking: 'Túrázás',
        biking: 'Kerékpározás',
        karting: 'Karting'
    };
    return categories[category] || category;
}

function getCategoryImage(category) {
    const images = {
        hiking: 'https://images.pexels.com/photos/2662816/pexels-photo-2662816.jpeg?auto=compress&cs=tinysrgb&w=600',
        biking: 'https://images.pexels.com/photos/100582/pexels-photo-100582.jpeg?auto=compress&cs=tinysrgb&w=600',
        karting: 'https://images.pexels.com/photos/1263986/pexels-photo-1263986.jpeg?auto=compress&cs=tinysrgb&w=600'
    };
    return images[category] || 'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg?auto=compress&cs=tinysrgb&w=600';
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('hu-HU', options);
}