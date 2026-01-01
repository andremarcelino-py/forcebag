const Storage = {
    SESSION_CUSTOM1: 'custom1',
    SESSION_CUSTOM2: 'custom2',
    SESSION_CUSTOM3: 'custom3',
    SESSION_CELEBRITIES: 'celebrities',
    SESSION_SHOPPING: 'shoppinglist',
    SESSION_TUTORIAL: 'tutorial',
    SESSION_IMAGE: 'image_uri',
    TABLE_DAYS: 'days',
    TABLE_DUMMY_NOTES: 'dummy_notes',
    TABLE_NOTES: 'notes', // For user notes? No, likely confusing names.
    
    init: async () => {
        // Init Days
        if (!localStorage.getItem(Storage.TABLE_DAYS)) {
            const days = {
                monday: "Monday",
                tuesday: "Tuesday",
                wednesday: "Wednesday",
                notes: "Notes",
                yesterday: "Yesterday" // Added based on NotesListActivity usage
            };
            localStorage.setItem(Storage.TABLE_DAYS, JSON.stringify([days]));
        }

        // Init Dummy Notes
        if (!localStorage.getItem(Storage.TABLE_DUMMY_NOTES)) {
            try {
                const response = await fetch('assets/json/dummynotes.json');
                const data = await response.json();
                localStorage.setItem(Storage.TABLE_DUMMY_NOTES, JSON.stringify(data.listitems));
            } catch (e) {
                console.error('Failed to load dummynotes', e);
            }
        }

        // Init Custom Lists
        const customSessions = [Storage.SESSION_CUSTOM1, Storage.SESSION_CUSTOM2, Storage.SESSION_CUSTOM3];
        for (const session of customSessions) {
            const items = Storage.findItems(session);
            if (items.length === 0) {
                try {
                    const response = await fetch(`assets/json/${session}.json`);
                    const data = await response.json();
                    
                    // Save force value
                    localStorage.setItem(session + "force", data.force);
                    
                    // Save items
                    const newItems = data.listitems.map(name => ({
                        item_name: name,
                        item_title: data.name,
                        item_SESSION: session
                    }));
                    Storage.addItems(newItems);
                } catch (e) {
                    console.error(`Failed to load ${session}`, e);
                }
            }
        }

        // Init Standard Lists (Celebrities, Shopping) if needed?
        // Logic in Android seems to load them every time in NotesListActivity.addItems?
        // No, Items.find checks if exists.
        
        const standardSessions = [Storage.SESSION_CELEBRITIES, Storage.SESSION_SHOPPING];
        for (const session of standardSessions) {
             const items = Storage.findItems(session);
             if (items.length === 0) {
                 try {
                     const response = await fetch(`assets/json/${session}.json`);
                     const data = await response.json();
                     // Standard lists also have force value in JSON?
                     // Let's check celebrities.json
                 } catch (e) {
                     console.error(`Failed to load ${session}`, e);
                 }
             }
        }
    },

    getDays: () => {
        const days = JSON.parse(localStorage.getItem(Storage.TABLE_DAYS) || "[]");
        return days[0] || { notes: "Notes", yesterday: "Yesterday" };
    },

    getDummyNotes: () => {
        return JSON.parse(localStorage.getItem(Storage.TABLE_DUMMY_NOTES) || "[]");
    },

    // Session / SharedPreferences
    saveSession(key, value) {
        localStorage.setItem(key, value);
    },

    getSession(key) {
        return localStorage.getItem(key) || "";
    },

    clearSession() {
        localStorage.clear();
    },

    // Items (SugarORM simulation)
    getAllItems() {
        const items = localStorage.getItem('items');
        return items ? JSON.parse(items) : [];
    },

    findItems(sessionName) {
        const allItems = this.getAllItems();
        return allItems.filter(item => item.item_SESSION === sessionName);
    },

    addItems(newItems) {
        const allItems = this.getAllItems();
        const updatedItems = [...allItems, ...newItems];
        localStorage.setItem('items', JSON.stringify(updatedItems));
    },

    deleteAllItems(sessionName) {
        const allItems = this.getAllItems();
        const filteredItems = allItems.filter(item => item.item_SESSION !== sessionName);
        localStorage.setItem('items', JSON.stringify(filteredItems));
    },

    // Notes
    getNotes() {
        const notes = localStorage.getItem('notes');
        return notes ? JSON.parse(notes) : [];
    },

    // Days
    saveDays(daysObj) {
        localStorage.setItem(Storage.TABLE_DAYS, JSON.stringify([daysObj]));
    },

    // Load and save items from JSON file
    loadAndSaveItems: async (filename, sessionKey) => {
        try {
            const response = await fetch(filename);
            const data = await response.json();
            
            // Save force value if it exists
            if (data.force) {
                localStorage.setItem(sessionKey + "force", data.force);
            }
            
            // Delete existing items for this session
            Storage.deleteAllItems(sessionKey);
            
            // Create new items
            const newItems = data.listitems.map(name => ({
                item_name: name,
                item_title: data.name || "",
                item_SESSION: sessionKey
            }));
            
            // Add new items
            Storage.addItems(newItems);
        } catch (e) {
            console.error(`Failed to load ${filename}`, e);
        }
    }
};
