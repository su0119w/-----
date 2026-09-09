import { useEffect } from "react";
function ArticlesPage(){
    useEffect(()=>{
            document.title="文章"
        },[])
return(
    <main>
        <h1>文章</h1>
    </main>
)
}

export default  ArticlesPage;