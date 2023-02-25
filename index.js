#!/usr/bin/env node

/*
  Inspiration from:
  - https://www.youtube.com/watch?v=_oHByo8tiEY&ab_channel=Fireship
  -https://dev.to/leopold/generate-your-web-app-boilerplate-like-create-react-app-does-301p
*/

import chalk from 'chalk';
import inquirer from 'inquirer';
import { createSpinner } from 'nanospinner';
import { exec, execSync } from 'child_process';
import fs from 'fs';
import { rimrafSync } from 'rimraf';

const rawTemplatesUrl =
  'https://raw.githubusercontent.com/winstonco/scaffold-314/main/templates/';

console.log(chalk.green.bold('Welcome!'));
console.log(
  chalk.green.bold(
    'This is a scaffolding tool for ICS 314 assignments and WODs.\n'
  )
);

const { projectType } = await inquirer.prompt([
  {
    type: 'list',
    name: 'projectType',
    message: 'What kind of project are you making?',
    default: 'Native',
    choices: ['Native', 'Bootstrap 5', 'React'],
  },
]);

const { bootstrapIcons } = await inquirer.prompt([
  {
    type: 'confirm',
    name: 'bootstrapIcons',
    message: 'Include buttons?',
    default: true,
    when: () => projectType === 'Bootstrap 5',
  },
]);

const { reactTask } = await inquirer.prompt([
  {
    type: 'list',
    name: 'reactTask',
    message: 'Which task?',
    choices: [
      '1: Set up development environment',
      '2: Create base React app w/ CRA',
    ],
    when: () => projectType === 'React',
    filter: (input, answers) => {
      return parseInt(input[0]);
    },
  },
]);

const { appName } = await inquirer.prompt([
  {
    type: 'input',
    name: 'appName',
    message: 'App name:',
    when: () => reactTask === 2,
  },
]);

const createFilesSpinner = createSpinner('Creating files...\n').start();
const filesCreated = [];

const responses = {
  projectType,
  bootstrapIcons,
  reactTask,
  appName,
};

try {
  // await new Promise((res) => setTimeout(res, 1000));
  await scaffold(responses);
  createFilesSpinner.success({ text: 'Done! 😃' });
  if (appName)
    console.log(
      chalk.bgWhite.black(`\n Now run `) +
        chalk.bgWhite.cyan.bold(` cd ${appName} `) +
        chalk.bgWhite.black(` `)
    );
} catch {
  createFilesSpinner.error({ text: 'Something went wrong... 🙁' });
  process.exit(1);
}

function scaffold(options) {
  const { projectType, bootstrapIcons, reactTask, appName } = options;

  return new Promise(async (res, rej) => {
    switch (projectType) {
      case 'Native':
        await scaffoldNative();
        break;
      case 'Bootstrap 5':
        await scaffoldBootstrap(bootstrapIcons);
        break;
      case 'React':
        await scaffoldReact(reactTask, appName);
        break;
      default:
        rej();
    }
    res();
  });
}

async function scaffoldNative() {
  const fileList = ['index.html', 'index.js', 'style.css'];
  await createFiles(fileList, rawTemplatesUrl + 'native');
}

async function scaffoldBootstrap(includeIcons) {
  const fileList = ['index.html', 'style.css'];
  includeIcons
    ? await createFiles(fileList, rawTemplatesUrl + 'bootstrap/icons')
    : await createFiles(fileList, rawTemplatesUrl + 'bootstrap/no_icons');
}

async function scaffoldReact(taskNumber, appName) {
  switch (taskNumber) {
    case 1:
      await createFiles(['.gitignore'], rawTemplatesUrl + 'react/task_1');
      break;
    case 2:
      await runCreateReactApp(appName, true);
      break;
    case 3:
      console.log('test');
      break;
    default:
      throw new Error('Invalid taskNumber');
  }
}

function runCreateReactApp(appName, deleteSrcContents = false) {
  createFilesSpinner.update({ text: 'Hold on, this could take a while!\n' });
  return new Promise((res) => {
    exec(`npx create-react-app ${appName}`, () => {
      if (deleteSrcContents) {
        rimrafSync(`${appName}/src`);
        fs.mkdirSync(`${appName}/src`);
        res();
      }
    });
  });
}

function createFiles(fileList, templateUrl) {
  let counter = 0;
  return new Promise((res) => {
    fileList.forEach((fileName) => {
      if (!fs.existsSync(fileName)) {
        exec(`curl -O -s ${templateUrl}/${fileName}`, () => {
          counter++;
          if (counter === fileList.length) {
            res();
          }
        });
        filesCreated.push(fileName);
      } else {
        handleFileConflict(fileName);
      }
    });
  });
}

function handleFileConflict(fileName) {
  createFilesSpinner.error(
    `Conflicting file. Could not create file: ${fileName}`
  );
  const cleanUpSpinner = createSpinner('Removing created files...\n').start();
  filesCreated.forEach((file) => {
    fs.unlinkSync(file);
  });
  cleanUpSpinner.success({ text: 'Other files were removed successfully.' });
  process.exit(1);
}
