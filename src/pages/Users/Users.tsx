import { useEffect, useMemo, useState } from "react";
import {
  FiRefreshCw,
  FiTrash2,
  FiSearch,
} from "react-icons/fi";

import { api } from "../../services/api";


interface User {

  _id: string;

  username: string;

  phoneNumber: string;

  email: string;

  role: string;

  status: string;

}



const Users = () => {


  const [users, setUsers] = useState<User[]>([]);

  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");

  const [role, setRole] = useState("All");




  const fetchUsers = async () => {

    try {

      setLoading(true);

      const response = await api.get("/users");

      console.log("Users:", response.data);


      if (response.data.success) {

        setUsers(response.data.users);

      }


    } catch (error) {

      console.log("Users Error:", error);

    }
    finally {

      setLoading(false);

    }

  };





  useEffect(() => {

    fetchUsers();

  }, []);







  const deleteUser = async (id: string) => {

    try {

      await api.delete(`/users/${id}`);

      fetchUsers();

    }
    catch (error) {

      console.log("Delete Error:", error);

    }

  };







  const filteredUsers = useMemo(() => {


    return users.filter((user) => {


      const searchMatch =
        user.username
          .toLowerCase()
          .includes(search.toLowerCase());



      const roleMatch =
        role === "All" ||
        user.role === role;



      return searchMatch && roleMatch;


    });


  }, [users, search, role]);







  return (

    <div className="space-y-6">



      {/* Header */}

      <div className="flex justify-between items-center">


        <div>

          <h1 className="text-3xl font-bold">
            Users Management
          </h1>

          <p className="text-gray-500">
            Manage system users
          </p>

        </div>





        <button

          onClick={fetchUsers}

          disabled={loading}

          className="bg-blue-600 disabled:bg-blue-300 text-white px-4 py-2 rounded-lg flex items-center gap-2"

        >

          <FiRefreshCw
            className={loading ? "animate-spin" : ""}
          />

          {loading ? "Refreshing..." : "Refresh"}

        </button>


      </div>








      {/* Search Filter */}


      <div className="bg-white shadow rounded-xl p-4 flex gap-4">


        <div className="flex items-center border rounded-lg px-3 flex-1">


          <FiSearch />


          <input

            className="w-full p-2 outline-none"

            placeholder="Search username..."

            value={search}

            onChange={(e)=>setSearch(e.target.value)}

          />


        </div>





        <select

          className="border rounded-lg px-4"

          value={role}

          onChange={(e)=>setRole(e.target.value)}

        >

          <option value="All">
            All
          </option>

          <option value="Admin">
            Admin
          </option>

          <option value="Manager">
            Manager
          </option>

          <option value="Driver">
            Driver
          </option>


        </select>


      </div>









      {/* Table */}


      <div className="bg-white shadow rounded-xl overflow-hidden">


        <table className="w-full">


          <thead className="bg-gray-100">

            <tr>

              <th className="p-3 text-left">
                Username
              </th>

              <th className="p-3 text-left">
                Phone
              </th>

              <th className="p-3 text-left">
                Email
              </th>

              <th className="p-3 text-left">
                Role
              </th>

              <th className="p-3 text-left">
                Status
              </th>

              <th className="p-3">
                Action
              </th>


            </tr>

          </thead>






          <tbody>


          {
            loading ?

            <tr>

              <td
                colSpan={6}
                className="p-5 text-center"
              >
                Loading...
              </td>


            </tr>


            :


            filteredUsers.length === 0 ?


            <tr>

              <td
                colSpan={6}
                className="p-5 text-center text-gray-500"
              >

                No Users Found

              </td>


            </tr>



            :


            filteredUsers.map((user)=>(


              <tr
                key={user._id}
                className="border-t"
              >


                <td className="p-3">
                  {user.username}
                </td>


                <td className="p-3">
                  {user.phoneNumber}
                </td>


                <td className="p-3">
                  {user.email}
                </td>


                <td className="p-3">
                  {user.role}
                </td>


                <td className="p-3">
                  {user.status}
                </td>


                <td className="p-3">


                  <button

                    onClick={()=>deleteUser(user._id)}

                    className="text-red-600 hover:text-red-800"

                  >

                    <FiTrash2 />

                  </button>


                </td>


              </tr>


            ))


          }


          </tbody>


        </table>


      </div>



    </div>

  );

};



export default Users;