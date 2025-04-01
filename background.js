chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    if (message.action === "scan_url") {
        try {
            console.log("Scanning URL:", message.url);
            const response = await fetch("http://localhost:5000/SafeZone", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url: message.url })
            });

            if (!response.ok) throw new Error("Failed to fetch data");
            const data = await response.json();
            console.log("Scan Result:", data);

            sendResponse(data);
        } catch (error) {
            console.error("Error:", error);
            sendResponse(null);
        }
    }
    return true; // Required for async response
});
