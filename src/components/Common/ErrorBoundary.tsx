import { Component } from "react";
import type { ReactNode } from "react";


interface Props {
  children: ReactNode;
}


interface State {
  hasError: boolean;
}


class ErrorBoundary extends Component<Props, State> {


  constructor(props: Props) {

    super(props);

    this.state = {
      hasError: false,
    };

  }



  static getDerivedStateFromError(): State {

    return {
      hasError: true,
    };

  }



  componentDidCatch(error: Error) {

    console.error(
      "Error Boundary:",
      error
    );

  }



  render() {


    if(this.state.hasError){

      return (

        <div className="
        flex
        items-center
        justify-center
        h-screen
        bg-gray-100
        ">

          <div className="
          bg-white
          rounded-xl
          shadow-md
          p-8
          text-center
          ">

            <h1 className="
            text-3xl
            font-bold
            text-red-600
            ">
              Something went wrong
            </h1>

            <p className="text-gray-500 mt-3">
              Please refresh the page
            </p>

          </div>

        </div>

      );

    }


    return this.props.children;

  }


}


export default ErrorBoundary;