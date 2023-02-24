#!/usr/bin/env node

/*
  Inspiration from:
  - https://www.youtube.com/watch?v=_oHByo8tiEY&ab_channel=Fireship
  -https://dev.to/leopold/generate-your-web-app-boilerplate-like-create-react-app-does-301p
*/

import chalk from 'chalk';
import inquirer from 'inquirer';
import { createSpinner } from 'nanospinner';
import { execSync } from 'child_process';
import { rimrafSync } from 'rimraf';

const rawTemplatesUrl =
  'https://raw.githubusercontent.com/winstonco/scaffold-314/main/templates/';

console.log(chalk.green.bold('Welcome!'));
console.log(
  chalk.green.bold(
    'This is a scaffolding tool for ICS 314 assignments and WODs.\n'
  )
);

const { project_type } = await inquirer.prompt([
  {
    type: 'list',
    name: 'project_type',
    message: 'What kind of project are you making?',
    default: 'Native',
    choices: ['Native', 'Bootstrap 5', 'React'],
  },
]);

const { react_task, app_name } = await inquirer.prompt([
  {
    type: 'list',
    name: 'react_task',
    message: 'Which task?',
    choices: [
      '1: Set up environment',
      '2: Create React app',
      '3: Bootstrap React',
    ],
    when: () => project_type === 'React',
    filter: (input, answers) => {
      return parseInt(input[0]);
    },
  },
  {
    type: 'input',
    name: 'app_name',
    message: 'App name:',
    when: () => project_type === 'React',
  },
]);

const spinner = createSpinner('Creating files...\n').start();

try {
  await scaffold(project_type, react_task, app_name);
  spinner.success({ text: 'Done! 😃' });
} catch {
  spinner.error({ text: 'Something went wrong... 🙁' });
  process.exit(1);
}

function scaffold(projectType, reactTask = 0, appName = '') {
  return new Promise(async (res, rej) => {
    switch (projectType) {
      case 'Native':
        scaffoldNative();
        break;
      case 'Bootstrap 5':
        scaffoldBootstrap();
        break;
      case 'React':
        scaffoldReact(reactTask, appName);
        break;
      default:
        rej();
    }
    res();
  });
}

function scaffoldNative() {
  const fileList = ['index.html', 'index.js', 'style.css'];
  createFiles(fileList, rawTemplatesUrl + 'native');
}

function scaffoldBootstrap() {
  const fileList = ['index.html', 'style.css'];
  createFiles(fileList, rawTemplatesUrl + 'bootstrap');
}

function scaffoldReact(taskNumber, appName) {
  switch (taskNumber) {
    case 1:
      createFiles(['.gitignore'], rawTemplatesUrl + 'react/tast_1');
      break;
    case 2:
      runCreateReactApp(appName, true);
      break;
    case 3:
      console.log('test');
      break;
    default:
      throw new Error('Invalid taskNumber');
  }
}

function runCreateReactApp(appName, deleteSrc = false) {
  execSync(`npx create-react-app ${appName}`);
  if (deleteSrc) rimrafSync('src');
}

function createFiles(fileList, templateUrl) {
  fileList.forEach((fileName) => {
    execSync(`curl -O -s ${templateUrl}/${fileName}`);
  });
}
