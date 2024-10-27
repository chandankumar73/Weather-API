const userTab = document.querySelector("[data-userWeather]")
const searchTab = document.querySelector("[data-searchWeather]")
const userContainer = document.querySelector(".weather-container")

const grantAccessContainer = document.querySelector(".grant-location-container")
const searchForm = document.querySelector("[data-searchForm]")
const loadingScreen = document.querySelector(".loading-container")
const userinfocontainer = document.querySelector(".user-info-container")

//inintially variable nedd??

let currentTab = userTab;
const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";

currentTab.classList.add("current-tab"); 
getfromSessionStorage();


//ek kaam aur pending hai

function switchTab(clickedTab){
    if(clickedTab != currentTab){
        currentTab.classList.remove("current-tab");
        currentTab=clickedTab;
        currentTab.classList.add("current-tab");
        //search wala nhi hai toh search wala karna hai pehle visible
        if(!searchForm.classList.contains("active")){
            userinfocontainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active"); 
        }
        else{
            //main pehle search wala tab pai tha  , ab your weather tab ko vishible karna hai 
            searchForm.classList.remove("active");
            userinfocontainer.classList.remove("active");
            //ab main weather tab mai aagaya toh weathr bhi display karna hai 
            //so let check local storage first for coordinates if we have saved them there    
            getfromSessionStorage(); 
        }

    }
}
 

userTab.addEventListener("click", () => {
    // pass clicked tab as input parameter
    switchTab(userTab);
});

searchTab.addEventListener("click", () =>{
    //pass clicked  tab as a input parameter
    switchTab(searchTab);
});

//check if the coordinates are present in session storage

function getfromSessionStorage(){
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if(!localCoordinates){
        grantAccessContainer.classList.add("active");
    }
   else{
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}

async function fetchUserWeatherInfo(coordinates){
    const {lat, lon} = coordinates;
    //make grantcontainer visible
    grantAccessContainer.classList.remove("active");
    //make loader visible
    loadingScreen.classList.add("active");  


    //API_CALL 

    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        const data = await response.json();

        loadingScreen.classList.remove("active");
        userinfocontainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err){
        loadingScreen.classList.remove("active");
        console.log("Error found",err);
    }


}

function renderWeatherInfo(weatherInfo){
     //firstly we have to fetch the elements
    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]"); 

    console.log(weatherInfo);
    
    // fetch values from weatherInfo object and put it UI elements

    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `https://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp} °C`;
    windspeed.innerText = `${weatherInfo?.wind?.speed}m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity}%`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;

}

function getLocation(){
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }    
    else{
        console.log("No Geolocation support available");
    }
}

function showPosition(position){
    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,

    }
    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates); 
}

const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click", getLocation);   

const searchInput = document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let cityName = searchInput.value;

    if(cityName === "")
        return;
    else
        fetchSearchWeatherInfo(cityName);
})

async function fetchSearchWeatherInfo(city){
    loadingScreen.classList.add("active");
    userinfocontainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        const data = await response.json();
        loadingScreen.classList.remove("active");
        userinfocontainer.classList.add("active");
        renderWeatherInfo(data); 
    }
    catch(err){
        console.log("error found")
    }
}


data-windspeed