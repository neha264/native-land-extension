function getURL(callback) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        const currentTab = tabs[0];
        document.getElementById("url-display").textContent = currentTab.url; 
        callback(currentTab.url);
    });
}

async function getIP(domain) {
    const IPurl = `http://ip-api.com/json/${domain}`;
    try {
        const response = await fetch(IPurl); 
        const data = await response.json();
        if (data.status === "success") {
            const ip = data.query;
            document.getElementById("ip-display").textContent = ip;
            return ip;
        } else {
            console.error("Error fetching IP address:", data.message);
            document.getElementById("ip-display").textContent = "Error fetching IP address";
        }
    } catch (error) {
        console.error("Error fetching IP address:", error);
        document.getElementById("ip-display").textContent = "Error fetching IP address";
    }
}

async function getLoc(ipAddress) {
    const locationUrl = `http://ip-api.com/json/${ipAddress}`;
    try {
        const response = await fetch(locationUrl);
        const data = await response.json();
        console.log('Native Land API response:', data);
        
        if (data.status === "success") {
            const locInfo = {
                lat: data.lat,
                long: data.lon,
                isp: data.isp
            };
            document.getElementById("location-display").textContent = 
                `latitude: ${locInfo.lat}, longitude: ${locInfo.long}`;
            return locInfo;
        } else {
            console.error("error fetching location:", data.message);
            document.getElementById("location-display").textContent = "error fetching location";
        }
    } catch (error) {
        console.error("error fetching location:", error);
        document.getElementById("location-display").textContent = "error fetching location";
    }
}

async function getNativeLand(latitude, longitude) {
    const nativeLandUrl = `https://native-land.ca/api/index.php?maps=territories&position=${latitude},${longitude}`;
    try {
        const response = await fetch(nativeLandUrl);
        const data = await response.json();

        if (data.length > 0) {
            const territories = [];
            const languages = [];

            data.forEach(feature => {
                const name = feature.properties.Name;
                const description = feature.properties.description;

                if (description.includes("/territories/")) {
                    territories.push(name);
                } else if (description.includes("/languages/")) {
                    languages.push(name);
                }
            });

            const territoryText = `Territories: ${territories.join("; ")}`;
            const languageText = `Languages: ${languages.join("; ")}`;
            
            document.getElementById("land-display").textContent = 
                `${territoryText}\n${languageText}`;
            
        } else {
            document.getElementById("land-display").textContent = 
                "native land information unavailable for this location";
            console.error("native land information unavailable for this location");
        }        
    } catch (error) {
        console.error("error fetching native land data:", error);
        document.getElementById("native-land-display").textContent = 
            "error fetching native land data.";
    }
}

getURL(async (url) => {
    const domain = new URL(url).hostname;
    const IP = await getIP(domain);

    if (IP) {
        const location = await getLoc(IP);
        if (location) {
            await getNativeLand(location.lat, location.long);
        }
    }
});