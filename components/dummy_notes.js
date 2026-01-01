const DummyNotesComponent = {
    render: () => {
        return `
            <div class="screen">
                <div class="header" style="background-color: var(--header-color);">
                    <img src="assets/images/ic_back_arrow.png" class="back-button" id="btn-back" />
                    <span class="header-title">Customise</span>
                    <span class="header-action" id="btn-reset" style="display: block;">Reset</span>
                </div>
                <div class="content" style="padding: 0;">
                    <div id="dummy-notes-list" style="display: flex; flex-direction: column;"></div>
                </div>
            </div>
        `;
    },

    init: () => {
        const listContainer = document.getElementById('dummy-notes-list');
        const notes = Storage.getDummyNotes();

        const renderItems = () => {
            listContainer.innerHTML = '';
            notes.forEach((note, index) => {
                const itemEl = document.createElement('div');
                itemEl.style.display = 'flex';
                itemEl.style.flexDirection = 'column';
                itemEl.style.padding = '3dp 15dp';
                itemEl.style.backgroundColor = '#ffffff'; // selectableItemBackground simulation
                
                // Title Input
                const titleInput = document.createElement('input');
                titleInput.type = 'text';
                titleInput.value = note.text || '';
                titleInput.style.width = '100%';
                titleInput.style.border = 'none';
                titleInput.style.fontSize = '16px';
                titleInput.style.color = '#000000'; // note_header_color1 - assuming black or dark
                titleInput.style.paddingTop = '10px';
                titleInput.style.paddingBottom = '5px';
                titleInput.style.fontFamily = 'Roboto-Medium, sans-serif';
                titleInput.style.fontWeight = 'bold';
                titleInput.style.outline = 'none';

                // Description Input
                const descInput = document.createElement('input');
                descInput.type = 'text';
                descInput.value = note.description || '';
                descInput.style.width = '100%';
                descInput.style.border = 'none';
                descInput.style.fontSize = '13px';
                descInput.style.color = '#808080'; // note_desc_color1 - assuming gray
                descInput.style.paddingBottom = '10px';
                descInput.style.fontFamily = 'Roboto-Regular, sans-serif';
                descInput.style.outline = 'none';

                // Divider
                const divider = document.createElement('div');
                divider.style.height = '1px';
                divider.style.backgroundColor = '#e0e0e0'; // note_desc_color1 or lighter
                divider.style.width = '100%';

                // Events
                titleInput.addEventListener('input', (e) => {
                    note.text = e.target.value;
                    saveNotes();
                });

                descInput.addEventListener('input', (e) => {
                    note.description = e.target.value;
                    saveNotes();
                });

                itemEl.appendChild(titleInput);
                itemEl.appendChild(descInput);
                itemEl.appendChild(divider);
                listContainer.appendChild(itemEl);
            });
        };

        const saveNotes = () => {
             localStorage.setItem(Storage.TABLE_DUMMY_NOTES, JSON.stringify(notes));
        };

        renderItems();

        document.getElementById('btn-back').addEventListener('click', () => {
            window.app.navigate('settings');
        });

        document.getElementById('btn-reset').addEventListener('click', async () => {
            if (confirm("Are you sure you want reset this list?")) {
                // Show progress simulation?
                try {
                    const response = await fetch('assets/json/dummynotes.json');
                    const data = await response.json();
                    localStorage.setItem(Storage.TABLE_DUMMY_NOTES, JSON.stringify(data.listitems));
                    window.app.navigate('dummy_notes'); // Reload
                    alert("The list has been reset.");
                } catch (e) {
                    console.error("Failed to reset notes", e);
                }
            }
        });
    }
};
