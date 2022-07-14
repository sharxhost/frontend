import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

const Home: NextPage = () => {
  return (
    <div className='w-screen h-screen flex items-center justify-center'>
      <div className="text-4xl text-red-700">
        Hello world
      </div>
    </div>
  );
}

export default Home
