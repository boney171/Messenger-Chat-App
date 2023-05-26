

function RegistrationForm() {
    return (
      <div class="registerFormContainer">
        <h4>Register A New Account</h4>
        <form class="registerForm">
        <label class="up">Username</label>
            <input type="text" />
        <label class="up">Password</label>
            <input type="password" />
        <label class="up">Email</label>
            <input type="text" />
        <input type="submit" />
        <button class="haveAccount">Already Have An Account?</button>
      </form>
      </div>
    );
  }
  
  export default RegistrationForm;