
import { useState, useEffect } from "react"
import axios from 'axios'
import{
  createBrowserRouter,
  RouterProvider,
  Link, 
  useParams
}from 'react-router-dom' 

const App = () =>
{ 
  var [lista, setLista ] = useState([]) 

  const buscarDados = async ()=>{
      var url = "https://rickandmortyapi.com/api/character/"
      await axios.get(url)             
          .then(retorno =>{ 
                    var dados = retorno.data.results
                    setLista(dados)})}
  useEffect(() => {
    buscarDados(); 
  }, []);
  
  const Personagem = lista.map((item)=> {   
    return(
      <div>
        <Link to={item.name}>• {item.name}</Link><br/>        
      </div>                
    )
  })

  const Home = () =>{
    return(
      <div>
        <h2>Home</h2>        
        {Personagem}
        <br/>
      </div>
    )
  }
  const Selecionado = () =>{
    const { id } = useParams();
    return(
      <div>
        <Link to="/">home</Link><br/>
        <h2>Nome: <br/>
        < span>{ id }</span></h2>
      </div>
    )
  }
  
  const rotas = new createBrowserRouter([ //lista de rotas
    {
      path: "/",
      element: (
        <Home/>
      )
    },
    {
      path: "/:id",
      element: (
        <Selecionado/>
      )
    }
  ])  

  return(
    <RouterProvider
      router={rotas}
    />
    
  ) 
}
  
export default App;