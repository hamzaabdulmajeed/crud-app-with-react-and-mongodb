// import axios from 'axios';
// import { useState, useRef, useEffect} from 'react';
// import WeatherCard from '../weatherwid/weatherwid';


// const Home = () => {

//     const [weatherData, setweatherData]= useState([])
//     const cityNameRef = useRef(null)

//     const [currentLocationWeather, setcurrentLocationWeather] = useState(null)
//     const [isLoading, setisLoading] = useState(false)
//     useEffect(() =>{

//         setisLoading(true)
//         const controller = new AbortController();
//         if (navigator.geolocation) {
//             navigator.geolocation.getCurrentPosition(async (location) => {
//               console.log("location: ", location);

//               try{
                
//                 let API_KEY = "e0f99c494c2ce394a18cc2fd3f100543"
//                 const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${location.coords.latitude}&lon=${location.coords.longitude}&appid=${API_KEY}&units=metric`,
//                 {
//                     signal: controller.signal,
//                   } 
//                 )
//                     console.log(response.data);
//                     setisLoading(false)
//                   setcurrentLocationWeather(response.data)
              
//                     // document.querySelector('#result').innerHTML =`current temprature of ${response.data.name} is ${response.data.main.temp}°C`
                
                  
//                 } catch(error) {
//                     // handle error
//                     console.log(error.data);
//                     setisLoading(false)
//                 }   
//                 })
//             }else {
//                     console.log("Geolocation is not supported by this browser.");
//                   }

//                   return () => {
//                     // cleanup function
//                     controller.abort();
//                   };
    
//      }, [])
        
            
        
         

//     const submitHandler = async (e) => {
//         e.preventDefault();
//         console.log("cityName: ", cityNameRef.current.value);
//         let API_KEY = "e0f99c494c2ce394a18cc2fd3f100543";
//     try {
//         setIsLoading(true);
      

//       const response = await axios.get(
//         `https://api.openweathermap.org/data/2.5/weather?q=${cityNameRef.current.value}&appid=${API_KEY}&units=metric`
//          ,{
//             signal: controller.signal,
//           }     
//         );

//       console.log(response.data);
//       setWeatherData([response.data, ...weatherData]);
//       setIsLoading(false);
//     } catch (error) {
//       // handle error
//       console.log(error?.data);
//     //   setIsLoading(false);
//     }
//     }       

//         // let cityName = document.querySelector("#cityNameInput").value;
    
  

//     return <div>
//         <form onSubmit={submitHandler}>
//         <label htmlFor="cityNameInput"> City Name:</label>
//         <input
//           id="cityNameInput"
//           type="text"
//           required
//           minLength={2}
//           maxLength={20}
//         //   onChange={(e)=>setCityName(e.target.value)}
//           ref={cityNameRef}
//           //   onChange={(e) => setCityName(e.target.value)}
//         //   ref={cityNameRef}
//         />
//         <br />
//         <button type="submit">Get Weather</button>
//         </form>       
// <hr />



// {isLoading ? <div>Loading...</div> : null}

// {weatherData.length || currentLocationWeather || isLoading ? null : <div>No Data</div>}

// {weatherData.map((eachWeatherData, index) => {
//   return <WeatherCard key={index} weatherData={eachWeatherData} />;
// })}

// {currentLocationWeather ? <WeatherCard weatherData={currentLocationWeather} /> : null}
//   </div>
  
  
// };


// export default Home
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./home.css"
const baseUrl = "http://localhost:5001"

const Home = () => {

  const postTitleInputRef = useRef(null);
  const postBodyInputRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  
  const [alert, setAlert] = useState(null);
  const [editAlert, setEditAlert] = useState(null)

  const [allPosts, setAllPosts] = useState([]);
  const [toggleRefresh, setToggleRefresh] =useState(false)
  
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
      <form onSubmit={submitHandler}>
        <label htmlFor="postTitleInput"> Post Title:</label>
        <input
          id="postTitleInput"
          type="text"
          required
          minLength={2}
          maxLength={20}
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
          maxLength={20}
          //   onChange={(e) => setCityName(e.target.value)}
          ref={postBodyInputRef}
          />
        <br />
        <button type="submit">Get posts</button>
        <span>
        {alert && alert}
          {isLoading && "Loading..."}
          </span>
      </form>
          

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
