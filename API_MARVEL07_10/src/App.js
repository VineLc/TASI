import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, Outlet} from 'react-router-dom';
import axios from 'axios';
import Box from '@mui/material/Box';  
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CryptoJS from 'crypto-js';

const Login = ({ callback }) => {
  const [dados, setDados] = useState({ usuario: "", senha: "" });

  const handleSubmit = () => {
    callback(dados);
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

      <button type="button" onClick={handleSubmit}>Login</button>
    </div>
  );
};

const Dashboard = () => {

  const [name, setName] = useState('');
  const [personagens, setPersonagens] = useState([]);

  const buscarItens = async () => {
    const publicKey = 'a04721c6f4d4481752af3110c2a9efb0';
    const privateKey = '1f4de25eacd3c681f351e198108d0dcd06451fdb';
    const ts = Date.now();
    const hash = CryptoJS.MD5(ts + privateKey + publicKey).toString();

    const url = `https://gateway.marvel.com/v1/public/characters?nameStartsWith=${name}&ts=${ts}&apikey=${publicKey}&hash=${hash}`;

    try {
      const retorno = await axios.get(url);
      setPersonagens(retorno.data.data.results);
    } catch (error) {
      console.error("Erro ao buscar personagens:", error);
    }
  };  

  const dados = personagens.map(linha => {
  const imageUrl = `${linha.thumbnail.path}.${linha.thumbnail.extension}`;

    return (
      <Box key={linha.id} sx={{display: 'inline-block'}}>
        <Card >
          <CardContent>
            <img src={imageUrl} alt={linha.name} style={{ width: '25%' }} />
            <Typography variant="h6">{linha.name}</Typography>
          </CardContent>
        </Card>
      </Box>
    );
  });

  return (
    <div style={{ flexGrow: 1, padding: 20 }}>
      
      <input 
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Digite o nome do personagem"
      />
      <button  onClick={buscarItens}>
        <span >Buscar Personagens</span>
      </button>
      {dados}
    </div>
  );

};

const RotasPrivadas = () => {
  const auth = localStorage.getItem("MEU_SITE");
  return auth ? <Outlet /> : <Navigate to="/login" />;
};

const App = () => {
  const [autenticado, setAuthentication] = useState(false);

  const EfetuaLogin = (dados) => {
    if (dados.usuario === "010621013" && dados.senha === "010621013") {
      localStorage.setItem("MEU_SITE", true); 
      setAuthentication(true); 
      window.location = "/dashboard"; 
    } else {
      console.log("USUÁRIO E OU SENHA INVÁLIDOS"); 
    }
  };

  const Deslogar = () => {
    localStorage.removeItem("MEU_SITE"); 
    setAuthentication(false); 
  };

  useEffect(() => {
    VerificaLogin();
  }, []);

  const VerificaLogin = () => {
    const auth = localStorage.getItem("MEU_SITE");
    setAuthentication(!!auth);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login callback={EfetuaLogin} />} />        
        <Route element={<RotasPrivadas />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
