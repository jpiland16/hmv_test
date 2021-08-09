import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import MaterialCalibrationForm from './MaterialCalibrationForm';
import TitleBar from "../TitleBar"

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
  },
  layout: {
    width: 'auto',
    height: 'auto',
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
      width: 750,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(6),
      padding: theme.spacing(3),
    },
  },
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  button: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1),
  },
}));

export default function UploadScreen() {
  const classes = useStyles();

  return (
    <div style={{overflowY: 'auto', height: '100vh', width: '100vw', backgroundColor: 'lightskyblue'}}>
      <TitleBar />
      <main className={classes.layout}>
        <Paper className={classes.paper}>
          <MaterialCalibrationForm />
        </Paper>
      </main>
    </div>
  );
}