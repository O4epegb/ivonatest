'use strict';

const Hapi = require('hapi');

const port = process.env.PORT || 3000

const server = new Hapi.Server();
server.connection({
    port: port
});

server.register(require('inert'), (err) => {
    if (err) {
        throw err;
    }
    server.route({
        method: 'GET',
        path: '/{path*}',
        // handler: {
        //     file: './public/index.html'
        // }
        // handler: function (request, reply) {
        //     reply.file('./public/index.html', './public/common.js');
        // }
        handler: {
            directory: {
                path: 'public'
            }
        }
    });
});

server.start((err) => {
    if (err) {
        throw err;
    }
    console.log('Web server started at:', server.info.uri);
});
