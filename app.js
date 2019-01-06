//Chris Etges

const inquirer = require('inquirer');
const gh = require('parse-github-url');
const rp = require('request-promise');

async function getPulls(urlPath) {
    try {
        //initial API call for repo information, using request promises
        const res = await rp({
            url: `https://api.github.com/repos/${urlPath}/pulls`,
            method: 'GET',
            headers: { 'User-Agent': 'Request-Promise' },
            json: true
        });

        console.log(`${res.length} Open Pull Requests`);

        //looping through the results JSON for commit and comment calls
        for (i = 0; i < res.length; i++) {

            //async promises, length to determine number of commits/comments
            const commitCount = (await rp({
                url: res[i].commits_url,
                method: 'GET',
                headers: { 'User-Agent': 'Request-Promise' },
                json: true
            })).length;

            const commentCount = (await rp({
                url: res[i].comments_url,
                method: 'GET',
                headers: { 'User-Agent': 'Request-Promise' },
                json: true
            })).length;

            console.log('--------------------------');
            console.log(`Title: ${res[i].title}`);
            console.log(`Number: ${res[i].number}`);
            console.log(`Author: ${res[i].user.login}`);
            console.log(`Commits: ${commitCount}`);
            console.log(`Comments: ${commentCount}`);
            console.log('--------------------------');
        }
    } catch (err) {
        console.log(err);
    };
};

//CLI prompt
inquirer.prompt([
    {
        type: 'input',
        message: 'What url would you like to view?',
        name: 'repoURL'
    }
    //gh package parses inputted github URL for username and repo name, then calls async function 
]).then(function (res) { getPulls(gh(res.repoURL).path) });