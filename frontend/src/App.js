import {React , useState, useEffect, useRef} from 'react';
import { CssBaseline, TextField, Tab, Box, Button} from '@mui/material';
import CustomAutocomplete from './styles/CustomAutocomplete';
import {TabContext, TabList, TabPanel} from '@mui/lab/';
import SearchIcon from '@mui/icons-material/Search';
import SaveIcon from '@mui/icons-material/Save';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import BrokenImageIcon from '@mui/icons-material/BrokenImage';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import DatePicker from '@mui/lab/DatePicker';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import fieldStyles  from './styles/FieldStyles';
import dateStyles from './styles/DateStyles';
import { commands } from './functions/Commands';
import Graph from './components/Graph';
import './App.css';
import Map from './components/Map'
import Info from './components/Info';
import ReactToPrint from 'react-to-print';
import {retweetedStatus, notRetweetedStatus, createObj} from './components/Helper';
import SimpleWordcloud from './components/Wordcloud';

let tweetsForMap = [];
export {tweetsForMap}
let parole = [];
export {parole}


function App() {

const [sinceValue, setSinceValue] = useState(new Date());
const [untilValue, setUntilValue] = useState(new Date());
let [text, setText] = useState('');
const [tags, setTags] = useState([]);
// I tweets effettivi rimandatici dal server
const [tweets, setTweets] = useState([]);
// Ci dice qual'era l'ultima query che abbiamo fatto, se # o user ad esempio
const [lastQuery, setLastQuery] = useState('');
// Valore delle tabs
const [tabvalue, setTabValue] = useState('one');

const [usedDate, setUsedDate] = useState(false);
const componentRef = useRef();

const [positive, setPositive] = useState(1);
const [negative, setNegative] = useState(1);
const [neutral, setNeutral] = useState(1);

let classes = fieldStyles();
let date = dateStyles();


// Funzione che viene chiamata ogni volta che i tweet cambiano, si occupa di renderizzarli
// nell'apposito div nella forma decisa dall'ultima query
function displayTweets()
{
  let toInsert= '';
  for(let tweet in tweets)
    {
        toInsert += `<div id="tweetDisplayed">
        <a href='${tweets[tweet].user.profile_image_url}' target="_blank"><img src='${tweets[tweet].user.profile_image_url}'></a>
        <p><a id="name" href='https://twitter.com/${tweets[tweet].user.screen_name}' target="_blank">${tweets[tweet].user.screen_name}</a> </p>`
        if (tweets[tweet].retweeted_status) {
          toInsert += retweetedStatus(tweets[tweet]);
         }
        else {
          toInsert += notRetweetedStatus(tweets[tweet]);
        }
        if (tweets[tweet].entities.media) {
          toInsert += `<a href='${tweets[tweet].entities.media[0].media_url}' target="_blank">
          <img src='${tweets[tweet].entities.media[0].media_url}' style="max-height: 300px; max-width: 300px;" />
          </a>`
        }
        if (tweets[tweet].place) {
          toInsert += `<p> ${tweets[tweet].created_at.substring(0,16)} at ${tweets[tweet].place.full_name} </p>`
        }
        else {
            toInsert += `<p> ${tweets[tweet].created_at.substring(0,16)} at Unknown Place </p>`
        }
        toInsert += `</div>
        <hr>
        `
    }
  //TO-DO AGGIUNGERE IL CASO IN CUI ABBIAMO CERCATO PER PERIODO
  const tweetsList = document.getElementById('tweetsList') ;
  tweetsList.innerHTML = toInsert;
}

function multipleQuery()
{
    let array = text.split(' ');
    if(tags[0].name === '#' && tags[1].name === 'place')
    {
      setLastQuery('#+place');
      const toSend=  `{
        "tag": "${tags[0].name}",
        "nomeHashtag" : "${array[0]}",
        "query" : "${array[1]}"
      }`
      const options = {
           method: 'POST',
           headers: { "Content-Type": "application/json" },
            body: toSend
         };
         fetch('http://localhost:8001/hashtagAndPlace', options)
         .then(response => response.json())
         .then(data => {
             parole = data.statuses.map(item=>item.full_text);
             setTweets(data.statuses.reverse());
             tweetsForMap = data.statuses;
             displayTweets();
           })
           .catch((error) => {
       console.error('Error:', error);
     });
    }else{
      alert("Please check if the query is correct")
    }
}


function send(destination, options)
{

  fetch(`http://localhost:8001/${destination} `, options)
    .then(response => response.json())
    .then(data => {
        setTweets(data.tweetInfo);
        parole = data.tweetInfo.map(item=>item.full_text);
        tweetsForMap = data.tweetInfo;
        displayTweets();
      })
      .catch((error) => {
        console.error('Error:', error);
      })
}
// Funzione che viene chiamata ogni qualvolta un utente preme il pulsante Search a destra della query bar
// Manda al server i dati inseriti dall'utente, tranne la data.
 async function submit()
{
  setUsedDate(false);
  // Eseguo un primo controllo per evitare di mandare in crash il server mandandogli una query null
  if(tags[0] != null)
  {

    if(tags.length >= 2)
      multipleQuery();
    else{
      if(tags[0].name === '#')
    {
      setLastQuery('#');
      // Creiamo il payload da mandare al server
       let options = createObj('nomeHashtag', text);
        send('getTweetsByHashtag', options);
     }
    else if(tags[0].name === 'user')
    {
        setLastQuery('user');
        const options = createObj('username', text);
        send('getTweetsByUser', options);

    }
    else if(tags[0].name === 'place')
    {
        setLastQuery('place');
        const options = createObj('place', text);
        send('searchByPlace', options);
    }


  }
}
}

// Funzione che viene chiamata quando l'utente clicca il bottone search by date
async function submitDate()
{
  setUsedDate(true);
  let untilDate = untilValue.toISOString().substring(0,10);
  let sinceDate = sinceValue.toISOString().substring(0,10);
  if(tags != null && text != null)
  {
      const toSend = `{
      "tag": "${tags[0].name}",
      "query": "${text}",
      "untildate": "${untilDate}",
      "sincedate":"${sinceDate}"
    }`;
    const options = {
       // Creiamo il payload da mandare al server
         method: 'POST',
         headers: { "Content-Type": "application/json" },
          body: toSend
       };
    if(tags[0].name === 'place')
    {
      setLastQuery('place');
      fetch('http://localhost:8001/tweetsByPlaceAndPeriod', options)
        .then(response => response.json())
        .then(data => {
          parole = data.statuses.map(item=>item.full_text);
          setTweets(data.statuses.reverse());
          tweetsForMap = data.statuses;
          })
          .catch((error) => {
      console.error('Error:', error);
    });
  }
    else{
      setLastQuery(tags[0].name);
      fetch('http://localhost:8001/tweetsByPeriod', options)
        .then(response => response.json())
        .then(data => {
          parole = data.statuses.map(item=>item.full_text);
          setTweets(data.statuses.reverse());
          tweetsForMap = data.statuses;
          })
          .catch((error) => {
      console.error('Error:', error);
    });
  }

  displayTweets();

  }
  else
  {
    alert("Attenzione, alcuni campi non sono stati compilati");
  }
}


function analize(){

  var txt = ''
  for(var tweet in tweets)
  {
    txt = txt + '$$' + (tweets[tweet].full_text);
  }

  const options = {
    method : 'POST',
    headers : {'Content-Type' : 'application/json'},
    body : JSON.stringify({tweets : txt})
  };
   fetch('http://localhost:8001/analyzeTweets', options)
     .then(response => response.json())
     .then(data => {
         setPositive(parseInt(data[0]));
         setNegative(parseInt(data[1]));
         setNeutral(parseInt(data[2]));
       }).catch((error) => {
         console.error('Error:', error);
      });
}

// Effettua un display dei tweets ogni qualvolta essi vengono aggiornati
useEffect(() =>
{
  displayTweets();
})

  return (
  <div>
    <CssBaseline />

    {/* Div generale che prende tutta la pagina*/}
    <div className="main">

    {/* Div a sinistra*/}
      <div className="left">

{/*primo div dentro il div a sinistra*/}
   <div className="queryBar">

      {/* Query bar */}
      <Info />
      <CustomAutocomplete
          multiple
          id="Commands"
          options={commands}
          getOptionLabel={option => option.name}
          onChange={((event, value) =>{
            if(value[0]!= null)
            {
              setTags(value);
            setLastQuery(value[0].name);}
          })}
          renderInput={params => (
            <TextField
              {...params}
              value={text}
               className={classes.root}
              label='#Make a query'

              onChange={((event) =>{
                setText(event.target.value);
                document.getElementById("text").innerHTML = event.target.value;
              })}
              margin="normal"
              fullWidth
            />
          )}
   />
   <Button variant="contained"  size='small'  sx={{
     height: '2.2rem',
     backgroundColor: 'rgb(29,161,242)'
   }} onClick={submit} endIcon={<SearchIcon />}>
  Search
</Button>
   </div>
   {/* FINE Query bar */}

   {/* Div in cui mostriamo la parola cercata*/}
   <div className="show">
   <p><b>You are searching for :</b></p><p id="text"></p>
   </div>

   <div style={{display : 'flex'}}>
     <ReactToPrint
            trigger={() => {
              // NOTE: could just as easily return <SomeComponent />. Do NOT pass an `onClick` prop
              // to the root node of the returned component as it will be overwritten.
              return <a href="#save"><SaveIcon /> </a>
            }}
            content={() => componentRef.current}
     />
   </div>


  {/* Secondo div nel div a sinista con la dashboard e i tweets   */}
   <div className="dashboard">

 {/* Tabs contenenti tweets e dashboard  */}

    <TabContext value={tabvalue}>
    <Box sx={{ width: '100%' }}>
      <TabList
        value={tabvalue}
        onChange={(event, val) => {
          setTabValue(val);
        }}
        textColor="primary"
        indicatorColor="primary"

        aria-label="secondary tabs example"
      >
        <Tab value="one" label="Tweets" href="#tweets"   sx={{color: ' rgb(245,248,250)'}}/>
        <Tab value="two" label="Map" href="#map"  sx={{color: ' rgb(245,248,250)'}} />
        <Tab value="three" label="Graph" href="#graph"  sx={{color: ' rgb(245,248,250)'}} />
        <Tab value="four" label="Word" href="#wordcloud"  sx={{color: ' rgb(245,248,250)'}} />
      </TabList>
    </Box>
        <TabPanel value='one' id="tweetsList" ref={componentRef}>
        {/* Qui vengono mostrati i tweets */}
        </TabPanel>
        <TabPanel value='two' id="mapContainer">
        {/* Qui viene mostrata la mappa */}
          <Map />
        </TabPanel>
        <TabPanel value='three' id="graph">
        {/* Qui mostriamo grafici vari*/}
          <label onClick={analize} style={{cursor : 'pointer'}}><BrokenImageIcon sx={{color: 'rgb(29,161,242)'}}/>Sentiment Analysis</label>
          <Graph positive={positive} negative={negative} neutral={neutral}/>
        </TabPanel>
        <TabPanel value='four' id="word">
        {/* Qui mostriamo grafici vari*/}
          {/* <Wordcloud /> */}
          <SimpleWordcloud />
        </TabPanel>
    </TabContext>
   </div>

</div>

{/* Div a destra contenente il date picker */}
      <div className="right">
      <h4 style={{fontStyle: 'italic'}}>"A long time ago ..." </h4>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DatePicker

          label="Tweets since"
          value={sinceValue}
          onChange={(sinceTemp) => {
            let newDate = new Date(sinceTemp);
            setSinceValue(newDate);
          }}
          renderInput={(params) => <TextField {...params} className={date.root}/>}
        />
        <DatePicker

          label="Until"
          value={untilValue}
          onChange={(untilTemp) => {
            let untilDate = new Date(untilTemp);
            setUntilValue(untilDate);
          }}
          renderInput={(params) => <TextField {...params} className={date.root}/>}
        />
      </LocalizationProvider>
      <Button variant="contained"  size='small' sx={{
        height: '2.2rem',
        backgroundColor: 'rgb(29,161,242)'
      }} onClick={submitDate} endIcon={<AccessTimeIcon />}>
     Search since date
   </Button>
       </div>

    </div>
  </div>
  );
}

export default App;
