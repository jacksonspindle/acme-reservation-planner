const { render } = require('@react-three/fiber')
const { fetchJSON } = require('./apiHelpers')

let restaurants 
let users 
let reservations 

const usersList = document.querySelector('#users-list')
const restaurantsList = document.querySelector('#restaurants-list')
const reservationsList = document.querySelector('#reservations-list')
console.log(reservationsList)

const renderUsers = () => {
    const id = window.location.hash.slice(1)
    const html = users.map(user => {
        return `
        <li class=${ id === user.id*1 ? 'selected' : ' '}>
            <a href='#${user.id}'>${user.name}</a>
            
        </li>
        `
    }).join('')
    usersList.innerHTML = html
}


const renderReservations = () => {

    const html = reservations.map(reservation => {
        const restaurant = restaurants.find( restaurant => restaurant.id === reservation.restaurantId)
        return `
            <li data-id='${restaurant.id}'>
                ${ reservation.id } (${restaurant.name})
            </li>
        `
    }).join('')

    reservationsList.innerHTML = html
}

const renderRestaurants = () => {

    const html = restaurants.map(restaurant => {
        const count = (reservations || []).filter(reservation => reservation.restaurantId === restaurant.id).length
        return `
            <li class="">
                ${ restaurant.name } (${count})
            </li>
        `
    }).join('')

    restaurantsList.innerHTML = html
}



const setup = async() => {
users = await fetchJSON('/api/users')
   renderUsers()

   

   restaurants = await fetchJSON('/api/restaurants')
   renderRestaurants()
}

setup()

restaurantsList.addEventListener('click', async(ev) => {
    const id = window.location.hash.slice(1)
    if(!id) {
        return
    }

    if (ev.target.tagName === 'LI'){
        const restaurantId = ev.target.getAttribute('data-id')
        const response = await fetch(`api/users/${id}/reservations`, {
            method: 'POST', 
            body: JSON.stringify({ restaurantId }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const reservation = await response.json()
        reservations.push(reservation)
        renderReservations()
        renderRestaurants()
    }
})

window.addEventListener('hashchange', async() => {
    renderUsers()
     const id = window.location.hash.slice(1)
    if (id) {
        reservations = await fetchJSON(`/api/users/${id}/reservations`)
    } else {
        reservations = []
    }
    renderRestaurants()
    renderReservations()
})