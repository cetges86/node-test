const inquirer = require('inquirer');
const gh = require('parse-github-url');
const rp = require('request-promise');

async function getPulls(username) {
    try {
        const res = await rp({
            url: `https://api.github.com/repos/${username}/pulls`,
            method: 'GET',
            headers: { 'User-Agent': 'Request-Promise' },
            json: true
        });

        for (i = 0; i < res.length; i++) {

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

inquirer.prompt([
    {
        type: 'input',
        message: 'What url would you like to view?',
        name: 'repoURL'
    }
]).then(function (res) {
    let ghURL = gh(res.repoURL);
    let username = ghURL.path;

    getPulls(username);
});