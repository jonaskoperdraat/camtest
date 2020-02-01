<template>
  <div id="app">
    <h3>Image capturing</h3>
    <img-capture ref="imgCapture" @photo="addPhoto"></img-capture>
    <button @click="showCapture">Start capture</button>
    <h3>Captured images</h3>
    {{imgs.length === 0 ? '-' : ''}}
    <div class="gallery">
      <div v-for="img in imgs" v-bind:key="img.key">
        <img v-bind:src="img.src" :alt="img.key">
        ({{img.width}} x {{img.height}})
      </div>
    </div>
    <div class="todo">
      <h3>&#9745; Todo</h3>
      <ul>
        <li v-for="task in todo" v-bind:key="task.desc" :class="{done: task.done, current: task.current}">
          {{task.desc}}
        </li>
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
            done: true
          },
          {
            desc: 'Deal with device rotation -> Copying raw stream into canvas seems to take care of the rotation issues.',
            done: true
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
      addPhoto(img) {
        this.imgs.unshift({key: new Date().toString(), ...img});
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

  @media only screen and (min-width: 400px) {
    #app {
      width: 75%;
      margin: 0 auto;
    }
  }

  .todo {
    width: 100%;
    text-align: center;

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

  .gallery {
    width: 100%;

    > div {
      width: 100%;
      object-fit: scale-down;
    }

    img {
      max-width: 100%;
      height: auto;
    }
  }
</style>
