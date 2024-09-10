
import { useState, useEffect } from "react"
import axios from 'axios'
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';


const App = () =>
{
  var [lista, setLista ] = useState([])

  const buscarDados = async ()=>{ 

    const urlPersonagens = "https://rickandmortyapi.com/api/character/";
      const responsePersonagens = await axios.get(urlPersonagens);
      const dadosPersonagens = responsePersonagens.data.results;

      const personagensComEpisodios = await Promise.all(dadosPersonagens.map(async (personagem) => {
        let primeiroEpisodioNome = '';

        const episodioURL = personagem.episode[0];
        if (episodioURL) {
          const episodioResponse = await axios.get(episodioURL);
          primeiroEpisodioNome = episodioResponse.data.name;
        }

        return { ...personagem, episodio: primeiroEpisodioNome };
      }));

      setLista(personagensComEpisodios);
  
    }

  useEffect(() => {
    buscarDados(); 
  }, []);
  
  const novo_html = lista.map((item)=> {   
    return(   

      <Box component="span" sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}>
        <Card sx={{ minWidth: 275 }}>
        <CardContent>

          <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
              <img src={item.image} width="150" height="150" /> <br/>
          </Typography>

          <Typography variant="h5" component="div">
          •  {item.name} <br/>
          </Typography>

          <Typography sx={{ color: 'text.secondary', mb: 1.5 }}>
          status: {item.status} <br/>
          </Typography>

          <Typography variant="body2">
          Ultima localização conhecida: {item.location.name} <br/>          
          </Typography>

          <Typography variant="body2">
          primeira aparição: {item.episodio} <br/>           
          </Typography>

        </CardContent>      
      </Card>
    </Box>
    
    )
  })
  
  return(  
    <div>        
      {novo_html}
    </div>      
  )  
}
  
export default App;