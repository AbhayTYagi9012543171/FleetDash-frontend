import {
  useEffect,
  useState,
  useRef,
} from "react";

import {
  api,
} from "../../services/api";

import {
  FaTimes,
  FaMapMarkerAlt,
} from "react-icons/fa";



interface Props {

  isOpen:boolean;

  onClose:()=>void;

  onSuccess:()=>void;

}





const AddGeofenceModal = ({
  isOpen,
  onClose,
  onSuccess,
}:Props)=>{



const [name,setName]
=
useState("");



const [latitude,setLatitude]
=
useState("");



const [longitude,setLongitude]
=
useState("");



const [radius,setRadius]
=
useState("");



const [loading,setLoading]
=
useState(false);



const [error,setError]
=
useState("");



const nameInput =
useRef<HTMLInputElement>(null);






// ============================
// Escape Close
// ============================


useEffect(()=>{


const handleEscape =
(e:KeyboardEvent)=>{


if(e.key==="Escape")
{

onClose();

}


};



if(isOpen)
{

document.addEventListener(
"keydown",
handleEscape
);


document.body.style.overflow =
"hidden";



nameInput.current?.focus();


}



return()=>{


document.removeEventListener(
"keydown",
handleEscape
);


document.body.style.overflow =
"auto";


};


},[
isOpen,
onClose
]);







if(!isOpen)
return null;






// ============================
// Reset Form
// ============================


const resetForm = ()=>{


setName("");

setLatitude("");

setLongitude("");

setRadius("");

setError("");

};






// ============================
// Submit
// ============================


const handleSubmit =
async(
e:React.FormEvent
)=>{


e.preventDefault();



const lat =
Number(latitude);



const lng =
Number(longitude);



const rad =
Number(radius);





if(rad<=0)
{

setError(
"Radius must be greater than 0"
);

return;

}





if(
lat < -90 ||
lat > 90
)
{

setError(
"Latitude must be between -90 and 90"
);

return;

}





if(
lng < -180 ||
lng > 180
)
{

setError(
"Longitude must be between -180 and 180"
);

return;

}





try{


setLoading(true);

setError("");





await api.post(
"/geofences",
{

name,

center:{

latitude:lat,

longitude:lng,

},

radius:rad,

}
);





resetForm();


onSuccess();


onClose();



}

catch(error:any)
{


console.error(
"Geofence Error:",
error
);



setError(

error.response?.data?.message ||

"Failed to create geofence"

);


}

finally
{


setLoading(false);


}



};






return (

<div

onClick={onClose}

className="
fixed
inset-0
z-50
bg-black/50
flex
items-center
justify-center
p-4
"


>



<div


onClick={
(e)=>
e.stopPropagation()
}


className="
bg-white
w-full
max-w-lg
rounded-2xl
shadow-2xl
p-6
animate-in
"


>





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
flex
items-center
gap-2
">


<FaMapMarkerAlt
className="
text-blue-600
"
/>


Add Geofence


</h2>



<p className="
text-gray-500
text-sm
mt-1
">

Create a new tracking zone

</p>



</div>





<button


onClick={onClose}


className="
p-2
rounded-lg
hover:bg-gray-100
"


>


<FaTimes/>


</button>



</div>






{/* Error */}


{

error &&


<div className="
bg-red-100
text-red-700
p-3
rounded-lg
mb-4
text-sm
">


{error}


</div>


}








<form

onSubmit={handleSubmit}

className="
space-y-5
"


>





{/* Name */}



<div>


<label className="
block
font-medium
mb-2
">

Geofence Name

</label>



<input


ref={nameInput}


type="text"


required


value={name}


onChange={
(e)=>
setName(e.target.value)
}


placeholder="
Warehouse Zone
"


className="
w-full
border
rounded-lg
p-3
outline-none
focus:ring-2
focus:ring-blue-500
"


/>


</div>








{/* Coordinates */}



<div className="
grid
grid-cols-1
sm:grid-cols-2
gap-4
">



<div>


<label className="
block
font-medium
mb-2
">

Latitude

</label>



<input


type="number"


step="any"


required


value={latitude}


onChange={
(e)=>
setLatitude(
e.target.value
)
}


placeholder="28.6692"


className="
w-full
border
rounded-lg
p-3
outline-none
focus:ring-2
focus:ring-blue-500
"


/>



</div>








<div>


<label className="
block
font-medium
mb-2
">

Longitude

</label>



<input


type="number"


step="any"


required


value={longitude}


onChange={
(e)=>
setLongitude(
e.target.value
)
}


placeholder="77.4538"


className="
w-full
border
rounded-lg
p-3
outline-none
focus:ring-2
focus:ring-blue-500
"


/>



</div>



</div>








{/* Radius */}



<div>


<label className="
block
font-medium
mb-2
">

Radius (Meters)

</label>



<input


type="number"


required


min="1"


value={radius}


onChange={
(e)=>
setRadius(
e.target.value
)
}


placeholder="500"


className="
w-full
border
rounded-lg
p-3
outline-none
focus:ring-2
focus:ring-blue-500
"


/>



</div>








{/* Buttons */}



<div className="
flex
flex-col-reverse
sm:flex-row
justify-end
gap-3
pt-3
">





<button


type="button"


onClick={onClose}


className="
px-5
py-3
rounded-lg
border
hover:bg-gray-100
"


>

Cancel

</button>






<button


type="submit"


disabled={loading}


className="
px-5
py-3
rounded-lg
bg-blue-600
text-white
hover:bg-blue-700
disabled:opacity-50
"


>


{

loading

?

"Saving..."

:

"Save Geofence"

}



</button>





</div>





</form>





</div>



</div>

);


};



export default AddGeofenceModal;