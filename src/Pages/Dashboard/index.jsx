import { useContext } from "react";
import { AuthContext } from "../../Contexts/Auth";

import Header from '../../Components/Header';

export default function Dashboard() {
    const { signOut } = useContext(AuthContext);
    return (
        <div>
            <Header />
            <h1>PAGINA DE DASHBOARD</h1>
        </div>
    );
}