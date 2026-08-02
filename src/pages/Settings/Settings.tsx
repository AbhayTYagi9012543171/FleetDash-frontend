import {
  useEffect,
  useState,
} from "react";


import {
  FiSave,
  FiBell,
  FiMoon,
  FiGlobe,
  FiClock,
} from "react-icons/fi";


import toast from "react-hot-toast";


import { api } from "../../services/api";





interface SettingsData {

  emailNotification:boolean;

  smsNotification:boolean;

  darkMode:boolean;

  language:string;

  timezone:string;

}






const Settings =()=>{


const [settings,setSettings]=
useState<SettingsData>({

emailNotification:true,

smsNotification:false,

darkMode:false,

language:"English",

timezone:"Asia/Kolkata"

});



const [loading,setLoading]=
useState(false);



const [saving,setSaving]=
useState(false);






// ============================
// Fetch Settings
// ============================


const fetchSettings = async()=>{


try{


setLoading(true);



const response =
await api.get("/settings");



if(
response.data?.success
){

setSettings(
response.data.settings
);

}


}

catch(error){


console.error(
"Settings Error:",
error
);


toast.error(
"Failed to load settings"
);


}

finally{


setLoading(false);


}


};








useEffect(()=>{


fetchSettings();


},[]);









// ============================
// Update State
// ============================


const updateSetting = (

key:keyof SettingsData,

value:boolean|string

)=>{


setSettings({

...settings,

[key]:value

});


};









// ============================
// Save
// ============================


const saveSettings = async()=>{


try{


setSaving(true);



await api.put(

"/settings",

settings

);



toast.success(
"Settings updated successfully"
);



}

catch(error){


console.error(
error
);


toast.error(
"Update failed"
);


}

finally{


setSaving(false);


}


};









if(loading){


return (

<div className="
flex
justify-center
items-center
h-64
">

Loading Settings...


</div>


);


}







return (

<div className="space-y-6">





<h1 className="
text-3xl
font-bold
text-gray-800
">

Settings

</h1>





<div className="
grid
grid-cols-1
lg:grid-cols-2
gap-6
">






{/* Notification */}


<div className="
bg-white
rounded-xl
shadow
p-6
space-y-5
">


<h2 className="
text-xl
font-bold
flex
items-center
gap-2
">

<FiBell/>

Notifications

</h2>





<Toggle

label="Email Notification"

checked={
settings.emailNotification
}

onChange={
(value)=>
updateSetting(
"emailNotification",
value
)
}

/>





<Toggle

label="SMS Notification"

checked={
settings.smsNotification
}

onChange={
(value)=>
updateSetting(
"smsNotification",
value
)
}

/>




</div>









{/* Appearance */}


<div className="
bg-white
rounded-xl
shadow
p-6
space-y-5
">


<h2 className="
text-xl
font-bold
flex
items-center
gap-2
">

<FiMoon/>

Appearance

</h2>





<Toggle

label="Dark Mode"

checked={
settings.darkMode
}

onChange={
(value)=>
updateSetting(
"darkMode",
value
)
}

/>



</div>









{/* Language */}



<div className="
bg-white
rounded-xl
shadow
p-6
space-y-4
">


<h2 className="
text-xl
font-bold
flex
items-center
gap-2
">

<FiGlobe/>

Language

</h2>



<select

className="
border
rounded-lg
p-3
w-full
"

value={
settings.language
}

onChange={
(e)=>
updateSetting(
"language",
e.target.value
)
}

>


<option>
English
</option>


<option>
Hindi
</option>


</select>



</div>









{/* Timezone */}



<div className="
bg-white
rounded-xl
shadow
p-6
space-y-4
">


<h2 className="
text-xl
font-bold
flex
items-center
gap-2
">

<FiClock/>

Timezone

</h2>




<input

className="
border
rounded-lg
p-3
w-full
"

value={
settings.timezone
}

onChange={
(e)=>
updateSetting(
"timezone",
e.target.value
)
}

/>



</div>







</div>









<button

onClick={saveSettings}

disabled={saving}

className="
bg-blue-600
hover:bg-blue-700
disabled:bg-blue-300
text-white
px-6
py-3
rounded-lg
flex
items-center
gap-2
"

>


<FiSave/>


{
saving
?
"Saving..."
:
"Save Settings"
}


</button>





</div>


);


};










// ============================
// Toggle Component
// ============================


const Toggle =({

label,

checked,

onChange

}:{

label:string;

checked:boolean;

onChange:(value:boolean)=>void;

})=>{


return (

<div className="
flex
justify-between
items-center
">


<span>

{label}

</span>




<button

onClick={()=>onChange(!checked)}

className={`

w-12
h-6
rounded-full
p-1
transition

${

checked

?

"bg-blue-600"

:

"bg-gray-300"

}

`}

>


<div

className={`

bg-white
w-4
h-4
rounded-full
transition

${

checked

?

"translate-x-6"

:

""

}

`}

/>


</button>



</div>


);


};





export default Settings;