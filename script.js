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
            searchAudiusSong(query);
          //  searchSpotifySong(query);
           // searchYouTube(query, "music");
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
    
    async function searchAudiusSong(query) {
        console.log("Searching Audius for:", query);
        
        try {
            const response = await fetch(
                `https://corsproxy.io/?https://api.audius.co/v1/tracks/search?query=${query}&limit=1`
            );
            const data = await response.json();
            
            if (!data.data || data.data.length === 0) {
                console.error("No results found on Audius!");
                alert("No results found!");
                return;
            }
    
            const track = data.data[0]; // ✅ Ensure track exists
            console.log("Found:", track.title, "by", track.artist);
            console.log("Stream URL:", track.stream_url);
    
            // 🎵 Play song
            playAudiusSong(track.stream_url);
            
        } catch (error) {
            console.error("Error fetching Audius data:", error);
            alert("Failed to load song. Try again!");
        }
    }
    
    
    function playAudiusSong(url) {
        if (!url) {
            alert("No stream available for this song!");
            return;
        }
    
        screen.innerHTML = `
            <audio controls autoplay>
                <source src="${url}" type="audio/mpeg">
                Your browser does not support the audio element.
            </audio>
        `;
    }
    
    
 /*
    //getting an access token from spotify
        const clientId = config.clientId;
        const clientSecret = config.clientSecret;

        async function getSpotifyToken() {
            const response = await fetch("https://accounts.spotify.com/api/token", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Authorization": "Basic " + btoa(clientId + ":" + clientSecret),
                },
                body: "grant_type=client_credentials",
            });

            const data = await response.json();
            return data.access_token;
        }

        async function searchSpotifySong(query) {
    const token = await getSpotifyToken();
    
    const response = await fetch(
        `https://api.spotify.com/v1/search?q=${query}&type=track&limit=1`,
        {
            headers: { Authorization: `Bearer ${token}` }
        }
    );

    const data = await response.json();
    if (data.tracks.items.length > 0) {
        const track = data.tracks.items[0];
        console.log("Found:", track.name, "by", track.artists[0].name);
        console.log("Preview URL:", track.preview_url); // 30-sec preview
        console.log("Spotify Link:", track.external_urls.spotify); // Full song link
        return track.preview_url; // Return preview URL to play
    } else {
        console.log("No results found");
        return null;
    }
}

// Example usage
searchSpotifySong("Blinding Lights").then(preview => {
    if (preview) {
        const audio = new Audio(preview);
        audio.play();
    }
});
*/


    //Search YouTube API
    function searchYouTube(query) {
        console.log(`Searching YouTube for: ${query}`);
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
    
                // Embed the video
                playVideo(videoId);
            })
            .catch(error => {
                console.error("Error fetching video:", error);
                alert("Error fetching video. Try again!");
            });
    }
    
    // Play the video using the YouTube player API
    function playVideo(videoId) {
        console.log("Playing video:", videoId);
    
        const screen = document.getElementById("screen");
        screen.innerHTML = `<div id="player"></div>`; // Set up the player div
    
        if (typeof YT === "undefined" || typeof YT.Player === "undefined") {
            console.error("YouTube API not loaded yet!");
            return;
        }
    
        // Create the YouTube player instance
        new YT.Player("player", {
            videoId: videoId,
            playerVars: {
                autoplay: 1,
                controls: 1,  // Show video controls
                modestbranding: 1,
                rel: 0,
                showinfo: 0,
                origin: window.location.origin  // Ensuring that origin is correct
            }
        });
    }
    
    // Initially show menu when the page loads
    showMenu();
});
