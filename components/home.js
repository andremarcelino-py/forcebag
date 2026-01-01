const HomeComponent = {
    render: () => {
        return `
            <div class="screen center-content">
                <div class="title-heading">Digital Force Bag</div>
                
                <div class="button-container">
                    <button id="btn_about" class="btn-round">About</button>
                    <button id="btn_instruction" class="btn-round">Instructions</button>
                    <button id="btn_setting" class="btn-round">Settings</button>
                    <button id="performmenubutton" class="btn-round">Perform</button>
                </div>

                <div class="close-btn">
                    <img id="img_closebtn" src="assets/images/ic_close.png" alt="Close">
                </div>
            </div>
        `;
    },

    init: () => {
        document.getElementById('btn_about').addEventListener('click', () => {
            window.app.navigate('about');
        });

        document.getElementById('btn_instruction').addEventListener('click', () => {
            window.app.navigate('instruction');
        });

        document.getElementById('btn_setting').addEventListener('click', () => {
            window.app.navigate('settings');
        });

        document.getElementById('performmenubutton').addEventListener('click', () => {
            window.app.navigate('perform');
        });

        document.getElementById('img_closebtn').addEventListener('click', () => {
            if (confirm('Exit application?')) {
                window.close(); // May not work
            }
        });
    }
};
