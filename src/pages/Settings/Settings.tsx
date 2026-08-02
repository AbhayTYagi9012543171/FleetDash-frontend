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
  FiUser,
  FiShield,
  FiDatabase,
  FiLock,
} from "react-icons/fi";


import toast from "react-hot-toast";

import { api } from "../../services/api";





interface SettingsData {


emailNotification:boolean;

smsNotification:boolean;

darkMode:boolean;

language:string;

timezone:string;

twoFactor:boolean;

autoBackup:boolean;

}



const Settings =()=>{



const [settings,setSettings]=useState<SettingsData>({

emailNotification:true,

smsNotification:false,

darkMode:false,

language:"English",

timezone:"Asia/Kolkata",

twoFactor:false,

autoBackup:true,

});



const [loading,setLoading]=useState(false);

const [saving,setSaving]=useState(false);






// ================= FETCH =================


const fetchSettings=async()=>{


try{


setLoading(true);


const response =
await api.get("/settings");



if(response.data?.success){

setSettings(
response.data.settings
);

}



}

catch(error){

console.error(error);

toast.error(
"Unable to load settings"
);


}

finally{

setLoading(false);

}


};







useEffect(()=>{

fetchSettings();

},[]);









// ================= UPDATE =================


const updateSetting=(

key:keyof SettingsData,

value:boolean|string

)=>{


setSettings({

...settings,

[key]:value

});


};









// ================= SAVE =================


const saveSettings=async()=>{


try{


setSaving(true);



await api.put(

"/settings",

settings

);



toast.success(
"Settings saved successfully"
);



}

catch(error){


console.error(error);


toast.error(
"Failed to update settings"
);



}

finally{


setSaving(false);


}


};








if(loading){


return (

<div className="
h-64
flex
items-center
justify-center
text-xl
font-semibold
">

Loading Settings...


</div>

);


}








return (



<div className="space-y-6">





{/* HEADER */}


<div>


<h1 className="
text-3xl
font-bold
text-gray-800
">

Settings

</h1>


<p className="
text-gray-500
">

Manage your FleetDash account and system preferences

</p>


</div>









{/* PROFILE CARD */}



<div className="
bg-white
shadow
rounded-xl
p-6
flex
items-center
gap-5
">


<div className="
w-16
h-16
rounded-full
bg-blue-100
flex
items-center
justify-center
text-blue-600
text-3xl
">


<FiUser/>


</div>



<div>


<h2 className="
text-xl
font-bold
">

Admin User

</h2>


<p className="text-gray-500">

Fleet Manager Account

</p>


</div>



</div>









<div className="
grid
grid-cols-1
lg:grid-cols-2
gap-6
">







{/* NOTIFICATIONS */}



<SettingCard

icon={<FiBell/>}

title="Notifications"

>



<Toggle

label="Email Alerts"

description="Receive vehicle and system alerts"

checked={
settings.emailNotification
}

onChange={
v=>
updateSetting(
"emailNotification",
v
)
}

/>





<Toggle

label="SMS Alerts"

description="Receive emergency messages"

checked={
settings.smsNotification
}

onChange={
v=>
updateSetting(
"smsNotification",
v
)
}

/>



</SettingCard>











{/* SECURITY */}


<SettingCard

icon={<FiShield/>}

title="Security"

>



<Toggle

label="Two Factor Authentication"

description="Protect account login"

checked={
settings.twoFactor
}

onChange={
v=>
updateSetting(
"twoFactor",
v
)
}

/>



<div className="
flex
items-center
gap-3
border
p-3
rounded-lg
">


<FiLock/>


<div>

<p className="font-medium">

Password

</p>


<p className="text-sm text-gray-500">

Last changed 30 days ago

</p>


</div>


<button className="
ml-auto
text-blue-600
">

Change

</button>



</div>




</SettingCard>













{/* APPEARANCE */}



<SettingCard

icon={<FiMoon/>}

title="Appearance"

>



<Toggle

label="Dark Mode"

description="Enable dark dashboard theme"

checked={
settings.darkMode
}

onChange={
v=>
updateSetting(
"darkMode",
v
)
}

/>



</SettingCard>











{/* LANGUAGE */}



<SettingCard

icon={<FiGlobe/>}

title="Language Preference"

>


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
e=>
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


<option>
French
</option>


</select>



</SettingCard>













{/* TIMEZONE */}



<SettingCard

icon={<FiClock/>}

title="Timezone"

>


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
e=>
updateSetting(
"timezone",
e.target.value
)
}


/>



</SettingCard>













{/* DATABASE */}



<SettingCard

icon={<FiDatabase/>}

title="Data Management"

>



<Toggle

label="Automatic Backup"

description="Backup fleet data daily"

checked={
settings.autoBackup
}


onChange={
v=>
updateSetting(
"autoBackup",
v
)
}


/>


</SettingCard>





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
rounded-xl
flex
items-center
gap-2
font-semibold
"


>


<FiSave/>


{

saving

?

"Saving..."

:

"Save Changes"

}



</button>





</div>


);

};









// ================= CARD =================



const SettingCard=({

icon,

title,

children

}:{

icon:React.ReactNode;

title:string;

children:React.ReactNode;

})=>{


return (

<div className="
bg-white
shadow
rounded-xl
p-6
space-y-5
">


<h2 className="
text-xl
font-bold
flex
items-center
gap-3
">


<span className="
text-blue-600
">

{icon}

</span>


{title}


</h2>



{children}


</div>


);


};











// ================= TOGGLE =================


const Toggle=({

label,

description,

checked,

onChange

}:{

label:string;

description:string;

checked:boolean;

onChange:(v:boolean)=>void;


})=>{


return (


<div className="
flex
justify-between
items-center
">


<div>


<p className="
font-medium
">

{label}

</p>


<p className="
text-sm
text-gray-500
">

{description}

</p>


</div>




<button

onClick={()=>onChange(!checked)}

className={`

w-12
h-6
rounded-full
transition
p-1

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