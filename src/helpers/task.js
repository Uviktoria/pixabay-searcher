
  function fn(str){
    if(!this.str && str)
      this.str = str;
    else if(!str && str!=""){
        let temp = this.str;
      delete this.str;
      return temp;
    }
      else  {
        str = str ? " " + str : "";
        this.str += str;
    }
        
    return this;
  }
  
  
  console.log(fn("hello").fn("world").fn("!!").fn())
  console.log(fn("test").fn("123").fn("").fn());
  console.log(fn())