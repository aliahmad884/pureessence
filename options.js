import { Slide} from "react-toastify"

const toastOptions = {
    error: {
        position: "top-center",
        autoClose: 1500,
        hideProgressBar: true,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Slide
    },
    success: {
        position: "top-center",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Slide
    }
}
export default toastOptions