import {parole} from '../App.js'
import "d3-transition";
import { select } from "d3-selection";
import React from "react";
import ReactWordcloud from "react-wordcloud";

import "tippy.js/dist/tippy.css";
import "tippy.js/animations/scale.css";


function getCallback(callback) {
  return function (word, event) {
    const isActive = callback !== "onWordMouseOut";
    const element = event.target;
    const text = select(element);
    text
      .on("click", () => {
        if (isActive) {
          window.open(`https://www.ecosia.org/search?q=${word.text}`, "_blank");
        }
      })
      .transition()
      .attr("font-size", isActive ? "300%" : "190%")

  };
}
const callbacks = {
  onWordClick: getCallback("onWordClick"),
  onWordMouseOut: getCallback("onWordMouseOut"),
  onWordMouseOver: getCallback("onWordMouseOver")
};
const options = {
  colors: ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b"],
  fontSizes: [20,60]
};
function SimpleWordcloud() {
  let array=[]
  let array_parole = []
  let parola
  var conta = 0
  let array_conta = []

  for(var i in parole){
    for(var pasquale in parole[i].split(" "))
    {
      array.push(parole[i].split(" ")[pasquale])
    }
  }
  const arrayfiltrato = array.filter(function(ele,pos){
    return array.indexOf(ele)===pos;
  })
  const result = arrayfiltrato.filter(word => word.length > 2);
  for(var k in result)
  {
    for(var j in array)
    {
      parola = result[k]
        if(parola === array[j])
        {
          conta+=1
        }
    }
    array_conta.push(conta)
    conta = 0
  }
    for(var x in result)
    {
      if(array_conta[x]>1 && result[x].substring(0,5) !== 'https' && result[x].substring(0,1) !== '#' && result[x].substring(0,1) !== '@')
      {
        array_parole.push({text:result[x], value : array_conta[x]})
      }
    }

  return <div style={{ height: 400, width: 800, margin: "auto" }}><ReactWordcloud options = {options} callbacks={callbacks} words={array_parole} /></div>
}
export default SimpleWordcloud;
