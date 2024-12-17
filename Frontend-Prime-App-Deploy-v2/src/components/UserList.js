import React, { useState } from "react";
import { Box, List, ListItem, ListItemText, IconButton } from "@mui/material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import AssignmentIcon from "@mui/icons-material/Assignment";
import FindInPageOutlinedIcon from '@mui/icons-material/FindInPageOutlined';
import MedicalServicesOutlinedIcon from "@mui/icons-material/MedicalServicesOutlined";
import { Dialog, DialogContent, DialogTitle, Typography } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';

const UserList = ({ users, onSendMessage, currentUser }) => {
  console.log("CurrentUser:", currentUser);

  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const [selectedUser, setSelectedUser] = useState(null);
  const [userImages, setUserImages] = useState([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const handleSendMessage = (phoneNumber) => {
    const message = "Olá, gostaria de mais informações sobre o seu cadastro."; // Mensagem padrão
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/55${phoneNumber.replace(/\D/g, '')}?text=${encodedMessage}`, '_blank');
  };

  const handleVerClick = (user) => {
    setSelectedUser(user);
  };

  const handleVerDoc = async (user) => {
    try {
      if (user.uploadsPath) {
        const images = user.uploadsPath.split(", ");
        setUserImages(images);
      } else {
        setUserImages([]);
      }
    } catch (error) {
      console.error("Erro ao obter imagens do usuário:", error);
    }
  };

  const handleVerAso = async (user) => {
    try {
      if (user.uploadsPathAso) {
        const images = user.uploadsPathAso.split(", ");
        setUserImages(images);
      } else {
        setUserImages([]);
      }
    } catch (error) {
      console.error("Erro ao obter imagens do usuário:", error);
    }
  };

  const openLightbox = (index) => {
    setSelectedImageIndex(index);
    setLightboxOpen(true);
  };

  const closeModal = () => {
    setSelectedUser(null);
    setUserImages([]);
  };

  // Verificar se currentUser está definido e possui a propriedade id_cnpj
  const isCurrentUserValid = currentUser && currentUser.id_cnpj;

  // Filtrar usuários apenas se o currentUser estiver definido e possuir a propriedade id_cnpj
  const filteredUsers = isCurrentUserValid
    ? users.filter((user) => user.id_cnpj === currentUser.id_cnpj)
    : users;

  return (
    <Box>
      <List>
        <ListItem
          sx={{
            display: isMobile ? "none" : "flex",
            justifyContent: "space-between",
            flexWrap: isMobile ? "wrap" : "nowrap",
          }}
        >
          <ListItemText
            sx={{ flexBasis: isMobile ? "100%" : "10%", flexGrow: 1 }}
          >
            ID
          </ListItemText>
          <ListItemText
            sx={{ flexBasis: isMobile ? "100%" : "20%", flexGrow: 1 }}
          >
            Nome
          </ListItemText>
          <ListItemText
            sx={{ flexBasis: isMobile ? "100%" : "15%", flexGrow: 1 }}
          >
            E-mail
          </ListItemText>
          <ListItemText
            sx={{ flexBasis: isMobile ? "100%" : "10%", flexGrow: 1 }}
          >
            Celular
          </ListItemText>
          <ListItemText
            sx={{ flexBasis: isMobile ? "100%" : "10%", flexGrow: 1 }}
          >
            Documentos
          </ListItemText>
          <ListItemText
            sx={{ flexBasis: isMobile ? "100%" : "10%", flexGrow: 1 }}
          >
            ASO
          </ListItemText>
          <ListItemText
            sx={{ flexBasis: isMobile ? "100%" : "10%", flexGrow: 1 }}
          >
            Status
          </ListItemText>
          <ListItemText
            sx={{ flexBasis: isMobile ? "100%" : "5%", flexGrow: 1 }}
          >
            Ver
          </ListItemText>
        </ListItem>
        {filteredUsers.map((user) => (
          <ListItem
            key={user.id}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              flexWrap: isMobile ? "wrap" : "nowrap",
              boxShadow: 3, borderRadius: 2
            }}
          >
            <ListItemText
              sx={{ flexBasis: isMobile ? "100%" : "10%", flexGrow: 1 }}
            >
              {user.iduser}
            </ListItemText>
            <ListItemText
              sx={{ flexBasis: isMobile ? "100%" : "20%", flexGrow: 1 }}
            >
              {user.nome}
            </ListItemText>
            <ListItemText
              sx={{ flexBasis: isMobile ? "100%" : "15%", flexGrow: 1 }}
            >
              {user.email}
            </ListItemText>
            <ListItemText
              sx={{ flexBasis: isMobile ? "100%" : "10%", flexGrow: 1 }}
            > {user.fone}
              <IconButton   sx={{
                 
                 color: "green",
                 borderRadius: 2,
               }}
            
                onClick={() => handleSendMessage(user.fone)}
              >
                <WhatsAppIcon />
              </IconButton>
            </ListItemText>
            <ListItemText
              sx={{ flexBasis: isMobile ? "100%" : "10%", flexGrow: 1 }}
            >
              <IconButton
                onClick={() => handleVerDoc(user)}
                sx={{
                  backgroundColor: "#633687",
                  color: "white",
                  borderRadius: 2,
                }}
              >
                <Typography color="white" variant="body2"> Ver documentos </Typography><AssignmentIcon />
              </IconButton>
            </ListItemText>
            <ListItemText
              sx={{ flexBasis: isMobile ? "100%" : "10%", flexGrow: 1 }}
            >
              <IconButton
                onClick={() => handleVerAso(user)}
                sx={{
                  backgroundColor: "#633687",
                  color: "white",
                  borderRadius: 2,
                }}
              >
                <Typography color="white" variant="body2">
                  Ver exames{" "}
                </Typography>
                <MedicalServicesOutlinedIcon />
              </IconButton>
            </ListItemText>
            <ListItemText
              sx={{ flexBasis: isMobile ? "100%" : "10%", flexGrow: 1 }}
            >
              {user.rg === null ? (
                <Typography  variant="body2"   sx={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: "red",
                  color: "white",
                  borderRadius: 2,
                  p:1
                }}><ErrorOutlineOutlinedIcon sx={{ paddingRight: "5px"}}/>
                  Cadastro Pendente
                </Typography>
              ) : user.uploadsPath === null ? (
                <Typography variant="body2" sx={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: "#F4D318",
                  color: "black",
                  borderRadius: 2,
                  p:1
                 
                }}><ErrorOutlineOutlinedIcon sx={{ paddingRight: "5px"}}/>
                  Doc pendentes
                </Typography>
              ) : user.uploadsPathAso === null ? (
                <Typography variant="body2" sx={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: "#69C5FF",
                  color: "white",
                  borderRadius: 2,
                  p:1
                }}><ErrorOutlineOutlinedIcon sx={{ paddingRight: "5px"}}/>
                  ASO Pendente
                </Typography>
              ) : (
                <Typography variant="body2" sx={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: "green",
                  color: "white",
                  borderRadius: 2,
                  p:1
                }}><CheckCircleOutlineOutlinedIcon sx={{ paddingRight: "5px"}} />
                  Processo concluído
                </Typography>
              )}
            </ListItemText>
            <ListItemText
              sx={{ flexBasis: isMobile ? "100%" : "5%", flexGrow: 1 }}
            >
              <IconButton
                onClick={() => handleVerClick(user)}
                sx={{
                 
                  color: "#633687",
                  borderRadius: 2,
                }}
              >
              <FindInPageOutlinedIcon />
              </IconButton>
            </ListItemText>
          </ListItem>
        ))}
      </List>

      {/* Modal de exibição de informações do usuário */}
      <Dialog open={selectedUser !== null} onClose={closeModal}>
        <DialogTitle>Informações pessoais do colaborador</DialogTitle>
        <DialogContent>
          {/* Modal de exibição de informações do usuário */}
          {selectedUser && (
            <div className="modal">
              <div
                className="modal-content"
                onClick={(e) => e.stopPropagation()}
              >
                <span className="close" onClick={closeModal}>
                  X
                </span>
                <h2>Informações pessoais do colaborador</h2>
                <p>
                  ID:<b> {selectedUser.iduser}</b>
                </p>
                <p>
                  Nome: <b> {selectedUser.nome}</b>
                </p>
                <p>
                  CPF: <b> {selectedUser.cpf}</b>
                </p>
                <p>
                  RG: <b> {selectedUser.rg}</b>
                </p>
                <p>
                  Gênero: <b> {selectedUser.genero}</b>
                </p>
                <p>
                  Dependentes: <b> {selectedUser.dependentes}</b>
                </p>
                <p>
                  Data de nascimento: <b> {selectedUser.data_nascimento}</b>
                </p>
                <p>
                  Data de início de processo: <b> {selectedUser.data}</b>
                </p>
                <p>
                  E-mail: <b> {selectedUser.email}</b>
                </p>
                <h2>
                  <b> Endereço</b>{" "}
                </h2>
                <p>
                  Rua: <b> {selectedUser.rua}</b>
                </p>
                <p>
                  Número: <b> {selectedUser.numero}</b>
                </p>
                <p>
                  Complemento: <b> {selectedUser.complemento}</b>
                </p>
                <p>
                  Cidade: <b> {selectedUser.cidade}</b>
                </p>
                <p>
                  Estado:<b> {selectedUser.estado}</b>
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal para exibir imagens do usuário */}
      <Dialog open={userImages.length > 0} onClose={closeModal}>
        <DialogTitle>Visualizar Documentos</DialogTitle>
        <DialogContent>
          {userImages.length > 0 && (
            <div className="modal">
              <div
                className="modal-content"
                onClick={(e) => e.stopPropagation()}
              >
                <span className="close" onClick={closeModal}>
                  X
                </span>
                <h2>Visualizar Documentos</h2>
                <div className="ImageGallery">
                  {userImages.map((path, index) => (
                    <img
                      key={index}
                      onClick={() => openLightbox(index)}
                      className="ImageGalleryItem"
                      src={`/api/${path.trim()}`}
                      alt={`Imagem ${index}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal de imagem ampliada */}
      {lightboxOpen && (
        <div className="modal" style={{ zIndex: 9999 }}>
          <div className="modalOpenImage" onClick={(e) => e.stopPropagation()}>
            <span className="close" onClick={() => setLightboxOpen(false)}>
              X
            </span>
            <img
              src={`/api/${userImages[selectedImageIndex]}`}
              alt={`Imagem Ampliada`}
            />
          </div>
        </div>
      )}
      <Dialog open={lightboxOpen} onClose={() => setLightboxOpen(false)}>
        <DialogContent>{/* Conteúdo do modal */}</DialogContent>
      </Dialog>
    </Box>
  );
};

export default UserList;
