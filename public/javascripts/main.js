const form = document.getElementById('vote-form');


// Form submit Events
form.addEventListener('submit', (e) => {
    const choice = document.querySelector('input[name=os]:checked').value;
    const data = {
        os: choice
    };

    fetch('http://localhost:3000/poll', {
            method: 'post',
            body: JSON.stringify(data),
            headers: new Headers({
                'Content-Type': 'application/json'
            })
        })
        .then(res => res.json())
        .then(data => console.log(data))
        .catch(err => console.log(err));

    e.preventDefault();
})

// Chart Events
let dataPoints = [
    { label: 'Windows', y: 0 },
    { label: 'MacOS', y: 0 },
    { label: 'Linux', y: 0 },
    { label: 'Others', y: 0 }
];

var chart = new CanvasJS.Chart("chartContainer", {
    animationEnabled: true,
    exportEnabled: true,
    theme: 'light1',
    title: {
        text: 'OS Voting Graph'
    },
    data: [{
        type: 'column',
        indexLabelFontColor: '#5A5757',
        indexLabelPlacement: 'outside',
        dataPoints: dataPoints,
    }]
})

chart.render();

fetch('http://localhost:3000/poll')
    .then(res => res.json())
    .then(polls => {
        const data = polls.polls;
        data.map((poll) => {
            dataPoints.map((datapoint) => {
                if (poll.os === datapoint.label) {
                    datapoint.y = poll.votes;
                }
                return datapoint;
            })
        });
        chart.render();
    })
    .catch(err => console.log("error fetching the data"));

// Enable pusher logging - don't include this in production
Pusher.logToConsole = true;

var pusher = new Pusher('93bdf2610ab0b2de1f86', {
    cluster: 'ap2',
    forceTLS: true
});

var channel = pusher.subscribe('os-poll');
channel.bind('os-vote', function(data) {
    console.log(data);
    dataPoints.map((datapoint) => datapoint.label === data.os ? datapoint.y++ : datapoint);
    chart.render();
});