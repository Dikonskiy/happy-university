import './css/login.css';

const Login = () => {
    return (
        <div>
            <div class="form-wrapper"> <h1>Log in</h1>
                <form action="#">
                    <div class="input-field">
                        <label for="email">Email address:</label>
                        <input type="email" id="email" name="email" placeholder="Email address"></input>
                    </div>
                    <div class="input-field">
                        <label for="password">Password:</label>
                        <input type="password" id="password" name="password" placeholder="Password"></input>
                    </div>
                    <a href="/forgotpassword">Forgot password?</a>
                    <button type="submit">Log in</button>
                </form>
            </div>
        </div>
    );
}

export default Login;
