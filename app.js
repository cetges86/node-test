// Using the GitHub API ( https://developer.github.com/v3 ), we ask that you build
// a Node.js app that displays info for the open pull requests in a GitHub repository. The
// interface can take whatever form you like and should accept a repository URL, for
// example https://github.com/hapijs/hapi. It should display a list of open pull requests
// along with the number of commits in that PR, the number of comments on the PR, and
// the user that opened it.

const inquirer = require("inquirer");
const gh = require("parse-github-url");
const https = require('https');

//sample reqURL : https://api.github.com/repos/octocat/Hello-World/pulls/1347",
//GET pull requests
const getPulls = (username) => {
    let options = {
        host: 'api.github.com',
        path: `/repos/${username}/pulls`,
        method: 'GET',
        headers: { 'user-agent': 'node.js' }
    };
    //API request
    let request = https.request(options, function (response) {
        let body = [];
        response.on("data", function (chunk) {
            body += chunk.toString('utf8');
        });

        response.on("end", function () {
            let pullResp = JSON.parse(body);
            console.log("Pull Requests for Repo")
            // pullResp.forEach(pull => {
            //     //getCommits(username, pull.number);
            //     //getComments(username, pull.number);
            //     console.log("-----------------------------")
            //     console.log(`Title: ${pull.title}`);
            //     console.log(`Number: ${pull.number}`);
            //     console.log(`Author: ${pull.user.login}`);
            //     console.log(`Body: ${pull.body}`);
            //     console.log("-----------------------------");
            // })
            pullResp.forEach(pull => {
                console.log(pull.comments_url);
                console.log(pull.commits_url);


            })    
        });
        
    });
    
    request.end();
    
}

//GET /repos/:owner/:repo/pulls/:number/commits
const getCommits = (username, number) => {
    let options = {
        host: 'api.github.com',
        path: `/repos/${username}/pulls/${number}/commits`,
        method: 'GET',
        headers: { 'user-agent': 'node.js' }
    };

    let request = https.request(options, function (response) {
        let body = [];

        response.on("data", function (chunk) {
            body += chunk.toString('utf8');
        });

        response.on("end", function () {
            let commitResp = JSON.parse(body);
            return commitResp.length;
        })
    });
    request.end();

}

//GET /repos/:owner/:repo/pulls/:number/comments
const getComments = (username, number) => {

    let options = {
        host: 'api.github.com',
        path: `/repos/${username}/pulls/${number}/comments`,
        method: 'GET',
        headers: { 'user-agent': 'node.js' }
    };

    let request = https.request(options, function (response) {
        let body = [];

        response.on("data", function (chunk) {
            body += chunk.toString('utf8');
        });

        response.on("end", function () {
            let commentResp = JSON.parse(body);
            console.log(commentResp);
            return commentResp.length;
        })
    });
    request.end();
}


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