import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image'
import { useRouter } from "next/router";
import { FiChevronLeft, FiEdit, FiTrash2 } from 'react-icons/fi';
import { useToasts } from 'react-toast-notifications';

import api from '../../services/api';

interface Product {
  id: number;
  name: string;
  description: string;
  category: string;
  price: number;
  stock_quantity: number;
  user_id: string;
}

export default function Products () {
  const [products, setProducts] = useState<Product[]>([]);

  const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : '';

  const router = useRouter();
  const { addToast } = useToasts();

  useEffect(() => {
    loadProducts();
  }, [userId]);

  async function loadProducts () {
    const response = await api.get('product', {
      headers: {
        Authorization: userId,
      }
    });

    setProducts(response.data);
  }

  const handleLogout = () => {
    localStorage.clear();
    router.push('/'); // back to the login page
  }

  async function handleDeleteProduct (id: number) {
    if (window.confirm('O produto será excluído. Confirma?')) {
        try {
          await api.delete(`product/${id}`, {
              headers: {
                  Authorization: userId,
              }
          });

          addToast('Produto excluído!', { appearance: 'info' });

          setProducts(products.filter((product: Product) => product.id !== id));

        } catch (err) {
          addToast('Erro ao deletar produto, tente novamente.', { appearance: 'error' });
        }
    }
  }

  async function handleModifyProduct (id: number) {
    localStorage.setItem('productId', String(id));
    router.push('/ModifyProduct'); // navigates to the ModifyProduct route
  }

  return (
    <>
      <div className="profile-container1">
        <header>
          <Image src='/large_pet_shop_logo.svg' alt="largePetShopLogo" width={240} height={25} />
          <button onClick={handleLogout} type="button" title="Sair">
            <FiChevronLeft size={35} />
          </button>
        </header>
      </div>

      <div className="profile-container2">
        <Link href="/NewProduct" passHref>
          <div className="button">
            Incluir Produto
          </div>
        </Link>
      </div>

      <div className="profile-container3"><hr/></div>

      <div className="profile-container4">
        <p className="title">Produtos</p>
      </div>

      <div className="profile-container6">
        <ul>
          {products.map((product: Product) => (
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
