'use strict';

const fs = require('fs');
const Hapi = require('hapi');
const Ivona = require('ivona-node');
const keys = require('./secret');
const path = require('path')

var Readable = require('stream').Readable;

const port = process.env.PORT || 3000

const server = new Hapi.Server();
server.connection({
    port: port
});
console.log(keys);
var ivona = new Ivona({
    accessKey: keys.accessKey,
    secretKey: keys.secretKey
});

// ivona.listVoices()
//     .on('complete', function(voices) {
//         console.log(voices);
//     });

// ivona.createVoice(text, config)
// [string] text - the text to be spoken
// [object] config (optional) - override Ivona request via 'body' value

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
        // console.log(request.payload)
        // var test = ivona.createVoice('Привет! Я Максим.', {
        //         body: {
        //             voice: {
        //                 name: 'Maxim',
        //                 language: 'ru-RU',
        //                 gender: 'Male'
        //             }
        //         }
        //     })
        // .pipe(fs.createWriteStream('text.mp3'));

        // console.log(test);
        // var filepath = path.join(__dirname, 'text.mp3');
        // console.log(filepath);
        // var readStream = fs.createReadStream(filepath)
        // reply(test).type('audio/mp3');

        var test = ivona.createVoice(request.payload.text, {
                body: {
                    voice: {
                        name: 'Maxim',
                        language: 'ru-RU',
                        gender: 'Male'
                    }
                }
            })
            // .on('response', function(response) {
            //     // console.log(response);
            //     const test = reply(response);
            //     test.type('audio/mp3');
            //     test.variety = 'buffer';
            // })
            //     .pipe(fs.createWriteStream('text.mp3'));

            reply(new Readable().wrap(test));
        // res.setHeader("Content-Type", "audio/mpeg");
    }
});

server.start((err) => {
    if (err) {
        throw err;
    }
    console.log('Web server started at:', server.info.uri);
});
