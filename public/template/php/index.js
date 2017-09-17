'use strict';

module.exports = function (options) {

    const fs = require(options.modulesPath + '/fs-extra');
    const underscoreTemplate = require(options.modulesPath + '/underscore.template');

    var nameSpaceParts = [];

    var style = "red+bold+underline";
    var text = '"' + options.genDir +
        '/node_modules/ascii-art/bin/ascii-art" text -s ' + style + ' ';
    var nl = '\n echo \n\n';

    var commands = [
        {
            cmd: 'composer install',
            output: 'Installing dependencies...'
        },
        {
            cmd: 'composer code',
            output: 'Linting code and running standards fixer...'
        },
        {
            cmd: 'rm -rf docs',
        },
        {
            cmd: 'composer docs',
            output: 'Generating documentation...'
        },
        {
            cmd: 'composer test',
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
        genName: 'Puke PHP Library Generator',
        sourceFolder: 'src',
        prompts: [{
            name: 'projectName',
            message: 'Enter PHP library name: ',
            default: '@' + options.githubUserName + '/' + options.rootDirKebab,
          }, {
            name: 'description',
            message: 'Enter PHP library description: ',
            default: 'This is a Puke PHP library.',
          }, {
            name: 'nameSpace',
            message: 'Enter PHP Library Namespace: ',
            default: options.vendorNamespace + '\\' + options.rootDirStudly,
          }, ],
        templateDirectory: options.genDir + '/public/template/php-lib',
        templateExtension: '.vstemplate',
        install: cmdStr,
        preprocess: function (promptAnswers) {

            nameSpaceParts =
                promptAnswers.nameSpace.replace(/\\+/g, '\\').split('\\');

            Object.assign(promptAnswers, {
                nameSpaceParts: nameSpaceParts,
                nameSpaceDbleSlashes: promptAnswers.nameSpace.replace(/\\+/g, '\\\\'),
            });
        },
        scaffold: function (promptAnswers) {

            fs.ensureDirSync(options.cwd + '/src/' +
                promptAnswers.nameSpace.replace(/\\+/g, '/'));
            fs.ensureDirSync(options.cwd + '/test/' +
                promptAnswers.nameSpace.replace(/\\+/g, '/')
                .replace(nameSpaceParts[0], nameSpaceParts[0] + 'Test')
            );

            if (fs.existsSync(options.cwd +
                    '/test/' + options.rootDirStudly + 'Test.php')) {

                const inPath = options.cwd +
                    '/test/' + options.rootDirStudly + 'Test.php';

                const outPath = options.cwd + '/test/' +
                    promptAnswers.nameSpace.replace(/\\+/g, '/')
                    .replace(nameSpaceParts[0], nameSpaceParts[0] + 'Test') +
                    '/' + options.rootDirStudly + 'Test.php';

                const data = fs.readFileSync(inPath, 'utf8');
                const output = underscoreTemplate(
                    data,
                    promptAnswers
                );
                fs.outputFileSync(outPath, output);
                fs.removeSync(inPath);
            }

            if (fs.existsSync(options.cwd +
                    '/src/' + options.rootDirStudly + '.php')) {

                const inPath = options.cwd +
                    '/src/' + options.rootDirStudly + '.php';

                const outPath = options.cwd + '/src/' +
                    promptAnswers.nameSpace.replace(/\\+/g, '/') +
                    '/' + options.rootDirStudly + '.php';

                const data = fs.readFileSync(inPath, 'utf8');
                const output = underscoreTemplate(
                    data,
                    promptAnswers
                );
                fs.outputFileSync(outPath, output);
                fs.removeSync(inPath);

            }

            if (fs.existsSync(options.cwd +
                    '/src/' + options.rootDirStudly + 'Interface.php')) {

                const inPath = options.cwd +
                    '/src/' + options.rootDirStudly + 'Interface.php';

                const outPath = options.cwd + '/src/' +
                    promptAnswers.nameSpace.replace(/\\+/g, '/') +
                    '/' + options.rootDirStudly + 'Interface.php';

                const data = fs.readFileSync(inPath, 'utf8');
                const output = underscoreTemplate(
                    data,
                    promptAnswers
                );
                fs.outputFileSync(outPath, output);
                fs.removeSync(inPath);

            }
        },
    };
};
