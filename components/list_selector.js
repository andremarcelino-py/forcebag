const ListSelectorComponent = {
    sessionKey: null,
    
    render: (params) => {
        if (params) {
            ListSelectorComponent.sessionKey = params.session;
        }
        return `
            <div class="activity-container">
                <div class="header">
                    <img src="assets/images/ic_backbutton.png" class="back-btn" id="list-back-btn" />
                    <div class="header-title" id="list-title">${params ? params.title || 'List' : 'List'}</div>
                    <div class="header-right">
                        <label class="switch">
                            <input type="checkbox" id="hide-toggle">
                            <span class="slider round"></span>
                        </label>
                    </div>
                </div>
                <div class="content-scrollable" id="list-container">
                    <!-- List items will be injected here -->
                </div>
                <div id="hiding-layer" style="position: absolute; top: 60px; left: 0; right: 0; bottom: 0; background: white; z-index: 10; display: none;"></div>
            </div>
        `;
    },
    
    init: async (params) => {
        if (!params) {
            console.error('ListSelectorComponent.init: params required');
            return;
        }
        const sessionKey = params.session;
        const filename = params.file;
        
        // Ensure data is loaded
        let items = Storage.findItems(sessionKey);
        if (items.length === 0 && filename) {
             await Storage.loadAndSaveItems(filename, sessionKey);
             items = Storage.findItems(sessionKey);
        }

        const container = document.getElementById('list-container');
        const currentSelection = parseInt(Storage.getSession(sessionKey) || "0");
        
        // Render Items
        items.forEach((item, index) => {
            const el = document.createElement('div');
            el.className = 'list-item-selector';
            el.innerHTML = `
                <span class="item-text">${item.item_name}</span>
                <img src="assets/images/ic_tick.png" class="item-tick" style="display: ${index === currentSelection ? 'block' : 'none'};" />
            `;
            el.onclick = () => {
                if (document.getElementById('hide-toggle').checked) {
                    // Update selection
                    Storage.saveSession(sessionKey, index.toString());
                    
                    // Update UI
                    const ticks = document.querySelectorAll('.item-tick');
                    ticks.forEach(t => t.style.display = 'none');
                    el.querySelector('.item-tick').style.display = 'block';
                }
            };
            container.appendChild(el);
        });

        // Hide Toggle Logic
        const toggle = document.getElementById('hide-toggle');
        const hideKey = sessionKey + "hide";
        const isHidden = Storage.getSession(hideKey) === "1";
        
        toggle.checked = !isHidden; // "On" means visible
        
        const updateVisibility = () => {
            const visible = toggle.checked;
            const hidingLayer = document.getElementById('hiding-layer');
            if (visible) {
                hidingLayer.style.display = 'none';
                Storage.saveSession(hideKey, "0");
            } else {
                hidingLayer.style.display = 'block';
                Storage.saveSession(hideKey, "1");
            }
        };

        toggle.addEventListener('change', updateVisibility);
        
        // Initialize state
        updateVisibility();

        // Back Button
        document.getElementById('list-back-btn').addEventListener('click', () => {
            window.app.navigate('settings');
        });
    }
};
