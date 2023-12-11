import  {useState, useEffect} from 'react'; 
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { makeStyles } from '@mui/styles';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import siglogo from './signature.png';
import karanilogo from './karanisigtrans.png';
import Zoom from '@mui/material/Zoom';
import Background from './stripes-light.png'
import Twitter from '@mui/icons-material/Twitter';
import metadata from './metadata.json';
import { Divider } from '@mui/material';
import './AlbumPage.css';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'...And thank all you artists who made this possible!'}
    </Typography>
  );
}

const AlbumPage = ({defaultFilter = "chino"}) => {
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

  const classes = useStyles();
  const [listOfImages, setListOfImages] = useState({reference: [], list: []});

  function importAll(r) {
    return r.keys().map(r);
  }
  function cutName(name)
  {
    return metadata[name].name;
  }
  function cutTwitter(name)
  {
    return metadata[name]?.twitter;
  }
  function cutArtist(name)
  {
    return metadata[name].artist;
  }

  useEffect(() => 
  {
    const images = importAll(require.context('./images/', false, /\.(png|gif|jpe?g|svg)$/));
    const compressedImages = importAll(require.context('./compressed_images/', false, /\.(png|gif|jpe?g|svg)$/))
    const combinedImages = images.map((path, index) => ({path, compressedPath: compressedImages[index]}));
    //TODO: DON'T IMPORT ALL BEFORE DOING THIS FILTERING
    const imagesWithFileNames = combinedImages.map(image => {
      const regex = /\/refsite\/static\/media\/(.*?)\.([a-zA-Z0-9]+)$/;
      const match = image.path.match(regex);
      console.log('here is match', image.path, match)
      var fileName = match[1].split('.').shift(); // Text between /refsite/static/media/ and the first dot (.)
      var fileExtension = image.path.split('.').pop(); // File extension
      const path = `${fileName}.${fileExtension}`.replace(/@.*(?=\.)/g, '');
      return {...image, fileName: path};
    })
    console.log(metadata);
    const filteredCombinedImages = imagesWithFileNames.filter((image) =>  {
    return metadata[image.fileName]?.tags.includes(defaultFilter)
  })
    const refImages = filteredCombinedImages.filter(image => image.path.match(/Reference/g));
    const nonRefImages = filteredCombinedImages.filter(image => !image.path.match(/Reference/g));
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
          {cutName(image.fileName)}
          </Typography>
          <Typography>
            <b>Artist:</b> { !!cutTwitter(image.path) ? <Link  rel="noopener noreferrer" target="_blank" href={"https://twitter.com/" + (cutTwitter(image.fileName) === "same" ? cutArtist(image.fileName) : cutTwitter(image.fileName))}>{cutArtist(image.fileName)}&nbsp;<Twitter fontSize="inherit"/></Link> : cutArtist(image.fileName)}
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
    <>
      <AppBar src="relative">
        <Toolbar>
          <img src={defaultFilter === 'chino' ? siglogo : karanilogo} className={classes.icon} style={{height:32,}}/>
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
    </>
  )
}

export default AlbumPage;