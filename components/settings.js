const SettingsComponent = {
    render: () => {
        return `
            <div class="activity-container" style="background-color: #f5f5f5;">
                <div class="header">
                    <img src="assets/images/ic_backbutton.png" class="back-btn" id="settings-back-btn" />
                    <div class="header-title">Settings</div>
                </div>
                <div class="content-scrollable" style="padding: 0; background-color: #f5f5f5;">
                    
                    <!-- Set Force Items -->
                    <div class="settings-group-title">SET FORCE ITEMS</div>
                    <div class="settings-item" id="btn-celebrities">
                        <span>Celebrities</span>
                        <img src="assets/images/ic_arrow.png" class="settings-arrow" />
                    </div>
                    <div class="settings-item" id="btn-shopping">
                        <span>Shopping List</span>
                        <img src="assets/images/ic_arrow.png" class="settings-arrow" />
                    </div>
                    <div class="settings-desc">Choose the force items for celebrity and shopping lists.</div>

                    <!-- Set List Items -->
                    <div class="settings-group-title">SET LIST ITEMS</div>
                    <div class="settings-item" id="btn-custom1">
                        <span>Custom 1</span>
                        <img src="assets/images/ic_arrow.png" class="settings-arrow" />
                    </div>
                    <div class="settings-item" id="btn-custom2">
                        <span>Custom 2</span>
                        <img src="assets/images/ic_arrow.png" class="settings-arrow" />
                    </div>
                    <div class="settings-item" id="btn-custom3">
                        <span>Custom 3</span>
                        <img src="assets/images/ic_arrow.png" class="settings-arrow" />
                    </div>
                    <div class="settings-desc">Create and modify custom list</div>

                    <!-- Customise Dummy Notes -->
                    <div class="settings-group-title">CUSTOMISE DUMMY NOTES</div>
                    <div class="settings-item" id="btn-dummy-notes">
                        <span>Customise Dummy Notes Text</span>
                        <img src="assets/images/ic_arrow.png" class="settings-arrow" />
                    </div>
                    <div class="settings-desc">Set the text displayed by dummy notes</div>

                    <!-- Customise Language -->
                    <div class="settings-group-title">CUSTOMISE LANGUAGE</div>
                    <div class="settings-item" id="btn-language">
                        <span>Customise Text For Language</span>
                        <img src="assets/images/ic_arrow.png" class="settings-arrow" />
                    </div>
                    <div class="settings-desc">Configure in-app text for your language</div>

                    <!-- Set Wallpaper -->
                    <div class="settings-group-title">SET WALLPAPER</div>
                    <div class="settings-desc">Set the wallpaper behind the icons</div>
                    
                    <div style="display: flex; padding: 10px;">
                        <div class="app-button" id="btn-set-image" style="flex: 1; margin-right: 5px; text-align: center;">
                            Set Image <img src="assets/images/ic_add.png" style="width: 20px; vertical-align: middle;" />
                        </div>
                        <div class="app-button" id="btn-clear-image" style="flex: 1; margin-left: 5px; text-align: center;">
                            Clear Image <img src="assets/images/ic_eraser.png" style="width: 20px; vertical-align: middle;" />
                        </div>
                    </div>

                    <div style="text-align: center; margin-bottom: 20px;">
                        <img id="settings-bg-preview" src="assets/images/background.png" style="max-height: 200px; max-width: 100%; border: 1px solid #ccc;" />
                    </div>
                    <input type="file" id="file-input" accept="image/*" style="display: none;" />

                    <div style="text-align: center; padding: 20px; color: #888;">
                        DFB 1.0.1
                    </div>

                </div>
            </div>
        `;
    },
    init: () => {
        document.getElementById('settings-back-btn').addEventListener('click', () => {
            window.app.navigate('home');
        });

        // Navigation Handlers
        document.getElementById('btn-celebrities').addEventListener('click', () => {
            window.app.navigate('list_selector', { 
                session: Storage.SESSION_CELEBRITIES, 
                title: 'Celebrities',
                file: 'assets/json/celebrities.json'
            });
        });

        document.getElementById('btn-shopping').addEventListener('click', () => {
            window.app.navigate('list_selector', { 
                session: Storage.SESSION_SHOPPING, 
                title: 'Shopping List',
                file: 'assets/json/shoppinglist.json'
            });
        });

        document.getElementById('btn-custom1').addEventListener('click', () => {
            window.app.navigate('list_editor', { 
                session: Storage.SESSION_CUSTOM1, 
                title: 'Custom 1',
                file: 'assets/json/custom1.json'
            });
        });

        document.getElementById('btn-custom2').addEventListener('click', () => {
            window.app.navigate('list_editor', { 
                session: Storage.SESSION_CUSTOM2, 
                title: 'Custom 2',
                file: 'assets/json/custom2.json'
            });
        });

        document.getElementById('btn-custom3').addEventListener('click', () => {
            window.app.navigate('list_editor', { 
                session: Storage.SESSION_CUSTOM3, 
                title: 'Custom 3',
                file: 'assets/json/custom3.json'
            });
        });
        
        document.getElementById('btn-dummy-notes').addEventListener('click', () => {
             window.app.navigate('dummy_notes');
        });

        document.getElementById('btn-language').addEventListener('click', () => {
             window.app.navigate('languages');
        });

        // Wallpaper Logic
        const bgPreview = document.getElementById('settings-bg-preview');
        const currentBg = Storage.getSession(Storage.SESSION_IMAGE);
        if (currentBg) {
            bgPreview.src = currentBg;
        }

        document.getElementById('btn-set-image').addEventListener('click', () => {
            document.getElementById('file-input').click();
        });

        document.getElementById('file-input').addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const dataUrl = event.target.result;
                    Storage.saveSession(Storage.SESSION_IMAGE, dataUrl);
                    bgPreview.src = dataUrl;
                    alert("Wallpaper updated!");
                };
                reader.readAsDataURL(file);
            }
        });

        document.getElementById('btn-clear-image').addEventListener('click', () => {
            if (confirm("Are you sure you want clear wallpaper? \n\nNote: Default image will set as your wallpaper")) {
                Storage.saveSession(Storage.SESSION_IMAGE, "");
                bgPreview.src = "assets/images/background.png";
            }
        });
    }
};
