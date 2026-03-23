# Task 9: Infinite Scrolling Content Loader

## Objective
To create a web page that dynamically loads additional content as the user scrolls toward the bottom, simulating an infinite feed experience.

## Features Implemented
- Automatic loading of new content on scroll
- Detection of scroll position near bottom of page
- Asynchronous data loading using simulated API calls
- Dynamic DOM updates to append new content
- Loading indicator for better user experience
- Continuous infinite scrolling behavior
- Smooth and responsive UI

## Technologies Used
- HTML5
- CSS3
- JavaScript (DOM Manipulation, Events, Async/Await, Promises)

---

## Implementation Details

### Scroll Detection
- Used the window scroll event to detect when the user reaches near the bottom of the page
- Triggered loading of new content based on scroll position

### Asynchronous Data Loading
- Simulated API calls using Promises and setTimeout
- Used async/await to handle asynchronous operations cleanly

### Dynamic Content Rendering
- Created and appended new content elements to the DOM dynamically
- Maintained a page counter to generate unique content

### Loading Control
- Used a loading flag to prevent multiple simultaneous requests
- Displayed a loader indicator while fetching new data

### Auto-fill Mechanism
- Ensured the page loads enough content initially to enable scrolling
- Automatically loads more content if the page height is insufficient

---

## UI Enhancements
- Card-based layout for content
- Subtle shadows and spacing for readability
- Loading indicator for feedback
- Smooth scrolling experience

---

## Output

### Infinite Scroll Demo
![Infinite Scroll Demo](scroll.mp4)