const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static('public')); // your index.html goes here

const DATA_FILE = './views.json';

// Load or initialize view data
let viewsData = { count: 0, users: {} };
if(fs.existsSync(DATA_FILE)){
    viewsData = JSON.parse(fs.readFileSync(DATA_FILE));
}

// Record a view
app.post('/view', (req, res) => {
    const userId = req.body.userId;
    const now = Date.now();
    const COOLDOWN = 12 * 60 * 60 * 1000; // 12 hours

    if(!viewsData.users[userId] || now - viewsData.users[userId] > COOLDOWN){
        viewsData.count++;
        viewsData.users[userId] = now;
        fs.writeFileSync(DATA_FILE, JSON.stringify(viewsData, null, 2));
    }
    res.json({ count: viewsData.count });
});

// Return current view count
app.get('/view-count', (req, res) => {
    res.json({ count: viewsData.count });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
