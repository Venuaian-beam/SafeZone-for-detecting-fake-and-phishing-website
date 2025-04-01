document.addEventListener('DOMContentLoaded', () => {
  const scanButton = document.getElementById('scanButton');
  const urlInput = document.getElementById('urlInput');
  const reportStatus = document.getElementById('reportStatus');
  const potentialRisk = document.getElementById('potentialRisk');
  const recommendation = document.getElementById('recommendation');
  const viewFullReport = document.getElementById('viewFullReport');

  // Event listener for the scan button
  scanButton.addEventListener('click', async () => {
      const url = urlInput.value.trim();
      if (!url) return alert('Please enter a URL');

      reportStatus.textContent = 'Status: 🔄 Scanning...';
      potentialRisk.textContent = 'Potential Risk: Analyzing...';
      recommendation.textContent = 'Recommendation: Please wait...';

      try {
          const response = await fetch('http://localhost:5000/SafeZone', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ url })
          });

          if (!response.ok) throw new Error('Failed to fetch data');
          const data = await response.json();

          localStorage.setItem('SafeZoneReport', JSON.stringify(data));

          let riskLevel = "Safe ✅";
          let riskColor = "green";
          if (data.ipReputation?.abuseScore >= 30) {
              riskLevel = "⚠️ Medium Risk";
              riskColor = "yellow";
          }
          if (data.ipReputation?.abuseScore >= 70) {
              riskLevel = "❌ High Risk";
              riskColor = "red";
          }

          potentialRisk.innerHTML = `Potential Risk: <span style="color:${riskColor};">${riskLevel}</span>`;
          reportStatus.innerHTML = `Status: ${data.safeBrowsing || 'Unknown'}`;

          let recommendationText = "✅ This website is safe to visit.";
          if (data.ipReputation?.abuseScore >= 30) {
              recommendationText = "⚠️ This site has some risks. Proceed with caution.";
          }
          if (data.ipReputation?.abuseScore >= 70) {
              recommendationText = "❌ This website is dangerous. Avoid visiting.";
          }
          recommendation.innerHTML = `Recommendation: ${recommendationText}`;

          viewFullReport.style.display = 'block';
          viewFullReport.href = "full.html";
          viewFullReport.target = "_blank";

          // Update company information in the report
          if (data.companyInfo) {
              document.getElementById('company-name').textContent = data.companyInfo.company || "Unknown";
              document.getElementById('company-location').textContent =
                  `${data.companyInfo.city || "Unknown"}, ${data.companyInfo.region || "Unknown"}, ${data.companyInfo.country || "Unknown"}`;
          }

      } catch (error) {
          console.error('Error:', error);
          reportStatus.textContent = 'Status: ❌ Scan failed';
          potentialRisk.textContent = 'Potential Risk: Error';
          recommendation.textContent = 'Recommendation: Try again later';
      }
  });

  // Event listener for checking the current site
  document.getElementById("checkSite").addEventListener("click", async () => {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: () => {
              // Define checkSite function inside executeScript to avoid errors
              function checkSite() {
                  alert("Checking site: " + window.location.href);
                  return window.location.href;
              }
              checkSite();
          }
      });
  });
});
