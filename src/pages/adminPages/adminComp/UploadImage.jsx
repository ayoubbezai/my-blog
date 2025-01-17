import { Button } from '@material-tailwind/react'
import React, { useState } from 'react'
import toast, { Toaster } from 'react-hot-toast';

function UploadImage() {
  const [image, setImage] = useState(null);
  const [url, setUrl] = useState('');

  const saveImage = async () => {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "my-blog");
    data.append("cloud_name", "dbjoo9sww");

    try {
      if(image === null){
        return toast.error("Please Upload image")
      }

      const res = await fetch('https://api.cloudinary.com/v1_1/dbjoo9sww/image/upload',{
        method : "POST",
        body : data
      })

      const cloudData = await res.json();
      setUrl(cloudData.url);
      console.log(cloudData.url);
      toast.success("Image Upload Successfully")

    } catch (error) {
      
    }
  }

  console.log(url)
  return (
    <div className='flex justify-center items-center h-screen '>
      <div className=" bg-gray-600 p-10 rounded-xl">
        <div className="input flex justify-center mb-5">
          <label
            for="file-upload"
            class="custom-file-upload">
            {image
              ? <img
                className=" w-72 lg:w-96  rounded-xl"
                src={image ? URL.createObjectURL(image) : ""}
                alt="img"
              />
              : <img
                src="https://cdn-icons-png.flaticon.com/128/1665/1665680.png"
                className="h-20 w-20"
              />}
          </label>
          <input
            id="file-upload"
            className=' text-white'
            type="file"
            onChange={(e) => setImage(e.target.files[0])} />
        </div>
        <div className="">
          <Button
            className=' w-72 lg:w-96   '
            onClick={saveImage}
          >
            Send
          </Button>
          <Toaster/>
        </div>
      </div>
    </div>


  )
}

export default UploadImage