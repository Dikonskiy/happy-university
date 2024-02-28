const Login = () => {
    return (
            <form action="#">
                <div class="input-field">
                    <label for="email">Email address:</label>
                    <input type="email" id="email" name="email" placeholder="Your email"></input>
                </div>
                <div class="input-field">
                    <label for="password">Password:</label>
                    <input type="password" id="password" name="password" placeholder="Password"></input>
                </div>
                <a href="/forgotpassword">Forgot password?</a>
                <button type="submit">Log in</button>
            </form>
    );
}

export default Login;
