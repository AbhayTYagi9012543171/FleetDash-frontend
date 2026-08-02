import {
  Component,
} from "react";

import type {
  ReactNode,
} from "react";



interface Props {

  children:ReactNode;

}



interface State {

  hasError:boolean;

  error?:Error;

}




class ErrorBoundary extends Component<Props,State>{



constructor(props:Props){

super(props);


this.state={

hasError:false,

error:undefined,

};


}





static getDerivedStateFromError(
error:Error
):State{


return{

hasError:true,

error,

};


}





componentDidCatch(
error:Error,
errorInfo:any
){


console.error(
"Error Boundary:",
error
);


console.error(
"Error Info:",
errorInfo
);


}






handleReload = ()=>{


window.location.reload();


};






render(){



if(this.state.hasError){



return(



<div className="
min-h-screen
flex
items-center
justify-center
bg-gray-100
p-5
">





<div className="
bg-white
rounded-2xl
shadow-xl
p-8
max-w-md
text-center
">





<div className="
text-6xl
mb-5
">

⚠️

</div>





<h1 className="
text-3xl
font-bold
text-red-600
">

Something went wrong

</h1>






<p className="
text-gray-500
mt-3
">

An unexpected error occurred.

Please reload the application.

</p>







<button


onClick={this.handleReload}


className="
mt-6
bg-blue-600
hover:bg-blue-700
text-white
px-6
py-3
rounded-xl
font-semibold
transition
"


>


Reload Application


</button>





{
import.meta.env.DEV && this.state.error && (

<details className="
mt-6
text-left
bg-gray-100
rounded-lg
p-3
text-sm
text-red-500
overflow-auto
">


<summary className="
cursor-pointer
font-semibold
">

Error Details

</summary>



<pre className="
mt-2
whitespace-pre-wrap
">

{this.state.error.message}

</pre>



</details>

)

}







</div>





</div>



);



}





return this.props.children;



}



}



export default ErrorBoundary;