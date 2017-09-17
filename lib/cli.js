'use strict';
/**
 * Class to provide CLI input/output handling
 */
class cli {

    /**
     * Load all our tools and provide access to them publicly.
     * @method constructor
     * @param  {Object}    config An object with config values
     */
    constructor(config) {
        this.clear = require('clear');
        this.inquirer = require('inquirer');
        this.art = require('ascii-art');
        this.art.Figlet.fontPath = config.figletFontPath;
        this.argv = require('minimist')(process.argv.slice(2));
    }

    /**
     * Iterate through an array of promts, taking user input
     * @method prompt
     * @param  {array}   prompts  An array of prompt objects
     *                            {name, prompt, default}
     * @param  {Function} callback A function to which we pass the
     *                             collected data
     */
    prompt(prompts, callback) {
        this.inquirer.prompt(prompts).then(function (answers) {
            callback(answers);
        });
    }

    /**
     * Simple command line output of a text string with a style string.
     * @method out
     * @param  {string} line  A line of text
     * @param  {string} style A style for Ascii-Art
     *                        ex: (red+bold, yellow+underline, reset)
     */
    out(line, style) {

        console.log(this.art.style(line, style));

    }

}

module.exports = cli;
