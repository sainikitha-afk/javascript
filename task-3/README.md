# Task 3: Image Gallery Lightbox

## Objective
To develop an interactive image gallery where clicking on a thumbnail opens a larger version in a modal (lightbox overlay).

## Features Implemented
- Grid-based image gallery with thumbnails
- Click on image to open modal
- Dynamically updates modal with selected image
- Close modal using close button or clicking outside
- Smooth zoom-in animation effect
- Responsive and clean UI

## Technologies Used
- HTML5
- CSS3
- JavaScript (DOM Manipulation, Event Handling)

---

## Implementation Details

### Event Handling
- Added click event listeners to all thumbnail images
- Used a loop to attach listeners dynamically

### Dynamic Image Update
- When a thumbnail is clicked, its `src` is assigned to the modal image

### Modal Visibility
- Used a CSS class (`show`) to toggle modal visibility
- Controlled using `classList.add()` and `classList.remove()`

### Close Functionality
- Modal can be closed by:
  - Clicking the close (×) button
  - Clicking outside the image area

---

## UI Enhancements
- Hover zoom effect on thumbnails
- Smooth scaling animation for modal image
- Dark overlay background for focus
- Centered modal layout

---

## Output

### Image Gallery Demo
![Gallery Demo](js3.gif)