const inquirer = require("inquirer");
const gh = require("parse-github-url");
const rp = require('request-promise');

async function getPulls(username) {
    try {
        const res = await rp({
            url: `https://api.github.com/repos/${username}/pulls`,
            method: 'GET',
            headers: {
                'User-Agent': 'Request-Promise'
            },
            json: true
        });

        for (i = 0; i < res.length; i++) {
            
            rp({
                url: res[i].commits_url,
                method: 'GET',
                headers: {
                    'User-Agent': 'Request-Promise'
                },
                json: true
            }).then(function (commits) {
                return commits.length;
            })


            rp({
                url: res[i].comments_url,
                method: 'GET',
                headers: {
                    'User-Agent': 'Request-Promise'
                },
                json: true
            }).then(function (comments) {
                return comments.length;
            })

            console.log('--------------------------')
            console.log(`Title: ${res[i].title}`);
            console.log(`Number: ${res[i].number}`);
            console.log(`Author: ${res[i].user.login}`);
            console.log('Comments: ' + comments.length);
            console.log('Commits: ' + commits.length);
            console.log('--------------------------');
        }

    } catch (err) {
        console.log(err);
    }

};

inquirer.prompt([
    {
        type: "input",
        message: "What url would you like to view?",
        name: "repoURL"
    }
])
    .then(function (res) {
        let ghURL = gh(res.repoURL);
        let username = ghURL.path;

        getPulls(username);
    })