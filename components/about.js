const AboutComponent = {
    render: () => {
        const version = "1.2";
        const content = `v${version}<br>Created by Nick Einhorn & Craig Squires. Developed by Marc Kerstein. With special thanks to Martyn Rowland and all our Beta Testers. To share ideas and learn the latest tips and tricks with DFB please join our Closed Facebook Site <a href="https://www.facebook.com/groups/131701277517769/">DFB-Digital Force Bag</a>. To purchase other Einhorn products head to <a href="http://www.einhorn.co.uk/shop">www.einhorn.co.uk/shop</a>.`;

        return `
            <div class="activity-container" style="background-color: #f0f0f0;">
                <div class="header" style="background-color: var(--header-color);">
                    <img src="assets/images/ic_back_arrow.png" class="back-button" id="btn-back-about" />
                    <span class="header-title">About</span>
                </div>
                <div class="content-scrollable" style="padding: 20px;">
                     <div class="about-title" style="font-family: 'NunitoSans', sans-serif; font-weight: 800; font-size: 18px; margin-bottom: 20px; color: #000;">
                        Digital Force Bag
                     </div>
                     <div class="about-content" style="font-family: 'Roboto', sans-serif; font-size: 16px; color: #000; line-height: 1.5;">
                        ${content}
                     </div>
                </div>
            </div>
        `;
    },

    init: () => {
        document.getElementById('btn-back-about').addEventListener('click', () => {
            window.app.navigate('home');
        });
    }
};
