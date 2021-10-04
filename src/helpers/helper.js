export const getImgFromStorage = () => {
    let imgList = localStorage.getItem("images")
    imgList = imgList && JSON.parse(imgList)
    return imgList
  }


  export default {getImgFromStorage}