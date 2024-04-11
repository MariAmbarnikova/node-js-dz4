const express = require('express');
const path = require('path');
const fs = require('fs');
const { check } = require('./validation/validator');
const { userSchema } = require('./validation/schema');
const app = express();
const fullPath = path.join(__dirname, 'index.json');
let uniqueID = 0;
const read = [];

function writeJson(users, fullPath) {
    fs.writeFile(fullPath, JSON.stringify(users, null, 2), (err) => {
        if (err) {
            console.error(err);
        }
    })
}

function readJson(fullPath) {
    try {
        const data = fs.readFileSync(fullPath, 'utf-8');
        return JSON.parse(data);
    } catch (err) {
        return [];
    }
}

app.use(express.json());

app.get('/users', (req, res) => {
    const read = readJson(fullPath);
    res.send({ read });
});

app.post('/users', check(userSchema), (req, res) => {
    const read = readJson(fullPath);
    uniqueID += 1;

    read.push({
        id: uniqueID,
        ...req.body
    });

    res.send({
        id: uniqueID,
    });
    writeJson(read, fullPath);
});

app.put('/users/:id', check(userSchema), (req, res) => {
    const read = readJson(fullPath);
    const user = read.find((user) => user.id === Number(req.params.id));

    if (user) {
        user.firstName = req.body.firstName;
        user.lastName = req.body.lastName;
        user.age = req.body.age;
        user.city = req.body.city;

        res.send({ user });
    } else {
        res.status(404);
        res.send({ user: null });
    }
    writeJson(read, fullPath);
});

app.get('/users/:id', (req, res) => {
    const read = readJson(fullPath);
    const user = read.find((user) => user.id === Number(req.params.id));

    if (user) {
        res.send({ user });
    } else {
        res.status(404);
        res.send({ user: null });
    }
});

app.delete('/users/:id', (req, res) => {
    const read = readJson(fullPath);
    const user = read.find((user) => user.id === Number(req.params.id));

    if (user) {
        const userIndex = read.indexOf(user);
        read.splice(userIndex, 1);
        writeJson(read, fullPath);
        res.send({ user });
    } else {
        res.status(404);
        res.send({ user: null });
    }
});

app.use((req, res) => {
    res.status(404).send({
        message: 'URL not found1'
    })
});

app.listen(3000);