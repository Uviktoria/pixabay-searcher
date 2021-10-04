import { Input } from "reactstrap";
import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import UnsplashImage from "./components/UnsplashImage/UnsplashImage";
import InfiniteScroll from "react-infinite-scroll-component";
import { getImgFromStorage } from "./helpers/helper";

function App() {
  const [name, setName] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [imgList, setImgList] = useState(null);
  const [lastSearch, setLastSearch] = useState(null);
  const [lastSearchChecked, setLastSearchChecked] = useState(null);

  const saveToLocalStorage = txt => {
    if (txt && txt.length > 2) {
      const prevList = getImgFromStorage();
      const newObj = {
        name,
        hasMore,
        imgList,
        page,
        isChecked: false,
      };
      let data;
      if (prevList && prevList.length) {
        const isExist = prevList.findIndex((item) => item.name === txt) > -1;
        data = isExist ? [...prevList] : [...prevList, newObj];
      } else {
        data = [newObj];
      }
      localStorage.setItem("images", JSON.stringify(data));
    }
  };

  const getAllFromStorage = () => {
    const storeData = getImgFromStorage();
    setLastSearch(storeData);
  };

  useEffect(() => {
    name && fetchData(name);
  }, [page]);

  const fetchData = (str) => {
    const url = `https://pixabay.com/api/?key=589265-794c5c674cf54909ed804275c&q=${str}&image_type=photo&pretty=true&page=${page}`;
    axios
      .get(url)
      .then((res) => {
        setImgList((prevList) =>
          prevList ? [...prevList, ...res.data.hits] : res.data.hits
        );
        const maxPage = Math.ceil(res.data.total / 20);
        const isMaxPage = maxPage === page;
        setHasMore(
          res.data.hits && res.data.hits.length && !isMaxPage ? true : false
        );
        isMaxPage && setPage(1);
      })
      .catch((error) => {
        setHasMore(false);
        setPage(1);
        setImgList(null);
      });
  };

  const onSearching = (serachStr) => {
    setName(serachStr);
    setImgList(null);
    if (serachStr.length > 2) {
      fetchData(serachStr);
    }
  };

  const nextPage = () => {
    if (hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  const checkObj = (txt) =>
    lastSearch &&
    lastSearch.map((element) => {
      if (element.name === txt) {
        element.isChecked = !element.isChecked;
      }
      return element;
    });

  useEffect(() => {
    const items = getSearchFromStore();
    setImgList(items && items.length ? items : null);
  }, [lastSearchChecked]);

  const getSearchFromStore = () => {
    let prevList = [];
    lastSearchChecked &&
      lastSearchChecked.map((element) => {
        if (element.isChecked) {
          prevList = [...prevList, ...element.imgList];
        }
        return prevList;
      });
    return prevList;
  };

  const setCheckboxValue = (val) => {
    const list = checkObj(val);
    setLastSearchChecked(list);
  };
  return (
    <div className="App container">
      <header className="App-header">
        <h1>Image gallery</h1>
        <Input
          type="search"
          name="search"
          id="imgSearch"
          onFocus={getAllFromStorage}
          onBlur={(e) => saveToLocalStorage(e.target.value)}
          onChange={(e) => onSearching(e.target.value)}
          placeholder="search image"
        />
      </header>

      {lastSearch && (
        <div className="historyBox">
          <p>Your history</p>
          {lastSearch.map((item, index) => {
            return (
              <div key={`${item.id}-${index}`}>
                <input
                  value={item.name}
                  className="checkboxHistory"
                  type="checkbox"
                  id={`${item.id}-${index}`}
                  checked={item.isChecked}
                  htmlFor={`lbl-${item.id}-${index}`}
                  onChange={(e) => setCheckboxValue(e.target.value)}
                />
                <label id={`lbl-${item.id}-${index}`}>{item.name}</label>
              </div>
            );
          })}
        </div>
      )}

      {imgList && (
        <InfiniteScroll
          dataLength={imgList.length}
          hasMore={hasMore}
          next={nextPage}
          loader={<h4>Loading...</h4>}
          inverse={false}
        >
          <div className="row">
            {imgList.map(
              (img, index) =>
                img.userImageURL && (
                  <UnsplashImage
                    url={img.userImageURL}
                    key={`${img.id}-${index}`}
                    id={img.id}
                  />
                )
            )}
          </div>
        </InfiniteScroll>
      )}
    </div>
  );
}

export default App;
