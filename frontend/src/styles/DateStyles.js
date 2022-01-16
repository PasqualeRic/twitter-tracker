import {makeStyles}  from "@material-ui/core/styles";



const dateStyles = makeStyles({
  root: {
  '& .MuiSvgIcon-root':{
    color: 'rgb(245,248,250)'
  },
  '& .MuiOutlinedInput-input':{
      color: 'rgb(245,248,250)',
      borderColor: 'rgb(29,161,242)'
  },
  '& .MuiInputLabel-root':{
    color: 'rgb(245,248,250)',

  },
  '& .MuiFormControl-root':{
    borderColor: 'rgb(29,161,242)'
  },
  '& .MuiOutlinedInput-notchedOutline ':{
    borderColor: 'rgb(29,161,242)',

  },
  '&:hover .MuiOutlinedInput-notchedOutline .MuiOutlinedInput-root':{
    borderColor: 'rgb(29,161,242)'
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "rgb(29,161,242)"
  },
  "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "rgb(29,161,242)",
  },
    }
})


export default dateStyles;
