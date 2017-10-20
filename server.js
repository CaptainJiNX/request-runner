'use strict';

const request = require('request');

const DEFAULT_INTERVAL = 60 * 1000;

const uri = process.env['REQUEST_URI'] || 'https://www.google.com';
const method = (process.env['REQUEST_METHOD'] || 'GET').toUpperCase();
const json = JSON.parse(process.env['REQUEST_JSON'] || '{}');
let interval = parseInt(process.env['REQUEST_INTERVAL_MS']);

if(isNaN(interval))
{
    interval = DEFAULT_INTERVAL;
}

var timeout = setInterval(() => {
    const options = {
        method: method
    };

    if (method == 'POST')
    {
        options.json = json;
    }
    console.log('Requesting: ', uri, options);

    request(uri, options, (err, res, body) => {
        if(err) {
            return console.error(err);
        }

        console.log(res.statusCode);
    });
}, interval);

['SIGTERM','SIGINT','SIGHUP'].forEach((signal) => process.once(signal, () => {
    clearInterval(timeout);
    process.exit(0);
}));
