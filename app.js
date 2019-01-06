// Using the GitHub API ( https://developer.github.com/v3 ), we ask that you build
// a Node.js app that displays info for the open pull requests in a GitHub repository. The
// interface can take whatever form you like and should accept a repository URL, for
// example https://github.com/hapijs/hapi. It should display a list of open pull requests
// along with the number of commits in that PR, the number of comments on the PR, and
// the user that opened it.

const inquirer = require("inquirer");
const gh = require("parse-github-url");
const https = require('https');

//a2679537e996c0c6a68d1cbb28e1e9a2d04efd56

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
            console.log("--------------------------------")
            //console.log(pullResp);
            pullResp.forEach(pull => {
                displayInfo(pull, getCommits(pull.commits_url), getComments(pull.comments_url));
            })
        });
    });
    request.end();
}

//GET /repos/:owner/:repo/pulls/:number/commits
const getCommits = (commitURL) => {
    let options = {
        host: 'api.github.com',
        path: `${commitURL}`,
        method: 'GET',
        headers: { 'user-agent': 'node.js' }
    };

    let numberOfCommits = 69;

    let request = https.request(options, function (response) {
        let body = [];

        response.on("data", function (chunk) {
            body += chunk.toString('utf8');
        });

        response.on("end", function () {
            let commitResp = JSON.parse(body);
            numberOfCommits = commitResp.length;
            console.log(`Commits: ${commitResp.length}`);
            return numberOfCommits;
        })
        return numberOfCommits;
    });
    request.end();
    return numberOfCommits;
}

//GET /repos/:owner/:repo/pulls/:number/comments
const getComments = (commentURL) => {

    let options = {
        host: 'api.github.com',
        path: `${commentURL}`,
        method: 'GET',
        headers: { 'user-agent': 'node.js' }
    };

    numberOfComments = 0;

    let request = https.request(options, function (response) {
        let body = [];

        response.on("data", function (chunk) {
            body += chunk.toString('utf8');
        });

        response.on("end", function () {
            let commentResp = JSON.parse(body);
            console.log(`Number of Comments: ${commentResp.length}`);
            numberOfComments = commentResp.length;
            return numberOfComments;
        })
        return numberOfComments;
    });
    request.end();
    return numberOfComments;
}

displayInfo = (pullArray, commits, comments) => {
    console.log("--------------------------")
    console.log(`Title: ${pullArray.title}`);
    console.log(`Number: ${pullArray.number}`);
    console.log(`Author: ${pullArray.user.login}`);
    console.log(`Number of Commits: ${commits}`);
    console.log(`Number of Comments on PR: ${comments}`)
    console.log("--------------------------")
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