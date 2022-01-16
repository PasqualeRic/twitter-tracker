const express = require('express');
const app = express(); // il vero server
const path = require('path');
const util = require("util");
const request = require("request");
const http = require("http");
const socketIo = require("socket.io");
const answers = require('./api/answers');
const trivia = require('./api/trivia');
var cors = require('cors');
var Twit = require('twit');
var Nominatim = require('nominatim-geocoder');
var sentiment = require('multilang-sentiment');
const post = util.promisify(request.post);
const get = util.promisify(request.get);

let timeout = 0;
const geocoder = new Nominatim;
app.use(express.static(path.join(__dirname, 'build')));
app.use(cors({
    origin: '*'
}));

app.use(express.json());

const server = http.createServer(app);
const io = socketIo(server,{
  cors: {
    origin: '*'
  }
});

// Stiamo direzionando le richieste a http://localhost:8000/api/answers al router che si chiama answer
app.use('/api/answers/', answers);
app.use('/api/trivia', trivia);

const API_key = 'gKlGvfS4M8jSDKf2fItb6fPc3';
const API_key_secret = '0Nqhs2dhg1QdRDUxWbbNw5WVuVWXx81HxxsdMc1LoKP1N2zFkx'
const Bearer_token = 'AAAAAAAAAAAAAAAAAAAAAKXWUgEAAAAA%2FloOSxveawLW7gXgACsbNmRpGZU%3DvhSmT5LFbkDUtr7m5hh8pQADd0qIF79vpNVIUaZDOjhT0iFGDK';
const Access_token = '1447912523790000131-S9kyH0NEhnn7gzazjSWCyPjHZkCOBP';
const Access_token_secret = 'bHtuzl9twVUZReGkp8YkRoaji2KllDfgeVKhxwRSEEyMu';


let client = new Twit({
  consumer_key: API_key, // from Twitter.
  consumer_secret: API_key_secret, // from Twitter.
  access_token: Access_token, // from your User (oauth_token)
  access_token_secret: Access_token_secret, // from your User (oauth_token_secret)
  timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
});


app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});


 async  function getTweetsByHashtag(hashtag){
  let response =  await client.get(`https://api.twitter.com/1.1/search/tweets.json?q=%23${hashtag}&tweet_mode=extended&count=100`);
  let listOfTweets = response.data.statuses;
  return listOfTweets;
}


app.post('/getTweetsByUser', async (req,res)=>{
  let user =  await client.get(`https://api.twitter.com/1.1/search/tweets.json?q=from%3A${req.body.username}&tweet_mode=extended&count=100`);// prende in input il nome utente e restituisce tutti i tweet dell'account.
  if(user.data.statuses === ''){
    res.status(500).send("No tweets founded");
  }else{

    res.status(200).json({tweetInfo: user.data.statuses});			//user.data.statuses restituisce tutte le informazioni di un tweet
  }
});

app.post('/searchByPlace', async (req, res) => {
  const dati = await geocoder.search( {q: req.body.place});
  let query = await client.get('https://api.twitter.com/1.1/geo/reverse_geocode.json?lat='+dati[0].lat+'&long='+dati[0].lon+'&granularity=neighborhood');
  await client.get('search/tweets', { q: 'place:' + query.data.result.places[0].id, tweet_mode:'extended', count: 100 }, function(err, data, response) {
    res.status(200).send({tweetInfo: data.statuses});
  })
});


//api che viene chiamata quando lo user mette hashtag col nome esempio #italiano
app.post('/getTweetsByHashtag', async function(req, res){
//nella request bisogna passare il campo nomeHashtag
   let hash_tag = req.body.nomeHashtag;
  let tweets = await getTweetsByHashtag(hash_tag);
  res.status(200).json({tweetInfo: tweets});
//nella response arriva un json di massimo 100 tweets
})


//prende in input una stringa che deve contentere # nel caso di ricerca per hashtag, stringa normale per utente
//prende in input due date nella forma anno mese giorno, la prima indicherà l'inizio del periodo e la seconda la fine
app.post('/tweetsByPeriod', async (req, res) => {
  if(req.body.tag === '#'){ //dipende dal nome della variabile
  await client.get('search/tweets', { q: '#:'+req.body.tag+req.body.query+' since:' + req.body.sincedate + ' until:' + req.body.untildate, tweet_mode:'extended', count: 100 }, function(err, data, response) {
    res.status(200).json(data);
  })}
  else{
    await client.get('search/tweets', { q: 'from:'+req.body.query+' since:' + req.body.sincedate + ' until:' + req.body.untildate, tweet_mode:'extended', count: 100 }, function(err, data, response) {
      res.status(200).json(data);
  })}
});

app.post('/tweetsByPlaceAndPeriod', async (req, res) => {
  const dati = await geocoder.search( {q: req.body.query});
  let query = await client.get('https://api.twitter.com/1.1/geo/reverse_geocode.json?lat='+dati[0].lat+'&long='+dati[0].lon+'&granularity=neighborhood');

  await client.get('search/tweets', { q: 'place:' + query.data.result.places[0].id + ' since:' + req.body.sincedate + ' until:' + req.body.untildate, tweet_mode:'extended', count: 100 }, function(err, data, response) {
    res.status(200).send(data);
  })
})

app.post('/hashtagAndPlace', async (req, res) => {
  const dati = await geocoder.search( {q: req.body.query});
  let query = await client.get('https://api.twitter.com/1.1/geo/reverse_geocode.json?lat='+dati[0].lat+'&long='+dati[1].lon+'&granularity=neighborhood');
  await client.get('search/tweets', { q: '#:'+req.body.tag+req.body.nomeHashtag+ ' place:' + query.data.result.places[0].id , tweet_mode:'extended', count: 100 }, function(err, data, response) {
    res.status(200).send(data);
  })
})

app.post('/searchContest', async (req, res) => {
  await client.get(`https://api.twitter.com/2/tweets/search/recent?query=%23${req.body.query}%20%23officialContest&tweet.fields=in_reply_to_user_id&max_results=100`, function(err, data, response) {
    res.status(200).json(data);
  })
})

app.post('/searchTrivia', async (req, res) => {
  console.log(req.body);
  await client.get(`https://api.twitter.com/2/tweets/search/recent?query=%23${req.body.query}%20%23officialTrivia&tweet.fields=in_reply_to_user_id&max_results=100`, function(err, data, response) {
    res.status(200).json(data);
  })
})


app.post('/getVotes', async (req, res) => {
  await client.get(`https://api.twitter.com/2/tweets/search/recent?query=%23voteUp%20conversation_id%3A${req.body.id}&tweet.fields=referenced_tweets,in_reply_to_user_id,author_id&max_results=100`, function(err, data, response) {
    res.status(200).json(data);
  })
})

app.post('/analyzeTweets', async (req, res) => {
  var tweets = req.body.tweets.split('$$');
  let score = 0;
  let cPos = 0;
  let cNeg = 0;
  let cNet = 0;
  for (var i in tweets)
  {
    let val = (sentiment(tweets[i], 'it').score);
    if(val > 2)
    {
      cPos++;
    }
    else if(val<-2)
    {
      cNeg++;
    }
    else if(val>= -2 && val <=2){
      cNet++;
    }
  }

  let array = [];
  array.push(cPos);
  array.push(cNeg);
  array.push(cNet);

  res.status(200).send(array);
})



//codice server per lo streaming
const streamURL = new URL(
  "https://api.twitter.com/2/tweets/search/stream?tweet.fields=context_annotations&expansions=author_id"
);

const rulesURL = new URL(
  "https://api.twitter.com/2/tweets/search/stream/rules"
);

const errorMessage = {
  title: "Please Wait",
  detail: "Waiting for new Tweets to be posted...",
};

const authMessage = {
  title: "Could not authenticate",
  details: [
    `Please make sure your bearer token is correct.
      If using Glitch, remix this app and add it to the .env file`,
  ],
  type: "https://developer.twitter.com/en/docs/authentication",
};

const sleep = async (delay) => {
  return new Promise((resolve) => setTimeout(() => resolve(true), delay));
};

app.get("/rules", async (req, res) => {
  if (!Bearer_token) {
    res.status(400).send(authMessage);
  }

  const token = Bearer_token;
  const requestConfig = {
    url: rulesURL,
    auth: {
      bearer: token,
    },
    json: true,
  };

  try {
    const response = await get(requestConfig);

    if (response.statusCode !== 200) {
      if (response.statusCode === 403) {
        res.status(403).send(response.body);
      } else {
        throw new Error(response.body.error.message);
      }
    }

    res.send(response);
  } catch (e) {
    res.send(e);
  }
});

app.post("/rules", async (req, res) => {
  if (!Bearer_token) {
    res.status(400).send(authMessage);
  }

  const token = Bearer_token;
  const requestConfig = {
    url: rulesURL,
    auth: {
      bearer: token,
    },
    json: req.body,
  };

  try {
    const response = await post(requestConfig);

    if (response.statusCode === 200 || response.statusCode === 201) {
      res.send(response);
    } else {
      throw new Error(response);
    }
  } catch (e) {
    res.send(e);
  }
});

const streamTweets = (socket, token) => {
  let stream;

  const config = {
    url: streamURL,
    auth: {
      bearer: token,
    },
    timeout: 31000,
  };

  try {
    const stream = request.get(config);

    stream
      .on("data", (data) => {
        try {
          const json = JSON.parse(data);
          if (json.connection_issue) {
            socket.emit("error", json);
            reconnect(stream, socket, token);
          } else {
            if (json.data) {
              socket.emit("tweet", json);
              console.log("tweet partito");
            } else {
              socket.emit("authError", json);
            }
          }
        } catch (e) {
          socket.emit("heartbeat");
        }
      })
      .on("error", (error) => {
        // Connection timed out
        socket.emit("error", errorMessage);
        reconnect(stream, socket, token);
      });
  } catch (e) {
    socket.emit("authError", authMessage);
  }
};

const reconnect = async (stream, socket, token) => {
  timeout++;
  stream.abort();
  await sleep(2 ** timeout * 1000);
  streamTweets(socket, token);
};

io.on("connection", async (socket) => {
  try {
    const token = Bearer_token;
    io.emit("connessione", "Client connected");
    const stream = streamTweets(io, token);
  } catch (e) {
    io.emit("authError", authMessage);
  }
});



//avvio server in ascolto sulla porta 8001
server.listen(8001, function () {
    console.log('Server is running on port 8001');
});

module.exports.client = client;
