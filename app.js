const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

let user = {
    uid: 0,
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
    if (user.uid === 0 || user.name === '' || user.lastName === '') {
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
            response: user
        };
    };
    res.send(resp);
});

//Create user
app.post('/user', (req, res) => {
    if (!req.body.uid || !req.body.name || !req.body.lastName) {
        resp = {
            error: true,
            code: 502,
            message: 'Name and Last name fields are required'
        };
    } else {
        if (user.uid !== 0 || user.name !== '' || user.lastName !== '') {
            resp = {
                error: true,
                code: 503,
                message: `The user ${user.uid} has already been created`
            };
        } else {
            user = {
                uid: req.body.uid,
                name: req.body.name,
                lastName: req.body.lastName
            };
            resp = {
                error: false,
                code: 200,
                message: `The user ${user.uid} has been created`,
                response: user
            };
        };
    };
    res.send(resp);
});

//Update User
app.put('/user', (req, res) => {
    if (!req.body.uid || !req.body.name || !req.body.lastName) {
        resp = {
            error: true,
            code: 502,
            message: 'Name and Last name fields are required'
        };
    } else {
        if (user.uid === 0 || user.name === '' || user.lastName === '') {
            resp = {
                error: true,
                code: 501,
                message: 'The user has not been created'
            };
        } else {
            user = {
                uid: req.body.uid,
                name: req.body.name,
                lastName: req.body.lastName
            };
            resp = {
                error: false,
                code: 200,
                message: `The user ${user.uid} has been updated:`,
                response: user
            };
        };
    };
    res.send(resp)
});

//Remove User
app.delete('/user', (req, res) => {
    if (user.uid === 0 || user.name === '' || user.lastName === '') {
        resp = {
            error: true,
            code: 501,
            message: 'The user has not been created'
        };
    } else {
        user = {
            uid: 0,
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

//Create Pet
app.post('/pet', (req, res) => {
    if (!req.body.id || !req.body.name || !req.body.breed || !req.body.age || !req.body.color || !req.body.size || !req.body.nature || !req.body.location) {
        resp = {
            error: true,
            code: 502,
            message: 'Every field is required'
        };
    } else {
        const findPet = pets.find(pet => pet.id === req.body.id);
        if (findPet) {
            resp = {
                error: true,
                code: 503,
                message: `The pet ${req.body.id} has already been created`,
                response: findPet
            };
        } else {
            pet = {
                id: req.body.id,
                name: req.body.name,
                breed: req.body.breed,
                age: req.body.age,
                color: req.body.color,
                size: req.body.size,
                nature: req.body.nature,
                location: req.body.location
            };
            pets.push(pet);
            petsOrder;
            resp = {
                error: false,
                code: 200,
                message: `The pet ${pet.id} has been created`,
                response: pet
            };
        };
    };
    res.send(resp);
});

const petsOrder = pets.sort((a, b) => a - b);
const removeAllElements = (array, elem) => {  
    let index = array.indexOf(elem);
    while (index > -1) {
        array.splice(index, 1);
        index = array.indexOf(elem);
    };
};

//Update pet
app.put('/pet/:id', (req, res) => {
    const id = Number(req.params.id);
    if (!req.body.id || !req.body.name || !req.body.breed || !req.body.age || !req.body.color || !req.body.size || !req.body.nature || !req.body.location) {
        resp = {
            error: true,
            code: 502,
            message: 'Every field is required'
        };
    } else {
        const findPet = pets.find(pet => {
            pet.id === id &&
            pet.name === req.body.name &&
            pet.breed === req.body.breed &&
            pet.age === req.body.age &&
            pet.color === req.body.color &&
            pet.size === req.body.size &&
            pet.nature === req.body.nature &&
            pet.location === req.body.location
        });
        if (findPet) {
            resp = {
                error: true,
                code: 503,
                message: `The pet ${id} is the same as the previous one. Please make some changes to update the pet ${pet.id}`,
                response: pet
            };
        } else {
            const findPet = pets.find(pet => pet.id === id);
            if (findPet) {
                pet = {
                    id: id,
                    name: req.body.name,
                    breed: req.body.breed,
                    age: req.body.age,
                    color: req.body.color,
                    size: req.body.size,
                    nature: req.body.nature,
                    location: req.body.location
                };
                removeAllElements(pets, findPet);
                pets.push(pet);
                petsOrder;
                resp = {
                    error: false,
                    code: 200,
                    message: `The pet ${id} has been updated`,
                    response: pet
                };
            } else {
                resp = {
                    error: true,
                    code: 503,
                    message: `The pet ${id} has not been created`,
                };
            };
        };
    };
    res.send(resp);
});

//Remove pet
app.delete('/pet/:id', (req, res) => {
    const id = Number(req.params.id);
    const findPet = pets.find(pet => pet.id === id);
    if (findPet) {
        removeAllElements(pets, findPet);
        resp = {
            error: false,
            code: 200,
            message: `The pet ${id} has been deleted`,
        };
    } else {
        petsOrder;
        resp = {
            error: true,
            code: 503,
            message: `The pet ${id} has not been created`,
            };  
        };
    res.send(resp);
});

//Get Pets
app.get('/pets', (req, res) => {
    petsOrder;
    resp = {
        error: false,
        code: 200,
        response: {pets}
    };
    res.send(resp);
});

//Get Params
app.get('/user/:uid', (req, res) => {
    const uid = Number(req.params.uid);
    if (user.uid === 0 || user.name === '' || user.lastName === '') {
        resp = {
            error: true,
            code: 501,
            message: `The user ${uid} has not been created`
        };
    } else {
        resp = {
            error: false,
            code: 200, 
            message: `The User ID has been found:`,
            response: user
        }
    }
    res.send(resp);
});
app.get('/pet/:id', (req, res) => {
    const id = Number(req.params.id);
    const findPet = pets.find(pet => pet.id === id);
    if (findPet) {
        resp = {
            error: false,
            code: 200,
            message: `The pet ID ${id} has been found:`,
            response: findPet
        };
    } else {
        resp = {
            error: true,
            code: 501,
            message: `The pet ID ${id} has not been found`
        };
    };
    res.send(resp);
});

//Queries
app.get('/search', (req, res) => {
    const id = req.query.id;
    const uid = req.query.uid;
    const name = req.query.name;
    const lastName = req.query.lastName;
    const breed = req.query.breed;
    const age = req.query.age;
    const color = req.query.color;
    const size = req.query.size;
    const nature = req.query.nature;
    const location = req.query.location;
    if (uid !== user.uid || name !== user.name || lastName !== user.lastName) {
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
    const findPet = pets.find(pet => pet.id === id && pet.name === name || pet.breed === breed || pet.age === age || pet.color === color || pet.size === size || pet.nature === nature || pet.location === location);
    if (findPet) {
        resp = {
            error: false,
            code: 200, 
            message: `The pet ${id} has been found`,
            response: findPet
        };
    } else {
        resp = {
            error: true,
            code: 501,
            message: `The pet ${id} has not been found`
        };
    }
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
app.listen(5000, () => {
console.log("Start server in port 5000 ");
});