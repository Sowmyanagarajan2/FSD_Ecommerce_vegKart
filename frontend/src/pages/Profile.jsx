import {useState} from "react";
import api from "../services/api";

function Profile(){
    //store selected Image
    const [photo,setPhoto]=useState(null);
    //store uploaded image URL 
    const [photoURL,setPhotoURL]=useState(null);

    //HANDLE FILE SELECTION
    const handleFileChange=(e)=>{
        const file=e.target.files[0];
        setPhoto(file);
    };
    //upload image to backend

    const handleUpload=async(event)=>{
        event.preventDefault();
        if(!photo){
            alert("Please select a photo to upload");
            return;
        }
        const formData=new FormData();
        formData.append("profilePhoto", photo);
        try{
            const response = await api.post("/auth/upload-profile-photo", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            alert("Profile photo uploaded successfully");
            setPhotoURL(`http://localhost:5000${response.data.profilePhoto}`);
        }
        catch(error){
            console.error("Upload error:", error.response?.data || error.message);
            alert(error.response?.data?.message || "Error uploading profile photo");
        }
    };
    return(
        <div>
            <h1>Profile Page</h1>
            <form onSubmit={handleUpload}>
                <input type="file" accept="image/*" onChange={handleFileChange}/>
                <button type="submit">Upload Profile Photo</button> 
            </form>
            {photoURL && <img src={photoURL} alt="Profile" style={{width:"200px",height:"200px"}}/>}
        </div>
    );      


}
export default Profile;