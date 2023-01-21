import mongoose from 'mongoose'

const VideoSchema = new mongoose.Schema(
    {
        userId:{
            type:String,
            required:true
        },
        title:{
            type:String,
            required:true
        },
        desc:{
            type:String,
            required:true
        },
        imgUrl:{
            type:String,
            required:true,
            default:""
        },
        videoUrl:{
            type:String,
            required:true,
            default:""
        },
        views:{
            type:Number,
            default:0
        },
        viedeoViewUsers:{
            type:[String],
            default:[]
        },
        tags:{
            type:[String],
            default:[]
        },
        likes:{
            type:[String],
            default:[]

        },
        disLikes:{
            type:[String],
            default:[]

        }
         

    },
{
    timestamps:true
},

);



export default mongoose.model("Video", VideoSchema);
