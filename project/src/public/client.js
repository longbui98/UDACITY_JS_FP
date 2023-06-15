let store = {
    user: { name: "Dev" },
    apod: '',
    rovers: ['Curiosity', 'Opportunity', 'Spirit'],
}

// add our markup to the page
const root = document.getElementById('root')

const updateStore = (store, newState) => {
    store = Object.assign(store, newState)
    render(root, store)
}

const render = async (root, state) => {
    root.innerHTML = App(state)
}


// create content
const App = (state) => {
    if (state.get('newCurrentRover') === none) {
        return (`
            <header>
            <div class="navbar-flex">
                <div class="logo-flex" onclick="handleHome(event)">
                    <a href="#"><img src="./assets/mars.png" alt="Mars icon"></a>
                        <p>Mars</p>
                </div>
            </div>
            </header>
            <div class="container" style="background-image: url(${ImageOfTheDay(state)});">
                <div class="wrapper-buttons">
                    <h1 class="main-title">Discover Mars Rovers</h1>		
                    <div class="button-container">${renderMenu(state)}</div>
                </div>
            </div>
        `)
    } else {
        return (`
        <header>
            <div class="navbar-flex">
                <div class="logo-flex" onclick="handleHome(event)">
                   <a href="#"><img src="./assets/mars.png" alt="Mars icon"></a>
                    <p>Mars</p>
                 </div>
                 <ul class="items-navbar">${renderMenuItems(state)}<ul>
            </div>
        </header>
        <div class="container-info">
            <h1 class="title">Discover everything to know about <span>${state.get('currentRover').latest_photos[0].rover.name}</span></h1>		
            <div class="gallery">${renderImages(state)}</div>
        </div>
        `)
    }
}

// listening for load event because page should load before any JS is called
window.addEventListener('load', () => {
    render(root, store)
})

// ------------------------------------------------------  COMPONENTS

// Example of a pure function that renders infomation requested from the backend
const ImageOfTheDay = (apod) => {

    // If image does not already exist, or it is not from today -- request it again
    const today = new Date()
    const photodate = new Date(apod.date)
    console.log(photodate.getDate(), today.getDate());

    console.log(photodate.getDate() === today.getDate());
    if (!apod || apod.date === today.getDate()) {
        getImageOfTheDay(store)
    }

    // check if the photo of the day is actually type video!
    if (apod.media_type === "video") {
        return (`
                    < p > See today's featured video <a href="${apod.url}">here</a></>
                        < p > ${apod.title}</ >
                            <p>${apod.explanation}</p>
        `)
    } else {
        return (`
            < img src = "${apod.image.url}" height = "350px" width = "100%" />
                <p>${apod.image.explanation}</p>
        `)
    }
}

const renderMenu = (state) => {
    return `<ul class="flex">${renderButtonState(state)}</ul>`
}

const renderButtonState = (state) => {
    return Array.from(state.get('rovers')).map(item =>
        `<li id=${item} class="flex-item btn" onclick="handleClick(event)">
            <a ref="#"  class=""  >${capitalize(`${item}`)}</a>
        </li>`
    ).join("")
}


const renderMenuItems = (state) => {
    return Array.from(state.get('rovers')).map(item =>
        `<li id=${item} class="" onclick="handleClick(event)">
            <a ref="#"  class=""  >${capitalize(`${item}`)}</a>
        </li>`
    ).join("")
}

const capitalize = (value) => {
    //Capitalize only first character of word
    return `${value[0].toUpperCase()}${word.slice(1)}`;
}

const renderImages = (state) => {
    const detailsInformation = state.get('newCurrentRover');

    return Array.from(base.latest_photos).map(value =>
        `<div class="wrapper">
            <img class="${item.img_src}/>
            <p><span>Image date:</span> ${item.earth_date}</p>
            <p><span>Rover:</span> ${item.rover.name}</p>
            <p><span>State of the rover:</span> ${item.rover.status}</p>
            <p><span>Launch date:</span> ${item.rover.launch_date}</p>
            <p><span>Landing date:</span> ${item.rover.landing_date}</p>
        </div>`)
}

const handleClick = event => {
    const { id } = event.currentTarget;

    if (Array.from(store.get('rovers')).includes(id)) {
        getRoverImages(id, store);
    }
    else {
        console.log('The id is not include. Please check');
    }
}

const handleHome = event => {
    const newState = store.set('newCurrentRover', 'none');
    updateStore(store, newState);
}

// ------------------------------------------------------  API CALLS

// Example API call
const getImageOfTheDay = (state) => {
    let { apod } = state

    fetch(`http://localhost:3000/apod`)
        .then(res => res.json())
        .then(apod => updateStore(store, { apod }))
        .catch(error => console.log(error));

    return data
}


const getImagesRover = async (roverName, state) => {
    let { currentRover } = state;

    currentRover = await fetch(`http://localhost:3000/rovers/${roverName}`)
        .then(res => currentRover = res.json()).catch(error => console.log(error));

    const newState = store.set('newCurrentRover', currentRover);

    updateStore(store, newState);
    return roverName;
}