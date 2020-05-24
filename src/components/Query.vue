<template>
    <div>
        <div class="query">
            <v-row>
                <!-- query -->
                <v-col class="col-query">
                    <v-text-field class="input-query"
                        v-bind:class="{'theme--dark': darkMode}"
                        filled
                        dense
                        autocomplete="off"
                        placeholder="Enter Search Query"
                        v-model="query"
                        v-on:keyup.enter="queryStackExchange"
                        id="input-search"
                        append-icon="mdi-magnify"
                        @click:append="queryStackExchange"
                        >
                    </v-text-field>
                </v-col>
                    <!-- tags -->
                    <v-col class="col-tags">
                        <v-text-field class="input-tags"
                            v-bind:class="{'theme--dark': darkMode}"
                            filled
                            dense
                            autocomplete="off"
                            v-model="tags"
                            v-on:keyup.enter="queryStackExchange"
                            append-icon="mdi-code-tags"
                            placeholder="Enter tags"
                            >
                        </v-text-field>
                </v-col>
                <!-- serach button -->
                <v-col class="col-btn">
                    <v-btn class="search-btn" 
                        dark
                        color="#0077b6"
                        @click="queryStackExchange"
                        >
                        Search
                    </v-btn>
                </v-col>   
            </v-row>
        </div>
        <div>
            <questions :results=results></questions>
        </div>
    </div>
</template>

<script lang="ts">
    import Vue from "vue";
    import Questions from "./Questions.vue";
import { log } from "util";

    const axios = require("axios");

    export default Vue.extend({
        components: {
            Questions,
        },
        props: [
            "query",
            "darkMode"
        ],
        data() {
            return {
                results: [],
                page: 1,
                limit: 5,
                tags: ""
            }
        },
        methods: {
            queryStackExchange() {
                let _this = this;
                var cleanTags = this.tags.trim().replace(new RegExp(" ", "g"), ";").replace(new RegExp(",", "g"), ";");
                
                axios.get(
                        "https://api.stackexchange.com/2.2/search/advanced?order=desc&sort=activity&site=stackoverflow"
                        +"&page="+this.page
                        +"&pagesize="+this.limit
                        +"&q="+this.query
                        +"&tagged="+cleanTags
                    ).then(function (response: any) {
                        _this.results = response.data.items
                    });
            }
        },
        mounted: function(){
            if (this.query != '') {
                this.queryStackExchange();
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

</style>