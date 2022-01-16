import {Autocomplete} from '@mui/material';
import {withStyles}  from "@material-ui/core/styles";



const CustomAutocomplete = withStyles({
  root :{
    width: '100%'
  },
  tag: {
    backgroundColor: "rgb(29,161,242)",
     height: 24,
     position: "relative",
     zIndex: 0,
     "& .MuiChip-label": {
      color: 'rgb(29,161,242)'
     },
     "& .MuiChip-deleteIcon .MuiSvgIcon-root": {
        color: "rgb(29,161,242)",
     }
   },
groupLabel: {
  color: 'white'
},
inputFocused: {
  color: 'white'
},
popupIndicator: {
  color: 'white'
},
listbox: {
  color: 'rgb(29,161,242)'
},

})(Autocomplete);


export default CustomAutocomplete;
