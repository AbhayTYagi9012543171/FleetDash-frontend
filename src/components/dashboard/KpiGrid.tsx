import React from "react";


interface Props {

  title:string;

  value:string;

  icon:React.ElementType;

  color:string;

  description:string;

  trend?:string;

}



const KpiCard:React.FC<Props> = ({
  title,
  value,
  icon:Icon,
  color,
  description,
  trend
}) => {


return (

<div
className="
bg-white
rounded-2xl
shadow-md
border
border-gray-100
p-5
hover:shadow-xl
transition
duration-300
group
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
text-gray-500
font-medium
"
>

{title}

</p>



<h2
className="
text-3xl
font-bold
text-slate-800
mt-2
"
>

{value}

</h2>


</div>




<div
className={`
${color}
w-14
h-14
rounded-xl
flex
items-center
justify-center
text-white
text-2xl
shadow-lg
group-hover:scale-110
transition
`}
>

<Icon />

</div>


</div>






<div
className="
mt-4
flex
items-center
justify-between
"
>


<p
className="
text-sm
text-gray-500
"
>

{description}

</p>



{
trend && (

<span
className={`
text-xs
font-semibold
px-3
py-1
rounded-full

${
trend.includes("-")
?
"bg-red-100 text-red-600"
:
trend==="Attention"
?
"bg-orange-100 text-orange-600"
:
"bg-green-100 text-green-600"
}

`}
>

{trend}

</span>

)

}


</div>



</div>


);


};


export default KpiCard;