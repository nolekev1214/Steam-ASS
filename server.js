let convert = require('xml-js');
let axios = require('axios');
let http = require('http');
let fs = require('fs');
let nunjucks = require('nunjucks');
let members = require("./members.json");

let server = http.createServer(function (req, res) {
    if (req.url == '/') {
        res.writeHead(200, { 'Content-Type': 'text/html' }); 
        
        let promiseTable = [];
        members.forEach(function(member) {
            promiseTable.push(extractAchievementInfo(member));
        });

        Promise.all(promiseTable)
            .then((entries) => {
                let out = nunjucks.render('templates/main.njk', {gamers: entries});
                res.write(out);
                res.end();
            })
            .catch(error => console.log(error.message));
    }
    else if(req.url == '/2021'){
        res.writeHead(302, { location: "/static/2021.html" });
        res.end();
    }
    else{
        fs.readFile(__dirname + req.url, function(err, data){
            if(err){
                res.writeHead(404);
                res.end(`Invalid Request to ${req.url}`);
            }
            res.writeHead(200);
            res.end(data);
        });
    }
});

server.listen(process.env.PORT); //Run on Google Cloud
//server.listen(8080); //Run Locally
//console.log('Node.js web server at port 8080 is running..');

async function extractAchievementInfo(input){
    let response = await axios.get(`https://steamcommunity.com/profiles/${input.steamID}/stats/${input.gameID}/?xml=1`);
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
    
    if(response.status === 200){
        const xml = response.data;
        let steamProfile = convert.xml2js(xml);
        let achievements = steamProfile.elements[0].elements[5].elements;
        
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
        if(out.complete == 0)
            out.complete = false;
        if(out.complete == 1)
            out.complete = true;
    } else {
        out.description = "Failed to access steam";
    }
    return out;
}
