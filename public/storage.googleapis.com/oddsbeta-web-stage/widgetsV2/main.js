// Function to dynamically load a script
function loadScript(src) {
  const script = document.createElement('script');
  script.src = src;
  script.async = true;
  document.head.appendChild(script);
}

// Load the target JS file dynamically
loadScript('/scorecard.uni247.online/widgetsV2/main_core.js');
