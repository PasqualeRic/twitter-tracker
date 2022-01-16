import React from "react";
import Paper from '@material-ui/core/Paper';

import {
  ArgumentAxis,
  ValueAxis,
  Chart,
  BarSeries,
} from '@devexpress/dx-react-chart-material-ui';


function ColumnGraph(props){


// Sample data
let data = [];


for (let x in props.list) {
  data = data.concat({ argument: props.list[x].bookname, value: props.list[x].votecount });
}



return (
    <Paper>
    <Chart
      data={data}
    >
      <ArgumentAxis />
      <ValueAxis />
      <BarSeries valueField="value" argumentField="argument" />
    </Chart>
  </Paper>
);
}

export default ColumnGraph;
