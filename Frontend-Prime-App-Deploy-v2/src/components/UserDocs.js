import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Button, Typography, Grid } from '@mui/material';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ImageIcon from '@mui/icons-material/Image';
import { FaFileExcel, FaFileWord } from 'react-icons/fa'; // Ícones do react-icons


const getFileIcon = (fileType) => {
  switch (fileType) {
    case 'pdf':
      return <PictureAsPdfIcon color="error" sx={{ fontSize: 100 }} />;
    case 'jpeg':
    case 'jpg':
    case 'png':
    case 'gif':
      return <ImageIcon color="primary" sx={{ fontSize: 100 }} />;
    case 'xls':
    case 'xlsx':
      case 'csv':
      return <FaFileExcel color="green" size={100} />;
    case 'doc':
    case 'docx':
      return <FaFileWord color="blue" size={100} />;
    default:
      return <InsertDriveFileIcon color="action" sx={{ fontSize: 100 }} />;
  }
};

const UserDocs = () => {
  const [userData, setUserData] = useState({
    iduser: null,
    nome: "",
    email: "",
    fone: "",
    cpf: "",
    rg: "",
    cep: "",
    rua: "",
    numero: "",
    complemento: "",
    cidade: "",
    estado: "",
    civil: "",
    genero: "",
    dependentes: "",
    data_nascimento: "",
  });
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const uploadsPathImages = userData.uploadsPath ? userData.uploadsPath.split(", ") : [];
  const uploadsPathAsoImages = userData.uploadsPathAso ? userData.uploadsPathAso.split(", ") : [];

  const openLightboxPath = (index) => {
    setLightboxOpen(true);
    setSelectedImageIndex(index);
  };


  useEffect(() => {
    // Carregar dados do usuário ao montar o componente
    const userId = localStorage.getItem("userId");

    const fetchUserData = async () => {
      try {
        const response = await axios.get(`/api/${userId}`);
        setUserData(response.data);
      } catch (error) {
        console.error("Erro ao obter dados do usuário:", error);
      }
    };

    fetchUserData();
  }, []); // Executa uma vez ao montar o componente

  const handleFileClick = (path) => {
    const fileType = path.split('.').pop().toLowerCase();
    if (fileType === 'pdf') {
      window.open(`/api/${path.trim()}`, '_blank');
    } else {
      const link = document.createElement('a');
      link.href = `/api/${path.trim()}`;
      link.download = path.split('/').pop();
      link.click();
    }
  };

  const renderFilePreview = (path, isAso) => {
    const fileType = path.split('.').pop().toLowerCase();
    const fileName = path.split('/').pop();

    if (fileType === 'pdf') {
      return (
        <Grid item xs={12} sm={6} md={4} lg={3} key={path}>
          <div className="FileGalleryItem" onClick={() => handleFileClick(path)}>
            <PictureAsPdfIcon color="error" sx={{ fontSize: 100 }} />
            <Typography variant="caption" sx={{ textAlign: 'center', mt: 1 }}>{fileName}</Typography>
          </div>
        </Grid>
      );
    } else if (['jpeg', 'jpg', 'png', 'gif'].includes(fileType)) {
      return (
        <Grid item xs={12} sm={6} md={4} lg={3} key={path}>
          <div className="FileGalleryItem">
            <img
              src={`/api/${path.trim()}`}
              alt={`Imagem`}
              style={{ maxWidth: '100%', height: 'auto', cursor: 'pointer' }}
              onClick={() => openLightboxPath(isAso ? uploadsPathAsoImages.indexOf(path) : uploadsPathImages.indexOf(path))}
            />
            <Typography variant="caption" sx={{ textAlign: 'center', mt: 1 }}>{fileName}</Typography>
          </div>
        </Grid>
      );
    } else {
      return (
        <Grid item xs={12} sm={6} md={4} lg={3} key={path}>
          <div className="FileGalleryItem" onClick={() => handleFileClick(path)}>
            {getFileIcon(fileType)}
            <Typography variant="caption" sx={{ textAlign: 'center', mt: 1 }}>{fileName}</Typography>
          </div>
        </Grid>
      );
    }
  };

  const handleDeleteConfirmation = async (confirmed) => {
    setShowConfirmation(false);

    if (confirmed) {
      try {
        // Exclui todos os caminhos associados aos campos uploadsPath e uploadsPathAso
        const userId = localStorage.getItem("userId");
        await axios.delete(`/api/uploads/${userId}`);
        await axios.delete(`/api/uploadsAso/${userId}`);

        // Recarrega a página para atualizar os dados do usuário
        window.location.reload();

        // Atualiza os dados do usuário após a exclusão
        const response = await axios.get(`/api/${userId}`);
        setUserData(response.data);
        console.log("Caminhos das imagens removidos com sucesso.");
      } catch (error) {
        // Exibe mensagem de erro ao usuário
        console.error("Erro ao remover caminhos das imagens:", error);
        setDeleteError(
          "Erro ao excluir caminhos das imagens. Tente novamente."
        );
      }
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center">
      <Box sx={{ width: '100%', p: 3, typography: 'body1' }}>
        <Typography variant="h5" gutterBottom>
          Meus Documentos
        </Typography>
        <Typography paragraph>
          Gerencie seus documentos enviados. Se necessário, você pode excluí-los
          todos e reenviá-los individualmente conforme solicitado.
        </Typography>
        {(userData.uploadsPath || userData.uploadsPathAso) && (
          <div>
            <Grid container spacing={2}>
              {userData.uploadsPath && userData.uploadsPath.split(", ").map((path, index) => (
                renderFilePreview(path, false)
              ))}

              {userData.uploadsPathAso && userData.uploadsPathAso.split(", ").map((path, index) => (
                renderFilePreview(path, true)
              ))}
            </Grid>

            {lightboxOpen && (
              <div className="Lightbox">
                <span
                  className="CloseButton"
                  onClick={() => setLightboxOpen(false)}
                >
                  Fechar
                </span>
                <img
                  src={`/api/${
                    selectedImageIndex < uploadsPathImages.length
                      ? uploadsPathImages[selectedImageIndex].trim()
                      : uploadsPathAsoImages[selectedImageIndex - uploadsPathImages.length].trim()
                  }`}
                  alt={`Imagem ${selectedImageIndex}`}
                  style={{ maxWidth: '80%', height: 'auto' }}
                />
              </div>
            )}
            <Button
              variant="contained"
              onClick={() => setShowConfirmation(true)}
              style={{ backgroundColor: '#633687', color: 'white' }}
            >
              Excluir Documentos
            </Button>
          </div>
        )}
        {!userData.uploadsPath && !userData.uploadsPathAso && (
          <Typography color="error">
            Você ainda não enviou seus documentos. Favor enviar os documentos solicitados em "Enviar documentos".
          </Typography>
        )}
        {showConfirmation && (
          <div>
            <Typography color="error">
              Ao realizar a exclusão, será necessário reenviar todos os documentos novamente. <br />Tem certeza que deseja excluir todos os documentos?
            </Typography>
            <Button
              style={{ backgroundColor: '#633687', color: 'white', margin: '5px' }}
              onClick={() => handleDeleteConfirmation(true)}
            >
              Sim
            </Button>
            <Button
              style={{ backgroundColor: '#633687', color: 'white', margin: '5px' }}
              onClick={() => handleDeleteConfirmation(false)}
            >
              Não
            </Button>
          </div>
        )}
        {deleteError && <Typography color="error">{deleteError}</Typography>}
      </Box>
    </Box>
  );
};

export default UserDocs;
