import { useContext, useEffect, useState } from 'react';
import { FiPlusCircle } from 'react-icons/fi';
import { toast } from 'react-toastify';
import Header from '../../Components/Header';
import Title from '../../Components/Title';
import { AuthContext } from '../../Contexts/Auth';
import firebase from '../../Services/firebaseConnection';
import { useHistory, useParams } from 'react-router-dom';

import './new.css'

export default function New() {
    const { id } = useParams();
    const { history } = useHistory();
    const [assunto, setAssunto] = useState('Suporte');
    const [status, setStatus] = useState('Aberto');
    const [complemento, setComplemento] = useState('');
    const [loadCustumers, setLoadCustumers] = useState(true);
    const [custumers, setCustumers] = useState([]);
    const [idCustumer, setIdCustumer] = useState(false);
    const [custumerSelected, setCustumerSelected] = useState('');

    const { user } = useContext(AuthContext);

    useEffect(() => {
        async function loadCustumers() {
            await firebase.firestore().collection('custumers')
                .get()
                .then((snapshot) => {
                    let lista = [];
                    snapshot.forEach((doc) => {
                        lista.push({
                            id: doc.id,
                            nomeFantasia: doc.data().nomeFantasia
                        })
                    })

                    if (lista.length === 0) {
                        console.log('Nenhuma empresa encontrada')
                        setCustumers([{ id: 1, nomeFantasia: 'freela' }])
                        setLoadCustumers(false);
                        return;
                    }

                    setCustumers(lista);
                    setLoadCustumers(false);

                    if (id) {
                        loadId(lista);
                    }
                })
                .catch((error) => {
                    console.log('Deu algum Erro!', error)
                    setLoadCustumers(false);
                    setCustumers([{ id: 1, nomeFantasia: '' }])
                })
        }

        loadCustumers();
    }, [])

    async function loadId(lista) {
        await firebase.firestore().collection('chamados').doc(id)
            .get()
            .then(snapshot => {
                setAssunto(snapshot.data().assunto);
                setStatus(snapshot.data().status);
                setComplemento(snapshot.data().complemento);

                let index = lista.findIndex(item => item.id == snapshot.data().clienteId);
                setCustumerSelected(index);
                setIdCustumer(true);

            })
            .catch((error) => {
                console.log('Erro no id passado', error)
                setIdCustumer(false);
            })
    }

    async function handleRegister(e) {
        e.preventDefault();

        if (idCustumer) {
            await firebase.firestore().collection('chamados')
                .doc(id)
                .update({
                    cliente: custumers[custumerSelected].nomeFantasia,
                    clienteId: custumers[custumerSelected].id,
                    assunto: assunto,
                    status: status,
                    complemento: complemento,
                    userId: user.uid
                })
                .then(() => {
                    toast.success('Chamado editado com sucesso!');
                    setCustumerSelected(0)
                    setComplemento('');
                    history.push('/dashboard')

                })
                .catch((error) => {
                    toast.error('Ops ocorreu um erro, tente mais tarde.')
                    console.log(error);
                })
            
            return;
        }

        await firebase.firestore().collection('chamados')
            .add({
                created: new Date(),
                cliente: custumers[custumerSelected].nomeFantasia,
                clienteId: custumers[custumerSelected].id,
                assunto: assunto,
                status: status,
                complemento: complemento,
                userId: user.uid
            })
            .then(() => {
                toast.success('Chamado criado com sucesso!');
                setComplemento('');
                setCustumerSelected(0);
            })
            .catch((error) => {
                console.log(error);
            })
    }

    function handleChangeSelect(e) {
        setAssunto(e.target.value)
    }

    function handleOptionChange(e) {
        setStatus(e.target.value)
    }

    function handleChangeCustumers(e) {
        setCustumerSelected(e.target.value);
    }

    return (
        <div>
            <Header />
            <div className='content'>
                <Title name={idCustumer ? 'Editar Chamado' : 'Novo Chamado'}>
                    <FiPlusCircle size={25} />
                </Title>

                <div className='container'>
                    <form className='form-profile' onSubmit={handleRegister}>
                        <label>Cliente</label>

                        {loadCustumers
                            ?
                            (<input type="text" disabled={true} placeholder="Carregando clientes..." />)
                            :
                            (
                                <select value={custumerSelected} onChange={handleChangeCustumers}>
                                    {custumers.map((item, index) => {
                                        return (
                                            <option key={item.id} value={index}>
                                                {item.nomeFantasia}
                                            </option>
                                        )
                                    })}
                                </select>
                            )
                        }



                        <label>Assunto</label>
                        <select value={assunto} onChange={handleChangeSelect}>
                            <option value="Suporte">
                                Suporte
                            </option>
                            <option value="Visita Tecnica">
                                Visita Tecnica
                            </option>
                            <option value="Financeiro">
                                Financeiro
                            </option>
                        </select>

                        <label>Status</label>
                        <div className='status'>
                            <input type="radio" name='radio' value="Aberto" onChange={handleOptionChange} checked={status === 'Aberto'} />
                            <span>Em Aberto</span>

                            <input type="radio" name='radio' value="Progresso" onChange={handleOptionChange} checked={status === 'Progresso'} />
                            <span>Progresso</span>

                            <input type="radio" name='radio' value="Atendido" onChange={handleOptionChange} checked={status === 'Atendido'} />
                            <span>Atendido</span>
                        </div>

                        <label htmlFor="">Complemento</label>
                        <textarea type="text" placeholder='Descreve seu problema (opcional).' value={complemento} onChange={e => setComplemento(e.target.value)} />

                        <button type='submit'>{idCustumer ? 'Atualizar' : 'Registrar'}</button>
                    </form>
                </div>
            </div>
        </div>
    );
}