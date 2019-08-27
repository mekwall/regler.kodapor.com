<script>
  import Footer from "../components/Footer.svelte";
</script>

<style>
  main {
    margin: 40px auto 0 auto;
    padding: 20px 40px;
    background: #fff;
    box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.1);
  }

  /* Handheld */
  @media only screen and (max-width: 640px) {
    main {
      margin-top: 0;
      padding: 20px;
      width: 100%;
    }
  }

  /* Lap landscape */
  @media only screen and (min-device-width: 768px) and (max-device-width: 1024px) and (orientation: landscape) {
    main {
      margin-top: 0;
      width: calc(100% - 80px);
    }
  }

  /* Lap */
  @media only screen and (min-width: 961px) {
    main {
      width: 920px;
    }
  }

  /* Desk */
  @media only screen and (min-width: 1281px) {
    main {
      width: 1024px;
    }
  }
</style>

<main>
  <slot />
  <Footer />
</main>
