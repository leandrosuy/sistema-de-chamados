import { useState } from "react";
import { FiUser } from "react-icons/fi";
import { toast } from "react-toastify";
import Header from "../../Components/Header";
import Title from "../../Components/Title";
import firebase from '../../Services/firebaseConnection';

export default function Custumers() {
    const [nomeFantasia, setNomeFantasia] = useState('');
    const [cnpj, setCnpj] = useState('');
    const [endereco, setEndereco] = useState('');

    async function handleAdd(e) {
        e.preventDefault()
        if (nomeFantasia !== '' && cnpj !== '' && endereco !== '') {
            await firebase.firestore().collection('custumers')
                .add({
                    nomeFantasia: nomeFantasia,
                    cnpj: cnpj,
                    endereco: endereco
                })
                .then(() => {
                    setNomeFantasia('');
                    setCnpj('');
                    setEndereco('');
                    toast.info('Empresa cadastrada com sucesso!');
                })
                .catch((error) => {
                    console.log(error)
                    toast.error('Erro ao cadastrar essa empresa.');
                })
        } else {
            toast.error('Preencha todos os campos!');
        }
    }

    return (
        <div>
            <Header />
            <div className="content">
                <Title name="Clientes">
                    <FiUser size={25} />
                </Title>
                <div className="container">
                    <form className="form-profile custumers" onSubmit={handleAdd}>
                        <label>Nome fantasia</label>
                        <input type="text" placeholder="Nome fantasia" value={nomeFantasia} onChange={e => setNomeFantasia(e.target.value)} />

                        <label>CNPJ</label>
                        <input type="text" placeholder="CNPJ da empresa" value={cnpj} onChange={e => setCnpj(e.target.value)} />

                        <label>Endereço</label>
                        <input type="text" placeholder="Endereço da empresa" value={endereco} onChange={e => setEndereco(e.target.value)} />

                        <button type="submit">Cadastrar</button>
                    </form>
                </div>
            </div>
        </div>
    );
}