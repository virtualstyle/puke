# Puke

> You've Gulped, you've Grunted - try Puking!

> Puke vomits out project structures like a drunk teenager in a 7-11 parking lot on a Friday night.

Puke, if the name or the lame joke above didn't run you off, is my personal project generator. I don't advise anyone else to use it.

That being said...

Puke is a boilerplate scaffolding system for rapidly producing project structures and stub files, including dev tools and automation of code formatting, testing, etc..

Designed for a global install, Puke stores templates in your home directory under a .puke folder. The common and config directories are required, though you can edit/remove the files in common, and edit the files in the config folder, if you like, indeed local.json should be updated with your github user name and your PHP vendor namespace. The node and php folders are default project templates you can edit, remove, whatever, or add your own projects to the .puke folder, using the same setup as the node and php templates already in there, an index.js file and a templates folder. Note the option to add preprocess and scaffold functions to be called from hooks in the generator.

Projects are just a folder with the name of the action you'll pass to Puke on the command line. Under this folder, index.js will export a function that accepts an options object. Also in this folder will be a directory named templates, which will house the project directory skeleton and template files.

## About The Generator

Note that the generator itself is set up the same as the Node Module generator default pattern, so the standards for the Node Module Generator, below, apply to the base generator, which is just a node module itself..

### Available Generators

- Node Module `$ puke -n`
- PHP Library `$ puke -p`

### Command Line Options

- Skip Config Prompts `puke <generator> -y`

### Unit Testing

Generators add unit testing dependencies and provide build time test functionality through NPM/Yarn. (`npm test` or `yarn test`) The generator itself also has unit test capability. See individual generator docs below for specifics on each project type.

### Code formatting

Generators add unit testing dependencies and lint/format code to their respective standards in a build task. See individual generator docs below for specifics on each project type.

### Documentation Generation

Generators add documentation generation dependencies and a document generation build task. See individual generator docs below for specifics on each project type.

## About The Generators

### Puke Node Module Generator

#### Structure

### Puke PHP Library Generator

#### Structure
