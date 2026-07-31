import { useEffect, useState } from "react";

import { FiSave } from "react-icons/fi";

import { api } from "../../services/api";



interface SettingsData{

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






const fetchSettings=async()=>{


try{


const response =
await api.get("/settings");


if(response.data.success){

setSettings(
response.data.settings
);

}


}

catch(error){

console.log(error);

}


};







useEffect(()=>{

fetchSettings();

},[]);








const updateSetting=(key:keyof SettingsData,value:any)=>{


setSettings({

...settings,

[key]:value

});


};









const saveSettings=async()=>{


try{


setLoading(true);


await api.put(
"/settings",
settings
);



alert(
"Settings Updated Successfully"
);


}

catch(error){

console.log(error);

}

finally{

setLoading(false);

}


};









return (

<div className="space-y-6">


<h1 className="text-3xl font-bold">

Settings

</h1>




<div className="bg-white shadow rounded-xl p-6 space-y-5">



<div className="flex justify-between">


<span>
Email Notification
</span>


<input

type="checkbox"

checked={
settings.emailNotification
}

onChange={
(e)=>
updateSetting(
"emailNotification",
e.target.checked
)
}

/>


</div>





<div className="flex justify-between">


<span>
SMS Notification
</span>


<input

type="checkbox"

checked={
settings.smsNotification
}

onChange={
(e)=>
updateSetting(
"smsNotification",
e.target.checked
)
}

/>


</div>






<div className="flex justify-between">


<span>
Dark Mode
</span>


<input

type="checkbox"

checked={
settings.darkMode
}

onChange={
(e)=>
updateSetting(
"darkMode",
e.target.checked
)
}

/>


</div>






<div>


<label>
Language
</label>


<select

className="border p-2 rounded w-full"

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







<div>


<label>
Timezone
</label>


<input

className="border p-2 rounded w-full"

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







<button

onClick={saveSettings}

className="bg-blue-600 text-white px-5 py-3 rounded-lg flex items-center gap-2"

>


<FiSave/>


{
loading
?
"Saving..."
:
"Save Settings"
}


</button>





</div>


</div>


);


};


export default Settings;