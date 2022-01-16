/* Funzione che renderizza i tweet solo se sono retweets*/
function retweetedStatus(current)
{
  let result = current.retweeted_status.full_text.split(' ');
  for(let i=0; i < result.length; i += 1)
  {
    if(result[i].includes('http'))
    {
      result[i] = `<a href='${result[i]}' target="_blank">${result[i]}</a>`;
    }else if(result[i].includes('#'))
    {
      let nw = result[i].split('#');
      result[i] = `<a href='https://twitter.com/hashtag/${nw[1]}?src=hashtag_click' target="_blank">${result[i]}</a>`;
    }
  }
  result = result.join(' ');
  if (current.entities.user_mentions[0].screen_name !== undefined) {
    return (`<p> RT @${current.entities.user_mentions[0].screen_name}: ${result} </p>`);
  }
  else {
    return (`<p> ${result} </p>`);
  }
}
/* Funzione che renderizza i tweet solo se NON sono retweets*/
function notRetweetedStatus(current)
{
  let result = current.full_text.split(' ');
  for(let i=0; i < result.length; i += 1)
  {
    if(result[i].includes('http'))
    {
      result[i] = `<a href='${result[i]}' target="_blank">${result[i]}</a>`;
    }else if(result[i].includes('#'))
    {
      let nw = result[i].split('#');
      result[i] = `<a href='https://twitter.com/hashtag/${nw[1]}?src=hashtag_click' target="_blank">${result[i]}</a>`;
    }
  }
  result = result.join(' ');
  return ( `<p> ${result} </p>`);
}
/* Crea l'oggetto json da mandare al server*/
function createObj(name, text)
{
  const toSend = `{
    "${name}" : "${text}"
  }`;
  const options = {
       method: 'POST',
       headers: { "Content-Type": "application/json" },
        body: toSend
     };
     let toReturn = options;
  return  toReturn;
}

function sortByKey(array, key) {
  return array.sort(function(a, b) {
      var x = a[key];
       var y = b[key];
      return ((x <= y) ? -1 : ((x > y) ? 1 : 0));
  })};

/*function sortBySubArray(array, sub, key) {
    return array.sort(function(suba, subb) {
        var x = suba[key];
         var y = subb[key];
        return ((x <= y) ? -1 : ((x > y) ? 1 : 0));
    })};*/

function eliminaduplicati(array){
    array = array.filter((value, index, self) =>
      index === self.findIndex((t) => (
        t.referenced_tweets[0].id === value.referenced_tweets[0].id && t.author_id === value.author_id
      ))
    )
    return array;
    }


/* I votes sono intesi come i tweet di risposta al libro*/
function statistics(votes)
{
  console.log(votes);
  let currentId = votes[0].author_id;
  let count = 0;
  let allbooks=[];
  let allvotes=[];
  let bookwithvotes=[];
  // i 10 voti piu recenti ordinati temporalmente e per utente per ogni utente
  let realVotes = [];
  // IN QUESTO FOR PRENDIAMO ESATTAMENTE I 10 + RECENTI PER OGNI UTENTE
  for(let x in votes)
  {
    if (currentId === votes[x].author_id)  //siamo sullo stesso utente
    {
       if (count > 10) //abbiamo superato il limite di 10 voti
       {
         count += 1;
       }
       else //siamo a meno di 10 voti
       {
         count += 1;
         realVotes.push(votes[x]);
       }
    }
    else  //abbiamo cambiato utente
    {
      currentId = votes[x].author_id;
      count=0;
      realVotes.push(votes[x]);
      count += 1;
    }

  }
  //creo 2 array, uno con i nomi dei libri unici e l'altro con la conta dei voti per quel libro
  for (let x in realVotes) {
    let testo = realVotes[x].text.split('#');
    testo = testo[2].split(' '); //per sicurezza se dopo l'hashtag ho altro testo
    let name = testo[0];
    if (allbooks.includes(name)) {
      let indice = allbooks.indexOf(name);
      allvotes[indice] += 1;
    }
    else {
      allbooks.push(name);
      allvotes.push(1);
    }
  }
  //unisco i 2 array in un unico array di oggetti
  for (let x in allbooks) {
    bookwithvotes[x] = {
      bookname:allbooks[x],
      votecount:allvotes[x]
    }
  }
  //ordino l'array appena creato
  sortByKey(bookwithvotes,'votecount');
  console.log(bookwithvotes);

  return(bookwithvotes);
}


function createJsonToSend(answer1, answer2, answer3)
{
    const toSend=`{
      "first": "${answer1}",
      "second": "${answer2}",
      "third": "${answer3}"
    }`;

    return toSend;
}
function extractQuestions(text)
{
  let splitted = text.split(' ');
  console.log(splitted);

  let real = [];
  for(let x in splitted)
  {
    if(splitted[x].includes('Question'))
    {
      real.push(splitted[x]);
    }
  }
console.log(real.length);
return real;


}
export {retweetedStatus, notRetweetedStatus, createObj, sortByKey, eliminaduplicati, statistics, createJsonToSend, extractQuestions};
