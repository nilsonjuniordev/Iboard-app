import GlobalStyle from "../styles/global";
import { Link } from "react-router-dom";

const Home = () => (
  <>
    <div className="ContainerDefaultH">
      <div className="textCenter">
        <img className="navLogo" src="/assets/iboard-logo-sfundo.png" alt="" />
        
        <div className="ContentApp">
          <h2>Bem-vindo</h2>

          <p>
            No iBoard, estamos redefinindo o processo de admissão, unindo
            colaboradores e recrutadores em uma plataforma única e poderosa. Com
            uma interface intuitiva e recursos inovadores, estamos aqui para
            simplificar e agilizar cada etapa do processo de contratação e relacionamento.
          </p>

          <p>
            <br />
            Por favor, selecione uma opção:
          </p>

          <Link to="/login">
            <button className="btnMenu">Colaborador</button>
          </Link>

          <Link to="/LoginCnpj">
            <button className="btnMenu">Recrutador</button>
          </Link>
        </div>
      </div>
    </div>

    <GlobalStyle />
  </>
);

export default Home;
