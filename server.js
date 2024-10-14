require('dotenv').config();

const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());

const users = [
    { id: 1, name: 'Alice Johnson', email: 'alice@example.com', status: 'active' },
    { id: 2, name: 'Bob Brown', email: 'bob@example.com', status: 'inactive' },
    { id: 3, name: 'Charlie White', email: 'charlie@example.com', status: 'active' },
    { id: 4, name: 'David Black', email: 'david@example.com', status: 'inactive' },
];  

app.get('/users', (req, res) => {
    res.json(users);
});


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
