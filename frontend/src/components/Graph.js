import React from 'react';
import Paper from '@material-ui/core/Paper';
import {
  Chart,
  PieSeries,
  Title,
  Legend
} from '@devexpress/dx-react-chart-material-ui';
import { Animation } from '@devexpress/dx-react-chart';

import {makeStyles}  from "@material-ui/core/styles";



let graphStyle = makeStyles({
  root: {
  backgroundColor: 'rgb(23,23,35)',
  color: 'white'
}
})

function Graph(props){

let style = graphStyle();

  const data = [
    { sentiment: 'Positive', area: props.positive },
    { sentiment: 'Negative', area: props.negative },
    { sentiment: 'Neutral', area: props.neutral },
  ];

    return (
      <Paper className={style.root}>
        <Chart
          data={data}
        >
          <PieSeries
            valueField="area"
            argumentField="sentiment"
          />
          <Title
            text="Sentiment Analisys"
          />
          <Animation />
          <Legend />
        </Chart>
      </Paper>
    );
}


export default Graph;
