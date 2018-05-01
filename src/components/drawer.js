import React from 'react';
import { connect } from 'unistore/react';
import { NavLink } from 'react-router-dom';
import { Drawer, DrawerHeader, DrawerContent } from 'rmwc/Drawer';
import { actions } from '../store';
import { AccountBox, Bolt, Dashboard } from '../svg';

import { Button } from 'rmwc/Button';

import { ListItem, ListItemText } from 'rmwc/List';

const css = {
  listItem: {
    position: 'relative',
  },
  fullWidth: {
    width: '100%',
    display: 'flex',
    justifyContent: 'start',
  },
  icon: {
    display: 'inline-block',
    position: 'relative',
    top: '2px',
    width: '15px',
    margin: '0px 18px 0 14px',
  },
  listIcon: {
    margin: '5px 1rem 0px 0px',
  },
};

export default connect('drawerOpen,location', actions)(
  ({ drawerOpen, location, setDrawerOpen }) => {
    return (
      <Drawer
        temporary
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onFocus={() => setDrawerOpen(true)}
        onBlur={() => setDrawerOpen(false)}
      >
        <DrawerHeader className="mdc-theme--on-primary mdc-theme--primary-bg">
          <Bolt style={css.icon} />
          <span> Firelist </span>
        </DrawerHeader>
        <DrawerContent>{getListItems(location)}</DrawerContent>
      </Drawer>
    );
  }
);

const listItems = [
  { path: '/', text: 'Landing Page', icon: <Dashboard /> },
  { path: '/notes', text: 'Notes', icon: <AccountBox /> },
];
function getListItems({ pathname } = { path: null }) {
  return listItems.map(({ icon, path, text }) => {
    const isActive = pathname === path;
    return (
      <ListItem
        disabled={isActive}
        key={path}
        style={css.listItem}
        className={isActive ? 'mdc-list-item--selected' : ''}
      >
        <ListItemText style={css.fullWidth}>
          <NavLink
            exact
            to={path}
            disabled={isActive}
            activeClassName="mdc-list-item--selected"
            tabIndex="1"
          >
            <Button style={css.fullWidth} disabled={isActive}>
              <span style={css.listIcon}>{icon}</span>
              <span>{text}</span>
            </Button>
          </NavLink>
        </ListItemText>
      </ListItem>
    );
  });
}
