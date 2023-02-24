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

console.log(chalk.green.bold('Welcome!'));
console.log(
  chalk.green.bold(
    'This is a scaffolding tool for ICS 314 assignments and WODs.\n'
  )
);

const answer = await inquirer.prompt([
  {
    type: 'list',
    name: 'project_type',
    message: 'What kind of project are you making?',
    default: 'Native',
    choices: ['Native', 'Bootstrap 5', 'React'],
  },
]);

const { project_type } = answer;

const spinner = createSpinner('Creating files...\n').start();

try {
  await createFiles(project_type);
  spinner.success({ text: 'Done! 😃' });
} catch {
  spinner.error({ text: 'Something went wrong... 🙁' });
  process.exit(1);
}

function createFiles(project_type) {
  return new Promise((res, rej) => {
    try {
      const templateUrl = getTemplateUrl(project_type);
      const fileList = getFileList(project_type);
      fileList.forEach((fileName) => {
        execSync(`curl -O -s ${templateUrl}/${fileName}`);
      });
      res();
    } catch {
      rej();
    }
  });
}

function getTemplateUrl(project_type) {
  let url =
    'https://raw.githubusercontent.com/winstonco/scaffold-314/main/templates/';
  switch (project_type) {
    case 'Native':
      url += 'native';
      break;
    case 'Bootstrap 5':
      url += 'bootstrap';
      break;
  }
  return url;
}

function getFileList(project_type) {
  let fileList = [];
  switch (project_type) {
    case 'Native':
      fileList = ['index.html', 'index.js', 'style.css'];
      break;
    case 'Bootstrap 5':
      fileList = ['index.html', 'style.css'];
      break;
  }
  return fileList;
}
