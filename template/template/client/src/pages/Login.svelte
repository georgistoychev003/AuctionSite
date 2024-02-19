<script>
    import tokenStore, { setToken } from '../tokenStore.js';
    import page from 'page';

    let email = '';
    let password = '';
    let loginResponse = null;

    const isValidEmail = (email) => {
        //my email validation regex matches strings that follow the general pattern of an email address(with the @ qnnotation).
        const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return pattern.test(email);
    };

    const login = async () => {
        if (!isValidEmail(email) || !password) {
            throw new Error("Invalid email or password");
        }
        try {
            const response = await fetch('http://localhost:3000/tokens', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();

            // Log the response to see if the token is being sent
            console.log("Login Response Data:", data);

            if (response.status === 201 && data.token) {
                setToken(data.token);  // Store the token
                console.log("Token set in store:", $tokenStore);  // Log the token stored in the tokenStore
                await fetchData();

                // Navigate to the home page after successful login
                page('/');
            } else if(!data.token) {
                console.error('Token missing from response:', data);
                throw new Error('Token missing');
            } else {
                throw new Error('Login failed: ' + await response.text());
            }
        } catch(err) {
            throw err;
        }
    };


    const fetchData = async () => {
        const token = $tokenStore;
        try {
            const response = await fetch('http://localhost:3000/tokens', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                console.log("Fetched Data:", data);
            } else {
                console.error('Failed to fetch user data:', await response.text());
            }
        } catch(err) {
            console.error('Error fetching user data:', err.message);
        }
    };



</script>

<div class="auth-container">
    <h2>Login</h2>
    <form>
        <div class="input-group">
            <label for="email">Email</label>
            <input type="email" bind:value={email} id="email" placeholder="Enter your email" required />
        </div>

        <div class="input-group">
            <label for="password">Password</label>
            <input type="password" bind:value={password} id="password" placeholder="Enter your password" required />
        </div>

        {#if loginResponse === null}
            <button on:click|preventDefault={() => loginResponse = login()}>Login</button>
        {:else}
            {#await loginResponse}
            {:then message}
                <p>{message}</p>
                <button on:click|preventDefault={() => loginResponse = null}>Try Again</button>
            {:catch error}
                <p>Error: {error.message}</p>
                <button on:click|preventDefault={() => loginResponse = null}>Try Again</button>
            {/await}
        {/if}
    </form>
</div>



<style>
    main{
        width: 90%;
        height: 90%;
        margin: 5% 5% 5% 5%;
    }
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



