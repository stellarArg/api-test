const {Router} = require('express');
const fs = require('fs');
const path = require('path');

const dirs = fs.readdirSync(__dirname);


console.log(dirs);


dirs.map(dir => {
    if (!dir.includes('index.js')) {
        //app.use(path.resolve(file)(Router()))
        console.log(`Loading ${dir.replace('.js')} ...`);

        var cadena = 'Hola' + ' mundo';
    }
})


const name = 'Barbara';
const greeting = `Hello, ${name}.`;

console.log(greeting);


function sayHello (name, surname) {
    console.log(`Hello, ${name} ${surname}.`);
    console.log('Hello, ' + name + ' ' + surname + '.');
}

sayHello('Jose', 'Gonzalez');
//sayHello('Maia');
//sayHello('Camilo');
//sayHello('Artulio');
