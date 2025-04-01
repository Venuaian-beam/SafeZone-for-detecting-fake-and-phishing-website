function learnMore() {
    alert("SafeZone helps you browse safely by verifying websites and ensuring your online security.");
}

// Function to connect to backend and check website safety
function checkWebsiteSafety() {
    const urlInput = document.getElementById("urlInput").value;
    if (!urlInput) {
        alert("Please enter a website URL.");
        return;
    }
    
    fetch('http://your-backend-url.com/api/check-safety', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ website: urlInput })
    })
    .then(response => response.json())
    .then(data => {
        alert(`Website Safety: ${data.status}`);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}
