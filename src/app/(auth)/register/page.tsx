import RegisterForm from "@/components/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold">Crear cuenta</h2>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Completa los pasos para registrarte.
        </p>
      </div>

      <RegisterForm/>
    </div>
  );
}