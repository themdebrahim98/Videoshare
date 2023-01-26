import React,{useState, useEffect} from 'react'
import './reccommendation.css'
import axios from 'axios';
import Card from '../components/Card'
import { useLocation } from 'react-router-dom';
import { message } from 'antd';

export default function Reccommendation({tags}) {
    const tgsString = tags&& tags.join('+')
    const [videos, setvideos] = useState([]);
    useEffect(() => {
        try {
            const searchVideo = async () => {
               const res = await axios.get(`http://localhost:8800/api/video/tags?tags=${tgsString}`)
               setvideos(res.data)
            }
            searchVideo();
            
        } catch (error) {
            message.error("something wrong")
        }
    }, [tgsString])
    
  return (
    <div className='reccommendation'>
      
        {
            videos.map((video) => <Card key={video._id} video={video}/>)
        }

      
    </div>
  )
}
