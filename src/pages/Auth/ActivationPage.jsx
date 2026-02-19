import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "src/services/api";

export default function ActivatePage() {
    const { token } = useParams();
    const [status, setStatus] = useState("Aktywacja w toku...");

    useEffect(() => {
        const activateAccount = async () => {
            try {
                const res = await api.get(`auth/activate/${token}`);
                setStatus(res.message || "Konto pomyślnie aktywowane!");
            } catch (err) {
                setStatus(err.message || "Błąd aktywacji lub link wygasł.");
            }
        };
        activateAccount();
    }, [token]);

    return (
        <div className="pt-32 text-center text-(--font-color)">
            <h1 className="text-3xl font-bold mb-4">Aktywacja Konta</h1>
            <p className="mb-8">{status}</p>
            <Link to="/login" className="bg-(--medium-shade) text-black px-6 py-2 rounded-full font-bold">
                Przejdź do logowania
            </Link>
        </div>
    );
}