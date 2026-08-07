import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import type {
  ReactNode,
} from "react";

import {
  FiAlertCircle,
  FiAlertTriangle,
  FiBell,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiFilter,
  FiMapPin,
  FiRefreshCw,
  FiSearch,
  FiXCircle,
} from "react-icons/fi";

import { api } from "../../services/api";


// ======================================================
// TYPES
// ======================================================


type Severity =
  | "Critical"
  | "High"
  | "Medium"
  | "Low";


type AlertStatus =
  | "Active"
  | "Pending"
  | "Resolved";


interface Alert {

  _id: string;

  alertType: string;

  severity: Severity | string;

  message: string;

  location?: string;

  status: AlertStatus | string;

  createdAt: string;

  vehicleId?: string;

  driverId?: string;

}



type SeverityFilter =
  | "All"
  | Severity;


type StatusFilter =
  | "All"
  | AlertStatus;


type SortOrder =
  | "newest"
  | "oldest";


// ======================================================
// CONSTANT CONFIG
// ======================================================


const severityConfig = {


  Critical: {

    border:
      "border-l-red-500",

    icon:
      "bg-red-50 text-red-600 border-red-100",

    badge:
      "bg-red-50 text-red-600 border-red-100",

    dot:
      "bg-red-500",

    value:
      "text-red-600",

    priority:4,

  },


  High: {

    border:
      "border-l-orange-500",

    icon:
      "bg-orange-50 text-orange-600 border-orange-100",

    badge:
      "bg-orange-50 text-orange-600 border-orange-100",

    dot:
      "bg-orange-500",

    value:
      "text-orange-600",

    priority:3,

  },


  Medium: {

    border:
      "border-l-yellow-500",

    icon:
      "bg-yellow-50 text-yellow-600 border-yellow-100",

    badge:
      "bg-yellow-50 text-yellow-600 border-yellow-100",

    dot:
      "bg-yellow-500",

    value:
      "text-yellow-600",

    priority:2,

  },


  Low: {

    border:
      "border-l-green-500",

    icon:
      "bg-green-50 text-green-600 border-green-100",

    badge:
      "bg-green-50 text-green-600 border-green-100",

    dot:
      "bg-green-500",

    value:
      "text-green-600",

    priority:1,

  },


} as const;



// ======================================================
// HELPERS
// ======================================================


const normalize = (
  value?:string
)=>
value
?.toLowerCase()
.trim()
||
"";



const formatDate = (
 value?:string
)=>{


 if(!value)
 {
  return "--";
 }


 const date =
 new Date(value);


 if(
 Number.isNaN(
 date.getTime()
 )
 )
 {
  return "--";
 }


 return date.toLocaleDateString(
 "en-IN",
 {
  day:"2-digit",
  month:"short",
  year:"numeric",
 }
 );

};



const formatTime = (
 value?:string
)=>{


 if(!value)
 {
  return "--";
 }


 const date =
 new Date(value);


 if(
 Number.isNaN(
 date.getTime()
 )
 )
 {
  return "--";
 }


 return date.toLocaleTimeString(
 "en-IN",
 {
  hour:"2-digit",
  minute:"2-digit",
 }
 );

};



const getSeverity =
(
 severity?:string
)=>
{

 const key =
 Object.keys(
 severityConfig
 )
 .find(
 item =>
 normalize(item)
 ===
 normalize(severity)
 );


 return (
 severityConfig[
 key as keyof typeof severityConfig
 ]
 ??
 severityConfig.Low
 );

};



const getStatusClass =
(
 status?:string
)=>
{

 switch(
 normalize(status)
 )
 {

 case "active":

 return (
 "bg-red-50 text-red-600 border-red-100"
 );


 case "pending":

 return (
 "bg-yellow-50 text-yellow-600 border-yellow-100"
 );


 case "resolved":

 return (
 "bg-green-50 text-green-600 border-green-100"
 );


 default:

 return (
 "bg-slate-50 text-slate-600 border-slate-100"
 );

 }

};



// ======================================================
// COMPONENT
// ======================================================


const Alerts = () =>
{


// ======================================================
// STATE
// ======================================================


const [
 alerts,
 setAlerts
]
=
useState<Alert[]>([]);



const [
 loading,
 setLoading
]
=
useState(true);



const [
 refreshing,
 setRefreshing
]
=
useState(false);



const [
 error,
 setError
]
=
useState("");



const [
 search,
 setSearch
]
=
useState("");



const [
 severityFilter,
 setSeverityFilter
]
=
useState<SeverityFilter>(
"All"
);



const [
 statusFilter,
 setStatusFilter
]
=
useState<StatusFilter>(
"All"
);



const [
 sortOrder,
 setSortOrder
]
=
useState<SortOrder>(
"newest"
);



const [
 showFilters,
 setShowFilters
]
=
useState(false);



// ======================================================
// FETCH ALERTS
// ======================================================


const fetchAlerts =
useCallback(
async()=>{


try {


setError("");



const response =
await api.get(
"/alerts"
);



const data =
response?.data?.alerts ??
response?.data?.data ??
response?.data ??
[];



setAlerts(
Array.isArray(data)
?
data
:
[]
);



}
catch(error)
{


console.error(
"Alert Fetch Error:",
error
);


setError(
"Unable to load fleet alerts."
);


}
finally
{


setLoading(false);


}



},
[]
);



// ======================================================
// INITIAL LOAD + AUTO REFRESH
// ======================================================


useEffect(
()=>{


fetchAlerts();



const timer =
window.setInterval(
fetchAlerts,
15000
);



return ()=>{

window.clearInterval(
timer
);

};


},
[
fetchAlerts
]
);



// ======================================================
// MANUAL REFRESH
// ======================================================


const handleRefresh =
async()=>{


try{


setRefreshing(true);


await fetchAlerts();


}
finally{


setRefreshing(false);


}


};


// ======================================================
// STATISTICS
// ======================================================


const statistics =
useMemo(
()=>{


const countSeverity =
(
 value:string
)=>
alerts.filter(
 alert =>
 normalize(alert.severity)
 ===
 normalize(value)
)
.length;



const countStatus =
(
 value:string
)=>
alerts.filter(
 alert =>
 normalize(alert.status)
 ===
 normalize(value)
)
.length;



return {


total:
alerts.length,


critical:
countSeverity(
"Critical"
),


high:
countSeverity(
"High"
),


medium:
countSeverity(
"Medium"
),


low:
countSeverity(
"Low"
),


active:
countStatus(
"Active"
),


pending:
countStatus(
"Pending"
),


resolved:
countStatus(
"Resolved"
),



resolutionRate:
alerts.length
?
(
 countStatus("Resolved")
 /
 alerts.length
 *
 100
).toFixed(1)
:
"0"



};


},
[
alerts
]
);




// ======================================================
// FILTER + SORT
// ======================================================


const filteredAlerts =
useMemo(
()=>{


const result =
alerts.filter(
(alert)=>{


const searchText =
normalize(search);



const matchesSearch =
!searchText ||

normalize(
alert.alertType
)
.includes(
searchText
)

||

normalize(
alert.message
)
.includes(
searchText
)

||

normalize(
alert.location
)
.includes(
searchText
)

||

normalize(
alert.severity
)
.includes(
searchText
)

||

normalize(
alert.status
)
.includes(
searchText
);



const matchesSeverity =
severityFilter==="All"

||

normalize(
alert.severity
)
===
normalize(
severityFilter
);



const matchesStatus =
statusFilter==="All"

||

normalize(
alert.status
)
===
normalize(
statusFilter
);



return (

matchesSearch

&&

matchesSeverity

&&

matchesStatus

);


}
);



return result.sort(
(a,b)=>{


const first =
new Date(
a.createdAt
)
.getTime();



const second =
new Date(
b.createdAt
)
.getTime();



return sortOrder==="newest"

?

second-first

:

first-second;


}
);


},
[
alerts,
search,
severityFilter,
statusFilter,
sortOrder
]
);




// ======================================================
// STAT CARD COMPONENT
// ======================================================


const StatCard =
({
 title,
 value,
 description,
 icon,
 iconClass,
 valueClass,

}:{

title:string;

value:number;

description:string;

icon:ReactNode;

iconClass:string;

valueClass:string;

})=>{


return (

<div
className="
rounded-2xl
border
border-slate-200
bg-white
p-5
shadow-sm
transition
hover:shadow-md
"
>


<div
className="
flex
items-center
justify-between
"
>


<div>


<p
className="
text-sm
font-medium
text-slate-500
"
>
{title}
</p>



<p
className={`
mt-2
text-3xl
font-bold
${valueClass}
`}
>
{value}
</p>



<p
className="
mt-2
text-xs
text-slate-500
"
>
{description}
</p>


</div>



<div
className={`
flex
h-12
w-12
items-center
justify-center
rounded-xl
border
${iconClass}
`}
>

{icon}

</div>


</div>


</div>

);


};




// ======================================================
// LOADING COMPONENT
// ======================================================


const LoadingScreen = () => (

<div
className="
mx-auto
max-w-7xl
space-y-6
p-6
animate-pulse
"
>


<div
className="
h-12
w-72
rounded-lg
bg-slate-100
"
/>



<div
className="
grid
grid-cols-1
gap-5
sm:grid-cols-2
xl:grid-cols-4
"
>

{
Array
.from({
length:4
})
.map(
(_,index)=>(

<div

key={index}

className="
h-36
rounded-2xl
bg-slate-100
"

/>

)
)
}

</div>



<div
className="
rounded-2xl
bg-slate-100
h-96
"
/>


</div>

);




// ======================================================
// ERROR COMPONENT
// ======================================================


const ErrorBox =
()=>{


return (

<div
className="
rounded-2xl
border
border-red-200
bg-red-50
p-5
"
>


<div
className="
flex
items-center
justify-between
gap-4
"
>


<div
className="
flex
items-center
gap-3
"
>


<div
className="
flex
h-10
w-10
items-center
justify-center
rounded-full
bg-white
text-red-600
"
>

<FiXCircle/>

</div>



<div>

<h3
className="
font-bold
text-red-800
"
>

Alert Service Error

</h3>


<p
className="
text-sm
text-red-600
"
>

{error}

</p>


</div>


</div>



<button

onClick={handleRefresh}

className="
rounded-lg
bg-red-600
px-4
py-2
text-sm
font-semibold
text-white
hover:bg-red-700
"

>

Retry

</button>


</div>


</div>

);

};




// ======================================================
// EMPTY STATE
// ======================================================


const EmptyState =
()=>{


return (

<div
className="
flex
min-h-[360px]
flex-col
items-center
justify-center
text-center
px-6
"
>


<div
className="
flex
h-20
w-20
items-center
justify-center
rounded-full
bg-green-50
text-green-600
"
>

<FiCheckCircle size={35}/>

</div>



<h3
className="
mt-5
text-xl
font-bold
text-slate-900
"
>

No Alerts Found

</h3>



<p
className="
mt-2
max-w-md
text-sm
text-slate-500
"
>

No fleet alerts match your current filters.

</p>



{
(
search
||
severityFilter!=="All"
||
statusFilter!=="All"
)

&&


<button

onClick={()=>{

setSearch("");

setSeverityFilter(
"All"
);

setStatusFilter(
"All"
);

}}

className="
mt-5
rounded-lg
bg-blue-600
px-4
py-2
text-sm
font-semibold
text-white
hover:bg-blue-700
"

>

Clear Filters

</button>

}


</div>

);

};




// ======================================================
// LOADING RETURN
// ======================================================


if(loading)
{

return (

<LoadingScreen/>

);

}


// ======================================================
// MAIN UI
// ======================================================


return (

<div
className="
mx-auto
max-w-7xl
space-y-6
p-4
sm:p-6
lg:p-8
"
>


{/* ================= HEADER ================= */}


<section
className="
rounded-2xl
border
border-slate-200
bg-white
p-6
shadow-sm
"
>


<div
className="
flex
flex-col
gap-6
lg:flex-row
lg:items-center
lg:justify-between
"
>


<div
className="
flex
items-center
gap-4
"
>


<div
className="
flex
h-14
w-14
items-center
justify-center
rounded-2xl
border
border-red-100
bg-red-50
text-red-600
"
>

<FiAlertTriangle size={28}/>

</div>



<div>


<h1
className="
text-3xl
font-bold
tracking-tight
text-slate-900
"
>

Fleet Alerts

</h1>


<p
className="
mt-1
text-sm
text-slate-500
"
>

Monitor operational warnings,
critical events and fleet health.

</p>


</div>


</div>




<button

onClick={handleRefresh}

disabled={refreshing}

className="
inline-flex
items-center
justify-center
gap-2
rounded-xl
border
border-slate-200
bg-white
px-5
py-3
text-sm
font-semibold
text-slate-700
shadow-sm
hover:bg-slate-50
disabled:opacity-50
"

>


<FiRefreshCw

className={
refreshing
?
"animate-spin"
:
""
}

/>


{
refreshing
?
"Refreshing..."
:
"Refresh"
}


</button>


</div>




{/* SEARCH */}


<div
className="
mt-6
flex
flex-col
gap-3
lg:flex-row
"
>


<div
className="
relative
flex-1
"
>


<FiSearch

className="
absolute
left-4
top-1/2
-translate-y-1/2
text-slate-400
"

/>



<input

value={search}

onChange={
e=>setSearch(
e.target.value
)
}

placeholder="
Search alerts, vehicle,
location...
"

className="
w-full
rounded-xl
border
border-slate-200
py-3
pl-11
pr-4
outline-none
focus:border-blue-400
"

 />


</div>




<button

onClick={()=>setShowFilters(
!showFilters
)}

className="
inline-flex
items-center
justify-center
gap-2
rounded-xl
border
border-slate-200
px-5
py-3
text-sm
font-semibold
hover:bg-slate-50
"

>

<FiFilter/>

Filters

</button>


</div>




{
showFilters &&

<div
className="
mt-5
grid
grid-cols-1
gap-4
rounded-xl
bg-slate-50
p-4
md:grid-cols-3
"
>


<select

value={severityFilter}

onChange={
e=>
setSeverityFilter(
e.target.value as SeverityFilter
)
}

className="
rounded-lg
border
p-3
"

>

<option>
All
</option>

<option>
Critical
</option>

<option>
High
</option>

<option>
Medium
</option>

<option>
Low
</option>

</select>




<select

value={statusFilter}

onChange={
e=>
setStatusFilter(
e.target.value as StatusFilter
)
}

className="
rounded-lg
border
p-3
"

>

<option>
All
</option>

<option>
Active
</option>

<option>
Pending
</option>

<option>
Resolved
</option>

</select>




<select

value={sortOrder}

onChange={
e=>
setSortOrder(
e.target.value as SortOrder
)
}

className="
rounded-lg
border
p-3
"

>

<option value="newest">

Newest First

</option>


<option value="oldest">

Oldest First

</option>


</select>


</div>

}


</section>





{
error &&
<ErrorBox/>
}





{/* ================= STATS ================= */}


<div
className="
grid
grid-cols-1
gap-5
sm:grid-cols-2
xl:grid-cols-4
"
>


<StatCard

title="Total Alerts"

value={statistics.total}

description="All fleet notifications"

icon={<FiBell size={22}/>}

iconClass="
bg-blue-50
text-blue-600
border-blue-100
"

valueClass="text-slate-900"

/>



<StatCard

title="Critical"

value={statistics.critical}

description="Immediate attention required"

icon={<FiAlertTriangle size={22}/>}

iconClass="
bg-red-50
text-red-600
border-red-100
"

valueClass="text-red-600"

/>



<StatCard

title="High Priority"

value={statistics.high}

description="High risk operations"

icon={<FiAlertCircle size={22}/>}

iconClass="
bg-orange-50
text-orange-600
border-orange-100
"

valueClass="text-orange-600"

/>



<StatCard

title="Pending"

value={statistics.pending}

description="Awaiting resolution"

icon={<FiClock size={22}/>}

iconClass="
bg-yellow-50
text-yellow-600
border-yellow-100
"

valueClass="text-yellow-600"

/>


</div>





{/* ================= HEALTH ================= */}


<section
className="
rounded-2xl
border
border-slate-200
bg-white
p-6
shadow-sm
"
>


<div
className="
flex
items-center
justify-between
"
>


<div>

<h2
className="
text-xl
font-bold
"
>

Alert Health

</h2>


<p
className="
text-sm
text-slate-500
"
>

Current fleet alert distribution

</p>


</div>


<FiCheckCircle
className="text-green-600"
size={28}
/>


</div>



<div
className="
mt-6
grid
grid-cols-2
gap-4
md:grid-cols-4
"
>


{

[
["Critical",statistics.critical],
["High",statistics.high],
["Pending",statistics.pending],
["Resolved",statistics.resolved]

].map(
(item)=>(


<div

key={item[0]}

className="
rounded-xl
border
bg-slate-50
p-4
"

>

<p
className="
text-sm
font-semibold
text-slate-600
"
>

{item[0]}

</p>


<p
className="
mt-2
text-3xl
font-bold
"
>

{item[1]}

</p>


</div>


)
)

}


</div>


</section>






{/* ================= ALERT LIST ================= */}



<section
className="
overflow-hidden
rounded-2xl
border
border-slate-200
bg-white
shadow-sm
"
>


<div
className="
border-b
p-5
"
>


<h2
className="
text-xl
font-bold
"
>

Alert Activity

</h2>


<p
className="
text-sm
text-slate-500
"
>

{filteredAlerts.length}
alerts displayed

</p>


</div>




{
filteredAlerts.length===0

?

<EmptyState/>

:

<div
className="
divide-y
divide-slate-100
"
>


{

filteredAlerts.map(
(alert)=>
{


const severity =
getSeverity(
alert.severity
);



return (

<article

key={alert._id}

className={`
border-l-4
${severity.border}
p-5
hover:bg-slate-50
transition
`}

>


<div
className="
flex
flex-col
gap-5
lg:flex-row
lg:justify-between
"
>



<div
className="
flex
gap-4
"
>


<div
className={`
flex
h-12
w-12
items-center
justify-center
rounded-xl
border
${severity.icon}
`}
>

<FiAlertTriangle/>

</div>



<div>


<div
className="
flex
flex-wrap
gap-2
"
>


<h3
className="
font-bold
"
>

{
alert.alertType ||
"Fleet Alert"
}

</h3>



<span
className={`
rounded-full
border
px-3
py-1
text-xs
${severity.badge}
`}
>

{alert.severity}

</span>



<span
className={`
rounded-full
border
px-3
py-1
text-xs
${getStatusClass(alert.status)}
`}
>

{alert.status}

</span>


</div>




<p
className="
mt-2
text-sm
text-slate-600
"
>

{alert.message}

</p>



<div
className="
mt-3
flex
flex-wrap
gap-4
text-xs
text-slate-500
"
>


<span>

<FiMapPin className="inline"/>

{" "}
{alert.location || "Unknown"}

</span>


<span>

<FiCalendar className="inline"/>

{" "}
{formatDate(alert.createdAt)}

</span>


<span>

<FiClock className="inline"/>

{" "}
{formatTime(alert.createdAt)}

</span>


</div>


</div>


</div>



<div
className="
flex
items-center
gap-2
"
>


{

Array
.from({
length:severity.priority
})
.map(
(_,i)=>(

<span

key={i}

className={`
h-3
w-3
rounded-full
${severity.dot}
`}

/>

)

)

}


</div>



</div>


</article>

);


}

)

}


</div>

}



</section>





<footer
className="
rounded-xl
border
bg-white
px-5
py-4
text-sm
text-slate-500
"
>

<FiRefreshCw className="inline"/>

{" "}
Live monitoring active.
Auto refresh every 15 seconds.

</footer>




</div>

);


};



export default Alerts;