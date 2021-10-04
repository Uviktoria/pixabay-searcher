import { Input } from 'reactstrap';
import { useState, useEffect } from "react";
import axios from 'axios';
import './App.css';
import UnsplashImage from "./components/UnsplashImage/UnsplashImage"
import InfiniteScroll from 'react-infinite-scroll-component';


function App() {
  const [name, setName] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [imgList, setImgList] = useState(null);
  const [lastSearch, setLastSearch] = useState(null);

  const getImgFromStorage = () => {
    let imgList = localStorage.getItem("images")
    imgList = imgList && JSON.parse(imgList)
    return imgList
  }
  const saveToLocalStorage =(txt)=>{
    if(txt && txt.length > 2){
   const prevList = getImgFromStorage()
   const newObj = {
    name,
    hasMore,
    imgList, 
    page,
    isChecked: false
   }
   let data;
   if(prevList && prevList.length){
    const isExist = prevList.findIndex(item => item.name === txt) > -1
    data = isExist ? [...prevList] :[...prevList, newObj]
   } else{
    data = [newObj]
   }
    localStorage.setItem("images", JSON.stringify(data));
  }
  }

  const getAllFromStorage = () => {
   const storeData = getImgFromStorage()
   setLastSearch(storeData)
  }

  useEffect(() => {
    console.log("page change")
   fetchData(name)
   }, [page]);

  //  useEffect(() => {
    
  //   // returned function will be called on component unmount 
  //   return () => {
  //     setName("")
  //     setPage(1)
  //     setImgList([])
  //     setHasMore(true)
  //   }
  // }, [])

  const fetchData = (str) => {
    console.log("page", page)
    const url = `https://pixabay.com/api/?key=589265-794c5c674cf54909ed804275c&q=${str}&image_type=photo&pretty=true&page=${page}`
    axios.get(url)
      .then(res => {
        setImgList(prevList => prevList ?  [...prevList, ...res.data.hits] : res.data.hits);
        const maxPage = Math.ceil(res.data.total / 20) 
        const isMaxPage = maxPage === page
        setHasMore(res.data.hits && res.data.hits.length  && !isMaxPage ? true : false)
//        isMaxPage && setPage(1)
      }).catch( error => {
        console.log("error")
        setHasMore(false)
       // setPage(1)
        //setImgList(null);
      });
  }

  const getSearchFromStore = txt => {
    const searchObj = lastSearch.find(element => element.name === txt);
    let prevList =[]
    lastSearch.map(element => {
      if(element.isChecked){
        prevList=[...prevList, element.imgList] 
      }
      return prevList
    });
    if(searchObj){
    searchObj.isChecked = !searchObj.isChecked
    if(searchObj.isChecked){
      const imgListStore = prevList && prevList.length > 0 ? [...prevList,...searchObj.imgList] : searchObj.imgList

    setImgList(imgListStore);
    setHasMore(searchObj.hasMore)
    setPage(searchObj.page)
    }
 
    }
   
  }

  const onSearching = serachStr => {
    setName(serachStr)
    setImgList(null);
    if(serachStr.length>2){
     fetchData(serachStr)
    }
  }

 const nextPage = () => {
   if(hasMore) {
     setPage(prev => prev + 1)
    } 
 }
const setCheckboxValue =(val)=>{
  getSearchFromStore(val)
}
  return (
    <div className="App">
      <header className="App-header">
      <h1>Image gallery</h1>
        <Input
          type="search"
          name="search"
          id="imgSearch"
          onFocus={getAllFromStorage}
          onBlur={(e)=>saveToLocalStorage(e.target.value)}
          onChange={(e) => onSearching(e.target.value)}
          placeholder="search image"
        />
      </header>
      
      {lastSearch && <div> <p>Your history</p>
      {lastSearch.map((item, index) => {
      return <div key={`${item.id}-${index}`}>
        <input
           value={item.name}
           type="checkbox" 
           id={`${item.id}-${index}`}
           checked={item.isChecked}
           onChange={(e) => setCheckboxValue(e.target.value)}
          />
        {item.name}</div>
      } )}
      </div>
      }

    {imgList && <InfiniteScroll
    dataLength={imgList.length}
    hasMore={hasMore}
    next={nextPage}
    loader={<h4>Loading...</h4>}
    inverse={false}
  >
    <div className="row">
    {imgList.map((img, index) => img.userImageURL && <UnsplashImage url={img.userImageURL} key={`${img.id}-${index}`} id={img.id} />  )}
    </div>
  </InfiniteScroll>}

    </div>
  );
}

export default App;
