import React, {useState} from 'react';
import Image from 'next/image'
//import { useHistory } from 'react-router-dom';
import { useRouter } from "next/router";
import { useToasts } from 'react-toast-notifications';
import { FiChevronLeft } from 'react-icons/fi';

import api from '../../services/api';

//import './styles-Register.css';

// import smallPetShopLogoImg from '../../assets/small_pet_shop_logo.svg';

export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [pwd, setPWD] = useState('');
    //const history = useHistory();
    const router = useRouter();

    const { addToast } = useToasts();

    async function handleRegister (e: { preventDefault: () => void; }) {
        e.preventDefault();

        const data = {
            name,
            email,
            pwd,
        };

        try {
            await api.post('user', data);

            addToast('Registro realizado com sucesso!', { appearance: 'success' });

            //history.push('/');
            router.push('/');

        } catch (err) {
            addToast('Erro no cadastro, tente novamente.', { appearance: 'info' });
        }
    }

    function handleLogin () {
        //history.push('/'); // back to the login page
        router.push('/'); // back to the login page
    }

    return (
        <div className="register-container">
            <section className="form">
                <header>
                    <Image  src='/small_pet_shop_logo.svg' alt="smallPetShopLogo" width={90} height={16} />
                    {/* <Image  src={smallPetShopLogoImg} alt="smallPetShopLogo" className="img" /> */}
                    {/* <Image  src={loginLogoImg} alt="loginLogo" className="img" /> */}
                    <button onClick={handleLogin} type="button" title="Voltar">
                        <FiChevronLeft size={30} />
                    </button>
                </header>

                <div>
                    <p className="title">Criar Conta</p>
                </div>

                <form onSubmit={handleRegister}>
                    <input 
                        placeholder="Nome"
                        value={name}
                        onChange={e => setName(e.target.value)}
                    />
                    <input 
                        placeholder="E-mail"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                    <input 
                        placeholder="Senha"
                        value={pwd}
                        type="password"
                        onChange={e => setPWD(e.target.value)}
                    />
                    <button id="registerButton" className="button" type="submit">Cadastrar</button>
                </form>
            </section>
        </div>
    );
}
