const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
const { MongoClient, ObjectId } = require('mongodb');
const uri = 'mongodb+srv://gresa:Gresa@cluster0.z1ip1ga.mongodb.net/';


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());
app.get('/', (req, res) => {

    res.render('firstPage');
});
function isOpen(openingHours, currentTime) {
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const [days, hours] = openingHours.split(' ');
    const [startHour, endHour] = hours.split('-');
    const currentDay = daysOfWeek[new Date(currentTime).getDay()];


    if (days.includes(currentDay)) {
        const [currentHour, currentMinute] = currentTime.split(':');
        const wineryStart = new Date(`01/01/2000 ${startHour}`).getTime();
        const wineryEnd = new Date(`01/01/2000 ${endHour}`).getTime();
        const current = new Date(`01/01/2000 ${currentHour}:${currentMinute}`).getTime();


        if (current >= wineryStart && current <= wineryEnd) {
            return 'Open';
        } else {
            return 'Closed';
        }
    } else {
        return 'Closed';
    }
}
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth radius in kilometers

    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c; // Distance in kilometers
    return distance;
}

function filterLocation(wineries, userLocation) {
    const { latitude: userLat, longitude: userLon } = userLocation;

    return wineries
        .map(winery => {
            const distance = calculateDistance(userLat, userLon, winery.lat, winery.lon);
            return { ...winery, distance };
        })
        .sort((a, b) => a.distance - b.distance);
}



app.get('/main', async (req, res) => {
    try {
        await client.connect();
        console.log('Connected to the database');
        const { latitude, longitude } = req.query;

        if (!latitude || !longitude) {
            return res.status(400).send("User location is missing or invalid.");
        }

        const userLocation = {
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude),
        };


        const database = client.db('wineSpots');
        const collection = database.collection('wineries');


        const wineries = await collection.find({}).toArray();

        const currentTime = new Date();
        const wineriesWithStatus = wineries.map(winery => {
            const status = isOpen(winery.opening_hours, currentTime);
            return { ...winery, status };
        });


        const filteredWineries = filterLocation(wineriesWithStatus, userLocation);


        res.render('main', { wineries: filteredWineries });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).send("Error fetching or filtering wineries");
    } finally {
        await client.close();
        console.log('Connection to the database closed');
    }
});


app.post('/main', (req, res) => {
    const { userLocation, currentTime } = req.body;



    res.json({ success: true });
});
app.get('/winery/:wineryId', async (req, res) => {
    try {
        await client.connect();
        const database = client.db('wineSpots');
        const collection = database.collection('wineries');


        if (!ObjectId.isValid(req.params.wineryId)) {
            return res.status(400).send("Invalid Winery ID");
        }

        const winery = await collection.findOne({ _id: new ObjectId(req.params.wineryId) });
        if (!winery) {
            return res.status(404).send("Winery not found");
        }

        res.render('wineryDetails', { winery });
    } catch (error) {
        console.error('Error fetching winery details:', error);
        res.status(500).send("Internal Server Error");
    } finally {
        await client.close();
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:3000`);
});
