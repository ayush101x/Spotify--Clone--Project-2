console.log('Lets write JavaScript');

let songs = [];
let currentsong = new Audio();
let currFolder = "NCS";

fetch('http://127.0.0.1:3000/songs/HoneySingh')
  .then(response => response.text())
  .then(text => console.log(text))
  .catch(error => console.error('Error:', error));

// Convert seconds to minutes and seconds
function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}

// Fetch the list of songs from the server
async function getSongs(folder) {
    try {
        currFolder = folder;
        let response = await fetch(`http://127.0.0.1:3000/${folder}/`);
        let text = await response.text();

        let div = document.createElement("div");
        div.innerHTML = text;
        let links = div.getElementsByTagName("a");
        songs = Array.from(links)
            .filter(element => element.href.endsWith(".mp3"))
            .map(element => element.href.split(`${folder}/`)[1]);

        updateSongList();
        return songs;
    } catch (error) {
        console.error("Error fetching songs:", error);
        return [];
    }
}

console.log('Songs array:', songs);

// Update the song list UI
function updateSongList() {
    let songUL = document.querySelector(".songlist ul");
    songUL.innerHTML = '';

    for (const song of songs) {
        if (song) { // Ensure song is defined
            songUL.innerHTML += `
                <li>
                    <img src="icons/musicicon.svg" alt="musicicon">
                    <div class="info">
                        <div>${song.replaceAll("%20", " ")}</div>
                        <div>AYUSH BHAI</div>
                    </div>
                    <div class="left-side-playbtn">
                        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                            <circle cx="256" cy="256" r="256" fill="#09d747"></circle>
                            <path d="M351.062,258.898l-144,85.945c-1.031,0.626-2.344,0.657-3.406,0.031c-1.031-0.594-1.687-1.702-1.687-2.937v-85.946v-85.946c0-1.218,0.656-2.343,1.687-2.938c1.062-0.609,2.375-0.578,3.406,0.031l144,85.962c1.031,0.586,1.641,1.718,1.641,2.89C352.703,257.187,352.094,258.297,351.062,258.898z" fill="#000000"></path>
                        </svg>
                    </div>
                </li>`;
        } else {
            console.error('Undefined song:', song);
        }
    }

    // Attach event listeners to the updated song list
    Array.from(songUL.getElementsByTagName("li")).forEach(li => {
        li.addEventListener("click", () => {
            const songName = li.querySelector(".info div").textContent.trim();
            playMusic(songName);
        });
    });
}


// Play selected song
function playMusic(track, pause = false) {
    currentsong.src = `/${currFolder}/` + track;
    if (!pause) {
        currentsong.play();
        document.getElementById("play").src = "icons/pause.svg";
    }
    document.querySelector(".song-text").textContent = decodeURI(track);
    document.querySelector(".song-duration").textContent = "00:00 / 00:00";
}

// Play/Pause button event listener
document.getElementById("play").addEventListener("click", () => {
    if (currentsong.paused) {
        currentsong.play();
        document.getElementById("play").src = "icons/pause.svg";
    } else {
        currentsong.pause();
        document.getElementById("play").src = "icons/play.svg";
    }
});

// Update time and seek bar
currentsong.addEventListener("timeupdate", () => {
    if (currentsong.duration) {
        document.querySelector(".song-duration").textContent = `${secondsToMinutesSeconds(currentsong.currentTime)} / ${secondsToMinutesSeconds(currentsong.duration)}`;
        document.querySelector(".circle").style.left = (currentsong.currentTime / currentsong.duration) * 100 + "%";
    }
});

// Seek bar event
document.querySelector(".seek-bar").addEventListener("click", e => {
    let changedPercent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = changedPercent + "%";
    currentsong.currentTime = (currentsong.duration * changedPercent) / 100;
});

// Hamburger menu events
document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0%";
});

document.querySelector(".closeHamberger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-120%";
});

// Previous and next buttons
document.getElementById("previous").addEventListener("click", () => {
    let index = songs.indexOf(currentsong.src.split(`/songs/${currFolder}/`)[1]);
    if (index > 0) {
        playMusic(songs[index - 1]);
    } else {
        console.log("No previous song available.");
    }
});

document.getElementById("next").addEventListener("click", () => {
    let index = songs.indexOf(currentsong.src.split(`/songs/${currFolder}/`)[1]);
    if (index >= 0 && index < songs.length - 1) {
        playMusic(songs[index + 1]);
    } else {
        console.log("No next song available.");
    }
});

// Volume control
document.querySelector(".range input").addEventListener("input", e => {
    currentsong.volume = e.target.value / 100;
});

// Card click event
Array.from(document.getElementsByClassName("card")).forEach(card => {
    card.addEventListener("click", async item => {
        console.log("Fetching Songs");
        songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`);
        if (songs.length > 0) {
            playMusic(songs[0]);
        }
    });
});

