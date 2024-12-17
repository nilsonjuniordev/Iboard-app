import UploadDocuments from "../components/UploadDocuments";
import SideBarUser from "../components/SideBarUser";
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material';


const Upload = () => {
  const theme = useTheme();
  return (

  <>
  <SideBarUser /> 
      <Box
        component="main"
        sx={{
          marginTop: 10, // Margem para o AppBar
          [theme.breakpoints.down('sm')]: {
            marginTop: 8, // Reduz a margem para dispositivos móveis
          },
        }}
      >   


      <UploadDocuments />    
     </Box>
  </>
 );

};


export default Upload;
