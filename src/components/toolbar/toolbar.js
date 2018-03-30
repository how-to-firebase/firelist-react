import React from 'react';
import {
  Toolbar,
  ToolbarRow,
  ToolbarSection,
  ToolbarTitle,
  ToolbarMenuIcon,
  ToolbarIcon,
} from 'rmwc/Toolbar';
import { connect } from 'unistore/react';
import { actions } from '../../store';

export default connect('currentUser', actions)(({ currentUser }) => {
  return (
    <Toolbar>
      <ToolbarRow>
        <ToolbarSection alignStart>
          <ToolbarMenuIcon use="menu" />
          <ToolbarTitle>Toolbar</ToolbarTitle>
        </ToolbarSection>
        <ToolbarSection alignEnd>
          <ToolbarIcon use="save" />
          <ToolbarIcon use="print" />
        </ToolbarSection>
      </ToolbarRow>
    </Toolbar>
  );
});
