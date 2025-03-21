// AdminLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import SidebarAdmin from './SidebarAdmin';
import Header from './Header';

const LayoutContainer = styled.div`
  display: flex;
  width: 100%;
  min-height: 100vh;
  flex-direction: column;
`;

const HeaderContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex: 1;
  margin-top: 80px; /* Hauteur approximative du header - ajustez selon vos besoins */
`;

const MainContent = styled.div`
  flex: 1;
  margin-left: ${props => (props.isCollapsed ? '80px' : '240px')};
  transition: margin-left 0.3s ease;
  padding: 20px;
`;

const AdminLayout = () => {
  return (
    <LayoutContainer>
      <HeaderContainer>
        <Header />
      </HeaderContainer>
      <ContentWrapper>
        <SidebarAdmin />
        <MainContent>
          <Outlet />
        </MainContent>
      </ContentWrapper>
    </LayoutContainer>
  );
};

export default AdminLayout;