
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
            songs.push(element.href)
        }
    } return songs;
}
async function main() {
    // get the list of all the songs 
    let songs = await getsongs()
    console.log(songs)

    let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0];
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li>${songs.replace("%20", " ")}</li>`
    }

    // for audio play 
    var audio = new Audio(songs[2]);
    // audio.play();
}
main()