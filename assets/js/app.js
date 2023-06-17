let weartherForm = document.querySelector('.weather__form')
let cityInput = document.querySelector('.weather__city')
let apiUrl =
	'https://api.weatherapi.com/v1/current.json?key=bccad9c366574566a7d165501231506&aqi=no&q='
let apiDataContainer = document.querySelector('.weather__data')
let loader = document.querySelector('.weather__loader')
let gpsButton = document.querySelector('.weather__gps')

weartherForm.addEventListener('submit', (event) => {
	showLoader()
	let city = cityInput.value
	let fullApiUrl = apiUrl + city

	fetch(fullApiUrl)
		.then((response) => {
			hideLoader()
			if (response.status === 200) {
				return response.json()
			}

			throw new Error()
		})
		.then((dataFromApi) => {
			cityInput.value = dataFromApi.location.name
			// console.log(dataFromApi.current.temp_c)
			let view = ``
			// view += `Dzisiaj w ${dataFromApi.location.name} jest ${dataFromApi.current.temp_c} &deg;C`
			// view += `<img src="${dataFromApi.current.condition.icon}" alt="${dataFromApi.current.condition.text}">`

			view += `<div class="weather__info">`
			// county, city, time(region)
			view += `<div class="weather__region"> 
                    <p>${dataFromApi.location.name}</p>
                    <p>${dataFromApi.location.country}</p>
                    <p>${dataFromApi.location.localtime}</p>
            </div>`

			//icon
			view += `<div class="weather__icon"><img src= ${dataFromApi.current.condition.icon} 
            alt = ${dataFromApi.current.condition.text}></div >`
			//temp
			view += `<div class="weather__temp"> ${dataFromApi.current.temp_c} <span>&degC</span></div >`

			//details
			view += `<div class="weather__details">
                    <p>The amount of rainfall: ${dataFromApi.current.precip_mm}mm </p>
                    <p>Humidity: ${dataFromApi.current.humidity}%</p>
                    <p>Wind: ${dataFromApi.current.wind_kph}km/h</p>
                </div>`

			view += `</div>`

			apiDataContainer.innerHTML = view
		})
		.catch((error) => showError())

	event.preventDefault()
})

let showError = () => {
	apiDataContainer.innerHTML = `<div class="weather__error">City not found or We have problem with API</div>`
}

let showLoader = () => {
	loader.style.display = 'block'
}
let hideLoader = () => {
	loader.style.display = 'none'
}
//gps
gpsButton.addEventListener('click', (event) => {
	navigator.geolocation.getCurrentPosition(searchPosition)
})

let searchPosition = (position) => {
	// console.log(position)
	cityInput.value = `${position.coords.latitude},${position.coords.longitude}`
	weartherForm.requestSubmit()
}

if ('serviceWorker' in navigator) {
	window.addEventListener('load', function () {
		navigator.serviceWorker
			.register('serviceWorker.js')
			.then((res) => console.log('service worker registered'))
			.catch((err) => console.log('service worker not registered', err))
	})
}
