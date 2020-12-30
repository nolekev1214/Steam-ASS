let convert = require('xml-js');
let axios = require('axios');
let http = require('http'); // Import Node.js core module
let fs = require('fs');

const kevin = {
    steamID: "76561198045936277",
    username: "Kevin",
    gameID: "378860",
    achievementName: "Manual All The Way",
    avatar: "https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/avatars/04/04e34a428ad7f5f3168c60174c8cecec5f11f809_medium.jpg",
};
const kevin2 = {
    steamID: "76561198045936277",
    username: "Kevin",
    gameID: "378860",
    achievementName: "No Man's Fly",
    avatar: "https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/avatars/04/04e34a428ad7f5f3168c60174c8cecec5f11f809_medium.jpg",
};
const pulkit = {
    steamID: "76561198245431724",
    username: "Pulkit",
    gameID: "413150",
    achievementName: "Local Legend",
    avatar: "https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/avatars/90/904077ede20da3e813726acbebb50d60049ba360_medium.jpg",
};
const aj = {
    steamID: "76561198253719597",
    username: "AJ",
    gameID: "648350",
    achievementName: "Veggiesaurus",
    avatar: "https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/avatars/fe/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_medium.jpg",
};

let server = http.createServer(function (req, res) {   //create web server
    if (req.url == '/') { //check the URL of the current request
        
        // set response header
        res.writeHead(200, { 'Content-Type': 'text/html' }); 
        
        // set response content    
        { //Block to hide boilerplate bullshit
        res.write(`<html lang="en">
<head>
	<title>Steam A.S.S.</title>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
<!--===============================================================================================-->
	<link rel="stylesheet" type="text/css" href="vendor/bootstrap/css/bootstrap.min.css">
<!--===============================================================================================-->
	<link rel="stylesheet" type="text/css" href="fonts/font-awesome-4.7.0/css/font-awesome.min.css">
<!--===============================================================================================-->
	<link rel="stylesheet" type="text/css" href="vendor/animate/animate.css">
<!--===============================================================================================-->
	<link rel="stylesheet" type="text/css" href="vendor/select2/select2.min.css">
<!--===============================================================================================-->
	<link rel="stylesheet" type="text/css" href="css/util.css">
	<link rel="stylesheet" type="text/css" href="css/main.css">
<!--===============================================================================================-->
</head>
<body>
	
	<div class="limiter">
		<div class="container-table100">
			<div class="wrap-table100">
            <h1 style="color:white;font-size:50px;font-family: comic sans ms;text-align:center">Steam Achievement Secret Santa</h1><br>
				<div class="table100">
					<table>
						<thead>
							<tr class="table100-head">
								<th class="column1">User</th>
								<th class="column2">Game</th>
								<th class="column3">Achievement</th>
								<th class="column4"> </th>
							</tr>
						</thead>
						<tbody>`);
        }
        
        let tableEntry = extractAchievementInfo(kevin);
        let tableEntry2 = extractAchievementInfo(pulkit);
        let tableEntry3 = extractAchievementInfo(aj)
        let tableEntry4 = extractAchievementInfo(kevin2);
        Promise.all([tableEntry2, tableEntry3, tableEntry, tableEntry4])
            .then((entries) => {
                entries.forEach((entry) => {
                    if(entry.complete == 1){
                        res.write(`
                            <tr class="complete" onClick="document.location.href='https://steamcommunity.com/profiles/${entry.steamID}/stats/${entry.gameID}'">
                                <td class="column1">
                                    <br>
                                    <img src="${entry.avatar}" alt="" />
                                    <br> ${entry.username} <br><br>
                                </td>
                                <td class="column2">
                                    <br>
                                    <img src="${entry.gameIcon}" />
                                    <br> ${entry.gameName} <br><br>
                                </td>
                                <td class="column3">
                                    <br>
                                    <img src="${entry.iconComplete}" />
                                    <br><br>
                                </td>
                                <td class="column4">
                                    <b>${entry.name}</b><br>
                                    ${entry.description}
                                </td>
                            </tr>
                        `);
                    } else {
                        res.write(`
                            <tr onClick="document.location.href='https://steamcommunity.com/profiles/${entry.steamID}/stats/${entry.gameID}'">
                                <td class="column1">
                                    <br>
                                    <img src="${entry.avatar}" alt="" />
                                    <br> ${entry.username} <br><br>
                                </td>
                                <td class="column2">
                                    <br>
                                    <img src="${entry.gameIcon}" />
                                    <br> ${entry.gameName} <br><br>
                                </td>
                                <td class="column3">
                                    <br>
                                    <img src="${entry.iconIncomplete}" />
                                    <br><br>
                                </td>
                                <td class="column4">
                                    <b>${entry.name}</b><br>
                                    ${entry.description}
                                </td>
                            </tr>
                        `);
                    }
                });
                
            }).then(() => {
                res.write(`</tbody></table></div></div></div></div></body></html>`);
                res.end();
            });
    
    } else if (req.url == '/css/main.css') {
        let fileStream = fs.createReadStream("./css/main.css");
        res.writeHead(200, { 'Content-Type': 'text/css' });
        fileStream.pipe(res)
    } else if (req.url == '/css/util.css') {
        let fileStream = fs.createReadStream("./css/util.css");
        res.writeHead(200, { 'Content-Type': 'text/css' });
        fileStream.pipe(res)
    } else if (req.url == '/vendor/animate/animate.css') {
        let fileStream = fs.createReadStream("./vendor/animate/animate.css");
        res.writeHead(200, { 'Content-Type': 'text/css' });
        fileStream.pipe(res)
    } else if (req.url == '/vendor/bootstrap/css/bootstrap.min.css') {
        let fileStream = fs.createReadStream("./vendor/bootstrap/css/bootstrap.min.css");
        res.writeHead(200, { 'Content-Type': 'text/css' });
        fileStream.pipe(res)
    } else if (req.url == '/vendor/select2/select2.min.css') {
        let fileStream = fs.createReadStream("./vendor/select2/select2.min.css");
        res.writeHead(200, { 'Content-Type': 'text/css' });
        fileStream.pipe(res)
    } else if (req.url == '/fonts/OpenSans/OpenSans-Regular.ttf') {
        let fileStream = fs.createReadStream("./fonts/OpenSans/OpenSans-Regular.ttf");
        res.writeHead(200, { 'Content-Type': 'font/ttf' });
        fileStream.pipe(res)
    } else if (req.url == '/images/icons/favicon.ico') {
        let fileStream = fs.createReadStream("./images/icons/favicon.ico");
        res.writeHead(200, { 'Content-Type': 'image/png' });
        fileStream.pipe(res)
    } else if (req.url == '/favicon.ico') {
        let fileStream = fs.createReadStream("./images/icons/favicon.ico");
        res.writeHead(200, { 'Content-Type': 'image/x-icon' });
        fileStream.pipe(res)
    }
    else
        res.end(`Invalid Request to ${req.url}`);

});

server.listen(8080); //6 - listen for any incoming requests

console.log('Node.js web server at port 8080 is running..')

async function extractAchievementInfo(input){
    let response = await axios.get(`https://steamcommunity.com/profiles/${input.steamID}/stats/${input.gameID}/?xml=1`);
    if(response.status === 200){
        const xml = response.data;
        let steamProfile = convert.xml2js(xml);
        //console.log(JSON.stringify(steamProfile));
        //console.log(`https://steamcommunity.com/id/${input.steamID}/stats/${input.gameID}/?xml=1`);
        let achievements = steamProfile.elements[0].elements[5].elements;
        //console.log(achievements);
        
        let out = {
            complete: 0,
            iconComplete: "",
            iconIncomplete: "",
            name: "",
            description : "",
            gameIcon: "",
            gameName: "",
            username: "",
            avatar: "",
            steamID: "",
            gameID: ""
        }
        
        achievements.forEach(achievement => {
            //console.log(achievement.elements[2].elements[0].cdata);
            //console.log(achievement.elements[2].elements[0].cdata == input.achievementName);
            if(achievement.elements[2].elements[0].cdata == input.achievementName){
                //console.log("Acheivement found");
                out.complete = achievement.attributes.closed;
                out.iconComplete = achievement.elements[0].elements[0].cdata;
                out.iconIncomplete = achievement.elements[1].elements[0].cdata;
                out.name = input.achievementName;
                out.description = achievement.elements[4].elements[0].cdata;
                out.gameIcon = steamProfile.elements[0].elements[2].elements[4].elements[0].cdata;
                out.gameName = steamProfile.elements[0].elements[2].elements[1].elements[0].cdata;
                out.username = input.username;
                out.avatar = input.avatar;
                out.steamID = input.steamID;
                out.gameID = input.gameID;
            }
        });
        return out;
    }

}