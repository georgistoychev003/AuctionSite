<script>
    import tokenStore, { setToken } from '../tokenStore.js';
    import page from 'page';

    let email = '';
    let password = '';
    let confirmPassword = '';
    let registrationResponse = null;

    const isValidPassword = (password) => {
        const MIN_LENGTH = 8;
        const hasNumber = /\d/.test(password);
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(password);  //i used 2 resouces for this validation here: https://stackoverflow.com/questions/56532904/what-is-the-regex-for-finding-special-characters-and-whitespace-at-the-beginning and also chatgpt to reformat it a bit

        return password.length >= MIN_LENGTH && hasNumber && hasUpperCase && hasLowerCase && hasSpecialChar;
    };

    const register = async () => {
        if(password !== confirmPassword) {
            throw new Error("Passwords do not match!");
        }
        if (!isValidPassword(password)) {
            return "Password must be at least 8 characters, contain an uppercase, a lowercase, a number, and a special character.";
        }
        try {
            const response = await fetch('http://localhost:3000/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();
            if(response.ok) {
                setToken(data.token);  // store the token
                page('/'); // redirect to home page after succesful log in
            } else {
                return 'Registration failed: ' + (data.message || await response.text());
            }
        } catch(err) {
            return 'Error: ' + err.message;
        }
    };
</script>





<div class="auth-container">
    <h2>Register</h2>
    <form>
        <div class="input-group">
            <label for="email">Email</label>
            <input type="email" bind:value={email} id="email" placeholder="Enter your email" required />
        </div>

        <div class="input-group">
            <label for="password">Password</label>
            <input type="password" bind:value={password} id="password" placeholder="Enter your password" required />
        </div>

        <div class="input-group">
            <label for="confirmPassword">Confirm Password</label>
            <input type="password" bind:value={confirmPassword} id="confirmPassword" placeholder="Confirm your password" required />
        </div>

        {#if registrationResponse === null}
            <button on:click|preventDefault={() => registrationResponse = register()}>Register</button>
        {:else}
            {#await registrationResponse}
            {:then message}
                <p>{message}</p>
                <button on:click|preventDefault={() => registrationResponse = register()}>Register</button>
            {:catch error}
                <p>Error: {error.message}</p>
                <button on:click|preventDefault={() => registrationResponse = null}>Try Again</button>
            {/await}
        {/if}
    </form>
</div>

<style>
    .auth-container {
        background-color: var(--secondary-bg);
        color: var(--secondary-txt);
        max-width: 400px;
        margin: 4em auto;
        padding: 2em;
        border: 1px solid var(--highlight);
        border-radius: 10px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }

    h2 {
        text-align: center;
        margin-bottom: 1em;
        color: var(--highlight);
    }

    .input-group {
        margin-bottom: 20px;
    }

    label {
        display: block;
        margin-bottom: 5px;
    }

    input {
        width: 100%;
        padding: 10px;
        border: 1px solid #ddd;
        border-radius: 4px;
    }

    button {
        padding: 10px 15px;
        background-color: #007BFF;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
    }
</style>
