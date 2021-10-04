
 import './UnsplashImage.css';

 function UnsplashImage({ url, id }) {
      return (
        <div className="column" >
          <img src={url} alt={"image-"+ id} />
        </div>
      )
  }

  export default UnsplashImage;
