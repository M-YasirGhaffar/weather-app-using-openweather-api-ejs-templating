document.addEventListener('DOMContentLoaded', () => {
    navigator.geolocation.getCurrentPosition(success, (error) => {
        console.log(error.message)
        const cityName = prompt("You denied geolocation, Enter a city name.");
        window.location.href = `/weather?cityName=${encodeURIComponent(cityName)}`;
    });

    function success(position) {
        window.location.href = `/weather?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}`;
    }

    document.getElementById('cityForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const cityName = document.getElementById('cityName').value;
        window.location.href = `/weather?cityName=${encodeURIComponent(cityName)}`;
    });
});

const navToggle = document.querySelector('.nav-toggle');
const navItems = document.querySelector('.nav-items');

navToggle.addEventListener('click', () => {
    navItems.classList.toggle('active');
});