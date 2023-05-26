import './Form.css';

function LoginForm() {
    return (
      <div class="formContainer">
        <form class="loginForm">
        <label class="up">Username</label>
            <input type="text" />
        <label class="up">Password</label>
            <input type="password" />
        <button>Register</button>
        <input type="submit" />
      </form>
      </div>
    );
  }
  
  export default LoginForm;