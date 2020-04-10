const cardButton = document.querySelector("#card-button"),
    modal = document.querySelector(".modal"),
    close = document.querySelector(".close"),
    cancel = document.querySelector(".cancel");

const toggleModal = () => {
    modal.classList.toggle("is-open");
};
// open modal window
cardButton.addEventListener('click', toggleModal);
// close modal window
close.addEventListener('click', toggleModal);
cancel.addEventListener('click', toggleModal);

new WOW().init();