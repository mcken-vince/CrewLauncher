import { useState, Fragment } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';


export default function NewDrawer(props) {
  // pass in anchor as props 'left', 'right', 'top', 'bottom'
  const anchor = props.anchor || 'right';
  const { items, openButtonText, closeButtonText, compClass } = props;
  const [drawerOpen, setDrawerOpen] = useState(false);


  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };
  let drawerWidth;

  if (props.width) {
    drawerWidth = props.width;
  } else if (anchor === 'top' || anchor === 'bottom') {
    drawerWidth = 'auto';
  } else {
    drawerWidth = 320;
  }

  const list = (anchor) => (
    <Box
      sx={{ width: drawerWidth }}
      role="presentation"
    >
      <Button  onClick={toggleDrawer(anchor, false)} variant="contained">{closeButtonText}</Button>
      {items}
      
    </Box>
  );

  return (
    <>
      <Button onClick={toggleDrawer(anchor, true)}>{openButtonText}</Button>
      <Drawer
        anchor={anchor}
        open={drawerOpen}
        onClose={toggleDrawer(anchor, false)}
        className={compClass}
      >
        {list(anchor)}
      </Drawer >
    </>
  );
}