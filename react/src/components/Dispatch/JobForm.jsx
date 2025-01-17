import { useHistory, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

import { addHours, format, isAfter, isBefore, setHours } from 'date-fns'
import { Stack, Box, Button, Typography, Alert, Snackbar, Grid, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import classNames from 'classnames';

import { getInfoForJobForm, getEstTime } from './dispatchDataHelper';
import SpeedDial from '../SpeedDial';
import TimePicker from '../Timepicker';

const JobForm = (props) => {
  const params = useParams();
  const browserHistory = useHistory();
  
  const { onEdit, crews, packages, contracts, jobs } = props
  const thisJob = params.id ? jobs.filter(j => j.id === params.id) : null;
  const [selectedCrew, setSelectedCrew] = useState(thisJob ? thisJob.crewId : 0)
  const [time, setTime] = useState(new Date())
  const [status, setStatus] = useState({error: false, success: false, message:""});
  const [error, setError] = useState([]);
  const [rocketClass, setRocketClass] = useState(false);

  const rocketClasses = classNames('rocket', {blastOff: rocketClass});

  const errorMessage = [];
  const job = getInfoForJobForm(jobs, contracts, packages, parseInt(params.id));

  useEffect(() => {
    setSelectedCrew(thisJob.crewId)
  },[thisJob.crewId])
  
  if (jobs[1]) {

    const estTime = getEstTime(job.packageManHours, (selectedCrew ? crews[selectedCrew - 1] : {crew_size: 1}))
    const date = format(new Date(job.date), 'EEE MMM dd yyyy')

    // Called on push of submit button.
    // Start time must be between 6:00 and 18:00
    const validate = function(time, selectedCrew) {
      if (isAfter(new Date(time), setHours(new Date(time), 6)) && isBefore(new Date(time), setHours(new Date(time), 18)) && selectedCrew) {
        return save(time, selectedCrew)
        .then(() => {
          setRocketClass(true);
          setTimeout(() => {
            
            setRocketClass(false);
          }, 1950);
        })
      } else if (!selectedCrew) {
        errorMessage.push('Select A Crew To Launch!');
      } else {
        errorMessage.push('Select A Time For Launch!');
      }
      setTimeout(() =>{
        setError([])
      }, 2000)
      setError(errorMessage);
    }

    // Call props.onEdit to save job details to database and update state
    // Load up form for the next job on the list if there is one
    // If not, redirect to /dispatch
    const save = function(time, selectedCrew) {
      const endTimeString = addHours(time, estTime)
      const endTime = format(endTimeString, 'kk')
      const startTime = format(time, 'kk')
      return onEdit(selectedCrew, startTime, endTime, job, parseInt(params.id))
      .then((response) => {
        setStatus({error: false, success: true, message: "Crew Launched successfully!"})
        setTimeout(() => {
          const nextJob = jobs.filter(job => {
            return (!job.crew_id && job.id !== parseInt(params.id))
          })[0];
          setTime(setHours(new Date(time), 6))
          setSelectedCrew(null)
          if (nextJob)  {
            return browserHistory.push(`/dispatch/jobs/${nextJob.id}`)
          }
          return browserHistory.push('/dispatch')
        }, 2000);
      })
      .catch((err) => { 
          setStatus({ success: false, error: true, message: "Failure To Liftoff!"});
      })
    }

    const Item = styled(Paper)(({ theme }) => ({
      ...theme.typography.body2,
      padding: theme.spacing(1),
      textAlign: 'center'
    }));

    return (
      <Box width={'100%'}>
        <Snackbar anchorOrigin={{vertical: 'top', horizontal: 'right'}} open={status.success || status.error} autoHideDuration={2000} onClose={() => setStatus({success: false, error: false, message: ""})}>
          <Alert onClose={() => setStatus({success: false, error: false, message: ""})}
            severity={status.error ? 'error' : 'success'} sx={{ width: '100%' }}>
            {status.message}
          </Alert>
        </Snackbar>
        <Stack spacing={5} sx={{maxHeight: 800,minHeight: 550, maxWidth: 900, alignItems: 'center',  margin: 'auto'}}>
          <Item className="page-header" >
            <Typography variant="h3" color="#DBEAF3" >
            Edit Job
            </Typography>
          </Item>
          <Grid container rowSpacing={5} columnSpacing={{ xs: 1, sm: 2, md: 3 }} sx={{justifyContent: 'center'}}>

            <Grid item xs={3}>
              <Item sx={{ fontSize: 24}}> Date: {date} </Item>
            </Grid>
            <Grid item xs={4}>
              <Item sx={{ fontSize: 24}}>  Package: {job.packageTitle}  </Item>
            </Grid>
            <Grid item xs={4}>
              <Item sx={{ fontSize: 24}}>  Address: {job.contractAddress}  </Item>
            </Grid>
            <Grid item xs={11}>
              <Item sx={{ fontSize: 24}}>  Job Notes: {job.contractJobNotes}  </Item>
            </Grid>
            <Grid item xs={5.5}>
              <Item sx={{ fontSize: 24}}>  Total Man Hrs :  {job.packageManHours} Hours   </Item>
            </Grid>
            <Grid item xs={5.5}>
              {estTime > 1 ? <Item sx={{ fontSize: 24}}> Crew Time Estimate : {estTime} Hours </Item> : estTime <= 1 && <Item sx={{ fontSize: 24}}> Crew Time Estimate : {estTime} Hour </Item>}
            </Grid>
        
          </Grid>
          
          {error.length > 0 && <Alert severity="error">{`${error.join(', ')}`}</Alert>}

          <Button sx={{maxHeight: 50}} variant="contained" onClick={() => {validate(time, selectedCrew)}}>🚀 Launch Crew 🚀</Button>
        </Stack>
        <Item sx={{ maxHeight: 400, maxWidth: 200, alignItems: 'center', alignContent: 'center', margin: 'auto'}}>
            <TimePicker startDate={time} onChange={setTime}/>
            <div>
            <Typography className={rocketClasses} >🚀</Typography>
            <SpeedDial crews={crews} onChange={setSelectedCrew} selectedCrew={selectedCrew}/>
            </div>
        </Item>
      </Box>
    );
  }
  return null;
};

export default JobForm;