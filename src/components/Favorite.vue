<template>
  <div v-if="isFavorite()">
    <v-icon @click="setFavorite()" color="rgb(255,255,0)">mdi-heart</v-icon>
  </div>
  <div v-else>
    <v-icon @click="setFavorite()" color="rgb(211,211,211)">mdi-heart</v-icon>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  props: {
      question_id: Number,
      is_favorite: Boolean,
      vscode: Object
  },
  data() {
      return {
          favorite: false
      }
  },
  methods: {
    isFavorite(): boolean {
        return this.favorite;
    },
    setFavorite() {
      // Send to extension parent window to persist data
      this.vscode.postMessage({ type: 'favorite', text: this.question_id });
      this.favorite = !this.favorite;
    }
  },
  created() {
      //Initialize favorites listing
      this.favorite = this.is_favorite;
  }
})
</script>

<style>
.favorite {
  margin-bottom: 10px;
  border-radius: 3px;
  padding: 2px;
}
</style>