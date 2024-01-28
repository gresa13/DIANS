const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
const port = 3000;
const dbUri = 'mongodb+srv://gresa:Gresa@cluster0.z1ip1ga.mongodb.net/';
const dbOptions = { useNewUrlParser: true, useUnifiedTopology: true };
const dbName = 'wineSpots';

const client = new MongoClient(dbUri, dbOptions);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

const determineWineryStatus = (openingHours, currentTime) => {
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const [days, hours] = openingHours.split(' ');
    const [startHour, endHour] = hours.split('-');
    const currentDay = daysOfWeek[new Date(currentTime).getDay()];

    if (days.includes(currentDay)) {
        const [currentHour, currentMinute] = currentTime.split(':');
        const wineryStart = new Date(`01/01/2000 ${startHour}`).getTime();
        const wineryEnd = new Date(`01/01/2000 ${endHour}`).getTime();
        const current = new Date(`01/01/2000 ${currentHour}:${currentMinute}`).getTime();

        return (current >= wineryStart && current <= wineryEnd) ? 'Open' : 'Closed';
    } else {
        return 'Open';
    }
};

const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth radius in kilometers
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in kilometers
};

const sortWineriesByRatingAndDistance = (wineries, userLocation) => {
    const { latitude: userLat, longitude: userLon } = userLocation;
    return wineries
        .map(winery => ({ ...winery, distance: calculateDistance(userLat, userLon, winery.lat, winery.lon) }))
        .sort((a, b) => {
            // First, sort by rating in descending order
            const ratingComparison = b.rating - a.rating;
            if (ratingComparison !== 0) {
                return ratingComparison;
            }

            // If ratings are the same, sort by distance
            return a.distance - b.distance;
        });
};

const connectToDatabase = async () => {
    try {
        await client.connect();
        console.log('Connected to the database');
    } catch (error) {
        console.error('Error connecting to the database:', error);
        throw error;
    }
};

const closeDatabaseConnection = async () => {
    try {
        await client.close();
        console.log('Connection to the database closed');
    } catch (error) {
        console.error('Error closing the database connection:', error);
    }
};

app.get('/', (req, res) => {
    res.render('firstPage');
});

app.get('/main', async (req, res) => {
    try {
        await connectToDatabase();
        const { latitude, longitude } = req.query;
        if (!latitude || !longitude) {
            return res.redirect('/');
        }

        const userLocation = { latitude: parseFloat(latitude), longitude: parseFloat(longitude) };

        const database = client.db(dbName);
        const collection = database.collection('wineries');
        const wineries = await collection.find({}).toArray();

        const currentTime = new Date();
        const wineriesWithStatus = wineries.map(winery => ({ ...winery, status: determineWineryStatus(winery.opening_hours, currentTime) }));
        const sortedWineries = sortWineriesByRatingAndDistance(wineriesWithStatus, userLocation);

        res.render('main', { wineries: sortedWineries });
    } catch (error) {
        res.status(500).send("Error fetching or filtering wineries");
    } finally {
        await closeDatabaseConnection();
    }
});

app.post('/main', (req, res) => {
    const { userLocation, currentTime } = req.body;
    // ... (unchanged)
});

app.get('/winery/:wineryId', async (req, res) => {
    try {
        await connectToDatabase();
        const database = client.db(dbName);
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
        res.status(500).send("Internal Server Error");
    } finally {
        await closeDatabaseConnection();
    }
});

app.get('/back-to-list', (req, res) => {
    res.redirect('/http://localhost:3000/main?latitude=42.12039627777778&longitude=21.732331444444444'); // Redirect to the "Main Page" ("/main")
});


app.listen(port, () => {
    console.log(`Server is running on http://localhost:3000`);
});
