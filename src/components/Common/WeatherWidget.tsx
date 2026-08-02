import StatCard from "../Cards/StatCard";
import {
  useEffect,
  useState,
} from "react";

import {
  FaSun,
  FaCloudSun,
  FaCloudRain,
  FaWind,
  FaTint,
  FaRoad,
  FaMapMarkerAlt,
} from "react-icons/fa";

import { api } from "../../services/api";



interface WeatherData {

  location:string;

  temperature:number;

  condition:string;

  humidity:number;

  wind:number;

  visibility:number;

  road:string;

}




const WeatherWidget = () => {


const [weather,setWeather] =
useState<WeatherData | null>(null);


const [loading,setLoading] =
useState(true);



const fetchWeather = async()=>{


try{


setLoading(true);



const response =
await api.get("/weather");



setWeather(
response.data.weather
);



}

catch(error){

console.error(
"Weather Error:",
error
);


setWeather({

location:"Ghaziabad, India",

temperature:31,

condition:"Partly Cloudy",

humidity:72,

wind:12,

visibility:8,

road:"Good"

});


}

finally{

setLoading(false);

}


};





useEffect(()=>{

fetchWeather();

},[]);





const getWeatherIcon=()=>{


if(
weather?.condition.includes("Rain")
){

return <FaCloudRain/>;

}


if(
weather?.condition.includes("Cloud")
){

return <FaCloudSun/>;

}


return <FaSun/>;


};





if(loading){


return(

<div className="
bg-white
rounded-2xl
shadow
p-6
">

<p className="text-gray-500">
Loading weather...
</p>


</div>

);

}





return(


<div className="
bg-white
rounded-2xl
shadow-lg
border
p-6
">


{/* Header */}


<div className="
flex
justify-between
items-center
mb-6
">


<div>


<h2 className="
text-2xl
font-bold
text-slate-800
">

Weather

</h2>


<p className="
text-gray-500
">

Live driving conditions

</p>


</div>



<div className="
text-yellow-500
text-4xl
">

{getWeatherIcon()}


</div>


</div>





{/* Main */}



<div className="
rounded-2xl
bg-gradient-to-r
from-blue-500
to-cyan-500
text-white
p-6
">


<div className="
flex
justify-between
items-center
">


<div>


<h1 className="
text-5xl
font-bold
">

{weather?.temperature}°C

</h1>



<p className="
text-lg
mt-2
">

{weather?.condition}

</p>



<div className="
flex
gap-2
items-center
mt-3
">


<FaMapMarkerAlt/>


{weather?.location}


</div>


</div>



<div className="
text-7xl
opacity-80
">

{getWeatherIcon()}

</div>



</div>


</div>







{/* Details */}



<div className="
grid
grid-cols-2
gap-4
mt-6
">


<Card
icon={<FaTint/>}
title="Humidity"
value={`${weather?.humidity}%`}
/>



<Card
icon={<FaWind/>}
title="Wind"
value={`${weather?.wind} km/h`}
/>



<StatCard
  icon={<FaRoad />}
  title="Road"
  value={weather?.road || "N/A"}
  color="bg-orange-500"
/>



<Card
icon={<FaCloudSun/>}
title="Visibility"
value={`${weather?.visibility} km`}
/>



</div>




</div>


);

};






const Card=({

icon,
title,
value

}:{

icon:React.ReactNode;

title:string;

value:string;

})=>{


return(

<div className="
bg-gray-50
rounded-xl
p-4
">


<div className="
text-blue-500
text-xl
mb-2
">

{icon}

</div>


<p className="
text-sm
text-gray-500
">

{title}

</p>


<h3 className="
text-xl
font-bold
">

{value}

</h3>


</div>


);


};



export default WeatherWidget;