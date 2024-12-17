import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const LoginAdm = () => {
  const [nome, setNome] = useState('');
  const [pass, setPass] = useState('');
  const [loginError, setLoginError] = useState('');
  const navigate = useNavigate();


  const handleNomeChange = (e) => {
    setNome(e.target.value.toUpperCase());
  };

  const handlePassChange = (e) => {
    setPass(e.target.value);
  };



  const handleSubmit = async (e) => {
    e.preventDefault();


    try {
      const response = await axios.post('/api/loginCnpj', {
        nome,
        pass,
      });

      const {  userId } = response.data;

      if (userId !== undefined) {
       localStorage.setItem("specificToken", response.data.token);
        localStorage.setItem('userId', userId);

        navigate('/Admin');
        window.location.reload();
      } else {
        setLoginError(<div className='alertRed'>Credenciais inválidas. Verifique nome e Senha.</div>);
        console.error('ID do usuário não fornecido na resposta do servidor.');
      }

    } catch (error) {
      setLoginError(<div className='alertRed'>Credenciais inválidas. Verifique nome e Senha.</div>);
      console.error('Erro ao realizar login:', error.message);
    }
  };

  return (
    <div className='ContainerDefaultRh'>
      <Link to="/" className="voltar">
          <p>Voltar</p> 
        </Link>

<h1 style={{ color: '#fff' , textAlign: 'center'}}>Admin Prime TXT</h1><br/>
      <p  style={{ color: '#fff' , textAlign: 'center'}}>
        Utilize usuário esenha do admin <br/>para acessar sua conta.
      </p><br/>
      <form onSubmit={handleSubmit}>
        <div className="formGroup">
          <label htmlFor="nome" style={{ color: '#fff'}}>Nome:</label>
          <input
            type="text"
            id="nome"
            value={nome}
            onChange={handleNomeChange}
            placeholder='Digite o nome de cadastro'
          />
        </div>
        <div className="formGroup">
        <label htmlFor="pass" style={{ color: '#fff' }}>Senha:</label>
          <input
            type="password" // Alterado para tipo password para ocultar a senha
            id="pass"
            value={pass} // Alterado para pegar a senha do estado
            onChange={handlePassChange} // Adicionado para atualizar o estado da senha
            placeholder='Digite a senha'
          />
        </div>
        <button className="btnMenu" type="submit">Entrar</button>
      </form>

      {loginError && (
        <p className="errorMessage">{loginError}</p>
      )}
  
      <br/>
   
    </div>
  );
};

export default LoginAdm;
