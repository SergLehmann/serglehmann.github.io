document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    const IMG_URL = 'https://image.tmdb.org/t/p/w185_and_h278_bestv2';
    

    const leftMenu = document.querySelector('.left-menu'),
        hamburger = document.querySelector('.hamburger'),
        tvShowList = document.querySelector('.tv-shows__list'),        
        modal = document.querySelector('.modal'),
        tvShows = document.querySelector('.tv-shows'),
        tvCardImg = document.querySelector('.tv-card__img'),
        modalTitle = document.querySelector('.modal__title'),
        genresList = document.querySelector('.genres-list'),
        rating = document.querySelector('.rating'),
        description = document.querySelector('.description'),
        modalLink = document.querySelector('.modal__link'),
        searchForm = document.querySelector('.search__form'),
        searchFormInput = document.querySelector('.search__form-input'),
        tvShowsHead = document.querySelector('.tv-shows__head'); 

    const loading = document.createElement('div'); //preloader
        loading.className = 'loading';



    const DBService = class {
        constructor() {
            this.SERVER = 'https://api.themoviedb.org/3';
            this.API_KEY = 'b83fb1aa59ca22c9699efc007c7adf0c';
        }
        getData = async (url) => {
            const res = await fetch(url);
            if (res.ok) {
                return res.json();
            } else {
                throw new Error(`Failed to get data at ${url}`);
            }
        };

        getTestData = () => {
            return this.getData('test.json');
        };

        getTestCard = () => {
            return this.getData('card.json');
        };

        getSearchResult = query => {
            return this.getData(`${this.SERVER}/search/tv?api_key=${this.API_KEY}&query=${query}&language=ru-RU`);
        };

        getTvShow = id => {
            return this.getData(this.SERVER + '/tv/' + id +'?api_key=' + this.API_KEY + '&language=ru-RU');
                                //(`${this.SERVER}/tv/${id}?api_key=${this.API_KEY}&language=ru-RU`);
        };
    };

    //console.log(new DBService().getSearchResult('Няня'));



    const renderCard = response => {
        //console.log(response);
        if (response.total_results !== 0) {
            tvShowList.textContent = '';
            tvShowsHead.textContent = 'Результат поиска: '
            response.results.forEach(({ backdrop_path: backdrop,
                                        name: title,
                                        poster_path: poster,
                                        vote_average: vote,
                                        id
                                        }) => {
                const posterIMG = poster ? IMG_URL + poster : './img/no-poster.jpg';
                const backdropIMG = backdrop ? IMG_URL + backdrop : '';
                const voteElem = vote ? `<span class="tv-card__vote">${vote}</span>` : '';
                
                const card = document.createElement('li');                      
                card.className = 'tv-shows__item';
                card.innerHTML = `
                    <a href="#" id="${id}" class="tv-card">
                        ${voteElem}
                        <img class="tv-card__img"
                            src="${posterIMG}"
                            data-backdrop="${backdropIMG}"
                            alt="${title}">
                        <h4 class="tv-card__head">${title}</h4>
                    </a>
                `;
                loading.remove();
                tvShowList.append(card);
            });

    } else {
        loading.remove();
        tvShowList.textContent = '';
        tvShowsHead.textContent = 'По Вашему запросу ничего не найдено';
    }
}

    searchForm.addEventListener('submit', event => {
        event.preventDefault();
        const value = searchFormInput.value.trim();
        if (value) {
            tvShows.append(loading);
            new DBService().getSearchResult(value).then(renderCard);
        }
        searchFormInput.value = '';
    });


    hamburger.addEventListener('click', () => {
        leftMenu.classList.toggle('openMenu');
        hamburger.classList.toggle('open');
    });

    document.addEventListener('click', event => {  //click body
        if (!event.target.closest('.left-menu')) {
            leftMenu.classList.remove('openMenu');
            hamburger.classList.remove('open');
        }
    });

    leftMenu.addEventListener('click', event => {   //открытие подменю в меню
        event.preventDefault();
        const target = event.target;
        const dropdown = target.closest('.dropdown');
        if (dropdown) {
            dropdown.classList.toggle('active');
            leftMenu.classList.add('openMenu');
            hamburger.classList.add('open');
        }
    });    

    //modal window
    tvShowList.addEventListener('click', event => {
        event.preventDefault();
        const target = event.target;
        const card = target.closest('.tv-card');
        if (card) {
            tvShowList.append(loading);
            new DBService().getTvShow(card.id)
                .then(({ 
                    poster_path: posterPath,
                    name: title,
                    genres,
                    vote_average: voteAverage,
                    overview,
                    homepage }) => {
                //console.log(data);
                tvCardImg.src = IMG_URL + posterPath;
                tvCardImg.alt = title;
                modalTitle.textContent = title;
                //genresList.innerHTML = data.genres.reduce((acc, item) => `${acc}<li>${item.name}</li>`, '');
                genresList.textContent = '';
                // for (const item of data.genres) {
                //     genresList.innerHTML += `<li>${item.name}</li>`;
                // }
                genres.forEach(item => {
                    genresList.innerHTML += `<li>${item.name}</li>`;
                })
                rating.textContent = voteAverage;
                description.textContent = overview;
                modalLink.href = homepage;
            })
            .then(() => {
                document.body.style.overflow = 'hidden';
                modal.classList.remove('hide');
            })
            
        }

    });

    modal.addEventListener('click', event => {
        if(event.target.closest('.cross') ||
            event.target.classList.contains('modal')) {
            document.body.style.overflow = '';
            modal.classList.add('hide');
            loading.remove();
        }        
    });

    const changeImage = event => {
        const card = event.target.closest('.tv-shows__item');
        if (card) {
            const img = card.querySelector('.tv-card__img');            
            if (img.dataset.backdrop) {                
                [img.src, img.dataset.backdrop] = [img.dataset.backdrop, img.src];  //деструктурризация
            }            
        }
    };

    tvShowList.addEventListener('mouseover', changeImage);
    tvShowList.addEventListener('mouseout', changeImage);























});