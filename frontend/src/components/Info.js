import  {React, useState} from 'react';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';

function Info() {
  const [anchorEl, setAnchorEl] = useState(null);

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <div>
      <Typography
        aria-owns={open ? 'mouse-over-popover' : undefined}
        aria-haspopup="true"
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
      >
      <button id="info">
     i
   </button>
      </Typography>
      <Popover
        id="mouse-over-popover"
        sx={{
          pointerEvents: 'none',
        }}
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        <Typography sx={{
          p: 2,
          backgroundColor: '  rgb(23,23,35)',
          color: 'rgb(245,248,250)'
        }}>Learn how to use the query bar !
        <p>For a normal query select one tag</p>
        <ul>
         <li>#</li>
         <li>user</li>
         <li>place</li>
         </ul>
         <p>And add the word to search for (i.e Bologna)</p>
         <p>For a multiple search you can use: </p>
         <ul>
          <li># + place + word to search for + place to search for (the order is important !)</li>
          </ul>
        </Typography>
      </Popover>
    </div>
  );
}

export default Info;
