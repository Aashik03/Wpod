console.log("Config object:", window.config);
console.log("API Key:", window.config ? window.config.apiKey : "Config not loaded");


document.addEventListener("DOMContentLoaded", function () {
    const menuBtn = document.getElementById("menuBtn");
    const centerBtn = document.getElementById("center");
    const screen = document.getElementById("screen");
    const apiKey = config.apiKey;
    
    // Check if config.apiKey is defined
    if (typeof config === "undefined" || !config.apiKey) {
        console.error("API Key is missing! Make sure config.js is linked in your HTML.");
        return;
    }

    let currentSelection = "menu"; // Track current screen state

    // Function to reset screen to the main menu
    function showMenu() {
        screen.innerHTML = `
            <button id="music">Music</button>
            <button id="video">Video</button>
            <button id="settings">Settings</button>
        `;
        currentSelection = "menu";
        addMenuListeners(); // Add event listeners again for new elements
    }

    // Ensure menu button always brings back main options
    menuBtn.addEventListener("click", showMenu);

    // Function to add event listeners to dynamically created buttons
    function addMenuListeners() {
        document.getElementById("music").addEventListener("click", () => {
            screen.innerHTML = `
            <input type='text' id='search1' placeholder='Which song?'>`;
            currentSelection = "music";
        });

        document.getElementById("video").addEventListener("click", () => {
            screen.innerHTML = `<input type='text' id='search2' placeholder='Which video?'>`;
            currentSelection = "video";
        });

        document.getElementById("settings").addEventListener("click", () => {
            screen.innerHTML = `<p>Settings Page</p>`;
            currentSelection = "settings";
        });
    }

    // Handle center button click (Enter)
    centerBtn.addEventListener("click", () => {
        console.log(`Center button clicked! Current Selection: ${currentSelection}`);

        if (currentSelection === "music") {
            const inputBox = document.getElementById("search1");
            if (!inputBox) {
                console.error("Music search input box not found!");
                return;
            }
            const query = inputBox.value.trim();
            if (!query) {
                alert("Enter a song name!");
                return;
            }
            console.log("Searching for music:", query);
            searchYouTube(query, "music");
        }

        if (currentSelection === "video") {
            const inputBox = document.getElementById("search2");
            if (!inputBox) {
                console.error("Video search input box not found!");
                return;
            }
            const query = inputBox.value.trim();
            if (!query) {
                alert("Enter a video name!");
                return;
            }
            console.log("Searching for video:", query);
            searchYouTube(query, "video");
        }
    });

    //song using api

 /*   // Search YouTube API
    function searchYouTube(query, type) {
        console.log(`Fetching YouTube API for: ${query}`);
       fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&key=${apiKey}&maxResults=1&type=video&videoEmbeddable=true`)

            .then(response => response.json())
            .then(data => {
                console.log("API Response:", data);
                if (!data.items || data.items.length === 0) {
                    alert("No results found!");
                    return;
                }
                const videoId = data.items[0]?.id?.videoId;
                if (!videoId) {
                    alert("No video ID found!");
                    return;
                }
                playVideo(videoId);
            })
            .catch(error => console.error("Error fetching video:", error));
    }

    // Play Video in the Screen
    function playVideo(videoId) {
        console.log("Playing video:", videoId);
        screen.innerHTML = `<div id="player"></div>`;
        
        // Ensure YouTube API is ready before loading the player
        if (typeof YT === "undefined" || typeof YT.Player === "undefined") {
            console.error("YouTube API not loaded!");
            return;
        }

        new YT.Player("player", {
            videoId: videoId,
            playerVars: {
                autoplay: 1,
                controls: 0,
                modestbranding: 1,
                rel: 0,
                showinfo: 0,
                origin: window.location.origin // ✅ Important!
            }
        });
    }*/

    // Initially show menu when the page loads
    showMenu();
});
