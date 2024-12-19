// Load Buttons----------
const loadButtons = async () => {
    const url = 'https://openapi.programming-hero.com/api/phero-tube/categories';
    const res = await fetch(url);
    const data = await res.json();
    displayButtons(data.categories);
}


// Show Posted Time---------
const getHourMinuteSecond = (second) => {
    const hour = parseInt(second / 3600);
    const remainingTime = second % 3600;
    const minute = parseInt(remainingTime / 60);
    const remainingSecond = second % 60;

    return `${hour} hour, ${minute} minute, ${remainingSecond} second ago`
}


// Active Class Remove--------
const activeRemove = () => {

    //    Active Class Remove In All Button
    document.getElementById('all-btn').classList.remove('active');

    const buttons = document.getElementsByClassName('dynamic');
    for (let button of buttons) {
        //    Active Class Remove In Dynamic Button
        button.classList.remove('active')
    }
}


// Details Data Load-----
const detailsInModal = async id => {
    const res = await fetch(`https://openapi.programming-hero.com/api/phero-tube/video/${id}`);
    const data = await res.json();
    displayDetailInModal(data.video);
}

// Display Detail In Modal
const displayDetailInModal = data => {
    const modalContentDiv = document.getElementById('modal-content')

    //    -------------Open Modal-------------
    // Way-01 from ID in open modal button
    // document.getElementById('show-modal').click();

    // Way-02 from ID in dialog tag
    document.getElementById('openModal').showModal();

    // Display In Modal
    modalContentDiv.innerHTML = `
        <img class="w-full rounded-md" src="${data.thumbnail}" alt="">
        <p>${data.description}</p>
`;
}


// Data Load By Search---------------
const dataLoadBySearch = () => {
    document.getElementById('search-field').addEventListener('keyup', function (e) {
        const searchValue = e.target.value;

        fetch(`https://openapi.programming-hero.com/api/phero-tube/videos?title=${searchValue}`)
            .then(res => res.json())
            .then(data => {
                // Videos Container Clear
                document.getElementById('show-all-videos-container').innerHTML = '';

                // Active Class Remove In All and Dynamic Buttons
                activeRemove()

                videosDisplay(data.videos)
            });
    });
}


// All Videos Load---------
// All button click
document.getElementById('all-btn').addEventListener('click', function () {

    // Active Class Remove In All and Dynamic Buttons
    activeRemove()

    //    Active Class Add In All Button
    document.getElementById('all-btn').classList.add('active')

    // Empty Section Hidden Add
    document.getElementById('no-content-section').classList.add('hidden');

    // Videos Container Clear
    document.getElementById('show-all-videos-container').innerHTML = ''

    // Loading Class Remove
    document.getElementById('loading').classList.remove('hidden');

    setTimeout(() => {
        fetch('https://openapi.programming-hero.com/api/phero-tube/videos')
            .then(res => res.json())
            .then(data => videosDisplay(data.videos))

        // Loading Class Add
        document.getElementById('loading').classList.add('hidden')
    }, 1000)
})


// Category Videos Load-----
const categoryVideos = id => {

    // Active Class Remove In All and Dynamic Buttons
    activeRemove()

    //    Active Class Add In Dynamic Button
    document.getElementById(`btn-${id}`).classList.add('active')

    // Empty Section Hidden Add
    document.getElementById('no-content-section').classList.add('hidden');

    // Videos Container Clear
    document.getElementById('show-all-videos-container').innerHTML = '';

    // Loading Class Remove
    document.getElementById('loading').classList.remove('hidden')

    setTimeout(() => {
        fetch(`https://openapi.programming-hero.com/api/phero-tube/category/${id}`)
            .then(res => res.json())
            .then(data => videosDisplay(data.category))

        // Loading Class Add   
        document.getElementById('loading').classList.add('hidden')
    }, 1000)
}


// Videos Display---------
const videosDisplay = (videos) => {

    // Empty Array Condition Start
    if (videos.length === 0) {
        document.getElementById('no-content-section').classList.remove('hidden');
        return
    }
    else {
        document.getElementById('no-content-section').classList.add('hidden');
    }

    // Empty Array Condition End
    const showAllVideosContainer = document.getElementById('show-all-videos-container');

    videos.map(video => {
        const cardVideoDiv = document.createElement('div');
        cardVideoDiv.classList = 'card card-compact'
        // Card
        cardVideoDiv.innerHTML = `
        <figure class="h-[200px] relative">
           <img class="h-full w-full object-cover"
           src="${video.thumbnail}"alt="Shoes" />
           
           ${video.others.posted_date?.length === 0 ? '' : `<p class="bg-black p-2 text-white absolute right-3 bottom-2 rounded text-xs">${getHourMinuteSecond(video.others.posted_date)}</p>`
            }
        </figure>
        <div class="py-3 flex gap-3">
            <div>
                <img class="h-10 w-10 rounded-full" src="${video.authors[0].profile_picture}" alt="">
            </div>
           
            <div>
                <h4 class="text-2xl font-bold">${video.title}</h4>
                <div class="flex gap-5 items-center">
                   <p>${video.authors[0].profile_name}</p>
                    ${video.authors[0].verified === true ? `<img class="h-[25px] w-[25px]" src="https://img.icons8.com/?size=48&id=63760&format=png"alt="" />` : ''}
                </div>
                <p><small>${video.others.views}</small></p>
            </div>
           
        </div>
         <div class="text-center py-3">
            <button  onclick="detailsInModal('${video.video_id}')" class="btn bg-rose-700 text-white">Details</button
        </div>
        `;
        showAllVideosContainer.append(cardVideoDiv)
        // console.log(video);
    })
}


// Buttons Display
const displayButtons = data => {
    const buttonsContainerDiv = document.getElementById('buttons')
    data.forEach(button => {
        const buttonDiv = document.createElement('div');
        buttonDiv.innerHTML = `
        <button id="btn-${button.category_id}" onClick="categoryVideos('${button.category_id}')" class="btn dynamic">${button.category}</button>
        `;
        buttonsContainerDiv.appendChild(buttonDiv)
        // console.log(button);
    });
}

dataLoadBySearch()
loadButtons()
