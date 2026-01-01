const NotesListComponent = {
    items: [],

    render: () => {
        return `
            <div class="activity-container" style="background-color: #f0f0f0;">
                <div class="header" style="background-color: var(--header-color);">
                    <img src="assets/images/ic_back_arrow.png" class="back-button" id="btn-back" />
                    <span class="header-title" id="header-title">Notes</span>
                    <img src="assets/images/ic_add.png" class="header-action-icon" id="btn-add" style="display: block;" />
                </div>
                <div class="content-scrollable" id="notes-list-container" style="padding-top: 10px;">
                    <!-- Items will be injected here -->
                </div>
            </div>
        `;
    },

    init: async () => {
        const listContainer = document.getElementById('notes-list-container');
        listContainer.innerHTML = '';
        NotesListComponent.items = [];

        // Set Title
        const days = Storage.getDays();
        document.getElementById('header-title').innerText = days.notes;

        // Get Perform Number
        let performNumber = parseInt(Storage.getSession('perform_number') || "0");
        if (performNumber === 0) performNumber = 100; // Logic from Android line 185

        // --- Helper: Add Items Type 1 (Celebrities, Shopping) ---
        const addItemsType1 = async (filename, sessionName) => {
            const hideKey = sessionName + "hide";
            const isHidden = Storage.getSession(hideKey) === "1";
            
            if (!isHidden) {
                let positionSelected = 0;
                try {
                    const sessionVal = Storage.getSession(sessionName);
                    if (sessionVal) positionSelected = parseInt(sessionVal);
                } catch (e) { positionSelected = 0; }

                try {
                    const response = await fetch(`assets/json/${filename}`);
                    const data = await response.json();
                    const listItems = data.listitems;
                    
                    const mainItem = {
                        item_name: data.name,
                        items: [],
                        item_texts: "",
                        canselect: true
                    };

                    const itemForced = listItems[positionSelected] || "";
                    let itemPerformed = "";
                    
                    if (performNumber !== 0) {
                        itemPerformed = listItems[performNumber - 1] || "";
                    } else {
                        itemPerformed = listItems[0];
                    }

                    let description = days.yesterday + "                ";
                    let count = 1;

                    for (let i = 0; i < listItems.length; i++) {
                        const subItem = { item_name: "" };
                        let nameToAdd = "";

                        if (performNumber !== 0) {
                            if (positionSelected === i) {
                                nameToAdd = itemPerformed;
                                description += count + "." + itemPerformed + " ";
                            } else if ((performNumber - 1) === i) {
                                nameToAdd = itemForced;
                                description += count + "." + itemForced + "\n";
                                count++;
                            } else {
                                nameToAdd = listItems[i];
                                description += count + "." + listItems[i] + " ";
                            }
                        } else {
                            nameToAdd = listItems[i];
                            description += (i + 1) + "." + listItems[i] + " ";
                        }
                        
                        subItem.item_name = nameToAdd;
                        mainItem.items.push(subItem);
                        count++;
                    }

                    mainItem.item_texts = description;
                    NotesListComponent.items.push(mainItem);

                } catch (e) {
                    console.error("Error adding items type 1", e);
                }
            }
        };

        // --- Helper: Add Items Type 2 (Custom Lists) ---
        const addItemsType2 = (sessionName) => {
            let positionSelected = 0;
            try {
                const sessionVal = Storage.getSession(sessionName);
                if (sessionVal) positionSelected = parseInt(sessionVal);
            } catch (e) { positionSelected = 0; }

            const books = Storage.findItems(sessionName);
            if (books.length > 0) {
                const mainItem = {
                    item_name: books[0].item_title || sessionName, // item_title saved in init
                    items: [],
                    item_texts: "",
                    canselect: true
                };

                const itemForced = Storage.getSession(sessionName + "force") || "";
                
                // Logic to remove itemForced if exists
                let isInList = false;
                const booksCopy = [...books]; // Copy to avoid modifying storage directly via reference
                const indexToRemove = booksCopy.findIndex(b => b.item_name.toLowerCase().trim() === itemForced.toLowerCase().trim());
                
                if (indexToRemove !== -1) {
                    isInList = true;
                    booksCopy.splice(indexToRemove, 1);
                }

                let description = days.yesterday + "                ";
                let i = 1;

                // Loop
                for (let k = 0; k < booksCopy.length; k++) {
                    const tempData2 = booksCopy[k];
                    
                    if (performNumber !== 0) {
                         if (positionSelected !== i) {
                             if ((performNumber - 1) === (i - 1)) {
                                 if (isInList) {
                                     const tempDataX = { item_name: itemForced, item_SESSION: sessionName };
                                     mainItem.items.push(tempDataX);
                                     description += i + "." + itemForced + " ";
                                     i++;
                                     description += i + "." + tempData2.item_name + " ";
                                 } else {
                                     // Clone to avoid modifying original reference if used elsewhere
                                     // Android: temp_data2.setItem_name(item_forced);
                                     // Since we read from storage, tempData2 is a new object from JSON.parse usually, 
                                     // but let's be safe and clone.
                                     tempData2.item_name = itemForced; 
                                     description += i + "." + itemForced + " ";
                                 }
                             } else {
                                 description += i + "." + tempData2.item_name + " ";
                             }
                         }
                    } else {
                         description += i + "." + tempData2.item_name + " ";
                    }
                    
                    mainItem.items.push(tempData2);
                    i++;
                }

                // Re-build description from final mainItem.items to ensure consistency and simplicity
                // This avoids the complex branching logic for description
                let finalDesc = days.yesterday + "                ";
                mainItem.items.forEach((it, idx) => {
                    finalDesc += (idx + 1) + "." + it.item_name + " ";
                });
                mainItem.item_texts = finalDesc;

                NotesListComponent.items.push(mainItem);
            }
        };

        // --- Helper: Add Items Type 3 (Dummy Notes) ---
        const addItemsType3 = () => {
            const dummyNotes = Storage.getDummyNotes();
            let count = 1;
            dummyNotes.forEach(note => {
                const mainItem = {
                    item_name: note.text, // note.text is the title
                    items: [], // No sub-items usually?
                    item_texts: "",
                    canselect: false
                };
                
                // Logic for description header (dates)
                let prefix = days.wednesday;
                if (count <= 3) prefix = days.yesterday;
                else if (count === 4) prefix = days.monday;
                else if (count === 5) prefix = days.tuesday;
                else if (count === 6) prefix = days.wednesday;
                
                mainItem.item_texts = prefix + "                " + (note.description || "");
                
                NotesListComponent.items.push(mainItem);
                count++;
            });
        };

        // Execution Order
        await addItemsType1("celebrities.json", "celebrities");
        await addItemsType1("shoppinglist.json", "shoppinglist");
        addItemsType2("custom1");
        addItemsType2("custom2");
        addItemsType2("custom3");
        addItemsType3();

        // Render Items to DOM
        NotesListComponent.items.forEach((item, index) => {
            const itemEl = document.createElement('div');
            itemEl.className = 'note-list-item';
            itemEl.innerHTML = `
                <div class="note-icon-container">
                    <div class="note-icon-circle">
                        <img src="assets/images/ic_notes.png" />
                    </div>
                </div>
                <div class="note-content">
                    <div class="note-title">${item.item_name}</div>
                    <div class="note-preview">${item.item_texts.substring(0, 50).replace(/\n/g, ' ')}...</div>
                    <div class="note-date">10/10/2018</div> <!-- Static date in layout? Or dynamic? Android sets yesterday date in Detail, but list? List uses item_texts -->
                </div>
            `;
            
            itemEl.addEventListener('click', () => {
                // Navigate to Detail
                window.app.navigate('notes_detail', { position: index });
            });
            
            listContainer.appendChild(itemEl);
        });

        // Event Listeners
        document.getElementById('btn-back').addEventListener('click', () => {
            window.app.navigate('home'); // Or finish? Android finishes act.
        });
        document.getElementById('btn-add').addEventListener('click', () => {
             window.app.navigate('home');
        });
    }
};
