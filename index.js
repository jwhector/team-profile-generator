const inquirer = require("inquirer");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const Manager = require("./lib/Manager");
const generateHtml = require('./util/generateHtml');
const fs = require('fs');

async function getEmployee(type) {
    let special;
    switch (type) {
        case 'Manager':
            special = 'manager\'s office number'
            break;
        case 'Engineer':
            special = 'engineer\'s GitHub username'
            break;
        case 'Intern':
            special = 'intern\'s school name'
            break;
        default:
            return;
    }

    const employee =  await inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: `Please enter the name of the ${type}:`
        },
        {
            type: 'input',
            name: 'id',
            message: `Please enter the ${type} ID:`
        },
        {
            type: 'input',
            name: 'email',
            message: `Please enter the ${type}\'s email address:`
        },
        {
            type: 'input',
            name: 'special',
            message: `Please enter the ${special}:`
        }
    ]);

    employee.type = type;

    return employee;
}

async function getTeamMember(team) {
    const newMember = await inquirer.prompt([
        {
            type: 'list',
            name: 'addMember',
            message: 'If you would like to expand your team, please select a member to add:',
            choices: ['Engineer', 'Intern', 'Finished']
        }
    ]);

    if (newMember.addMember !== 'Finished') {
        const employee = await getEmployee(newMember.addMember);

        if (newMember.addMember === 'Engineer') team.push(new Engineer(employee.name, employee.id, employee.email, employee.special));
        else team.push(new Intern(employee.name, employee.id, employee.email, employee.special));

        await getTeamMember(team);
    }
}

async function main() {
    const team = [];
    try {
        const manager = await getEmployee('Manager');
        team.push(new Manager(manager.name, manager.id, manager.email, manager.special));
        await getTeamMember(team);
        console.log(team);
        fs.writeFileSync('./dist/index.html', generateHtml(team));
    } catch (err) {
        console.error(err);
    }
    // generateHtml(team);
}

main();