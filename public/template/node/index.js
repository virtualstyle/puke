'use strict';

module.exports = function (options) {

    var style = "red+bold+underline";
    var text = '"' + options.genDir +
        '/node_modules/ascii-art/bin/ascii-art" text -s ' + style + ' ';
    var nl = '\n echo \n\n';

    var commands = [
        {
            cmd: 'yarn',
            output: 'Installing dependencies...'
        },
        {
            cmd: 'yarn code',
            output: 'Linting code and running standards fixer...'
        },
        {
            cmd: 'rm -rf docs',
        },
        {
            cmd: 'yarn docs',
            output: 'Generating documentation...'
        },
        {
            cmd: 'yarn coverage',
        },
        {
            cmd: 'yarn test',
            output: 'Running unit tests...'
        },
    ];

    var cmdStr = '';

    for (let i = 0; i < commands.length; i++) {
        if (typeof commands[i].output !== 'undefined') {
            cmdStr += text + '"' + commands[i].output + '" ' + nl +
                commands[i].cmd + nl;
        } else {
            cmdStr += commands[i].cmd + nl;
        }
    }

    return {
        genName: 'Puke Node Module Generator',
        prompts: [
            {
                name: 'projectName',
                message: 'Enter Node module name: ',
                default: '@' + options.githubUserName + '/' +
                    options.rootDirKebab,
              },
            {
                name: 'description',
                message: 'Enter Node module description: ',
                default: 'This is a Puke Node module.',
              },
            {
                name: 'entryPoint',
                message: 'Enter Node module entry point: ',
                default: 'index.js',
              },
            {
                name: 'author',
                message: 'Enter Node module author: ',
                default: options.name + ' <' + options.email + '>' +
                    ' (' + options.url + ')',
              },
        ],
        templateDirectory: options.genDir + '/public/template/node',
        templateExtension: '.vstemplate',
        install: cmdStr,
    };
};
