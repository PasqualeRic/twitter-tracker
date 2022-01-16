import React, {useState} from "react";
import {Button} from '@mui/material';
//import SearchIcon from '@mui/icons-material/Search';
import { Tweet } from 'react-twitter-widgets';
import {sortByKey, eliminaduplicati, statistics} from './Helper';
import ColumnGraph from './ColumnGraph';
import '../styles/contest.css';
const Contest = () => {


const [bookwithvotes, setBookwithVotes] = useState([]);

const [contest, setContest] = useState('');
const [query, setQuery] = useState('');
const [tweets, setTweets] = useState([]);
const [book, setBook] = useState('');
const [official, setOfficial] = useState('');

/* Questa funzione cerca il contest */
//TO-DO CONTROLLARE CHE IL CONTEST NON ESISTA GIÀ ??
function createContest(){
    if(contest === '')
    {
      document.getElementById('errore').innerHTML = 'Inserire testo';
    }
    else{
      window.open(`https://twitter.com/intent/tweet?text=%23officialContest %23${contest}`);
    }
  }

/* Funzione che permette di verificare l'esistenza di un contest e in caso affermativo esegue il rendering di tale*/
function searchContest(){

  document.getElementById('response').innerHTML = '';
    let toSend=  `{
      "query": "${query}"
    }`;
    const options = {
         method: 'POST',
         headers: { "Content-Type": "application/json" },
          body: toSend
       };
    fetch('http://localhost:8001/searchContest', options)
    .then(response => response.json())
    .then(data => {
      console.log(data);
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
        }
        if(principal)
          {
            data.data.splice(i,1);
            setTweets(data);
            setOfficial(principal);
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


function openTwitterPage(id, tweet, cntrl){
  if(cntrl)
  {
    window.open(`https://twitter.com/intent/tweet?text=%23officialContest %23${query} %23${book}&ref_src=twsrc%5Etfw%7Ctwcamp%5Etweetembed%7Ctwterm%5E1470887652320858123%7Ctwgr%5E%7Ctwcon%5Es1_&ref_url=http%3A%2F%2Flocalhost%3A3000%2Fcontest&in_reply_to=${id}`);
  }
  else{
    console.log(tweet);
    let name = tweet.text.split('#');
    name = name[3];
    window.open(`https://twitter.com/intent/tweet?text=%23voteUp %23${name}&ref_src=twsrc%5Etfw%7Ctwcamp%5Etweetembed%7Ctwterm%5E1470887652320858123%7Ctwgr%5E%7Ctwcon%5Es1_&ref_url=http%3A%2F%2Flocalhost%3A3000%2Fcontest&in_reply_to=${id}`);
  }
}

/* Questa funzione ordina i voti per id dell'autore, ed elimina i voti duplicati da ogni libro.
* Inoltre grazie a  Twitter i voti sono già ordinati dal meno recente al più recente.
*/
function organizeTweets(){
  if (official.id) {
    const toSend={
      "id": "${official.id}"
    };

    const options = {
         method: 'POST',
         headers: { "Content-Type": "application/json", "Accept" : "application/json" },
          body: toSend
       };
    fetch('http://localhost:8001/getVotes', options)
    .then(response => response.json())
    .then(data => {
        sortByKey(data.data, 'author_id');
        data.data = eliminaduplicati(data.data);
        // CHIAMO LA FUNZIONE PER estrarre le Statistiche
        let f;
        f = statistics(data.data);
        setBookwithVotes(f);
      })
  }
}
 // FUNZIONA MA BISOGNA AGGIUNGERE I NOMI
const showGraph = () => {


    return(
      <React.Fragment>
      <ColumnGraph list={bookwithvotes} />
      </React.Fragment>
    );


};

/* Funzione che effettivamente si dedica a renderizzare graficamente i tweets*/
const showTweets = () => {
    if(official !== '' && tweets.data){
        return (
          <React.Fragment>
            <div>
            <Tweet key={official.id} tweetId={official.id}/>
            <input type="text" onChange={(event, val) => {
              setBook(event.target.value);
            }}/>
            <Button variant="contained"  size='small'  sx={{
              height: '2.2rem',
              backgroundColor: 'rgb(29,161,242)'
            }} onClick={()=>openTwitterPage(official.id,'', true)}>Candida il tuo libro</Button>
            </div>
            {tweets.data.map((tweet,index) => {
                return(
                <div>
                   <Tweet key={tweet.id} tweetId={tweet.id}/>
                   <Button variant="contained"  size='small'  sx={{
                     height: '2.2rem',
                     backgroundColor: 'rgb(29,161,242)'
                   }} onClick={()=>openTwitterPage(tweet.id, tweet, false)}>Vota questo libro</Button>
                </div>
              )
            })}
          </React.Fragment>
        );
    }
  };

  return (
    <div id="mainContest">
    <div id="left">
    <div>
    <h3>Create a contest !</h3>
      <input type="text" id="contest" onChange={(event, val) => {
          setContest(event.target.value);
        }}/>
      <Button variant="contained"  size='small'  sx={{
        height: '2.2rem',
        backgroundColor: 'rgb(29,161,242)'
      }} onClick={createContest}>Crea contest</Button>
      <span id="errore"></span>
    </div>

    <div>
    <h3>Search for an existing contest !</h3>

      <input type="text" id="contest" onChange={(event, val) => {
        setQuery(event.target.value);
      }}/>
      <Button variant="contained"  size='small'  sx={{
        height: '2.2rem',
        backgroundColor: 'rgb(29,161,242)'
      }} onClick={searchContest}>Ricerca contest</Button>
      <span id="errore"></span>
    </div>

    <div id="response">

    </div>
    <div id="showTweets">
    {showTweets()

    }
    </div>
    </div>
    <div id="right">
      <Button variant="contained"  size='small'  sx={{
        height: '2.2rem',
        backgroundColor: 'rgb(29,161,242)'
      }} onClick={organizeTweets}>Visualizza Statistiche in tempo reale</Button>
    <div id="statistiche">
    {showGraph()

    }
    </div>
    </div>
    </div>
  );
};
export default Contest;
