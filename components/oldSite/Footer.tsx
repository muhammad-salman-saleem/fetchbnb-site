import React from 'react';
import Footer from 'rc-footer';
import 'rc-footer/assets/index.css';
import styles from '../../styles/Footer.module.css';
import Image from 'next/image';

const FooterMaster = () => {

  return (
    <Footer
    theme='light'
      columns={[
        {
          title: 'Fetchit.AI',
        },
        {
          title: 'Pricing',
          items: [
            {
              title: 'Pricing',
              url: 'https://fetchit.ai/pricing',
              openExternal: true,
            },
          ]
        },
        {
          title: 'Signup',
          items: [
            {
              title: 'Signup',
              url: 'https://fetchit.ai/signup',
              openExternal: true,
            },
          ]
        },
        {
          title: 'Login',
          items: [
            {
              title: 'Login',
              url: 'https://fetchit.ai/login',
              openExternal: true,
            },
          ]
        }
      ]} />
  )
}

export default FooterMaster