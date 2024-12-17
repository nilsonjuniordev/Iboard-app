import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Grid, Button } from "@mui/material";
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

const UploadAso = () => {
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [uploadMessage, setUploadMessage] = useState("");
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

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
      const response = await axios.post(
        "/api/uploads/aso",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            UserId: userId, // Envie o userId no cabeçalho
          },
        }
      );
      console.log("Response:", response);
      setUploadMessage(
        <div className="alertGreen">
          Documento enviado com sucesso, selecione o próximo documento.
        </div>
      );
      setFiles([]); // Limpar os arquivos após o upload
      setTimeout(() => {
        navigate('/DashboardUser');
      }, 800);
    } catch (error) {
      console.error("Erro ao enviar as imagens:", error);
      setUploadMessage(
        <div className="alertRed">
          Erro ao enviar documento. Selecione um novo documento para ser enviado.
        </div>
      );
    }
  };

  const renderFileIcon = (file) => {
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
        Tire fotos nítidas de todos os exames solicitados, garanta que todas as informações estejam legíveis.
      </Typography>

      <Box sx={{ width: '100%', p: 3 }}>
        <label htmlFor="fileInput" className="custom-file-upload">
          <input
            type="file"
            id="fileInput"
            multiple
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
          <Typography align="center">Clique aqui para tirar fotos ou selecionar exames solicitados.</Typography>
          {uploadMessage && <Typography align="center">{uploadMessage}</Typography>}

          <Box sx={{ flexGrow: 1, width: '100%' }}>
            <Grid container spacing={0}>
              <Grid item xs={12} sm={12}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    p: 3
                  }}
                >
                  <img
                    src="/assets/updateAso.png"
                    alt="updateAso"
                    style={{ maxWidth: '50%', height: 'auto' }}
                  />
                </Box>
              </Grid>
            </Grid>
          </Box>

          <Box className="image-preview" sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', mt: 2 }}>
            {files.map((file, index) => (
              <Box key={index} sx={{ m: 1 }}>
                {renderFileIcon(file)}
                <Typography variant="caption" sx={{ mt: 1, textAlign: 'center' }}>{file.name}</Typography>
              </Box>
            ))}
          </Box>
        </label>

        <Button
          variant="contained"
          fullWidth
          onClick={handleUpload}
          sx={{ backgroundColor: "#633687", color: "white", mt: 2, padding: "15px" }}
        >
          Enviar Imagens
        </Button>
      </Box>
    </Box>
  );
};

export default UploadAso;
