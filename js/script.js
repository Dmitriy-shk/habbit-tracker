'use strict'

let habbits = [];
const HABBIT_KEY = 'HABBIT_KEY'
let globalActiveHabbitId;

/* page */
const page = {
    menu: document.querySelector(".menu__list"),
    header: {
        h1: document.querySelector(".h1"),
        progressPercent: document.querySelector(".progress__percent"),
        progressCoverBar: document.querySelector(".progress__cover-bar")
    },
    body: document.querySelector('.content-body'),
    popup: {
        index: document.getElementById('add-habbit-popup'),
        iconField: document.querySelector('.popup__form input[name="icon"]')
    }
}


/* utils */
function loadData (){
    const habbitsString = localStorage.getItem(HABBIT_KEY)
    const habbitArray = JSON.parse(habbitsString);
    if(Array.isArray(habbitArray)){
        habbits = habbitArray;
    }
}

function saveData() {
    localStorage.setItem(HABBIT_KEY, JSON.stringify(habbits));
}

function validateForm(form, fields) {
    const formData = new formData(form);
    
}


/* render */
function rerenderMenu(activeHabbit){
    console.log(globalActiveHabbitId)
    for(const habbit of habbits){
        const existed = document.querySelector(`[menu-habbit-id="${habbit.id}"]`)
        if(!existed){
            const element = document.createElement('button');
            element.setAttribute('menu-habbit-id', habbit.id);
            element.classList.add('menu__item');
            element.addEventListener('click',() => rerender(habbit.id  ))
            element.innerHTML = `<img class="menu__item-img" src="/images/${habbit.icon}.svg" alt="${habbit.name}">`;
            if(activeHabbit.id === habbit.id){
                element .classList.add('menu__item_active')
            }
            page.menu.appendChild(element)
            continue;
        }
        if(activeHabbit.id === habbit.id){
            existed.classList.add('menu__item_active');
        }else{
            existed.classList.remove('menu__item_active');
        }
    }
}

function renderHead(activeHabbit){
    page.header.h1.innerText = activeHabbit.name;
    const progress = activeHabbit.days.length / activeHabbit.target > 1 
        ? 100
        : activeHabbit.days.length / activeHabbit.target * 100;
    page.header.progressPercent.innerText = `${progress.toFixed(0)}%`;
    page.header.progressCoverBar.style.width = `${progress}%`
}

function renderContent(activeHabbit) {
    page.body.innerHTML = '';
    for(const habbit of habbits){
        if(habbit.id === activeHabbit.id){
            for(const [i, day] of habbit.days.entries()){
                const newElement = document.createElement('div')
                newElement.setAttribute('class', 'habbit')
                newElement.innerHTML = `<div class="habbit__day">Day ${i+1}</div>
                <div class="habbit__comment">${day.comment}</div>
                <button class="habbit__delete" onclick="deleteDay(${i})">
                    <img src="/images/shape.svg" alt="Delete day">
                </button>`
                page.body.appendChild(newElement);
            }
            const createHabbitElement = document.createElement('div');
                createHabbitElement.setAttribute('id', 'create-habbit');
                createHabbitElement.setAttribute('class', 'habbit')
                createHabbitElement.innerHTML = `<div class="habbit__day-custom">Day ${habbit.days.length+1}</div>
                <form class="habbit__form" onsubmit="addDays(event)">
                    <input name="comment" class="input" type="text" placeholder="Enter a comment">
                    <img class="input__icon" src="/images/commnet.svg" alt="Commnet icon">
                    <button class="button">Done
                    </button>
                </form>`;
                document.querySelector('.content-body').appendChild(createHabbitElement)
        }
    }
}

function rerender(activeHabbitId){
    globalActiveHabbitId = activeHabbitId;
    const activeHabbit = habbits.find(habbit => habbit.id === activeHabbitId);
    if(!activeHabbit){
        return;
    }
    rerenderMenu(activeHabbit);
    renderHead(activeHabbit);
    renderContent(activeHabbit);
}

/* work with days */
function addDays(event){
    const form = event.target;
    event.preventDefault();
    const data = new FormData(form);
    const comment = data.get('comment')
    form['comment'].classList.remove('input_error')
    if(!comment){
        form['comment'].classList.add('input_error')
        return;
    }
    habbits = habbits.map(habbit => {
        if(habbit.id === globalActiveHabbitId){
            return {
                ...habbit,
                days: habbit.days.concat([{comment}])
            }
        }
        return habbit;
    });
    form['comment'].value = '';
    rerender(globalActiveHabbitId);
    saveData();
}

function deleteDay(i){
    habbits = habbits.map(habbit => {
        if(habbit.id === globalActiveHabbitId){
            habbit.days.splice(i,1);
            return {
                ...habbit,
                days: habbit.days
            }; 
        }
        return habbit;
    })
    rerender(globalActiveHabbitId);
    saveData();
}

/* popup */
function TogglePopup(){
    if(page.popup.index.classList.contains('cover_hiden')){
        page.popup.index.classList.remove('cover_hiden');
    }else{
        page.popup.index.classList.add('cover_hiden');
    }
}

/* work with habbits */
function setIcon(context, icon){
    page.popup.iconField.value = icon;
    const activeIcon = document.querySelector('.icon.icon_active');
    activeIcon.classList.remove('icon_active');
    context.classList.add('icon_active')
}

function addHabbit(event) {
    event.preventDefault()
    const form = event.target;
    const data = new FormData(form);
    const icon = data.get('icon');
    const name = data.get('name');
    const target = data.get('target');
    form['name'].classList.remove('input_error');
    form['target'].classList.remove('input_error');
    if(!name){
        form['name'].classList.add('input_error');
        return;
    }
    if(!target){
        form['target'].classList.add('input_error');
        return;
    }
    habbits.push({
        id: `${Number(habbits.length)+1}`,
        icon: icon,
        name: name,
        target: target,
        days: []
    })
    window.location.reload()
    saveData();
    rerender(globalActiveHabbitId);
    TogglePopup()
    window.location.reload()
}

function deleteHabbit(){
    if(!globalActiveHabbitId){
        return
    }
    habbits.splice(globalActiveHabbitId-1,1)
    window.location.reload()
    rerender(globalActiveHabbitId)
    saveData()
}

/* init */
(() => {
    loadData();
    rerender(habbits[0].id)
})()
