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
  FiEdit,
  FiRotateCcw,
  FiX
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




const defaultSettings:SettingsData={

emailNotification:true,

smsNotification:false,

darkMode:false,

language:"English",

timezone:"Asia/Kolkata",

twoFactor:false,

autoBackup:true,

};





const Settings=()=>{


const [settings,setSettings]=
useState<SettingsData>(
defaultSettings
);



const [loading,setLoading]=
useState(false);


const [saving,setSaving]=
useState(false);



const [showPassword,setShowPassword]=
useState(false);



const [password,setPassword]=
useState("");







// ================= FETCH SETTINGS =================


const fetchSettings=async()=>{


try{


setLoading(true);


const response=
await api.get("/settings");



if(response.data?.success){

setSettings(
{
...defaultSettings,
...response.data.settings
}
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
"Settings update failed"
);


}

finally{


setSaving(false);


}


};









// ================= RESET =================


const resetSettings=()=>{


setSettings(
defaultSettings
);


toast.success(
"Settings reset"
);


};









// ================= CHANGE PASSWORD =================


const changePassword=()=>{


if(password.length<6){

toast.error(
"Password minimum 6 characters"
);

return;

}



toast.success(
"Password changed successfully"
);



setPassword("");

setShowPassword(false);


};







if(loading){


return (

<div className="
h-64
flex
items-center
justify-center
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

Manage FleetDash account and system preferences

</p>


</div>










{/* PROFILE */}



<div className="
bg-white
shadow
rounded-xl
p-6
flex
justify-between
items-center
">


<div className="
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


<p className="
text-gray-500
">

Fleet Manager

</p>


</div>



</div>





<button

onClick={()=>toast.success("Profile edit opened")}

className="
flex
items-center
gap-2
bg-blue-600
text-white
px-4
py-2
rounded-lg
"

>

<FiEdit/>

Edit Profile

</button>



</div>










<div className="
grid
grid-cols-1
lg:grid-cols-2
gap-6
">







<SettingCard

title="Notifications"

icon={<FiBell/>}

>


<Toggle

label="Email Alerts"

description="Receive fleet alerts"

checked={
settings.emailNotification
}

onChange={
v=>updateSetting(
"emailNotification",
v
)
}

/>




<Toggle

label="SMS Alerts"

description="Emergency messages"

checked={
settings.smsNotification
}

onChange={
v=>updateSetting(
"smsNotification",
v
)
}

/>


</SettingCard>









<SettingCard

title="Security"

icon={<FiShield/>}

>


<Toggle

label="Two Factor Authentication"

description="Secure account login"

checked={
settings.twoFactor
}

onChange={
v=>updateSetting(
"twoFactor",
v
)
}

/>



<div className="
border
rounded-lg
p-4
">


<div className="
flex
justify-between
">


<div>


<p className="font-medium">

Password

</p>


<p className="
text-sm
text-gray-500
">

Change account password

</p>


</div>


<button

onClick={()=>setShowPassword(true)}

className="
text-blue-600
"

>

<FiLock/>

</button>


</div>


</div>



</SettingCard>









<SettingCard

title="Appearance"

icon={<FiMoon/>}

>


<Toggle

label="Dark Mode"

description="Enable dark theme"

checked={
settings.darkMode
}

onChange={
v=>updateSetting(
"darkMode",
v
)
}

/>



</SettingCard>









<SettingCard

title="Language"

icon={<FiGlobe/>}

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
e=>updateSetting(
"language",
e.target.value
)
}

>


<option>English</option>

<option>Hindi</option>

<option>French</option>


</select>


</SettingCard>









<SettingCard

title="Timezone"

icon={<FiClock/>}

>


<select

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
e=>updateSetting(
"timezone",
e.target.value
)
}

>


<option>
Asia/Kolkata
</option>


<option>
America/New_York
</option>


<option>
Europe/London
</option>


</select>


</SettingCard>









<SettingCard

title="Database"

icon={<FiDatabase/>}

>


<Toggle

label="Automatic Backup"

description="Daily fleet backup"

checked={
settings.autoBackup
}

onChange={
v=>updateSetting(
"autoBackup",
v
)
}

/>



</SettingCard>







</div>







<div className="
flex
gap-4
">


<button

onClick={saveSettings}

disabled={saving}

className="
bg-blue-600
text-white
px-6
py-3
rounded-lg
flex
gap-2
items-center
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






<button

onClick={resetSettings}

className="
bg-gray-700
text-white
px-6
py-3
rounded-lg
flex
gap-2
items-center
"

>


<FiRotateCcw/>

Reset


</button>



</div>









{/* PASSWORD MODAL */}



{
showPassword &&


<div className="
fixed
inset-0
bg-black/40
flex
items-center
justify-center
">


<div className="
bg-white
p-6
rounded-xl
w-96
space-y-4
">


<div className="
flex
justify-between
">


<h2 className="
text-xl
font-bold
">

Change Password

</h2>


<button

onClick={()=>setShowPassword(false)}

>

<FiX/>

</button>


</div>



<input

type="password"

className="
border
p-3
w-full
rounded-lg
"

placeholder="New Password"

value={password}

onChange={
e=>setPassword(e.target.value)
}

/>




<button

onClick={changePassword}

className="
bg-blue-600
text-white
w-full
py-3
rounded-lg
"

>

Update Password

</button>



</div>


</div>


}



</div>


);


};









const SettingCard=({

title,

icon,

children

}:{

title:string;

icon:React.ReactNode;

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
gap-3
items-center
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
p-1
transition
${checked?"bg-blue-600":"bg-gray-300"}
`}

>


<div

className={`
bg-white
w-4
h-4
rounded-full
transition
${checked?"translate-x-6":""}
`}

/>


</button>



</div>


);


};





export default Settings;