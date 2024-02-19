<script>

  import router from 'page';

  import Home from "./pages/Home.svelte";
  import Header from "./components/Header.svelte";
  import Login from "./pages/Login.svelte";

  import Register from "./pages/Register.svelte";
  import ArtworkDetails from "./pages/ArtworkDetails.svelte";
  import AdminPanel from "./pages/AdminPanel.svelte";
  import WonAuctions from "./pages/WonAuctions.svelte";

  let page;
  let params;
  let currentRoute;

  router('/', (ctx) => {
    page = Home;
    currentRoute = ctx.pathname;
  });

  router('/login', (ctx) => {
    page = Login;
    currentRoute = ctx.pathname;
  });

  router('/register', (ctx) => {
    page = Register;
    currentRoute = ctx.pathname;
  });

  router('/admin', (ctx) => {
    page = AdminPanel;
    currentRoute = ctx.pathname;
  });

  router('/artworkdetails/:id', (ctx) => {
    page = ArtworkDetails;
    currentRoute = ctx.pathname;
    params = ctx.params;
  });

  router('/won/:userEmail', (ctx) => {
    page = WonAuctions;
    currentRoute = ctx.pathname;
    params = ctx.params;
  });




  router.start();
</script>

<svelte:head>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
</svelte:head>

<main>
  <Header active={currentRoute} />
  <div class="content">
    <svelte:component this={page} {params} />
  </div>
</main>
<style>

  :root {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }

  main {
    text-align: center;
    margin: 0 auto;
    position: relative;
  }
</style>