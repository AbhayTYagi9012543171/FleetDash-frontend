import type { IconType } from "react-icons";


interface Props {

  title: string;

  value: string;

  icon: IconType;

  color: string;

  description: string;

  trend?: string;

}



const KpiCard = ({
  title,
  value,
  icon: Icon,
  color,
  description,
  trend,
}: Props) => {



  const getTrendStyle = () => {

    if (!trend) return "";


    if (
      trend.includes("-")
    ) {

      return "bg-red-100 text-red-600";

    }


    if (
      trend === "Attention"
    ) {

      return "bg-orange-100 text-orange-600";

    }


    return "bg-green-100 text-green-600";

  };




  return (

    <div

      className="
      bg-white
      rounded-2xl
      border
      border-gray-100
      shadow-sm
      hover:shadow-xl
      hover:-translate-y-1
      transition-all
      duration-300
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




        <div>


          <p
            className="
            text-xs
            uppercase
            tracking-wider
            text-gray-500
            font-semibold
            "
          >

            {title}

          </p>





          <h2
            className="
            text-3xl
            font-bold
            text-gray-900
            mt-2
            "
          >

            {value}

          </h2>





          <p
            className="
            text-sm
            text-gray-400
            mt-2
            "
          >

            {description}

          </p>





          {
            trend && (

              <span

                className={`
                inline-block
                mt-3
                text-xs
                font-semibold
                px-3
                py-1
                rounded-full
                ${getTrendStyle()}
                `}

              >

                {trend}

              </span>

            )

          }



        </div>







        <div

          className={`
          ${color}
          h-14
          w-14
          rounded-xl
          flex
          items-center
          justify-center
          shadow-lg
          flex-shrink-0
          `}

        >


          <Icon

            className="
            text-white
            text-2xl
            "

            aria-hidden="true"

          />


        </div>




      </div>




    </div>

  );

};



export default KpiCard;