<template>
  <div id="app">
    <h3>Image capturing</h3>
    <img-capture ref="imgCapture"></img-capture>
    <button @click="showCapture">Start capture</button>
    <div class="todo">
      <h3> &#9745; Todo</h3>
      <ul>
        <li class="done">Access camera device</li>
        <li>High res images</li>
        <li class="current">Capture images</li>
        <li>Switch camera input</li>
        <li>Deal with device rotation</li>
      </ul>
    </div>
    <!-- <img v-for="img in imgs" v-bind:src="img.src"> -->
  </div>
</template>

<script>
  import ImgCapture from "./components/ImgCapture.vue";

  export default {
    name: "App",
    components: {
      ImgCapture
    },
    data() {
      return {
        imgs: []
      };
    },
    methods: {
      showCapture() {
        console.log("showCapture");
        this.$refs.imgCapture.startCapture();
      }
    },
    mounted() {
      console.warn("Might want to remove this eventually.");
      this.showCapture();
    }
  };
</script>

<style lang="scss">
  #app {
    font-family: "Avenir", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }

  .todo {
    text-align: center;
    margin: 0 auto;
    border: 1px solid red;

    ul {
      display: inline-block;
      text-align: left;
      padding: 0;
    }

    li {
      list-style-type: none;
    }


    li:before {
      content: '\2610  ';
    }

    li.done:before {
        content: '\2611  ';
    }

    .current {
      color: red;
    }
  }

</style>
