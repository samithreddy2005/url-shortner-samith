
import { Avatar } from '@mantine/core';
import React from 'react';
import styles from './Profile.module.css';


export default function Profile() {


   const dummy = {
       name: "K. SAMITH REDDY",
       email: "samithreddy950@gmail.com",
       id: "1234567890",
       avatar: "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-7.png"
   }


 return (
   <div className={styles['profile-container']}>
     <Avatar src={dummy.avatar} className={styles['profile-avatar']} />
     <h2 className={styles['profile-name']}>{dummy.name}</h2>
     <p className={styles['profile-email']}>{dummy.email}</p>
     <p className={styles['profile-id']}>ID: {dummy.id}</p>
   </div>
 )
}

