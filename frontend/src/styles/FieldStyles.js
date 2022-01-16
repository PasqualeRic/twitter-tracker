import {makeStyles}  from "@material-ui/core/styles";

const fieldStyles= makeStyles({
  root: {
    "& .MuiOutlinedInput-input": {
      color: "rgb(245,248,250)"
    },
    "& .MuiInputLabel-root": {
      color: " rgb(245,248,250)"
    },
    "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
      border: "2px solid rgb(29,161,242)",
       boxShadow: '1px 1px 7px 2px rgb(29,161,242)'
    },
    "&:hover .MuiOutlinedInput-input": {
      color: "rgb(245,248,250)"
    },
    "&:hover .MuiInputLabel-root": {
      color: "rgb(245,248,250)"
    },
    "&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
        border: "2px solid rgb(29,161,242)",
         boxShadow: '1px 1px 7px 2px rgb(29,161,242)'
    },
    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-input": {
      color: " rgb(245,248,250)"
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: " rgb(245,248,250)"
    },
    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
      border: "2px solid rgb(29,161,242)",
       boxShadow: '1px 1px 7px 2px rgb(29,161,242)'
    },
    '& .MuiSvgIcon-root':{
      color: 'rgb(29,161,242)'
    },
    '& .MuiAutocomplete-tag':{
      backgroundColor: 'rgb(245,248,250)'
    }
  }
})



export default fieldStyles;
