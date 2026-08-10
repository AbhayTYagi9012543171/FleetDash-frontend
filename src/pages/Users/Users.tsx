import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  FiRefreshCw,
  FiTrash2,
  FiSearch,
  FiPlus,
  FiEdit3,
  FiUsers,
  FiShield,
  FiCheckCircle,
  FiXCircle,
  FiX,
  FiMail,
  FiPhone,
  FiUser,
  FiChevronDown,
} from "react-icons/fi";

import toast from "react-hot-toast";

import { api } from "../../services/api";

// ======================================================
// TYPES
// ======================================================

interface User {
  _id: string;
  username: string;
  phoneNumber: string;
  email: string;
  role: string;
  status: string;
}

interface UserForm {
  username: string;
  phoneNumber: string;
  email: string;
  role: string;
  status: string;
}

interface ApiResponse {
  success?: boolean;
  users?: User[];
  message?: string;
}

type StatCardProps = {
  title: string;
  value: number;
  subtitle: string;
  icon: React.ReactNode;
  iconClass: string;
};

// ======================================================
// INITIAL FORM
// ======================================================

const initialForm: UserForm = {
  username: "",
  phoneNumber: "",
  email: "",
  role: "Driver",
  status: "Active",
};

// ======================================================
// COMPONENT
// ======================================================

const Users = () => {
  // ====================================================
  // STATE
  // ====================================================

  const [users, setUsers] = useState<User[]>([]);

  const [loading, setLoading] = useState(false);

  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");

  const [role, setRole] = useState("All");

  const [statusFilter, setStatusFilter] =
    useState("All");

  const [showModal, setShowModal] =
    useState(false);

  const [editId, setEditId] =
    useState<string | null>(null);

  const [form, setForm] =
    useState<UserForm>(initialForm);

  // ====================================================
  // FETCH USERS
  // GET /users
  // ====================================================

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const response =
        await api.get<ApiResponse | User[]>(
          "/users"
        );

      const data = response.data;

      if (
        data &&
        typeof data === "object" &&
        !Array.isArray(data) &&
        data.success
      ) {
        setUsers(
          Array.isArray(data.users)
            ? data.users
            : []
        );

        return;
      }

      if (Array.isArray(data)) {
        setUsers(data);
        return;
      }

      setUsers([]);
    } catch (error) {
      console.error(
        "Fetch Users Error:",
        error
      );

      setUsers([]);

      toast.error(
        "Failed to load users"
      );
    } finally {
      setLoading(false);
    }
  };

  // ====================================================
  // INITIAL LOAD
  // ====================================================

  useEffect(() => {
    fetchUsers();
  }, []);

  // ====================================================
  // FILTER USERS
  // ====================================================

  const filteredUsers = useMemo(() => {
    const searchValue =
      search.toLowerCase().trim();

    return users.filter((user) => {
      const username =
        String(
          user.username ?? ""
        ).toLowerCase();

      const email =
        String(
          user.email ?? ""
        ).toLowerCase();

      const phone =
        String(
          user.phoneNumber ?? ""
        ).toLowerCase();

      const userRole =
        String(
          user.role ?? ""
        );

      const userStatus =
        String(
          user.status ?? ""
        );

      const searchMatch =
        !searchValue ||
        username.includes(searchValue) ||
        email.includes(searchValue) ||
        phone.includes(searchValue);

      const roleMatch =
        role === "All" ||
        userRole.toLowerCase() ===
          role.toLowerCase();

      const statusMatch =
        statusFilter === "All" ||
        userStatus.toLowerCase() ===
          statusFilter.toLowerCase();

      return (
        searchMatch &&
        roleMatch &&
        statusMatch
      );
    });
  }, [
    users,
    search,
    role,
    statusFilter,
  ]);

  // ====================================================
  // STATISTICS
  // ====================================================

  const statistics = useMemo(() => {
    const total = users.length;

    const admins =
      users.filter(
        (user) =>
          user.role?.toLowerCase() ===
          "admin"
      ).length;

    const active =
      users.filter(
        (user) =>
          user.status?.toLowerCase() ===
          "active"
      ).length;

    const inactive =
      users.filter(
        (user) =>
          user.status?.toLowerCase() !==
          "active"
      ).length;

    return {
      total,
      admins,
      active,
      inactive,
    };
  }, [users]);

  // ====================================================
  // OPEN ADD MODAL
  // ====================================================

  const openAddModal = () => {
    setEditId(null);
    setForm({
      ...initialForm,
    });
    setShowModal(true);
  };

  // ====================================================
  // OPEN EDIT MODAL
  // ====================================================

  const editUser = (user: User) => {
    setEditId(user._id);

    setForm({
      username: user.username || "",
      phoneNumber:
        user.phoneNumber || "",
      email: user.email || "",
      role: user.role || "Driver",
      status: user.status || "Active",
    });

    setShowModal(true);
  };

  // ====================================================
  // CLOSE MODAL
  // ====================================================

  const closeModal = () => {
    if (saving) {
      return;
    }

    setShowModal(false);
    setEditId(null);

    setForm({
      ...initialForm,
    });
  };

  // ====================================================
  // HANDLE INPUT
  // ====================================================

  const handleInputChange = (
    field: keyof UserForm,
    value: string
  ) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  // ====================================================
  // VALIDATE FORM
  // ====================================================

  const validateForm = () => {
    if (!form.username.trim()) {
      toast.error(
        "Username is required"
      );
      return false;
    }

    if (!form.email.trim()) {
      toast.error(
        "Email address is required"
      );
      return false;
    }

    if (!form.phoneNumber.trim()) {
      toast.error(
        "Phone number is required"
      );
      return false;
    }

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (
      !emailRegex.test(
        form.email.trim()
      )
    ) {
      toast.error(
        "Please enter a valid email address"
      );
      return false;
    }

    return true;
  };

  // ====================================================
  // SAVE USER
  // POST /users
  // PUT /users/:id
  // ====================================================

  const saveUser = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);

      const payload: UserForm = {
        username:
          form.username.trim(),

        phoneNumber:
          form.phoneNumber.trim(),

        email:
          form.email.trim(),

        role:
          form.role,

        status:
          form.status,
      };

      if (editId) {
        await api.put(
          `/users/${editId}`,
          payload
        );

        toast.success(
          "User updated successfully"
        );
      } else {
        await api.post(
          "/users",
          payload
        );

        toast.success(
          "User created successfully"
        );
      }

      setShowModal(false);
      setEditId(null);

      setForm({
        ...initialForm,
      });

      await fetchUsers();
    } catch (error: any) {
      console.error(
        "Save User Error:",
        error
      );

      const message =
        error?.response?.data?.message;

      toast.error(
        message ||
          "Unable to save user"
      );
    } finally {
      setSaving(false);
    }
  };

  // ====================================================
  // DELETE USER
  // DELETE /users/:id
  // ====================================================

  const deleteUser = async (
    id: string
  ) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this user?"
      );

    if (!confirmed) {
      return;
    }

    try {
      setLoading(true);

      await api.delete(
        `/users/${id}`
      );

      toast.success(
        "User deleted successfully"
      );

      await fetchUsers();
    } catch (error: any) {
      console.error(
        "Delete User Error:",
        error
      );

      const message =
        error?.response?.data?.message;

      toast.error(
        message ||
          "Unable to delete user"
      );
    } finally {
      setLoading(false);
    }
  };

  // ====================================================
  // STATUS STYLE
  // ====================================================

  const getStatusStyle = (
    status?: string
  ) => {
    switch (
      status?.toLowerCase()
    ) {
      case "active":
        return {
          badge:
            "border-emerald-200 bg-emerald-50 text-emerald-700",

          dot:
            "bg-emerald-500",
        };

      case "inactive":
        return {
          badge:
            "border-red-200 bg-red-50 text-red-700",

          dot:
            "bg-red-500",
        };

      default:
        return {
          badge:
            "border-slate-200 bg-slate-50 text-slate-600",

          dot:
            "bg-slate-400",
        };
    }
  };

  // ====================================================
  // ROLE STYLE
  // ====================================================

  const getRoleStyle = (
    userRole?: string
  ) => {
    switch (
      userRole?.toLowerCase()
    ) {
      case "admin":
        return "bg-violet-50 text-violet-700 border-violet-200";

      case "manager":
        return "bg-blue-50 text-blue-700 border-blue-200";

      case "driver":
        return "bg-cyan-50 text-cyan-700 border-cyan-200";

      default:
        return "bg-slate-50 text-slate-600 border-slate-200";
    }
  };

  // ====================================================
  // STAT CARD
  // ====================================================

  const StatCard = ({
    title,
    value,
    subtitle,
    icon,
    iconClass,
  }: StatCardProps) => (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg">

      <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-slate-50 transition-transform duration-500 group-hover:scale-150" />

      <div className="relative flex items-start justify-between">

        <div>
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            {loading
              ? "—"
              : value}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            {subtitle}
          </p>
        </div>

        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${iconClass}`}
        >
          {icon}
        </div>

      </div>
    </div>
  );

  // ====================================================
  // LOADING SCREEN
  // ====================================================

  if (
    loading &&
    users.length === 0
  ) {
    return (
      <div className="min-h-screen bg-slate-50">

        <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">

          <div className="animate-pulse rounded-3xl border border-slate-200 bg-white p-6">

            <div className="h-8 w-64 rounded-lg bg-slate-100" />

            <div className="mt-3 h-4 w-96 max-w-full rounded-lg bg-slate-100" />

          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

            {Array.from({
              length: 4,
            }).map((_, index) => (
              <div
                key={index}
                className="h-32 animate-pulse rounded-2xl bg-white"
              />
            ))}

          </div>

          <div className="overflow-hidden rounded-2xl bg-white">

            {Array.from({
              length: 6,
            }).map((_, index) => (
              <div
                key={index}
                className="m-4 h-16 animate-pulse rounded-xl bg-slate-100"
              />
            ))}

          </div>

        </div>

      </div>
    );
  }

  // ====================================================
  // MAIN UI
  // ====================================================

  return (
    <div className="min-h-screen bg-slate-50">

      <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">

        {/* ==================================================
            HEADER
        ================================================== */}

        <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

          <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-blue-50 blur-3xl" />

          <div className="relative flex flex-col gap-6 p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between">

            <div className="flex items-start gap-4">

              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-200">
                <FiUsers size={25} />
              </div>

              <div>

                <div className="flex flex-wrap items-center gap-3">

                  <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                    Users Management
                  </h1>

                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">

                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />

                    System Active

                  </span>

                </div>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                  Manage FleetDash users,
                  roles, permissions and
                  account status from one
                  centralized workspace.
                </p>

              </div>

            </div>

            <div className="flex flex-col gap-3 sm:flex-row">

              <button
                type="button"
                onClick={fetchUsers}
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >

                <FiRefreshCw
                  className={
                    loading
                      ? "animate-spin"
                      : ""
                  }
                />

                Refresh

              </button>

              <button
                type="button"
                onClick={openAddModal}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-200 transition hover:-translate-y-0.5 hover:shadow-lg"
              >

                <FiPlus size={17} />

                Add User

              </button>

            </div>

          </div>

        </section>

        {/* ==================================================
            STATISTICS
        ================================================== */}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

          <StatCard
            title="Total Users"
            value={statistics.total}
            subtitle="Registered accounts"
            icon={
              <FiUsers size={22} />
            }
            iconClass="bg-blue-50 text-blue-600"
          />

          <StatCard
            title="Administrators"
            value={statistics.admins}
            subtitle="Users with admin access"
            icon={
              <FiShield size={22} />
            }
            iconClass="bg-violet-50 text-violet-600"
          />

          <StatCard
            title="Active Users"
            value={statistics.active}
            subtitle="Currently active"
            icon={
              <FiCheckCircle size={22} />
            }
            iconClass="bg-emerald-50 text-emerald-600"
          />

          <StatCard
            title="Inactive Users"
            value={statistics.inactive}
            subtitle="Requires attention"
            icon={
              <FiXCircle size={22} />
            }
            iconClass="bg-rose-50 text-rose-600"
          />

        </div>

        {/* ==================================================
            FILTER PANEL
        ================================================== */}

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">

            <div>

              <h2 className="text-lg font-bold text-slate-900">
                User Directory
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Search and filter registered
                FleetDash users.
              </p>

            </div>

            <div className="flex flex-col gap-3 md:flex-row">

              {/* SEARCH */}

              <div className="relative min-w-0 md:w-80">

                <FiSearch
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(event) =>
                    setSearch(
                      event.target.value
                    )
                  }
                  placeholder="Search name, email or phone..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50"
                />

              </div>

              {/* ROLE */}

              <div className="relative">

                <select
                  value={role}
                  onChange={(event) =>
                    setRole(
                      event.target.value
                    )
                  }
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-4 pr-10 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50 md:w-36"
                >

                  <option value="All">
                    All Roles
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

                <FiChevronDown
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

              </div>

              {/* STATUS */}

              <div className="relative">

                <select
                  value={statusFilter}
                  onChange={(event) =>
                    setStatusFilter(
                      event.target.value
                    )
                  }
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-4 pr-10 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50 md:w-36"
                >

                  <option value="All">
                    All Status
                  </option>

                  <option value="Active">
                    Active
                  </option>

                  <option value="Inactive">
                    Inactive
                  </option>

                </select>

                <FiChevronDown
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

              </div>

            </div>

          </div>

          {/* RESULT SUMMARY */}

          <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4 text-xs text-slate-500">

            <span>
              Showing
            </span>

            <span className="rounded-md bg-blue-50 px-2 py-1 font-bold text-blue-700">
              {filteredUsers.length}
            </span>

            <span>
              of {users.length} users
            </span>

            {(search ||
              role !== "All" ||
              statusFilter !== "All") && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setRole("All");
                  setStatusFilter(
                    "All"
                  );
                }}
                className="ml-2 inline-flex items-center gap-1 rounded-lg px-2 py-1 font-semibold text-blue-600 transition hover:bg-blue-50"
              >
                <FiX />
                Clear filters
              </button>
            )}

          </div>

        </section>

        {/* ==================================================
            USERS TABLE
        ================================================== */}

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          {/* TABLE HEADER */}

          <div className="flex flex-col gap-3 border-b border-slate-200 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">

            <div>

              <h2 className="text-lg font-bold text-slate-900">
                All Users
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Manage accounts and access
                permissions.
              </p>

            </div>

            <div className="inline-flex w-fit items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">

              <FiUsers />

              {filteredUsers.length} Results

            </div>

          </div>

          {/* EMPTY STATE */}

          {!loading &&
            filteredUsers.length ===
              0 && (
              <div className="flex min-h-[350px] flex-col items-center justify-center px-6 text-center">

                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                  <FiUsers size={32} />
                </div>

                <h3 className="mt-5 text-lg font-bold text-slate-800">
                  No users found
                </h3>

                <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
                  Try changing your search
                  or filters to find the
                  user you're looking for.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setRole("All");
                    setStatusFilter(
                      "All"
                    );
                  }}
                  className="mt-5 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  Clear Filters
                </button>

              </div>
            )}

          {/* TABLE */}

          {filteredUsers.length >
            0 && (
            <div className="overflow-x-auto">

              <table className="min-w-[900px] w-full">

                <thead>

                  <tr className="border-b border-slate-100 bg-slate-50/80">

                    <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      User
                    </th>

                    <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Contact
                    </th>

                    <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Role
                    </th>

                    <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Status
                    </th>

                    <th className="px-6 py-4 text-right text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Actions
                    </th>

                  </tr>

                </thead>

                <tbody className="divide-y divide-slate-100">

                  {filteredUsers.map(
                    (user) => {
                      const statusStyle =
                        getStatusStyle(
                          user.status
                        );

                      return (
                        <tr
                          key={
                            user._id
                          }
                          className="group transition hover:bg-slate-50/80"
                        >

                          {/* USER */}

                          <td className="px-6 py-5">

                            <div className="flex items-center gap-3">

                              <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-sm font-bold text-white shadow-sm">

                                {user.username
                                  ?.charAt(
                                    0
                                  )
                                  ?.toUpperCase() ||
                                  "U"}

                                <span
                                  className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white ${statusStyle.dot}`}
                                />

                              </div>

                              <div className="min-w-0">

                                <p className="truncate font-semibold text-slate-800">
                                  {user.username ||
                                    "Unknown User"}
                                </p>

                                <p className="mt-0.5 text-xs text-slate-400">
                                  ID:{" "}
                                  {user._id
                                    ?.slice(
                                      -8
                                    ) ||
                                    "N/A"}
                                </p>

                              </div>

                            </div>

                          </td>

                          {/* CONTACT */}

                          <td className="px-6 py-5">

                            <div className="space-y-1.5">

                              <div className="flex items-center gap-2 text-sm text-slate-600">

                                <FiMail
                                  size={14}
                                  className="shrink-0 text-slate-400"
                                />

                                <span className="truncate">
                                  {user.email ||
                                    "No email"}
                                </span>

                              </div>

                              <div className="flex items-center gap-2 text-xs text-slate-400">

                                <FiPhone
                                  size={13}
                                  className="shrink-0"
                                />

                                {user.phoneNumber ||
                                  "No phone"}

                              </div>

                            </div>

                          </td>

                          {/* ROLE */}

                          <td className="px-6 py-5">

                            <span
                              className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold ${getRoleStyle(
                                user.role
                              )}`}
                            >

                              <FiShield
                                size={13}
                              />

                              {user.role ||
                                "User"}

                            </span>

                          </td>

                          {/* STATUS */}

                          <td className="px-6 py-5">

                            <span
                              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold ${statusStyle.badge}`}
                            >

                              <span
                                className={`h-1.5 w-1.5 rounded-full ${statusStyle.dot}`}
                              />

                              {user.status ||
                                "Unknown"}

                            </span>

                          </td>

                          {/* ACTIONS */}

                          <td className="px-6 py-5">

                            <div className="flex items-center justify-end gap-2">

                              <button
                                type="button"
                                onClick={() =>
                                  editUser(
                                    user
                                  )
                                }
                                title="Edit user"
                                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                              >

                                <FiEdit3
                                  size={16}
                                />

                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  deleteUser(
                                    user._id
                                  )
                                }
                                title="Delete user"
                                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                              >

                                <FiTrash2
                                  size={16}
                                />

                              </button>

                            </div>

                          </td>

                        </tr>
                      );
                    }
                  )}

                </tbody>

              </table>

            </div>
          )}

        </section>

        {/* ==================================================
            FOOTER
        ================================================== */}

        <div className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-white px-5 py-4 text-xs text-slate-500 shadow-sm sm:flex-row sm:items-center sm:justify-between">

          <span>
            FleetDash user management
            console
          </span>

          <span className="flex items-center gap-2">

            <span className="h-2 w-2 rounded-full bg-emerald-500" />

            {statistics.active} active users

          </span>

        </div>

      </div>

      {/* ==================================================
          ADD / EDIT MODAL
      ================================================== */}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">

          {/* BACKDROP */}

          <div
            className="absolute inset-0"
            onClick={closeModal}
          />

          {/* MODAL */}

          <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-white/50 bg-white shadow-2xl">

            {/* MODAL HEADER */}

            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white/95 px-6 py-5 backdrop-blur">

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">

                  {editId ? (
                    <FiEdit3
                      size={20}
                    />
                  ) : (
                    <FiUser
                      size={20}
                    />
                  )}

                </div>

                <div>

                  <h2 className="text-lg font-bold text-slate-900">

                    {editId
                      ? "Edit User"
                      : "Add New User"}

                  </h2>

                  <p className="text-xs text-slate-500">

                    {editId
                      ? "Update account information"
                      : "Create a new FleetDash account"}

                  </p>

                </div>

              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={saving}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <FiX />
              </button>

            </div>

            {/* MODAL BODY */}

            <div className="space-y-5 p-6">

              {/* USERNAME */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Username
                </label>

                <div className="relative">

                  <FiUser
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    size={17}
                  />

                  <input
                    type="text"
                    value={
                      form.username
                    }
                    onChange={(event) =>
                      handleInputChange(
                        "username",
                        event.target
                          .value
                      )
                    }
                    placeholder="Enter username"
                    disabled={saving}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50 disabled:cursor-not-allowed disabled:opacity-60"
                  />

                </div>

              </div>

              {/* EMAIL */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Email Address
                </label>

                <div className="relative">

                  <FiMail
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    size={17}
                  />

                  <input
                    type="email"
                    value={
                      form.email
                    }
                    onChange={(event) =>
                      handleInputChange(
                        "email",
                        event.target
                          .value
                      )
                    }
                    placeholder="user@example.com"
                    disabled={saving}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50 disabled:cursor-not-allowed disabled:opacity-60"
                  />

                </div>

              </div>

              {/* PHONE */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Phone Number
                </label>

                <div className="relative">

                  <FiPhone
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    size={17}
                  />

                  <input
                    type="tel"
                    value={
                      form.phoneNumber
                    }
                    onChange={(event) =>
                      handleInputChange(
                        "phoneNumber",
                        event.target
                          .value
                      )
                    }
                    placeholder="Enter phone number"
                    disabled={saving}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50 disabled:cursor-not-allowed disabled:opacity-60"
                  />

                </div>

              </div>

              {/* ROLE + STATUS */}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                {/* ROLE */}

                <div>

                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Role
                  </label>

                  <div className="relative">

                    <select
                      value={
                        form.role
                      }
                      onChange={(event) =>
                        handleInputChange(
                          "role",
                          event.target
                            .value
                        )
                      }
                      disabled={saving}
                      className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pr-10 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >

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

                    <FiChevronDown
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                  </div>

                </div>

                {/* STATUS */}

                <div>

                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Status
                  </label>

                  <div className="relative">

                    <select
                      value={
                        form.status
                      }
                      onChange={(event) =>
                        handleInputChange(
                          "status",
                          event.target
                            .value
                        )
                      }
                      disabled={saving}
                      className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pr-10 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >

                      <option value="Active">
                        Active
                      </option>

                      <option value="Inactive">
                        Inactive
                      </option>

                    </select>

                    <FiChevronDown
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                  </div>

                </div>

              </div>

            </div>

            {/* MODAL FOOTER */}

            <div className="flex flex-col-reverse gap-3 border-t border-slate-100 bg-slate-50/70 p-6 sm:flex-row sm:justify-end">

              <button
                type="button"
                onClick={closeModal}
                disabled={saving}
                className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={saveUser}
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-200 transition hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
              >

                {saving ? (
                  <>
                    <FiRefreshCw className="animate-spin" />

                    Saving...
                  </>
                ) : (
                  <>
                    <FiCheckCircle />

                    {editId
                      ? "Update User"
                      : "Create User"}
                  </>
                )}

              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default Users;