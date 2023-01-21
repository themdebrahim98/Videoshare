import React, { useEffect,useState } from 'react'
import Card from '../components/Card'
 import axios from "axios"

export default function Home({type}) {
  const [videos, setvideos] = useState([])

  useEffect(()=>{
    const getVideos = async ()=>{
      const res = await axios.get(`http://localhost:8800/api/video/${type}`)
      console.log(res.data,"data")
      setvideos(res.data)
    }
    getVideos()

  },[type])

  return (
    <>


    {
      videos.map((video)=><Card key={video._id} video={video}/>)
    }
      
     

    </>
  )
}
