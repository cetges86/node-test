// Using the GitHub API ( https://developer.github.com/v3 ), we ask that you build
// a Node.js app that displays info for the open pull requests in a GitHub repository. The
// interface can take whatever form you like and should accept a repository URL, for
// example https://github.com/hapijs/hapi. It should display a list of open pull requests
// along with the number of commits in that PR, the number of comments on the PR, and
// the user that opened it.

const inquirer = require("inquirer");
const gh = require("parse-github-url");


inquirer.prompt([
    {
        type:"input",
        message:"What url would you like to view?",
        name:"repoURL"
    }
])
.then(function(res) {
    console.log(res.repoURL);
    let newURL = gh(res.repoURL);
    console.log(newURL);
    //API request
    //sample reqURL : https://api.github.com/repos/octocat/Hello-World/pulls/1347",

})