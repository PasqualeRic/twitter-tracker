import React, {useState} from "react";
import {Button} from '@mui/material';
import ColumnGraph from './ColumnGraph';




export default function Scoreboard(props)
{

  const [array, setArray] = useState([]);

  let arr = [];

  function showScoreboard()
  {
      //qui prendiamo tramite props da Trivia tutte le risposte e andiamo a fare il check di correttezza
      console.log(props);
      let i = 0;
      for(let tweet in props.replies.data)
      {

        let utenteT = props.replies.data[tweet].text.split('#')[3];
        utenteT = utenteT.replaceAll('\n', '');
        arr.push({bookname : utenteT, votecount : 0});
        let answer1 = props.replies.data[tweet].text.split('#')[5];
        answer1 = answer1.replaceAll('\n', '');
        let answer2 = props.replies.data[tweet].text.split('#')[7];
        let answer3 = props.replies.data[tweet].text.split('#')[9];
        let cor1 = props.correctAnswers.first.replaceAll('#','');
        let cor2 = props.correctAnswers.second.replaceAll('#','');
        let cor3 = props.correctAnswers.third.replaceAll('#','');
        console.log('risposta corretta 1',cor1);
        console.log('risposta corretta 2',cor2);
        console.log('riposta data 1',answer1);
        console.log('riposta data 2',answer2);
        console.log(cor1, answer1)

        if(answer1 == 'domandainutile\n')
        {
          console.log('Boh dimmi tu');
        }
        if(answer1 === cor1)
        {
          console.log('1 corretto');
          arr[tweet].votecount += 10;
        }
        else{
          console.log('1 sbagliato');
        }

        if(answer2 != undefined)
        {
          answer2 = answer2.replaceAll('\n', '');
          if(answer2 === cor2)
          {
            console.log('2 corretto');
            arr[tweet].votecount += 10;
          }
          else{
            console.log('2 sbagliato');
          }
        }

        if(answer3 != undefined)
        {
          answer3 = answer3.replaceAll('\n', '');
          if(answer3 === cor3)
          {
            console.log('3 corretto');
            arr[tweet].votecount += 10;
          }
          else{
            console.log('3 sbagliato');
          }
        }

        setArray(arr);


      }
      // quindi prima dovremmo prendere dal server le risposte giuste nel file json corrispondente al nome del trivia
      // ce lo passiamo tramite props
  }

  const showGraph = () => {

      console.log('array', array);
      return(
        <React.Fragment>
        <ColumnGraph list={array} />
        </React.Fragment>
      );


  };

  return(
    <div>
    <Button variant="contained"  size='small'  sx={{
      height: '2.2rem',
      backgroundColor: 'rgb(29,161,242)'
    }} onClick={showScoreboard}>Show Scoreboard</Button>
    <div id="statistiche">
    {showGraph()}
    </div>
    </div>
  )
}
