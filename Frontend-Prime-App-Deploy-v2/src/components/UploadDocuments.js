import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Box, Grid, Typography, Button, MobileStepper } from "@mui/material";
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

const UploadImages = () => {
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [uploadMessage, setUploadMessage] = useState("");
  const [userId, setUserId] = useState("");
  const [userDocs, setUserDocs] = useState([]);
  const [currentDocIndex, setCurrentDocIndex] = useState(0);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(storedUserId);
      fetchUserDocs(storedUserId);
    }
  }, []);

  const fetchUserDocs = async (userId) => {
    try {
      const response = await axios.get("/api/");
      const users = response.data;
      const user = users.find((user) => user.iduser === parseInt(userId));
      if (user) {
        setUserDocs(user.docs.split(","));
      } else {
        console.warn("Usuário não encontrado.");
      }
    } catch (error) {
      console.error("Erro ao buscar os documentos do usuário:", error);
    }
  };

  const handleFileChange = (e) => {
    const selectedFiles = e.target.files;
    if (selectedFiles.length > 0) {
      setFiles((prevFiles) => [...prevFiles, ...Array.from(selectedFiles)]);
      setUploadMessage("");
    }
  };

  const handleUpload = async () => {
    if (files.length === 0 || !userId) {
      setUploadMessage("Nenhum arquivo selecionado ou UserId não fornecido.");
      return;
    }

    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });
    formData.append("userId", userId);

    try {
      const response = await axios.post("/api/uploads", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          UserId: userId,
        },
      });
      console.log("Response:", response);
      setUploadMessage(
        <div className="alertGreen">
          Documento enviado com sucesso, selecione o próximo documento abaixo:
        </div>
      );
      setFiles([]);

      if (currentDocIndex < userDocs.length - 1) {
        // Avançar para o próximo documento
        setCurrentDocIndex(currentDocIndex + 1);
      } else {
        // Último documento enviado, redirecionar para /MyAccount
        setUploadMessage(
          <div className="alertGreen">
            Todos os documentos foram enviados com sucesso.
          </div>
        );
        setTimeout(() => {
          navigate("/DashboardUser");
        }, 1000);
      }
    } catch (error) {
      console.error("Erro ao enviar as imagens:", error);
      setUploadMessage(
        <div className="alertRed">
          Erro ao enviar documento. Selecione um novo documento para ser enviado.
        </div>
      );
    }
  };

  const renderFilePreview = (file) => {
    const fileType = file.type;

    if (fileType.startsWith('image/')) {
      return <img src={URL.createObjectURL(file)} alt="preview" width={100} />;
    }

    if (fileType === 'application/pdf') {
      return <PictureAsPdfIcon color="error" sx={{ fontSize: 100 }} />;
    }

    return <InsertDriveFileIcon color="action" sx={{ fontSize: 100 }} />;
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column" sx={{ p: 3 }}>
      <Typography variant="h6" align="center" gutterBottom>
        Por favor, forneça os documentos solicitados pelo recrutador para avançar com o seu processo.
      </Typography>

      <Box sx={{ width: "100%" }}>
        <label htmlFor="fileInput" className="custom-file-upload">
          <input
            type="file"
            id="fileInput"
            multiple
            onChange={handleFileChange}
            style={{ display: "none" }}
          />

          <Typography align="center">
            Clique aqui para tirar fotos ou selecionar os documentos. Anexe frente e verso quando necessário antes de enviar.
          </Typography>
          {uploadMessage && <Typography align="center">{uploadMessage}</Typography>}

          <Box sx={{ flexGrow: 1, width: '100%' }}>
            <Grid container spacing={0}>
              <Grid item xs={12} sm={12}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Typography sx={{ p: 1, fontSize: "1.2em", textAlign: "center", mt: 1, color: "#6A438B" }}>
                    Documento {currentDocIndex + 1} de {userDocs.length}:
                    <br />
                    {userDocs[currentDocIndex]}
                  </Typography>

                  <img
                    src="/assets/idupload.png"
                    alt="idupload"
                    style={{ maxWidth: '50%', height: 'auto' }}
                  />
                </Box>
              </Grid>
            </Grid>
          </Box>

          <MobileStepper
            variant="progress"
            steps={userDocs.length}
            position="static"
            activeStep={currentDocIndex}
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              backgroundColor: "transparent",
              "& .MuiMobileStepper-progress": {
                backgroundColor: "#FFFF00",
                width: "100%",
              },
              "& .MuiLinearProgress-bar": {
                backgroundColor: "#633687",
              },
              "& .MuiMobileStepper-dot": {
                display: "none",
              },
            }}
          />
        </label>

        <Box className="image-preview" sx={{ display: "flex", justifyContent: "center", flexWrap: "wrap", mt: 2 }}>
          {files.map((file, index) => (
            <Box key={index} sx={{ m: 1 }}>
              {renderFilePreview(file)}
              <Typography variant="caption" sx={{ mt: 1, textAlign: "center" }}>{file.name}</Typography>
            </Box>
          ))}
        </Box>

        <Button
          variant="contained"
          onClick={handleUpload}
          fullWidth
          sx={{ backgroundColor: "#633687", color: "white", padding: "15px" }}
        >
          Enviar documento
        </Button>
      </Box>
    </Box>
  );
};

export default UploadImages;
