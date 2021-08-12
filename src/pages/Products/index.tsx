import React, { useState, useEffect } from 'react';
//import { Link, useHistory } from 'react-router-dom';
import Link from 'next/link';
import Image from 'next/image'
import { useRouter } from "next/router";
import { FiChevronLeft, FiEdit, FiTrash2 } from 'react-icons/fi';
import { useToasts } from 'react-toast-notifications';

import api from '../../services/api';

//import './styles-Products.css';

// import largePetShopLogoImg from '../../assets/large_pet_shop_logo.svg';

export default function Products () {
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    const userId = localStorage.getItem('userId');
    //const history = useHistory();
    const router = useRouter();

    const { addToast } = useToasts();

    useEffect(() => {
        loadProducts();
    }, [userId, searchTerm]);

    async function loadProducts () {
        const response = await api.get('product', {
            headers: {
                Authorization: userId,
            }
        });

        setProducts(response.data);

        if (searchTerm === '') { // filter not informed yet
            setSearchResults(response.data);
        } else {
            applyFilter();
        }
    }

    function applyFilter () {
        const results = !searchTerm
            ? products
            : products.filter((product: any) =>
                product.name.toLowerCase().includes(searchTerm.toLocaleLowerCase())
        );
        setSearchResults(results);
    }

    const handleChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
        setSearchTerm(e.target.value);
    };

    function handleLogout () {
        localStorage.clear();

        router.push('/'); // back to the login page
    }

    async function handleDeleteProduct (id: any) {
        if (window.confirm('O produto será excluído. Confirma?')) {
            try {
                await api.delete(`product/${id}`, {
                    headers: {
                        Authorization: userId,
                    }
                });

                addToast('Produto excluído!', { appearance: 'info' });

                setProducts(products.filter((product: any) => product.id !== id));
                
                const resultsDelete = products.filter((product: any) => product.id !== id);

                setSearchResults(resultsDelete);
                setSearchTerm('');

            } catch (err) {
                addToast('Erro ao deletar produto, tente novamente.', { appearance: 'error' });
            }
        }
    }

    async function handleModifyProduct (id: string) {
        localStorage.setItem('productId', id);
        router.push('/Product/modify'); // navigates to the ModifyProduct route
    }

    return (
        <>
            <div className="profile-container1">
              <header>
                  <Image src='/large_pet_shop_logo.svg' alt="largePetShopLogo" width={100} height={20} />
                  {/* <Image src={largePetShopLogoImg} alt="largePetShopLogo" /> */}
                  {/* <Image  src={loginLogoImg} alt="loginLogo" className="img" /> */}
                  <button onClick={handleLogout} type="button" title="Sair">
                      <FiChevronLeft size={35} />
                  </button>
              </header>
            </div>

            <div className="profile-container2">
              {/* <Link className="button" to="/product/new">Incluir Produto</Link> */}
              <Link href="/Product/new">Incluir Produto</Link>
            </div>

            <div className="profile-container3">
              <hr/>
            </div>

            <div className="profile-container4">
              <p className="title">Produtos</p>
            </div>

            <div className="profile-container5">
                <input 
                    placeholder="Filtrar"
                    type="text"
                    value={searchTerm}
                    onChange={handleChange}
                />
            </div>

            <div className="profile-container6">
                <ul>
                    {searchResults.map((product: any) => (
                        <li key={product.id}>

                            <div>
                                <p className="title">Nome</p>
                                <p>{product.name}</p>

                                <p className="title">Categoria</p>
                                <p>{product.category}</p>

                                <p className="title">Preço</p>
                                <p>{Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}</p>

                                <p className="title">Qt. Estoque</p>
                                <p>{Intl.NumberFormat('pt-BR', { style: 'decimal' }).format(product.stock_quantity)}</p>
                            </div>

                            <div>
                                <button onClick={() => handleModifyProduct(product.id)} type="button" title="Alterar Produto">
                                    <FiEdit size={27} />
                                </button>

                                <br/><br/><br/>

                                <button onClick={() => handleDeleteProduct(product.id)} type="button" title="Excluir Produto">
                                    <FiTrash2 size={27} />
                                </button>
                            </div>

                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
}
