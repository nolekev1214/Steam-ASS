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
    gameID: "PAYDAY2",
    achievementName: "Shotguns 101",
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

const josh = {
    steamID: "76561197971641101",
    username: "Josh",
    gameID: "782330",
    achievementName: "The Once and Future Slayer",
    avatar: "https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/avatars/a0/a088ed8f1718a6c52b77d62ae5c014ed118e4e8e_medium.jpg",
};

const cole = {
    steamID: "76561198065492697",
    username: "Cole",
    gameID: "383870",
    achievementName: "The Life and Times of Raccoon Carter",
    avatar: "https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/avatars/dd/ddfe5f81ae8e6ec26636946b38f524c56944918e_medium.jpg",
};

const steven = {
    steamID: "76561198008480788",
    username: "Steven",
    gameID: "1082710",
    achievementName: "Gamer",
    avatar: "https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/avatars/fe/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_medium.jpg",
};

const timothy = {
    steamID: "76561198432530735",
    username: "Timothy",
    gameID: "683320",
    achievementName: "Depression",
    avatar: "https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/avatars/a8/a8091fa7e1c73cf1289ef49f74e105e0c0f5562f_medium.jpg",
};

const keaton = {
    steamID: "76561198097528317",
    username: "Keaton",
    gameID: "368340",
    achievementName: "Pierce through the Heaven",
    avatar: "https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/avatars/fe/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_medium.jpg",
};

const chris = {
    steamID: "76561197993970827",
    username: "Chris",
    gameID: "250900",
    achievementName: "A Fetus in a Jar",
    avatar: "https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/avatars/88/88308ca51bfdc3cbf88ad39ac852d9c54375699f_medium.jpg",
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
        let tableEntry7 = extractAchievementInfo(josh);
        let tableEntry8 = extractAchievementInfo(cole);
        let tableEntry9 = extractAchievementInfo(steven);
        let tableEntry10 = extractAchievementInfo(timothy);
        let tableEntry11 = extractAchievementInfo(keaton);
        let tableEntry12 = extractAchievementInfo(chris);
        Promise.all([tableEntry, tableEntry2, tableEntry3, tableEntry4, tableEntry5, tableEntry6, tableEntry7, tableEntry8, tableEntry9, tableEntry10, tableEntry11, tableEntry12])
            .then((entries) => {
                let out = nunjucks.render('templates/main.njk', {gamers: entries});
                res.write(out);
                res.end();
            })
            .catch(error => console.log(error.message));
    }
    else
        res.end(`Invalid Request to ${req.url}`);

});

server.listen(8080); //6 - listen for any incoming requests

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
