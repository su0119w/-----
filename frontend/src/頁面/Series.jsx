import { useEffect } from "react";

function SeriesPage(){
    useEffect(()=>{
        document.title="系列作品"
    },[])
return(
    <main>
        <h1>作品系列</h1>
    </main>
)
}

export default SeriesPage;