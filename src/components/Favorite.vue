<template>
    <div class="favorite">
        <div v-if="isFavorite()">
            <v-btn icon @click="setFavorite()">
                <v-icon color="yellow lighten-2">mdi-heart</v-icon>
            </v-btn>
        </div>
        <div v-else>
            <v-btn icon  @click="setFavorite()">
                <v-icon color="blue-grey darken-2">mdi-heart</v-icon>
            </v-btn>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  props: {
      question_id: Number,
      vscode: Object
  },
  data() {
      return {
          favorite: false
      }
  },
  methods: {
    isFavorite(): boolean {
        return true;
        return this.favorite;
    },
    setFavorite() {
      // Send to extension parent window to persist data
      this.vscode.postMessage({ type: 'favorite', text: this.question_id });

      if (this.isFavorite()) {
          this.favorite = false;
      } else {
        this.favorite = true;
      }
      this.$forceUpdate();
      return;
    }
  },
    mounted() {
      //Initialize favorites listing
      this.favorite = false;
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