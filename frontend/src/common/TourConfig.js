// src/tourConfig.js

const tourSteps = [
  {
    target: '.landingcontainer .bg-img',
    content: 'Welcome to AMA BHOOMI! This is our main landing page',
    disableBeacon: true
  },
  {
    target: '.search-bar',
    content: 'Here you can search any facility, event by name and location',
    offsetParentSelector:'iconPlayApple'
  },
  {
    target: '.logos',
    content: 'Here you can go any facility list by clicking on icon',
  },
  {
    target: '.mapSearchButton',
    content: 'Here you can search any facility location on map',
  },
  {
    target: '.nearByFacilities',
    content: 'Here you can view all facilities within the selected radius based on your location, and you can also change the radius.',
  },
  {
    target: '.notice2-container',
    content: 'Here you can see all newly updated information.',
  },
  {
    target: '.EventContainerlanding',
    content: 'Here you can see all events.',
  },
  {
    target: '.exploreNewAct-Parent-Container',
    content: 'Here you can see all activities and can book them.',
  },
  {
    target: '.galleryOuter',
    content: 'Here you can see all photos in gallery section.',
  },
  {
    target: '.iconPlayApple',
    content: 'Get the App. Download our app from the Google Play Store or Apple Store.',
  },
  {
    target: '.Search-Conatiner',
    content: 'Search. Use the search bar to find facilities by name and location.',
  }
];

export default tourSteps;
