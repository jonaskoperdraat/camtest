<template>
  <div>
    <div id="container" class="overlay" v-show="active">
      <div class="overlay-content">
        <canvas ref="canvas"></canvas>
        <video autoplay :src-object.prop.camel="stream"
               @loadedmetadata="loadedMetaData"
               ref="video"></video>
        <div class="preview" v-show="previewing" v-cloak>
          <img id="preview" alt="Camera capture preview"/>
        </div>
        <div class="controls">
          <select v-model="videoDeviceId" @change="showFeed">
            <option v-for="device in videoDevices" v-bind:value="device.deviceId" v-bind:key="device.deviceId">
              {{device.label}}
            </option>
          </select>
          <button @click="capturePreview">Take picture</button>
          <button @click="close" class="close-btn">Close</button>
        </div>
        <div class="stats">
          width: {{stats.width}}<br/>
          height: {{stats.height}}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        active: false,
        stream: null,
        videoDevices: [],
        videoDeviceId: null,
        stats: {
          width: null,
          height: null
        },
        previewing: false
      };
    },
    methods: {
      startCapture() {
        this.active = true;
        const self = this;

        if (navigator.mediaDevices &&
            navigator.mediaDevices.getUserMedia) {
          console.log("UserMedia supported");
        } else {
          console.error("UserMedia NOT supported");
          return;
        }

        console.log("navigator.mediaDevices", navigator.mediaDevices);
        navigator.mediaDevices.enumerateDevices().then(info => {
          console.log('enumerate devices', info);
          self.videoDevices = info.filter(device => device.kind === 'videoinput')
          console.log('available video devices', self.videoDevices);
          self.videoDeviceId = self.videoDevices[0].deviceId;
          console.log('select default device', self.deviceId);
          self.showFeed();
        });
      },
      showFeed() {
        this.stop();
        navigator.mediaDevices
            .getUserMedia(this.getConstraints())
            .then(this.gotMedia)
            .catch((e) => {
              console.log("Error opening media stream", e.message, e.name, e)
            });
      },
      getConstraints() {
        const constraints = {
          // video: true,
          video: {
            deviceId: {exact: this.videoDeviceId}
          },
          audio: false,
        };
        console.log('constraints', constraints);
        return constraints;
      },
      gotMedia(stream) {
        console.log("Opened stream");
        this.stream = stream
      },
      capturePreview() {
        console.log('snap');
        let context = this.$refs.canvas.getContext('2d');
        console.log(context);
      },
      stop() {
        if (this.stream) {
          console.log('Stopping current stream');
          this.stream.getTracks().forEach(track => track.stop());
          this.stream = null;
        }
      },
      close() {
        console.log('close');
        this.active = false;
        stop();
      },
      loadedMetaData(meta) {
        console.log('loadedMetaData', meta);
        this.stats.width = this.$refs.video.videoWidth;
        this.stats.height = this.$refs.video.videoHeight;
      },
    }

  };
</script>

<style scoped lang="scss">
  .overlay {
    height: 100%;
    width: 100%;
    position: fixed;
    z-index: 1;
    top: 0;
    left: 0;
    background-color: rgb(0, 0, 0);
    background-color: rgba(0, 0, 0, 0.9);

    .controls {
      border: 1px solid yellow;
      background-color: rgb(255, 255, 255, .75);
      width: 15%;
      height: 100%;
      position: absolute;
      top: 0;
      right: 0px;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
    }

    .stats {
      position: absolute;
      bottom: 0;
      left: 0;
      background-color: rgb(0, 0, 0, .75);
      color: lime;
      font-family: monospace;
      text-align: left;
    }


    video {
      object-fit: contain;
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
    }

  }

  /*button:hover {*/
  /*  cursor: pointer;*/
    /*cursor: crosshair;*/
  /*}*/


</style>
