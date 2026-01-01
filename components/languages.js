const LanguagesComponent = {
    render: () => {
        return `
            <div class="screen" style="background-color: #f0f0f0;">
                <div class="header" style="background-color: var(--header-color);">
                    <img src="assets/images/ic_back_arrow.png" class="back-button" id="btn-back" />
                    <span class="header-title">Languages</span>
                    <span class="header-action" id="btn-reset" style="display: block;">Reset</span>
                </div>
                <div class="content" style="padding: 0;">
                    
                    <!-- General Section -->
                    <div class="settings-group-title" style="margin-left: 15px; margin-top: 25px; margin-bottom: 10px;">GENERAL</div>
                    <div style="background-color: white; padding: 5px 0;">
                        <div style="display: flex; align-items: center; padding: 10px;">
                            <span style="font-size: 14px; color: var(--setting-headingcolor); width: 100px;">Notes:</span>
                            <input type="text" id="et-notes" style="flex: 1; border: none; text-align: right; font-size: 14px; color: var(--setting-headingcolor); outline: none;">
                        </div>
                    </div>

                    <!-- Days Section -->
                    <div class="settings-group-title" style="margin-left: 10px; margin-top: 25px; margin-bottom: 10px;">DAYS</div>
                    
                    <div style="background-color: white; padding: 5px 0;">
                        <div style="display: flex; align-items: center; padding: 10px;">
                            <span style="font-size: 14px; color: var(--setting-headingcolor); width: 100px;">Yesterday:</span>
                            <input type="text" id="et-yesterday" style="flex: 1; border: none; text-align: right; font-size: 14px; color: var(--setting-headingcolor); outline: none;">
                        </div>
                    </div>
                    <div style="height: 1px; background-color: #e0e0e0;"></div>

                    <div style="background-color: white; padding: 5px 0;">
                        <div style="display: flex; align-items: center; padding: 10px;">
                            <span style="font-size: 14px; color: var(--setting-headingcolor); width: 100px;">Monday:</span>
                            <input type="text" id="et-monday" style="flex: 1; border: none; text-align: right; font-size: 14px; color: var(--setting-headingcolor); outline: none;">
                        </div>
                    </div>
                    <div style="height: 1px; background-color: #e0e0e0;"></div>

                    <div style="background-color: white; padding: 5px 0;">
                        <div style="display: flex; align-items: center; padding: 10px;">
                            <span style="font-size: 14px; color: var(--setting-headingcolor); width: 100px;">Tuesday:</span>
                            <input type="text" id="et-tuesday" style="flex: 1; border: none; text-align: right; font-size: 14px; color: var(--setting-headingcolor); outline: none;">
                        </div>
                    </div>
                    <div style="height: 1px; background-color: #e0e0e0;"></div>

                    <div style="background-color: white; padding: 5px 0;">
                        <div style="display: flex; align-items: center; padding: 10px;">
                            <span style="font-size: 14px; color: var(--setting-headingcolor); width: 100px;">Wednesday:</span>
                            <input type="text" id="et-wednesday" style="flex: 1; border: none; text-align: right; font-size: 14px; color: var(--setting-headingcolor); outline: none;">
                        </div>
                    </div>
                    <div style="height: 1px; background-color: #e0e0e0;"></div>

                </div>
            </div>
        `;
    },

    init: () => {
        const days = Storage.getDays();
        
        const etNotes = document.getElementById('et-notes');
        const etYesterday = document.getElementById('et-yesterday');
        const etMonday = document.getElementById('et-monday');
        const etTuesday = document.getElementById('et-tuesday');
        const etWednesday = document.getElementById('et-wednesday');

        const setValues = (d) => {
            etNotes.value = d.notes;
            etYesterday.value = d.yesterday;
            etMonday.value = d.monday;
            etTuesday.value = d.tuesday;
            etWednesday.value = d.wednesday;
        };

        setValues(days);

        const save = () => {
            days.notes = etNotes.value;
            days.yesterday = etYesterday.value;
            days.monday = etMonday.value;
            days.tuesday = etTuesday.value;
            days.wednesday = etWednesday.value;
            Storage.saveDays(days);
        };

        [etNotes, etYesterday, etMonday, etTuesday, etWednesday].forEach(el => {
            el.addEventListener('input', save);
        });

        document.getElementById('btn-back').addEventListener('click', () => {
            window.app.navigate('settings');
        });

        document.getElementById('btn-reset').addEventListener('click', () => {
            if (confirm("Are you sure you want reset this items?")) {
                const newDays = {
                    monday: "Monday",
                    tuesday: "Tuesday",
                    wednesday: "Wednesday",
                    notes: "Notes",
                    yesterday: "Yesterday"
                };
                Storage.saveDays(newDays);
                // Update local var and UI
                Object.assign(days, newDays); 
                setValues(days);
            }
        });
    }
};
