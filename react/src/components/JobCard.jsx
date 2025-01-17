import { useEffect, useState } from 'react';
import { Card, CardActions, CardContent, Button, Typography } from '@mui/material';

export default function JobCard(props) {
  const { packageTitle, timeEst, clientName, address, jobNotes, jobId, completeState, completed, onMarkCompleted, crewSize, compClass, jobs } = props;
  const { rerender, setRerender } = props;
  const [jobComplete, setJobComplete] = useState(jobs.filter(j => j.id === jobId)[0].complete)
  
  useEffect(() => {
    const thisJob = jobs.filter(j => j.id === jobId)[0];
    setJobComplete(thisJob);

    const doRerender = setTimeout(()=> {
      setRerender(!rerender)
      console.log( "render")
    }, 3000)
    return clearTimeout(doRerender)
  }, [jobs, jobId, rerender]);

  const crewTimeEst = crewSize ? parseFloat(timeEst / crewSize).toFixed(2) : timeEst; 
  return (
  <Card className={compClass} sx={{display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "center"}}>     
    <CardContent sx={{display: 'flex'}}>
      <div sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}} >
        <Typography variant="h4" component="div">
          {address}
        </Typography>
        <Typography variant="h5" color="text.secondary">
          {`Approx: ${crewTimeEst} hrs`}
        </Typography>
      </div>
    </CardContent>
    <CardContent>
      <Typography  variant="h5" sx={' font-size: 5000; mt: 1; '} color="text.primary">
        {clientName}
      </Typography>
      <Typography sx={{ mb: 1.5 }} color="text.secondary">
        {packageTitle}
      </Typography>
      <Typography variant="body1">
        {`Notes: ${jobNotes}`}
      </Typography>
    </CardContent>
    {jobComplete && jobComplete.completed && <Typography>Completed! {jobComplete.completed}</Typography>}
    
    <CardActions>

    {jobComplete && !jobComplete.completed && <Button onClick={() => {onMarkCompleted(jobId).then((res) => {setRerender(!rerender)})}}>Mark Completed</Button>}

    </CardActions>
  </Card>
);
}