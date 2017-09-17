'use strict';

module.exports = function(options) {
    return {
        shortcuts: [
            {key: 'n', action: 'node'},
            {key: 'p', action: 'php'},
        ],
        npmConfigPrompts: [
            {
                name: 'name',
                message: 'Author\'s name: ',
                default: 'Author Name',
            },
            {
                name: 'email',
                message: 'Author\'s email: ',
                default: 'author.name@authordomain.com',
            },
            {
                name: 'url',
                message: 'Author\'s URL: ',
                default: 'https://authordomain.com',
            },
            {
                name: 'license',
                message: 'License type: ',
                default: 'MIT',
            }
        ],
    };
};
