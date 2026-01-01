const ListEditComponent = {
    sessionKey: null,
    originalFile: null,
    
    render: (params) => {
        if (params) {
            ListEditComponent.sessionKey = params.session;
            ListEditComponent.originalFile = params.file;
        }

        return `
            <div class="activity-container" style="background-color: #f5f5f5;">
                <div class="header">
                    <img src="assets/images/ic_backbutton.png" class="back-btn" id="edit-back-btn" />
                    <div class="header-title" id="edit-title-header">${params ? params.title || 'Edit List' : 'Edit List'}</div>
                    <div class="header-right" id="btn-export" style="font-size: 14px; font-weight: bold; color: white;">EXPORT</div>
                </div>
                <div class="content-scrollable" style="padding: 15px;">
                    
                    <div class="edit-group">
                        <label>Title</label>
                        <input type="text" id="edit-title" class="edit-input" placeholder="Enter Title" />
                    </div>

                    <div class="edit-group">
                        <label>Force Item</label>
                        <input type="text" id="edit-force" class="edit-input" placeholder="Enter Force Item" />
                        <div class="edit-hint">Note: This item must be included in the list below</div>
                    </div>

                    <div class="edit-group" style="flex: 1; display: flex; flex-direction: column;">
                        <label>List Items (One per line)</label>
                        <textarea id="edit-list" class="edit-textarea" placeholder="Item 1\nItem 2\n..."></textarea>
                    </div>

                    <div class="edit-group" style="text-align: center; margin-top: 20px;">
                        <span id="btn-reset-list" style="color: #d9534f; font-weight: bold; text-decoration: underline; cursor: pointer;">RESET LIST</span>
                    </div>

                </div>
            </div>
        `;
    },
    
    init: async (params) => {
        if (!params) {
            console.error('ListEditComponent.init: params required');
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

        // Load Title (from first item)
        const titleInput = document.getElementById('edit-title');
        if (items.length > 0) {
            titleInput.value = items[0].item_title || "";
        }

        // Load Force Item
        const forceInput = document.getElementById('edit-force');
        forceInput.value = Storage.getSession(sessionKey + "force");

        // Load List Items
        const listTextarea = document.getElementById('edit-list');
        listTextarea.value = items.map(i => i.item_name).join('\n');

        // Save Logic
        const saveList = () => {
            const newTitle = titleInput.value.trim();
            const newForce = forceInput.value.trim();
            const newContent = listTextarea.value.trim().split('\n').filter(line => line.trim() !== "");

            // Save Force Item
            Storage.saveSession(sessionKey + "force", newForce);

            // Re-save Items
            // 1. Delete old
            Storage.deleteAllItems(sessionKey);
            
            // 2. Create new objects
            const newItems = newContent.map(name => ({
                item_name: name.trim(),
                item_title: newTitle,
                item_SESSION: sessionKey
            }));

            // 3. Add new
            Storage.addItems(newItems);
            
            console.log("List saved.");
        };

        // Back Button (Auto-save)
        document.getElementById('edit-back-btn').addEventListener('click', () => {
            saveList();
            window.app.navigate('settings');
        });

        // Export
        document.getElementById('btn-export').addEventListener('click', () => {
            saveList();
            // Generate simple shareable text for now
            const shareText = `DFB List: ${titleInput.value}\nForce: ${forceInput.value}\n\n${listTextarea.value}`;
            
            // In a real web app, we might use the Web Share API
            if (navigator.share) {
                navigator.share({
                    title: 'DFB List',
                    text: shareText,
                }).catch(console.error);
            } else {
                // Fallback: Copy to clipboard
                navigator.clipboard.writeText(shareText).then(() => {
                    alert("List copied to clipboard!");
                });
            }
        });

        // Reset
        document.getElementById('btn-reset-list').addEventListener('click', async () => {
            if (confirm("Are you sure you want reset this list?")) {
                Storage.deleteAllItems(sessionKey);
                if (filename) {
                    await Storage.loadAndSaveItems(filename, sessionKey);
                }
                // Reload current view
                window.app.navigate('list_editor', params);
            }
        });
    }
};
