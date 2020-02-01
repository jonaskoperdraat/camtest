<template>
  <div id="app">
    <h3>Image capturing</h3>
    <img-capture ref="imgCapture" @photo="addPhoto"></img-capture>
    <button @click="showCapture">Start capture</button>
    <h3>Captured images</h3>
    {{imgs.length === 0 ? '-' : ''}}
    <img v-for="img in imgs" v-bind:src="img.src" v-bind:key="img.key" :alt="img.key">
    <div class="todo">
      <h3>&#9745; Todo</h3>
      <ul>
        <li v-for="task in todo" v-bind:key="task.desc" :class="{done: task.done, current: task.current}">{{task.desc}}</li>
      </ul>
    </div>

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
        todo: [
          {
            desc: 'Access camera device',
            done: true
          },
          {
            desc: 'Capture images',
            done: true
          },
          {
            desc: 'Switch camera input',
            done: true
          },
          {
            desc: 'High res images',
            current: true
          },
          {
            desc: 'Deal with device rotation (looks like there is no rotation?)',
          },
        ],
        imgs: []
      };
    },
    methods: {
      showCapture() {
        console.log("showCapture");
        this.$refs.imgCapture.startCapture();
      },
      addPhoto(data) {
        this.imgs.unshift({key: new Date().toString(), src: data});
      }
    },
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

    ul {
      display: inline-block;
      text-align: left;
      padding: 0;
      margin-top: 0;
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
