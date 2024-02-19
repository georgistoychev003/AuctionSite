<script>
    import {onDestroy} from "svelte";
    import jwt_decode from "jwt-decode";
    export let active;
    import tokenStore, { removeToken } from '../tokenStore.js';
    import page from 'page';

    let token = null;
    let isAuthenticated = false;

    let isAdmin = false;


    // Whenever the token updats i check if the user is an admin
    $: if(token) {
        const decodedToken = jwt_decode(token);
        isAdmin = decodedToken?.isAdmin || false;
    }


    // Subscribe to the tokenStore
    const unsubscribe = tokenStore.subscribe(value => {
        token = value;
        isAuthenticated = !!token;
    });

    const handleLogout = () => {
        removeToken();
        // Redirect to the login page after logging out
        page('/login');
    };

    const navigateToLogin = () => {
        page('/login');
    };

    const navigateToRegister = () => {
        page('/register');
    };

    onDestroy(unsubscribe); // Unsubscribe when the component is destroyed
</script>
<!-- I attempted to use bootstrap here but it was too complicated so in the rest of the application i used normal css/>-->
<nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="d-flex flex-column align-items-start">
        <a class="navbar-brand h1" href="/">ArtPickle™</a>
        <div class="subtitle text-light">The only place to bid with confidence</div>
    </div>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse justify-content-between" id="navbarNav">
        <ul class="navbar-nav">
            <li class="nav-item">
                <a class={`nav-link ${active === '/' ? 'active' : ''}`} href="/">Home</a>
            </li>
        </ul>
        <ul class="navbar-nav">
            {#if isAuthenticated}
                {#if !isAdmin}
                    <li class="nav-item">
                        <a class={`nav-link ${active.startsWith('/won') ? 'active' : ''}`} href={`/won/${jwt_decode(token).email}`}>My Won Auctions</a>
                    </li>
                {/if}

                {#if isAdmin}
                    <li class="nav-item">
                        <a class={`nav-link ${active === '/admin' ? 'active' : ''}`} href="/admin">Admin Panel</a>
                    </li>
                {/if}
                <li class="nav-item">
                    <a class="nav-link" href="#" on:click|preventDefault={handleLogout}>Logout</a>
                </li>
            {:else}
                <li class="nav-item">
                    <a class={`nav-link ${active === '/login' ? 'active' : ''}`} href="#" on:click|preventDefault={navigateToLogin}>Login</a>
                </li>
                <li class="nav-item">
                    <a class={`nav-link ${active === '/register' ? 'active' : ''}`} href="#" on:click|preventDefault={navigateToRegister}>Register</a>
                </li>
            {/if}
        </ul>
    </div>
</nav>


<style>
    .subtitle {
        font-size: 0.5rem;
    }
</style>
