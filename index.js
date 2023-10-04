let map = L.map('map').setView([0, 0], 3);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 14,
    minZoom: 2,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);


const customIcon = L.divIcon({
    className: 'custom-icon',
    html: '<div class="circle"></div>',
    iconSize: [30, 30],
  });
  

fetch('https://www.cloudflare.com/cdn-cgi/trace')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.text(); // Read the response as text
    })
    .then(data => {
        // Convert key-value pairs to JSON
        data = data.trim().split('\n').reduce((obj, pair) => {
            pair = pair.split('=');
            obj[pair[0]] = pair[1];
            return obj;
        }, {});

        userIP= data.ip
        fetch(`https://ipinfo.io/${userIP}/json`)
            .then(response => response.json())
            .then(geoData => {
                // Extract geolocation data (latitude and longitude)
                const { loc } = geoData;
                const [latitude, longitude] = loc.split(',');


                

                points = localStorage.getItem('points');
                
                
                if (!points) {
                    points = []
                } else {
                    points = JSON.parse(points)
                }
                points.push({'latitude': latitude, 'longitude': longitude})
                
                localStorage.setItem('points', JSON.stringify(points));

                for (let i = 0; i < points.length; i++) {
                    let curr = points[i];
                    let latitude = curr.latitude
                    let longitude = curr.longitude
                    L.marker([latitude, longitude], {icon: customIcon},
                        ).addTo(map);

                }

                
            });

        //



    })
    .catch(error => {
        console.error('Fetch Error:', error);
    });

