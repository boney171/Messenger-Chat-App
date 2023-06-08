import './css/Verify.css';
import { useState, useEffect } from 'react';
import axios from 'axios';
function Verify(props) {
  const [qrImg, setQrImg] = useState(null);
  const [qrSecret, setQrSecret] = useState(null);
  const [token, setToken] = useState(null);
  useEffect( () => {
    axios.get("http://localhost:3001/api/auth/verify", { withCredentials: true })
      .then(res => {
         console.log(res);
         setQrImg(res.data.qrcode);
         setQrSecret(res.data.secret);
      })
      .catch(err => {
        console.error(err);
      });
  }, []);
  const handleVerification = async (e) =>{
    e.preventDefault();
    const verifyObject = {
        secret: qrSecret,
        token: token,
        user: props.username,
    } 
    try{
        const res = await axios.post("http://localhost:3001/api/auth/verify",verifyObject, { withCredentials: true });
        if(res.data.loggedIn === true){
            console.log(res);
            props.setSessionID(res.user);
            props.onSessionChange();
            props.setVerifyModal(false);
            //window.location.reload(false);
        }else alert(res.data.message);
        
    }catch(error) {
        console.log(error);
    }

  }
  return (
    <div className="Verify">
      <div className="qrPicture">
        <img src={qrImg} />
      </div>
      <form className="VerifyForm" onSubmit={handleVerification}>
            <input type="number"  placeholder="Enter the code from google authenticator app" onChange={e => setToken(e.target.value)}/>
            <input type="submit" value="Verify" />  
      </form>
    </div>

  );
}

export default Verify;