'use strict';

const fs = require('fs');
const Hapi = require('hapi');
const Ivona = require('ivona-node');
const path = require('path');
const Readable = require('stream').Readable;


const port = process.env.PORT || 3000
const server = new Hapi.Server();
server.connection({
    port: port
});


let accessKey;
let secretKey;
const productionMode = process.env.NODE_ENV === 'production';

if (productionMode) {
    accessKey = process.env.ACCESS_KEY;
    secretKey = process.env.SECRET_KEY;
} else {
    accessKey = require('./secret').accessKey;
    secretKey = require('./secret').secretKey;
}

console.log(accessKey, secretKey)

const ivona = new Ivona({
    accessKey: accessKey,
    secretKey: secretKey
});

server.register(require('inert'), (err) => {
    if (err) {
        throw err;
    }
    server.route({
        method: 'GET',
        path: '/{path*}',
        handler: {
            directory: {
                path: 'public'
            }
        }
    });
});

server.route({
    method: 'POST',
    path: '/test',
    handler: function(request, reply) {

        var test = ivona.createVoice(request.payload.text, {
                body: {
                    voice: {
                        name: 'Maxim',
                        language: 'ru-RU',
                        gender: 'Male'
                    }
                }
            })

            reply(new Readable().wrap(test));
    }
});

server.start((err) => {
    if (err) {
        throw err;
    }
    console.log('Web server started at:', server.info.uri);
});
