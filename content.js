// content.js
const checkSite = async () => {
    const url = window.location.href;
    try {
      const response = await fetch("http://localhost:5000/SafeZone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url })
      });
  
      const data = await response.json();
      alert(`Site Analysis:\n- SSL: ${data.ssl}\n- IP Reputation: ${data.ipReputation.message}\n- Google Safe Browsing: ${data.safeBrowsing}`);
    } catch (error) {
      console.error("Error checking site:", error);
    }
  };
  
  checkSite();