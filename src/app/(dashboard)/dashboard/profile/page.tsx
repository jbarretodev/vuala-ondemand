"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

type User = {
  id: number;
  name: string;
  email: string;
  username: string | null;
  avatar: string | null;
  createdAt: string;
  updatedAt: string;
};

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingProfile, setEditingProfile] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  // Formulario de perfil
  const [profileForm, setProfileForm] = useState({
    name: "",
    username: "",
  });

  // Formulario de contraseña
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/profile");
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setProfileForm({
          name: data.user.name || "",
          username: data.user.username || "",
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Error al cargar el perfil");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    setSavingProfile(true);
    try {
      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileForm),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Perfil actualizado correctamente");
        setUser(data.user);
        setEditingProfile(false);
      } else {
        toast.error(data.error || "Error al actualizar perfil");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Error al actualizar perfil");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }

    setChangingPassword(true);
    try {
      const response = await fetch("/api/profile/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(passwordForm),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Contraseña actualizada correctamente");
        setPasswordForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        toast.error(data.error || "Error al cambiar contraseña");
      }
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error("Error al cambiar contraseña");
    } finally {
      setChangingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-brand-500)] mx-auto mb-4"></div>
          <p className="text-neutral-600">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-neutral-600">No se pudo cargar el perfil</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h2 className="font-heading text-2xl font-semibold">Mi Perfil</h2>
        <p className="text-neutral-600 text-sm mt-1">
          Gestiona tu información personal y configuración de cuenta
        </p>
      </div>

      {/* Información del Usuario */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-heading text-lg font-semibold">
            Información Personal
          </h3>
          {!editingProfile ? (
            <button
              onClick={() => setEditingProfile(true)}
              className="text-sm text-[var(--color-brand-500)] hover:underline font-medium"
            >
              Editar
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setEditingProfile(false);
                  setProfileForm({
                    name: user.name || "",
                    username: user.username || "",
                  });
                }}
                className="text-sm text-neutral-600 hover:underline"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveProfile}
                disabled={savingProfile}
                className="text-sm text-[var(--color-brand-500)] hover:underline font-medium disabled:opacity-50"
              >
                {savingProfile ? "Guardando..." : "Guardar"}
              </button>
            </div>
          )}
        </div>

        <div className="flex items-start gap-6 mb-6">
          <div className="w-20 h-20 rounded-full bg-[var(--color-brand-500)] text-white flex items-center justify-center font-bold text-2xl flex-shrink-0">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nombre */}
            <div>
              <label className="text-sm font-medium text-neutral-700 block mb-1">
                Nombre Completo
              </label>
              {editingProfile ? (
                <input
                  type="text"
                  value={profileForm.name}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-500)]/20"
                />
              ) : (
                <p className="text-sm text-neutral-900">{user.name}</p>
              )}
            </div>

            {/* Username */}
            <div>
              <label className="text-sm font-medium text-neutral-700 block mb-1">
                Nombre de Usuario
              </label>
              {editingProfile ? (
                <input
                  type="text"
                  value={profileForm.username}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, username: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-500)]/20"
                />
              ) : (
                <p className="text-sm text-neutral-900">
                  {user.username || "Sin especificar"}
                </p>
              )}
            </div>

            {/* Email (no editable) */}
            <div>
              <label className="text-sm font-medium text-neutral-700 block mb-1">
                Email
              </label>
              <p className="text-sm text-neutral-900">{user.email}</p>
              <p className="text-xs text-neutral-500 mt-0.5">
                El email no se puede modificar
              </p>
            </div>

          </div>
        </div>

        <div className="border-t border-neutral-100 pt-4 text-xs text-neutral-500">
          <p>
            Cuenta creada: {new Date(user.createdAt).toLocaleDateString("es-ES")}
          </p>
          <p className="mt-1">
            Última actualización:{" "}
            {new Date(user.updatedAt).toLocaleDateString("es-ES")}
          </p>
        </div>
      </Card>

      {/* Cambio de Contraseña */}
      <Card>
        <h3 className="font-heading text-lg font-semibold mb-4">
          Cambiar Contraseña
        </h3>

        <div className="space-y-4 max-w-md">
          <div>
            <label className="text-sm font-medium text-neutral-700 block mb-1">
              Contraseña Actual
            </label>
            <input
              type="password"
              value={passwordForm.currentPassword}
              onChange={(e) =>
                setPasswordForm({
                  ...passwordForm,
                  currentPassword: e.target.value,
                })
              }
              className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-500)]/20"
              placeholder="Ingresa tu contraseña actual"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-neutral-700 block mb-1">
              Nueva Contraseña
            </label>
            <input
              type="password"
              value={passwordForm.newPassword}
              onChange={(e) =>
                setPasswordForm({ ...passwordForm, newPassword: e.target.value })
              }
              className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-500)]/20"
              placeholder="Mínimo 6 caracteres"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-neutral-700 block mb-1">
              Confirmar Nueva Contraseña
            </label>
            <input
              type="password"
              value={passwordForm.confirmPassword}
              onChange={(e) =>
                setPasswordForm({
                  ...passwordForm,
                  confirmPassword: e.target.value,
                })
              }
              className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-500)]/20"
              placeholder="Repite la nueva contraseña"
            />
          </div>

          <button
            onClick={handleChangePassword}
            disabled={
              changingPassword ||
              !passwordForm.currentPassword ||
              !passwordForm.newPassword ||
              !passwordForm.confirmPassword
            }
            className="px-4 py-2 bg-[var(--color-brand-500)] text-white rounded-lg text-sm font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {changingPassword ? "Cambiando..." : "Cambiar Contraseña"}
          </button>

          {passwordForm.newPassword &&
            passwordForm.confirmPassword &&
            passwordForm.newPassword !== passwordForm.confirmPassword && (
              <p className="text-xs text-red-600">
                ⚠️ Las contraseñas no coinciden
              </p>
            )}
        </div>
      </Card>

      {/* Información de Seguridad */}
      <Card>
        <h3 className="font-heading text-lg font-semibold mb-4">
          Seguridad de la Cuenta
        </h3>
        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-2 text-green-600">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span>Email verificado</span>
          </div>
          <div className="flex items-center gap-2 text-neutral-600">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <span>Email y username únicos en el sistema</span>
          </div>
        </div>
      </Card>
    </div>
  );
}

/* ui */
function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-4 md:p-6 shadow-sm">
      {children}
    </div>
  );
}
function FeatureItem({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-neutral-200 px-3 py-2 text-sm">
      <span>#</span> {children}
    </div>
  );
}

function ActivityItem({ title, time }: { title: string; time: string }) {
  return (
    <li className="flex items-start gap-3">
      <span className="mt-0.5 text-lg">•</span>
      <div>
        <p>{title}</p>
        <p className="text-xs text-neutral-500">{time}</p>
      </div>
    </li>
  );
}