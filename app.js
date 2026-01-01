// ============================================
// STORAGE SERVICE
// ============================================
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
    TABLE_NOTES: 'notes',
    
    init: async () => {
        if (!localStorage.getItem(Storage.TABLE_DAYS)) {
            const days = {
                monday: "Segunda-feira",
                tuesday: "Terça-feira",
                wednesday: "Quarta-feira",
                notes: "Notas",
                yesterday: "Ontem"
            };
            localStorage.setItem(Storage.TABLE_DAYS, JSON.stringify([days]));
        }

        if (!localStorage.getItem(Storage.TABLE_DUMMY_NOTES)) {
            try {
                const response = await fetch('assets/json/dummynotes.json');
                const data = await response.json();
                localStorage.setItem(Storage.TABLE_DUMMY_NOTES, JSON.stringify(data.listitems));
            } catch (e) {
                console.error('Failed to load dummynotes', e);
            }
        }

        const customSessions = [Storage.SESSION_CUSTOM1, Storage.SESSION_CUSTOM2, Storage.SESSION_CUSTOM3];
        for (const session of customSessions) {
            const items = Storage.findItems(session);
            if (items.length === 0) {
                try {
                    const response = await fetch(`assets/json/${session}.json`);
                    const data = await response.json();
                    localStorage.setItem(session + "force", data.force);
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

        const standardSessions = [Storage.SESSION_CELEBRITIES, Storage.SESSION_SHOPPING];
        for (const session of standardSessions) {
             const items = Storage.findItems(session);
             if (items.length === 0) {
                 try {
                     const response = await fetch(`assets/json/${session}.json`);
                     const data = await response.json();
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

    saveSession(key, value) {
        localStorage.setItem(key, value);
    },

    getSession(key) {
        return localStorage.getItem(key) || "";
    },

    clearSession() {
        localStorage.clear();
    },

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

    getNotes() {
        const notes = localStorage.getItem('notes');
        return notes ? JSON.parse(notes) : [];
    },

    saveDays(daysObj) {
        localStorage.setItem(Storage.TABLE_DAYS, JSON.stringify([daysObj]));
    },

    loadAndSaveItems: async (filename, sessionKey) => {
        try {
            const response = await fetch(filename);
            const data = await response.json();
            if (data.force) {
                localStorage.setItem(sessionKey + "force", data.force);
            }
            Storage.deleteAllItems(sessionKey);
            const newItems = data.listitems.map(name => ({
                item_name: name,
                item_title: data.name || "",
                item_SESSION: sessionKey
            }));
            Storage.addItems(newItems);
        } catch (e) {
            console.error(`Failed to load ${filename}`, e);
        }
    }
};

// ============================================
// COMPONENTS
// ============================================

const HomeComponent = {
    render: () => {
        return `
            <div class="screen center-content">
                    <div class="title-heading">Digital Force Bag</div>
                <div class="button-container">
                    <button id="btn_about" class="btn-round">Sobre</button>
                    <button id="btn_instruction" class="btn-round">Instruções</button>
                    <button id="btn_setting" class="btn-round">Configurações</button>
                    <button id="performmenubutton" class="btn-round">Executar</button>
                </div>
                <div class="close-btn">
                    <img id="img_closebtn" src="assets/images/ic_close.png" alt="Fechar">
                </div>
            </div>
        `;
    },
    init: () => {
        document.getElementById('btn_about').addEventListener('click', () => window.app.navigate('about'));
        document.getElementById('btn_instruction').addEventListener('click', () => window.app.navigate('instruction'));
        document.getElementById('btn_setting').addEventListener('click', () => window.app.navigate('settings'));
        document.getElementById('performmenubutton').addEventListener('click', () => window.app.navigate('perform'));
        document.getElementById('img_closebtn').addEventListener('click', () => {
            if (confirm('Sair do aplicativo?')) window.close();
        });
    }
};

const AboutComponent = {
    render: () => {
        const version = "1.2";
        const content = `v${version}<br>Criado por Nick Einhorn & Craig Squires. Desenvolvido por Marc Kerstein. Agradecimentos especiais a Martyn Rowland e a todos os nossos testadores Beta. Para compartilhar ideias e aprender as últimas dicas sobre o DFB, junte-se ao nosso grupo fechado no Facebook <a href="https://www.facebook.com/groups/131701277517769/">DFB-Digital Force Bag</a>. Para adquirir outros produtos Einhorn visite <a href="http://www.einhorn.co.uk/shop">www.einhorn.co.uk/shop</a>.`;
        return `
            <div class="activity-container" style="background-color: #f0f0f0;">
                <div class="header" style="background-color: var(--header-color);">
                    <img src="assets/images/ic_backbutton.png" class="back-button" id="btn-back-about" />
                    <span class="header-title">Sobre</span>
                </div>
                <div class="content-scrollable" style="padding: 20px;">
                     <div class="about-title" style="font-family: 'NunitoSans', sans-serif; font-weight: 800; font-size: 18px; margin-bottom: 20px; color: #000;">Digital Force Bag</div>
                     <div class="about-content" style="font-family: 'Roboto', sans-serif; font-size: 16px; color: #000; line-height: 1.5;">${content}</div>
                </div>
            </div>
        `;
    },
    init: () => {
        document.getElementById('btn-back-about').addEventListener('click', () => window.app.navigate('home'));
    }
};

const PerformComponent = {
    state: {
        activeTab: 0,
        number: 0,
        number_page1: 0,
        number_page2: 0,
        position_number: 0,
        position_last: 0,
        canExit: false
    },
    isDragging: false,
    data: {
        tab0: [
            { name: "Translate", icon: "ic_tans.png", value: 0 },
            { name: "Play Movies", icon: "ic_play.png", value: 0 },
            { name: "YouCam Perfect", icon: "ic_youcam.png", value: 0 },
            { name: "Maps", icon: "ic_map.png", value: 0 },
            { name: "Facebook", icon: "ic_fb.png", value: 0 },
            { name: "OneStudio", icon: "ic_one.png", value: 1 },
            { name: "Rio 2", icon: "ic_two.png", value: 2 },
            { name: "Cross", icon: "ic_three.png", value: 3 },
            { name: "WhatsApp", icon: "ic_whats.png", value: 0 },
            { name: "Flip Play", icon: "ic_four.png", value: 4 },
            { name: "Shazam", icon: "ic_five.png", value: 5 },
            { name: "Finder", icon: "ic_six.png", value: 6 },
            { name: "Instagram", icon: "ic_insta.png", value: 0 },
            { name: "Dash Cafe", icon: "ic_seven.png", value: 7 },
            { name: "Asphalt Airbone", icon: "ic_eight.png", value: 8 },
            { name: "9 Apps", icon: "ic_nine.png", value: 9 }
        ],
        tab1: [
            { name: "Clean Master", icon: "ic_brush.png", value: 0 },
            { name: "Spotify", icon: "ic_metro.png", value: 0 },
            { name: "Circle", icon: "ic_zero.png", value: 0 },
            { name: "Sound Cloud", icon: "ic_cloud.png", value: 0 },
            { name: "MX Player", icon: "ic_mx.png", value: 0 },
            { name: "InFocus", icon: "ic_screenone.png", value: 1 },
            { name: "Splatoon", icon: "ic_screentwo.png", value: 2 },
            { name: "3D Convert", icon: "ic_screenthree.png", value: 3 },
            { name: "LinkedIn", icon: "media.png", value: 0 },
            { name: "4Shared", icon: "ic_screenfour.png", value: 4 },
            { name: "Dice LA", icon: "ic_screenfive.png", value: 5 },
            { name: "Sixcross", icon: "ic_screensix.png", value: 6 },
            { name: "Jabong", icon: "ic_jabong.png", value: 0 },
            { name: "Cafe Spot", icon: "ic_screenseven.png", value: 7 },
            { name: "Pool 8 Ball", icon: "ic_screeneight.png", value: 8 },
            { name: "It's Cloud", icon: "ic_screennine.png", value: 9 }
        ],
        tab2: [
            { name: "Amazon", icon: "ic_amazon.png", clickable: false },
            { name: "Camera 360", icon: "ic_camera.png", clickable: false },
            { name: "Uber", icon: "ic_uber.png", clickable: false },
            { name: "Opera", icon: "ic_opera.png", clickable: false },
            { name: "Firefox", icon: "ic_fox.png", clickable: false },
            { name: "Acrobat", icon: "ic_adobe.png", clickable: true },
            { name: "Notas", icon: "ic_notes.png", action: 'app', clickable: true },
            { name: "Behance", icon: "ic_be.png", clickable: false },
            { name: "", icon: "ic_be.png", hidden: true },
            { name: "", icon: "ic_be.png", hidden: true },
            { name: "", icon: "ic_be.png", hidden: true },
            { name: "", icon: "ic_be.png", hidden: true },
            { name: "", icon: "ic_be.png", hidden: true },
            { name: "", icon: "ic_be.png", hidden: true },
            { name: "", icon: "ic_be.png", hidden: true },
            { name: "", icon: "ic_be.png", hidden: true }
        ]
    },
    render: () => {
        return `
            <div class="perform-screen" id="perform-screen">
                <div id="tutorial-overlay" class="tutorial-overlay" style="display: none;">
                    <div class="tutorial-content">
                        <p class="tutorial-text">Toque 4 vezes em qualquer lugar na tela para sair do modo launcher.</p>
                        <button id="btn_gotit" class="btn-gotit">ENTENDI</button>
                    </div>
                </div>
                <div class="perform-header" id="perform-header"></div>
                <div class="perform-content">
                    <div class="view-pager-wrapper" id="view-pager-wrapper">
                        <div class="view-pager" id="view-pager">
                            <div class="carousel-slide" data-tab="0"></div>
                            <div class="carousel-slide" data-tab="1"></div>
                            <div class="carousel-slide" data-tab="2"></div>
                        </div>
                    </div>
                </div>
                <div class="page-indicator" id="page-indicator">
                    <div class="dot active"></div>
                    <div class="dot"></div>
                    <div class="dot"></div>
                </div>
                <div class="perform-footer" id="perform-footer"></div>
            </div>
        `;
    },
    init: async () => {
        // Enter fullscreen mode (launcher mode)
        const enterFullscreen = () => {
            if (document.documentElement.requestFullscreen) {
                document.documentElement.requestFullscreen().catch(() => {});
            } else if (document.documentElement.webkitRequestFullscreen) {
                document.documentElement.webkitRequestFullscreen();
            } else if (document.documentElement.msRequestFullscreen) {
                document.documentElement.msRequestFullscreen();
            }
        };
        
        // Try to enter fullscreen
        setTimeout(enterFullscreen, 300);
        
        // Apply wallpaper
        const performScreen = document.getElementById('perform-screen');
        const savedWallpaper = Storage.getSession(Storage.SESSION_IMAGE);
        if (savedWallpaper) {
            performScreen.style.backgroundImage = `url('${savedWallpaper}')`;
        } else {
            performScreen.style.backgroundImage = "url('wallpaper.jpeg')";
        }
        performScreen.style.backgroundSize = 'cover';
        performScreen.style.backgroundPosition = 'center';
        performScreen.style.backgroundRepeat = 'no-repeat';
        
        const tutorial = Storage.getSession("SESSION_TUTORIAL");
        if (tutorial !== "1") {
            document.getElementById('tutorial-overlay').style.display = 'flex';
        }
        document.getElementById('btn_gotit').addEventListener('click', () => {
            Storage.saveSession("SESSION_TUTORIAL", "1");
            document.getElementById('tutorial-overlay').style.display = 'none';
            enterFullscreen();
        });

        // 4 taps to exit logic (silent, no visual feedback)
        let tapCount = 0;
        let tapTimestamps = [];
        const TAP_TIMEOUT = 1500; // 1.5 seconds to complete 4 taps
        const EXIT_TAP_COUNT = 4;
        
        const handleExitTap = (e) => {
            // Don't count taps on interactive elements
            if (e.target.closest('.grid-item, .dot, .btn-gotit, .tutorial-overlay')) {
                return;
            }
            
            const currentTime = Date.now();
            
            // Remove taps older than timeout
            tapTimestamps = tapTimestamps.filter(timestamp => currentTime - timestamp < TAP_TIMEOUT);
            
            // Add current tap
            tapTimestamps.push(currentTime);
            tapCount = tapTimestamps.length;
            
            // Check if we reached 4 taps
            if (tapCount >= EXIT_TAP_COUNT) {
                // Exit fullscreen first
                if (document.exitFullscreen) {
                    document.exitFullscreen().catch(() => {});
                } else if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                }
                
                // Reset counters
                tapCount = 0;
                tapTimestamps = [];
                
                // Navigate home
                setTimeout(() => {
                    window.app.navigate('home');
                }, 100);
            }
        };

        performScreen.addEventListener('click', handleExitTap);
        performScreen.addEventListener('touchend', handleExitTap, { passive: true });

        // Render all tabs initially
        PerformComponent.renderAllTabs();
        PerformComponent.updateCarouselPosition(0);
        
        document.querySelectorAll('.dot').forEach((dot, index) => {
            dot.addEventListener('click', () => PerformComponent.switchTab(index));
        });
        
        // Carousel swipe with smooth transitions
        const viewPagerWrapper = document.getElementById('view-pager-wrapper');
        const viewPager = document.getElementById('view-pager');
        let touchStartX = 0;
        let touchStartY = 0;
        let touchCurrentX = 0;
        let touchStartTime = 0;
        let isDragging = false;
        let startTranslate = 0;
        let currentTranslate = 0;
        let animationId = 0;
        const SWIPE_THRESHOLD = 50;
        
        // Store isDragging in component for access in event handlers
        PerformComponent.isDragging = false;
        
        const getTranslateX = () => {
            const style = window.getComputedStyle(viewPager);
            const transform = style.transform || style.webkitTransform;
            if (!transform || transform === 'none') return 0;
            const matrix = new DOMMatrix(transform);
            return matrix.m41;
        };
        
        const setTranslateX = (x) => {
            viewPager.style.transform = `translateX(${x}px)`;
        };
        
        const animate = () => {
            setTranslateX(currentTranslate);
            if (isDragging) {
                animationId = requestAnimationFrame(animate);
            }
        };
        
        const getSlideWidth = () => {
            return viewPagerWrapper.offsetWidth || window.innerWidth;
        };
        
        viewPagerWrapper.addEventListener('touchstart', e => {
            if (e.touches.length === 1) {
                touchStartX = e.touches[0].clientX;
                touchStartY = e.touches[0].clientY;
                touchStartTime = Date.now();
                startTranslate = getTranslateX();
                isDragging = true;
                PerformComponent.isDragging = true;
                viewPager.classList.add('no-transition');
                viewPagerWrapper.classList.add('dragging');
                animationId = requestAnimationFrame(animate);
            }
        }, { passive: true });
        
        viewPagerWrapper.addEventListener('touchmove', e => {
            if (e.touches.length === 1 && isDragging) {
                touchCurrentX = e.touches[0].clientX;
                const diffX = touchCurrentX - touchStartX;
                const diffY = Math.abs(e.touches[0].clientY - touchStartY);
                
                // Only allow horizontal swipe if horizontal movement is greater
                if (Math.abs(diffX) > diffY && Math.abs(diffX) > 5) {
                    const slideWidth = getSlideWidth();
                    const minTranslate = -slideWidth * 2; // Max left (tab 2)
                    const maxTranslate = 0; // Max right (tab 0)
                    currentTranslate = Math.max(minTranslate, Math.min(maxTranslate, startTranslate + diffX));
                    e.preventDefault();
                }
            }
        }, { passive: false });
        
        viewPagerWrapper.addEventListener('touchend', e => {
            if (isDragging) {
                isDragging = false;
                PerformComponent.isDragging = false;
                cancelAnimationFrame(animationId);
                viewPager.classList.remove('no-transition');
                viewPagerWrapper.classList.remove('dragging');
                
                const diffX = touchCurrentX - touchStartX;
                const touchDuration = Date.now() - touchStartTime;
                const velocity = Math.abs(diffX) / Math.max(touchDuration, 1);
                const slideWidth = getSlideWidth();
                
                if (Math.abs(diffX) > SWIPE_THRESHOLD || velocity > 0.3) {
                    if (diffX < 0 && PerformComponent.state.activeTab < 2) {
                        PerformComponent.switchTab(PerformComponent.state.activeTab + 1);
                    } else if (diffX > 0 && PerformComponent.state.activeTab > 0) {
                        PerformComponent.switchTab(PerformComponent.state.activeTab - 1);
                    } else {
                        PerformComponent.updateCarouselPosition(PerformComponent.state.activeTab);
                    }
                } else {
                    PerformComponent.updateCarouselPosition(PerformComponent.state.activeTab);
                }
            }
        }, { passive: true });
        
        viewPagerWrapper.addEventListener('touchcancel', () => {
            if (isDragging) {
                isDragging = false;
                PerformComponent.isDragging = false;
                cancelAnimationFrame(animationId);
                viewPager.classList.remove('no-transition');
                viewPagerWrapper.classList.remove('dragging');
                PerformComponent.updateCarouselPosition(PerformComponent.state.activeTab);
            }
        }, { passive: true });
        
        // Handle window resize
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                PerformComponent.updateCarouselPosition(PerformComponent.state.activeTab);
            }, 100);
        });
    },
    renderAllTabs: () => {
        const viewPager = document.getElementById('view-pager');
        const slides = viewPager.querySelectorAll('.carousel-slide');
        
        slides.forEach((slide, tabIndex) => {
            const items = PerformComponent.data[`tab${tabIndex}`];
            let html = '<div class="grid-container">';
            items.forEach((item, index) => {
                if (item.hidden) {
                    html += `<div class="grid-item hidden"></div>`;
                    return;
                }
                html += `<div class="grid-item" data-index="${index}" data-tab="${tabIndex}"><img src="assets/images/${item.icon}" alt="${item.name}"><span>${item.name}</span></div>`;
            });
            html += '</div>';
            slide.innerHTML = html;
            
            // Add event listeners to grid items
            const gridItems = slide.querySelectorAll('.grid-item');
            gridItems.forEach(el => {
                let itemTouchStartTime = 0;
                el.addEventListener('touchstart', (e) => { 
                    itemTouchStartTime = Date.now(); 
                    e.stopPropagation(); 
                }, { passive: true });
                el.addEventListener('touchend', (e) => {
                    const touchDuration = Date.now() - itemTouchStartTime;
                    if (touchDuration < 300 && !PerformComponent.isDragging) {
                        e.preventDefault();
                        e.stopPropagation();
                        const index = parseInt(el.dataset.index);
                        const item = items[index];
                        PerformComponent.handleItemClick(item);
                    }
                }, { passive: false });
                el.addEventListener('click', (e) => {
                    if (!PerformComponent.isDragging) {
                        const index = parseInt(el.dataset.index);
                        const item = items[index];
                        PerformComponent.handleItemClick(item);
                    }
                });
            });
        });
    },
    
    updateCarouselPosition: (tabIndex) => {
        const viewPager = document.getElementById('view-pager');
        const viewPagerWrapper = document.getElementById('view-pager-wrapper');
        if (!viewPager || !viewPagerWrapper) return;
        
        const slideWidth = viewPagerWrapper.offsetWidth || window.innerWidth;
        const translateX = -tabIndex * slideWidth;
        viewPager.style.transform = `translateX(${translateX}px)`;
        
        // Update dots
        document.querySelectorAll('.dot').forEach((dot, i) => {
            if (i === tabIndex) dot.classList.add('active');
            else dot.classList.remove('active');
        });
    },
    
    renderTab: (tabIndex) => {
        // This method is kept for compatibility but now uses updateCarouselPosition
        PerformComponent.updateCarouselPosition(tabIndex);
    },
    switchTab: (newTabIndex) => {
        PerformComponent.state.activeTab = newTabIndex;
        const position = newTabIndex;
        const { position_last, position_number } = PerformComponent.state;
        if (position_last > position) {
            if (position === 0) { PerformComponent.state.number_page1 = 0; PerformComponent.state.number_page2 = 0; }
            if (position === 1) PerformComponent.state.number_page2 = 0;
            if (position === 2) PerformComponent.state.number_page2 = position_number;
        } else {
            if (position === 0) { PerformComponent.state.number = 0; PerformComponent.state.number_page1 = 0; PerformComponent.state.number_page2 = 0; }
            if (position === 1) PerformComponent.state.number_page1 = position_number;
            if (position === 2) PerformComponent.state.number_page2 = position_number;
            if (position_last === 2) PerformComponent.state.number_page2 = 0;
        }
        PerformComponent.state.number = (PerformComponent.state.number_page1 * 10) + PerformComponent.state.number_page2;
        PerformComponent.state.position_number = 0;
        PerformComponent.state.position_last = position;
        Storage.saveSession('perform_number', PerformComponent.state.number.toString());
        PerformComponent.updateCarouselPosition(newTabIndex);
    },
    handleItemClick: (item) => {
        if (item.action === 'app') { 
            // Mark that we're navigating from perform mode
            App.cameFromPerform = true;
            window.app.navigate('notes_list'); 
            return; 
        }
        if (item.clickable === false) return;
        PerformComponent.state.position_number = item.value || 0;
    }
};

const InstructionsComponent = {
    render: () => {
        return `
            <div class="activity-container">
                <div class="header">
                        <img src="assets/images/ic_backbutton.png" class="back-btn" id="instructions-back-btn" />
                        <div class="header-title">Instruções</div>
                    </div>
                <div class="content-scrollable" style="padding: 10px;">
                    <div class="instruction-section">
                        <div class="instruction-title">INSTRUÇÕES</div>
                        <div class="instruction-content">
                            <p>Digital Force Bag (DFB) é uma ferramenta que permite realizar vários truques impressionantes.</p>
                            <p>Com um pouco de imaginação, você pode criar rotinas únicas. O DFB permite forçar qualquer item a partir de uma escolha de até 100 itens.</p>
                            <p>Três listas já foram incluídas para você começar imediatamente.</p>
                            <p>Os exemplos em Listas Personalizadas 1, 2 e 3 podem ser restaurados a qualquer momento usando o botão "Redefinir Lista" dentro de cada lista.</p>
                            <p>Sabemos que você quer começar logo, então vamos ao básico. Lembre-se: para voltar às instruções a qualquer momento, faça um duplo swipe para baixo.</p>
                        </div>
                    </div>
                    <div class="instruction-section" style="display:none;">
                        <div class="instruction-title">INITIAL SETUP</div>
                        <div class="instruction-content">Under SET INPUT STYLE choose Input Style 3. This is the only style you will ever need and once set should never need to be changed.</div>
                    </div>
                    <div class="instruction-section">
                        <div class="instruction-title">SETTING YOUR HOME SCREEN</div>
                        <div class="instruction-content">
                            <p>Tap Settings and tap on SET WALLPAPER.</p>
                            You can use the default wallpaper or tap SET IMAGE to use the same background as your real home screen.&nbsp;This is recommended.
                        </div>
                    </div>
                    <div class="instruction-section">
                        <div class="instruction-title">SETTING THE FORCE ITEMS</div>
                        <div class="instruction-content">
                            Under the SET FORCE ITEMS header there are two preset lists:<br><br><p>Celebrities and Shopping List.</p>Tap on Celebrities and tap on the celebrity you wish to force. A tick will appear next to your choice.<br><br>Go back to Settings by tapping the back-arrow button (Top left).<br><br>Tap on Shopping List and similarly choose your force item on that list too.<br><br>Go back to Settings by tapping the Settings button, top left.<br><br>If you wish to create a Custom List you can do so by tapping on a Custom List and entering the information of your choice, including an appropriate title. Your list can be up to 99 items long.<br><br>Be sure to add your FORCE item in the Force Item field.<br><br>You will see that Custom List 1 is currently set with a randomly shuffled deck of playing cards.<br><br>Tap the back-arrow button (Top left). This will save your new list and bring you back to the main settings page.
                        </div>
                    </div>
                    <div class="instruction-section">
                        <div class="instruction-title">PERFORM</div>
                        <div class="instruction-content">Here is a very brief operational guide to get you started.<br><br>From the main title page tap Perform.<br><br>Your phone should look like your real Home Screen. But within the app buttons are some hidden secrets.</div>
                    </div>
                    <img src="assets/images/ic_launcher.png" style="width: 100%; max-width: 300px; display: block; margin: 20px auto;" />
                    <div class="instruction-section">
                        <div class="instruction-content">
                            <p>The icons shown within the square represent the numbers&nbsp;1-9 like a telephone keypad. Anywhere outside of this square represents 0.</p>
                            <p>To help you make the swipes as smooth as possible the apps in this square have been carefully designed to incorporate the numbers 1-9. Once you are aware of this you can see it very easily but no one else will be aware of the secret numbering system.</p>
                            <p>Ask your spectator to say a number from 1-100 inclusive. Let's assume they say &ldquo;41\".</p>
                            <p>Swipe the screen by placing your finger or thumb on secret square 4 and swiping to the left. This will reveal a second screen of icons.</p>
                            <p>Next, swipe across to the third screen by placing your finger or thumb on the secret square 1 and swiping left again.</p>
                            <p>This will reveal the Notes app. (From this moment the spectator can handle everything under your instruction).</p>
                            <p>Open the Notes app by tapping it.</p><p>Tap on the required list.</p><p>Your force item in every list will now be at the number you secretly coded.</p><p>For numbers 1-9 swipe anywhere outside of the box first (Representing &lsquo;0&rsquo;) to take you to screen two. For 100, swipe anywhere outside of the box on both screens. (0-0)</p><p>If you make an error at any point simply swipe back to the 'previous screen' and start again.</p>
                            <p>From the page where the force item is revealed, you can start the trick again using one of these options:</p>1. Swipe down with two fingers to bring you back to the options on the main page and start again by tapping Perform.<br><p></p>2. Use the secret shortcut. Tap the Back option (Top left of the screen) this will take you back to the Notes list. Now tap either the + symbol (Top right) or the back-arrow button again (top left). This will take you back to the fake app home screen, ready to start again without having to enter the main menu.
                        </div>
                    </div>
                    <div class="instruction-section">
                        <div class="instruction-title">HOW TO EXPORT A LIST</div>
                        <div class="instruction-content">
                            <p>We suggest saving your own Custom Lists so that you can change them at a moment&rsquo;s notice.</p>
                            <p>To do this, from the SETTINGS option, tap your Custom List of choice and tap on EXPORT (Top right). This will change your list into a URL which is easily shared with friends and allows for automatic input at a future time.</p>
                            <p>Choose the option COPY TO CLIPBOARD or save it to your own real notes app on your phone.&nbsp;&nbsp;</p>
                            <p>Now you can delete the Custom List and build a new one.&nbsp;</p>
                            <p>To restore a previous list, find it in your real Notes App and Copy &amp; Paste the hyper link into a web browser. It will automatically open your DFB and ask you if you want to load it into DFB. It will then ask you if you wish to override Custom List 1, 2 or 3. Tap your option and the list will be saved.</p>
                            You can use the Hyperlink to share lists with friends via SMS or email!
                        </div>
                    </div>
                    <div class="instruction-section">
                        <div class="instruction-title">OTHER LANGUAGES</div>
                        <div class="instruction-content">
                            You can hide the CELEBRITIES and SHOPPING LIST by opening up these lists in settings and using the toggle switch (Top right) to hide each list. (It will show green when in Hide Mode)
                            <p>In SETTINGS you can also customise the DUMMY NOTE TEXT which you see under the force lists when you are in performance mode.</p>
                            <p>in CUSTOMISE LANGUAGE you can also customise the word NOTES and the days of the week into your own language.</p>
                            Using these options means that you can fully customise the whole app for your chosen language.
                        </div>
                    </div>
                    <div class="instruction-section">
                        <div class="instruction-title">THREE BASIC ROUTINES</div>
                        <div class="instruction-content">
                            <p><strong>THE BABY GAG PLUS</strong><br><p>Print off a small picture of your chosen celebrity and on the back of it print a picture of a cute baby. Have this in a small envelope which can be kept in the back of your phone case.<br />Ask for a number from 1 - 100.</p>
                            <p>Show your list and ask the spectator to reveal their random celebrity.</p>
                            <p>Explain you have a photo in the envelope and reveal the baby to get a laugh. But then explain that you have a more recent photo and turn it over to reveal the real picture of the celebrity they just chose.</p>
                            <p><strong>SHOPPING LIST</strong></p>
                            <p>Have your force item inside an opaque bag. Ask for a number from 1 - 100.</p>
                            <p>Show your shopping list and ask the spectator to reveal the item at the chosen number. Now ask the spectator to open the bag and reveal that the chosen item is inside!</p>
                            <p><strong>REALLY INVISIBLE</strong> (Using the Custom List Provided)</p>
                            <p>Pre-set a deck of cards by taking a Seven of Diamonds from a blue deck and placing it upside down in the middle of a red deck. (Be sure to remove the red Seven of Diamonds).</p>
                            <p>Now ask for a number from 1-52 and then show your list of randomly shuffled cards. Ask them to call out the card at their chosen number (The forced Seven of Diamonds).&nbsp;</p>
                            <p>Now ask them to spread the pack face down to reveal a single face up card - the Seven of Diamonds.&nbsp;</p>
                            Finally ask them to turn the Seven over revealing it even has a different colour back!
                        </div>
                    </div>
                    <div class="instruction-section">
                        <div class="instruction-title">ADDITIONAL THOUGHTS</div>
                        <div class="instruction-content">
                            <p>With some imagination you can make up some simple but powerful, original routines.</p>
                            <p>How about producing an item from the shopping list that is bigger than the bag it comes out of? Or how about producing a bottle of Coke from a bag and then putting it back in afterwards, scrunching up the bag and putting it in your pocket?</p>
                            <p>Your lists can of course be anything. Products, names, places, objects, songs, ambitions, emotions, countries etc.<p></p>If you head to our&nbsp;<a href="https://m.facebook.com/login/?next=https://m.facebook.com/groups/131701277517769/&amp;refsrc=https://m.facebook.com/groups/131701277517769/&amp;_rdr" target="_blank">DFB Closed Facebook</a> Group&nbsp;you will be able to join in with other DFB users and share ideas and lists.</p><p>Have fun!</p>The DFB Team.
                        </div>
                    </div>
                </div>
            </div>
        `;
    },
    init: () => {
        document.getElementById('instructions-back-btn').addEventListener('click', () => window.app.navigate('home'));
    }
};

const InstructionComponent = {
    render: () => {
        return `
            <div class="activity-container" style="background-color: #f0f0f0;">
                <div class="header" style="background-color: var(--header-color);">
                    <img src="assets/images/ic_backbutton.png" class="back-button" id="btn-back-inst" />
                    <span class="header-title">Instruções</span>
                </div>
                <div class="content-scrollable" style="padding: 10px;">
                    <div class="instruction-section">
                        <div class="instruction-title">INSTRUÇÕES</div>
                        <div class="instruction-content">
                            <p>O DFB (Digital Force Bag) permite que você configure listas e execute o truque de forçar um item na posição escolhida pelo espectador.</p>
                            <p>Use as configurações para ajustar o papel de parede, listas e textos do aplicativo. As listas personalizadas podem ser editadas e exportadas.</p>
                            <p>Para executar o modo "Perform", toque em "Executar" na tela inicial — o aplicativo mostrará uma tela parecida com a sua homescreen.</p>
                        </div>
                    </div>
                    <div class="instruction-section">
                        <div class="instruction-title">CONFIGURAÇÕES INICIAIS</div>
                        <div class="instruction-content">Em "Configurações" escolha o papel de parede e verifique suas listas de força. Recomendamos usar o mesmo papel de parede do seu aparelho.</div>
                    </div>
                    <div class="instruction-section">
                        <div class="instruction-title">DEFINIR LISTAS</div>
                        <div class="instruction-content">
                            <p>Em "Definir Itens Força" você encontrará as listas pré-definidas (Celebridades e Lista de Compras). Selecione o item que deseja forçar.</p>
                            <p>Para criar ou editar uma lista personalizada, acesse "Personalizado" e edite os itens e o item forçado.</p>
                        </div>
                    </div>
                    <div style="text-align: center; background-color: white; padding: 10px 0;">
                        <img src="assets/images/apphome.jpg" style="max-width: 100%; height: auto;" />
                    </div>
                    <div class="instruction-section">
                        <div class="instruction-content">
                            <p>The icons shown within the square represent the numbers&nbsp;1-9 like a telephone keypad. Anywhere outside of this square represents 0.</p>
                            <p>To help you make the swipes as smooth as possible the apps in this square have been carefully designed to incorporate the numbers 1-9. Once you are aware of this you can see it very easily but no one else will be aware of the secret numbering system.</p>
                            <p>Ask your spectator to say a number from 1-100 inclusive. Let's assume they say &ldquo;41".</p>
                            <p>Swipe the screen by placing your finger or thumb on secret square 4 and swiping to the left. This will reveal a second screen of icons.</p>
                            <p>Next, swipe across to the third screen by placing your finger or thumb on the secret square 1 and swiping left again.</p>
                            <p>This will reveal the Notes app. (From this moment the spectator can handle everything under your instruction).</p>
                            <p>Open the Notes app by tapping it.</p><p>Tap on the required list.</p><p>Your force item in every list will now be at the number you secretly coded.</p><p>For numbers 1-9 swipe anywhere outside of the box first (Representing &lsquo;0&rsquo;) to take you to screen two. For 100, swipe anywhere outside of the box on both screens. (0-0)</p><p>If you make an error at any point simply swipe back to the 'previous screen' and start again.</p>
                            <p>From the page where the force item is revealed, you can start the trick again using one of these options:</p>1. Swipe down with two fingers to bring you back to the options on the main page and start again by tapping Perform.<br><p></p>2. Use the secret shortcut. Tap the Back option (Top left of the screen) this will take you back to the Notes list. Now tap either the + symbol (Top right) or the back-arrow button again (top left). This will take you back to the fake app home screen, ready to start again without having to enter the main menu.
                        </div>
                    </div>
                    <div class="instruction-section">
                        <div class="instruction-title">HOW TO EXPORT A LIST</div>
                        <div class="instruction-content">
                            <p>We suggest saving your own Custom Lists so that you can change them at a moment&rsquo;s notice.</p>
                            <p>To do this, from the SETTINGS option, tap your Custom List of choice and tap on EXPORT (Top right). This will change your list into a URL which is easily shared with friends and allows for automatic input at a future time.</p>
                            <p>Choose the option COPY TO CLIPBOARD or save it to your own real notes app on your phone.&nbsp;&nbsp;</p>
                            <p>Now you can delete the Custom List and build a new one.&nbsp;</p>
                            <p>To restore a previous list, find it in your real Notes App and Copy &amp; Paste the hyper link into a web browser. It will automatically open your DFB and ask you if you want to load it into DFB. It will then ask you if you wish to override Custom List 1, 2 or 3. Tap your option and the list will be saved.</p>
                            You can use the Hyperlink to share lists with friends via SMS or email!
                        </div>
                    </div>
                    <div class="instruction-section">
                        <div class="instruction-title">OTHER LANGUAGES</div>
                        <div class="instruction-content">
                            You can hide the CELEBRITIES and SHOPPING LIST by opening up these lists in settings and using the toggle switch (Top right) to hide each list. (It will show green when in Hide Mode)
                            <p>In SETTINGS you can also customise the DUMMY NOTE TEXT which you see under the force lists when you are in performance mode.</p>
                            <p>in CUSTOMISE LANGUAGE you can also customise the word NOTES and the days of the week into your own language.</p>
                            Using these options means that you can fully customise the whole app for your chosen language.
                        </div>
                    </div>
                    <div class="instruction-section">
                        <div class="instruction-title">THREE BASIC ROUTINES</div>
                        <div class="instruction-content">
                            <p><strong>THE BABY GAG PLUS</strong><br><p>Print off a small picture of your chosen celebrity and on the back of it print a picture of a cute baby. Have this in a small envelope which can be kept in the back of your phone case.<br />Ask for a number from 1 - 100.</p>
                            <p>Show your list and ask the spectator to reveal their random celebrity.</p>
                            <p>Explain you have a photo in the envelope and reveal the baby to get a laugh. But then explain that you have a more recent photo and turn it over to reveal the real picture of the celebrity they just chose.</p>
                            <p><strong>SHOPPING LIST</strong></p>
                            <p>Have your force item inside an opaque bag. Ask for a number from 1 - 100.</p>
                            <p>Show your shopping list and ask the spectator to reveal the item at the chosen number. Now ask the spectator to open the bag and reveal that the chosen item is inside!</p>
                            <p><strong>REALLY INVISIBLE</strong> (Using the Custom List Provided)</p>
                            <p>Pre-set a deck of cards by taking a Seven of Diamonds from a blue deck and placing it upside down in the middle of a red deck. (Be sure to remove the red Seven of Diamonds).</p>
                            <p>Now ask for a number from 1-52 and then show your list of randomly shuffled cards. Ask them to call out the card at their chosen number (The forced Seven of Diamonds).&nbsp;</p>
                            <p>Now ask them to spread the pack face down to reveal a single face up card - the Seven of Diamonds.&nbsp;</p>
                            Finally ask them to turn the Seven over revealing it even has a different colour back!
                        </div>
                    </div>
                    <div class="instruction-section" style="margin-bottom: 25px;">
                        <div class="instruction-title">ADDITIONAL THOUGHTS</div>
                        <div class="instruction-content">
                            <p>With some imagination you can make up some simple but powerful, original routines.</p>
                            <p>How about producing an item from the shopping list that is bigger than the bag it comes out of? Or how about producing a bottle of Coke from a bag and then putting it back in afterwards, scrunching up the bag and putting it in your pocket?</p>
                            <p>Your lists can of course be anything. Products, names, places, objects, songs, ambitions, emotions, countries etc.<p></p>If you head to our&nbsp;<a href="https://m.facebook.com/login/?next=https://m.facebook.com/groups/131701277517769/&amp;refsrc=https://m.facebook.com/groups/131701277517769/&amp;_rdr">DFB Closed Facebook</a> Group&nbsp;you will be able to join in with other DFB users and share ideas and lists.</p><p>Have fun!</p>The DFB Team.
                        </div>
                    </div>
                </div>
            </div>
        `;
    },
    init: () => {
        document.getElementById('btn-back-inst').addEventListener('click', () => window.app.navigate('home'));
    }
};

const SettingsComponent = {
    render: () => {
        return `
            <div class="activity-container" style="background-color: #f5f5f5;">
                <div class="header">
                    <img src="assets/images/ic_backbutton.png" class="back-btn" id="settings-back-btn" />
                    <div class="header-title">Configurações</div>
                </div>
                <div class="content-scrollable" style="padding: 0; background-color: #f5f5f5;">
                    <div class="settings-group-title">DEFINIR ITENS FORÇA</div>
                    <div class="settings-item" id="btn-celebrities"><span>Celebridades</span><img src="assets/images/ic_arrow.png" class="settings-arrow" /></div>
                    <div class="settings-item" id="btn-shopping"><span>Lista de Compras</span><img src="assets/images/ic_arrow.png" class="settings-arrow" /></div>
                    <div class="settings-desc">Escolha os itens de força para Celebridades e Lista de Compras.</div>
                    <div class="settings-group-title">DEFINIR ITENS DA LISTA</div>
                    <div class="settings-item" id="btn-custom1"><span>Personalizado 1</span><img src="assets/images/ic_arrow.png" class="settings-arrow" /></div>
                    <div class="settings-item" id="btn-custom2"><span>Personalizado 2</span><img src="assets/images/ic_arrow.png" class="settings-arrow" /></div>
                    <div class="settings-item" id="btn-custom3"><span>Personalizado 3</span><img src="assets/images/ic_arrow.png" class="settings-arrow" /></div>
                    <div class="settings-desc">Criar e modificar listas personalizadas</div>
                    <div class="settings-group-title">PERSONALIZAR NOTAS</div>
                    <div class="settings-item" id="btn-dummy-notes"><span>Personalizar Texto das Notas</span><img src="assets/images/ic_arrow.png" class="settings-arrow" /></div>
                    <div class="settings-desc">Defina o texto exibido nas notas dummy</div>
                    <div class="settings-group-title">PERSONALIZAR TEXTO</div>
                    <div class="settings-item" id="btn-language"><span>Personalizar Texto do App</span><img src="assets/images/ic_arrow.png" class="settings-arrow" /></div>
                    <div class="settings-desc">Configurar textos do aplicativo para seu idioma</div>
                    <div class="settings-group-title">PAPEL DE PAREDE</div>
                    <div class="settings-desc">Defina o papel de parede atrás dos ícones</div>
                    <div style="display: flex; padding: 10px;">
                        <div class="app-button" id="btn-set-image" style="flex: 1; margin-right: 5px; text-align: center;">Definir Imagem <img src="assets/images/ic_add.png" style="width: 20px; vertical-align: middle;" /></div>
                        <div class="app-button" id="btn-clear-image" style="flex: 1; margin-left: 5px; text-align: center;">Limpar Imagem <img src="assets/images/ic_eraser.png" style="width: 20px; vertical-align: middle;" /></div>
                    </div>
                    <div style="text-align: center; margin-bottom: 20px;">
                        <img id="settings-bg-preview" src="assets/images/background.png" style="max-height: 200px; max-width: 100%; border: 1px solid #ccc;" />
                    </div>
                    <input type="file" id="file-input" accept="image/*" style="display: none;" />
                    <div style="text-align: center; padding: 20px; color: #888;">DFB 1.0.1</div>
                </div>
            </div>
        `;
    },
    init: () => {
        document.getElementById('settings-back-btn').addEventListener('click', () => window.app.navigate('home'));
        document.getElementById('btn-celebrities').addEventListener('click', () => window.app.navigate('list_selector', { session: Storage.SESSION_CELEBRITIES, title: 'Celebridades', file: 'assets/json/celebrities.json' }));
        document.getElementById('btn-shopping').addEventListener('click', () => window.app.navigate('list_selector', { session: Storage.SESSION_SHOPPING, title: 'Lista de Compras', file: 'assets/json/shoppinglist.json' }));
        document.getElementById('btn-custom1').addEventListener('click', () => window.app.navigate('list_editor', { session: Storage.SESSION_CUSTOM1, title: 'Personalizado 1', file: 'assets/json/custom1.json' }));
        document.getElementById('btn-custom2').addEventListener('click', () => window.app.navigate('list_editor', { session: Storage.SESSION_CUSTOM2, title: 'Personalizado 2', file: 'assets/json/custom2.json' }));
        document.getElementById('btn-custom3').addEventListener('click', () => window.app.navigate('list_editor', { session: Storage.SESSION_CUSTOM3, title: 'Personalizado 3', file: 'assets/json/custom3.json' }));
        document.getElementById('btn-dummy-notes').addEventListener('click', () => window.app.navigate('dummy_notes'));
        document.getElementById('btn-language').addEventListener('click', () => window.app.navigate('languages'));
        const bgPreview = document.getElementById('settings-bg-preview');
        const currentBg = Storage.getSession(Storage.SESSION_IMAGE);
        if (currentBg) bgPreview.src = currentBg;
        document.getElementById('btn-set-image').addEventListener('click', () => document.getElementById('file-input').click());
        document.getElementById('file-input').addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const dataUrl = event.target.result;
                    Storage.saveSession(Storage.SESSION_IMAGE, dataUrl);
                    bgPreview.src = dataUrl;
                        alert("Papel de parede atualizado!");
                };
                reader.readAsDataURL(file);
            }
        });
        document.getElementById('btn-clear-image').addEventListener('click', () => {
            if (confirm("Tem certeza de que deseja limpar o papel de parede?\n\nObservação: a imagem padrão será restaurada.")) {
                Storage.saveSession(Storage.SESSION_IMAGE, "");
                bgPreview.src = "assets/images/background.png";
            }
        });
    }
};

const ListSelectorComponent = {
    sessionKey: null,
    render: (params) => {
        if (params) ListSelectorComponent.sessionKey = params.session;
        return `
            <div class="activity-container">
                    <div class="header">
                        <img src="assets/images/ic_backbutton.png" class="back-btn" id="list-back-btn" />
                        <div class="header-title" id="list-title">${params ? params.title || 'Lista' : 'Lista'}</div>
                    <div class="header-right">
                        <label class="switch"><input type="checkbox" id="hide-toggle"><span class="slider round"></span></label>
                    </div>
                </div>
                <div class="content-scrollable" id="list-container"></div>
                <div id="hiding-layer" style="position: absolute; top: 60px; left: 0; right: 0; bottom: 0; background: white; z-index: 10; display: none;"></div>
            </div>
        `;
    },
    init: async (params) => {
        if (!params) { console.error('ListSelectorComponent.init: params required'); return; }
        const sessionKey = params.session;
        const filename = params.file;
        let items = Storage.findItems(sessionKey);
        if (items.length === 0 && filename) {
            await Storage.loadAndSaveItems(filename, sessionKey);
            items = Storage.findItems(sessionKey);
        }
        const container = document.getElementById('list-container');
        const currentSelection = parseInt(Storage.getSession(sessionKey) || "0");
        items.forEach((item, index) => {
            const el = document.createElement('div');
            el.className = 'list-item-selector';
            el.innerHTML = `<span class="item-text">${item.item_name}</span><img src="assets/images/ic_tick.png" class="item-tick" style="display: ${index === currentSelection ? 'block' : 'none'};" />`;
            el.onclick = () => {
                if (document.getElementById('hide-toggle').checked) {
                    Storage.saveSession(sessionKey, index.toString());
                    document.querySelectorAll('.item-tick').forEach(t => t.style.display = 'none');
                    el.querySelector('.item-tick').style.display = 'block';
                }
            };
            container.appendChild(el);
        });
        const toggle = document.getElementById('hide-toggle');
        const hideKey = sessionKey + "hide";
        const isHidden = Storage.getSession(hideKey) === "1";
        toggle.checked = !isHidden;
        const updateVisibility = () => {
            const visible = toggle.checked;
            const hidingLayer = document.getElementById('hiding-layer');
            if (visible) { hidingLayer.style.display = 'none'; Storage.saveSession(hideKey, "0"); }
            else { hidingLayer.style.display = 'block'; Storage.saveSession(hideKey, "1"); }
        };
        toggle.addEventListener('change', updateVisibility);
        updateVisibility();
        document.getElementById('list-back-btn').addEventListener('click', () => window.app.navigate('settings'));
    }
};

const ListEditComponent = {
    sessionKey: null,
    originalFile: null,
    render: (params) => {
        if (params) { ListEditComponent.sessionKey = params.session; ListEditComponent.originalFile = params.file; }
        return `
            <div class="activity-container" style="background-color: #f5f5f5;">
                    <div class="header">
                    <img src="assets/images/ic_backbutton.png" class="back-btn" id="edit-back-btn" />
                    <div class="header-title" id="edit-title-header">${params ? params.title || 'Editar Lista' : 'Editar Lista'}</div>
                    <div class="header-right" id="btn-export" style="font-size: 14px; font-weight: bold; color: white;">EXPORTAR</div>
                </div>
                <div class="content-scrollable" style="padding: 15px;">
                    <div class="edit-group"><label>Título</label><input type="text" id="edit-title" class="edit-input" placeholder="Digite o título" /></div>
                    <div class="edit-group"><label>Item Forçado</label><input type="text" id="edit-force" class="edit-input" placeholder="Digite o item forçado" /><div class="edit-hint">Observação: este item deve constar na lista abaixo</div></div>
                    <div class="edit-group" style="flex: 1; display: flex; flex-direction: column;"><label>Itens da Lista (Um por linha)</label><textarea id="edit-list" class="edit-textarea" placeholder="Item 1\nItem 2\n..."></textarea></div>
                    <div class="edit-group" style="text-align: center; margin-top: 20px;"><span id="btn-reset-list" style="color: #d9534f; font-weight: bold; text-decoration: underline; cursor: pointer;">REDEFINIR LISTA</span></div>
                </div>
            </div>
        `;
    },
    init: async (params) => {
        if (!params) { console.error('ListEditComponent.init: params required'); return; }
        const sessionKey = params.session;
        const filename = params.file;
        let items = Storage.findItems(sessionKey);
        if (items.length === 0 && filename) {
            await Storage.loadAndSaveItems(filename, sessionKey);
            items = Storage.findItems(sessionKey);
        }
        const titleInput = document.getElementById('edit-title');
        if (items.length > 0) titleInput.value = items[0].item_title || "";
        const forceInput = document.getElementById('edit-force');
        forceInput.value = Storage.getSession(sessionKey + "force");
        const listTextarea = document.getElementById('edit-list');
        listTextarea.value = items.map(i => i.item_name).join('\n');
        const saveList = () => {
            const newTitle = titleInput.value.trim();
            const newForce = forceInput.value.trim();
            const newContent = listTextarea.value.trim().split('\n').filter(line => line.trim() !== "");
            Storage.saveSession(sessionKey + "force", newForce);
            Storage.deleteAllItems(sessionKey);
            const newItems = newContent.map(name => ({ item_name: name.trim(), item_title: newTitle, item_SESSION: sessionKey }));
            Storage.addItems(newItems);
        };
        document.getElementById('edit-back-btn').addEventListener('click', () => { saveList(); window.app.navigate('settings'); });
        document.getElementById('btn-export').addEventListener('click', () => {
            saveList();
            const shareText = `DFB Lista: ${titleInput.value}\nForça: ${forceInput.value}\n\n${listTextarea.value}`;
            if (navigator.share) {
                navigator.share({ title: 'DFB Lista', text: shareText }).catch(console.error);
            } else {
                navigator.clipboard.writeText(shareText).then(() => alert("Lista copiada para a área de transferência!"));
            }
        });
        document.getElementById('btn-reset-list').addEventListener('click', async () => {
            if (confirm("Tem certeza de que deseja redefinir esta lista?")) {
                Storage.deleteAllItems(sessionKey);
                if (filename) await Storage.loadAndSaveItems(filename, sessionKey);
                window.app.navigate('list_editor', params);
            }
        });
    }
};

const DummyNotesComponent = {
    render: () => {
        return `
            <div class="screen dark">
                <div class="header" style="background-color: var(--header-color);">
                    <img src="assets/images/ic_backbutton.png" class="back-button" id="btn-back" />
                    <span class="header-title">Personalizar</span>
                    <span class="header-action" id="btn-reset" style="display: block;">Redefinir</span>
                </div>
                <div class="content" style="padding: 0;"><div id="dummy-notes-list" style="display: flex; flex-direction: column;"></div></div>
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
                itemEl.style.padding = '12px 15px';
                itemEl.style.backgroundColor = '#0b0b0b';
                const titleInput = document.createElement('input');
                titleInput.type = 'text';
                titleInput.value = note.text || '';
                titleInput.style.width = '100%';
                titleInput.style.border = 'none';
                titleInput.style.fontSize = '16px';
                titleInput.style.color = '#ffffff';
                titleInput.style.paddingTop = '6px';
                titleInput.style.paddingBottom = '4px';
                titleInput.style.fontFamily = 'Roboto-Medium, sans-serif';
                titleInput.style.fontWeight = '700';
                titleInput.style.outline = 'none';
                const descInput = document.createElement('input');
                descInput.type = 'text';
                descInput.value = note.description || '';
                descInput.style.width = '100%';
                descInput.style.border = 'none';
                descInput.style.fontSize = '13px';
                descInput.style.color = '#cfcfcf';
                descInput.style.paddingBottom = '10px';
                descInput.style.fontFamily = 'Roboto-Regular, sans-serif';
                descInput.style.outline = 'none';
                const divider = document.createElement('div');
                divider.style.height = '1px';
                divider.style.backgroundColor = 'rgba(255,255,255,0.06)';
                divider.style.width = '100%';
                titleInput.addEventListener('input', (e) => { note.text = e.target.value; saveNotes(); });
                descInput.addEventListener('input', (e) => { note.description = e.target.value; saveNotes(); });
                itemEl.appendChild(titleInput);
                itemEl.appendChild(descInput);
                itemEl.appendChild(divider);
                listContainer.appendChild(itemEl);
            });
        };
        const saveNotes = () => { localStorage.setItem(Storage.TABLE_DUMMY_NOTES, JSON.stringify(notes)); };
        renderItems();
        document.getElementById('btn-back').addEventListener('click', () => window.app.navigate('settings'));
        document.getElementById('btn-reset').addEventListener('click', async () => {
            if (confirm("Tem certeza de que deseja redefinir esta lista?")) {
                try {
                    const response = await fetch('assets/json/dummynotes.json');
                    const data = await response.json();
                    localStorage.setItem(Storage.TABLE_DUMMY_NOTES, JSON.stringify(data.listitems));
                    window.app.navigate('dummy_notes');
                    alert("A lista foi redefinida.");
                } catch (e) { console.error("Falha ao redefinir notas", e); }
            }
        });
    }
};

const LanguagesComponent = {
    render: () => {
        return `
            <div class="screen" style="background-color: #f0f0f0;">
                <div class="header" style="background-color: var(--header-color);">
                    <img src="assets/images/ic_backbutton.png" class="back-button" id="btn-back" />
                    <span class="header-title">Idioma</span>
                    <span class="header-action" id="btn-reset" style="display: block;">Redefinir</span>
                </div>
                <div class="content" style="padding: 0;">
                    <div class="settings-group-title" style="margin-left: 15px; margin-top: 25px; margin-bottom: 10px;">GERAL</div>
                    <div style="background-color: white; padding: 5px 0;">
                        <div style="display: flex; align-items: center; padding: 10px;">
                            <span style="font-size: 14px; color: var(--setting-headingcolor); width: 100px;">Notas:</span>
                            <input type="text" id="et-notes" style="flex: 1; border: none; text-align: right; font-size: 14px; color: var(--setting-headingcolor); outline: none;">
                        </div>
                    </div>
                    <div class="settings-group-title" style="margin-left: 10px; margin-top: 25px; margin-bottom: 10px;">DIAS</div>
                    <div style="background-color: white; padding: 5px 0;">
                        <div style="display: flex; align-items: center; padding: 10px;">
                            <span style="font-size: 14px; color: var(--setting-headingcolor); width: 100px;">Ontem:</span>
                            <input type="text" id="et-yesterday" style="flex: 1; border: none; text-align: right; font-size: 14px; color: var(--setting-headingcolor); outline: none;">
                        </div>
                    </div>
                    <div style="height: 1px; background-color: #e0e0e0;"></div>
                    <div style="background-color: white; padding: 5px 0;">
                        <div style="display: flex; align-items: center; padding: 10px;">
                            <span style="font-size: 14px; color: var(--setting-headingcolor); width: 100px;">Segunda:</span>
                            <input type="text" id="et-monday" style="flex: 1; border: none; text-align: right; font-size: 14px; color: var(--setting-headingcolor); outline: none;">
                        </div>
                    </div>
                    <div style="height: 1px; background-color: #e0e0e0;"></div>
                    <div style="background-color: white; padding: 5px 0;">
                        <div style="display: flex; align-items: center; padding: 10px;">
                            <span style="font-size: 14px; color: var(--setting-headingcolor); width: 100px;">Terça:</span>
                            <input type="text" id="et-tuesday" style="flex: 1; border: none; text-align: right; font-size: 14px; color: var(--setting-headingcolor); outline: none;">
                        </div>
                    </div>
                    <div style="height: 1px; background-color: #e0e0e0;"></div>
                    <div style="background-color: white; padding: 5px 0;">
                        <div style="display: flex; align-items: center; padding: 10px;">
                            <span style="font-size: 14px; color: var(--setting-headingcolor); width: 100px;">Quarta:</span>
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
        [etNotes, etYesterday, etMonday, etTuesday, etWednesday].forEach(el => el.addEventListener('input', save));
        document.getElementById('btn-back').addEventListener('click', () => window.app.navigate('settings'));
        document.getElementById('btn-reset').addEventListener('click', () => {
            if (confirm("Tem certeza de que deseja redefinir os textos para o padrão em inglês?")) {
                const newDays = { monday: "Segunda-feira", tuesday: "Terça-feira", wednesday: "Quarta-feira", notes: "Notas", yesterday: "Ontem" };
                Storage.saveDays(newDays);
                Object.assign(days, newDays);
                setValues(days);
            }
        });
    }
};

const NotesListComponent = {
    items: [],
    render: () => {
        return `
            <div class="activity-container dark" style="background-color: #070707;">
                <div class="header" style="background-color: var(--header-color);">
                    <img src="assets/images/ic_backbutton.png" class="back-button" id="btn-back" />
                    <span class="header-title" id="header-title">Notas</span>
                    <img src="assets/images/ic_add.png" class="header-action-icon" id="btn-add" style="display: block;" />
                </div>
                <div class="content-scrollable" id="notes-list-container" style="padding-top: 10px;"></div>
            </div>
        `;
    },
    init: async () => {
        const listContainer = document.getElementById('notes-list-container');
        listContainer.innerHTML = '';
        NotesListComponent.items = [];
        const days = Storage.getDays();
        document.getElementById('header-title').innerText = days.notes;
        let performNumber = parseInt(Storage.getSession('perform_number') || "0");
        if (performNumber === 0) performNumber = 100;

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
                    const mainItem = { item_name: data.name, items: [], item_texts: "", canselect: true };
                    const itemForced = listItems[positionSelected] || "";
                    let itemPerformed = "";
                    if (performNumber !== 0) itemPerformed = listItems[performNumber - 1] || "";
                    else itemPerformed = listItems[0];
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
                } catch (e) { console.error("Error adding items type 1", e); }
            }
        };

        const addItemsType2 = (sessionName) => {
            let positionSelected = 0;
            try {
                const sessionVal = Storage.getSession(sessionName);
                if (sessionVal) positionSelected = parseInt(sessionVal);
            } catch (e) { positionSelected = 0; }
            const books = Storage.findItems(sessionName);
            if (books.length > 0) {
                const mainItem = { item_name: books[0].item_title || sessionName, items: [], item_texts: "", canselect: true };
                const itemForced = Storage.getSession(sessionName + "force") || "";
                let isInList = false;
                const booksCopy = [...books];
                const indexToRemove = booksCopy.findIndex(b => b.item_name.toLowerCase().trim() === itemForced.toLowerCase().trim());
                if (indexToRemove !== -1) {
                    isInList = true;
                    booksCopy.splice(indexToRemove, 1);
                }
                let description = days.yesterday + "                ";
                let i = 1;
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
                let finalDesc = days.yesterday + "                ";
                mainItem.items.forEach((it, idx) => { finalDesc += (idx + 1) + "." + it.item_name + " "; });
                mainItem.item_texts = finalDesc;
                NotesListComponent.items.push(mainItem);
            }
        };

        const addItemsType3 = () => {
            const dummyNotes = Storage.getDummyNotes();
            let count = 1;
            dummyNotes.forEach(note => {
                const mainItem = { item_name: note.text, items: [], item_texts: "", canselect: false };
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

        await addItemsType1("celebrities.json", "celebrities");
        await addItemsType1("shoppinglist.json", "shoppinglist");
        addItemsType2("custom1");
        addItemsType2("custom2");
        addItemsType2("custom3");
        addItemsType3();

        NotesListComponent.items.forEach((item, index) => {
            const itemEl = document.createElement('div');
            itemEl.className = 'note-list-item';
            itemEl.innerHTML = `
                <div class="note-icon-container">
                    <div class="note-icon-circle"><img src="assets/images/ic_notes.png" /></div>
                </div>
                <div class="note-content">
                    <div class="note-title">${item.item_name}</div>
                    <div class="note-preview">${item.item_texts.substring(0, 50).replace(/\n/g, ' ')}...</div>
                    <div class="note-date">10/10/2018</div>
                </div>
            `;
            itemEl.addEventListener('click', () => window.app.navigate('notes_detail', { position: index }));
            listContainer.appendChild(itemEl);
        });

        // Block navigation back from notes_list when in perform mode
        document.getElementById('btn-back').addEventListener('click', () => {
            // Don't allow going back to home from notes_list if we came from perform
            // User must use 4 taps in perform mode to exit
            if (App.cameFromPerform) {
                return; // Block navigation
            }
            window.app.navigate('home');
        });
        document.getElementById('btn-add').addEventListener('click', () => {
            // Don't allow going back to home from notes_list if we came from perform
            if (App.cameFromPerform) {
                return; // Block navigation
            }
            window.app.navigate('home');
        });
    }
};

const NotesDetailComponent = {
    render: () => {
        return `
            <div class="activity-container dark" style="background-color: #070707;">
                <div class="header" style="background-color: var(--header-color);">
                    <img src="assets/images/ic_backbutton.png" class="back-button" id="detail-btn-back" />
                    <span class="header-title" id="detail-title">Notas</span>
                    <img src="assets/images/ic_brush.png" class="header-action-icon" id="detail-btn-edit" style="display: block;" />
                </div>
                <div class="content-scrollable" id="detail-scroll" style="padding: 20px;">
                    <div id="detail-date" style="font-family: 'Roboto-Regular', sans-serif; font-size: 14px; color: #cfcfcf; margin-bottom: 10px;">Ontem</div>
                    <textarea id="detail-text" style="width: 100%; height: 80vh; border: none; outline: none; font-family: 'Roboto-Regular', sans-serif; font-size: 16px; color: #ffffff; resize: none; background: #0b0b0b; border-radius: 8px; padding: 12px;" readonly></textarea>
                </div>
            </div>
        `;
    },
    init: (params) => {
        const position = params.position;
        const item = NotesListComponent.items[position];
        const days = Storage.getDays();
        if (!item) { window.app.navigate('notes_list'); return; }
        document.getElementById('detail-title').innerText = days.notes;
        document.getElementById('detail-date').innerText = days.yesterday;
        let content = "";
        if (item.items && item.items.length > 0) {
            item.items.forEach((sub, idx) => { content += (idx + 1) + ". " + sub.item_name + "\n"; });
        } else {
            content = item.item_texts;
        }
        document.getElementById('detail-text').value = content;
        document.getElementById('detail-btn-edit').addEventListener('click', () => {
            document.getElementById('detail-text').removeAttribute('readonly');
            document.getElementById('detail-text').focus();
        });
        document.getElementById('detail-btn-back').addEventListener('click', () => {
            // Allow going back to notes_list from detail
            window.app.navigate('notes_list');
        });
        document.getElementById('detail-scroll').addEventListener('touchstart', (e) => {
            if (e.touches.length === 2) window.app.navigate('home');
        });
    }
};

// ============================================
// APP MAIN
// ============================================
const App = {
    currentView: null,
    cameFromPerform: false,
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
        // Block navigation away from perform mode (except via 4 taps exit to home)
        if (App.currentView === 'perform' && route !== 'perform' && route !== 'home') {
            // Only allow exit to home (via 4 taps) or navigation to notes_list, or stay in perform
            if (route === 'notes_list') {
                // Allow navigation to notes_list
            } else {
                return; // Block all other navigation
            }
        }
        
        // Reset cameFromPerform flag when leaving perform mode
        if (App.currentView === 'perform' && route === 'home') {
            App.cameFromPerform = false;
        }
        
        // Exit fullscreen when leaving perform mode
        if (App.currentView === 'perform' && route !== 'perform' && route !== 'notes_list') {
            if (document.exitFullscreen) {
                document.exitFullscreen().catch(() => {});
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        }
        
        const component = App.routes[route];
        if (component) {
            const appDiv = document.getElementById('app');
            appDiv.innerHTML = component.render(params);
            if (component.init) component.init(params);
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
    if (now - lastTouchEnd <= 300) event.preventDefault();
    lastTouchEnd = now;
}, false);

document.addEventListener('touchmove', function (e) {
    const target = e.target;
    const isScrollable = target.closest('.content-scrollable, .perform-content, .edit-textarea');
    if (!isScrollable && e.touches.length > 1) e.preventDefault();
}, { passive: false });

document.addEventListener('contextmenu', function (e) {
    if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') e.preventDefault();
}, false);

// Handle fullscreen changes
document.addEventListener('fullscreenchange', () => {
    const setViewportHeight = () => {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    setViewportHeight();
});

document.addEventListener('webkitfullscreenchange', () => {
    const setViewportHeight = () => {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    setViewportHeight();
});

document.addEventListener('DOMContentLoaded', () => {
    const setViewportHeight = () => {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    setViewportHeight();
    window.addEventListener('resize', setViewportHeight);
    window.addEventListener('orientationchange', () => setTimeout(setViewportHeight, 100));
    App.init();
});
