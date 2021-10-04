import { Col, Row } from 'antd';
import React from 'react';
import Image from 'next/image';

function HeaderHome(): JSX.Element {
  return (
    <div>
      <Row>
        <Col md={2} span={2}>
          <Image
            src="/images/vercel.svg"
            alt="Vercel Logo"
            width={50}
            height={50}
          />
        </Col>
      </Row>
    </div>
  );
}

export default HeaderHome;
