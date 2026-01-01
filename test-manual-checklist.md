# Manual Test Checklist

Use this checklist to verify the functionality of the Web conversion.

## 1. Initial Setup & Home
- [ ] Open `index.html`.
- [ ] Verify the Home screen loads with "Digital Force Bag", "Start", "Instructions", "About", "Settings" buttons.
- [ ] Verify the "Start" button style (Orange with rounded corners).

## 2. Instructions & About
- [ ] Click "Instructions". Verify text content loads and matches the Android app description.
- [ ] Click "Back". Verify return to Home.
- [ ] Click "About". Verify version info and links.
- [ ] Click "Back".

## 3. Settings & Customization
- [ ] Click "Settings".
- [ ] **Custom Lists**:
    - [ ] Click "Custom 1".
    - [ ] Verify list of items appears.
    - [ ] Click an item (e.g., "Item 1"). Verify it can be renamed.
    - [ ] Change "Item 1" to "Apple".
    - [ ] Click "Back".
    - [ ] Re-open "Custom 1". Verify "Apple" is saved.
    - [ ] Click "Reset". Confirm dialog. Verify list resets to defaults.
- [ ] **Force Items**:
    - [ ] Click "Celebrities".
    - [ ] Select a celebrity (e.g., "Brad Pitt"). Verify a tick/check appears.
    - [ ] Click "Back".
    - [ ] Re-open "Celebrities". Verify selection is persisted.
- [ ] **Customise**:
    - [ ] Click "Customise".
    - [ ] Verify Dummy Notes list appears.
    - [ ] Edit a note title or description.
    - [ ] Click "Back".
    - [ ] Re-open. Verify changes saved.
- [ ] **Languages**:
    - [ ] Click "Languages".
    - [ ] Edit "Monday" to "Lunes".
    - [ ] Click "Back".
    - [ ] Re-open. Verify "Lunes" is saved.

## 4. Perform Mode ( The Trick )
- [ ] From Home, click "Start".
- [ ] **Tab Navigation**:
    - [ ] Verify 3 dots at bottom.
    - [ ] Swipe left/right or click dots to switch tabs (pages).
    - [ ] **Page 1 (Tab 0)**: Icons like Translate, Maps, Facebook.
    - [ ] **Page 2 (Tab 1)**: Icons like Spotify, SoundCloud.
    - [ ] **Page 3 (Tab 2)**: Icons like Amazon, Notes.
- [ ] **Perform Logic Test**:
    - [ ] Go to **Page 1**. Click "OneStudio" (Value 1).
    - [ ] Go to **Page 2**. Click "InFocus" (Value 1).
    - [ ] Go to **Page 3**. Click "Notes".
    - [ ] **Result**: This should open the **Notes List**.
    - [ ] Verify the content of the Notes List. The items should be influenced by the "11" (1 and 1) selection if the logic holds. (Calculated number: 11).
    - [ ] Check if the 11th item (or corresponding logic) is forced/displayed in the list description.

## 5. Notes List & Detail
- [ ] In "Notes List":
    - [ ] Scroll through items.
    - [ ] Click on an item.
    - [ ] **Detail View**:
        - [ ] Verify the detail text is displayed.
        - [ ] Verify the date matches "Yesterday" (or configured day).
        - [ ] Click "Edit". Verify text becomes editable.
        - [ ] Click "Back".

## 6. Exit
- [ ] In Perform screen, double-tap the top or bottom black bar.
- [ ] Verify it returns to Home screen.
