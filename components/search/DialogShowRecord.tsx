import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Chip from '@mui/material/Chip';
import { Typography } from '@mui/material';
export default function DialogShowRecord(props) {


  return (
    <div>
      <Dialog
        open={props.open}
        onClose={props.handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Record Selected
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
          <Typography variant='h6' sx={{mb: 4}}>
          {props.data.title} 
          </Typography>
          <Chip label={props.data.category} variant="outlined" color="primary"/>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          
          <Button onClick={props.handleClose} autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}