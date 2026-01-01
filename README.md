# Digital Force Bag (Web Version)

This is a complete port of the Digital Force Bag Android application to a static Web Application (HTML/CSS/JavaScript). It replicates the functionality, layout, and logic of the original Java application.

## Project Structure

```
web/
├── assets/
│   ├── images/       # Icons and UI assets migrated from Android drawables
│   └── json/         # Data files migrated from Android assets
├── components/       # JavaScript components representing Screens/Fragments
│   ├── home.js
│   ├── perform.js
│   ├── settings.js
│   ├── notes_list.js
│   └── ...
├── services/
│   └── storage.js    # LocalStorage wrapper replacing SugarORM/SharedPrefs
├── app.js            # Main application entry point and router
├── index.html        # Single Page Application entry
└── styles.css        # Global styles and layout
```

## How to Run

Since this is a static web application, you can run it by simply opening `index.html` in a modern web browser.

However, for the best experience and to avoid CORS issues with local JSON files (depending on browser security settings), it is recommended to use a local development server.

### Using Python (if installed)
```bash
cd web
python -m http.server 8000
# Open http://localhost:8000 in your browser
```

### Using Node.js/http-server
```bash
npx http-server web
```

## Asset Migration
- **JSON Files**: All JSON files from Android `assets/json` have been migrated to `web/assets/json`.
- **Images**: Icons from `mipmap-xhdpi` have been migrated to `web/assets/images`.
- **Fonts**: TTF fonts from Android `assets` have been migrated to `web/assets/fonts` and configured in `styles.css` to match Android's `Typeface` usage (Roboto for headings, NunitoSans for items/details).

## Logic Replication Notes
- **Data Persistence**: Android's `SugarORM` and `SessionManager` are replicated using browser `localStorage` in `services/storage.js`.
- **Navigation**: `PerformActivity` ViewPager logic is replicated using a custom tab switcher in `components/perform.js` with swipe gestures (including the specific 2-finger exit gesture).
- **List Logic**: The complex item shuffling and description generation logic in `NotesListActivity` (including specific index offsets and counters) has been faithfully ported to `components/notes_list.js` to ensure identical behavior.
- **Font Styling**: Custom fonts (`NunitoSans`, `Roboto`) are applied via `@font-face` to match the exact look of the native app.

## Running the App

## Known Limitations

-   **System UI**: Web apps cannot control the device status bar or navigation bar colors like the Android app does.
-   **Hardware Buttons**: The physical "Back" button behavior depends on the browser history. The app implements on-screen back buttons for navigation.

