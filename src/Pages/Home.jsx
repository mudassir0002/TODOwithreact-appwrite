import React, { useEffect } from 'react'
import { account } from '../appwrite/config'
const Home=() => {

    useEffect(() => {
        console.log(account)
    },[])

  return (
    <h1>I am Home</h1>
  )
}

export default Home;