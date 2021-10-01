import { useState } from 'react';
import {  Link,NavLink, useRouteMatch } from 'react-router-dom';
import {  Toolbar, Drawer, MenuList, MenuItem, AppBar, Box, Divider, CssBaseline, IconButton, Button } from '@mui/material';
import MenuIcon from '@mui/icons-material/MenuOpen';

const drawerWidth=300;
const activeLink = {color: "red"};

const Navigation = () => {
  const [navOpen, setNavOpen] = useState(true);
  const { url } = useRouteMatch();

  return (<>
      <AppBar position="fixed"

       >
          <Toolbar>
            <IconButton
              onClick={()=>setNavOpen(!navOpen)}
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        
      <CssBaseline />
    <Drawer open={navOpen} variant='persistent' position='static' anchor='left'
      sx={{display: { xs: 'block', sm: 'block' },
      '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
    }}>
          <Button><h1 onClick={()=> setNavOpen(!navOpen)}>Crew🚀Launcher</h1></Button>
          <Divider />
      <Toolbar>
        <MenuList>
          <MenuItem exact component={NavLink} to='/dispatch' activeStyle={activeLink}> 🚀 Dashboard 🚀</MenuItem>
          <MenuItem component={NavLink} to={`${url}/crews`} activeStyle={activeLink}>🚀 Crews</MenuItem>
          <MenuItem exact component={NavLink} to={`${url}/clients`} activeStyle={activeLink}>🚀 Clients</MenuItem>
          <MenuItem exact component={NavLink} to={`${url}/contracts`} activeStyle={activeLink}>🚀 Contracts</MenuItem>
          <Divider />
          Create Forms
          <Toolbar>
            <MenuList>
              <Divider />
              <MenuItem component={NavLink} to={`${url}/contracts/new`} activeStyle={activeLink}>🚀 New Contract</MenuItem>
              <MenuItem component={NavLink} to={`${url}/packages/new`} activeStyle={activeLink}>🚀 New Package</MenuItem>
            </MenuList>
          </Toolbar>
          <Divider />
          <MenuItem component={Link} to={`${url}/contracts/1`}>Edit Contract 1</MenuItem>
          <MenuItem component={Link} to={`${url}/jobs/1`}>Edit Job 1</MenuItem>
        </MenuList>
      </Toolbar>
      <Divider />
    </Drawer>
  </>);
};

export default Navigation;