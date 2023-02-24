#!/usr/bin/env node

// Inspired by: https://www.youtube.com/watch?v=_oHByo8tiEY&ab_channel=Fireship

import chalk from 'chalk';
import inquirer from 'inquirer';
import fs from 'fs';
import path from 'path';
import { createSpinner } from 'nanospinner';

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

const spinner = createSpinner('Creating files');
spinner.start();

const createFiles = (project_type) => {
  return new Promise((res, rej) => {
    switch (project_type) {
      case 'Native':
        break;
      default:
        rej();
    }
    res();
  });
};

try {
  await createFiles(project_type);
  spinner.success({ text: 'Done! 😃' });
} catch {
  spinner.error({ text: 'Something went wrong... 🙁' });
  process.exit(1);
}

// console.log(project_type);
