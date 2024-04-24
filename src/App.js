import { useEffect, useState } from "react";
import Star from "./star";


const average = (arr) =>
arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);
const key = "b18c38ae"
export default function App() {
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError,setIsError] = useState('');
  const [query, setQuery] = useState("");
  const [selectedId ,setSelectedId] =useState(null)

  function handleSelect(id){
    setSelectedId((selectedId) => id=== selectedId ? null : id)
  }
  function handleClose(){
    setSelectedId(null)
  }
  function handleAddWatch(movie){
    setWatched(watched => [...watched,movie])
  }
  function handleDeleteWatch(id){
    setWatched(watched => watched.filter(movie => movie.imdbID !== id))
  }
 useEffect(function(){
 localStorage.setItem("watched",JSON.stringify(watched))
 },[watched])
  useEffect(function(){
    document.addEventListener('keydown',function(e){
        if(e.code === "Escape"){
          handleClose()
        }
    })
  },[])
   useEffect(function (){
    
    async function fetchAwait (){
     try{ setIsLoading(true)
      setIsError('')
     const res = await fetch(`https://www.omdbapi.com/?apikey=b18c38ae&s=${query}`)
     if(!res.ok) throw new Error("Smotehing")
     
      const data = await res.json();
      if(data.Response === "False") throw new Error("Movie Not Found")
      setMovies(data.Search)
      setIsError("")
     
      setIsLoading(false)} catch (err){
        console.error(err.message)
       
        
      }finally{
        setIsLoading(false);
      }
     }
     if(query.length <3){
      setMovies([]);
      setIsError('');
      return;
     }
     fetchAwait()

   
   },[query])

  
 
    return (
      <>
       <Navbar>
            
            <Search query={query} setQuery={setQuery}/>
            <NumResult movie={movies}/>
       </Navbar>
        <Main >
          
          <Box>
          {/* {isLoading ? <Loader/> :<MovieList movies={movies}/>} */}
          {isLoading && <Loader/>}
          {!isLoading && !isError&& <MovieList movies={movies} onSelectMovie={handleSelect}/>}
          {isError && <ErrorMessage message={isError}/>}
          </Box>
          <Box>
          {selectedId ? 
          <MovieDetail 
          onCloseMovie={handleClose} 
          selectedId={selectedId} 
          onWatch={handleAddWatch}
          watched={watched}/> :
          <><WatchSummary watched={watched} />
         <WatchList watched={watched} onDeleteWatched={handleDeleteWatch}/></>}
          </Box>
        </Main>
        
      </>
    );
  }
  function MovieDetail({selectedId,onCloseMovie,onWatch,watched}){
    const [movie,setMovie] = useState({})
    const [loading ,setLoading] = useState(false)
    const [userRating,setUserRating]=useState('')
    const isWatched = watched.map(movie => movie.imdbID).includes(selectedId);
    const watchedUserRating = watched.find(movie => movie.imdbID === selectedId)?.userRating;
    const{
      Title:title,
      Year:year,
      Poster:poster,
      Runtime:runtime,
      imdbRating,
      Plot:plot,
      Released:realeased,
      Actors:actors,
      Director:director,
      Genre:genre,
    }=movie;
    function handleAdd(){
      const newMovie = {
        imdbID : selectedId,
        title,
        year,
        poster,
        imdbRating:Number(imdbRating),
        runtime: Number(runtime.split(" ").at(0) ),
        userRating,
      }
      onWatch(newMovie);
      onCloseMovie();
    }
    useEffect(function(){
      

      async function getMovieDetails(){
        setLoading(true)
        const res = await fetch(`https://www.omdbapi.com/?apikey=b18c38ae&i=${selectedId}`)
        const data = await res.json();
        setMovie(data)
        setLoading(false)
        
      }
      getMovieDetails()
    },[selectedId])
    useEffect(function (){
      document.title =`Movie | ${title}`;
      return function(){
        document.title="useMovie"
      }
    },[title])
    
    return <div className="details">
      {loading ?  <Loader/> :<>
      <header>
      <button className="btn-back" onClick={onCloseMovie}>&larr;</button>
      <img src={poster} alt={`Poster Of ${movie} Movie`}/>
        <div className="details-overview">
          <h2>{title}</h2>
          <p>{realeased} &bull; {runtime}</p>
          <p>{genre}</p>
          <p><span>⭐</span>{imdbRating} IMDb rating</p>
        </div>
      </header>
      <section>
        <div className="rating">
        { !isWatched ? <> <Star maxRating={10} size={24} onSetRating={setUserRating}/>
        {userRating > 0 && (<button className="btn-add" onClick={handleAdd}>
           + Add to list</button>)}</> : <p>You  rated this movie {watchedUserRating} ⭐</p>}
        </div>
        <p><em>{plot}</em></p>
        <p>Starring {actors}</p>
        <p>Director By {director}</p>
      </section></>}
      
      </div>
  }
function ErrorMessage({message}){
 return <p className="error"><span>⛔</span>{message}</p>
}
function Loader(){
  return <p className="loader">Loading...</p>
}
function Navbar({children}){
  
  return <nav className="nav-bar">
    <Logo/>
 {children}
</nav>
}
function Search({query,setQuery}){
 return <input
    className="search"
    type="text"
    placeholder="Search movies..."
    value={query}
    onChange={(e) => setQuery(e.target.value)}
  />
}
function NumResult({movie}){
  return   <p className="num-results">Found <strong>{movie.length}</strong> results
</p>
}
function Logo(){
  return <div className="logo">
  <span role="img">🍿</span>
  <h1>useMovie</h1>
</div>
}
function Main({children}){
  
  return <main className="main">
        {children}

       
      </main>
}

function WatchList({watched, onDeleteWatched}){

  return <ul className="list">
  {watched.map((movie) => (
    <WatchMovie movie={movie} key={movie.imdbID} onDeleteWatched={onDeleteWatched}/>
  ))}
</ul>
}
function WatchSummary({watched}){
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));
  return <div className="summary">
  <h2>Movies you watched</h2>
  <div>
    <p>
      <span>#️⃣</span>
      <span>{watched.length} movies</span>
    </p>
    <p>
      <span>⭐️</span>
      <span>{avgImdbRating.toFixed(2)}</span>
    </p>
    <p>
      <span>🌟</span>
      <span>{avgUserRating.toFixed(2)}</span>
    </p>
    <p>
      <span>⏳</span>
      <span>{avgRuntime} min</span>
    </p>
  </div>
</div>
}


function Box({children}){
  
  const [isOpen, setIsOpen] = useState(true);
  return <div className="box">
          <button
            className="btn-toggle"
            onClick={() => setIsOpen((open) => !open)}
          >
            {isOpen ? "–" : "+"}
          </button>
          {isOpen && (
            
           children
          )}
        </div>
}
function MovieList({movies,onSelectMovie}){
  return <ul className="list list-movies">
  {movies?.map((movie) => (
      <Movie movie={movie} key={movie.imdbID} onSelectMovie={onSelectMovie}/>
       ))}
       </ul>
}
function Movie({movie,onSelectMovie}){
  return <li  onClick={()=> onSelectMovie(movie.imdbID)}>
  <img src={movie.Poster} alt={`${movie.Title} poster`} />
  <h3>{movie.Title}</h3>
  <div>
    <p>
      <span>🗓</span>
      <span>{movie.Year}</span>
    </p>
  </div>
</li>
}
function WatchMovie({movie ,onDeleteWatched}){
  return <li >
  <img src={movie.poster} alt={`${movie.Title} poster`} />
  <h3>{movie.title}</h3>
  <div>
    <p>
      <span>⭐️</span>
      <span>{movie.imdbRating}</span>
    </p>
    <p>
      <span>🌟</span>
      <span>{movie.userRating}</span>
    </p>
    <p>
      <span>⏳</span>
      <span>{movie.runtime} min</span>
    </p>
    <button onClick={()=> onDeleteWatched(movie.imdbID)} className="btn-delete">X</button>
  </div>
</li>
}
