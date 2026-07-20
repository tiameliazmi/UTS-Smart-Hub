import Checkbox from "@/Components/Checkbox";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import GuestLayout from "@/Layouts/GuestLayout";

import { Head, Link, useForm } from "@inertiajs/react";

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route("login"), {
            onFinish: () => reset("password"),
        });
    };

    return (
        <GuestLayout>
            <Head title="Masuk" />

            {status && (
                <div className="mb-6 rounded-xl bg-green-100 border border-green-200 px-4 py-3 text-sm text-green-700">
                    {status}
                </div>
            )}

            <div className="mb-10">
                <h2 className="text-4xl font-bold text-gray-900">
                    Selamat Datang 👋
                </h2>

                <p className="mt-3 text-gray-500 leading-7">
                    Silakan masuk menggunakan akun Smart Hub untuk mengakses
                    sistem manajemen inventaris.
                </p>
            </div>

            <form onSubmit={submit} className="space-y-6">
                <div>
                    <InputLabel
                        htmlFor="email"
                        value="Alamat Email"
                        className="text-gray-700"
                    />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-2 block w-full rounded-xl border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        autoComplete="username"
                        isFocused={true}
                        placeholder="contoh@email.com"
                        onChange={(e) =>
                            setData("email", e.target.value)
                        }
                    />

                    <InputError
                        message={errors.email}
                        className="mt-2"
                    />
                </div>

                <div>
                    <InputLabel
                        htmlFor="password"
                        value="Password"
                        className="text-gray-700"
                    />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-2 block w-full rounded-xl border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        autoComplete="current-password"
                        placeholder="Masukkan password"
                        onChange={(e) =>
                            setData("password", e.target.value)
                        }
                    />

                    <InputError
                        message={errors.password}
                        className="mt-2"
                    />
                </div>
                                <div className="flex items-center justify-between">
                    <label className="flex items-center">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) =>
                                setData("remember", e.target.checked)
                            }
                        />

                        <span className="ml-2 text-sm text-gray-600">
                            Ingat saya
                        </span>
                    </label>

                    {canResetPassword && (
                        <Link
                            href={route("password.request")}
                            className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline"
                        >
                            Lupa Password?
                        </Link>
                    )}
                </div>

                <PrimaryButton
                    disabled={processing}
                    className="flex w-full justify-center rounded-xl bg-blue-600 py-3 text-base font-semibold text-white transition hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-800"
                >
                    {processing ? "Memproses..." : "Masuk"}
                </PrimaryButton>
            </form>

            <div className="mt-10 border-t border-gray-200 pt-6">
                <p className="text-center text-sm text-gray-500">
                    © {new Date().getFullYear()} Smart Hub Management System
                </p>

                <p className="mt-2 text-center text-xs text-gray-400">
                    Sistem Manajemen Inventaris berbasis Laravel & Inertia.js
                </p>
            </div>
        </GuestLayout>
    );
}