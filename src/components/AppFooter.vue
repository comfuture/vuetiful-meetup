<template>
  <footer>
    <div class="item">
      Copyright &copy; Vuetiful korea 2018.7 -
    </div>
  </footer>
</template>

<script>
  export default {
    name: 'app-footer'
  }
</script>

<style lang="css">
  footer {
    box-sizing: border-box;
    background-color: #eee;
    border-top: 1px solid #e0e0e0;
    padding: .5em 0;
    display: flex;
    align-items: center;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 65px;
    z-index: 99;
  }

  footer .item {
    margin: .5em;
  }
</style>
