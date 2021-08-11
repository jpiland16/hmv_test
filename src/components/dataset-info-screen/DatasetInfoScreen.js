import './DatasetInfoScreen.css';
import TitleBar from '../TitleBar';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import {useHistory} from 'react-router-dom'


export default function DatasetInfoScreen() {
  

  const useStyles = makeStyles(() => ({
    title: {
      flexGrow: 1,
    },
  }));

  const classes = useStyles();
 
  return (
    
    <div style={{
      backgroundColor: 'lightskyblue',
      }} >
        <div style={{overflowY: 'auto', height: '100vh'}}> 
      <TitleBar classes={classes} />
      <Box mx='20%' mb='20px'>    
        <h1 style={{textAlign: 'center'}}>Information on Pre-Uploaded Datasets</h1>
        <h2><a href="https://archive.ics.uci.edu/ml/datasets/opportunity+activity+recognition">OPPORTUNITY Activity Recognition Data Set</a></h2>
        <p><b>Abstract from Source:</b> The OPPORTUNITY Dataset for Human Activity Recognition from Wearable, Object, and Ambient Sensors is a dataset devised to benchmark human activity recognition algorithms (classification, automatic data segmentation, sensor fusion, feature extraction, etc). </p>
        <h2><a href="https://www.nature.com/articles/s41597-020-0563-y#Sec6">A database of human gait performance on irregular and uneven surfaces collected by wearable sensors</a></h2>
        <p><b>Abstract from Source:</b> Gait analysis has traditionally relied on laborious and lab-based methods. Data from wearable sensors, such as Inertial Measurement Units (IMU), can be analyzed with machine learning to perform gait analysis in real-world environments. This database provides data from thirty participants (fifteen males and fifteen females, 23.5 ± 4.2 years, 169.3 ± 21.5 cm, 70.9 ± 13.9 kg) who wore six IMUs while walking on nine outdoor surfaces with self-selected speed (16.4 ± 4.2 seconds per trial). This is the first publicly available database focused on capturing gait patterns of typical real-world environments, such as grade (up-, down-, and cross-slopes), regularity (paved, uneven stone, grass), and stair negotiation (up and down). As such, the database contains data with only subtle differences between conditions, allowing for the development of robust analysis techniques capable of detecting small, but significant changes in gait mechanics. With analysis code provided, we anticipate that this database will provide a foundation for research that explores machine learning applications for mobile sensing and real-time recognition of subtle gait adaptations.</p>    <h2><a href="https://archive.ics.uci.edu/ml/datasets/daily+and+sports+activities">Daily and Sports Activities Data Set</a></h2>
        <p><b>Abstract from Source:</b> The dataset comprises motion sensor data of 19 daily and sports activities each performed by 8 subjects in their own style for 5 minutes. Five Xsens MTx units are used on the torso, arms, and legs.</p>
        
      
        </Box> 
 </div>
      
    </div>  

  );
}
