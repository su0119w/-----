import { useEffect } from "react";
function WorksPage(){
    useEffect(()=>{
        document.title="動畫作品"
    },[])
return(
    <main>
        <h1>作品資訊</h1>
    </main>
)
}

export default WorksPage;