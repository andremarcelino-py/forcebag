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
            { name: "Notes", icon: "ic_notes.png", action: 'app', clickable: true },
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
                        <p class="tutorial-text">Double tap on top or bottom black bar to exit from this screen.</p>
                        <button id="btn_gotit" class="btn-gotit">GOT IT</button>
                    </div>
                </div>

                <div class="perform-header" id="perform-header">
                    <!-- Header area for double tap exit -->
                </div>

                <div class="perform-content">
                    <div class="view-pager" id="view-pager">
                        <!-- Grid content will be injected here -->
                    </div>
                </div>
                
                <div class="page-indicator" id="page-indicator">
                    <div class="dot active"></div>
                    <div class="dot"></div>
                    <div class="dot"></div>
                </div>

                <div class="perform-footer" id="perform-footer">
                    <!-- Footer area for double tap exit -->
                </div>
            </div>
        `;
    },

    init: async () => {
        // Check tutorial session
        const tutorial = Storage.getSession("SESSION_TUTORIAL");
        if (tutorial !== "1") {
            document.getElementById('tutorial-overlay').style.display = 'flex';
        }

        document.getElementById('btn_gotit').addEventListener('click', () => {
            Storage.saveSession("SESSION_TUTORIAL", "1");
            document.getElementById('tutorial-overlay').style.display = 'none';
        });

        // Exit Logic: Double Tap & 2-Finger Touch (HyperOS optimized)
        let lastTap = 0;
        let exitTouchStartTime = 0;
        let isTwoFingerTouch = false;
        
        const handleExitAction = (e) => {
            // Check for 2-finger touch
            if (e.type === 'touchstart' || e.type === 'touchmove') {
                if (e.touches && e.touches.length === 2) {
                    isTwoFingerTouch = true;
                    window.app.navigate('home');
                    return;
                } else if (e.touches && e.touches.length === 1) {
                    isTwoFingerTouch = false;
                }
            }

            // Check for Double Tap on header/footer (HyperOS compatible)
            if (e.target.id === 'perform-header' || e.target.id === 'perform-footer') {
                const currentTime = Date.now();
                const tapLength = currentTime - lastTap;
                if (tapLength < 500 && tapLength > 0) {
                    e.preventDefault();
                    window.app.navigate('home');
                }
                lastTap = currentTime;
            }
        };

        const performScreen = document.getElementById('perform-screen');
        const performHeader = document.getElementById('perform-header');
        const performFooter = document.getElementById('perform-footer');
        
        // Header and Footer double tap
        performHeader.addEventListener('touchstart', handleExitAction, { passive: true });
        performFooter.addEventListener('touchstart', handleExitAction, { passive: true });
        performHeader.addEventListener('click', handleExitAction);
        performFooter.addEventListener('click', handleExitAction);
        
        // Two-finger swipe down detection
        let twoFingerStartY = 0;
        performScreen.addEventListener('touchstart', (e) => {
            if (e.touches.length === 2) {
                twoFingerStartY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
                isTwoFingerTouch = true;
            }
        }, { passive: true });
        
        performScreen.addEventListener('touchmove', (e) => {
            if (e.touches.length === 2 && isTwoFingerTouch) {
                const currentY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
                const diffY = currentY - twoFingerStartY;
                if (diffY > 100) { // Swipe down with 2 fingers
                    e.preventDefault();
                    window.app.navigate('home');
                    isTwoFingerTouch = false;
                }
            }
        }, { passive: false });
        
        performScreen.addEventListener('touchend', () => {
            isTwoFingerTouch = false;
        }, { passive: true });

        // Render initial tab
        PerformComponent.renderTab(0);

        // Swipe simulation (simplified with click on dots for now, or touch events)
        const dots = document.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                PerformComponent.switchTab(index);
            });
        });
        
        // Add swipe listeners (HyperOS optimized)
        const viewPager = document.getElementById('view-pager');
        let touchStartX = 0;
        let touchStartY = 0;
        let touchEndX = 0;
        let touchEndY = 0;
        let swipeStartTime = 0;
        let isSwiping = false;
        const SWIPE_THRESHOLD = 50;
        const SWIPE_VELOCITY_THRESHOLD = 0.3;
        
        viewPager.addEventListener('touchstart', e => {
            if (e.touches.length === 1) { // Only track single touch for swipe
                touchStartX = e.touches[0].clientX;
                touchStartY = e.touches[0].clientY;
                swipeStartTime = Date.now();
                isSwiping = false;
            }
        }, { passive: true });
        
        viewPager.addEventListener('touchmove', e => {
            if (e.touches.length === 1 && !isSwiping) {
                const diffX = Math.abs(e.touches[0].clientX - touchStartX);
                const diffY = Math.abs(e.touches[0].clientY - touchStartY);
                // Start swiping if horizontal movement is significant
                if (diffX > 10 || diffY > 10) {
                    isSwiping = true;
                }
            }
        }, { passive: true });
        
        viewPager.addEventListener('touchend', e => {
            if (e.changedTouches.length === 1 && isSwiping) {
                touchEndX = e.changedTouches[0].clientX;
                touchEndY = e.changedTouches[0].clientY;
                const touchEndTime = Date.now();
                handleSwipe(touchEndTime - swipeStartTime);
                isSwiping = false;
            }
        }, { passive: true });
        
        const handleSwipe = (duration) => {
            const diffX = touchEndX - touchStartX;
            const diffY = touchEndY - touchStartY;
            const velocity = Math.abs(diffX) / duration;

            // Check for Swipe Down (Exit) - Android logic
            if (diffY > SWIPE_THRESHOLD && Math.abs(diffX) < 100) {
                 window.app.navigate('home');
                 return;
            }

            // Horizontal Swipe with velocity check for better responsiveness
            if (Math.abs(diffX) > SWIPE_THRESHOLD || (Math.abs(diffX) > 30 && velocity > SWIPE_VELOCITY_THRESHOLD)) {
                if (diffX < 0) {
                    // Swipe Left (Next)
                    if (PerformComponent.state.activeTab < 2) {
                        PerformComponent.switchTab(PerformComponent.state.activeTab + 1);
                    }
                } else {
                    // Swipe Right (Prev)
                    if (PerformComponent.state.activeTab > 0) {
                        PerformComponent.switchTab(PerformComponent.state.activeTab - 1);
                    }
                }
            }
        };
    },

    renderTab: (tabIndex) => {
        const gridContainer = document.getElementById('view-pager');
        const items = PerformComponent.data[`tab${tabIndex}`];
        
        let html = '<div class="grid-container">';
        items.forEach((item, index) => {
            if (item.hidden) {
                html += `<div class="grid-item hidden"></div>`;
                return;
            }
            html += `
                <div class="grid-item" data-index="${index}" data-tab="${tabIndex}">
                    <img src="assets/images/${item.icon}" alt="${item.name}">
                    <span>${item.name}</span>
                </div>
            `;
        });
        html += '</div>';
        
        gridContainer.innerHTML = html;
        
        // Add click/touch listeners to items (HyperOS optimized)
        const gridItems = gridContainer.querySelectorAll('.grid-item');
        gridItems.forEach(el => {
            let itemTouchStartTime = 0;
            
            // Touch events for better mobile responsiveness
            el.addEventListener('touchstart', (e) => {
                itemTouchStartTime = Date.now();
                e.stopPropagation();
            }, { passive: true });
            
            el.addEventListener('touchend', (e) => {
                const touchDuration = Date.now() - itemTouchStartTime;
                // Only trigger if it's a quick tap (not a swipe)
                if (touchDuration < 300) {
                    e.preventDefault();
                    const index = parseInt(el.dataset.index);
                    const item = items[index];
                    PerformComponent.handleItemClick(item);
                }
            }, { passive: false });
            
            // Fallback for click
            el.addEventListener('click', (e) => {
                const index = parseInt(el.dataset.index);
                const item = items[index];
                PerformComponent.handleItemClick(item);
            });
        });

        // Update indicators
        const dots = document.querySelectorAll('.dot');
        dots.forEach((dot, i) => {
            if (i === tabIndex) dot.classList.add('active');
            else dot.classList.remove('active');
        });
    },

    switchTab: (newTabIndex) => {
        const oldTabIndex = PerformComponent.state.activeTab;
        PerformComponent.state.activeTab = newTabIndex;
        
        // Update Logic (from onPageSelected in PerformActivity.java)
        const position = newTabIndex;
        const { position_last, position_number } = PerformComponent.state;

        if (position_last > position) {
            // Moving back
            if (position === 0) {
                PerformComponent.state.number_page1 = 0;
                PerformComponent.state.number_page2 = 0;
            }
            if (position === 1) {
                PerformComponent.state.number_page2 = 0;
            }
            if (position === 2) {
                PerformComponent.state.number_page2 = position_number;
            }
        } else {
            // Moving forward
            if (position === 0) {
                PerformComponent.state.number = 0;
                PerformComponent.state.number_page1 = 0;
                PerformComponent.state.number_page2 = 0;
            }
            if (position === 1) {
                PerformComponent.state.number_page1 = position_number;
            }
            if (position === 2) {
                PerformComponent.state.number_page2 = position_number;
            }
            if (position_last === 2) {
                PerformComponent.state.number_page2 = 0;
            }
        }

        PerformComponent.state.number = (PerformComponent.state.number_page1 * 10) + PerformComponent.state.number_page2;
        PerformComponent.state.position_number = 0; // Reset after consumption
        PerformComponent.state.position_last = position;

        console.log("State Updated: number=", PerformComponent.state.number);
        Storage.saveSession('perform_number', PerformComponent.state.number.toString());

        PerformComponent.renderTab(newTabIndex);
    },

    handleItemClick: (item) => {
        if (item.action === 'app') {
             // Open Notes List
             window.app.navigate('notes_list');
             return;
        }

        if (item.clickable === false) return;

        // Save value to state
        PerformComponent.state.position_number = item.value || 0;
        console.log("Item Clicked, value:", PerformComponent.state.position_number);
    }
};
