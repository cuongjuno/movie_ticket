import React from 'react';
import { IconVercel } from '@/images';
import Image from 'next/image';
import styles from '../styles/Home.module.scss';

const index = (): JSX.Element => {
  return (
    <div className={styles.container}>
      abcd
      <br />
      <Image
        src="/images/vercel.svg"
        alt="Vercel Logo"
        width={72}
        height={16}
      />
      <br />
      <IconVercel />
    </div>
  );
};

export default index;
