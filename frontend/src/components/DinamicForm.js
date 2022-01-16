import React, {useState, useEffect} from "react";
import {Button} from '@mui/material';
import '../styles/dinamic.css';


function Dinamic(props){
  const [buttons, setButtons] = useState([]);
  const [count, setCount] = useState(1);
  const[checkQuestion1, setcheck1] = useState('');
  const[checkQuestion2, setcheck2] = useState('');
  const[checkQuestion3, setcheck3] = useState('');
  const[checkAnswer1, setAnswer1] = useState('');
  const[checkAnswer2, setAnswer2] = useState('');
  const[checkAnswer3, setAnswer3] = useState('');

  function choosePlaceholder()
  {
    if(count === 1)
      return(['How high is Eiffel tower? #300meters #150meters #100meters', '#300meters'])
    else if(count === 2)
      return(['Is IT university difficult ? #Yes #No', '#Yes'])
    else
      return(["Which is the best town in Italy? #Policoro #Sassari", "#Policoro"])
  }

function checkEmpty()
{

  if((count === 2 && checkQuestion1 === '') || (count === 2 && checkAnswer1 === ''))
    return false;
  else if((count ===3 && checkQuestion2 === '') || (count === 3 && checkAnswer2 === ''))
    return false;
  else
    return true;

}



  return (
    <div className="dinamic">
    <span id="dinamicError"></span>
      <Button variant="contained"  size='small'  sx={{
        height: '2.2rem',
        backgroundColor: 'rgb(29,161,242)'}}
        onClick={() => {

          if(checkEmpty()){

            let placeholder, correctAnswer;
            [placeholder, correctAnswer] = choosePlaceholder();

            if(count === 3)
            {
              document.getElementById('dinamicError').innerHTML =" Max number of questions reached";
            }
            if(buttons.length < 3) // massimo delle domande che possiamo aggiungere
            {
              setButtons([...buttons, <div id="form">
                <label for="answer"><b>Insert question {count}</b> with possible responses in the form #answer1 #answer2</label>
                <textarea type="text" className="question" id="question" placeholder={placeholder} onChange={(event, val) => {
                  if(count === 1)
                    {
                      setcheck1(event.target.value)
                      props.questionToParent(1, event.target.value);
                    }
                  else if(count ===2)
                    {
                      setcheck2(event.target.value)
                      props.questionToParent(2, event.target.value);
                    }
                  else if(count ===3)
                    {
                      setcheck3(event.target.value)
                      props.questionToParent(3, event.target.value);
                    }
                }} />
                <label for="answer">Which is the correct answer ?</label>
                <input type="text" className="answer" id="answer"placeholder={correctAnswer} onChange={(event, val) => {
                  if(count === 1)
                    {setAnswer1(event.target.value);
                    props.answerToParent(1, event.target.value);}
                  else if(count ===2)
                    {setAnswer2(event.target.value);
                    props.answerToParent(2, event.target.value);}
                  else if(count ===3)
                    {setAnswer3(event.target.value);
                    props.answerToParent(3, event.target.value);}
                }}/>
                </div>]);
            }
            setCount(count + 1);
         }else {
           document.getElementById('dinamicError').innerHTML =" You should insert the question first";

         }
      }}
      >Add question </Button>
      <div className="canvos">{buttons}</div>
    </div>
  );
}

export default Dinamic;
