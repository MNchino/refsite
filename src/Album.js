import React, {useState, useEffect} from 'react'; 
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Link from '@material-ui/core/Link';
import siglogo from './signature.png';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import Zoom from '@material-ui/core/Zoom';
import Background from './stripes-light.png'
import './Album.css';
import Twitter from '@material-ui/icons/Twitter';
import { Divider } from '@material-ui/core';


const getMuiTheme = ()=> createMuiTheme({
  palette: {
    primary: {
      main:  "#43a047",
    }
  },
});

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'...And thank all you artists who made this possible!'}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  icon: {
    marginRight: theme.spacing(2),
  },
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0, 6),
  },
  heroButtons: {
    marginTop: theme.spacing(4),
  },
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
    backgroundImage: `url(${Background})`
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  cardMedia: {
    paddingTop: '100%', // 16:9
  },
  cardContent: {
    flexGrow: 1,
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6),
  },
}));

export default function Album() {
  const classes = useStyles();
  const [listOfImages, setListOfImages] = useState({reference: [], list: []});

  function importAll(r) {
    return r.keys().map(r);
  }
  function cutName(name)
  {
    var temp = name.match("[^\/]+$");
    temp = ("").concat(temp);
    const nextPivot = temp.indexOf("@")
    temp = temp.substr(0, nextPivot)
    return temp;
  }
  function cutTwitter(name)
  {
    var temp = name.match("[^\/]+$");
    temp = ("").concat(temp);
    if (temp.indexOf("@_tw") < 0)
      return null
    const pivot = temp.indexOf("@_tw")
    const nextPivot = temp.indexOf("@", pivot + 3)
    if (pivot + 4 === nextPivot)
    {
      return "same"
    }
    return temp.substr(pivot + 4).split('@')[0];
  }
  function cutArtist(name)
  {
    var temp = name.match("[^\/]+$");
    temp = ("").concat(temp);
    temp = temp.substr(temp.lastIndexOf("@") + 1)
    temp = temp.substr(0, temp.indexOf("."))
    return temp;
  }

  useEffect(() => 
  {
    const images = importAll(require.context('./images/', false, /\.(png|gif|jpe?g|svg)$/));
    const compressedImages = importAll(require.context('./compressed_images/', false, /\.(png|gif|jpe?g|svg)$/))
    const combinedImages = images.map((path, index) => ({path, compressedPath: compressedImages[index]}));
    const refImages = combinedImages.filter(image => image.path.match(/Reference/g));
    const nonRefImages = combinedImages.filter(image => !image.path.match(/Reference/g));
    setListOfImages({reference: refImages, list: nonRefImages});
  }, [])

  const createImageTile = (image, index) => (
    <Zoom
    in={true}
    style={{transitionDelay: index*20 }}
  >
    <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
      <Card height={4} className={classes.card}>
        <CardMedia
          className={classes.cardMedia}
          image={image.compressedPath}
          title={image.path.match("[^\/]+$")}
        />
        <CardContent className={classes.cardContent}>
          <Typography gutterBottom variant="h5" component="h2">
          {cutName(image.path)}
          </Typography>
          <Typography>
            <b>Artist:</b> { !!cutTwitter(image.path) ? <Link  rel="noopener noreferrer" target="_blank" href={"https://twitter.com/" + (cutTwitter(image.path) === "same" ? cutArtist(image.path) : cutTwitter(image.path))}>{cutArtist(image.path)}&nbsp;<Twitter fontSize="inherit"/></Link> : cutArtist(image.path)}
          </Typography>
        </CardContent>
        <CardActions>
          <Button href={image.path} target="_blank" size="small" color="primary">
            View
          </Button>
        </CardActions>
      </Card>
    </Grid>
  </Zoom>
  );

  return (
    <React.Fragment>
      <CssBaseline />
      <MuiThemeProvider theme={getMuiTheme()}>
      <AppBar src="relative">
        <Toolbar>
          <img src={siglogo} className={classes.icon} />
          <Typography variant="h6" color="inherit" noWrap>
            Reference Sheet Site
          </Typography>
        </Toolbar>
      </AppBar>
      <main>
        {/* Hero unit */}
        <div className={classes.heroContent}>
          <Container maxWidth="sm">
            <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
              <br/>You found my refsite!
            </Typography>
            <Typography variant="h5" align="center" color="textSecondary" paragraph>
              Hiya! I slapped this quick site together in React so ya'll could access my refs without me having to post 'em all the time. Feel free to have a look!
            </Typography>
          </Container>
        </div>
        <Container className={"" + "animatedBackground "  +classes.cardGrid} maxWidth="false">
          <Card style={{padding: '24px', marginBottom: '24px'}}>
            <Typography component="h2" variant="h4" align="center" color="textPrimary" gutterBottom>
              <br/>Main References
            </Typography>
            <Grid container spacing={2}>
              {listOfImages.reference.map(createImageTile)}
            </Grid>
          </Card>
          <Divider style={{marginBottom: '24px'}}/>
          <Grid container spacing={2}>
            {listOfImages.list.map(createImageTile)}
          </Grid>
        </Container>
      </main>
      {/* Footer */}
      <footer className={classes.footer}>
        <Typography variant="h6" align="center" gutterBottom>
          Thank you for visiting!
        </Typography>
        <Typography variant="subtitle1" align="center" color="textSecondary" component="p">
          You're really awesome for checking this all out.
        </Typography>
        <Copyright />
      </footer>
      {/* End footer */}
      </MuiThemeProvider>
    </React.Fragment>
  );
}
