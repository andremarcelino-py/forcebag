const App = {
    currentView: null,
    routes: {
        'home': HomeComponent,
        'perform': PerformComponent,
        'about': AboutComponent,
        'instructions': InstructionsComponent,
        'settings': SettingsComponent,
        'list_selector': ListSelectorComponent,
        'list_editor': ListEditComponent,
        'dummy_notes': DummyNotesComponent,
        'languages': LanguagesComponent,
        'notes_list': NotesListComponent,
        'notes_detail': NotesDetailComponent,
        'instruction': InstructionComponent
    },

    init: async () => {
        await Storage.init();
        App.navigate('home');
    },

    navigate: (route, params) => {
        const component = App.routes[route];
        if (component) {
            const appDiv = document.getElementById('app');
            appDiv.innerHTML = component.render(params);
            if (component.init) {
                component.init(params);
            }
            App.currentView = route;
        } else {
            console.error('Route not found:', route);
            alert('Route not implemented yet: ' + route);
        }
    }
};

window.app = App;

// Prevent zoom on double tap (HyperOS compatibility)
let lastTouchEnd = 0;
document.addEventListener('touchend', function (event) {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) {
        event.preventDefault();
    }
    lastTouchEnd = now;
}, false);

// Prevent default touch behaviors that might interfere
document.addEventListener('touchmove', function (e) {
    // Allow scrolling in scrollable containers
    const target = e.target;
    const isScrollable = target.closest('.content-scrollable, .perform-content, .edit-textarea');
    if (!isScrollable) {
        // Prevent default only if not in scrollable area
        if (e.touches.length > 1) {
            e.preventDefault(); // Prevent pinch zoom
        }
    }
}, { passive: false });

// Prevent context menu on long press (except for inputs)
document.addEventListener('contextmenu', function (e) {
    if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        e.preventDefault();
    }
}, false);

// Optimize for HyperOS/Poco X6 Pro
document.addEventListener('DOMContentLoaded', () => {
    // Set viewport height for mobile browsers
    const setViewportHeight = () => {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    
    setViewportHeight();
    window.addEventListener('resize', setViewportHeight);
    window.addEventListener('orientationchange', () => {
        setTimeout(setViewportHeight, 100);
    });
    
    App.init();
});
