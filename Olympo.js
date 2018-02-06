const Discord = require('discord.js');
const olympo = require('./OlympoAPI');
const request = require('request-promise');
const cheerio = require('cheerio');
const webshot = require('webshot');
const armoryUrl = "http://www.olympowow.com/web/character/1/";
const fs = require("fs");
const trivial = require("./trivial");


let serversPlayingTrivial = [];
let trivialGameStatus = [];

const client = new Discord.Client();
client.on("ready", () => {
    console.log("Jenkins is Running 2.0");
    client.user.setActivity("Pídeme !ayuda");
});
client.login(process.env.BOT_TOKEN);

// Jenkins: MjY4MTA5NjQ0MTA5NDQ3MTY5.DUPfeA.5d4JKPeWhv_1KnXA-I8ihOOWm0w
// Olympo: MzgwNzgyNzA4OTg2NjA5Njgx.DRLp-g.8Kn9VYBaKPviTAu8ICY4GwGUDe4
// process.env.BOT_TOKEN



client.on('message', mes => {
    let message = mes.content;
    if(mes.author.username !== "Olympo"){
        fs.appendFile("log.txt", mes.member.guild.name+" ("+mes.channel.name+") --- "+mes.author.username+": "+message+"\n");
    }



    function messageToChannel(msg){
        if(msg.length >= 2000){
            msg = splitter(msg, 2000);
            for(i in msg){
                mes.channel.send(msg[i]);
            }
        }
        else{
            mes.channel.send(msg);
        }
    }

    async function uploadFile(src){
        await mes.channel.send("", {
            file: src
        }).then(success => {console.log("imagen enviada")}, error => {console.log("error")});
    }


    if(message === "!trivial start"){
        if(!isPlayingTrivial(mes.channel.guild.id)){
            startTrivialGame(mes.channel.guild.id, true);
        }
        console.log(serversPlayingTrivial);

    }

    if(message === "!ranking yo"){
        let json = getScoresJSON();
        for(let i = 0; i < Object.keys(json).length; i++){
            if(json[i].userID === mes.author.id){
                messageToChannel(mes.author.username+", tienes "+json[i].puntos+" puntos.");
                return 0;
            }
        }
        messageToChannel(mes.author.username+", tienes 0 puntos. Intenta acertar alguna pregunta! ;P");
    }

    if(message === "!ranking"){
        let json = getScoresJSON();
        let array = [];
        let rankingString = "**Ranking global:**\n\n";
        let cont = 1;
        let cont2 = 1;
        for(let i = 0; i < Object.keys(json).length; i++){
            array.push(json[i]);
        }
        array.sort(GetSortOrder("puntos"));
        for(let item in array){
            if(cont === 1){
                rankingString += ":first_place: 1. ";
            }
            else if(cont === 2){
                rankingString += ":second_place: 2. ";
            }
            else if(cont === 3){
                rankingString += ":third_place: 3. ";
            }
            else if(cont === 4){
                rankingString += "4. ";
            }
            else if(cont === 5){
                rankingString += "5. ";
            }
            else if(cont === 6){
                rankingString += "6. ";
            }
            else if(cont === 7){
                rankingString += "7. ";
            }
            else if(cont === 8){
                rankingString += "8. ";
            }
            else if(cont === 9){
                rankingString += "9. ";
            }
            else if(cont === 10){
                rankingString += "10. ";
            }
            else if(cont > 10){
                break;
            }
            rankingString += "**"+array[item].nombre+"** ("+array[item].serverName+"): "+""+array[item].puntos+" puntos.\n";
            cont++;
        }
        rankingString += "\n\n\n**Ranking del servidor:**\n\n";
        for(let item in array){
            if(cont2 === 1){
                rankingString += ":first_place: 1. ";
            }
            else if(cont2 === 2){
                rankingString += ":second_place: 2. ";
            }
            else if(cont2 === 3){
                rankingString += ":third_place: 3. ";
            }
            else if(cont2 === 4){
                rankingString += "4. ";
            }
            else if(cont2 === 5){
                rankingString += "5. ";
            }
            else if(cont2 === 6){
                rankingString += "6. ";
            }
            else if(cont2 === 7){
                rankingString += "7. ";
            }
            else if(cont2 === 8){
                rankingString += "8. ";
            }
            else if(cont2 === 9){
                rankingString += "9. ";
            }
            else if(cont2 === 10){
                rankingString += "10. ";
            }
            else if(cont2 > 10){
                break;
            }
            if(mes.channel.guild.id === array[item].serverID){
                rankingString += "**"+array[item].nombre+"** ("+array[item].serverName+"): "+""+array[item].puntos+" puntos.\n";
                cont2++;
            }
        }
        messageToChannel(rankingString);
    }

    if(message === "!trivial stop"){
        if(isPlayingTrivial(mes.channel.guild.id, serversPlayingTrivial)){
            messageToChannel("Partida terminada. :mobile_phone_off: ");
            clearTimeout(serversPlayingTrivial[getIndexByID(mes.channel.guild.id, serversPlayingTrivial)][4]);
            clearTimeout(serversPlayingTrivial[getIndexByID(mes.channel.guild.id, serversPlayingTrivial)][5]);
            clearTimeout(serversPlayingTrivial[getIndexByID(mes.channel.guild.id, serversPlayingTrivial)][6]);
            serversPlayingTrivial.splice(getIndexByID(mes.channel.guild.id, 1));
        }
    }

    if((isPlayingTrivial(mes.channel.guild.id)) && (message === serversPlayingTrivial[getIndexByID(mes.channel.guild.id, serversPlayingTrivial)][2])){
        console.log(serversPlayingTrivial[getIndexByID(mes.channel.guild.id, serversPlayingTrivial)][7]);
        if(serversPlayingTrivial[getIndexByID(mes.channel.guild.id, serversPlayingTrivial)][7] === false){
            clearTimeout(serversPlayingTrivial[getIndexByID(mes.channel.guild.id, serversPlayingTrivial)][4]);
            clearTimeout(serversPlayingTrivial[getIndexByID(mes.channel.guild.id, serversPlayingTrivial)][5]);
            clearTimeout(serversPlayingTrivial[getIndexByID(mes.channel.guild.id, serversPlayingTrivial)][6]);
            serversPlayingTrivial[getIndexByID(mes.channel.guild.id, serversPlayingTrivial)][7] = true;
            messageToChannel("¡Correcto! "+mes.author.username+" ha acertado. La respuesta era: "+message+". +"+ serversPlayingTrivial[getIndexByID(mes.channel.guild.id, serversPlayingTrivial)][8]+" puntos!");
            addScore(mes.author.username, serversPlayingTrivial[getIndexByID(mes.channel.guild.id, serversPlayingTrivial)][8], mes.channel.guild.id, mes.member.guild.name, mes.author.id);
            startTrivialGame(mes.channel.guild.id, false);
        }
    }





    if(message === "ping"){
        messageToChannel("pong");
    }

//     if(message === "vete"){
//         client.destroy();
//     }

    if (message.startsWith("!lyrics")) {
        // !lyrics "author" "song"
        let q = 0;
        let author = "";
        let song = "";
        for (let n = 0; n < message.length; n++) {
            if (message[n] === '"') {
                q++;
            }
            if (q === 1) {
                author += message[n];
            }
            if (q === 3) {
                song += message[n];
            }
        }
        while (author.charAt(0) === '"') {
            author = author.substr(1);
        }
        while (song.charAt(0) === '"') {
            song = song.substr(1);
        }
        request({
            uri: "https://makeitpersonal.co/lyrics?artist=" + author + "&title=" + song
        }, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                let string = "```Letra de la cancion " + song + " de " + author + ".```";
                messageToChannel(body.toString());
            }
        })
    }


    if (message === "!roll") {
        function randomIntFromInterval(min, max) {
            return Math.floor(Math.random() * (max - min + 1) + min);
        }
        let num = randomIntFromInterval(1, 100);
        let text = "```xl\n";
        text += mes.author.username + " rolls " + num + " (1-100)\n```";
        messageToChannel(text);
    }


    if (message === "!ayuda") {
        let helpString = "Lista de comandos:\n\n**Específicos de Olympo:**\n\n`!pj personaje`: muestra la información básica del personaje.\n";
        helpString += "`!inventario personaje`: muestra el inventario del personaje\n";
        helpString += "`!talentos personaje`: muestra los talentos del personaje\n";
        helpString += "`!profesiones personaje`: muestra las profesiones del personaje\n";
        helpString += "`!online personaje`: comprueba si el personaje se encuentra conectado al servidor\n";
        helpString += "`!online`: muestra el número de personajes conectados al servidor\n\n***Ejemplo de uso: !pj Supersacerdote*** (sin comillas)\n\n\n**Generales:**\n\n";
        helpString += '`!roll`: tira un dado del 1 al 100\n`!lyrics "autor" "cancion"`: muestra la letra de la canción (utilizar comillas dobles)\n\n\n';
        helpString += '**Trivial:**\n\n`!trivial start`: empieza una nueva partida\n`!trivial stop`: termina la partida en curso\n`!ranking`: muestra la clasificación de los jugadores';
        helpString += '\n`!ranking yo`: muestra la puntuación del jugador que ha escrito el mensaje';
        messageToChannel(helpString);
    }


    if(message.startsWith("!talentos")){
        let name = message.split(" ")[1];
        showTalentTree(name).then(success => {}, error => {});
    }

    if(message.startsWith("!profesiones")){
        let name = message.split(" ")[1];
        showProfessions(name).then(success =>{}, error => {})
    }


    if (message.startsWith("!pj")) {
        let name = message.split(" ")[1];
        let character;
        async function showInfoCharacter() {
            messageToChannel("```Cargando información de " + name.charAt(0).toUpperCase() + name.slice(1) + "...```");
            return await olympo.getCharacter(name);
        }
        if(message === "!pj"){
            messageToChannel("Especifica un personaje. *Sintaxis: !pj NombrePersonaje*");
        }
        showInfoCharacter().then(success => {
            character = success;
            let characterString = "";
            characterString += "__**"+character.name+" <"+character.guild+ "> - "+ character.race+" "+character.class+" nivel "+character.level+"**__\n\n";
            characterString += "Vida: "+character.health+" HP\nMana: "+character.mana+"\n\n\n";
            characterString += "**Atributos principales:**\n- Fuerza: "+character.stats.general.strength+"\n- Aguante: "+character.stats.general.stamina+"\n";
            characterString += "- Intelecto: "+character.stats.general.intellect+"\n- Espíritu: "+character.stats.general.spirit+"\n- Poder con hechizos: "+character.stats.general.spellPower+"\n";
            characterString += "- Poder de ataque: "+character.stats.general.attPower+"\n\n**Atributos de defensa:**\n- Temple: "+character.stats.general.resilience+"\n";
            characterString += "- Armadura: "+character.stats.general.armor+"\n- Bloqueo: "+character.stats.general.block+"\n- Esquive: "+character.stats.general.dodge+"\n";
            characterString += "- Parada: "+character.stats.general.parry+"\n\n**Críticos:**\n- Índice de golpe crítico melée: "+character.stats.general.meleeCrit+"\n";
            characterString += "- Índice de golpe crítico a distancia: "+character.stats.general.rangedCrit+"\n- Índice de golpe crítico con hechizos: "+character.stats.general.spellCrit+"\n\n";
            characterString += "**Jugador contra jugador**\n- Muertes totales: "+character.stats.pvp.totalKills+"\n- Puntos de honor: "+character.stats.pvp.honorPoints+"\n- Puntos de arena: ";
            characterString += character.stats.pvp.arenaPoints;
            messageToChannel(characterString);
        });
    }

    if (message.startsWith("!inventario")){
        let name = message.split(" ")[1];
        let inventory;
        async function showInfoInventory() {
            messageToChannel("```Cargando inventario de " + name.charAt(0).toUpperCase() + name.slice(1) + "...```");
            return await olympo.getInventory(name);
        }
        if(message === "!inventario"){
            messageToChannel("Especifica un personaje. *Sintaxis: !inventario NombrePersonaje*");
        }
        showInfoInventory().then(success =>{
            inventory = success;
            let inventoryString = "";
            inventoryString += "__**Inventario de "+name.charAt(0).toUpperCase() + name.slice(1)+":**__\n\n";
            inventoryString += "**- Cabeza:** "+inventory.head.name+"\n**- Cuello:** "+inventory.neck.name+"\n**- Hombros:** ";
            inventoryString += inventory.shoulder.name+"\n**- Espalda:** "+inventory.back.name+"\n**- Pecho:** "+inventory.robe.name;
            inventoryString += "\n**- Camisa:** "+inventory.shirt.name+"\n**- Tabardo:** "+inventory.tabard.name+"\n**- Muñecas:** ";
            inventoryString += inventory.wrists.name+"\n**- Manos:** "+inventory.hands.name+"\n**- Cintura:** "+inventory.waist.name;
            inventoryString += "\n**- Piernas:** "+inventory.legs.name+"\n**- Pies:** "+inventory.feet.name+"\n**- Anillo 1:** ";
            inventoryString += inventory.finger1.name+"\n**- Anillo 2:** "+inventory.finger2.name+"\n**- Abalorio 1:** ";
            inventoryString += inventory.trinket1.name+"**\n- Abalorio 2:** "+inventory.trinket2.name+"**\n- Mano derecha:** ";
            inventoryString += inventory.mainHand.name+"**\n- Mano izquierda:** "+inventory.holdable.name+"**\n- Reliquia:** ";
            inventoryString += inventory.relicOrRanged.name;
            messageToChannel(inventoryString);
        }, error =>{
            console.log(error);
            messageToChannel("Ha habido un error al procesar la consulta del inventario.")
        });
    }



    if (message.startsWith("!online")) {
        let name = message.split(" ")[1];
        if(message === "!online"){
            olympo.getOnlinePlayers().then(success => {
                let lastIndex = 0;
                for(i in success){
                    lastIndex++;
                }
                messageToChannel("Hay "+ lastIndex+ " jugadores conectados al servidor.");
            }, error => {
                messageToChannel("No se puede recibir la información en estos momentos. Inténtalo de nuevo más tarde.");
            })
        }
        else if(message === "!online all"){
            olympo.getOnlinePlayers().then(success => {
                let listString = "";
                for(i in success){
                    listString += "- "+success[i].name+", nivel "+ success[i].location+".\n";
                }
                listString += "```";
                messageToChannel(listString);
            }, error => {
                messageToChannel("No se puede recibir la información en estos momentos. Inténtalo de nuevo más tarde.");
            })
        }
        else{
            name = name.charAt(0).toUpperCase() + name.slice(1);
            olympo.getOnlinePlayers().then(success => {
                for (i in success) {
                    if (success[i].name.toUpperCase() === name.toUpperCase()) {
                        messageToChannel("El personaje " + name + " está conectado. Es nivel " + success[i].level + " y se encuentra en " + success[i].location);
                        return 0;
                    }
                }
                messageToChannel("El jugador " + name + " no está conectado.");

            }, error => {
                messageToChannel("No se puede recibir la información en estos momentos. Inténtalo de nuevo más tarde.");
            })
        }
    }


    async function showTalentTree(name) {
        let selector = "#armory_talents > div:nth-child(2) > div.talents-body";
        let url = armoryUrl+name;
        let html = "";
        await request(url).then(function (htmlString) {
            html = htmlString;
        });
        let cheer = await cheerio.load(html);
        if(cheer("#armory_talents > div:nth-child(2)").attr("style") === "display: none;"){
            selector = "#armory_talents > div:nth-child(3) > div.talents-body";
        }
        messageToChannel("```Cargando talentos de "+name.charAt(0).toUpperCase() + name.slice(1)+"...```");
        webshot(url, "talents/"+name+".png", {captureSelector:selector}, function (error) {
            messageToChannel("Talentos de "+name.charAt(0).toUpperCase() + name.slice(1)+":\n");
            uploadFile("talents/"+name+".png").then(success => {
                fs.unlink("talents/"+name+".png");
            }, error => {
                messageToChannel("Error: no se ha podido recibir la información.");
                console.log("Talentos error");
            });
        });
    }

    async function showProfessions(name){
        let selector = "#armory_mid_info > div.professions";
        let url = armoryUrl+name;
        messageToChannel("```Cargando profesiones de "+name.charAt(0).toUpperCase() + name.slice(1)+"...```");
        webshot(url, "professions/"+name+".png", {captureSelector:selector}, function (error) {
            messageToChannel("Profesiones de "+name.charAt(0).toUpperCase() + name.slice(1)+":\n");
            uploadFile("professions/"+name+".png").then(success => {
                fs.unlink("professions/"+name+".png");
            }, error => {
                messageToChannel("Error: no se ha podido recibir la información.");
                console.log("profesiones error");
            });
        });
    }

    function startTrivialGame(channelID, firstRound){
        if(firstRound){
            messageToChannel("La partida empezará en 3 segundos :space_invader: ");
        }
        setTimeout(function () {
            if(firstRound){
                let qa = trivial.getQuestionAndAnswer();
                let cluesArray = trivial.getClues(qa[1]);
                console.log(qa);
                messageToChannel("**"+qa[0]+"**");
                messageToChannel("Pista: " + "```"+cluesArray[0]+"```");
                serversPlayingTrivial.push([channelID, qa[0], qa[1], cluesArray,
                    setTimeout(function () {
                        messageToChannel("20 segundos restantes...");
                        messageToChannel("```"+cluesArray[1]+"```");
                        serversPlayingTrivial[getIndexByID(mes.channel.guild.id, serversPlayingTrivial)][8] = 3;
                    }, 10000),
                    setTimeout(function () {
                        messageToChannel("10 segundos restantes...");
                        messageToChannel("```"+cluesArray[2]+"```");
                        serversPlayingTrivial[getIndexByID(mes.channel.guild.id, serversPlayingTrivial)][8] = 1;
                    }, 20000),
                    setTimeout(function () {
                        messageToChannel("Nadie ha acertado. La respuesta era "+ '"' + qa[1] + '".');
                        startTrivialGame(channelID, false);
                    }, 30000),
                    false, 5
                ]);
            }
            else{
                let qa = trivial.getQuestionAndAnswer();
                let cluesArray = trivial.getClues(qa[1]);
                console.log(qa);
                messageToChannel("**"+qa[0]+"**");
                messageToChannel("Pista: " + "```"+cluesArray[0]+"```");
                serversPlayingTrivial[getIndexByID(channelID, serversPlayingTrivial)] =  [channelID, qa[0], qa[1], cluesArray,
                    setTimeout(function () {
                        messageToChannel("20 segundos restantes...");
                        messageToChannel("```"+cluesArray[1]+"```");
                        serversPlayingTrivial[getIndexByID(mes.channel.guild.id, serversPlayingTrivial)][8] = 3;
                    }, 10000),
                    setTimeout(function () {
                        messageToChannel("10 segundos restantes...");
                        messageToChannel("```"+cluesArray[2]+"```");
                        serversPlayingTrivial[getIndexByID(mes.channel.guild.id, serversPlayingTrivial)][8] = 1;
                    }, 20000),
                    setTimeout(function () {
                        messageToChannel("Nadie ha acertado. La respuesta era "+ '"' + qa[1] + '".');
                        startTrivialGame(channelID, false);
                    }, 30000),
                    false, 5
                ];
            }
        }, 3000);

    }

});






function splitter(str, l){
    let strs = [];
    while(str.length > l){
        let pos = str.substring(0, l).lastIndexOf(' ');
        pos = pos <= 0 ? l : pos;
        strs.push(str.substring(0, pos));
        let i = str.indexOf(' ', pos)+1;
        if(i < pos || i > pos+l)
            i = pos;
        str = str.substring(i);
    }
    strs.push(str);
    return strs;
}

function exists(value, array){
    for(i in array){
        if(array[i] === value){
            return true;
        }
    }
    return false;
}

function isPlayingTrivial(id){
    for(i in serversPlayingTrivial){
        if(serversPlayingTrivial[i][0] === id){
            return true;
        }
    }
    return false;
}

function getScoresJSON(){
    let jsonString = fs.readFileSync("trivial/trivial_scores.json");
    return JSON.parse(jsonString);
}

function addScore(userName, points, serverID, serverName, userID){
    let json = getScoresJSON();
    for(let i = 0; i < Object.keys(json).length; i++){
        if((json[i].nombre === userName) && (json[i].serverID === serverID)){
            json[i].puntos += points;
            fs.writeFileSync("trivial/trivial_scores.json", JSON.stringify(json));
            return 0;
        }
    }

    json[Object.keys(json).length] = {
        "nombre": userName,
        "puntos": points,
        "serverID": serverID,
        "serverName": serverName,
        "userID": userID
    };
    fs.writeFileSync("trivial/trivial_scores.json", JSON.stringify(json));
}

function GetSortOrder(prop) {
    return function(a, b) {
        if (a[prop] > b[prop]) {
            return 1;
        } else if (a[prop] < b[prop]) {
            return -1;
        }
        return 0;
    }
}

function getIndexByID(id, array){
    for(i in array){
        if(array[i][0] === id){
            return i;
        }
    }
}
