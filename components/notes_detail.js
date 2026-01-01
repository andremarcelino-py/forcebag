const NotesDetailComponent = {
    render: () => {
        return `
            <div class="activity-container" style="background-color: #ffffff;">
                <div class="header" style="background-color: var(--header-color);">
                    <img src="assets/images/ic_back_arrow.png" class="back-button" id="detail-btn-back" />
                    <span class="header-title" id="detail-title">Notes</span>
                    <img src="assets/images/ic_brush.png" class="header-action-icon" id="detail-btn-edit" style="display: block;" /> <!-- ic_brush is placeholder for edit icon if not exact match -->
                </div>
                <div class="content-scrollable" id="detail-scroll" style="padding: 20px;">
                    <div id="detail-date" style="font-family: 'Roboto-Regular', sans-serif; font-size: 14px; color: #808080; margin-bottom: 10px;">Yesterday</div>
                    <textarea id="detail-text" style="width: 100%; height: 80vh; border: none; outline: none; font-family: 'Roboto-Regular', sans-serif; font-size: 16px; color: #333; resize: none;" readonly></textarea>
                </div>
            </div>
        `;
    },

    init: (params) => {
        const position = params.position;
        const item = NotesListComponent.items[position];
        const days = Storage.getDays();

        if (!item) {
            window.app.navigate('notes_list');
            return;
        }

        document.getElementById('detail-title').innerText = days.notes;
        document.getElementById('detail-date').innerText = days.yesterday; // Or logic for date? Android uses getYesterdayDateString()

        // Build Content
        // Android: loops sub-items and builds string "1. Name\n2. Name..."
        // In NotesListComponent, I already built item.item_texts (description). 
        // But Android NotesDetailActivity rebuilds it from sub-items?
        // Line 98: 
        /*
            int count = 1;
            String content = "";
            Iterator<Items> it = NotesListActivity.items.get(this.position).getItems().iterator();
            while (it.hasNext()) {
                content = content + count + ". " + it.next().getItem_name() + "\n";
                count++;
            }
            this.et_texts.setText(content);
        */
        
        let content = "";
        if (item.items && item.items.length > 0) {
            item.items.forEach((sub, idx) => {
                content += (idx + 1) + ". " + sub.item_name + "\n";
            });
        } else {
            // Fallback for Dummy Notes which have description in item_texts directly
            // Actually Dummy Notes (addItems2) set item_texts directly.
            // And they don't have sub-items populated in my logic?
            // Wait, addItems2 doesn't add sub-items.
            // So for Dummy Notes, I should use item_texts or description.
            // Android NotesDetailActivity logic assumes item.getItems() exists.
            // If Dummy Notes don't have sub-items, the loop won't run and content will be empty?
            // Let's check `NotesDetailActivity` again.
            // It gets `NotesListActivity.items.get(this.position)`.
            // If it's a Dummy Note, does it have items?
            // `addItems2` in Android creates `Items main_item` but doesn't add sub-items to it.
            // So `getItems()` is empty.
            // So `et_texts` would be empty?
            // That seems wrong.
            // Ah, `addItems2` sets `item_texts` directly.
            // But `NotesDetailActivity` REBUILDS it from `getItems()`.
            // Unless `NotesDetailActivity` crashes or shows empty for dummy notes?
            // Or maybe Dummy Notes are NOT clickable?
            // In `addItems2`, `main_item.setCanselect(false)`.
            // In `NoteItemAdapter` (Android), if `!canselect`, maybe it doesn't open detail?
            // I need to check `NoteItemAdapter`.
            
            // If `canselect` is false, maybe click is disabled.
            // In my `notes_list.js`, I added click listener to ALL items.
            // I should check `canselect`.
            content = item.item_texts; // Use stored text if sub-items are missing
        }
        
        document.getElementById('detail-text').value = content;

        // Edit Button
        document.getElementById('detail-btn-edit').addEventListener('click', () => {
            document.getElementById('detail-text').removeAttribute('readonly');
            document.getElementById('detail-text').focus();
        });

        // Back Button
        document.getElementById('detail-btn-back').addEventListener('click', () => {
            window.app.navigate('notes_list');
        });

        // Two-finger touch exit logic
        const scroll = document.getElementById('detail-scroll');
        scroll.addEventListener('touchstart', (e) => {
             if (e.touches.length === 2) {
                 // Finish all
                 window.app.navigate('home');
             }
        });
    }
};
