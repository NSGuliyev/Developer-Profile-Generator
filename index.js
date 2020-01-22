const inquirer = require("inquirer");
const fs = require("fs");
const axios = require("axios");
// var pdf = require('html-pdf');
// var options = { format: 'Letter' };
const puppeteer = require("puppeteer");
let stars = 0;



function promptUser() {
  return inquirer.prompt([
    {
      type: "input",
      name: "color",
      message: "What is your favorite color?"
    },
    {
      type: "input",
      name: "GitHub",
      message: "What is your GitHub userName?"
    }
  ]).then((answers) => {
    console.log(answers);

    axios
      .get(`https://api.github.com/users/${answers.GitHub}`)
      .then(function (res) {
        // console.log(res.data);


        axios
          .get(`https://api.github.com/users/${answers.GitHub}/repos?per_page=100`)
          .then(function (rese) {
            let data = rese.data;
            for (let i = 0; i < data.length; i++) { stars = stars + data[i].stargazers_count }
            var html = generateHtml(res.data, answers.color);
            console.log(html);





            // fs.writeFile("test.html", html, function (err) {
            //   if (err) throw err;
            //   console.log("HTML is created !");
            // })
            // pdf.create(html, options).toFile('./Profile.pdf', function(err, res) {
            //   if (err) return console.log(err);
            //   console.log(res); // { filename: '/app/businesscard.pdf' }
            // });
            (async function () {
              try {
                const browser = await puppeteer.launch();
                const page = await browser.newPage();
                await page.setContent(html);
                await page.emulateMedia('screen');
                await page.pdf({ path: 'Profile.pdf', format: 'A4', printBackground: true });
                await browser.close();
                console.log('PDF file has been generated using Puppeteer!!!!');
                process.exit();

              } catch (err) {

                console.log(err);

              }
            })();
          });
      });
  });
}

promptUser()
// Prompt the user
// Use input and make axios call 
// Take response data and generate HTML
// Convert HTML to PDF 








function generateHtml(data, color) {
  console.log(data);
  return `
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Document</title>
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css"
    integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">
  <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.6.1/css/all.css">
  <script src="https://use.fontawesome.com/3e8119eec5.js"></script>
  <style>
  body {
    background: ${color}

  }


    .container {
      width: 50%;
      margin: auto;
    }

    .space {
      margin-top: 50px;
    }

    h3 {
      text-align: center;
    }
  </style>
</head>

<body>
  <div class="jumbotron">
    <div class="row justify-content-center"><img id="picture"
        src="${data.avatar_url}">
    </div>
    <div class="row justify-content-center">
      <h1>Hi!</h1>
    </div>
    <div class="row justify-content-center">
      <h2>My Name is ${data.name} !</h2>
    </div>
    <div class="row justify-content-center">
      <h5>Curretntly I'm @ ${data.company}</h5>
    </div>
    <div class="row justify-content-center">
      <nav class="nav">
        <a class="nav-link active" href="https://www.google.com/maps/search/?api=1&query=${data.location}G"><i class="fas fa-location-arrow fa-lg white-text mr-md- mr- fa-1x"></i>${data.location}</a>
        <a class="nav-link" href="${data.html_url}"><i class="fab fa-github fa-lg white-text mr-md- mr- fa-1x"></i> GitHub</a>
        <a class="nav-link" href="#"><i class="fas fa-rss fa-lg white-text mr-md- mr- fa-1x"></i> Blog</a>
      </nav>
    </div>
  </div>
  <div class="container">
    <div class="row justify-content-center">
      <h3>I like coding</h3>
    </div>
    <div class="row space">
      <div class="col-sm-6 ">
        <h3>Public Repositories</h3>
        <h3>${data.public_repos}</h3>
      </div>
      <div class="col-sm-6">
        <h3>Followers</h3>
        <h3>${data.followers}</h3>
      </div>
    </div>
    <div class="row space">
      <div class="col-sm-6">
        <h3>Github Stars</h3>
        <h3>${stars}</h3>
      </div>
      <div class="col-sm-6">
        <h3>Following</h3>
        <h3>${data.following}</h3>
      </div>
    </div>
  </div>
</body>

</html>
`};