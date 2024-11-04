import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate,useNavigate, Outlet } from 'react-router-dom';
import axios from 'axios';
//--------------------
import Box from '@mui/material/Box';  
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

const API_URL = 'https://backend-aula.vercel.app';


const Login = ({ callback }) => {
  const [dados, setDados] = useState({ usuario: "", senha: "" });
  const [mensagem, setMensagem] = useState("");

  const navigate = useNavigate();

  const handleRegister = () => {
    navigate('/registro'); 
  };
  const handleSubmit = async () => {
    try {
      const response = await axios.post(`${API_URL}/app/login`, dados);
      
      if (response.status === 200) {
        if (response.data.erro) {
          setMensagem(response.data.erro); 
        } else {
          const { token } = response.data; 
          localStorage.setItem("token", token);
          callback(response.data);
          navigate('/busca'); 
        }
      }

    } catch (error) {
      setMensagem("Erro ao fazer login.");
      console.error("Erro ao fazer login:", error);
    }
  };

  return (
    <div style={{
      background: "#000",
      color: "#fff",
      textAlign: "center",
      position: "absolute",
      top: "30%",
      left: "30%",
      padding: "100px"
    }}>
      <input 
        type="text"
        placeholder="Usuário:"
        value={dados.usuario}
        onChange={(e) => setDados({ ...dados, usuario: e.target.value })}
      />
      <br/>

      <input 
        type="password"
        placeholder="Senha:"
        value={dados.senha}
        onChange={(e) => setDados({ ...dados, senha: e.target.value })}
      />
      <br/>
      <button type="button" onClick={handleRegister}>Registrar-se</button>
      <button type="button" onClick={handleSubmit}>Login</button>      
      {mensagem && <p>{mensagem}</p>}
    </div>
  );
};
const Registro = ({ callback }) => {
  const [dados, setDados] = useState({ usuario: "", senha: "", confirma: "" });
  const [mensagem, setMensagem] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async () => {
    if (dados.senha !== dados.confirma) {
      setMensagem("As senhas não coincidem.");
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/app/registrar`, {
        usuario: dados.usuario,
        senha: dados.senha,
        confirma: dados.confirma,
      });      
      if (response.status === 200) {        
        if (response.data.erro) {
          setMensagem(response.data.erro); 
        } else {
          const { token } = response.data; 
          localStorage.setItem("token", token);
          callback(response.data);
          navigate('/produto'); 
        }          
      }
    } catch (error) {
      setMensagem("Erro ao fazer o registro.");
      console.error("Erro ao fazer o registro:", error);
    }
  };

  return (
    <div style={{
      background: "#000",
      color: "#fff",
      textAlign: "center",
      position: "absolute",
      top: "30%",
      left: "30%",
      padding: "100px"
    }}>
      <input 
        type="text"
        placeholder="Usuário:"
        value={dados.usuario}
        onChange={(e) => setDados({ ...dados, usuario: e.target.value })}
      />
      <br/>

      <input 
        type="password"
        placeholder="Senha:"
        value={dados.senha}
        onChange={(e) => setDados({ ...dados, senha: e.target.value })}
      />
      <br/>

      <input 
        type="password"
        placeholder="Confirme a Senha:"
        value={dados.confirma}
        onChange={(e) => setDados({ ...dados, confirma: e.target.value })}
      />
      <br/>

      <button type="button" onClick={handleSubmit}>Registrar-se</button>   
      {mensagem && <p>{mensagem}</p>}
    </div>
  );
};
const RotasPrivadas = () => {
  const auth = localStorage.getItem("MEU_SITE");
  return auth ? <Outlet /> : <Navigate to="/login" />;
};
const Criar = ({ callback }) => {  
  const [dados, setDados] = useState({ nome: "", quantidade: "", preco: "" , descricao: "" , imagem: "" });
  const [mensagem, setMensagem] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token"); 

  const back = async () => { 
    navigate('/');
  } 
  const handleSubmit = async () => {    

    try {
        const response = await axios.post(`${API_URL}/app/produtos`, {
        nome: dados.nome,
        quantidade: dados.quantidade,
        preco: dados.preco,
        descricao: dados.descricao,
        imagem: dados.imagem,
        },{headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data.error) {
          setMensagem(response.data.error);
        } else {
          setMensagem("Item cadastrado com sucesso!");          
          setTimeout(() => navigate('/'), 2000);
        }
      } catch (error) {
        const errorMessage = error.response?.data?.error || "Erro ao cadastrar. Tente novamente.";
        setMensagem(errorMessage);
        console.error("Erro ao Cadastrar:", error);
      }
  };

  return (
    <div style={{
      background: "#000",
      color: "#fff",
      textAlign: "center",
      position: "absolute",
      top: "30%",
      left: "30%",
      padding: "100px"
    }}>
      <input 
        type="text"
        placeholder="Produto:"
        value={dados.nome}
        onChange={(e) => setDados({ ...dados, nome: e.target.value })}
      />
      <br/>
      <input 
        type="text"
        placeholder="Quantidade:"
        value={dados.quantidade}
        onChange={(e) => setDados({ ...dados, quantidade: e.target.value })}
      />
      <br/>
      <input 
        type="text"
        placeholder="Preço:"
        value={dados.preco}
        onChange={(e) => setDados({ ...dados, preco: e.target.value })}
      />  
      <br/>
      <input 
        type="text"
        placeholder="Descrição:"
        value={dados.descricao}
        onChange={(e) => setDados({ ...dados, descricao: e.target.value })}
      />
      <br/>
      <input 
        type="text"
        placeholder="Imagem:"
        value={dados.imagem}
        onChange={(e) => setDados({ ...dados, imagem: e.target.value })}
      />
      <br/>

      <button type="button" onClick={back}>Voltar</button>   
      <button type="button" onClick={handleSubmit}>Enviar</button>  
      {mensagem && <p>{mensagem}</p>}
    </div>
  );
};
const Busca = ({ callback }) => {
  const [name, setName] = useState('');
  const [produtos, setProdutos] = useState([]);
  const navigate = useNavigate();

  const back = async () => { 
    navigate('/');
  }

    const buscarItens = async () => {
    const token = localStorage.getItem("token"); 
    try {
      const retorno = await axios.get(`${API_URL}/app/produtos`, {
        headers: {
          Authorization: `Bearer ${token}` 
        }
      });
      setProdutos(retorno.data); 
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
    }
  };

  const dados = Array.isArray(produtos) && produtos.length > 0 ? produtos.map(linha => {
  const imageUrl = linha.imagem;
  
    return (
      <Box key={linha._id} sx={{ display: 'inline-block', margin: 1 }}>
        <Card>
          <CardContent>            
            <Typography variant="h3">{linha.nome}</Typography> <br/> 
            <Typography variant="h7">Descrição: {linha.descricao}</Typography> <br/> 
            <Typography variant="h7">Quantidade: {linha.quantidade}</Typography>  <br/>            
            <Typography variant="h4">Preço: R$ {linha.preco}</Typography> <br/> 
            <Typography variant="h7">ID:{linha._id}</Typography> <br/>  
            {imageUrl && (
            <img 
              src={imageUrl} 
              alt={linha.nome} 
              style={{ width: '70%', objectFit: 'cover', maxHeight: '250px', }} 
            />
          )}
            </CardContent>
        </Card>
      </Box>
    );
  }) : (
    <Typography variant="body1">Nenhum produto encontrado.</Typography>
  );

  return (
    <div style={{ flexGrow: 1, padding: 20 }}>
      
      <button onClick={back}>
        <span>Voltar</span>
      </button>

      <button onClick={buscarItens}>
        <span>Buscar Produtos</span>
      </button>

      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {dados}
      </div>
    </div>
  );
};
const Alterar = ({ callback }) => {
  const [dados, setDados] = useState({ id: "", nome: "", quantidade: "", preco: "" , descricao: "" , imagem: "" });
  const [mensagem, setMensagem] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token"); 

  const back = async () => { 
    navigate('/');
  } 
  const handleSubmit = async () => {    

    try {
        const response = await axios.put(`${API_URL}/app/produtos`, {
        id: dados.id,
        nome: dados.nome,
        quantidade: dados.quantidade,
        preco: dados.preco,
        descricao: dados.descricao,
        imagem: dados.imagem,
      },{headers: { Authorization: `Bearer ${token}` }});

        setMensagem("Item Editado com sucesso!");
      
    } catch (error) {
      setMensagem("Erro ao editar. Tente novamente.");      
    }
  };

  return (
    <div style={{
      background: "#000",
      color: "#fff",
      textAlign: "center",
      position: "absolute",
      top: "30%",
      left: "30%",
      padding: "100px"
    }}>
      <input 
        type="text"
        placeholder="ID:" 
        value={dados.id}
        onChange={(e) => setDados({ ...dados, id: e.target.value })}
      />
      <br/>
      <input 
        type="text"
        placeholder="Produto:"
        value={dados.nome}
        onChange={(e) => setDados({ ...dados, nome: e.target.value })}
      />
      <br/>
      <input 
        type="text"
        placeholder="Quantidade:"
        value={dados.quantidade}
        onChange={(e) => setDados({ ...dados, quantidade: e.target.value })}
      />
      <br/>
      <input 
        type="text"
        placeholder="Preço:"
        value={dados.preco}
        onChange={(e) => setDados({ ...dados, preco: e.target.value })}
      />  
      <br/>
      <input 
        type="text"
        placeholder="Descrição:"
        value={dados.descricao}
        onChange={(e) => setDados({ ...dados, descricao: e.target.value })}
      />
      <br/>
      <input 
        type="text"
        placeholder="Imagem:"
        value={dados.imagem}
        onChange={(e) => setDados({ ...dados, imagem: e.target.value })}
      />
      <br/>

      <button type="button" onClick={back}>Voltar</button>   
      <button type="button" onClick={handleSubmit}>Enviar</button>  
      {mensagem && <p>{mensagem}</p>}
    </div>
  );
};
const Delete = ({ callback }) => {
  const [id, setId] = useState("");
  const [mensagem, setMensagem] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token"); 

  const back = async () => { 
    navigate('/');
  } 
  const handleSubmit = async () => {    
    try {      
      const response = await axios.delete('https://backend-aula.vercel.app/app/produtos', {
        data: { id: id }, 
        headers: { Authorization: `Bearer ${token}` }
      }); 
            
        setMensagem("Item deletado com sucesso!"); 
    } catch (error) {
      setMensagem("Erro ao deletar. Tente novamente.");
    }
    
  };

  return (
    <div style={{
      background: "#000",
      color: "#fff",
      textAlign: "center",
      position: "absolute",
      top: "30%",
      left: "30%",
      padding: "100px"
    }}>
      <input 
        type="text"
        placeholder="ID:" 
        value={id}
        onChange={(e) => setId(e.target.value)}
      />
      <br/>

      <button type="button" onClick={back}>Voltar</button>   
      <button type="button" onClick={handleSubmit}>Excluir</button>  
      {mensagem && <p>{mensagem}</p>}
    </div>
  );
};
const Principal = ({ callback }) => {
  
  const navigate = useNavigate();

  const Create = async () => { 
    navigate('/novo'); 
  };
  const Read = async () => { 
    navigate('/buscar'); 
  };
  const Update = async () => { 
    navigate('/alterar'); 
  };
  const Delete = async () => { 
    navigate('/deletar'); 
  };
  const Deslogar = () => {
    localStorage.removeItem("token");
    navigate('/login');
  };

  return (
    <div style={{
      background: "#000",
      color: "#fff",
      textAlign: "center",
      position: "absolute",
      top: "30%",
      left: "30%",
      padding: "100px"
    }}>     

      <button type="button" onClick={Create}>Novo</button><br/>
      <button type="button" onClick={Read}>Buscar</button><br/>
      <button type="button" onClick={Update}>Alterar</button><br/>
      <button type="button" onClick={Delete}>Deletar</button><br/><br/>
      <button type="button" onClick={Deslogar}>Deslogar</button>
    </div>
  );
};
const App = () => {
  const [autenticado, setAuthentication] = useState(false);

  const EfetuaLogin = (dados) => {
    localStorage.setItem("MEU_SITE", true); 
    setAuthentication(true);
    window.location = "/";
  };
  

  useEffect(() => {
    VerificaLogin();
  }, []);

  const VerificaLogin = () => {
    const auth = localStorage.getItem("token");
    setAuthentication(!!auth);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login callback={EfetuaLogin} />} />      
        <Route path="/registro" element={<Registro callback={Registro} />} /> 
            
        <Route element={<RotasPrivadas />}>
                    <Route path="/" element={<Principal callback={Principal} />} />
                    <Route path="/novo" element={<Criar callback={Criar} />} />
                    <Route path="/buscar" element={<Busca callback={Busca} />} />
                    <Route path="/alterar" element={<Alterar callback={Alterar} />} />
                    <Route path="/deletar" element={<Delete callback={Delete} />} />
                    
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
