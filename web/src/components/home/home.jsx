import { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./home.css"
const baseUrl = "http://localhost:3001"

const Home = () => {

  const postTitleInputRef = useRef(null);
  const postBodyInputRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  
  
  const [alert, setAlert] = useState(null);
  const [editAlert, setEditAlert] = useState(null)

  const [allPosts, setAllPosts] = useState([]);
  const [toggleRefresh, setToggleRefresh] =useState(false)
  const [isFormVisible, setIsFormVisible] = useState(false);
  const openFormPopup = () => {
    setIsFormVisible(true);
  };

  const closeFormPopup = () => {
    setIsFormVisible(false);
  };
  const getAllPosts = async () =>{
    try {
      
      const response = await axios.get(`${baseUrl}/api/v1/posts`);
      console.log(response.data);

     
      setIsLoading(false);
      setAllPosts(response.data)
    } catch (error) {
      console.log(error.data);
      setIsLoading(false);
    }
  }
  
  useEffect(() => {
  getAllPosts()  
       
      return () => {
        // cleanup function
        
      };
    }, [toggleRefresh]);
   
    const editHandler = () => {

    }

  const deleteHandler = async (_id) => {
    try {
      setIsLoading(true);

      const response = await axios.delete(`${baseUrl}/api/v1/post/${_id}`,{
        title: postTitleInputRef.current.value,
        text: postBodyInputRef.current.value
      });

      // setWeatherData([response.data, ...weatherData]);
      setIsLoading(false);
      console.log(response.data);
     setAlert(response.data.message)
     setToggleRefresh(!toggleRefresh)
     
    } catch (error) {
      // handle error
      console.log(error?.data);
      setIsLoading(false);
    }
  };
  

  const submitHandler = async (e) => {
    e.preventDefault();
    setIsFormVisible(false);
    // console.log("cityName: ", cityNameRef.current.value);

    
    try {
      setIsLoading(true);

      const response = await axios.post(`${baseUrl}/api/v1/post`,{
        title: postTitleInputRef.current.value,
        text: postBodyInputRef.current.value
      });

      // setWeatherData([response.data, ...weatherData]);
      setIsLoading(false);
      console.log(response.data);
     setAlert(response.data.message)
     setToggleRefresh(!toggleRefresh)
    } catch (error) {
      // handle error
      console.log(error?.data);
      setIsLoading(false);
    }
  };
   const editSaveSubmitHandler = async (e) =>{
    e.preventDefault();
    const _id = e.target.elements[0].value;
    const title = e.target.elements[1].value;
    const text = e.target.elements[2].value;
    try {
      setIsLoading(true);
      const response = await axios.put(`${baseUrl}/api/v1/post/${_id}`, {
        title: title,
        text: text,
      });
      

      setIsLoading(false);
      console.log(response.data);
      setAlert(response?.data?.message);
      setToggleRefresh(!toggleRefresh);
    } catch (error) {
      // handle error
      console.log(error?.data);
      setIsLoading(false);
    }
   };
  return (
    <div>
      {!isFormVisible && (
      <form action="" className="f-style">
      <label htmlFor="postTitleInput"> Post Title:</label>
        <input
        id="postTitleInput"
        type="text"
        required
        minLength={2}
        maxLength={200}
        onClick={openFormPopup}
        // onClick={() => setIsFormVisible(true)} // Set the form visibility to true when clicked
        ref={postTitleInputRef}
      />
      <br />
        <label htmlFor="postBodyInput"> Post Text:</label>
        <textarea
          id="postBodyInput"
          type="text"
          required
          minLength={2}
          maxLength={200}
          onClick={openFormPopup}
          // onClick={() => setIsFormVisible(true)}
          //   onChange={(e) => setCityName(e.target.value)}
          ref={postBodyInputRef}
          />
        <br />
        <button type="submit">submit posts</button>
      </form>
      )}
      {isFormVisible && (
       <div className="popup">
       <div className="popup-content">
         <span className="close-btn" onClick={closeFormPopup}>&times;</span>

        <form onSubmit={submitHandler} className="f-style">
          <label htmlFor="postTitleInput"> Post Title:</label>
        <input
          id="postTitleInput"
          type="text"
          required
          minLength={2}
          maxLength={200}
          //   onChange={(e) => setCityName(e.target.value)}
          ref={postTitleInputRef}
        />
        <br />
        <label htmlFor="postBodyInput"> Post Text:</label>
        <textarea
          id="postBodyInput"
          type="text"
          required
          minLength={2}
          maxLength={200}
          //   onChange={(e) => setCityName(e.target.value)}
          ref={postBodyInputRef}
          />
        <br  />
        <button type="submit">submit posts</button>
        <span>
        {alert && alert}
          {isLoading && "Loading..."}
          </span>
        </form>
        </div>
      </div>  
      )
        
      }
      
      

          <br />
   <div>
{
  allPosts.map((post, index) => (

    <div key={post._id} className="post">

      {(post.isEdit)? (
      <form onSubmit={editSaveSubmitHandler} className="editForm">
       <input type="text" disabled value={post._id} hidden /> 
      <input defaultValue={post.title} type="text" placeholder="title" />
      <br />
      <textarea defaultValue={post.text} type="text" placeholder="body"></textarea>
      <br />  
      <button type="submit">save</button>
      <button type="submit" onClick={() =>{
       post.isEdit = true
        setAllPosts([...allPosts])
      } }>cancel</button>
      <span>
        {editAlert && editAlert}
          {isLoading && "Loading..."}
          </span>
    </form>
     ) : ( 
      <div>
    <h2>{post.title}</h2>
    <p>{post.text}</p>
    
    <button
                  onClick={(e) =>{

                    allPosts[index].isEdit = true
                    setAllPosts([...allPosts])
                  } }
                >
                  Edit
                </button>
    <button 
    onClick={(e) =>{
      deleteHandler(post._id)
    } }> delete</button>
    </div>
    )}
    
   </div>
   ))
  }
  <br />
    </div>
     </div>
      );
    };
     
     
    
     
 

export default Home;
