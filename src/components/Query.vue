<template>
  <div>
    <div class="query">
      <v-row>
        <!-- query -->
        <v-col class="col-query">
          <v-text-field
            class="input-query"
            v-bind:class="{ 'theme--dark': darkMode }"
            filled
            dense
            autocomplete="off"
            placeholder="Enter Search Query"
            v-model="query"
            id="input-search"
            append-icon="mdi-magnify"
            @click:append="queryStackExchange"
          ></v-text-field>
        </v-col>
        <!-- tags -->
        <v-col class="col-tags">
          <v-text-field
            class="input-tags"
            v-bind:class="{ 'theme--dark': darkMode }"
            filled
            dense
            autocomplete="off"
            v-model="tags"
            v-on:keyup.enter="queryStackExchange(1)"
            append-icon="mdi-code-tags"
            placeholder="Enter tags"
          ></v-text-field>
        </v-col>
        <!-- filter -->
        <v-col>
          <v-select
            v-model="selectedFilter"
            @change="queryStackExchange(1)"
            v-bind:class="{ 'theme--dark': darkMode }"
            :items="filters"
            filled
            placeholder="Filter by:"
            dense
          ></v-select>
        </v-col>
        <!-- search button -->
        <v-col class="col-btn">
          <v-btn class="search-btn" dark color="#0077b6" @click="queryStackExchange(1)">Search</v-btn>
        </v-col>
      </v-row>
      <!-- pagination -->
      <v-row class="results-pages">
        <v-btn class="p-page-btn" dark color="#0077b6" v-on:click="previous">Previous Page</v-btn>
        <v-btn class="n-page-btn" dark color="#0077b6" v-on:click="next">Next Page</v-btn>
      </v-row>
    </div>
    <div>
      <questions :results="results" :vscode="vscode" :favorites="favorites"></questions>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Questions from "./Questions.vue";

const axios = require("axios");

export default Vue.extend({
  components: {
    Questions
  },
  props: ["query", "darkMode", "favorites"],
  data() {
    return {
      results: [],
      page: 1,
      limit: 5,
      tags: "",
      filters: ["relevance", "votes", "activity", "creation"],
      selectedFilter: "relevance",
      questionBody: null,
      vscode: null
    };
  },
  methods: {
    queryStackExchange(page?: number) {
      this.addQueryToHistory();
      let _this = this;
      //TODO: support specific page calls
      if (page) {
        _this.page = page;
      }
      var cleanTags = this.tags
        .trim()
        .replace(new RegExp(" ", "g"), ";")
        .replace(new RegExp(",", "g"), ";");

      axios
        .get(
          "https://api.stackexchange.com/2.2/search/advanced?order=desc&site=stackoverflow&filter=withbody" +
            "&page=" +
            this.page +
            "&pagesize=" +
            this.limit +
            "&q=" +
            this.query +
            "&tagged=" +
            cleanTags +
            "&sort=" +
            this.selectedFilter
        )
        .then(function(response: any) {
          _this.results = response.data.items;
        });
    },
    next: function() {
      this.page = this.page + 1;
      this.queryStackExchange();
    },
    previous: function() {
      if (this.page > 1) {
        this.page = this.page - 1;
      }
      this.queryStackExchange();
    },
    addQueryToHistory: function() {
      // send text to vscode
      this.vscode.postMessage({ type: "query", text: this.query });
    }
  },
  mounted: function() {
    this.vscode = acquireVsCodeApi();
    if (this.query != "") {
      this.queryStackExchange(1);
    }
  }
});
</script>

<style>
.query {
  margin-top: 5px;
}

.col-query {
  width: 100%;
}

.col-tags {
  width: 100%;
}

.search-btn {
  background-color: white;
}

.n-page-btn {
  position: absolute;
  right: 20px;
}

.p-page-btn {
  position: absolute;
  left: 20px;
}

.results-pages {
  padding-bottom: 50px;
}
</style>
