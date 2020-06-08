<template>
    <div class="favorite">
        <div v-if="isFavorite()">
            <v-btn icon @click="setFavorite()">
                <v-icon color="yellow">mdi-heart</v-icon>
            </v-btn>
        </div>
        <div v-else>
            <v-btn icon  @click="setFavorite()">
                <v-icon>mdi-heart</v-icon>
            </v-btn>
        </div>
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