import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import App from "./routes/App";
import Login from "./routes/Login";
import Home from "./routes/Home";
import Listar from "./routes/Listar";
import ListarAdm from "./routes/ListarAdm";
import MyData from "./routes/MyData";
import MyDataRh from "./routes/MyDataRh";
import Register from "./routes/Register";
import DashboardUser from "./routes/DashboardUser";
import MyDataAdm from "./routes/MyDataAdm";
import Upload from "./routes/Upload";
import LoginAdm from "./routes/LoginAdm";
import LoginCnpj from "./routes/LoginCnpj";
import LoginUser from "./routes/LoginUser";
import DashboardRh from "./routes/DashboardRh";
import Admin from "./routes/Admin";
import RegisterRh from "./routes/RegisterRh";
import RegisterAdm from "./routes/RegisterAdm";
import RegisterAdmRh from "./routes/RegisterAdmRh";
import RegisterCnpj from "./routes/RegisterCnpj";
import LoginRh from "./routes/LoginRh";
import UploadExame from "./routes/UploadExame";
import MyDocs from "./routes/MyDocs";
import Survey from "./routes/Survey";
import UniformsEpi from "./routes/UniformsEpi";
import SurveyUser from "./routes/SurveyUser";
import UniformsEpiUser from "./routes/UniformsEpiUser";
import RegisterCv from "./routes/RegisterCv";
import CalendarEvents from "./routes/CalendarEvents";
import JobPosting from "./routes/JobPosting";
import Jobs from "./routes/Jobs";
import JobPostingRh from "./routes/JobPostingRh";
import ContractSigning from "./routes/ContractSigning"
import ContractSigners from "./routes/ContractSigners"
import UserContractsSign from "./routes/UserContractsSign"
// Definição do componente PrivateRouteWrapper
const PrivateRouteWrapper = ({ element, isAuthenticated }) => {
  console.log("PrivateRouteWrapper - isAuthenticated:", isAuthenticated);
  return isAuthenticated ? <>{element}</> : <Navigate to="/" replace />;
};

const AppContainer = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );
  const [hasSpecificToken, setHasSpecificToken] = useState(
    !!localStorage.getItem("specificToken")
  );

  useEffect(() => {
    const token = localStorage.getItem("token");
    const authenticated = !!token;
    const specificToken = localStorage.getItem("specificToken");
    const hasToken = !!specificToken;

    setTimeout(() => {
      setIsAuthenticated(authenticated);
      setHasSpecificToken(hasToken);
    }, 0);
  }, []);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <App />,
      children: [
        // Rotas Publicas
        {
          index: true,
          element: <Home />,
        },
        {
          path: "Login",
          element: <Login />,
        },
        {
          path: "LoginUser",
          element: <LoginUser />,
        },
        {
          path: "LoginAdm",
          element: <LoginAdm />,
        },
        {
          path: "LoginCnpj",
          element: <LoginCnpj />,
        },
        {
          path: "LoginRh",
          element: <LoginRh />,
        },
        {
          path: "RegisterCnpj",
          element: <RegisterCnpj />,
        },
        {
          path: "Register",
          element: <Register />,
        },

        // Rotas Privadas EMPRESAS
        {
          path: "Listar",
          element: hasSpecificToken ? <Listar /> : <Navigate to="/" replace />,
        },
        {
          path: "ListarAdm",
          element: hasSpecificToken ? <ListarAdm /> : <Navigate to="/" replace />,
        },
        {
          path: "DashboardRh",
          element: hasSpecificToken ? <DashboardRh /> : <Navigate to="/" replace />,
        },
        {
          path: "Admin",
          element: hasSpecificToken ? <Admin /> : <Navigate to="/" replace />,
        },
        {
          path: "MyDataRh",
          element: hasSpecificToken ? <MyDataRh /> : <Navigate to="/" replace />,
        },
        {
          path: "MyDataAdm",
          element: hasSpecificToken ? <MyDataAdm /> : <Navigate to="/" replace />,
        },
        {
          path: "RegisterRh",
          element: hasSpecificToken ? <RegisterRh /> : <Navigate to="/" replace />,
        },
        {
          path: "RegisterAdmRh",
          element: hasSpecificToken ? <RegisterAdmRh /> : <Navigate to="/" replace />,
        },
        {
          path: "Survey",
          element: hasSpecificToken ? <Survey /> : <Navigate to="/" replace />,
        },
        {
          path: "UniformsEpi",
          element: hasSpecificToken ? <UniformsEpi /> : <Navigate to="/" replace />,
        },
        {
          path: "RegisterAdm",
          element: hasSpecificToken ? <RegisterAdm /> : <Navigate to="/" replace />,
        },
        {
          path: "JobPosting",
          element: hasSpecificToken ? <JobPosting /> : <Navigate to="/" replace />,
        },
        {
          path: "JobPostingRh",
          element: hasSpecificToken ? <JobPostingRh /> : <Navigate to="/" replace />,
        },
        {
          path: "CalendarEvents",
          element: hasSpecificToken ? <CalendarEvents /> : <Navigate to="/" replace />,
        },
        {
          path: "ContractSigning",
          element: hasSpecificToken ? <ContractSigning /> : <Navigate to="/" replace />,
        },
        



        // Rotas Privadas COLABORADORES
        {
          path: "MyData",
          element: (
            <PrivateRouteWrapper
              element={<MyData />}
              isAuthenticated={isAuthenticated}
            />
          ),
        },
        {
          path: "MyDocs",
          element: (
            <PrivateRouteWrapper
              element={<MyDocs />}
              isAuthenticated={isAuthenticated}
            />
          ),
        },
        {
          path: "DashboardUser",
          element: (
            <PrivateRouteWrapper
              element={<DashboardUser />}
              isAuthenticated={isAuthenticated}
            />
          ),
        },
        {
          path: "Upload",
          element: (
            <PrivateRouteWrapper
              element={<Upload />}
              isAuthenticated={isAuthenticated}
            />
          ),
        },
        {
          path: "UploadExame",
          element: (
            <PrivateRouteWrapper
              element={<UploadExame />}
              isAuthenticated={isAuthenticated}
            />
          ),
        },
        {
          path: "UniformsEpiUser",
          element: (
            <PrivateRouteWrapper
              element={<UniformsEpiUser />}
              isAuthenticated={isAuthenticated}
            />
          ),
        },
        {
          path: "SurveyUser",
          element: (
            <PrivateRouteWrapper
              element={<SurveyUser />}
              isAuthenticated={isAuthenticated}
            />
          ),
        },
        {
          path: "RegisterCv",
          element: (
            <PrivateRouteWrapper
              element={<RegisterCv />}
              isAuthenticated={isAuthenticated}
            />
          ),
        },
        {
          path: "Jobs",
          element: (
            <PrivateRouteWrapper
              element={<Jobs />}
              isAuthenticated={isAuthenticated}
            />
          ),
        },
        {
          path: "/sign/:contractId",
          element: (
            <PrivateRouteWrapper
              element={<ContractSigners />}
              isAuthenticated={isAuthenticated}
            />
          ),
        },
        {
          path: "UserContractsSign",
          element: (
            <PrivateRouteWrapper
              element={<UserContractsSign />}
              isAuthenticated={isAuthenticated}
            />
          ),
        }    

      ],
    },
  ]);

  return (
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<AppContainer />);
