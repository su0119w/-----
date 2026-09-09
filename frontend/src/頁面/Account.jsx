import { useEffect } from "react";
function AccountPage(){
    useEffect(()=>{
            document.title="會員中心"
        },[])
return(
    <main>
        <h1>會員中心</h1>
    </main>
)
}
export default AccountPage;