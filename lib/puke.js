/**
 * This file is the core executable for Puke, a project skeleton generator.
 *
 * Puke is a boilerplate scaffolding system for
 * rapidly producing project structures and stub files, including dev tools
 * and automation of code formatting, testing, etc..
 *
 * @module @virtualstyle/puke
 * @version 0.1.0
 * @license MIT
 * @copyright 2017 Rob Wood
 */
'use strict';

const fs = require('fs-extra');

const path = require('path');
const underscoreTemplate = require('underscore.template');
const S = require('string');

const cliConfig = {
    figletFontPath: __dirname + '/../public/'
};
const cli = new(require('../lib/cli'))(cliConfig);

const {
    spawn
} = require('child_process');

const cwd = process.cwd();
const dirs = cwd.split('/');
const curdir = dirs[dirs.length - 1];

const rootDirKebab = S(curdir.charAt(0).toLowerCase() + curdir.slice(1))
    .dasherize().s;
const rootDirCamel = S(rootDirKebab).camelize().s;
const rootDirStudly = S(rootDirKebab).capitalize().camelize().s;
const copyRightYear = (new Date()).getFullYear();

const genDir = __dirname.substring(0, __dirname.lastIndexOf('/'));

const configOptions = {
    genDir: genDir,
    cwd: cwd,
    rootDirCamel: rootDirCamel,
    rootDirKebab: rootDirKebab,
    rootDirStudly: rootDirStudly,
    configDir: process.env.HOME + '/.puke',
    configOverrides: ['local'],
    copyRightYear: copyRightYear,
    modulesPath: process.mainModule.paths[0]
};

var config = require('@virtualstyle/config')(configOptions);

let action = cli.argv._[0];
if(config.shortcuts !== undefined) {
    for(let i = 0; i < config.shortcuts.length; i++) {
        if (cli.argv[config.shortcuts[i].key] !== undefined) {
            action = config.shortcuts[i].action;
        }
    }
}

if(action === undefined) {
    throw new Error('ERROR: Bad command line input.');
}

checkTemplateFiles();

let genConfig = {};

Object.assign(configOptions, {
    githubUserName: config.githubUserName,
    vendorNamespace: config.vendorNamespace
});

genConfig = require(process.env.HOME + '/.puke/' + action)(configOptions);

// An object to hold npm author info for use in templates
var npmData = {};

// The -y command line flag will bypass prompts for config and use defaults
const promptFlag = cli.argv.y !== undefined ? false : true;

// Object to hold config settings, initialized with default values
// from prompts in config, to be overridden by prompt responses.
var promptAnswers = {};

function checkTemplateFiles() {

    if (!fs.existsSync(process.env.HOME + '/.puke')) {
        cli.out('The directory ~/.puke does not exist. ' +
            'This module depends on templates placed in that directory.',
            'red+bold+underline');
        cli.out('', 'reset');
        process.exit(0);
    }

    if (!fs.existsSync(process.env.HOME + '/.puke/common')) {
        cli.out('The directory ~/.puke/common does not exist. ' +
            'Common files, such as .gitignore, or .editorconfig will not' +
            'be copied to your project.', 'red+bold+underline');
        cli.out('', 'reset');
        process.exit(0);
    }

    if (!fs.existsSync(process.env.HOME + '/.puke/config')) {
        cli.out('The directory ~/.puke/config does not exist. ' +
            'Puke relies upon files copied there.',
            'red+bold+underline');
        cli.out('', 'reset');
        process.exit(0);
    }

    if (!fs.existsSync(process.env.HOME + '/.puke/config/local.json')) {
        cli.out('The file ~/.puke/config/local.json does not exist. ' +
            'Puke relies upon this file.',
            'red+bold+underline');
        cli.out('', 'reset');
        process.exit(0);
    }

    if (!fs.existsSync(process.env.HOME + '/.puke/' + action)) {
        cli.out('The directory ~/.puke/' + action +
            ' does not exist. ' +
            'The action you entered depends on that directory.',
            'red+bold+underline');
        cli.out('', 'reset');
        process.exit(0);
    }

}

/**
 * Passed a string to identify which generator to use, returns that generator,
 * or an empty object
 * @method getGenConfig
 * @param  {string}     action A command line param to indicate which
 *                             generator to use
 * @return {object}
 */
function getGenConfig(action) {

    if (action === undefined) {

        if (cli.argv.n !== undefined) {
            return config.nodeConfig;
        } else if (cli.argv.p !== undefined) {
            return config.phpLibConfig;
        } else {
            return {};
        }
    }

    switch (action) {

    case 'node':
        {
            return config.nodeConfig;
        }
    case 'php-lib':
        {
            return config.phpLibConfig;
        }
    default:
        {
            return false;
        }
    }

}

/**
 * Prepare to run the specified action, getting config settings, and firing
 * the getUserNpmInput() function.
 * @method init
 * @memberof module:@virtualstyle/puke
 */
function init() {

    cli.clear();

    if (genConfig !== {}) {
        config.genConfig = genConfig;
    } else {
        throw new Error('ERROR: Bad command line input.');
    }

    promptAnswers = loadGeneratorDefaults(config.genConfig.prompts);

    process.stdout.write('\n');
    cli.art.font('    Virtual', 'ANSI Shadow', function (rendered) {
        process.stdout.write(rendered);

        cli.art.font('     Style ', 'ANSI Shadow', function (rendered) {
            process.stdout.write(rendered);
            getUserNpmInput();
        });

    });

}

/**
 * Load the object to hold prompted config values with their default values
 * @method loadGeneratorDefaults
 * @param  {object}     options A list of prompt objects, with name,
 *                              prompt, and default values.
 * @return {object}
 */
function loadGeneratorDefaults(options) {

    var key = '';
    var promptAnswers = {};

    for (let i = 0; i < options.length; i++) {
        promptAnswers[options[i].name] = options[i].default;
    }

    return promptAnswers;

}

/**
 * Branch according to the prompt flag, asfetr a short delay to show the
 * splash screen ASCII art.
 * @method generate
 */
function generate() {

    console.log('');

    var nextFunc = null;

    if (promptFlag) {
        cli.out('Enter your configuration variables:', 'red+bold+underline');
        cli.out('', 'reset');
        nextFunc = getUserInput;
    } else {
        cli.out('Loading default config...', 'red+bold+underline');
        cli.out('', 'reset');
        nextFunc = copyProjectFiles;
    }

    setTimeout(function () {
        nextFunc();
    }, 1250);

}

/**
 * Method to get user config input
 * @method getUserInput
 * @memberof module:@virtualstyle/puke
 */
function getUserInput() {

    console.log('');

    cli.prompt(config.genConfig.prompts, function (answers) {

        Object.assign(promptAnswers, answers);
        copyProjectFiles();

    });

}

/**
 * Method to get user npm config input
 * @method getUserNpmInput
 * @memberof module:@virtualstyle/puke
 */
function getUserNpmInput() {

    console.log('');

    const npmrcPath = __dirname + '/../.npmrc';
    const yarnPath = __dirname + '/../.yarnrc';

    const npmRegExp = {
        name: /init[.-]author[.-]name =? ?["']?([^"']*)["']?\n/,
        email: /init[.-]author[.-]email =? ?["']?([^"']*)["']?\n/,
        url: /init[.-]author[.-]url =? ?["']?([^"']*)["']?\n/,
        license: /init[.-]license =? ?["']?([^"']*)["']?\n/,
        version: /init[.-]version =? ?["']?([^"']*)["']?\n/
    }

    let npmrc = '';

    if (fs.existsSync(npmrcPath)) {
        npmrc = fs.readFileSync(npmrcPath, 'utf8');
    } else if (fs.existsSync(yarnPath)) {
        npmrc = fs.readFileSync(yarnPath, 'utf8');
    }

    if (npmrc !== '') {

        let name = npmrc.match(npmRegExp.name) === null ? 'Author Name' :
            npmrc.match(npmRegExp.name)[1];
        let email = npmrc.match(npmRegExp.email) === null ? 'author.name@authordomain.com' :
            npmrc.match(npmRegExp.email)[1];
        let url = npmrc.match(npmRegExp.url) === null ? 'https://authordomain.com' :
            npmrc.match(npmRegExp.url)[1];
        let license = npmrc.match(npmRegExp.license) === null ? 'MIT' :
            npmrc.match(npmRegExp.license)[1];
        let version = npmrc.match(npmRegExp.version) === null ? '0.0.0' :
            npmrc.match(npmRegExp.version)[1];

        npmData = {
            name: name,
            email: email,
            url: url,
            license: license,
            version: version
        }
    } else {
        npmData = {
            name: 'Author Name',
            email: 'author.name@authordomain.com',
            url: 'https://authordomain.com',
            license: 'MIT',
            version: '0.0.0'
        }
    }

    let adjustedNpmPrompts = [];

    if (promptFlag) {
        for (let i = 0; i < config.npmConfigPrompts.length; i++) {
            if (npmData[config.npmConfigPrompts[i].name] !== undefined) {
                adjustedNpmPrompts.push(config.npmConfigPrompts[i]);
                adjustedNpmPrompts[i].default =
                    npmData[adjustedNpmPrompts[i].name];
            }
        }
    }

    cli.prompt(adjustedNpmPrompts, function (answers) {

        Object.assign(npmData, answers);
        generate();

    });
}

/**
 * Copy files from template directory, execute hooked processes.
 * @method copyProjectFiles
 * @return {[type]}
 */
function copyProjectFiles() {

    console.log('');
    cli.out('Copying project files...', 'red+bold+underline');
    cli.out('', 'reset');

    if (config.genConfig.preprocess !== undefined) {
        config.genConfig.preprocess(promptAnswers);
    }

    copyDirectory(process.env.HOME + '/.puke/common/');
    copyDirectory(process.env.HOME + '/.puke/' + action + '/template/');
    cli.out('', 'reset');

    if (config.genConfig.scaffold !== undefined) {
        config.genConfig.scaffold(promptAnswers);
    }

    console.log('');
    cli.out('Running install commands...', 'magenta+bold+underline');
    cli.out('', 'reset');

    runInstall();

}

function runInstall() {

    const ls = spawn(config.genConfig.install, [], {
        shell: true,
        stdio: 'inherit'
    });

    ls.on('close', (code) => {
        cli.out('', 'reset');
        cli.out(`Project installation exited with code ${code}`,
            'magenta+bold+underline');
        cli.out('', 'reset');
    });

}

function copyDirectory(readDir) {

    const writeDir = cwd + '/';

    fs.readdirSync(readDir).forEach(function (file) {

        const inPath = readDir + file;

        const outPath = inPath
            .replace(
                process.env.HOME + '/.puke/' + action + '/template',
                cwd)
            .replace(
                process.env.HOME + '/.puke/common',
                cwd)
            .replace(
                config.genConfig.templateExtension,
                '')
            .replace(
                'my-project',
                rootDirKebab)
            .replace(
                'MyProject',
                rootDirStudly);

        if (fs.statSync(inPath).isDirectory()) {

            if (fs.existsSync(outPath)) {

                cli.out('Directory exists: ' + file, 'gray+italic');
            } else {

                cli.out('Copying directory: ' + file, 'cyan+italic');
            }
            fs.ensureDirSync(outPath);
            copyDirectory(inPath + '/');

        } else {

            if (fs.existsSync(outPath)) {

                cli.out('File exists: ' + file, 'gray+italic');
            } else {

                if (path.extname(inPath) ===
                    config.genConfig.templateExtension) {

                    cli.out('Templating file: ' + file, 'blue+italic');

                    var data = fs.readFileSync(inPath, 'utf8');
                    var output = underscoreTemplate(
                        data,
                        Object.assign(promptAnswers, {
                            genDir: genDir,
                            cwd: cwd,
                            rootDirCamel: rootDirCamel,
                            rootDirKebab: rootDirKebab,
                            rootDirStudly: rootDirStudly,
                            copyRightYear: copyRightYear,
                            githubUserName: config.githubUserName,
                            vendorNamespace: config.vendorNamespace
                        }, npmData)
                    );
                    fs.outputFileSync(outPath, output);

                } else {

                    cli.out('Copying file: ' + file, 'cyan+italic');
                    fs.copySync(inPath, outPath);
                }
            }

        }
    });
}

module.exports = init;
