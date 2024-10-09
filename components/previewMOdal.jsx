"use client"

import { useState } from "react"

export default function PreviewModal({ path }) {
    const [uploadStatus, setUploadStatus] = useState('')
    const [imgPath, setImgPath] = useState('')
    const handleUpload = () => {
        console.log(path)
        const formData = new FormData()
        formData.append('file', path)
        fetch('/api/uploadImg', {
            method: 'post',
            body: formData
        }).then(res => res.json()).then(result => {
            setUploadStatus(result.res)
            setImgPath(path.name)
        }).catch(err => console.log(err))
    }
    return (
        <>
            <div style={{ height: '400px', width: '400px', position: 'fixed', top: '50%', left: '50%', backgroundColor: 'grey' }} className="previewCont">
                {/* <form > */}
                <button onClick={handleUpload} type="button">Upload</button>
                <p style={{ color: 'wheat' }}>{uploadStatus}</p>
                {/* </form> */}
                {imgPath && <img loading="lazy"  src={`/uploads/${imgPath}`} alt="Profile" />}
            </div>
        </>
    )
}