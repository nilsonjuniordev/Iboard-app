import GlobalStyle from "../styles/global.js";
import FormCadastroRh from "../components/Forms/FormCadastroRh.js";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { Link } from 'react-router-dom';

function RegisterCnpj() {
  const [users, setUsers] = useState([]);
  const [onEdit, setOnEdit] = useState(null);

  const getUsers = async () => {
    try {
      const res = await axios.get("https://191.184.72.124:8800");
      setUsers(res.data.sort((a, b) => (a.nome > b.nome ? 1 : -1)));
    } catch (error) {
      toast.error(error);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <>
      <div className='ContainerDefaultRh'> 
      <div className="ContentForm">
   
           <img className='navLogo' src="/assets/iboard-logo-sfundo.png" alt='' />
        <br/>
        
       
        <p style={{ color: '#fff', textAlign: 'center'}}>Preencha cada campo do formulário com suas informações pessoais atualizadas. </p> <br/>
        <FormCadastroRh onEdit={onEdit} setOnEdit={setOnEdit} getUsers={getUsers} users={users} />
     
      <ToastContainer autoClose={3000} position={toast.POSITION.BOTTOM_LEFT} />
      <GlobalStyle />
      <br />
      <Link to="/LoginCnpj" >
          <p style={{ color: '#fff' , textAlign: 'center'}}>Já tem cadastro? Entrar</p> 
        </Link><br />
      <Link to="/">
        <p  style={{ color: '#fff' , textAlign: 'center'}}>Não é um recrutador? Voltar para início.</p> 
      </Link>
      <br />
  </div>  </div>
    
    </>
  );
}

export default RegisterCnpj;

