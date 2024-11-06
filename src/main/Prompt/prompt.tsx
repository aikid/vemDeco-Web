import React, {useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from 'react-hook-form';
import { useAuth } from "../../context/AuthContext";
import NavBar from "../../utils/navbar/navbar";
import Loader from "../../utils/loader/loader";
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import ResumoRapidoService from "../../Service/resumo-rapido-service";
import "./prompt.css";
import CreateIcon from '@mui/icons-material/Create';
import StarIcon from '@mui/icons-material/Star';
import { Alert, Box, Button, Chip, Divider, Modal, Snackbar, Typography } from "@mui/material";
import { Add } from "@mui/icons-material";
import { IPromptRequest, PromptData } from "../../model/user/user-prompt-request";
import DashboardLayout from "../DashboardLayout/DashboardLayout";
import moment from "moment";

  const Prompt = () => {
    const [message, setMessage] = useState<string>("");
    const [selectedPrompt, setSelectedPrompt] = useState<string>("");
    const [selectedPromptID, setSelectedPromptID] = useState<string>("");
    const [prompts, setPrompts] = useState<PromptData[]>();
    const [logged, setLogged] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [load, setLoad] = useState<boolean>(false);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [open, setOpen] = React.useState(false);
    const [openSnack, setOpenSnack] = useState<boolean>(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    let navigate = useNavigate();
    const { user } = useAuth();

    const { register, handleSubmit, formState:{errors}, reset, setValue } = useForm({
      defaultValues: {
          prompt:"",
      },      
  });

    interface Column {
      id: '_id' | 'prompt' | 'default' | 'createdAt' | 'email' | 'actions';
      label: string;
      minWidth?: number;
      align?: 'left' | 'right' | 'center';
      format?: (value: number) => string;
    }
      
    //Para formatar um registro use: format: (value: number) => value.toFixed(2)
    const columns: Column[] = [
      { id: '_id', label: 'ID', minWidth: 50 },
      { id: 'prompt', label: 'Título', minWidth: 100 },
      { id: 'default', label: 'Status', minWidth: 50, align: 'center' },
      { id: 'createdAt', label: 'Data de criação', minWidth: 50, align: 'center' },
      { id: 'email', label: 'Criado por', minWidth: 150, align: 'center' },
      { id: 'actions', label: 'Opções', minWidth: 150, align: 'center' }
    ];
      
      
    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };
    
    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const savePrompt = async (data: IPromptRequest) => {
      try{
        setLoad(true);
        if(selectedPromptID){
          await ResumoRapidoService.updatePrompt(user.token, selectedPromptID, data);
          setLoad(false);
          setSelectedPromptID("");
          setSelectedPrompt("");
          setMessage('Prompt atualizado com sucesso');
          setOpen(false);
          setOpenSnack(true);
        }else{
          await ResumoRapidoService.savePromptData(user.token, data);
          setMessage('Prompt criado com sucesso');
          setOpen(false);
          setOpenSnack(true);
          setLoad(false);
        }
    }catch (e){
        setLoad(false);
        console.log('Erro encontrado:', e);
    }
    }

    const handleCloseSnack = (event?: React.SyntheticEvent | Event, reason?: string) => {
      if (reason === 'clickaway') {
        return;
      }
      setOpenSnack(false);
      reset();
      window.location.reload()
    };

    const handleEdit = (id: string, prompt: string) => {
      setSelectedPromptID(id);
      setSelectedPrompt(prompt);
      handleOpen();
    };
    
    const handleSetDefault = async(id: string) => {
      try{
        await ResumoRapidoService.setDefaultPrompts(user.token, id);
        setMessage('Prompt atualizado para padrão');
        setOpenSnack(true);
      }catch(e){
        console.log('Erro encontrado:', e);
      }
    };

    const truncateText = (text: string, maxLength: number) => {
      return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    };

    useEffect(() => {
      setValue("prompt", selectedPrompt);
    }, [selectedPrompt,selectedPromptID, setValue]);    

    
    useEffect(()=>{
      const getUserPromptsData = async(): Promise<void> =>{
        try{
            if(user.token){
                let response = await ResumoRapidoService.getUserPrompts(user.token);
                if(response && response.data){
                  setPrompts(response.data);
                }
            }
        }catch (e){
            console.log('Erro encontrado:', e);
        }
      }
      getUserPromptsData();
    },[user.token])
  
  
    return (
      <DashboardLayout title="Prompt">
        <div className="promptContainer">
            <div className="promptActions">
              <Button className="btAddPrompt" onClick={handleOpen}>+ Novo</Button>
            </div>
            <Paper sx={{ width: '95%', overflow: 'hidden', marginTop: 5 }}>
                <div className="promptTableHeader">
                  <div className="promptDescription">
                    <h3 className="titlePlan">Prompts</h3>
                    <p className="subtitlePlan">Veja todos os seus prompts criados</p>
                  </div>
                </div>
                <Divider/>
                <TableContainer sx={{ maxHeight: 440 }}>
                    <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                        {columns.map((column) => (
                            <TableCell
                            key={column.id}
                            align={column.align}
                            style={{ minWidth: column.minWidth }}
                            >
                            {column.label}
                            </TableCell>
                        ))}
                        </TableRow>
                    </TableHead>
                    {prompts && prompts.length > 0 &&
                      <TableBody>
                        {prompts
                          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                          .map((row: PromptData) => {
                            return (
                              <TableRow hover role="checkbox" tabIndex={-1} key={row._id}>
                                {columns.map((column) => {
                                  if (column.id === 'actions') {
                                    return (
                                      <TableCell key={column.id} align={column.align}>
                                        <div className="buttonTableContainer">
                                          <Button
                                            className="editButton"
                                            onClick={() => handleEdit(row._id, row.prompt)}
                                          >
                                            <CreateIcon />
                                          </Button>
                                        </div>
                                      </TableCell>
                                    );
                                  }
                                  const value = row[column.id];
                                  if (column.id === 'default') {
                                    return (
                                      <TableCell key={column.id} align={column.align}>
                                        {
                                          <button onClick={() => handleSetDefault(row._id)} className={value ? 'defaultPBtn pointGreen' : 'defaultPBtn pointRed'}>{value ? 'Padrão' : 'Desativado'}</button>
                                        }
                                      </TableCell>
                                    );
                                  }
                                  if (column.id === 'createdAt') {
                                    return (
                                      <TableCell key={column.id} align={column.align}>
                                        {column.id === 'createdAt' && typeof value === 'string' ? moment(value).format('DD/MM/YYYY') : 'N/D'}
                                      </TableCell>
                                    );
                                  }
                                  return (
                                    <TableCell key={column.id} align={column.align}>
                                      {
                                        column.id === 'prompt' && typeof value === 'string' ? truncateText(value, 40) : value
                                      }
                                    </TableCell>
                                  );
                                })}
                              </TableRow>
                            );
                          })}
                      </TableBody>
                    }
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[10, 25, 100]}
                    component="div"
                    count={prompts ? prompts.length : 0}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
            
        </div>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box className="modalContent">
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Adicionar Novo Prompt
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              <form className="mobileLoginForm" onSubmit={handleSubmit((data)=>{savePrompt(data)})}>
                <textarea className="promptInModal"  placeholder="Edite seu prompt aqui..." {...register("prompt", {required: 'O Prompt é obrigatório', minLength: {value: 80, message: "O prompt deve ter no mínimo 80 caracteres."}})}></textarea>
                <p className="errorMsg">{errors.prompt?.message?.toString()}</p>
                {!load ? (
                    <button className="modalFormButton" type="submit" onClick={()=> handleSubmit}>Salvar Prompt</button>
                ):(
                    <button className="modalFormButton formButtonLoad" type="submit" disabled>Aguarde...</button>
                )}
              </form>
            </Typography>
          </Box>
        </Modal>
        <Snackbar open={openSnack} autoHideDuration={3000} onClose={handleCloseSnack} anchorOrigin={{ vertical: 'top', horizontal: 'left' }}>
            <Alert onClose={handleCloseSnack} severity="success" variant="filled" sx={{ width: '100%' }}>
                {message}
            </Alert>
        </Snackbar>
      </DashboardLayout>
    );
  };
  
  export default Prompt;