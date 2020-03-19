const formSearch = document.querySelector('.form-search'),
    inputCitiesForm = document.querySelector('.input__cities-from'),
    dropdownCitiesFrom = document.querySelector('.dropdown__cities-from'),
    inputCitiesTo = document.querySelector('.input__cities-to'),
    dropdownCitiesTo = document.querySelector('.dropdown__cities-to'),
    inputDateDepart = document.querySelector('.input__date-depart');

const CITY_API = 'dataBase/cities.json',                   //CITY_API = 'http://api.travelpayouts.com/data/ru/cities.json',
    PROXY = 'https://cors-anywhere.herokuapp.com/',
    API_KEY = '751e7be55d6c398db6296029f696ac2a',
    CALENDAR = 'http://min-prices.aviasales.ru/calendar_preload';

let city = [];

const getData = (url, callback) => {
    const request = new XMLHttpRequest();

    request.open('GET', url);

    request.addEventListener('readystatechange', () => {
        if (request.readyState !== 4) return;

        if (request.status == 200) {
            callback(request.response);
        } else {
            console.error (request.status);
        }
    });

    request.send();
};

    const showSity = (input, list) => {
    list.textContent = '';

    if (input.value !== '') {
        const filterCity = city.filter((item) => {            
            const fixItem = item.name.toLowerCase();
            return fixItem.includes(input.value.toLowerCase());           
        });
        filterCity.forEach((item) => {
            const li = document.createElement('li');
            li.classList.add('dropdown__city');
            li.textContent = item.name;
            list.append(li);
        });
    }

};

const handlerCity = (event, input, list) => {
    const target = event.target;
    if (target.tagName.toLowerCase() === 'li') {
        input.value = target.textContent;
        list.textContent = '';
    }
};

inputCitiesForm.addEventListener('input', () => {
    showSity (inputCitiesForm, dropdownCitiesFrom);
});

inputCitiesTo.addEventListener('input', () => {
    showSity(inputCitiesTo, dropdownCitiesTo);
});

dropdownCitiesFrom.addEventListener('click', (event) => {
    handlerCity(event, inputCitiesForm, dropdownCitiesFrom );    
});

dropdownCitiesTo.addEventListener('click', (event) => {
    handlerCity(event, inputCitiesTo, dropdownCitiesTo);
});

getData(CITY_API, (data) => {   //(proxy + citiesApi, - web version without dataBase
    city = JSON.parse(data).filter(item => item.name);  //return item.name    
});




