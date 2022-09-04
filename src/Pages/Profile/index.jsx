import { useContext, useState } from 'react';
import { FiSettings, FiUpload } from 'react-icons/fi';
import Header from '../../Components/Header';
import Title from '../../Components/Title';
import avatar from '../../Assets/avatar.png';
import { AuthContext } from '../../Contexts/Auth';
import './profile.css';
import firebase from '../../Services/firebaseConnection';

export default function Profile() {

    const { user, signOut, setUser, storageUser } = useContext(AuthContext);

    const [nome, setNome] = useState(user && user.nome);
    const [email, setEmail] = useState(user && user.email);
    const [avatarUrl, setAvatarUrl] = useState(user && user.avatarUrl);
    const [imgAvatar, setImgAvatar] = useState(null);

    function handleFile(e) {
        if (e.target.files[0]) {
            const image = e.target.files[0];

            if (image.type === 'image/jpeg' || image.type === 'image/png') {
                setImgAvatar(image);
                setAvatarUrl(URL.createObjectURL(e.target.files[0]))
            } else {
                alert('Envie uma imagem do tipo PNG ou JPEG');
                setImgAvatar(null);
                return null;
            }
        }
    }

    async function handleUpload() {
        const currentUid = user.uid;

        const uploadTask = await firebase.storage()
            .ref(`images/${currentUid}/${imgAvatar.name}`)
            .put(imgAvatar)
            .then(async () => {
                console.log('FOTO ENVIADA COM SUCESSO!');

                await firebase.storage().ref(`images/${currentUid}`)
                    .child(imgAvatar.name).getDownloadURL()
                    .then(async (url) => {
                        let urlFoto = url;
                        await firebase.firestore().collection('users')
                            .doc(user.uid)
                            .update({
                                avatarUrl: urlFoto,
                                nome: nome
                            })
                            .then(() => {
                                let data = {
                                    ...user,
                                    avatarUrl: urlFoto,
                                    nome: nome
                                };
                                setUser(data);
                                storageUser(data);
                            })
                    })
            })
    }

    async function handleSave(e) {
        e.preventDefault()
        if (imgAvatar === null && nome !== '') {
            firebase.firestore().collection('users')
                .doc(user.uid)
                .update({
                    nome: nome
                })
                .then(() => {
                    let data = {
                        ...user,
                        nome: nome
                    };
                    setUser(data);
                    storageUser(data);
                })
        }
        else if (nome !== '' && imgAvatar !== null) {
            handleUpload()
        }
    }

    return (
        <div>
            <Header />

            <div className='content'>
                <Title name="Meu perfil">
                    <FiSettings size={25} />
                </Title>

                <div className='container'>
                    <form className='form-profile' onSubmit={handleSave}>
                        <label className='label-avatar'>
                            <span>
                                <FiUpload color='#fff' size={25} />
                            </span>
                            <input type="file" accept='image/*' onChange={handleFile} /><br />
                            {avatarUrl === null ?
                                <img src={avatar} width="250" height="250" />
                                :
                                <img src={avatarUrl} width="250" height="250" />
                            }
                        </label>
                        <label>Nome</label>
                        <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} />

                        <label>Email</label>
                        <input type="text" value={email} disabled={true} />
                        <button type='submit'>Salvar</button>
                    </form>
                </div>
                <div className='container'>
                    <button className='logout-btn' onClick={() => signOut()}>
                        Sair
                    </button>
                </div>
            </div>
        </div>
    );
}