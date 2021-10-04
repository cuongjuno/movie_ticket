import React from 'react';

import { Layout } from 'antd';
import styled from 'styled-components';
import HeaderHome from './Components/Header';

const { Footer, Content } = Layout;

const MyLayout = styled(Layout)`
  height: 100vh;
  background-color: white;
`;
const MyHeader = styled(Layout.Header)`
  height: 60px;
`;

const MyDiv = styled.div`
  background-color: red;
`;

function HomeLayout() {
  return (
    <MyLayout>
      <MyHeader>
        <HeaderHome />
      </MyHeader>
      <Content>content</Content>
      <Footer>Footer</Footer>
    </MyLayout>
  );
}

export default HomeLayout;
