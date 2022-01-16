import React, {useState, useEffect} from "react";
import {Button} from '@mui/material';
import { Tweet } from 'react-twitter-widgets';
import {sortByKey, eliminaduplicati, statistics, createJsonToSend, extractQuestions} from './Helper';
import ColumnGraph from './ColumnGraph';
import Spinner from './Spinner';
import '../styles/trivia.css';
import Dinamic from './DinamicForm';
import Scoreboard from './Scoreboard';

function Trivia()
{

  const [loading, setLoading] = useState(true);
  const [trivia, setTrivia] = useState('');
  const [query, setQuery] = useState('');
  const [id, setId] = useState('');
  const [correctAnswers, setCorrectAnswers] = useState('');
  const [tweets, setTweets] = useState([]);
  const [official, setOfficial] = useState('');
  const [question1, setQuestion1] = useState('');
  const [question2, setQuestion2] = useState('');
  const [question3, setQuestion3] = useState('');
  const [answer1, setAnswer1] = useState('');
  const [answer2, setAnswer2] = useState('');
  const [answer3, setAnswer3] = useState('');
  const [player, setPlayer] = useState('');
  const [playerAnswer1, setPlayerAnswer1] = useState('');
  const [playerAnswer2, setPlayerAnswer2] = useState('');
  const [playerAnswer3, setPlayerAnswer3] = useState('');
  const [clicked, setClicked] = useState(false);


  const [RealNumberOfQuestions, setRealNumberOfQuestions] = useState([]);
  const answerToParent = (index, answer) => {

    if(index===1)
      setAnswer1(answer);
    if(index===2)
      setAnswer2(answer);
    if(index===3)
      setAnswer3(answer);
  }

  const questionToParent = (index, question) => {

      if(index ===1)
        setQuestion1(question);
      if(index===2)
        setQuestion2(question);
      if(index===3)
        setQuestion3(question);
    }


 function openTwitterPage(insert){

    window.open(`${insert}`);
}

function searchTrivia()
{

  if(query === '')
    document.getElementById('erroreSearch').innerHTML = 'Inserire nome del trivia';
  else
  {
    readFile();
    const options = {
              method: 'GET'
          };
    fetch(`http://localhost:8001/api/trivia/${query}`, options)
        .then(response => response.json())
        .then(data => {
          let principal;

          if(data.data)
          {

            let i;
            for(i in data.data)
            {
              if (!data.data[i].in_reply_to_user_id)
              {
                principal = data.data[i]; // sarebbe il tweet ufficiale del contest
                break;
              }
              console.log(principal);
            }
            if(principal)
              {
                setTweets(data);
                console.log("IL PRINCIPALE", principal);
                console.log(principal.id);
                setId(principal.id);
                let numOfQuestions = extractQuestions(principal.text);
                setRealNumberOfQuestions(RealNumberOfQuestions.concat(numOfQuestions));
                data.data.splice(i,1);
                console.log("senza il principale", data.data)
                setTrivia(query);
                setOfficial(principal);
                setClicked(true);
              }else {
                document.getElementById('response').innerHTML = "Contest non trovato";
                setTweets([]);
              }
          }
          else{
            document.getElementById('response').innerHTML = "Contest non trovato";
            setTweets([]);
          }
          })
          .catch((error) => {
        console.error('Error:', error);
      });
  }
}

function publicAnswers()
{
  // controlliamo le domande se sono vuote o meno, devono essere TUTTE piene e anche il nome deve esserci
  if((RealNumberOfQuestions.length === 1 && playerAnswer1 !='' && player != '')  || (RealNumberOfQuestions.length === 2 &&( playerAnswer2 !='' && playerAnswer1 != '' && player != ''))
|| (RealNumberOfQuestions.length === 3 &&( playerAnswer2 !='' && playerAnswer1 != '' && playerAnswer3 != '' && player != '')) )
  {
    let toInsert = '';
    //insert += `#Question1\n${question1}`;
    var newAnswer1 = playerAnswer1;
    var newAnswer2 = playerAnswer2;
    var newAnswer3 = playerAnswer3;
    newAnswer1 = newAnswer1.replaceAll('#', '%23');
    newAnswer2 = newAnswer2.replaceAll('#', '%23');
    newAnswer3 = newAnswer3.replaceAll('#', '%23');
    if(playerAnswer2)
    {
      if(playerAnswer3)
      {
        toInsert = `https://twitter.com/intent/tweet?text=%23officialTrivia %23${trivia} %23${player}`+encodeURIComponent('\n')+`%23Answer1 `+encodeURIComponent('\n')+` ${newAnswer1}`+encodeURIComponent('\n')+`%23Answer2 `+encodeURIComponent('\n')+` ${newAnswer2}`+encodeURIComponent('\n')+`%23Answer3 `+encodeURIComponent('\n')+` ${newAnswer3}&ref_src=twsrc%5Etfw%7Ctwcamp%5Etweetembed%7Ctwterm%5E1470887652320858123%7Ctwgr%5E%7Ctwcon%5Es1_&ref_url=http%3A%2F%2Flocalhost%3A3000%2Fcontest&in_reply_to=${id}`;
      }
      else{
        toInsert = `https://twitter.com/intent/tweet?text=%23officialTrivia %23${trivia} %23${player}`+encodeURIComponent('\n')+`%23Answer1 `+encodeURIComponent('\n')+` ${newAnswer1}`+encodeURIComponent('\n')+`%23Answer2 `+encodeURIComponent('\n')+` ${newAnswer2}`+encodeURIComponent('\n')+`&ref_src=twsrc%5Etfw%7Ctwcamp%5Etweetembed%7Ctwterm%5E1470887652320858123%7Ctwgr%5E%7Ctwcon%5Es1_&ref_url=http%3A%2F%2Flocalhost%3A3000%2Fcontest&in_reply_to=${id}`;
      }
    }
    else{
      toInsert = `https://twitter.com/intent/tweet?text=%23officialTrivia %23${trivia} %23${player}`+encodeURIComponent('\n')+`%23Answer1 `+encodeURIComponent('\n')+` ${newAnswer1}&ref_src=twsrc%5Etfw%7Ctwcamp%5Etweetembed%7Ctwterm%5E1470887652320858123%7Ctwgr%5E%7Ctwcon%5Es1_&ref_url=http%3A%2F%2Flocalhost%3A3000%2Fcontest&in_reply_to=${id}`;
    }
    openTwitterPage(toInsert);
  //controllare se le risposte sono giuste

    //segnarci il punteggio e mostrarlo
  }else {
    console.log("ok")
    document.getElementById('answerError').innerHTML = 'Please fill all fields';
  }
}

function writeFile(obj)
{
      const options = {
                method: 'POST',
                headers: new Headers({'Content-Type': 'application/json' }),
                body: obj
            };

      let url = `http://localhost:8001/api/answers/${trivia}`;
      fetch(url, options)
      .then((response) => {
        return(response.json())
      }).then(function(data){
        console.log(data);
        readFile();
      })
}

function readFile()
    {
      const options = {
                method: 'GET'
            };
      console.log(query);
      let url = `http://localhost:8001/api/answers/${query}`;
      fetch(url, options)
      .then((response) => {
        console.log(response);
        return(response.json())
      }).then(function(data){
        let response = JSON.parse(data);
        setCorrectAnswers(response); // funziona correttamente
      })
    }

    function createTrivia(){
        if(trivia === '' || question1 === '') // checks the name
        {
          document.getElementById('erroreCreate').innerHTML = "Insert Trivia's name and at least one question with his answer";
        }
        else {
          let toSend = createJsonToSend(answer1, answer2, answer3);
          writeFile(toSend);
          let toInsert = '';
          //insert += `#Question1\n${question1}`;
          var newQuestion1 = question1;
          var newQuestion2 = question2;
          var newQuestion3 = question3;
          newQuestion1 = newQuestion1.replaceAll('#', '%23');
          newQuestion2 = newQuestion2.replaceAll('#', '%23');
          newQuestion3 = newQuestion3.replaceAll('#', '%23');
          if(question2)
          {
            if(question3)
            {
              toInsert = `https://twitter.com/intent/tweet?text=%23officialTrivia %23${trivia}`+encodeURIComponent('\n')+`%23Question1 `+encodeURIComponent('\n')+` ${newQuestion1}`+encodeURIComponent('\n')+`%23Question2 `+encodeURIComponent('\n')+` ${newQuestion2}`+encodeURIComponent('\n')+`%23Question3 `+encodeURIComponent('\n')+` ${newQuestion3}&ref_src=twsrc%5Etfw%7Ctwcamp%5Etweetembed%7Ctwterm%5E1470887652320858123%7Ctwgr%5E%7Ctwcon%5Es1_&ref_url=http%3A%2F%2Flocalhost%3A3000%2Fcontest`;
            }
            else{
              toInsert = `https://twitter.com/intent/tweet?text=%23officialTrivia %23${trivia}`+encodeURIComponent('\n')+`%23Question1 `+encodeURIComponent('\n')+` ${newQuestion1}`+encodeURIComponent('\n')+`%23Question2 `+encodeURIComponent('\n')+` ${newQuestion2}`+encodeURIComponent('\n')+`&ref_src=twsrc%5Etfw%7Ctwcamp%5Etweetembed%7Ctwterm%5E1470887652320858123%7Ctwgr%5E%7Ctwcon%5Es1_&ref_url=http%3A%2F%2Flocalhost%3A3000%2Fcontest`;
            }
          }
          else{
            toInsert = `https://twitter.com/intent/tweet?text=%23officialTrivia %23${trivia}`+encodeURIComponent('\n')+`%23Question1 `+encodeURIComponent('\n')+` ${newQuestion1}&ref_src=twsrc%5Etfw%7Ctwcamp%5Etweetembed%7Ctwterm%5E1470887652320858123%7Ctwgr%5E%7Ctwcon%5Es1_&ref_url=http%3A%2F%2Flocalhost%3A3000%2Fcontest`;
          }
          openTwitterPage(toInsert);

        }
      }


        /* Funzione che effettivamente si dedica a renderizzare graficamente i tweets*/
        const showTweets = () => {
            if(official !== '' && tweets.data){
                return (
                  <React.Fragment>
                    <div>
                    <Tweet key={official.id} tweetId={official.id}/>
                    <label for="text">Please insert your name !</label>
                    <input type="text" id="text" onChange={(event, val) => {
                      setPlayer(event.target.value);
                    }}/>
                  {RealNumberOfQuestions.map((tweet, index) =>
                  {
                    return(
                      <div>
                      <label for="text">Answer the question {index +1}</label>
                      <input type="text" id="text" onChange={(event, val) => {
                        if(index === 0)
                          setPlayerAnswer1(event.target.value);
                        if(index ===1)
                          setPlayerAnswer2(event.target.value);
                        if(index ===2)
                          setPlayerAnswer3(event.target.value);
                      }}/>
                    </div>
                    )
                  })}

                  <Button variant="contained"  size='small'  sx={{
                    height: '2.2rem',
                    backgroundColor: 'rgb(29,161,242)'
                  }} onClick={publicAnswers}>Public answers</Button>
                    </div>
                  </React.Fragment>
                );
            }

};

        // DOBBIAMO FARE DUE COSE IN PARALLELO
        // 1) SALVARE NEL JSON DEL SERVER LE RISPOSTE CON L'INDICE DELLA DOMANDA
        // 2) CREARE PER OGNI DOMANDA UN TWEET DI QUESTO TIPO #officialTrivia #nomeTrivia Domanda


// NEL PRIMO DIV CREATE BISOGNA CREARE UN ELEMENTO DINAMICO CHE PERMETTE DI AGGIUNGERE QUANTE DOMANDE SI VOGLIONO O MAX 3 TIPO
  return(<div id="trivia">
  <div id="left">

    <div id="create">
    <h3>Create a trivia game !</h3>
    <label for="triviaName" > Insert trivia name: </label>
        <div>
            <input type="text" id="triviaName" onChange={(event, val) => {
              setTrivia(event.target.value);
              }}/>
        </div>
        <div><Dinamic questionToParent={questionToParent} answerToParent={answerToParent}/></div>
        <div>
            <Button variant="contained"  size='small'  sx={{
              height: '2.2rem',
              backgroundColor: 'rgb(29,161,242)'
            }} onClick={createTrivia}>Create Trivia Game</Button>
        </div>
            <span id="erroreCreate"></span>
    </div>




  <div id="search">
  <h3>Search an existing trivia game !</h3>

    <input type="text" id="contest" onChange={(event, val) => {
      setQuery(event.target.value);
      }}/>
      </div>
      <div>
    <Button variant="contained"  size='small'  sx={{
      height: '2.2rem',
      backgroundColor: 'rgb(29,161,242)'
    }} onClick={searchTrivia}>Search Trivia Game</Button>
    </div>
    <span id="erroreSearch"></span>

    <div id="response">

    </div>
    <div id="showTweets">
      {showTweets()}
      <span id="answerError"></span>
    </div>

    </div> {/*FINE DIV LEFT */}

  <div id="right">
{clicked ? <Scoreboard trivia={trivia} replies={tweets} correctAnswers={correctAnswers}/> : <p>Cerca un trivia per visualizzarne la scoreboard </p>}
    </div>
    </div>

  )
}


export default Trivia;
