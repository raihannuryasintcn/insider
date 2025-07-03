import LoginForm from "@/components/custom/LoginForm";

// URL untuk gambar latar belakang halaman login
const LOGIN_BACKGROUND_IMAGE_URL = "/login-bg.png";

/**
 * Komponen halaman Login.
 * Menampilkan form login di tengah layar dengan latar belakang gambar.
 */

export default function LoginPage() {
    return (
        <div
            className="flex items-center justify-center min-h-screen bg-cover bg-center"
            style={{
                backgroundImage: `url('${LOGIN_BACKGROUND_IMAGE_URL}')`,
            }}
        >
            <LoginForm />
        </div>
    );
}
