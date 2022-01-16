import { Toolbar, AppBar, Typography} from '@mui/material';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import TwitterIcon from '@mui/icons-material/Twitter';
import { Link } from "react-router-dom";
import BallotIcon from '@mui/icons-material/Ballot';
import AddchartIcon from '@mui/icons-material/Addchart';


function NavBar()
{
  return(
    <>
    <div id="title">
    <Typography  variant="h4">
    <Link to="#">
    Twitter <span className="blink">Tracker</span>
    </Link>
    </Typography>
    </div>
    <AppBar position="relative" style={{ color:'rgb(245,248,250)',backgroundColor: ' rgb(23,23,35)', border: '2px solid rgb(29,161,242)', borderRadius: '0.5rem',   boxShadow: '1px 1px 7px 2px rgb(29,161,242)'}} >
  <Toolbar id="toolbar">
      <Link to="/tracker"> <AddchartIcon /> Tracker </Link>
      <Link to="/contest"> <AnalyticsIcon /> Contest</Link>
      <Link to="/trivia"> <BallotIcon /> Trivia</Link>
      <Link to="/streaming"> <TwitterIcon /> Streaming</Link>
  </Toolbar>
</AppBar>
</>)
}


export default NavBar;
