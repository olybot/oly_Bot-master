const fs = require('fs');
let content = "";
let adults = "";

function getRandomCategory(){
    let categorias = ["Arte", "Biologia", "Canciones", "Ciencia", "Cine", "Cotilleo-TV", "Deporte",
    "Economia", "Eros-Sex", "Fisica-Quimica", "Gastronomia", "Geografia", "Historia", "Idiomas",
    "Informatica", "Literatura", "Medicina-Salud", "Miscelanea", "Mitologia", "Musica", "Personajes", "Politica"];
    let categoriaIndex = getRandomInt(0, categorias.length-1);
    return categorias[categoriaIndex]+".txt";
}

function getQuestionAndAnswer(categoria){
    let questionAndAnswer = [];
    let questions = fs.readFileSync("trivial/"+categoria, "latin1");
    let questionAnswer = questions.split("\n");
    questionAnswer = questionAnswer[getRandomInt(0, questionAnswer.length-1)];
    questionAndAnswer.push(questionAnswer.split("*")[0]);
    questionAndAnswer.push((questionAnswer.split("*")[1]).split("\r")[0]);
    return questionAndAnswer;
}


function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


function getClues(respuesta){
    let pistas = [];
    let indicesPalabras = [];
    let solucionadas = 0;
    let actual = respuesta.split("");
    for(let i = 0; i < actual.length; i++){
        if(actual[i] !== " "){
            actual[i] = "*";
        }
    }
    pistas.push(actual.join(""));
    let numeroSolucionadas = [Math.round(respuesta.length*0.25), Math.round(respuesta.length*0.5)];
    for(let i = 0; i < 2; i++){
        while(solucionadas < numeroSolucionadas[i]){
            for(let x = 0; x < respuesta.length; x++){
                if((getRandomInt(1, 10) <= 3) && (!exists(x, indicesPalabras)) && (respuesta.charAt(x) !== " ")){
                    indicesPalabras.push(x);
                    solucionadas++;
                }
            }
        }
        pistas.push(decryptClue(indicesPalabras, actual, respuesta).join(""));
    }
    return pistas;
}



function exists(value, array){
    for(i in array){
        if(array[i] === value){
            return true;
        }
    }
    return false;
}

function decryptClue(indexesArray, encriptedArray, solution){
    for(let i = 0; i < indexesArray.length; i++){
        encriptedArray[indexesArray[i]] = solution.charAt(indexesArray[i]);
    }
    return encriptedArray;
}


module.exports = {
    getQuestionAndAnswer: () => {
        return getQuestionAndAnswer(getRandomCategory());
    },
    getClues: (answer) =>  {
        return getClues(answer);
    }
};
