import React, {useState} from 'react';
import Image from 'next/image'
//import { useHistory } from 'react-router-dom';
import { useRouter } from "next/router";
import { useToasts } from 'react-toast-notifications';
import { FiChevronLeft } from 'react-icons/fi';

import api from '../../services/api';

//import './styles.css';

//import smallPetShopLogoImg from '../../assets/small_pet_shop_logo.svg';

export default function NewProduct() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [stock_quantity, setStockQuantity] = useState('');

  const userId = localStorage.getItem('userId');

  //const history = useHistory();
  const router = useRouter();

  const { addToast } = useToasts();

  async function handleNewProduct (e: { preventDefault: () => void; }) {
      e.preventDefault();

      const data = {
          name,
          description,
          category,
          price,
          stock_quantity,
      };

      try {
          await api.post('product',
              data,
              {
                  headers: {
                      Authorization: userId,
              }
          });

          addToast('Produto cadastrado com sucesso!', { appearance: 'success' });

          router.push('/Products'); // back to the Products page

      } catch (err) {
          addToast('Erro ao cadastrar produto, tente novamente.', { appearance: 'error' });
      }
  }

  const handleProducts = () => router.push('/Products'); // back to the Products page

  return (
      <div className="new-product-container">
          <section className="form">
              <header>
                  <Image  src='/small_pet_shop_logo.svg' alt="smallPetShopLogo" width={72} height={16} />
                  {/* <img  src={smallPetShopLogoImg} alt="smallPetShopLogo" className="img" /> */}
                  <button onClick={handleProducts} type="button" title="Voltar">
                      <FiChevronLeft size={30} />
                  </button>
              </header>

              <div>
                  <p className="title">Incluir Produto</p>
              </div>

              <form onSubmit={handleNewProduct}>
                  <input 
                      placeholder="Nome"
                      value={name}
                      onChange={e => setName(e.target.value)}
                  />
                  <input 
                      placeholder="Descrição"
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                  />
                  <input 
                      placeholder="Categoria"
                      value={category}
                      onChange={e => setCategory(e.target.value)}
                  />
                  <input 
                      placeholder="Preço"
                      value={price}
                      type="number"
                      onChange={e => setPrice(e.target.value)}
                  />
                  <input 
                      placeholder="Quantidade Estoque"
                      value={stock_quantity}
                      type="number"
                      onChange={e => setStockQuantity(e.target.value)}
                  />
                  <button id="newProductButton" className="button" type="submit">Incluir</button>
              </form>
          </section>
      </div>
  );
}
