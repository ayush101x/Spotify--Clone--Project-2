
// below code is for fetching songs from folder in vs code named "songs"
async function getsongs() {
    let fetched = await fetch("http://127.0.0.1:3000/songs/")
    let response = await fetched.text();
    console.log(response)
    let divv = document.createElement("div")
    divv.innerHTML = response;
    let a = divv.getElementsByTagName("a")

    let songs = []
    for (let index = 0; index < a.length; index++) {
        const element = a[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split("/songs/")[1])
        }
    } return songs;
}
const playmusic = (track) => {
    const audio = new Audio(track);
    audio.play()
}
    async function main() {

        // get the list of all the songs 
        let currentsong;
        let songs = await getsongs();

        // below code for  show all the songs in the playlist 
        let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0];
        for (const song of songs) {
            songUL.innerHTML = songUL.innerHTML + `<li>
        <img src="icons/musicicon.svg" alt="musicicon">
            <div class="info">
                <div>${song.replaceAll("%20", "")}</div>
                <div> AYUSH BHAI </div>
                    </div>
                <div class="left-side-playbtn">PlayNow 
                    <svg  version="1.1" xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512">
                        <circle cx="256" cy="256" r="256" fill="#09d747"></circle>
                        <path
                         d="M351.062,258.898l-144,85.945c-1.031,0.626-2.344,0.657-3.406,0.031c-1.031-0.594-1.687-1.702-1.687-2.937v-85.946v-85.946c0-1.218,0.656-2.343,1.687-2.938c1.062-0.609,2.375-0.578,3.406,0.031l144,85.962c1.031,0.586,1.641,1.718,1.641,2.89C352.703,257.187,352.094,258.297,351.062,258.898z"
                         fill="#000000"></path>
                         </svg>
                         </div>  
                         </li>`
        }
        // attach an event listner to each song when it is clicked
        Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(element => {

            element.addEventListener("click", async function () {
                console.log(element.querySelector(".info").firstElementChild.innerHTML.trim())
                playmusic(element.querySelector(".info").firstElementChild.innerHTML.trim())
            });
        });
    }
    main()


