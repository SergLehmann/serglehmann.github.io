const formSearch = document.querySelector('.form-search'),
    inputCitiesForm = document.querySelector('.input__cities-from'),
    dropdownCitiesFrom = document.querySelector('.dropdown__cities-from'),
    inputCitiesTo = document.querySelector('.input__cities-to'),
    dropdownCitiesTo = document.querySelector('.dropdown__cities-to'),
    inputDateDepart = document.querySelector('.input__date-depart'),
    cheapestTicket = document.getElementById('cheapest-ticket'),
    otherCheapTickets = document.getElementById('other-cheap-tickets'),
    body = document.querySelector('body');

const citiesApi = 'http://api.travelpayouts.com/data/ru/cities.json',      //'dataBase/cities.json', 
    proxy = 'https://cors-anywhere.herokuapp.com/',
    API_KEY = '751e7be55d6c398db6296029f696ac2a',
    calendar = 'http://min-prices.aviasales.ru/calendar_preload',
    MAX_COUNT = 6;

let city = [];

const getData = (url, callback, reject = console.error) => {
    
        const request = new XMLHttpRequest();

        request.open('GET', url);

        request.addEventListener('readystatechange', () => {
            if (request.readyState !== 4) return;

            if (request.status == 200) {
                callback(request.response);
            } else {
            reject(request.status);
            }
        });

        request.send();    
};

    const showSity = (input, list) => {
    list.textContent = '';

    if (input.value !== '') {
        const filterCity = city.filter((item) => {            
            const fixItem = item.name.toLowerCase();
            return fixItem.startsWith(input.value.toLowerCase());           
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

const getNameCity = code => {
    const objCity = city.find(item => item.code === code);
    return objCity.name;
};

const getDate = date => {
    return new Date(date).toLocaleString('ru-Ru', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

const getChanges = n => {
    if (n) {
        return n === 1 ? 'С одной пересадкой' : 'С двумя пересадками';
    } else {
        return 'Без пересадок';
    }
};

const getLinkAviasales = (data) => {
    let link = 'https://www.aviasales.ru/search/';
    link += data.origin;
    const date = new Date(data.depart_date);

    const day = date.getDate();
    link += day < 10 ? '0' + day : day;
    const month = date.getMonth()+1;
    link += month < 10 ? '0' + month : month;
    link += data.destination;
    link += '1';                  //1 взрослый добавляется вконце ссылки 'link'

    return link;

};

const createCard = (data) => {
    const ticket = document.createElement('article');
    ticket.classList.add('ticket');

    let deep = '';

    if (data) {
        deep = `
            <h3 class="agent">${data.gate}</h3>
            <div class="ticket__wrapper">
                <div class="left-side">
                    <a href="${getLinkAviasales(data)}" target="_blank" class="button button__buy">Купить
                        за ${data.value}₽</a>
                </div>
                <div class="right-side">
                    <div class="block-left">
                        <div class="city__from">Вылет из города
                            <span class="city__name">${getNameCity(data.origin)}</span>
                        </div>
                        <div class="date">${getDate(data.depart_date)}</div>
                    </div>

                    <div class="block-right">
                        <div class="changes">${getChanges(data.number_of_changes)}</div>
                        <div class="city__to">Город назначения:
                            <span class="city__name">${getNameCity(data.destination)}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    } else {
        cheapestTicket.innerHTML = '';
        deep = '<h3>К сожалению на текущую дату билетов нет!</h3>';
    }

    ticket.insertAdjacentHTML('afterbegin', deep);

    return ticket;

};

const renderCheapDay = (cheapTicket) => {
    cheapestTicket.style.display = 'block';
    cheapestTicket.innerHTML = '<h2>Самый дешевый билет на выбранную дату</h2>';
    

    const ticket = createCard(cheapTicket[0]);
    cheapestTicket.append(ticket);
};

const renderCheapYear = (cheapTickets) => {
    otherCheapTickets.style.display = 'block';
    otherCheapTickets.innerHTML = '<h2>Самые дешевые билеты на другие даты</h2>';

    cheapTickets.sort((a, b) => a.value - b.value);
    for (let i = 0; i < cheapTickets.length && i < MAX_COUNT; i++) {
        const ticket = createCard(cheapTickets[i]);
        otherCheapTickets.append(ticket);
    }
};

const renderCheap = (data, date) => {
    const cheapTicketYear = JSON.parse(data).best_prices;

    const cheapTicketDay = cheapTicketYear.filter((item) => {
        return item.depart_date === date;
    });

    renderCheapDay(cheapTicketDay);
    renderCheapYear(cheapTicketYear);        
};

//Обработчики событий

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

body.addEventListener('click', () => {   //Клик мимо поля
    dropdownCitiesFrom.innerHTML = '';
    dropdownCitiesTo.innerHTML = '';
});

formSearch.addEventListener('submit', (event) => {
    event.preventDefault();       //откл. обновления страницы при нажатии на кнопку    

    const sityFrom = city.find((item) => {
        return inputCitiesForm.value === item.name;
    });
    const sityTo = city.find((item) => {
        return inputCitiesTo.value === item.name;
    });
    const formData = {
        from: sityFrom,
        to: sityTo,
        when: inputDateDepart.value,
    };

    if (formData.from && formData.to) {    
        const requestData = `?depart_date=${formData.when}&origin=${formData.from.code}&destination=${formData.to.code}&one_way=true`;  //&token=${API_KEY}
            // нов. сиснтаксис или старый
        /*const requestData = '?depart_date=' + formData.when +
        '&origin=' + formData.from +
            '&destination=' + formData.to +
            '&one_way=true&token=' + API_KEY;*/

        getData(proxy + calendar + requestData, (response) => {   //(proxy + calendar + requestData, (response) =>
            renderCheap(response, formData.when);
            }, 
            (error) => {
                cheapestTicket.style.display = 'block';
                cheapestTicket.innerHTML = '<h2>В этом направлении нет рейсов</h2>';
                otherCheapTickets.style.display = 'none';
                console.error('Ошибка', error);
            });
    } else {
        cheapestTicket.style.display = 'block';
        cheapestTicket.innerHTML = '<h2>Введите корректное название города</h2>';
        otherCheapTickets.style.display = 'none';
    }

});

getData(proxy + citiesApi, (data) => {   //(proxy + citiesApi, - web version without dataBase
    city = JSON.parse(data).filter(item => item.name);  //return item.name    

    city.sort((a, b) => {
        if (a.name > b.name) {
            return 1;
        }
        if (a.name < b.name) {
            return -1;
        }
        // a должно быть равным b
        return 0;
    });
});




