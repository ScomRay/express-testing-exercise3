const express = require('express');
const body_parser = require('body-parser');
const request = require('request');
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

let user = {
  name: '', 
  lastName: ''
};

let resp = {
  error: false, 
  code: 200,
  message: 'OK'
};

let pet = {
    id: 0,
    name: '',
    breed: '',
    age: 0,
    color: '',
    size: '',
    nature: '',
    location: ''
};

const pets = [];

//Home
app.get('/', (req, res) => {
  res.send(resp);
});

//Get User
app.get('/user', (req, res) => {
    if (user.name === '' || user.lastName === '') {
        resp = {
            error: true,
            code: 501,
            message: 'The user has not been created'
        };
    } else {
        resp = {
            error: false,
            code: 200, 
            message: 'User:',
            response: usuario
        };
    };
    res.send(resp);
});

//Create user
app.post('/user', (req, res) => {
    if (!req.body.name || !req.body.lastName) {
        resp = {
            error: true,
            code: 502,
            message: 'Name and Last name fields are required'
        };
    } else {
        if (user.name !== '' || user.lastName !== '') {
            resp = {
                error: true,
                code: 503,
                message: `The user ${user.name} has already been created`
            };
        } else {
            user = { 
                name: req.body.name,
                lastName: req.body.lastName
            };
            resp = {
                error: false,
                code: 200,
                message: `The user ${user.name} has been created`,
                response: user
            };
        };
    };
    res.send(resp);
});

//Update User
app.put('/user', (req, res) => {
    if (!req.body.name || !req.body.lastName) {
        resp = {
            error: true,
            code: 502,
            message: 'Name and Last name fields are required'
        };
    } else {
        if (user.name === '' || user.lastName === '') {
            resp = {
                error: true,
                code: 501,
                message: 'The user has not been created'
            };
        } else {
            user = { 
                name: req.body.name,
                lastName: req.body.lastName
            };
            resp = {
                error: false,
                code: 200,
                message: `The user ${user.name} has been updated:`,
                response: user
            };
        };
    };
    res.send(resp)
});

//Remove User
app.delete('/user', (req, res) => {
    if (user.name === '' || user.lastName === '') {
        resp = {
            error: true,
            code: 501,
            message: 'The has not been created'
        };
    } else {
        user = {
            name: '',
            lastName: ''
        }
        resp = {
            error: false, 
            code: 200,
            message:'The user has been deleted'
        }
    };
    res.send(resp)
});

//Get Params
app.get('/user/:uid', (req, res) => {
    const uid = req.params.uid
    res.send({message:`The ID has been found: ${uid}`})
});

//Queries
app.get('/search', (req, res) => {
    const name = req.query.name;
    const lastName = req.query.lastName;
    if (name !== user.name || lastName !== user.lastName) {
        resp = {
            error: true,
            code: 501,
            message: 'The user has not been created'
        };
    } else {
        resp = {
            error: false,
            code: 200, 
            message: 'The user has been found',
            response: user
        };
    };
    res.send(resp);
});

//Get Swapi
app.get('/api/swapi/:people', (req, resp) => {
    const {people} = req.params;
    request.get(`https://swapi.co/api/people/${people}/`, (err, res, body) => {
        const swapi_res = JSON.parse(body);
        let films = [];
        swapi_res.films.forEach(film => {
            Promise.all(
                request.get(`${film}`, (err, req, body) => { 
                const swapi_film = JSON.parse(body);
                let film = {
                id: swapi_film.episode_id, 
                title: swapi_film.title
                };
                })
            );
            resp.status(200).send({ 'character': swapi_res }); 
        });
    });
});  

//Use common error
app.use((req, res, next)=> {
    resp = {
        error: true, 
        code: 404, 
        message: 'Not found'
    }
    res.status(404).send(resp)
});

//Listen
app.listen(4000, () => {
console.log("Start server in port 4000 ");
});