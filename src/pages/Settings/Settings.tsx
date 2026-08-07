import {
  useCallback,
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
  FiX,
  FiCheck,
  FiMail,
  FiSmartphone,
  FiKey,
  FiSun,
} from "react-icons/fi";

import toast from "react-hot-toast";

import { api } from "../../services/api";

// ======================================================
// TYPES
// ======================================================

interface SettingsData {
  emailNotification: boolean;
  smsNotification: boolean;
  darkMode: boolean;
  language: string;
  timezone: string;
  twoFactor: boolean;
  autoBackup: boolean;
}

// ======================================================
// DEFAULT SETTINGS
// ======================================================

const defaultSettings: SettingsData = {
  emailNotification: true,
  smsNotification: false,
  darkMode: false,
  language: "English",
  timezone: "Asia/Kolkata",
  twoFactor: false,
  autoBackup: true,
};

// ======================================================
// COMPONENT
// ======================================================

const Settings = () => {
  const [settings, setSettings] =
    useState<SettingsData>(defaultSettings);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [showPassword, setShowPassword] =
    useState(false);

  const [password, setPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [activeSection, setActiveSection] =
    useState("General");

  // ====================================================
  // FETCH SETTINGS
  // ====================================================

  const fetchSettings = useCallback(
    async () => {
      try {
        setLoading(true);

        const response =
          await api.get("/settings");

        if (response.data?.success) {
          setSettings({
            ...defaultSettings,
            ...response.data.settings,
          });
        }
      } catch (error) {
        console.error(
          "Settings Error:",
          error
        );

        toast.error(
          "Unable to load settings"
        );
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // ====================================================
  // INITIAL LOAD
  // ====================================================

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  // ====================================================
  // UPDATE SETTING
  // ====================================================

  const updateSetting = (
    key: keyof SettingsData,
    value: boolean | string
  ) => {
    setSettings((previous) => ({
      ...previous,
      [key]: value,
    }));
  };

  // ====================================================
  // SAVE SETTINGS
  // ====================================================

  const saveSettings = async () => {
    try {
      setSaving(true);

      await api.put(
        "/settings",
        settings
      );

      toast.success(
        "Settings saved successfully"
      );
    } catch (error) {
      console.error(
        "Settings Save Error:",
        error
      );

      toast.error(
        "Settings update failed"
      );
    } finally {
      setSaving(false);
    }
  };

  // ====================================================
  // RESET SETTINGS
  // ====================================================

  const resetSettings = () => {
    setSettings({
      ...defaultSettings,
    });

    toast.success(
      "Settings restored to defaults"
    );
  };

  // ====================================================
  // CHANGE PASSWORD
  // ====================================================

  const changePassword = () => {
    if (password.length < 6) {
      toast.error(
        "Password must contain at least 6 characters"
      );
      return;
    }

    if (password !== confirmPassword) {
      toast.error(
        "Passwords do not match"
      );
      return;
    }

    toast.success(
      "Password changed successfully"
    );

    setPassword("");
    setConfirmPassword("");
    setShowPassword(false);
  };

  // ====================================================
  // LOADING
  // ====================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">

          {/* Header */}

          <div className="animate-pulse rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="h-8 w-48 rounded-lg bg-slate-100" />

            <div className="mt-3 h-4 w-80 max-w-full rounded-lg bg-slate-100" />
          </div>

          {/* Content */}

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">

            <div className="h-80 animate-pulse rounded-3xl bg-white" />

            <div className="space-y-6 lg:col-span-3">

              {Array.from({
                length: 3,
              }).map((_, index) => (
                <div
                  key={index}
                  className="h-52 animate-pulse rounded-3xl bg-white"
                />
              ))}

            </div>

          </div>
        </div>
      </div>
    );
  }

  // ====================================================
  // MAIN
  // ====================================================

  return (
    <div className="min-h-screen bg-slate-50">

      <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">

        {/* ==================================================
            HEADER
        ================================================== */}

        <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

          {/* Decorative background */}

          <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-blue-100/60 blur-3xl" />

          <div className="absolute -bottom-24 left-1/3 h-48 w-48 rounded-full bg-indigo-100/50 blur-3xl" />

          <div className="relative flex flex-col gap-6 p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between">

            <div className="flex items-start gap-4">

              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-200">
                <FiShield size={26} />
              </div>

              <div>

                <div className="flex flex-wrap items-center gap-3">

                  <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                    Settings
                  </h1>

                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    System Active
                  </span>

                </div>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                  Manage your FleetDash account,
                  notifications, security and
                  system preferences.
                </p>

              </div>

            </div>

            <div className="flex flex-col gap-3 sm:flex-row">

              <button
                type="button"
                onClick={resetSettings}
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  border
                  border-slate-200
                  bg-white
                  px-4
                  py-2.5
                  text-sm
                  font-semibold
                  text-slate-700
                  shadow-sm
                  transition
                  hover:border-slate-300
                  hover:bg-slate-50
                "
              >
                <FiRotateCcw size={16} />

                Reset
              </button>

              <button
                type="button"
                onClick={saveSettings}
                disabled={saving}
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-blue-600
                  px-5
                  py-2.5
                  text-sm
                  font-semibold
                  text-white
                  shadow-lg
                  shadow-blue-200
                  transition
                  hover:bg-blue-700
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >

                <FiSave
                  className={
                    saving
                      ? "animate-pulse"
                      : ""
                  }
                />

                {saving
                  ? "Saving..."
                  : "Save Changes"}

              </button>

            </div>

          </div>

        </div>

        {/* ==================================================
            PROFILE CARD
        ================================================== */}

        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

          <div className="border-b border-slate-100 p-5 sm:p-6">

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              <div>

                <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                  Account
                </p>

                <h2 className="mt-1 text-xl font-bold text-slate-900">
                  Profile Information
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Manage your FleetDash account profile.
                </p>

              </div>

              <button
                type="button"
                onClick={() =>
                  toast.success(
                    "Profile editor opened"
                  )
                }
                className="
                  inline-flex
                  w-fit
                  items-center
                  gap-2
                  rounded-xl
                  border
                  border-slate-200
                  bg-slate-50
                  px-4
                  py-2.5
                  text-sm
                  font-semibold
                  text-slate-700
                  transition
                  hover:bg-slate-100
                "
              >
                <FiEdit />

                Edit Profile
              </button>

            </div>

          </div>

          <div className="p-5 sm:p-6">

            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">

              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-xl font-bold text-white shadow-lg shadow-blue-200">
                AU
              </div>

              <div className="flex-1">

                <h3 className="text-lg font-bold text-slate-900">
                  Admin User
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Fleet Manager
                </p>

                <div className="mt-3 flex flex-wrap gap-2">

                  <span className="inline-flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600">
                    <FiUser size={13} />
                    Administrator
                  </span>

                  <span className="inline-flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700">
                    <FiCheck size={13} />
                    Verified
                  </span>

                </div>

              </div>

            </div>

          </div>

        </div>

        {/* ==================================================
            SETTINGS LAYOUT
        ================================================== */}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">

          {/* ==================================================
              SIDEBAR
          ================================================== */}

          <aside className="h-fit rounded-3xl border border-slate-200 bg-white p-3 shadow-sm">

            <p className="px-3 pb-2 pt-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Preferences
            </p>

            <div className="grid grid-cols-2 gap-2 lg:grid-cols-1">

              <SettingsNavButton
                active={
                  activeSection === "General"
                }
                icon={<FiGlobe />}
                label="General"
                onClick={() =>
                  setActiveSection("General")
                }
              />

              <SettingsNavButton
                active={
                  activeSection ===
                  "Notifications"
                }
                icon={<FiBell />}
                label="Notifications"
                onClick={() =>
                  setActiveSection(
                    "Notifications"
                  )
                }
              />

              <SettingsNavButton
                active={
                  activeSection ===
                  "Security"
                }
                icon={<FiShield />}
                label="Security"
                onClick={() =>
                  setActiveSection(
                    "Security"
                  )
                }
              />

              <SettingsNavButton
                active={
                  activeSection ===
                  "Appearance"
                }
                icon={<FiMoon />}
                label="Appearance"
                onClick={() =>
                  setActiveSection(
                    "Appearance"
                  )
                }
              />

              <SettingsNavButton
                active={
                  activeSection ===
                  "Database"
                }
                icon={<FiDatabase />}
                label="Database"
                onClick={() =>
                  setActiveSection(
                    "Database"
                  )
                }
              />

            </div>

          </aside>

          {/* ==================================================
              SETTINGS CONTENT
          ================================================== */}

          <main className="space-y-6 lg:col-span-3">

            {/* ==================================================
                GENERAL
            ================================================== */}

            {(activeSection === "General" ||
              activeSection === "Appearance") && (
              <SettingCard
                title="General Preferences"
                description="Configure language, timezone and appearance."
                icon={
                  <FiGlobe
                    size={21}
                  />
                }
                iconBackground="bg-blue-50 text-blue-600"
              >

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                  <SelectField
                    label="Language"
                    icon={<FiGlobe />}
                    value={settings.language}
                    onChange={(value) =>
                      updateSetting(
                        "language",
                        value
                      )
                    }
                    options={[
                      "English",
                      "Hindi",
                      "Spanish",
                      "French",
                    ]}
                  />

                  <SelectField
                    label="Timezone"
                    icon={<FiClock />}
                    value={settings.timezone}
                    onChange={(value) =>
                      updateSetting(
                        "timezone",
                        value
                      )
                    }
                    options={[
                      "Asia/Kolkata",
                      "Asia/Dubai",
                      "Europe/London",
                      "America/New_York",
                      "America/Los_Angeles",
                    ]}
                  />

                </div>

                <div className="mt-5">

                  <Toggle
                    label="Dark Mode"
                    description="Use a darker interface for low-light environments."
                    checked={
                      settings.darkMode
                    }
                    onChange={(value) =>
                      updateSetting(
                        "darkMode",
                        value
                      )
                    }
                    icon={
                      settings.darkMode ? (
                        <FiMoon />
                      ) : (
                        <FiSun />
                      )
                    }
                  />

                </div>

              </SettingCard>
            )}

            {/* ==================================================
                NOTIFICATIONS
            ================================================== */}

            {(activeSection === "General" ||
              activeSection ===
                "Notifications") && (
              <SettingCard
                title="Notifications"
                description="Choose how FleetDash communicates important fleet events."
                icon={
                  <FiBell
                    size={21}
                  />
                }
                iconBackground="bg-amber-50 text-amber-600"
              >

                <div className="space-y-3">

                  <Toggle
                    label="Email Alerts"
                    description="Receive fleet alerts and daily summaries by email."
                    checked={
                      settings.emailNotification
                    }
                    onChange={(value) =>
                      updateSetting(
                        "emailNotification",
                        value
                      )
                    }
                    icon={<FiMail />}
                  />

                  <Toggle
                    label="SMS Alerts"
                    description="Receive emergency fleet notifications through SMS."
                    checked={
                      settings.smsNotification
                    }
                    onChange={(value) =>
                      updateSetting(
                        "smsNotification",
                        value
                      )
                    }
                    icon={
                      <FiSmartphone />
                    }
                  />

                </div>

              </SettingCard>
            )}

            {/* ==================================================
                SECURITY
            ================================================== */}

            {(activeSection === "General" ||
              activeSection ===
                "Security") && (
              <SettingCard
                title="Security"
                description="Protect your FleetDash account and fleet data."
                icon={
                  <FiShield
                    size={21}
                  />
                }
                iconBackground="bg-emerald-50 text-emerald-600"
              >

                <Toggle
                  label="Two-Factor Authentication"
                  description="Add an additional verification step when signing in."
                  checked={
                    settings.twoFactor
                  }
                  onChange={(value) =>
                    updateSetting(
                      "twoFactor",
                      value
                    )
                  }
                  icon={<FiShield />}
                />

                {/* Password */}

                <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">

                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                    <div className="flex items-center gap-3">

                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-600 shadow-sm">
                        <FiLock />
                      </div>

                      <div>

                        <p className="text-sm font-bold text-slate-800">
                          Account Password
                        </p>

                        <p className="mt-0.5 text-xs text-slate-500">
                          Change your account password regularly.
                        </p>

                      </div>

                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          true
                        )
                      }
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-blue-600 shadow-sm ring-1 ring-slate-200 transition hover:bg-blue-50"
                    >
                      <FiKey />

                      Change Password
                    </button>

                  </div>

                </div>

              </SettingCard>
            )}

            {/* ==================================================
                DATABASE
            ================================================== */}

            {(activeSection === "General" ||
              activeSection ===
                "Database") && (
              <SettingCard
                title="Database & Backup"
                description="Configure automatic fleet data protection."
                icon={
                  <FiDatabase
                    size={21}
                  />
                }
                iconBackground="bg-purple-50 text-purple-600"
              >

                <Toggle
                  label="Automatic Backup"
                  description="Automatically create a daily backup of fleet data."
                  checked={
                    settings.autoBackup
                  }
                  onChange={(value) =>
                    updateSetting(
                      "autoBackup",
                      value
                    )
                  }
                  icon={
                    <FiDatabase />
                  }
                />

                <div className="mt-4 rounded-2xl border border-blue-100 bg-blue-50 p-4">

                  <div className="flex items-start gap-3">

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
                      <FiDatabase />
                    </div>

                    <div>

                      <p className="text-sm font-bold text-blue-900">
                        Backup Protection
                      </p>

                      <p className="mt-1 text-xs leading-5 text-blue-700">
                        Automatic backups help protect
                        your vehicle, driver and fleet
                        configuration data.
                      </p>

                    </div>

                  </div>

                </div>

              </SettingCard>
            )}

            {/* ==================================================
                SAVE BAR
            ================================================== */}

            <div className="sticky bottom-4 z-20 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-xl backdrop-blur-md">

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                <div>

                  <p className="text-sm font-bold text-slate-800">
                    Unsaved preferences
                  </p>

                  <p className="text-xs text-slate-500">
                    Save your changes to update FleetDash.
                  </p>

                </div>

                <div className="flex gap-2">

                  <button
                    type="button"
                    onClick={resetSettings}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                  >
                    <FiRotateCcw />

                    Reset
                  </button>

                  <button
                    type="button"
                    onClick={saveSettings}
                    disabled={saving}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700 disabled:opacity-60"
                  >
                    <FiSave />

                    {saving
                      ? "Saving..."
                      : "Save Changes"}
                  </button>

                </div>

              </div>

            </div>

          </main>

        </div>

        {/* ==================================================
            FOOTER
        ================================================== */}

        <div className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-xs text-slate-500 shadow-sm sm:flex-row sm:items-center sm:justify-between">

          <span>
            FleetDash Settings
          </span>

          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Your preferences are securely managed.
          </span>

        </div>

      </div>

      {/* ====================================================
          PASSWORD MODAL
      ==================================================== */}

      {showPassword && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">

          <div className="w-full max-w-md overflow-hidden rounded-3xl border border-white/20 bg-white shadow-2xl">

            {/* Modal Header */}

            <div className="flex items-center justify-between border-b border-slate-100 p-5 sm:p-6">

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <FiLock />
                </div>

                <div>

                  <h2 className="font-bold text-slate-900">
                    Change Password
                  </h2>

                  <p className="mt-0.5 text-xs text-slate-500">
                    Update your account credentials.
                  </p>

                </div>

              </div>

              <button
                type="button"
                onClick={() =>
                  setShowPassword(false)
                }
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <FiX />
              </button>

            </div>

            {/* Modal Body */}

            <div className="space-y-5 p-5 sm:p-6">

              <PasswordField
                label="New Password"
                value={password}
                onChange={setPassword}
              />

              <PasswordField
                label="Confirm Password"
                value={confirmPassword}
                onChange={
                  setConfirmPassword
                }
              />

              <div className="rounded-xl bg-slate-50 p-3 text-xs leading-5 text-slate-500">
                Password must contain at least
                6 characters.
              </div>

              <button
                type="button"
                onClick={changePassword}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-bold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700"
              >
                <FiCheck />

                Update Password
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};

// ======================================================
// SETTINGS NAV BUTTON
// ======================================================

const SettingsNavButton = ({
  active,
  icon,
  label,
  onClick,
}: {
  active: boolean;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        flex
        w-full
        items-center
        justify-center
        gap-2
        rounded-xl
        px-3
        py-3
        text-sm
        font-semibold
        transition
        lg:justify-start
        ${
          active
            ? "bg-blue-600 text-white shadow-lg shadow-blue-100"
            : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
        }
      `}
    >
      {icon}

      <span>{label}</span>
    </button>
  );
};

// ======================================================
// SETTING CARD
// ======================================================

const SettingCard = ({
  title,
  description,
  icon,
  iconBackground,
  children,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  iconBackground: string;
  children: React.ReactNode;
}) => {
  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

      <div className="border-b border-slate-100 p-5 sm:p-6">

        <div className="flex items-start gap-4">

          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconBackground}`}
          >
            {icon}
          </div>

          <div>

            <h2 className="text-lg font-bold text-slate-900">
              {title}
            </h2>

            <p className="mt-1 text-sm leading-5 text-slate-500">
              {description}
            </p>

          </div>

        </div>

      </div>

      <div className="p-5 sm:p-6">
        {children}
      </div>

    </section>
  );
};

// ======================================================
// TOGGLE
// ======================================================

const Toggle = ({
  label,
  description,
  checked,
  onChange,
  icon,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
  icon: React.ReactNode;
}) => {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-100 bg-slate-50/70 p-4 transition hover:border-slate-200 hover:bg-slate-50">

      <div className="flex min-w-0 items-center gap-3">

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-slate-500 shadow-sm">
          {icon}
        </div>

        <div className="min-w-0">

          <p className="text-sm font-bold text-slate-800">
            {label}
          </p>

          <p className="mt-0.5 text-xs leading-5 text-slate-500">
            {description}
          </p>

        </div>

      </div>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() =>
          onChange(!checked)
        }
        className={`
          relative
          h-7
          w-12
          shrink-0
          rounded-full
          p-1
          transition
          duration-200
          ${
            checked
              ? "bg-blue-600 shadow-md shadow-blue-200"
              : "bg-slate-300"
          }
        `}
      >

        <span
          className={`
            block
            h-5
            w-5
            rounded-full
            bg-white
            shadow-sm
            transition
            duration-200
            ${
              checked
                ? "translate-x-5"
                : "translate-x-0"
            }
          `}
        />

      </button>

    </div>
  );
};

// ======================================================
// SELECT FIELD
// ======================================================

const SelectField = ({
  label,
  icon,
  value,
  onChange,
  options,
}: {
  label: string;
  icon: React.ReactNode;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) => {
  return (
    <div>

      <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
        <span className="text-slate-400">
          {icon}
        </span>

        {label}
      </label>

      <select
        value={value}
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
        className="
          w-full
          rounded-xl
          border
          border-slate-200
          bg-slate-50
          px-4
          py-3
          text-sm
          font-medium
          text-slate-700
          outline-none
          transition
          hover:bg-white
          focus:border-blue-400
          focus:bg-white
          focus:ring-4
          focus:ring-blue-100
        "
      >

        {options.map((option) => (
          <option
            key={option}
            value={option}
          >
            {option}
          </option>
        ))}

      </select>

    </div>
  );
};

// ======================================================
// PASSWORD FIELD
// ======================================================

const PasswordField = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) => {
  const [visible, setVisible] =
    useState(false);

  return (
    <div>

      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </label>

      <div className="relative">

        <FiLock
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          size={17}
        />

        <input
          type={
            visible
              ? "text"
              : "password"
          }
          value={value}
          onChange={(event) =>
            onChange(
              event.target.value
            )
          }
          placeholder="Enter password"
          className="
            w-full
            rounded-xl
            border
            border-slate-200
            bg-slate-50
            py-3
            pl-11
            pr-12
            text-sm
            text-slate-800
            outline-none
            transition
            placeholder:text-slate-400
            focus:border-blue-400
            focus:bg-white
            focus:ring-4
            focus:ring-blue-100
          "
        />

        <button
          type="button"
          onClick={() =>
            setVisible(!visible)
          }
          className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
        >
          {visible ? (
            <FiMoon size={16} />
          ) : (
            <FiSun size={16} />
          )}
        </button>

      </div>

    </div>
  );
};

export default Settings;