let convert = require('xml-js');
let axios = require('axios');
let http = require('http'); // Import Node.js core module
let fs = require('fs');
let nunjucks = require('nunjucks');

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
        
        let tableEntry = extractAchievementInfo(kevin);
        let tableEntry2 = extractAchievementInfo(pulkit);
        let tableEntry3 = extractAchievementInfo(aj)
        let tableEntry4 = extractAchievementInfo(kevin2);
        Promise.all([tableEntry2, tableEntry3, tableEntry, tableEntry4])
            .then((entries) => {
                let out = nunjucks.render('templates/main.njk', {gamers: entries});
                res.write(out);
                res.end();
            });
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
        if(out.complete == 0)
            out.complete = false;
        if(out.complete == 1)
            out.complete = true;
        return out;
    }

}