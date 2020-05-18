document.addEventListener('DOMContentLoaded', () => {
    'use strict';
    const btnOpenModal = document.querySelector('#btnOpenModal'),
        modalBlock = document.querySelector('#modalBlock'),
        closeModal = document.querySelector('#closeModal'),
        questionTitle = document.querySelector('#question'),
        formAnswers = document.querySelector('#formAnswers'),
        burgerBtn = document.getElementById('burger'),
        nextButton = document.querySelector('#next'),
        prevButton = document.querySelector('#prev'),
        sendButton = document.querySelector('#send');
        burgerBtn.style.display = 'none';

        const firebaseConfig = {
            apiKey: "AIzaSyCRtathsXiX2GTeBfY_ATpEktO_eJeEJdA",
            authDomain: "qwiz-burger.firebaseapp.com",
            databaseURL: "https://qwiz-burger.firebaseio.com",
            projectId: "qwiz-burger",
            storageBucket: "qwiz-burger.appspot.com",
            messagingSenderId: "150485078300",
            appId: "1:150485078300:web:5a0b6221dc9d0866d26ad9",
            measurementId: "G-Y2QVTX3CER"
        };
        // Initialize Firebase
        firebase.initializeApp(firebaseConfig);


        const getData = () => {
            formAnswers.textContent = 'LOAD';

            nextButton.classList.add('d-none');
            prevButton.classList.add('d-none');
            setTimeout(() => {
                firebase
                    .database()
                    .ref()
                    .child('questions')
                    .once('value')
                    .then(snap => playTest(snap.value()));
            }, 500);
            
        };    
            

        let clientWidth = document.documentElement.clientWidth; //ширина окна браузера
            if (clientWidth < 768) {
                burgerBtn.style.display = 'flex';
            } else {
                burgerBtn.style.display = 'none';
            }
        
        window.addEventListener('resize', () => {               //изменение окна бр.
            clientWidth = document.documentElement.clientWidth;
            if (clientWidth < 768) {
                burgerBtn.style.display = 'flex';
            } else {
                burgerBtn.style.display = 'none'; 
            }
        });

    const playTest = (questions) => {
        const finalAnswers = [];
        let numberQuestion = 0;
        const renderAnswers = (index) => {
            questions[index].answers.forEach((answer) => {
                const answerItem = document.createElement('div');
                answerItem.classList.add('answers-item', 'd-flex', 'justify-content-center');
                answerItem.innerHTML = `                   
                    <input type="${questions[index].type}" id="${answer.title}" name="answer" class="d-none" value="${answer.title}">
                    <label for="${answer.title}" class="d-flex flex-column justify-content-between">
                    <img class="answerImg" src="${answer.url}" alt="burger">
                    <span>${answer.title}</span>
                    </label>                             
                `;
                formAnswers.appendChild(answerItem);
            });
        };


        const renderQuestions = (indexQuetion) => {  
            formAnswers.innerHTML = ''; 
            if (numberQuestion >= 0 && numberQuestion <= questions.length -1) {
                questionTitle.textContent = `${questions[indexQuetion].question}`;
                renderAnswers(indexQuetion);
                nextButton.classList.remove('d-none');
                prevButton.classList.remove('d-none');
                sendButton.classList.add('d-none');
            }
            if (numberQuestion === 0) {
                prevButton.classList.add('d-none');
            } 
            // if (numberQuestion === questions.length - 1) {
            //     nextButton.classList.add('d-none');
            // }
            if (numberQuestion === questions.length) {
                nextButton.classList.add('d-none');
                prevButton.classList.add('d-none');
                sendButton.classList.remove('d-none');

                formAnswers.innerHTML = `
                    <div class="form-group">
                        <label for="exampleInputPassword1">Enter your number</label>
                        <input type="phone" class="form-control" id="numberPhone">
                    </div>
                `;
            } 
            
            if (numberQuestion === questions.length +1) {
                formAnswers.textContent = 'Спасибо за пройденный тест!';
                setTimeout(() => {
                    modalBlock.classList.remove('d-block');
                }, 2000);
            }
                       
        };

        renderQuestions(numberQuestion);   
        
        const checkAnswer = ()=> {
            const obj = {};
            const inputs = [...formAnswers.elements].filter((input) => input.checked || input.id === 'numberPhone');
            inputs.forEach((input, index) => {
                if (numberQuestion >= 0 && numberQuestion <= questions.length - 1) {
                    obj[`${index}_${questions[numberQuestion].question}`] = input.value;
                }
                if (numberQuestion === questions.length) {
                    obj['Номер телефона'] = input.value;
                }
            });

            finalAnswers.push(obj);
            console.log(finalAnswers);
            
        };



        
        nextButton.onclick = () => {
            checkAnswer();
            numberQuestion++;
            renderQuestions(numberQuestion);
        };
        prevButton.onclick = () => {
            numberQuestion--;
            renderQuestions(numberQuestion);
        };
        sendButton.onclick = () => {
            checkAnswer();
            numberQuestion++;
            renderQuestions(numberQuestion);
            firebase
                .database()
                .ref()
                .child('contacts')
                .push(finalAnswers);

        };
             
    };

    btnOpenModal.addEventListener('click', () => {
        modalBlock.classList.add('d-block');
        getData();
        
    });
    burgerBtn.addEventListener('click', () => {
        burgerBtn.classList.add('active');
        modalBlock.classList.add('d-block');
        playTest();
    });
    closeModal.addEventListener('click', () => {
        modalBlock.classList.remove('d-block');
        burgerBtn.classList.remove('active');
    });

    //делегирование
    document.addEventListener('click', (event) => {  //закр. модал. окно при клике мимо модалки
        if (!event.target.closest('.modal-dialog') &&
            !event.target.closest('.openModalButton') &&
            !event.target.closest('.burger')) {
                modalBlock.classList.remove('d-block');
                burgerBtn.classList.remove('active');
        }
    });

});




