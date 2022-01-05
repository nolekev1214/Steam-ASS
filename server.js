let convert = require('xml-js');
let axios = require('axios');
let http = require('http'); // Import Node.js core module
let fs = require('fs');
let nunjucks = require('nunjucks');

const louis = {
    steamID: "76561197995437185",
    username: "Louis",
    gameID: "457140",
    achievementName: "No Place Like Clone",
    avatar: "https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/avatars/98/98ca74f0dcbf9be38796f1fcd207f97e1be7dd71_medium.jpg",
};

const curtis = {
    steamID: "76561198090735778",
    username: "Curtis",
    gameID: "1145360",
    achievementName: "Harsh Conditions",
    avatar: "https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/avatars/c8/c8ae3cae045e634fc93586d26de4712e31d0b5fe_medium.jpg",
};

const george = {
    steamID: "76561198025187867",
    username: "George",
    gameID: "361420",
    achievementName: "Where We\'re Going, We Don\'t Need Roads",
    avatar: "https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/avatars/a6/a676a4f8afa8d75bd1d02a3d30ebe81d4e1b8de2_medium.jpg",
};

const justin = {
    steamID: "76561199092931293",
    username: "Justin",
    gameID: "397540",
    achievementName: "Got Big Game",
    avatar: "https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/avatars/e5/e533397dda7c375f14da359788b777261df3fae6_medium.jpg",
};

const robbie = {
    steamID: "76561198039901632",
    username: "Robbie",
    gameID: "1286350",
    achievementName: "Njord - Ruler of the Sea",
    avatar: "https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/avatars/c2/c266a30489d164a98c3fd5eaea16d84be7d85dd9_medium.jpg",
};

const kevin = {
    steamID: "76561198045936277",
    username: "Kevin",
    gameID: "646570",
    achievementName: "The End?",
    avatar: "https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/avatars/04/04e34a428ad7f5f3168c60174c8cecec5f11f809_medium.jpg",
};

let server = http.createServer(function (req, res) {   //create web server
    if (req.url == '/') { //check the URL of the current request
        
        // set response header
        res.writeHead(200, { 'Content-Type': 'text/html' }); 
        
        let tableEntry = extractAchievementInfo(louis);
        let tableEntry2 = extractAchievementInfo(curtis);
        let tableEntry3 = extractAchievementInfo(george);
        let tableEntry4 = extractAchievementInfo(justin);
        let tableEntry5 = extractAchievementInfo(robbie);
        let tableEntry6 = extractAchievementInfo(kevin);
        Promise.all([tableEntry2, tableEntry, tableEntry3, tableEntry4, tableEntry5, tableEntry6])
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

async function extractAchievementInfo(input){
    let response = await axios.get(`https://steamcommunity.com/profiles/${input.steamID}/stats/${input.gameID}/?xml=1`);
    if(response.status === 200){
        const xml = response.data;
        let steamProfile = convert.xml2js(xml);
        let achievements = steamProfile.elements[0].elements[5].elements;
        
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
